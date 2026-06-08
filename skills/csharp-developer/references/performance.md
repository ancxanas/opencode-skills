------
{% raw %}
-------|----------|---------|
| `Span<T>` | Array/string operations | Zero allocation |
| `ArrayPool<T>` | Temporary buffers | Reduce GC pressure |
| `ValueTask<T>` | Frequently sync paths | Lower allocation |
| `ConfigureAwait(false)` | Libraries | Avoid context capture |
| Frozen collections | Static readonly data | Faster lookups |
| `AsNoTracking()` | Read-only queries | Better EF performance |
| Object pooling | Heavy objects | Reuse instances |
| Response caching | Static responses | Reduce server load |
| Native AOT | Startup time critical | Faster cold start |
{% endraw %}
