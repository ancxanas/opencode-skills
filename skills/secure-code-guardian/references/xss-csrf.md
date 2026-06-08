------
{% raw %}
--|------------|
| Reflected XSS | Output encoding |
| Stored XSS | Input sanitization + encoding |
| DOM XSS | Avoid innerHTML, use textContent |
| CSRF | Tokens + SameSite cookies |

| Header | Purpose |
|--------|---------|
| CSP | Script/resource restrictions |
| X-Frame-Options | Clickjacking |
| X-Content-Type-Options | MIME sniffing |
| SameSite | CSRF protection |

{% endraw %}
