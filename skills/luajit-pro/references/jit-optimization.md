# JIT Optimization

## JIT Compiler Overview

LuaJIT uses a trace-based JIT compiler. Hot loops are recorded as traces, compiled to machine code, and then executed natively.

## Key Concepts

- **Trace** — A recorded linear path through a loop (no side exits recorded within a trace)
- **Side exit** — When runtime behavior diverges from the recorded trace (e.g., type change); falls back to interpreter
- **NYI** — "Not Yet Implemented": a bytecode that cannot be recorded and forces interpreter fallback
- **mcode** — Machine code generated from traces
- **Snapshot** — Saved state needed to restore interpreter state on side exit

## Checking JIT Status

```bash
# Verbose mode: prints trace events
luajit -jv script.lua

# Dump mode: prints IR and mcode
luajit -jdump script.lua

# Off (for baseline comparison)
luajit -joff script.lua

# Control from within code
jit.on()      -- enable JIT
jit.off()     -- disable JIT
```

## NYI: Common Pitfalls

### Always NYI (cannot be traced)

- `pairs()` / `ipairs()` — use numeric `for` loops instead
- `string.gmatch()` / `string.gsub()` with patterns
- `load()` / `dofile()` / `require()`
- `pcall()` / `xpcall()` — restructure with error return patterns
- `debug.*` functions
- `coroutine.*` functions
- `io.*`, `os.*` operations
- `math.random()` / `math.randomseed()`
- `ffi.C.printf` (vararg C functions)
- `setmetatable()` / `getmetatable()` / `rawget()` / `rawset()` / `rawequal()`
- `collectgarbage()`
- `error()` / `assert()` (when they trigger)
- `type()` / `select()` / `unpack()`

### Conditionally traced

- `table.insert()` / `table.remove()` — traced up to LuaJIT 2.1
- `table.sort()` — not traced (use custom sort in hot paths)
- `string.byte()` / `string.char()` — traced in simple cases
- `string.sub()` — traced
- `string.find()` with literal strings (no patterns) — traced

## Optimization Strategies

### 1. Replace NYI calls in hot loops

```lua
-- BAD: pairs inside hot loop forces interpreter
for k, v in pairs(t) do process(k, v) end

-- GOOD: numeric for or while with next
for i = 1, #t do process(i, t[i]) end

-- or with explicit key iteration
local k = nil
while true do
  k = next(t, k)
  if k == nil then break end
  process(k, t[k])
end
```

### 2. Type stability

```lua
-- BAD: changing type of variable inside loop kills trace
local x = 0
for i = 1, 1000 do
  x = x + i       -- always integer
end
x = x + "hello"   -- side exit when type changes to string

-- GOOD: keep types consistent within traced loops
```

### 3. Minimize table allocations

```lua
-- BAD: allocates new table each iteration
local result = {}
for i = 1, 10000 do
  result[i] = { value = i }
end

-- GOOD: pre-allocate and reuse
local result = {}
for i = 1, 10000 do
  result[i] = ffi.new("struct { int value; }")
  result[i].value = i
end
```

### 4. JIT Control Functions

```lua
jit.opt.start("maxmcode=4096")    -- max total mcode (KB)
jit.opt.start("sizemcode=64")     -- size of each mcode block
jit.opt.start("maxtrace=2000")    -- max traces before flushing
jit.opt.start("maxrecord=4000")   -- max IR slots per trace
jit.opt.start("maxirconst=500")   -- max IR constants per trace

jit.flush()                       -- flush all traces
jit.flush(func)                   -- flush traces for a specific function
```

## Profiling

### `jit.v` verbose output legend

```
[TRACE   1 myfile.lua:42 loop]    -- trace 1 started at line 42
[TRACE   1 myfile.lua:45 exit]    -- side exit at line 45
[TRACE   2 myfile.lua:42 guard]   -- trace 2 started (branch from another trace)
[TRACE   3 myfile.lua:42 ---]     -- trace aborted (NYI hit)
[TRACE   4 myfile.lua:42 stop]    -- trace completed and compiled
```

### Interpreting `jit.dump` output

- **IR (Intermediate Representation)** — SSA-based IR listing
- **mcode** — Generated machine code
- **snapshot** — State snapshots for side exits
- **abort** — Reason trace recording was aborted

### Using `jit.prng` (LuaJIT 2.1+)

```lua
jit.prng("seed")    -- seed the PRNG for reproducible JIT behavior
```

## Common Performance Patterns

| Pattern | Performance | Notes |
|---------|-------------|-------|
| Numeric `for` | JIT-traced | Preferred loop construct |
| `while` with `next` | JIT-traced | Good for dict iteration |
| `ipairs` | NYI | Use numeric `for` |
| `pairs` | NYI | Use `next` manual loop |
| FFI struct field access | Direct memory (fast) | Excellent in traces |
| Lua table access | Fast in traces | Monomorphic is best |
| Callback creation | Slow (trampoline) | Cache once, reuse |
| Vararg C calls | NYI | Use fixed-arg FFI bindings |
| Raw Lua arithmetic | JIT-compiled | Very fast |
| String concat (`..`) | Fast in traces | Small strings optimized |
| `string.sub` (simple) | Traced | Avoid patterns |

## Architecture Notes

- x86/x64: best JIT coverage, most NYI resolved
- ARM: good coverage, some NYI differences
- ARM64 (M1+): experimental, fewer optimizations
- MIPS: limited JIT support
- PPC: limited JIT support

Run `luajit -jv` on your target architecture during development to identify architecture-specific NYI issues.
