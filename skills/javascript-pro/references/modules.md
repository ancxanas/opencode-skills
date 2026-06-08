------
{% raw %}
---|-----|----------|
| Syntax | `import`/`export` | `require()`/`module.exports` |
| Loading | Asynchronous | Synchronous |
| Tree shaking | Yes | No |
| Top-level await | Yes | No |
| Dynamic imports | `await import()` | `require()` |
| File extension | Required | Optional |
| `__dirname` | Use `import.meta.url` | Built-in |
| Browser support | Native | Needs bundler |
| Default mode | `"type": "module"` | No type field |
{% endraw %}
