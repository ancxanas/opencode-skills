# Lua Modules

## Module Resolution

`require("modname")` searches `package.searchers` (5.2+) / `package.loaders` (5.1):

1. **Preloader** — Check `package.preload["modname"]`
2. **Lua loader** — Search `package.path` for `modname.lua`
3. **C loader** — Search `package.cpath` for `modname.so` (or `.dll`)
4. **All-in-one** — 5.1 only: searches for C library that registers `luaopen_modname`

```lua
-- package.path pattern (semicolon-separated)
local path = "./?.lua;./?/init.lua;/usr/share/lua/5.4/?.lua"
```

## Module Definition Patterns

### Returning a table (standard, Lua 5.1+)

```lua
-- mylib.lua
local M = {}

local function private_helper()
  return 42
end

function M.public_func()
  return private_helper()
end

return M
```

Usage: `local mylib = require("mylib")`

### Module function (Lua 5.1 style, deprecated in 5.2+)

```lua
module("mylib", package.seeall)
function public_func() end
```

Avoid in new code; removed in Lua 5.3+.

### Environment-based (Lua 5.2+ with `_ENV`)

```lua
-- mylib.lua
local M = {}
_ENV = M

function public_func()
  return 42
end

return M
```

## Luarocks

```bash
# Install
luarocks install lua-cjson

# Search
luarocks search lua-cjson

# Build a rockspec
luarocks make

# Generate a new rockspec
luarocks newrock --lua-version=5.4
```

Sample `.rockspec`:

```lua
package = "my-lib"
version = "1.0-1"
source = { url = "https://github.com/user/my-lib/archive/v1.0.tar.gz" }
description = {
  summary = "A useful Lua library",
  license = "MIT",
}
dependencies = {
  "lua >= 5.1",
}
build = {
  type = "builtin",
  modules = {
    ["my-lib"] = "src/my-lib.lua",
  },
}
```

## require C libraries via FFI (LuaJIT)

```lua
local ffi = require("ffi")
ffi.cdef[[
  int printf(const char *fmt, ...);
]]
ffi.C.printf("hello %s\n", "world")
```

## Best Practices

- Keep modules focused — one responsibility per file
- Return a single table; do not pollute the global table
- Use `local` for internal functions; expose only the API table entries
- Hoist expensive lookups at module load: `local sort = table.sort`
- Use `require` only at the top level, never inside hot paths
- Cache `require` results (it already deduplicates, but call once)
- Use environment separation to protect the module table from accidental globals
