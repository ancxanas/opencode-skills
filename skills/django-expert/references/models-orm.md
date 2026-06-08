------
{% raw %}
--|----------|
| `select_related()` | FK, OneToOne |
| `prefetch_related()` | ManyToMany, reverse FK |
| `only()` / `defer()` | Partial field loading |
| `annotate()` | Add computed fields |
| `aggregate()` | Single-row aggregates |
| `F()` | Database-level operations |
| `Q()` | Complex queries |
| `bulk_create()` | Mass insert |
| `update()` | Mass update |

{% endraw %}
