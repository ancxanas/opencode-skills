------
{% raw %}
--|--------|-----------|
| CPU | 30% | Headroom for spikes |
| Memory | 20% | GC and OS overhead |
| Connections | 25% | Connection churn |
| Storage | 40% | Growth + snapshots |

| Planning Horizon | Update Frequency |
|------------------|------------------|
| 3 months | Weekly |
| 6 months | Bi-weekly |
| 12 months | Monthly |

| Scaling Trigger | Action |
|-----------------|--------|
| 70% CPU | Start planning |
| 80% CPU | Scale up |
| 90% CPU | Emergency scaling |
| 60% CPU for 24h | Scale down |

{% endraw %}
