------
{% raw %}
---|---------|
| `IRequest<T>` | MediatR command/query interface |
| `IRequestHandler<TReq, TRes>` | Handler implementation |
| `IPipelineBehavior<,>` | Cross-cutting concerns |
| `IValidator<T>` | FluentValidation interface |
| `ISender` | MediatR sender for endpoints |
| Domain entities | Business logic and invariants |
| Application layer | Use cases and orchestration |
| Infrastructure | External dependencies |

{% endraw %}
