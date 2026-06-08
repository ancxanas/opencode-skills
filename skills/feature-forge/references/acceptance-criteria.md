------
{% raw %}
-----|-------------|-------|
| **I**ndependent | Can be tested alone | No dependencies on other ACs |
| **N**egotiable | Details can be discussed | Not over-specified |
| **V**aluable | Delivers user value | Ties to requirement |
| **E**stimable | Effort can be estimated | Clear scope |
| **S**mall | Testable in one session | Not too broad |
| **T**estable | Pass/fail is clear | Objective criteria |

## Quick Reference

| Scenario Type | Given | When | Then |
|---------------|-------|------|------|
| Happy path | Valid state | Valid action | Success result |
| Error | Invalid state/input | Action | Error message |
| Edge case | Boundary condition | Action | Graceful handling |
| Authorization | User role | Protected action | Appropriate access |
| Concurrency | Multiple actors | Simultaneous action | Consistent state |

{% endraw %}
