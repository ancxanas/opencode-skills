------
{% raw %}
------|---------|
| `@RestController` | Marks class as REST controller (combines @Controller + @ResponseBody) |
| `@RequestMapping` | Maps HTTP requests to handler methods |
| `@GetMapping/@PostMapping/@HttpExchange` | HTTP method-specific mappings (declarative client) |
| `@PathVariable` | Extracts values from URI path |
| `@RequestParam` | Extracts query parameters |
| `@RequestBody` | Binds request body to method parameter |
| `@Valid` | Triggers validation on request body |
| `@RestControllerAdvice` | Global exception handling returning `ProblemDetail` (RFC 9457) |
| `@ResponseStatus` | Sets HTTP status code for method |
| `@HttpServiceClient` | Declarative HTTP client — Spring generates the implementation |

## Jackson 3 Notes

- **Package**: `com.fasterxml.jackson` → `tools.jackson`
- **Builder**: Use `tools.jackson.databind.JsonMapper` (extends `ObjectMapper` with immutable builder API)
- **Customizer**: `JsonMapperBuilderCustomizer` replaces `Jackson2ObjectMapperBuilderCustomizer`
- **Dates**: `WRITE_DATES_AS_TIMESTAMPS` defaults to `false` (ISO strings, not Unix timestamps)
- **Property order**: `SORT_PROPERTIES_ALPHABETICALLY` defaults to `true`
- **Exceptions**: `JacksonException` extends `RuntimeException`, not `IOException` — audit `catch (IOException e)` blocks
- **Annotations**: `@JsonProperty`, `@JsonIgnore`, `@JsonView` remain at `com.fasterxml.jackson.annotation` (shared with Jackson 2)
- **Compatibility**: Add `spring.jackson.use-jackson2-defaults: true` + `spring-boot-jackson2` for incremental migration

{% endraw %}
