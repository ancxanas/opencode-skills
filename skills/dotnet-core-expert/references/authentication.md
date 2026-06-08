------
{% raw %}
---|-------|
| `RequireAuthorization()` | Endpoint requires authentication |
| `RequireAuthorization("Policy")` | Endpoint requires specific policy |
| `AllowAnonymous()` | Allow unauthenticated access |
| `RequireRole("Admin")` | Require specific role |
| JWT Bearer | Token-based authentication |
| `ICurrentUserService` | Access current user info |
| `IPasswordHasher` | Hash and verify passwords |
| `IJwtService` | Generate and validate tokens |
{% endraw %}
