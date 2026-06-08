------
{% raw %}
-|----------|
| `error` | Failures needing attention |
| `warn` | Potential problems |
| `info` | Business events, requests |
| `debug` | Development details |
| `trace` | Verbose debugging |

## Best Practices

```typescript
// Good: Structured fields
logger.info({ event: 'order.created', orderId: '123', total: 99.99 });

// Bad: String interpolation
logger.info(`Order 123 created with total 99.99`);

// Good: Consistent event names
logger.info({ event: 'user.registered' });
logger.info({ event: 'user.login' });
logger.info({ event: 'user.logout' });

// Good: Include correlation ID
logger.info({ event: 'request.processed', requestId, userId });
```

## Quick Reference

| Field | Purpose |
|-------|---------|
| `event` | Event name |
| `requestId` | Correlation ID |
| `userId` | User context |
| `duration` | Timing info |
| `error` / `stack` | Error details |
| `timestamp` | When (auto-added) |

| Library | Language |
|---------|----------|
| pino | Node.js |
| structlog | Python |
| slog | Go |
| logrus | Go |

{% endraw %}
