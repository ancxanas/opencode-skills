# Standard Library Reference

## String Library

```lua
-- Basic operations
string.len(s)         -- #s
string.sub(s, i, j)   -- substring (1-indexed, inclusive)
string.rep(s, n)      -- repeat
string.reverse(s)     -- "abc" -> "cba"
string.lower(s)
string.upper(s)
string.byte(s, i)     -- character code
string.char(...)      -- codes -> string (e.g., 65, 66 -> "AB")

-- Pattern matching
string.find(s, pattern, init, plain)     -- start, end indices (or nil)
string.match(s, pattern, init)           -- captures
string.gmatch(s, pattern)                -- iterator
string.gsub(s, pattern, repl, n)         -- count, replaced string

-- Format
string.format(fmt, ...)                  -- C-style printf formatting
```

### Pattern Quick Reference

| Pattern | Meaning |
|---------|---------|
| `.` | any character |
| `%a` | letters |
| `%d` | digits |
| `%s` | whitespace |
| `%l` | lower-case |
| `%u` | upper-case |
| `%p` | punctuation |
| `%w` | alphanumeric |
| `%x` | hex digits |
| `%c` | control chars |
| `%z` | null byte |
| `%1`–`%9` | capture back-reference |
| `%b()` | balanced parentheses |
| `^` | anchor start |
| `$` | anchor end |
| `(...)` | capture group |

## Table Library

```lua
table.insert(t, pos, value)     -- insert (pos optional, defaults to end)
table.remove(t, pos)            -- remove and return (pos defaults to last)
table.sort(t, comp)             -- in-place sort, stable since Lua 5.3
table.concat(t, sep, i, j)     -- join array part into string
table.move(a1, f, e, t, a2)    -- move elements between tables (5.3+)
table.foreachi(t, f)           -- iterate integer keys only (deprecated)
table.foreach(t, f)            -- iterate all (deprecated; use pairs)
table.pack(...)                -- `{...}; n = #args` (5.2+)
table.unpack(t, i, j)          -- elements as multiple returns
```

## Math Library

```lua
math.abs math.acos math.asin math.atan math.atan2
math.ceil math.cos math.cosh math.deg math.exp
math.floor math.fmod math.huge math.log math.log10
math.max math.min math.modf math.pi math.pow
math.rad math.random math.randomseed math.sin math.sinh
math.sqrt math.tan math.tanh math.type    -- 5.3+: returns "integer" or "float"

math.tointeger(x)  -- 5.3+: convert to integer or nil
math.ult(a, b)     -- 5.3+: unsigned less-than for integers
```

## I/O Library

```lua
-- Simple I/O (implicit file handle)
io.open(filename, mode)          -- returns file handle or nil, err
io.input(file)                   -- set default input file
io.output(file)                  -- set default output file
io.lines(filename, ...)          -- iterator over lines
io.read(...)                     -- read from default input
io.write(...)                    -- write to default output
io.tmpfile()                     -- temporary file (closed on program exit)

-- File handle methods
file:read(...)                   -- "n", "a", "l", number; "l" is default
file:write(...)                  -- write strings/numbers
file:lines(...)                  -- iterator
file:seek(whence, offset)        -- whence: "set", "cur", "end"
file:setvbuf(mode, size)         -- "no", "full", "line"
file:flush()                     -- flush buffers
file:close()                     -- close handle
```

## OS Library

```lua
os.clock()           -- CPU time in seconds
os.date(format, t)   -- format time table or string
os.difftime(t2, t1)  -- difference in seconds
os.execute(cmd)      -- shell command; returns status, exit code, signal
os.exit(code, close) -- terminate program
os.getenv(varname)   -- environment variable value (or nil)
os.remove(filename)  -- delete file
os.rename(old, new)  -- rename file
os.tempname()        -- temporary file name (not guaranteed unique)
os.time(table)       -- epoch time (seconds); table is optional
```

### `os.date` format string (same as C `strftime`)

```lua
os.date("%Y-%m-%d %H:%M:%S")  -- "2025-06-05 14:30:00"
os.date("*t")                  -- { year=2025, month=6, day=5, ... }
os.date("!%Y-%m-%d")           -- UTC time with "!" prefix
```

## Debug Library

```lua
debug.debug()                    -- interactive debugger prompt
debug.getinfo(f)                 -- function info (source, linedefined, etc.)
debug.getlocal(f, local_index)   -- local variable name and value
debug.getmetatable(value)
debug.getregistry()              -- registry table
debug.getupvalue(f, up_index)    -- upvalue name and value
debug.setlocal(f, local_index, value)
debug.setmetatable(value, mt)
debug.setupvalue(f, up_index, value)
debug.traceback(msg, level)      -- stack trace string
debug.getuservalue(u, n)         -- userdata associated values (5.3+)
debug.setuservalue(u, n, v)      -- set userdata value (5.3+)
```

## UTF-8 Library (Lua 5.3+)

```lua
utf8.char(...)                    -- codepoints -> UTF-8 string
utf8.charpattern                  -- "[\0-\x7F\xC2-\xF4][\x80-\xBF]*"
utf8.codes(s)                     -- iterator: pos, codepoint
utf8.codepoint(s, i, j)          -- codepoint at position
utf8.len(s, i, j)                 -- number of UTF-8 characters (or nil + pos)
utf8.offset(s, n, i)              -- byte position of nth UTF-8 character
utf8.match(s, pattern, init)      -- regex match on codepoints (5.4+)
utf8.gmatch(s, pattern, init)     -- regex iterator (5.4+)
utf8.gsub(s, pattern, repl, n)    -- regex replace (5.4+)
utf8.find(s, pattern, init, plain) -- regex find (5.4+)
```

### UTF-8 Patterns (5.4+)

Same syntax as string patterns but operates on decoded codepoints rather than bytes. E.g., `utf8.match("café", "%l%l%l%l")` matches "café" because it sees 4 codepoints.
