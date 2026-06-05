# LuaJIT FFI

## Overview

The FFI library allows calling C functions and using C data structures directly from Lua, without writing C wrapper code.

```lua
local ffi = require("ffi")
```

## Declaring C Bindings

```lua
ffi.cdef[[
  // C declarations — regular C syntax
  int printf(const char *fmt, ...);
  double sqrt(double x);
  void *malloc(size_t size);
  void free(void *ptr);

  // Structs, unions, enums
  typedef struct {
    int x, y;
  } point_t;

  typedef union {
    int i;
    float f;
  } int_or_float_t;

  enum { RED, GREEN, BLUE };
]]
```

## Accessing C Functions

```lua
-- Standard C library (pre-declared as ffi.C)
ffi.C.printf("hello %s\n", "world")
ffi.C.sqrt(2.0)

-- Other libraries loaded manually
local lib = ffi.load("mylib")             -- default search path
local lib = ffi.load("mylib", true)       -- global namespace
local result = lib.my_function(42)
```

## Working with C Types

### Creating objects

```lua
-- Single value
local p = ffi.new("point_t")
p.x = 10
p.y = 20

-- Array
local arr = ffi.new("int[10]")
for i = 0, 9 do arr[i] = i end

-- Initialized
local p2 = ffi.new("point_t", { x = 1, y = 2 })
local p3 = ffi.new("point_t", 3, 4)       -- positional

-- Nested
local rect = ffi.new("struct { point_t a; point_t b; }")
```

### Type objects

```lua
local point_type = ffi.typeof("point_t")
local p = point_type(1, 2)

-- Cache type objects outside hot loops for performance
local int_type = ffi.typeof("int")
```

### Casting

```lua
local ptr = ffi.cast("void *", p)
local bp = ffi.cast("point_t *", ptr)
```

### Size and offsets

```lua
ffi.sizeof("point_t")            -- size in bytes
ffi.offsetof("point_t", "y")    -- byte offset of field
ffi.alignof("point_t")          -- alignment (LuaJIT 2.1+)
```

## Memory Management

```lua
-- Automatic (GC-managed, via ffi.new)
local p = ffi.new("point_t")
-- freed automatically when no longer referenced

-- Manual (malloc)
local ptr = ffi.C.malloc(ffi.sizeof("point_t"))
ffi.gc(ptr, ffi.C.free)         -- attach finalizer
local p = ffi.cast("point_t *", ptr)
-- freed when ptr is collected (or call ffi.C.free(ptr) explicitly)

-- Allocate zeroed
local buf = ffi.new("char[?]", 1024)      -- "?" size parameter
```

## Strings

```lua
-- C string -> Lua string
local s = ffi.string(c_str)                -- up to null terminator
local s = ffi.string(c_str, n)            -- exact n bytes

-- Lua string -> C (automatic conversion at FFI call sites)
-- Passed as "const char *"
ffi.C.printf("%s", "hello")               -- auto-converted

-- Explicit temporary buffer
local buf = ffi.new("char[?]", 256)
ffi.C.strcpy(buf, "hello")
```

## Callbacks

```lua
-- Declare callback type
ffi.cdef[[
  typedef int (*cmp_func)(const void *, const void *);
  void qsort(void *base, size_t nmemb, size_t size, cmp_func cmp);
]]

-- Create callback from Lua function (expensive: cache it)
local cmp = ffi.cast("cmp_func", function(a, b)
  return ffi.cast("int *", a)[0] - ffi.cast("int *", b)[0]
end)

local arr = ffi.new("int[?]", { 3, 1, 4, 1, 5 }, 5)
ffi.C.qsort(arr, 5, ffi.sizeof("int"), cmp)
```

**Note:** Callbacks are expensive to create (trampoline generation). Cache them when used repeatedly.

## Metatypes (OOP for C types)

```lua
ffi.cdef[[
  typedef struct { double x, y; } vec2_t;
]]

local vec2 = ffi.metatype("vec2_t", {
  __add = function(a, b)
    return vec2(a.x + b.x, a.y + b.y)
  end,
  __sub = function(a, b)
    return vec2(a.x - b.x, a.y - b.y)
  end,
  __mul = function(a, b)
    return vec2(a.x * b, a.y * b)  -- scalar * scale
  end,
  __len = function(v)
    return math.sqrt(v.x * v.x + v.y * v.y)
  end,
  __tostring = function(v)
    return string.format("(%.2f, %.2f)", v.x, v.y)
  end,
})

local v = vec2(3, 4)
print(v * 2)    -- (6.00, 8.00)
print(#v)       -- 5
```

## Performance Considerations

- `ffi.new` is faster than `ffi.C.malloc` + `ffi.gc` for most cases
- Cache `ffi.typeof` results in local variables
- Avoid creating FFI objects inside tight loops (allocate once, mutate)
- Callback creation is very expensive — cache the `ffi.cast("callback_type", fn)` result
- Access to FFI struct fields compiles to direct memory access — very fast in JIT traces
- `ffi.string` copies data; use pointer arithmetic for read-only access in hot paths
- Avoid `...` (vararg) C functions in hot paths — they force interpreter fallback
