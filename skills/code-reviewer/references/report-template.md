------
{% raw %}
---|-------------|
| **Approve** | No blocking issues, minor suggestions only |
| **Request Changes** | Critical or major issues must be fixed |
| **Comment** | Questions need answers, no blocking issues |

## Severity Definitions

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Security risk, data loss, crashes | SQL injection, auth bypass |
| **Major** | Significant performance, maintainability | N+1 queries, god functions |
| **Minor** | Style, naming, small improvements | Variable names, formatting |

## Time Boxing

| Section | Suggested Time |
|---------|----------------|
| Context & understanding | 5 minutes |
| Critical/security review | 10 minutes |
| Logic & performance | 15 minutes |
| Tests review | 10 minutes |
| Writing report | 10 minutes |
| **Total** | ~50 minutes |

## Quick Checks Before Submitting

- [ ] All critical issues have clear remediation
- [ ] Major issues explain the impact
- [ ] At least one positive comment included
- [ ] Questions are specific and answerable
- [ ] Verdict matches the issues found

{% endraw %}
