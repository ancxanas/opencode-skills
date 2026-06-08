------
{% raw %}
------|-------------|-------------|
| Feature ships late | Sales misses quarter target | Engineering loses trust, gets more oversight |
| Performance degrades | Users adopt workarounds | Workarounds become "requirements" that constrain future design |
| Team member burns out | Knowledge concentrated in fewer people | Bus factor drops, risk increases |
| Dependency breaks | Hotfix bypasses testing | New bugs introduced, confidence in releases drops |
| Data quality issue | Downstream reports are wrong | Business decisions made on bad data |

## Inversion Technique

Ask: **"What would guarantee this fails?"** Then check if any of those conditions exist.

### Guaranteed Failure Conditions

| Category | What Guarantees Failure |
|----------|----------------------|
| **People** | Single point of knowledge, no stakeholder buy-in, team doesn't believe in approach |
| **Process** | No rollback plan, no incremental validation, all-or-nothing deployment |
| **Technology** | Untested at target scale, undocumented dependencies, version lock-in |
| **Timeline** | No buffer for unknowns, dependencies on external teams with no SLA, parallel critical paths |
| **Data** | Migration without validation, no data quality checks, schema changes without backward compatibility |

## Domain-Specific Failure Patterns

### Technical Failures

| Pattern | Trigger | Typical Consequence |
|---------|---------|-------------------|
| Integration cliff | New service connects to 3+ existing systems | One integration blocks all others |
| Scale surprise | Load 10x beyond testing | Cascading failures across dependent services |
| Migration trap | "Just move the data" | Data loss, extended downtime, rollback impossible |
| Dependency rot | Pinned to abandoned library | Security vulnerability with no upgrade path |
| Config drift | Manual environment setup | "Works on my machine" becomes "works in no environment" |

### Business Failures

| Pattern | Trigger | Typical Consequence |
|---------|---------|-------------------|
| Adoption cliff | Build it and they don't come | Sunk cost with no revenue impact |
| Competitor preempt | Competitor ships similar feature first | Market positioning lost, differentiation eroded |
| Timing mismatch | Market shifts during development | Product solves yesterday's problem |
| Stakeholder reversal | Executive sponsor changes | Project loses priority, resources reallocated |
| Hidden cost | Operational burden underestimated | Feature costs more to run than it generates |

### Process Failures

| Pattern | Trigger | Typical Consequence |
|---------|---------|-------------------|
| Timeline fantasy | Estimates based on best case | Crunch, quality cuts, or scope cuts at the worst time |
| Dependency chain | Team A waits on Team B waits on Team C | Any slip cascades through all teams |
| Knowledge silo | Expert leaves or is unavailable | Progress stops; replacement ramps up for weeks |
| Scope creep | "While we're at it..." | Original goal buried under additions |
| Feedback void | No user testing until launch | Wrong product built correctly |

## Early Warning Signs

| Warning Sign | What It Indicates |
|-------------|-------------------|
| "We'll figure that out later" repeated 3+ times | Critical decisions being deferred, not resolved |
| No one can explain the rollback plan | Rollback hasn't been designed |
| Estimates keep growing | Hidden complexity being discovered incrementally |
| Key meetings keep getting rescheduled | Stakeholder alignment is weaker than assumed |
| "It works locally" | Environment parity is worse than assumed |
| Testing phase compressed | Quality will be sacrificed |
| No metrics defined for success | No one will know if this worked |

## Output Template

```markdown
## Pre-Mortem: [Plan/Decision Name]

**Timeframe:** [When would failure be evident]

### Failure Narratives

#### 1. [Failure Title] — Likelihood: High/Medium/Low | Impact: High/Medium/Low

[Specific failure narrative using the template above]

**Consequence chain:**
- 1st order: [immediate]
- 2nd order: [downstream]
- 3rd order: [systemic]

#### 2. [Failure Title] — Likelihood: High/Medium/Low | Impact: High/Medium/Low

[Narrative]

#### 3. [Failure Title] — Likelihood: High/Medium/Low | Impact: High/Medium/Low

[Narrative]

### Early Warning Signs

| Signal | Failure It Predicts | Check Frequency |
|--------|-------------------|-----------------|
| [Observable signal] | Failure #X | Weekly / Sprint / Monthly |

### Mitigations

| Failure | Mitigation | Effort | Reduces Risk By |
|---------|-----------|--------|-----------------|
| #1 | [Specific action] | Low/Med/High | [How much] |
| #2 | [Specific action] | Low/Med/High | [How much] |
| #3 | [Specific action] | Low/Med/High | [How much] |

### Inversion Check

**What would guarantee failure:** [List top 3 conditions]
**Do any exist now?** [Yes/No with specifics]
```
{% endraw %}
