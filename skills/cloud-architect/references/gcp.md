------
{% raw %}
---|-----|-----|------|
| Active-Active Multi-Region | Seconds | Seconds | High |
| Active-Passive with Replication | Minutes | Minutes | Medium |
| Warm Standby | Minutes | 10-30 min | Medium |
| Backup and Restore | Hours | Hours | Low |

**Cloud SQL HA**
- Regional configuration with synchronous replication
- Automatic failover
- 99.95% SLA (vs 99.5% for single zone)

**Cloud Spanner**
- Multi-region configuration
- 99.999% availability SLA
- Synchronous replication across regions

### Disaster Recovery Testing

- Regular DR drills (quarterly recommended)
- Document runbooks
- Test restoration procedures
- Measure actual RTO/RPO vs targets

## Monitoring and Observability

### Cloud Monitoring (formerly Stackdriver)

**Metrics**
- System metrics (CPU, memory, disk, network)
- Custom metrics via Cloud Monitoring API
- Metric scopes for multi-project monitoring
- Uptime checks for availability

**Dashboards and Charts**
- Predefined dashboards for GCP services
- Custom dashboards with filters and grouping
- SLO monitoring with error budgets

### Cloud Logging

**Log Types**
- Admin Activity logs (always enabled, no charge)
- Data Access logs (must be enabled)
- System Event logs
- Access Transparency logs (for Google access)

**Log Sinks**
- Route logs to BigQuery, Cloud Storage, Pub/Sub
- Aggregated sinks at organization/folder level
- Exclusion filters to reduce costs

### Cloud Trace

**Distributed Tracing**
- Automatic instrumentation for App Engine, Cloud Run, GKE
- Manual instrumentation with client libraries
- Latency analysis and performance insights
- Integration with Zipkin

### Cloud Profiler

**Continuous Profiling**
- CPU and memory profiling
- Low overhead (< 0.5% CPU)
- Flame graphs for visualization
- Supported languages: Java, Go, Python, Node.js

### Error Reporting

**Aggregated Error Tracking**
- Automatic error grouping
- Stack trace analysis
- Integration with Cloud Logging
- Notifications for new errors
{% endraw %}
