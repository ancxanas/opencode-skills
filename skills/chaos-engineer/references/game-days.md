------
{% raw %}
--|--------|--------|--------|
| Time to Detect | < 30s | 15s | PASS |
| Time to Respond | < 5min | 4min 20s | PASS |
| Time to Recover | < 2min | 2min 30s | FAIL |
| Alert Accuracy | 100% | 66% | FAIL |
| Zero Customer Impact | Yes | Yes | PASS |

## What Went Well

1. Team responded quickly (4m 20s vs 5m target)
2. Runbooks were accurate and helpful
3. Communication was clear and frequent
4. No customer impact during any scenario
5. Application auto-reconnect worked perfectly

## What Didn't Go Well

1. Missing alert for failover initiation
2. Took 30s longer than target to recover
3. Connection pool exhaustion not detected
4. Dashboard didn't show replica lag clearly
5. Escalation contacts list was outdated

## Surprises

1. Cache invalidation cascaded from DB failover (unexpected)
2. Read replica had 45s replication lag we didn't know about
3. Application retried too aggressively during failover
4. Team found a workaround we hadn't documented

## Action Items

| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Add alert for RDS failover events | @sre-team | Jan 20 | P0 |
| Update dashboard with replica lag | @platform | Jan 22 | P1 |
| Document cache invalidation behavior | @dev-team | Jan 25 | P1 |
| Add connection pool monitoring | @sre-team | Jan 27 | P0 |
| Update escalation contact list | @manager | Jan 18 | P2 |
| Tune application retry backoff | @dev-team | Feb 1 | P1 |

## Lessons Learned

1. **Monitoring Gaps**: We had blind spots in replica monitoring
2. **Cascading Effects**: DB changes affect cache in non-obvious ways
3. **Team Knowledge**: Cross-training is working well
4. **Documentation**: Runbooks saved time, keep them updated

## Next Game Day

**Proposed Date**: March 15, 2025
**Scenario**: Multi-region failover
**Scope**: Production (with safeguards)

## Appendix

- Full timeline spreadsheet: [link]
- Screen recordings: [link]
- Metrics dashboard export: [link]
- Raw observation notes: [link]
```

## Quick Reference

| Phase | Duration | Key Activities |
|-------|----------|----------------|
| Planning | 2 weeks | Define scenarios, invite participants |
| Pre-game | 30 min | Setup, verify environment, brief team |
| Execution | 2 hours | Run scenarios, observe, document |
| Debrief | 30 min | Immediate learnings, quick wins |
| Post-mortem | 1 week later | Detailed analysis, action items |
| Follow-up | 1 month | Verify improvements, plan next game day |

{% endraw %}
