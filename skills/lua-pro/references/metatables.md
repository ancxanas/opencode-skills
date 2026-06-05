# Metatables & Metamethods

## Fundamentals

Every table can have a metatable — another table that controls its behavior.

```lua
local t = {}
local mt = {}
setmetatable(t, mt)
assert(getmetatable(t) == mt)
```

## Metamethods

### Control

| Metamethod | When Fired |
|------------|------------|
| `__index(table, key)` | Accessing a missing key |
| `__newindex(table, key, value)` | Assigning to a missing key |
| `__mode` | Weak table mode: `"k"`, `"v"`, `"kv"` |
| `__call(table, ...)` | Calling table as a function |
| `__gc(obj)` | Object being garbage collected (5.1+ userdata, 5.2+ tables) |
| `__len(obj)` | `#obj` (5.2+) |
| `__pairs(obj)` | `pairs(obj)` (5.3+) |
| `__ipairs(obj)` | `ipairs(obj)` (5.3+) |
| `__metatable` | Guards `getmetatable`; setting it hides the metatable |
| `__name` | Human-readable name (5.3+) |

### Arithmetic

| Metamethod | Operation |
|------------|-----------|
| `__add(a, b)` | `a + b` |
| `__sub(a, b)` | `a - b` |
| `__mul(a, b)` | `a * b` |
| `__div(a, b)` | `a / b` |
| `__idiv(a, b)` | `a // b` (5.3+) |
| `__mod(a, b)` | `a % b` |
| `__pow(a, b)` | `a ^ b` |
| `__unm(a)` | `-a` |
| `__band(a, b)` | `a & b` (5.3+) |
| `__bor(a, b)` | `a \124 b` (5.3+) |
| `__bxor(a, b)` | `a ~ b` (5.3+) |
| `__bnot(a)` | `~a` (5.3+) |
| `__shl(a, n)` | `a << n` (5.3+) |
| `__shr(a, n)` | `a >> n` (5.3+) |

### Relational

| Metamethod | Operation |
|------------|-----------|
| `__eq(a, b)` | `a == b` (both must share metatable) |
| `__lt(a, b)` | `a < b` |
| `__le(a, b)` | `a <= b` (falls back to `__lt` if absent) |
| `__concat(a, b)` | `a .. b` |

## Common Patterns

### Prototype-based OOP

```lua
local Dog = { breed = "mutt" }
Dog.__index = Dog

function Dog:new(o)
  o = o or {}
  setmetatable(o, self)
  return o
end

function Dog:bark()
  print(self.breed .. " says woof")
end

local fido = Dog:new({ breed = "lab" })
fido:bark()    -- "lab says woof"
```

### Inheritance via `__index` chain

```lua
local Animal = {}
Animal.__index = Animal

function Animal:new(o)
  o = o or {}
  setmetatable(o, self)
  return o
end

function Animal:speak()
  error("abstract method", 2)
end

local Cat = Animal:new({})
Cat.__index = Cat

function Cat:speak()
  return "meow"
end
```

### Default values

```lua
function with_default(t, default)
  return setmetatable(t, { __index = function() return default end })
end
```

### Proxy / forwarding table

```lua
function proxy(target)
  return setmetatable({}, {
    __index = function(_, k) return target[k] end,
    __newindex = function(_, k, v) target[k] = v end,
    __len = function() return #target end,
  })
end
```

### Finalizers (5.2+)

```lua
local mem = {}
setmetatable(mem, {
  __gc = function()
    print("mem table finalized")
  end,
})
mem = nil    -- triggers __gc during next collection
```

## Pitfalls

- `__gc` is only called once per object — no resurrection from finalizers
- `__index` can be a table OR a function; functions get `(table, key)`
- If both operands have `__add`, only the first operand's metatable is consulted
- `__eq` requires both operands to share the same `__eq` metamethod
- `__newindex` fires even if the parent table in `__index` chain has the key
- Avoid infinite recursion in `__index` / `__newindex`: don't index the proxy from within the handler without routing around it
