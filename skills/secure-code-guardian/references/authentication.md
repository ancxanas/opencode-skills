------
{% raw %}
----|----------------|
| Password hash | bcrypt (12+ rounds) |
| Token expiry | Access: 15m, Refresh: 7d |
| Lockout | 5 attempts, 15min lockout |
| MFA | TOTP (authenticator apps) |

| JWT Claim | Purpose |
|-----------|---------|
| `sub` | User ID |
| `exp` | Expiration |
| `iat` | Issued at |
| `type` | access/refresh |

{% endraw %}
