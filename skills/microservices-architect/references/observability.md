------
{% raw %}
----------------------------|
    |-- order-service (150ms) ------------------------|
        |-- db.insert_order (30ms) --|
        |-- payment-service (80ms) -----------------|
            |-- db.create_transaction (20ms) ----|
        |-- notification-service (30ms) ----------|

Critical path highlighted
Bottlenecks identified (payment-service taking 80ms)
Parallel operations visible
```

**Sampling Strategies:**
```
Problem: Tracing every request is expensive

Solutions:

1. Probabilistic Sampling:
   - Trace 1% of requests
   - Good for high-volume services

2. Rate Limiting Sampling:
   - Max 100 traces per second
   - Prevents overwhelming trace backend

3. Tail-Based Sampling:
   - Trace all errors
   - Trace slow requests (>5s)
   - Sample 1% of fast successful requests

4. Priority Sampling:
   - Always trace premium users
   - Always trace critical endpoints
   - Sample others

Implementation:
from opentelemetry.sdk.trace.sampling import (
    ParentBasedTraceIdRatioBased,
    ALWAYS_ON,
    ALWAYS_OFF
)

# Sample 1% of traces
sampler = ParentBasedTraceIdRatioBased(0.01)

# Or custom sampler
class CustomSampler:
    def should_sample(self, context, trace_id, name, attributes):
        # Always sample errors
        if attributes.get("http.status_code", 0) >= 500:
            return ALWAYS_ON

        # Always sample slow requests
        if attributes.get("duration_ms", 0) > 5000:
            return ALWAYS_ON

        # Sample 1% of others
        return ParentBasedTraceIdRatioBased(0.01).should_sample(...)
```

## Service Level Objectives (SLOs)

### Defining SLOs

**SLI (Service Level Indicator):**
```
Quantitative measure of service level

Examples:
- Request latency: p99 < 200ms
- Availability: 99.9% of requests succeed
- Throughput: Handle 10,000 requests/sec
```

**SLO (Service Level Objective):**
```
Target value for SLI

Examples:
- 99.9% of requests complete in < 200ms
- 99.95% availability over 30 days
- Zero data loss

SLO Components:
- Metric: What you measure (latency, availability)
- Target: Threshold (99.9%, 200ms)
- Time window: Evaluation period (30 days, weekly)
```

**SLA (Service Level Agreement):**
```
Contract with consequences if SLO not met

Example:
- SLO: 99.9% availability
- SLA: If availability < 99.9%, customers get 10% credit

SLA ≤ SLO (leave buffer for incidents)
```

**Error Budget:**
```
Allowed failure to meet SLO = (100% - SLO target)

Example:
SLO: 99.9% availability
Error budget: 0.1% = 43.8 minutes downtime per month

Error budget consumed:
- Outages
- Slow responses
- Failed requests

When error budget exhausted:
- Freeze feature deployments
- Focus on reliability
- Only critical fixes deployed

Benefits:
- Balances innovation vs stability
- Data-driven deployment decisions
- Aligns engineering priorities
```

### Implementing SLO Monitoring

**Prometheus + Grafana:**
```
# SLI: Availability
availability_sli = (
    sum(rate(http_requests_total{status!~"5.."}[30d]))
    /
    sum(rate(http_requests_total[30d]))
) * 100

# SLI: Latency
latency_sli = histogram_quantile(
    0.99,
    rate(http_request_duration_seconds_bucket[30d])
)

# Error Budget
error_budget_remaining = (
    1 - (target_slo / 100)
) - (
    1 - (availability_sli / 100)
)

Alert when error budget < 10%:
alert: ErrorBudgetCritical
expr: error_budget_remaining < 0.1
annotations:
  summary: "Error budget critically low"
  description: "Only 10% error budget remaining. Freeze deployments."
```

## Alerting Strategies

### Alert Levels

**Critical (Page immediately):**
```
Conditions:
- Service completely down
- Error rate > 50%
- Data loss occurring
- SLO burn rate critical

Actions:
- Page on-call engineer
- Incident created automatically
- Escalate if not acknowledged in 5 min

Example:
alert: ServiceDown
expr: up{service="payment-service"} == 0
for: 1m
severity: critical
```

**Warning (Investigate soon):**
```
Conditions:
- Elevated error rate (5-10%)
- Latency degraded (p99 > 500ms)
- Queue depth increasing
- Error budget < 25%

Actions:
- Slack notification
- Create ticket
- Investigate during business hours

Example:
alert: HighErrorRate
expr: rate(http_requests_total{status="500"}[5m]) > 0.05
for: 10m
severity: warning
```

**Info (Awareness):**
```
Conditions:
- Deployment completed
- Scaling event
- Configuration changed
- Capacity threshold reached

Actions:
- Log to monitoring system
- Dashboard annotation
- Optional Slack notification
```

### Alert Best Practices

**Actionable Alerts:**
```
Bad Alert:
"High CPU usage"

Good Alert:
"CPU usage > 80% on order-service-pod-abc for 10 minutes
Runbook: https://wiki.company.com/runbooks/high-cpu
Likely cause: Memory leak or infinite loop
Actions: 1) Check recent deployments 2) Review logs for exceptions 3) Consider rolling back"

