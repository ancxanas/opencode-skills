------
{% raw %}
--|----------|---------|
| URL naming | Plural nouns | `/api/users` not `/api/user` |
| HTTP methods | RESTful semantics | GET (read), POST (create), PUT/PATCH (update), DELETE |
| Status codes | Semantic usage | 200 (success), 201 (created), 422 (validation) |
| Errors | Consistent format | `{ error: { code, message, details } }` |
| Pagination | Meta + links | `{ data, meta: { page, total }, links }` |
| Versioning | URL path | `/api/v1/users` |
| Rate limiting | Per-endpoint | Auth: 5/min, General: 100/15min |
| CORS | Whitelist origins | Production domains only |
| Validation | Schema-based | Zod/Pydantic with detailed errors |
| Documentation | OpenAPI | Auto-generated from decorators |

{% endraw %}
