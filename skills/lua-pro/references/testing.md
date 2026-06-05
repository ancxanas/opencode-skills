# Testing

## Busted (Recommended)

[Busted](https://olivinelabs.com/busted/) is the de facto standard Lua testing framework.

```bash
# Install
luarocks install busted

# Run
busted
busted spec/
busted -p "test_*"      # pattern match
busted -v               # verbose
busted --repeat=5       # stress test
```

### Syntax

```lua
-- describe / it blocks
describe("a table", function()
  it("can be constructed", function()
    local t = { a = 1 }
    assert.are.equal(1, t.a)
  end)
end)

-- pending test
pending("not implemented yet")

-- before_each / after_each
describe("with hooks", function()
  local t
  before_each(function()
    t = {}
  end)
  after_each(function()
    t = nil
  end)
  it("is empty", function()
    assert.are.equal(0, #t)
  end)
end)
```

### Assertions

```lua
assert.are.equal(expected, actual)     -- deep equality
assert.are.same(expected, actual)      -- same value (recursive)
assert.are.not_equal(a, b)
assert.is_true(x)
assert.is_false(x)
assert.is_nil(x)
assert.is_not_nil(x)
assert.has.error(fn, msg_pattern)      -- function throws
assert.has.no.error(fn)                -- no error
assert.is_table(x)
assert.is_string(x)
assert.is_number(x)
assert.is_function(x)
assert.is_callable(x)
assert.is_same(a, b)                   -- same reference
assert.is_not_same(a, b)
```

### Spies / Mocks

```lua
local spy = spy.new(function() end)
spy("hello")
assert.spy(spy).was_called()
assert.spy(spy).was_called_with("hello")

-- Stub a module
local io_stub = stub(os, "clock", function() return 42 end)
os.clock()  -- 42
io_stub:revert()
```

## Lunit

```lua
local lunit = require("lunit")
local T = lunit.TEST

function T:test_addition()
  assert_equal(4, 2 + 2)
end

lunit.run()
```

## LuaUnit

```lua
local lu = require("luaunit")

TestSuite = {}

function TestSuite:test_truth()
  lu.assertTrue(true)
end

lu.LuaUnit.run()
```

## Test Organization

```
project/
  spec/
    init_spec.lua        -- top-level tests
    models_spec.lua      -- model tests
    utils_spec.lua       -- utility tests
  spec_helper.lua        -- shared helpers / setup
```

### Spec helper pattern

```lua
-- spec_helper.lua
_G.TEST_MODE = true
package.path = "./src/?.lua;" .. package.path

local helper = {}

function helper.tempfile(content)
  local f = io.tmpfile()
  if content then f:write(content); f:seek("set") end
  return f
end

return helper
```

## Mocking External Modules

```lua
local function mock_require(name, impl)
  package.preload[name] = function() return impl end
end

describe("with mocked dep", function()
  before_each(function()
    mock_require("database", {
      query = function() return { id = 1 } end,
    })
  end)

  it("uses the mock", function()
    local db = require("database")
    assert.are.equal(1, db.query().id)
  end)
end)
```

## Coverage

```bash
luarocks install luacov
busted --coverage
luacov
cat luacov.report.out
```
