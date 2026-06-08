------
{% raw %}
|----------|---------|
| Counter | Cumulative totals | Requests, errors |
| Gauge | Current value | Active users, queue size |
| Histogram | Distributions | Response times |
| Summary | Percentiles | Similar to histogram |

| Naming | Convention |
|--------|------------|
| Unit suffix | `_seconds`, `_bytes`, `_total` |
| Base unit | Use seconds, bytes (not ms, KB) |
| Prefix | App/service name |

{% endraw %}
