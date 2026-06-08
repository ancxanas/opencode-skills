------
{% raw %}
---|-------|
| `Results.Ok(data)` | 200 with response body |
| `Results.Created(uri, data)` | 201 with location header |
| `Results.NoContent()` | 204 no response body |
| `Results.BadRequest()` | 400 validation error |
| `Results.NotFound()` | 404 resource not found |
| `Results.Unauthorized()` | 401 authentication required |
| `Results.Forbid()` | 403 authorization failed |
| `app.MapGroup()` | Group related endpoints |
| `.WithTags()` | OpenAPI tag grouping |
| `.Produces<T>()` | Document response type |

{% endraw %}
