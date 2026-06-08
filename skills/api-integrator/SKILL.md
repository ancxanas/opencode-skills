---
title: api-integrator

name: api-integrator
description: Build API clients, integrate third-party APIs, implement webhook handlers, and design data ingestion pipelines. Use when consuming REST or GraphQL APIs, implementing retry and backoff strategies, verifying webhook signatures, paginating through large datasets, or building ETL sync workflows.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: backend
  triggers: API integration, API client, webhook, ETL, data ingestion, third-party API, REST client, GraphQL client, retry strategy, backoff, rate limiting, webhook verification, data sync, API pagination, OAuth client, external API, API wrapper
  role: specialist
  scope: implementation
  output-format: code
  related-skills: api-designer, python-pro, typescript-pro, fastapi-expert, nestjs-expert, monitoring-expert, security-reviewer
parent: Backend
nav_order: 1
render_with_liquid: false
---

# API Integrator

Senior API integration engineer with deep expertise in consuming third-party APIs, building robust API clients, implementing webhook handlers, and designing reliable data ingestion pipelines.

## When to Use

- Building a client SDK or wrapper for an external API
- Implementing webhook receivers with signature verification
- Handling API pagination through large result sets
- Adding retry logic with exponential backoff and jitter
- Managing rate limits (429 responses, token bucket tracking)
- Designing ETL or data sync pipelines
- Implementing OAuth client flows for API access

## When NOT to Use

- Designing an API (server side) — use api-designer
- Building a GraphQL schema — use graphql-architect
- Simple fetch calls without reliability patterns

## Retry & Backoff Strategy

### Exponential Backoff with Jitter

```typescript
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) return response.json();

    if (attempt === maxRetries || !isRetryable(response.status)) {
      throw new ApiError(response.status, await response.text());
    }

    const delay = calculateDelay(attempt);
    await sleep(delay);
  }
  throw new Error('Unreachable');
}

function calculateDelay(attempt: number): number {
  const base = 1000; // 1 second
  const cap = 30000; // 30 seconds
  const exponential = Math.min(cap, base * Math.pow(2, attempt));
  // Full jitter: random between 0 and exponential
  return Math.random() * exponential;
}
```

### Retryable Status Codes

| Code | Retry? | Notes |
|------|--------|-------|
| 429 | Yes | Rate limited — retry after `Retry-After` header |
| 500 | Maybe | Server error — could be transient |
| 502 | Yes | Bad gateway — upstream issue |
| 503 | Yes | Service unavailable — usually temporary |
| 504 | Yes | Gateway timeout |
| 4xx (other) | No | Client error — fix request |

## Rate Limiting

### Token Bucket Pattern

```typescript
class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private maxTokens: number, private refillRate: number) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate * 1000;
      await sleep(waitTime);
      this.refill();
    }
    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}
```

### Handling 429

```typescript
if (response.status === 429) {
  const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
  await sleep(retryAfter * 1000);
  return fetchWithRetry(url, options, remainingRetries - 1);
}
```

## Pagination

### Cursor-based

```typescript
async function fetchAll<T>(baseUrl: string): Promise<T[]> {
  const results: T[] = [];
  let cursor: string | null = null;

  do {
    const url = cursor
      ? `${baseUrl}?cursor=${cursor}`
      : baseUrl;
    const response: Page<T> = await fetchWithRetry(url);
    results.push(...response.data);
    cursor = response.nextCursor;
  } while (cursor);

  return results;
}
```

### Offset-based

```typescript
async function fetchAllOffset<T>(baseUrl: string, limit = 100): Promise<T[]> {
  const results: T[] = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const response: Page<T> = await fetchWithRetry(
      `${baseUrl}?limit=${limit}&offset=${offset}`
    );
    results.push(...response.data);
    total = response.total;
    offset += limit;
  }

  return results;
}
```

## Webhook Handling

### Signature Verification

```typescript
import { createHmac, timingSafeEqual } from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
```

### Idempotency

```typescript
const processedIds = new Set<string>();

async function handleWebhook(payload: WebhookPayload): Promise<void> {
  if (processedIds.has(payload.id)) {
    return; // Already processed
  }
  processedIds.add(payload.id);
  // Process webhook
}
```

Use persistent storage (Redis, DB) for idempotency keys, not in-memory set.

## ETL Pipeline Patterns

### Extract

```typescript
async function extract(source: string, lastSync: Date): Promise<Record[]> {
  return fetchAll(`${source}?updated_since=${lastSync.toISOString()}`);
}
```

### Transform

```typescript
function transform(records: Record[]): Transformed[] {
  return records.map(record => ({
    id: record.id,
    name: record.name,
    email: record.email?.toLowerCase(),
    createdAt: new Date(record.created_at),
  }));
}
```

### Load

```typescript
async function load(records: Transformed[], destination: string): Promise<void> {
  // Batch upsert
  for (const batch of chunks(records, 100)) {
    await fetch(`${destination}/bulk`, {
      method: 'POST',
      body: JSON.stringify(batch),
    });
  }
}
```

## OAuth Client Flows

### Authorization Code + PKCE

```typescript
async function initiateOAuth(clientId: string, redirectUri: string): Promise<string> {
  const verifier = generatePKCEVerifier();
  const challenge = await sha256(verifier);
  // Store verifier in session for callback
  sessionStorage.setItem('pkce_verifier', verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    scope: 'read write',
  });

  return `https://provider.com/oauth/authorize?${params}`;
}
```

## Observability

```typescript
interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  retryCount: number;
}
```

Log every API call with duration, status, and retry count. Track error rates per endpoint and alert on spikes.
