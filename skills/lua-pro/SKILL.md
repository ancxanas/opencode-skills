---
name: lua-pro
description: Use when building Lua applications requiring embedded scripting, game logic, or system automation. Generates idiomatic Lua code with proper table usage, metatable patterns, coroutine-based concurrency, and modular design. Invoke for Lua scripting, LuaJIT, metatables, coroutines, Lua patterns, table manipulation, Lua C API integration, or Luarocks packaging.
license: MIT
compatibility: opencode
metadata:
  author: https://github.com/Jeffallan
  version: "1.1.0"
  domain: language
  triggers: Lua, Lua scripting, LuaJIT, metatables, coroutines, Lua patterns, table manipulation, Lua C API, Luarocks, embedded Lua, game scripting, Lua modules
  role: specialist
  scope: implementation
  output-format: code
  related-skills: luajit-pro, test-master, devops-engineer
  targets-version: lua@5.5
  last-reviewed: 2026-06-08
---

# Lua Pro

Modern Lua 5.1–5.5 specialist focused on embedded scripting, game logic, and system automation.

## When to Use This Skill

- Writing Lua scripts for embedded systems or game engines
- Implementing data-driven designs with tables and metatables
- Building modular Lua applications with `require` and Luarocks
- Using coroutines for cooperative multitasking
- Interfacing Lua with C via the Lua C API
- Writing Lua patterns and string manipulation
- Performance profiling and optimization with LuaJIT

## Core Workflow

1. **Analyze requirements** — Review Lua version target (5.1–5.5, LuaJIT), module structure, C API needs
2. **Design data structures** — Choose table shapes, metatable protocols, weak tables
3. **Implement** — Write idiomatic Lua with proper error handling (`pcall`, `xpcall`)
4. **Validate** — Run `luac -p` for syntax checks, lint with `luacheck`
5. **Test** — Write busted or lunit tests; confirm edge cases for table lookups, metamethods, coroutine yields
6. **Package** — Organize with Luarocks, write proper `rockspec`, confirm module resolution

## Reference Guide

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Types & Tables | `references/types-and-tables.md` | Table construction, array vs. hash, weak tables, immutability |
| Metatables | `references/metatables.md` | Metamethods, OOP patterns, operator overloading, forwarding |
| Modules | `references/modules.md` | `require`, `package.searchers`, module patterns, Luarocks |
| Coroutines | `references/coroutines.md` | Asymmetric coroutines, producers/consumers, async emulation |
| Standard Library | `references/standard-library.md` | string, table, math, io, os, utf8, debug libraries |
| Testing | `references/testing.md` | busted, lunit, mocking, test organization |

## Code Examples

```lua
-- Table as data structure with array and hash parts
local entities = {
  { id = 1, name = "player", hp = 100 },
  { id = 2, name = "goblin", hp = 30 },
}
entities.lookup = {}  -- hash for fast access
for _, e in ipairs(entities) do
  entities.lookup[e.id] = e
end

-- Metatable for OOP-style classes
local Account = { balance = 0 }
Account.__index = Account

function Account:new(balance)
  return setmetatable({ balance = balance }, self)
end

function Account:withdraw(amount)
  if amount > self.balance then
    error("insufficient funds", 2)
  end
  self.balance = self.balance - amount
end

-- Coroutine as producer
local function fibonacci(n)
  return coroutine.wrap(function()
    local a, b = 0, 1
    for _ = 1, n do
      coroutine.yield(a)
      a, b = b, a + b
    end
  end)
end

for num in fibonacci(10) do
  print(num)
end

-- Defensive pcall
local ok, err = pcall(Account.withdraw, acct, 999)
if not ok then
  print("withdraw failed: " .. err)
end

-- Lua 5.3+ integer division
local half = 7 // 2      -- 3
local exact = 7 / 2      -- 3.5
```

## Constraints

### MUST DO
- Use `local` for all variables (avoid globals); Lua 5.5 requires explicit global declarations via `global x = val`
- Use Lua 5.5 named vararg tables (`select('#', ...)` → `...name` syntax) for named parameter patterns
- Use compact array syntax `[1, 2, 3]` for inline table construction in Lua 5.5
- Prefer table constructors `{}` over `table.create`
- Validate arguments with `type()` or assert guards
- Use `pcall`/`xpcall` for error checking in production code
- Return early from functions to reduce nesting
- Use `#` operator only on array-like tables
- Use `ipairs` for arrays, `pairs` for dicts
- Free nil table entries to allow garbage collection
- Use local function references for performance (`local print = print`)

### MUST NOT DO
- Rely on table iteration order (pairs order is undefined)
- Modify a table while iterating with `pairs`/`ipairs`
- Use `#` on tables with nil holes (undefined behavior)
- Shadow standard library functions (e.g., `table = {}`)
- Use mutable module-level tables as default arguments
- Abort on error where `pcall`/`xpcall` is appropriate
- Use globals when `local` suffices
- Assume 5.1 features in LuaJIT or vice versa

## Output Templates

When implementing Lua features, provide:
1. Module file with local-scoped table structure
2. Metatable protocol definitions if applicable
3. Test file with busted or lunit test suite
4. `luacheck` / `luac -p` validation confirmation
5. Brief explanation of Lua idioms used

## Knowledge Reference

Lua 5.1, 5.2, 5.3, 5.4, 5.5, LuaJIT, tables, metatables, metamethods, coroutines, `require`, `package.path`, Luarocks, `pcall`/`xpcall`, string patterns, `string.gmatch`, `table.sort`, weak tables, `__gc` finalizers, `__mode`, `debug` library, `utf8` library, `io` library, `os` library, `math` library, luacheck, busted, lunit, global declarations, named vararg tables, compact arrays
