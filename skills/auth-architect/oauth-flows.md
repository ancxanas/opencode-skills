------
{% raw %}
------|-------------|---------------|----------|
| Authorization Code + PKCE | Public & Confidential | Yes | Web apps, SPAs, mobile apps |
| Client Credentials | Confidential | N/A | Machine-to-machine, server-to-server |
| Device Authorization | Public (input-constrained) | Yes | CLI tools, smart TVs, IoT |
| Resource Owner Password | Legacy-Confidential | Yes | **Deprecated** — migration only |

## Authorization Code + PKCE Flow

```
User Agent          Frontend          Backend          Auth Server
    │                  │                │                 │
    │  Click "Login"   │                │                 │
    │─────────────────>│                │                 │
    │                  │  Gen code_verifier + code_challenge (S256)
    │                  │────────────────>                 │
    │                  │  Redirect to /authorize?         │
    │                  │  code_challenge=S256(...)        │
    │                  │<══════════════════════════════════│
    │  GET /authorize  │                │                 │
    │<═════════════════════════════════════════════════════│
    │  User authenticates + consents       │                 │
    │═════════════════════════════════════════════════════>│
    │                  │                │                 │
    │  Redirect with code                │                 │
    │═════════════════>│  POST /token    │                 │
    │                  │  + code_verifier + code          │
    │                  │─────────────────────────────────>│
    │                  │                │   Verify S256 challenge
    │                  │                │   Return access_token, refresh_token
    │                  │<══════════════════════════════════│
    │                  │  Set httpOnly cookie / return to client
    │                  │<══════════════════════════════════│
    │                  │  API calls with access_token      │
    │                  │─────────────────────────────────>│
```

## OAuth 2.1 Changes (from 2.0)
- Removed: Implicit grant
- Removed: Resource Owner Password grant
- Removed: Bearer token in URL query (must use header)
- Removed: `refresh_token` without `client_secret` (confidential only)
- PKCE required for all public clients
- Refresh tokens must be rotation or sender-constrained

## JWT Structure
```
header:    { "alg": "RS256", "typ": "JWT", "kid": "..." }
payload:   { "iss": "...", "sub": "...", "aud": "...",
             "exp": 123, "iat": 123, "scope": "..." }
signature: RSASHA256(base64(header) + "." + base64(payload), private_key)
```

## Common JWKS Endpoints
- Auth0: `https://{tenant}.auth0.com/.well-known/jwks.json`
- Clerk: `https://{app}.clerk.accounts.dev/.well-known/jwks.json`
- Firebase: `https://www.googleapis.com/oauth2/v3/certs`
{% endraw %}