Include:
✓ What is wrong
✓ Why it matters
✓ How to investigate
✓ Runbook link
✓ Suggested actions
```

**Avoid Alert Fatigue:**
```
Problems:
- Too many alerts
- False positives
- Non-actionable alerts
- Duplicate alerts

Solutions:
- Alert on symptoms, not causes
- Proper thresholds and durations
- Alert aggregation (don't alert per pod, alert per service)
- Regular alert review and tuning
- Auto-resolve alerts
- Silence during maintenance

Good Practice:
for: 5m  # Don't alert on transient spikes
group_by: [service]  # Aggregate per service
group_wait: 30s  # Wait before sending
group_interval: 5m  # Batch notifications
```

## Observability Stack

### Recommended Tools

**Metrics:**
```
Collection: Prometheus
- Pull-based metrics
- Time-series database
- Powerful query language (PromQL)
- Service discovery

Visualization: Grafana
- Beautiful dashboards
- Alerting integration
- Multiple data sources
- Template variables

Alternative: Datadog, New Relic, CloudWatch
```

**Logs:**
```
Aggregation: ELK Stack
- Elasticsearch (storage & search)
- Logstash / Fluentd (collection)
- Kibana (visualization)

Or: Loki (lightweight alternative)
- Integrates with Grafana
- Labels instead of full-text indexing
- Lower resource usage

Alternative: Splunk, Datadog, CloudWatch Logs
```

**Tracing:**
```
Backend: Jaeger or Zipkin
- Trace storage
- Trace visualization
- Dependency graphs
- Performance analysis

Instrumentation: OpenTelemetry
- Vendor-neutral standard
- Auto-instrumentation for common frameworks
- Manual instrumentation API
- Export to any backend

Alternative: Datadog APM, New Relic, Lightstep
```

**All-in-One:**
```
Observability platforms:
- Datadog (metrics, logs, traces, RUM)
- New Relic (APM, logs, infrastructure)
- Dynatrace (auto-instrumentation, AI)

Pros:
- Unified experience
- Correlated data
- Easier setup

Cons:
- Vendor lock-in
- Higher cost
- Less flexibility
```

### Implementation Checklist

**For Each Service:**
```
✓ Structured logging with correlation IDs
✓ Metrics exported (Prometheus format)
✓ Distributed tracing instrumented
✓ Health check endpoints (/health/live, /health/ready)
✓ Graceful shutdown handling
✓ Resource limits set (CPU, memory)
✓ Alerts configured for critical paths
✓ Dashboards created
✓ Runbooks documented
✓ On-call rotation established
```

**For System-Wide:**
```
✓ Centralized log aggregation
✓ Distributed tracing backend
✓ Metrics aggregation and storage
✓ Unified dashboards (service overview)
✓ Alert routing configured
✓ Incident management process
✓ Post-mortem template
✓ SLO definitions and tracking
✓ Dependency mapping
✓ Chaos engineering experiments
```

## Troubleshooting Workflow

**Incident Response:**
```
1. Detect (Alert fires)
   - Check dashboard
   - Verify alert is valid
   - Assess impact

2. Triage (Determine severity)
   - Critical: Page on-call
   - Warning: Create ticket
   - How many users affected?
   - What functionality broken?

3. Investigate (Find root cause)
   - Check recent deployments
   - Review logs (search by correlation ID)
   - Analyze traces (slow operations)
   - Check metrics (resource saturation)
   - Examine dependencies

4. Mitigate (Stop the bleeding)
   - Rollback deployment
   - Scale up resources
   - Failover to backup
   - Enable circuit breakers
   - Rate limit traffic

5. Resolve (Fix root cause)
   - Deploy fix
   - Verify resolution
   - Monitor for recurrence

6. Post-mortem (Learn and improve)
   - Timeline of events
   - Root cause analysis
   - Action items
   - Update runbooks
```

**Using Traces to Debug:**
```
Scenario: API returning 500 errors

1. Find failing trace:
   - Filter: status = error, service = api-gateway
   - Sort by timestamp (most recent)

2. Analyze span waterfall:
   - Identify which service failed (order-service returned 500)
   - Check error message in span
   - Review span attributes

3. Correlate with logs:
   - Extract trace ID from failed trace
   - Search logs: traceId:"trace-abc123"
   - Find exception stack trace

4. Check related metrics:
   - order-service error rate spiked 10 min ago
   - Corresponds with deployment
   - Likely cause: Bad deployment

5. Remediate:
   - Rollback order-service
   - Verify errors stopped
   - Create ticket for bug fix
```

## Summary

Observability is non-negotiable in microservices:

**Must-Haves:**
- Structured logging with correlation IDs
- Metrics (RED/USE methodology)
- Distributed tracing (OpenTelemetry)
- Centralized log aggregation
- SLO tracking with error budgets
- Actionable alerts with runbooks

**Best Practices:**
- Correlate metrics, logs, and traces
- Define SLOs based on user experience
- Alert on symptoms, not causes
- Maintain runbooks for common issues
- Regular post-mortems and learning
- Practice incident response with game days

Without observability, you're flying blind in production.
{% endraw %}
