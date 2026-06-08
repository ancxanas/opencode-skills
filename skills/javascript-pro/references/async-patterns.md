------
{% raw %}
---|----------|---------|
| `Promise.all()` | Parallel, fail-fast | `await Promise.all([p1, p2])` |
| `Promise.allSettled()` | Parallel, all results | `await Promise.allSettled([p1, p2])` |
| `Promise.race()` | First to complete | `await Promise.race([p1, p2])` |
| `Promise.any()` | First to succeed | `await Promise.any([p1, p2])` |
| `async function*` | Async iteration | `for await (const x of gen())` |
| `AbortController` | Cancellation | `fetch(url, { signal })` |
| `queueMicrotask()` | Priority microtask | `queueMicrotask(fn)` |
{% endraw %}
