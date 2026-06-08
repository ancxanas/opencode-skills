------
{% raw %}
----|----------|---------|
| `critical` | Page immediately | Service down, data loss |
| `warning` | Investigate soon | High latency, low disk |
| `info` | Check in morning | Unusual traffic pattern |

## Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  slack_api_url: 'https://hooks.slack.com/...'

route:
  receiver: 'slack-notifications'
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack-notifications'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'your-key'
```

## Quick Reference

| Field | Purpose |
|-------|---------|
| `expr` | PromQL query |
| `for` | Duration before firing |
| `labels` | Classification (severity) |
| `annotations` | Human-readable info |

| Threshold | Use |
|-----------|-----|
| Error rate > 5% | Critical |
| p95 latency > 1s | Warning |
| Disk < 10% | Critical |
| Memory > 90% | Warning |

{% endraw %}
