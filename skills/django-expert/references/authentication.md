------
{% raw %}
------|--------|
| `AllowAny` | Everyone |
| `IsAuthenticated` | Logged in users |
| `IsAdminUser` | Staff users |
| `IsAuthenticatedOrReadOnly` | Auth for write |

| JWT Endpoint | Purpose |
|--------------|---------|
| `/token/` | Get access + refresh |
| `/token/refresh/` | New access from refresh |
| `/token/verify/` | Validate token |
{% endraw %}
