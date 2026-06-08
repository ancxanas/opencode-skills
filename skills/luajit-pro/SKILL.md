---
title: luajit-pro

name: luajit-pro
description: Use when building performance-critical Lua applications with LuaJIT's FFI, JIT compiler optimizations, and bit operations. Specializes in C foreign function interface bindings, trace compilation tuning, and low-level bit manipulation. Invoke for LuaJIT FFI, JIT compiler, NYI pitfalls, trace compilation, bit operations, Lua performance optimization, or interfacing Lua with C libraries.
license: MIT
compatibility: opencode
metadata:
  author: https://github.com/Jeffallan
  version: "1.1.0"
  domain: language
  triggers: LuaJIT, FFI, JIT compiler, LuaJIT optimization, NYI, trace compilation, Lua bit operations, Lua performance, LuaJIT profiling
  role: specialist
  scope: implementation
  output-format: code
  related-skills: lua-pro, test-master, devops-engineer
  spec-source: http://luajit.org/luajit.html
parent: Languages
nav_order: 8
render_with_liquid: false
---
{% raw %}


# LuaJIT Pro

Performance-critical Lua specialist focused on LuaJIT's FFI, JIT compiler internals, and bit-level operations.

## When to Use This Skill

- Binding C libraries with the FFI (`ffi.cdef`, `ffi.metatype`)
- Optimizing hot paths with JIT compiler hints (`jit.opt`, `jit.flush`)
- Profiling traces and diagnosing NYI (Not Yet Implemented) fallbacks
- Implementing bit-level algorithms with `bit.*`
- Interfacing Lua with C structs, unions, and callbacks
- Porting Lua 5.1 code to LuaJIT or optimizing existing LuaJIT code

## Core Workflow

1. **Identify hot paths** — Use `jit.v` or `jit.dump` to locate trace-compiled vs. interpreted loops
2. **Evaluate FFI vs. C API** — Prefer FFI for direct C bindings; use Lua C API for complex lifecycle
3. **Write FFI bindings** — Declare `ffi.cdef`, create C types, manage memory
4. **Optimize traces** — Restructure code to avoid NYI calls within loops; use `jit.opt.start` for tuning
5. **Profile** — Run with `-jv` (verbose) or `-jdump` to inspect trace generation
6. **Test** — Verify correctness across LuaJIT, PUC Lua 5.1, and different architectures

## Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| FFI | `references/ffi.md` | C bindings, `ffi.new`, `ffi.cast`, `ffi.metatype`, callbacks |
| JIT Optimization | `references/jit-optimization.md` | Trace compilation, NYI, `jit.opt`, `jit.flush`, profiling |
| Bit Library | `references/bit-library.md` | `bit.band`, `bit.bor`, `bit.lshift`, bit manipulations |

## Code Examples

```lua
-- FFI: bind libc's printf and call it
local ffi = require("ffi")
ffi.cdef[[
  int printf(const char *fmt, ...);
  double sqrt(double x);
]]
ffi.C.printf("sqrt(%d) = %.2f\n", 2, ffi.C.sqrt(2))

-- FFI: C struct with metatype
ffi.cdef[[
  typedef struct { double x, y, z; } vec3_t;
]]
local vec3 = ffi.metatype("vec3_t", {
  __add = function(a, b)
    return vec3(a.x + b.x, a.y + b.y, a.z + b.z)
  end,
  __tostring = function(v)
    return string.format("(%.2f, %.2f, %.2f)", v.x, v.y, v.z)
  end,
})

local a = vec3(1, 2, 3)
local b = vec3(4, 5, 6)
print(a + b)  -- (5.00, 7.00, 9.00)

-- Bit library
local bit = require("bit")
local flags = bit.bor(0x01, 0x04)
assert(bit.band(flags, 0x01) ~= 0)  -- true
assert(bit.band(flags, 0x02) == 0)  -- true

-- JIT control
jit.opt.start("maxmcode=4096")     -- increase code cache
jit.opt.start("sizemcode=64")       -- size of each mcode chunk
-- jit.off() to disable JIT for debugging
-- jit.on() to re-enable
```

## Constraints

### MUST DO
- Use `require("ffi")` instead of `require("luajit")` for FFI code
- Group `ffi.cdef` declarations at module load time (not inside hot loops)
- Prefer `ffi.new` over `ffi.C.malloc` + manual free for most allocations
- Use `ffi.gc` on manually allocated memory to prevent leaks
- Restructure hot loops to avoid NYI calls (table accesses inside loops are fine; `pairs` inside loops is not)
- Use `jit.opt.start` before the hot code path runs
- Profile with `jit.v` in development to identify NYI fallbacks
- Use `bit` library instead of Lua arithmetic for bitwise operations (even on Lua 5.3+)

### MUST NOT DO
- Use `pairs`/`ipairs` inside hot inner loops (prevents trace compilation)
- Allocate FFI objects inside hot paths without thought to GC pressure
- Rely on exact JIT trace generation across architectures (x86 vs ARM vs MIPS vary)
- Mix `ffi.string` with C strings that have no null terminator
- Assume `ffi.typeof` returns identical types across modules without caching
- Use `ffi.copy` on overlapping memory regions
- Assume `jit.dump` output is stable across LuaJIT versions

## Output Templates

When implementing LuaJIT features, provide:
1. FFI declaration block with `ffi.cdef` at module scope
2. C type definitions and `ffi.metatype` definitions
3. Hot path implementation with JIT-aware structure
4. Profiling setup instructions (`jit.v` / `jit.dump` flags)
5. Bit operation implementation where applicable
6. Validation against both LuaJIT and PUC Lua 5.1 for compatibility

## Knowledge Reference

LuaJIT, FFI, `ffi.cdef`, `ffi.new`, `ffi.metatype`, `ffi.gc`, `ffi.string`, `ffi.copy`, `ffi.cast`, `ffi.typeof`, `ffi.sizeof`, JIT compiler, trace compilation, NYI, `jit.opt`, `jit.flush`, `jit.on`/`jit.off`, `jit.v`, `jit.dump`, `jit.prng`, `bit.band`, `bit.bor`, `bit.bxor`, `bit.lshift`, `bit.rshift`, `bit.arshift`, `bit.rol`, `bit.ror`, `bit.bswap`, `bit.tobit`, `bit.tohex`, `jit.prngstate`, mcode, SSA IR, DynASM

{% endraw %}
