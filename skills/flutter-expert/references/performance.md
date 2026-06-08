------
{% raw %}
-|----------|
| Unnecessary rebuilds | Add `const`, use `select()` |
| Large lists | Use `ListView.builder` |
| Image loading | Use `cached_network_image` |
| Heavy computation | Use `compute()` |
| Jank in animations | Use `RepaintBoundary` |
| Memory leaks | Dispose controllers |

## DevTools Metrics

- **Frame rendering time**: < 16ms for 60fps
- **Widget rebuilds**: Minimize unnecessary rebuilds
- **Memory usage**: Watch for leaks
- **CPU profiler**: Identify bottlenecks
{% endraw %}
