------
{% raw %}
---|-------------|-------|
| Readonly properties | 8.1+ | `public readonly string $name` |
| Readonly classes | 8.2+ | `readonly class User {}` |
| Enums | 8.1+ | `enum Status: string {}` |
| First-class callables | 8.1+ | `$fn = $obj->method(...)` |
| Never type | 8.1+ | `function exit(): never` |
| Fibers | 8.1+ | `new \Fiber(fn() => ...)` |
| Pure intersection types | 8.1+ | `A&B $param` |
| DNF types | 8.2+ | `(A&B)\|C $param` |
| Constants in traits | 8.2+ | `trait T { const X = 1; }` |

{% endraw %}
