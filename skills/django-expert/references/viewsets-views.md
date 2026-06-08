------
{% raw %}
---------|------|--------|
| `list()` | GET | List all |
| `create()` | POST | Create new |
| `retrieve()` | GET | Get one |
| `update()` | PUT | Full update |
| `partial_update()` | PATCH | Partial update |
| `destroy()` | DELETE | Delete |

| Hook | Purpose |
|------|---------|
| `get_queryset()` | Filter queryset |
| `get_serializer_class()` | Dynamic serializer |
| `perform_create()` | Pre-save logic |
| `@action()` | Custom endpoints |

{% endraw %}
