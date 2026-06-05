# Lua Types & Tables

## Dynamic Types

Lua is dynamically typed. The eight base types:

| Type | Example | Notes |
|------|---------|-------|
| `nil` | `nil` | Absence of value; frees table keys |
| `boolean` | `true`, `false` | Only `false` and `nil` are falsy |
| `number` | `42`, `3.14` | All numbers are floats in 5.1–5.2; 5.3+ adds integers |
| `string` | `"hello"` | Immutable, 8-bit clean, interned |
| `table` | `{1, 2, 3}` | Associative arrays; both array and hash |
| `function` | `function() end` | First-class; closures capture locals |
| `userdata` | — | C data opaque to Lua; full (heap) or light (pointer) |
| `thread` | — | Independent coroutine stack |

## Table Construction

```lua
-- Array part (1-indexed consecutive keys)
local arr = { "a", "b", "c" }    -- arr[1] = "a", arr[2] = "b"

-- Hash part (explicit keys)
local dict = { x = 1, y = 2 }    -- dict["x"] = 1

-- Mixed
local mixed = {
  "first",
  "second",
  key = "value",
  [true] = "boolean key",
}                                 -- mixed[1] = "first", mixed.key = "value"

-- Nested
local matrix = { { 1, 2 }, { 3, 4 } }
```

### Array vs Hash

- Table internals choose array/hash representation automatically
- `#` length operator works only on the array part (contiguous integer keys from 1)
- Do not use `#` on tables with nil holes: `{1, nil, 3}` — `#` is undefined

### Getting the length reliably

```lua
-- Length of array part (holes = undefined)
local count = #arr

-- Length of hash part: iterate
local n = 0
for _ in pairs(dict) do n = n + 1 end
```

## Weak Tables

Controlled via `__mode` metatable field:

```lua
-- Weak keys: values are held, keys are collected
local weak = setmetatable({}, { __mode = "k" })

-- Weak values: keys hold, values are collected
local valweak = setmetatable({}, { __mode = "v" })

-- Both
local both = setmetatable({}, { __mode = "kv" })
```

Used for: caches, observer patterns, associating metadata with live objects.

## Immutable Tables via Proxy

```lua
function readonly(t)
  local proxy = {}
  local mt = {
    __index = t,
    __newindex = function()
      error("table is read-only", 2)
    end,
    __pairs = function() return pairs(t) end,
  }
  return setmetatable(proxy, mt)
end
```

## Performance Notes

- Local references beat global lookups: `local tinsert = table.insert`
- Table access is hash lookup; chain lookups (`a.b.c.d`) are multiple lookups
- Pre-fill table size hint: Lua 5.2+ ignores size hints; for large tables, fill sequentially
- Avoid sparse table growth: allocate contiguous, resize only when needed
- `table.remove` on large arrays is O(n) — shift cost grows with size
