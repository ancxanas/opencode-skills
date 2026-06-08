------
{% raw %}
----|-----------|---------|
| `bit.band(x, y)` | Bitwise AND | `bit.band(0x3, 0x6)` → `0x2` |
| `bit.bor(x, y)` | Bitwise OR | `bit.bor(0x3, 0x6)` → `0x7` |
| `bit.bxor(x, y)` | Bitwise XOR | `bit.bxor(0x3, 0x6)` → `0x5` |
| `bit.bnot(x)` | Bitwise NOT | `bit.bnot(0x1)` → `0xFFFFFFFFFFFFFFFE` |

### Shifts

| Function | Operation | Example |
|----------|-----------|---------|
| `bit.lshift(x, n)` | Logical left shift | `bit.lshift(1, 3)` → `8` |
| `bit.rshift(x, n)` | Logical right shift | `bit.rshift(8, 3)` → `1` |
| `bit.arshift(x, n)` | Arithmetic right shift | `bit.arshift(-8, 3)` → `-1` |

### Rotates

| Function | Operation | Example |
|----------|-----------|---------|
| `bit.rol(x, n)` | Rotate left | `bit.rol(0x80000001, 1)` → `0x00000003` |
| `bit.ror(x, n)` | Rotate right | `bit.ror(0x80000001, 1)` → `0xC0000000` |

### Conversion

| Function | Operation | Example |
|----------|-----------|---------|
| `bit.tobit(x)` | Convert to 32-bit signed integer | `bit.tobit(0xFFFFFFFF)` → `-1` |
| `bit.tohex(x, n)` | Convert to hex string | `bit.tohex(255)` → `"000000ff"` |

## Common Patterns

### Flag tests

```lua
local READ  = 0x01
local WRITE = 0x02
local EXEC  = 0x04

local perms = bit.bor(READ, EXEC)
assert(bit.band(perms, READ) ~= 0)   -- true
assert(bit.band(perms, WRITE) == 0)  -- false
```

### Bit field extraction

```lua
-- Extract bits 4-7 (mask, shift)
local value = 0xAB
local field = bit.band(bit.rshift(value, 4), 0xF)   -- 0xA
```

### Color packing

```lua
-- RGBA to 32-bit integer
local function rgba(r, g, b, a)
  return bit.bor(
    bit.lshift(r, 24),
    bit.lshift(g, 16),
    bit.lshift(b, 8),
    a
  )
end

-- 32-bit integer to RGBA
local function unpack_rgba(c)
  local r = bit.band(bit.rshift(c, 24), 0xFF)
  local g = bit.band(bit.rshift(c, 16), 0xFF)
  local b = bit.band(bit.rshift(c, 8), 0xFF)
  local a = bit.band(c, 0xFF)
  return r, g, b, a
end
```

### 32-bit unsigned semantics

```lua
-- LuaJIT's bit library operates on 32-bit signed integers
-- bit.tobit clamps to 32-bit signed range [-2^31, 2^31-1]
local u32 = bit.tobit(0xFFFFFFFF)     -- -1 (as signed)
local h = bit.tohex(u32)              -- "ffffffff" (as hex)
```

### Endianness

```lua
-- Byteswap
local function bswap32(x)
  return bit.bor(
    bit.lshift(bit.band(x, 0xFF), 24),
    bit.lshift(bit.band(x, 0xFF00), 8),
    bit.rshift(bit.band(x, 0xFF0000), 8),
    bit.rshift(bit.band(x, 0xFF000000), 24)
  )
end

-- Or use bit.bswap (LuaJIT 2.1+)
-- bit.bswap(0x12345678) -> 0x78563412
```

## Performance

- All `bit.*` functions are inlined by the JIT compiler as x86/ARM machine instructions
- Zero overhead when inside JIT traces
- Use `bit.band` / `bit.bor` for flag checks even if you could use arithmetic — they produce single machine instructions
- Avoid `bit.tohex` in hot paths (it allocates a string)
- `bit.bswap` (if available) is faster than manual byteswap
{% endraw %}
