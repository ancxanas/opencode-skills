------
{% raw %}
--|-------|---------|
| X-Frame-Options | DENY | Clickjacking |
| X-Content-Type-Options | nosniff | MIME sniffing |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Content-Security-Policy | default-src 'self' | XSS |
| Referrer-Policy | strict-origin-when-cross-origin | Privacy |

| Cookie Flag | Purpose |
|-------------|---------|
| httpOnly | No JS access |
| secure | HTTPS only |
| sameSite=strict | CSRF protection |
| maxAge | Expiration |

{% endraw %}
