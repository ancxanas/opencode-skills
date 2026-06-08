------
{% raw %}
-----|---------|----------|
| Load | Normal capacity | 30m - 2h |
| Stress | Find limits | 1h - 4h |
| Spike | Sudden traffic | 15m - 30m |
| Soak | Memory leaks | 4h - 24h |

| Tool | Language | Best For |
|------|----------|----------|
| k6 | JavaScript | API testing, CI/CD |
| Artillery | YAML/JS | Simple scenarios |
| Locust | Python | Complex scenarios |
| JMeter | GUI/XML | Legacy systems |

| Metric | Target |
|--------|--------|
| p95 latency | < 500ms |
| p99 latency | < 1s |
| Error rate | < 1% |
| RPS | 10x normal |

{% endraw %}
