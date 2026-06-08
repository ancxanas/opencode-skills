------
{% raw %}
---|--------|----------|
| Basic generic | `func F[T any]()` | Any type |
| Constraint | `func F[T Constraint]()` | Restricted types |
| Multiple params | `func F[T, U any]()` | Multiple type variables |
| Comparable | `func F[T comparable]()` | Types supporting == and != |
| Ordered | `func F[T constraints.Ordered]()` | Types supporting <, >, <=, >= |
| Union | `T interface{int \| string}` | Either type |
| Approximate | `~int` | Include type aliases |

{% endraw %}
