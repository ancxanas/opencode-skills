---]     -- trace aborted (NYI hit)
[TRACE   4 myfile.lua:42 stop]    -- trace completed and compiled
```

### Interpreting `jit.dump` output

- **IR (Intermediate Representation)** — SSA-based IR listing
- **mcode** — Generated machine code
- **snapshot** — State snapshots for side exits
- **abort** — Reason trace recording was aborted

### Using `jit.prng` (LuaJIT 2.1+)

```lua
jit.prng("seed")    -- seed the PRNG for reproducible JIT behavior
```

## Common Performance Patterns

| Pattern | Performance | Notes |
|---
{% raw %}
------|-------------|-------|
| Numeric `for` | JIT-traced | Preferred loop construct |
| `while` with `next` | JIT-traced | Good for dict iteration |
| `ipairs` | NYI | Use numeric `for` |
| `pairs` | NYI | Use `next` manual loop |
| FFI struct field access | Direct memory (fast) | Excellent in traces |
| Lua table access | Fast in traces | Monomorphic is best |
| Callback creation | Slow (trampoline) | Cache once, reuse |
| Vararg C calls | NYI | Use fixed-arg FFI bindings |
| Raw Lua arithmetic | JIT-compiled | Very fast |
| String concat (`..`) | Fast in traces | Small strings optimized |
| `string.sub` (simple) | Traced | Avoid patterns |

## Architecture Notes

- x86/x64: best JIT coverage, most NYI resolved
- ARM: good coverage, some NYI differences
- ARM64 (M1+): experimental, fewer optimizations
- MIPS: limited JIT support
- PPC: limited JIT support

Run `luajit -jv` on your target architecture during development to identify architecture-specific NYI issues.

{% endraw %}
