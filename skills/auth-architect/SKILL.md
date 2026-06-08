---
title: auth-architect

name: auth-architect
description: Design and implement authentication and authorization systems. Use when setting up OAuth 2.0 / OIDC flows, configuring Auth0, Clerk, Supabase Auth, or Firebase Auth, implementing passkeys / WebAuthn, designing RBAC or ABAC models, or managing session and token lifecycles.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: security
  triggers: authentication, authorization, OAuth, OIDC, Auth0, Clerk, Supabase Auth, Firebase Auth, passkeys, WebAuthn, RBAC, ABAC, JWT, session management, token lifecycle, refresh token, SSO, SAML, login, sign-up, MFA, 2FA, passwordless
  role: specialist
  scope: implementation
  output-format: code
  related-skills: secure-code-guardian, security-reviewer, fullstack-guardian, backend-expert, nextjs-developer, fastapi-expert
  targets-version: ""
  last-reviewed: 2026-06-08
parent: Security
nav_order: 1
render_with_liquid: false
---
{% raw %}


# Auth Architect

Senior authentication and authorization engineer with deep expertise in OAuth 2.0, OIDC, passkeys, session management, and access control models.

## When to Use

- Setting up OAuth 2.0 / OIDC authentication flows
- Configuring Auth0, Clerk, Supabase Auth, or Firebase Auth
- Implementing passkeys / WebAuthn for passwordless login
- Designing RBAC (Role-Based Access Control) or ABAC (Attribute-Based) models
- Managing JWT issuance, refresh, and revocation
- Building session management with secure cookies or tokens
- Adding MFA / 2FA to an existing auth system
- Implementing SSO (SAML, OIDC federation)

## When NOT to Use

- Simple password hashing and login — use secure-code-guardian
- Security audits of existing auth — use security-reviewer
- Full-stack app security beyond auth — use fullstack-guardian

## OAuth 2.0 Flows

| Flow | Use Case | Security |
|------|----------|----------|
| **Authorization Code + PKCE** | Web apps, mobile apps, SPAs | Best — recommended for all |
| **Authorization Code** | Server-side web apps | Good — legacy, not better than PKCE |
| **Client Credentials** | Server-to-server / machine-to-machine | No user context |
| **Device Authorization** | CLI tools, TV, IoT | Limited input devices |
| **Implicit (deprecated)** | Legacy SPAs | Avoid — no refresh token, token in URL |

### Authorization Code + PKCE Flow

```
1. App → Provider: /authorize?response_type=code&code_challenge=S256(verifier)
2. Provider → Browser: login page, consent
3. Browser → App: authorization code (callback URL)
4. App → Provider: /token?code=...&code_verifier=verifier
5. Provider → App: access_token, refresh_token, id_token
```

## OIDC (OpenID Connect)

OIDC sits on top of OAuth 2.0 — adds identity layer.

| Token | Purpose |
|-------|---------|
| **access_token** | API authorization (opaque or JWT) |
| **id_token** | User identity proof (always JWT) |
| **refresh_token** | Get new access tokens |
| **userinfo** endpoint | Get user claims with access_token |
| **Discovery** `/.well-known/openid-configuration` | Provider metadata |

### ID Token Validation

```typescript
function verifyIdToken(token: string, issuer: string, clientId: string): JWTPayload {
  const decoded = jwt.verify(token, getJWKS(issuer), {
    issuer,
    audience: clientId,
    algorithms: ['RS256'],
  });
  return decoded;
}
```

## Passkeys / WebAuthn

### Registration

```typescript
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: serverChallenge,
    rp: { name: 'My App', id: 'example.com' },
    user: {
      id: new TextEncoder().encode(userId),
      name: user.email,
      displayName: user.name,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256
  },
});
```

### Authentication

```typescript
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: serverChallenge,
    rpId: 'example.com',
    allowCredentials: credentials.map(c => ({
      id: base64ToBytes(c.credentialId),
      type: 'public-key',
    })),
  },
});
```

Best for passwordless login on devices with biometrics (Touch ID, Face ID, Windows Hello).

## JWT Lifecycle

### Access Token

- Short-lived (15 minutes)
- Signed (RS256 or ES256 preferred over HS256)
- Contains claims: `sub`, `iss`, `aud`, `exp`, `iat`, optional `scope`/`roles`
- Sent as `Authorization: Bearer <token>` header

### Refresh Token

- Long-lived (days to months)
- Opaque or JWT — stored in database for revocation
- Rotation: issue new refresh token on each use, invalidate old one
- Revocation: delete from DB on logout, password change, or suspicious activity

```typescript
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface RefreshTokenRecord {
  tokenHash: string;
  userId: string;
  familyId: string;       // For rotation tracking
  expiresAt: Date;
  revokedAt?: Date;
}
```

## Session Management

### Cookie-based Sessions

```typescript
response.cookies.set('session', sessionToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
});
```

### Token vs Cookie

| Aspect | Bearer Token | Cookie Session |
|--------|-------------|----------------|
| Storage | Client (memory, storage) | Server (DB, Redis) |
| Revocation | Hard (token valid until expiry) | Easy (delete session) |
| Cross-domain | Works (CORS) | Limited (same-site) |
| CSRF | Not vulnerable | Vulnerable (need token) |
| Mobile | Natural fit | Extra setup |

## RBAC Design

```
Roles: admin, manager, editor, viewer

Resources: users, posts, settings, reports

Permissions:
  admin:    * (everything)
  manager:  posts.*, users.read, reports.*
  editor:   posts.*, users.read
  viewer:   posts.read, users.read
```

### Implementation

```typescript
function checkPermission(user: User, resource: string, action: string): boolean {
  const role = roles[user.roleId];
  if (!role) return false;
  const permission = role.permissions[resource];
  if (!permission) return false;
  return permission === '*' || permission.includes(action);
}
```

## MFA / 2FA

### TOTP

```typescript
import { authenticator } from 'otplib';

// Setup
const secret = authenticator.generateSecret();
const otpauth = authenticator.keyuri(user.email, 'MyApp', secret);

// Verify
const isValid = authenticator.check(userInput, secret);
```

### Recovery Codes

Generate 8-10 single-use codes on MFA enable. Hash and store. One-time use, regenerate on request.

## Auth Provider Comparison

| Provider | Best for | Auth methods | Pricing model |
|----------|----------|-------------|---------------|
| **Auth0** | Enterprise, custom rules | OAuth, OIDC, SAML, passwordless, MFA | MAU-based |
| **Clerk** | Next.js, React, modern stacks | OAuth, passkeys, MFA, orgs | MAU-based |
| **Supabase Auth** | Supabase projects | OAuth, passwordless, MFA | Included in DB pricing |
| **Firebase Auth** | Google ecosystem | OAuth, phone, passwordless, MFA | MAU-based (free tier available) |
| **Okta** | Enterprise SSO | OAuth, OIDC, SAML, AD/LDAP | Per-user pricing |

## Security Checklist

- [ ] Passwords hashed with bcrypt (cost >= 12) or argon2
- [ ] JWTs signed with RS256/ES256, not HS256
- [ ] Refresh token rotation enabled
- [ ] CORS restricted to specific origins
- [ ] Rate limiting on login (/login, /register, /password-reset)
- [ ] Account lockout after N failed attempts
- [ ] MFA available for sensitive actions
- [ ] Session invalidation on password change
- [ ] CSRF protection on cookie-based auth
- [ ] Secure cookie flags (httpOnly, secure, sameSite)

{% endraw %}
