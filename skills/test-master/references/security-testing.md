------
{% raw %}
----|-------|
| **Auth** | Invalid creds, token expiry, tampering |
| **Input** | SQL injection, XSS, command injection |
| **Access** | IDOR, privilege escalation |
| **Rate Limit** | Brute force, API abuse |
| **Headers** | CSP, HSTS, X-Frame-Options |
| **Data** | PII exposure, error messages |

## Quick Reference

| Vulnerability | Test Approach |
|---------------|---------------|
| SQL Injection | `'; DROP TABLE--` in inputs |
| XSS | `<script>alert(1)</script>` |
| IDOR | Access other user's resources |
| CSRF | Missing/invalid tokens |
| Auth Bypass | Missing auth, expired tokens |
{% endraw %}
