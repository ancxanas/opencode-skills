------
{% raw %}
------|---------|
| `@EnableWebSecurity` | Enables Spring Security |
| `@EnableMethodSecurity` | Enables method-level security annotations (`@PreAuthorize`, `@PostAuthorize`, `@Secured`) |
| `@PreAuthorize` | Checks authorization before method execution |
| `@PostAuthorize` | Checks authorization after method execution |
| `@Secured` | Role-based method security |
| `@WithMockUser` | Mock authenticated user in tests |
| `@AuthenticationPrincipal` | Inject current user in controller |

## Security Best Practices

- Always use HTTPS in production
- Store JWT secret in environment variables
- Use strong password encoding (BCrypt with strength 12+)
- Implement token refresh mechanism
- Add rate limiting to authentication endpoints
- Validate all user inputs
- Log security events
- Keep dependencies updated
- **Security 7**: Disable CSRF explicitly for stateless JWT APIs (`csrf.disable()`)
- **Security 7**: Use `authorizeHttpRequests()` only — `authorizeRequests()` was removed
- **Security 7**: WebAuthn/PassKeys support is GA for passwordless authentication
- **Security 7**: Multi-factor authentication (MFA) is built-in
- Use proper session timeout for stateful apps
{% endraw %}
