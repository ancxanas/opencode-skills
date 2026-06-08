# Retry & Backoff Strategies Reference

## Algorithm Comparison

| Strategy | Formula | jitter | Total Time (10 retries) | Use Case |
|----------|---------|--------|------------------------|----------|
| Fixed | `delay = C` | None | `10 × C` | Rate-limited APIs with known window |
| Linear | `delay = C × attempt` | None | `55 × C` | Gradual backoff |
| Exponential | `delay = 2^attempt × C` | None | `1023 × C` | General purpose |
| Exp + Full Jitter | `delay = random(0, 2^attempt × C)` | Full | ~`511 × C` | Avoid thundering herd |
| Exp + Equal Jitter | `delay = random(0.5 × 2^attempt × C, 1.5 × 2^attempt × C)` | Equal | ~`1023 × C` | Balance retry spread |
| Exp + Decorrelated | `delay = min(cap, random(C, prev × 3))` | Decorrelated | Variable | AWS SDK default |

Where `C` = base delay, `cap` = maximum delay.

## Retry Decision Logic

```
Is error retryable?
├── 5xx (except 501) → Yes
├── 429 (Rate Limited) → Yes (respect Retry-After)
├── 408 (Request Timeout) → Yes
├── Connection errors (ECONNRESET, ETIMEDOUT, DNS) → Yes
├── 4xx (except 408, 429) → No
└── Idempotent method (GET, PUT, DELETE, PATCH) → Yes
    Non-idempotent method (POST) → Only if retry-safe header
```

## Status Code Handling

| Code | Meaning | Retry? | Notes |
|------|---------|--------|-------|
| 200 | OK | No | |
| 201 | Created | No | |
| 204 | No Content | No | |
| 400 | Bad Request | No | Client error, fix payload |
| 401 | Unauthorized | Refresh token, retry once | |
| 403 | Forbidden | No | Auth issue |
| 404 | Not Found | No | Unless eventually consistent |
| 408 | Timeout | Yes | Default 3 attempts |
| 409 | Conflict | Maybe | If optimistic locking |
| 412 | Precondition Failed | Maybe | If etag-based |
| 429 | Rate Limited | Yes | Respect `Retry-After` header |
| 500 | Server Error | Yes | |
| 502 | Bad Gateway | Yes | Upstream issue |
| 503 | Service Unavailable | Yes | Respect `Retry-After` |
| 504 | Gateway Timeout | Yes | |

## Circuit Breaker States
```
Closed → (failures > threshold) → Open → (timeout) → Half-Open → (success) → Closed
                                           → (failure) → Open
```

## Common Implementations

### Python (tenacity)
```python
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import httpx

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=60),
    retry=retry_if_exception_type(httpx.HTTPStatusError),
)
def fetch(url: str) -> httpx.Response:
    ...
```

### TypeScript
```typescript
async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts: number; baseDelayMs: number; maxDelayMs: number }
): Promise<T> {
  for (let i = 0; i < options.attempts; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === options.attempts - 1) throw e;
      const delay = Math.min(options.baseDelayMs * Math.pow(2, i), options.maxDelayMs);
      const jittered = delay * (0.5 + Math.random());
      await new Promise(r => setTimeout(r, jittered));
    }
  }
}
```
