# Coroutines

## Core API

All functions in the `coroutine` table:

| Function | Purpose |
|----------|---------|
| `coroutine.create(f)` | Create a suspended coroutine (thread) |
| `coroutine.resume(co, ...)` | Start or resume a coroutine; returns status + yields |
| `coroutine.yield(...)` | Suspend the current coroutine, pass values to `resume` |
| `coroutine.status(co)` | `"suspended"`, `"running"`, `"normal"`, `"dead"` |
| `coroutine.wrap(f)` | Returns a function that resumes the coroutine each call |
| `coroutine.running()` | Returns the running coroutine + whether it's the main thread |
| `coroutine.isyieldable()` | Whether the coroutine can yield (5.3+) |

## Basic Lifecycle

```lua
local co = coroutine.create(function()
  for i = 1, 3 do
    print("coroutine: " .. i)
    coroutine.yield(i * 10)
  end
  return "done"
end)

-- First resume: runs until first yield
local ok, val = coroutine.resume(co)   -- ok = true, val = 10
-- Second resume: continues to next yield
local ok, val = coroutine.resume(co)   -- ok = true, val = 20
-- Third resume: continues to final return
local ok, val = coroutine.resume(co)   -- ok = true, val = "done"
-- Fourth resume: dead coroutine
local ok, err = coroutine.resume(co)   -- ok = false, err = "cannot resume dead coroutine"
```

## Producer Pattern

```lua
local function producer(max)
  return coroutine.wrap(function()
    for i = 1, max do
      coroutine.yield(i)
    end
  end)
end

local numbers = producer(5)
for num in numbers do
  print(num)  -- 1, 2, 3, 4, 5
end
```

## Consumer-Producer (bidirectional)

```lua
local function filter(source, pred)
  return coroutine.wrap(function()
    for val in source do
      if pred(val) then
        coroutine.yield(val)
      end
    end
  end)
end

local numbers = producer(10)
local evens = filter(numbers, function(x) return x % 2 == 0 end)
for n in evens do print(n) end  -- 2, 4, 6, 8, 10
```

## Async Emulation

```lua
local function async_sleep(seconds)
  -- In real Lua, this blocks; in LuaJIT with FFI you could yield
  -- For illustration, assumes a scheduler exists.
  return coroutine.yield(seconds)
end

local function async_task(name)
  print(name .. " started")
  async_sleep(1)
  print(name .. " resumed after 1s")
  async_sleep(2)
  print(name .. " done")
end

-- Scheduler
local tasks = {
  coroutine.create(function() async_task("A") end),
  coroutine.create(function() async_task("B") end),
}

while #tasks > 0 do
  for i = #tasks, 1, -1 do
    local ok = coroutine.resume(tasks[i])
    if not ok or coroutine.status(tasks[i]) == "dead" then
      table.remove(tasks, i)
    end
  end
end
```

## Important Rules (5.3+)

- **Cannot yield across a C boundary** — error if trying to yield from a hook, `__gc`, `__tostring`, `pairs` metamethod, or `string.gmatch`
- `coroutine.isyieldable()` checks this at runtime
- Lua 5.4 relaxed some restrictions (`__close` metamethod interacts with coroutines)
- Values passed to `resume` become return values of `yield`:

```lua
local co = coroutine.create(function()
  local val = coroutine.yield("from co")
  return "received: " .. val
end)
coroutine.resume(co)                 -- true, "from co"
coroutine.resume(co, "hello")        -- true, "received: hello"
```

## Differences Across Versions

- Lua 5.1–5.2: `coroutine.running()` returns the coroutine only (or nil for main)
- Lua 5.3+: `coroutine.running()` returns the coroutine + boolean (main thread check)
- Lua 5.4: `coroutine.close(co)` closes a coroutine (calls `__close` methods)
- LuaJIT: matches Lua 5.1 semantics; TValue stacks are less forgiving on deep yield chains
