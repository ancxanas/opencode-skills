------
{% raw %}
--|---------|
| `ContentNegotiation` | JSON serialization |
| `Authentication` | JWT/OAuth2 auth |
| `CORS` | Cross-origin requests |
| `StatusPages` | Error handling |
| `CallLogging` | Request logging |
| `WebSockets` | WebSocket support |
| `RateLimit` | Rate limiting |
| `Compression` | Response compression |

| Function | Purpose |
|----------|---------|
| `call.receive<T>()` | Parse request body |
| `call.respond()` | Send response |
| `call.parameters` | Query/path params |
| `call.principal()` | Get authenticated user |
| `authenticate { }` | Protect routes |
| `route("/path") { }` | Group routes |
{% endraw %}
