# Staff Engineer Review Checklist

## 1. PR Completeness

- [ ] Does the PR description clearly state WHAT and WHY?
- [ ] Is there a link to the issue/requirement/plan?
- [ ] Are there screenshots or recordings for UI changes?
- [ ] Is the scope appropriate (not too big, not too small)?

## 2. Plan vs Implementation

- [ ] Does the implementation match the stated approach?
- [ ] Are there deviations? Are they justified in comments?
- [ ] If the plan specified constraints (perf, security), are they met?
- [ ] Are edge cases from the plan actually handled?

## 3. Architecture

- [ ] Does this change fit the existing architecture?
- [ ] Is the abstraction level appropriate?
- [ ] Are new dependencies justified?
- [ ] Could this be simpler? (YAGNI)
- [ ] Are layering boundaries respected? (UI → Service → Data)
- [ ] Is the change backward-compatible where expected?

## 4. Correctness

- [ ] Are all error paths handled?
- [ ] Are edge cases covered (empty, null, max values)?
- [ ] Are concurrent access / race conditions considered?
- [ ] Are idempotency guarantees met (if expected)?
- [ ] Are timeouts and cancellation handled?

## 5. Performance

- [ ] N+1 queries? (DB, API calls, file reads)
- [ ] Are loops/recursion bounded?
- [ ] Are large payloads streamed (not loaded into memory)?
- [ ] Are caches invalidated correctly?
- [ ] Is there unnecessary re-rendering or recalculation?
- [ ] Are async operations awaited properly (no fire-and-forget)?

## 6. Security

- [ ] Is user input validated and sanitized?
- [ ] Are SQL queries parameterized?
- [ ] Is auth checked for every protected endpoint?
- [ ] Is authorization granular enough? (not just "is logged in")
- [ ] Are secrets never logged or exposed?
- [ ] Are CSRF, XSS, injection vectors mitigated?
- [ ] Is rate limiting considered for new endpoints?

## 7. Test Coverage

- [ ] Are there tests for the new behavior?
- [ ] Do tests cover success paths AND failure paths?
- [ ] Are there regression tests for fixed bugs?
- [ ] Are tests deterministic (no flakiness)?
- [ ] Is the test pyramid respected? (unit > integration > e2e)

## 8. Code Quality

- [ ] Is the code idiomatic for the language/framework?
- [ ] Are naming conventions consistent with the codebase?
- [ ] Are functions/methods a reasonable size?
- [ ] Are comments explaining WHY, not WHAT?
- [ ] Is there dead code or commented-out code?
- [ ] Are types/type hints used where valuable?

## 9. Observability

- [ ] Are errors logged with sufficient context?
- [ ] Are metrics added for new critical paths?
- [ ] Is there a health check or readiness probe?
- [ ] Are trace IDs propagated across async boundaries?

## 10. Deployment & Operations

- [ ] Does this require a migration? Is it reversible?
- [ ] Are feature flags used for risky changes?
- [ ] Does the deploy order matter?
- [ ] Are there any breaking API changes documented?
- [ ] Are environment variables / configs documented?

## Review Output Template
```
## Summary
[1-2 sentence overview of what changed and whether it's good to merge]

## Strengths
- [what was done well]

## Issues
### Required (blocking)
- [must fix before merge]

### Recommended
- [should address but not blocking]

### Nitpicks
- [style/minor suggestions]

## Decision
[Approve / Changes Requested / Comment]
```
