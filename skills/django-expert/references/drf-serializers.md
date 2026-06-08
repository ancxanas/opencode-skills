------
{% raw %}
------|----------|
| `CharField(source=...)` | Computed from related |
| `PrimaryKeyRelatedField` | FK input |
| `SerializerMethodField` | Custom computed |
| `Nested Serializer` | Related objects |

| Method | Purpose |
|--------|---------|
| `validate_<field>()` | Single field validation |
| `validate()` | Cross-field validation |
| `create()` | Custom creation logic |
| `update()` | Custom update logic |
| `to_representation()` | Custom output |
{% endraw %}
