------
{% raw %}
----|---------------|---------|------------|
| Critical | Easy | Full compromise | 9.0-10.0 |
| High | Medium | Significant access | 7.0-8.9 |
| Medium | Hard | Limited access | 4.0-6.9 |
| Low | Very hard | Minimal impact | 0.1-3.9 |

### Impact Assessment

- **Critical**: Remote code execution, full data access, admin takeover
- **High**: Authentication bypass, privilege escalation, sensitive data exposure
- **Medium**: CSRF, XSS (non-admin), information disclosure
- **Low**: Missing security headers, verbose errors, rate limiting issues

## Testing Checklist

### OWASP Top 10 Coverage

- [ ] Broken Access Control (IDOR, path traversal)
- [ ] Cryptographic Failures (weak encryption, plaintext)
- [ ] Injection (SQL, XSS, command)
- [ ] Insecure Design (missing auth flows)
- [ ] Security Misconfiguration (defaults, debug mode)
- [ ] Vulnerable Components (outdated dependencies)
- [ ] Authentication Failures (weak passwords, session issues)
- [ ] Data Integrity (deserialization, lack of verification)
- [ ] Logging Failures (missing logs, exposed sensitive data)
- [ ] SSRF (unvalidated URLs)

## Quick Reference

| Test Type | Tools | Focus |
|-----------|-------|-------|
| Web App | Burp Suite, OWASP ZAP | OWASP Top 10 |
| API | Postman, curl | AuthN/AuthZ, data exposure |
| Network | nmap, Metasploit | Services, exploits |
| Mobile | MobSF, Frida | Data storage, crypto |
| Cloud | ScoutSuite, Prowler | Misconfigurations |

| Finding Type | Validation Method | Evidence Required |
|--------------|------------------|-------------------|
| SQL Injection | Sleep-based, error-based | Request/response, timing |
| XSS | Alert box, DOM manipulation | Screenshot, payload |
| IDOR | Access other user's resource | Two user accounts, IDs |
| Auth Bypass | Unauthorized access | Before/after screenshots |
| RCE | Command output (safe) | Whoami, id command output |
{% endraw %}
