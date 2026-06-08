------
{% raw %}
---|---------|
| Span | Single operation |
| Trace | Full request flow |
| Context | Correlation across services |
| Attributes | Metadata on spans |
| Events | Timestamped logs in span |

| Attribute | Example |
|-----------|---------|
| `http.method` | GET, POST |
| `http.status_code` | 200, 500 |
| `db.system` | postgresql |
| `db.statement` | SELECT ... |
{% endraw %}
