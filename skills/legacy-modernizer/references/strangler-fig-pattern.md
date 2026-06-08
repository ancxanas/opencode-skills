------
{% raw %}
-|---------|------------|
| Setup | Create facade, feature flags | Smoke tests pass |
| Canary | Route 10% traffic | Error rate < 1% |
| Ramp | Route 50% traffic | Performance parity |
| Full | Route 100% traffic | All metrics green |
| Cleanup | Remove legacy code | Legacy unused 30 days |

{% endraw %}
