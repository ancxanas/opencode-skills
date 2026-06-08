------
{% raw %}
------|----------|-------------|
| Swoole | High-performance servers, WebSockets | Very High |
| ReactPHP | Event-driven apps, real-time | High |
| Amphp | Modern async framework | High |
| Fibers | Native async (PHP 8.1+) | Medium |
| Generators | Simple async patterns | Medium |

| Feature | Swoole | ReactPHP | Amphp |
|---------|--------|----------|-------|
| Coroutines | Yes | No (Promises) | Yes (Fibers) |
| HTTP Server | Built-in | Via package | Via package |
| WebSockets | Built-in | Via package | Via package |
| Extension | Required | Not required | Not required |
| Learning Curve | Medium | Low | Medium |
{% endraw %}
