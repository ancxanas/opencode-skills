---
title: backend-expert

name: backend-expert
description: Design and build production-grade backend systems, APIs, and data pipelines. Use when architecting microservices or monoliths, choosing between REST and GraphQL, setting up database schemas and migrations, implementing caching layers, designing async job queues, structuring error handling, or configuring observability. Covers architecture decisions, not framework-specific implementation — pair with framework skills (nestjs-expert, fastapi-expert, django-expert, spring-boot-engineer) for code-level work.
license: MIT
compatibility: opencode
metadata:
  domain: backend
  triggers: backend architecture, API design, monolith, microservices, REST, GraphQL, database schema, caching, Redis, job queue, message queue, error handling, logging, observability, health check, migration, CI/CD, backend patterns, service layer, repository pattern, dependency injection
  role: architect
  scope: design
  output-format: architecture
  related-skills: api-designer, architecture-designer, microservices-architect, database-optimizer, monitoring-expert, devops-engineer, secure-code-guardian, nestjs-expert, fastapi-expert, django-expert, spring-boot-engineer, postgres-pro, sql-pro
  targets-version: ""
  last-reviewed: 2026-06-08
parent: Backend
nav_order: 2
render_with_liquid: false
---

# Backend Expert

Senior backend architect specializing in production system design, API strategy, data layer architecture, and operational excellence.

## When to Use

- Designing a new backend system from scratch
- Choosing between REST, GraphQL, or gRPC for a service boundary
- Structuring database schemas, migrations, and access patterns
- Adding caching (Redis, CDN) to reduce latency and database load
- Implementing async processing with job or message queues
- Setting up error handling, logging, and observability
- Reviewing or refactoring an existing backend for reliability or performance
- Deciding between monolith, modular monolith, or microservices

## When NOT to Use

- Framework-specific code generation — use `nestjs-expert`, `fastapi-expert`, `django-expert`, or `spring-boot-engineer`
- Database-specific query optimization — use `database-optimizer` or `postgres-pro`
- API specification authoring (OpenAPI, schema-first) — use `api-designer`
- Microservices decomposition and service mesh — use `microservices-architect`
- Security-specific auth flows — use `auth-architect` or `secure-code-guardian`

## Core Workflow

1. **Define boundaries** — Identify services, their responsibilities, and communication patterns (sync REST/gRPC or async events/queues). Document API contracts before writing code.
2. **Design data layer** — Choose database per service (relational, document, KV). Define schema, access patterns, migration strategy, and connection pooling.
3. **Implement service** — Structure handlers → service layer → data access. Add validation, error handling, structured logging, health checks.
4. **Add infrastructure** — Caching (Redis), async processing (queues), rate limiting, observability (metrics, traces, structured logs).
5. **Ship** — `gh pr create` with changelog entry, CI passing, review ready. Use `gh pr review --request` to assign reviewers. After merge, monitor with `gh run watch` on the deploy workflow.

## Architecture Patterns

### Monolith (Starter)
```
src/
  routes/        # HTTP handlers, thin
  services/      # Business logic
  repositories/  # Data access
  middleware/    # Auth, logging, validation
  config/       # Environment, app config
  lib/           # Shared utilities
```
Suitable for teams of 1-10. Deploy as a single unit. Extract boundaries into modules (packages within the same repo) before extracting into separate services.

### Modular Monolith
Same deploy unit, but each domain is a self-contained module with its own routes, services, data access, and tests. Modules communicate through interfaces, not direct imports. Easier to split into microservices later.

### Microservices
Separate deploy units communicating over the network. Each owns its data. Share nothing by default. Use async communication (queues, events) for cross-service workflows; sync (HTTP, gRPC) for queries.

## API Design Principles

- **REST for CRUD** — Resources map to nouns (`/orders`, `/users`). Use standard HTTP methods and status codes.
- **GraphQL for flexible queries** — When clients need different data shapes. Avoid exposing raw database schema through GraphQL.
- **gRPC for internal service-to-service** — Strong typing, streaming, efficient binary protocol. Use protobuf schemas shared across services.
- **Version through contract, not URL** — Add fields, don't remove them. Use `@deprecated` annotations before breaking changes.

## Data Layer

### Database Selection
| Need | Choice |
|------|--------|
| Relational, ACID, joins | PostgreSQL |
| Document, flexible schema | MongoDB |
| Key-value, session, cache | Redis |
| Time-series metrics | Prometheus / VictoriaMetrics |
| Full-text search | Meilisearch / Elasticsearch |

### Migration Strategy
- Use schema migration tools (Alembic for Python, Prisma for TypeScript, Flyway for Java)
- All migrations must be reversible (both `up` and `down` scripts)
- Run migrations as a separate deploy step before the new code ships
- Never mutate migration files after they've been merged

### Connection Pooling
- Set `min=2, max=10` per service instance as a starting point
- Use PgBouncer (or similar) in transaction mode for PostgreSQL
- Monitor `pool_timeout` errors — they indicate connection starvation

## Caching

| Pattern | Use Case | TTL |
|---------|----------|-----|
| Read-through | Expensive queries (reports, aggregations) | Minutes |
| Write-through | High-read, write-persistent data | Hours |
| Cache-aside | General purpose (app manages cache) | Varies |
| Stale-while-revalidate | Public pages, API responses | Background refresh |

- Use Redis for server-side caching. Deploy as a separate service, not embedded.
- Set `maxmemory` with `allkeys-lru` eviction. Monitor cache hit rate — below 80% means the cache strategy needs review.
- Never cache sensitive data (PII, auth tokens) unless encrypted at the application layer.

## Async Processing

### Queues vs Events
| Pattern | Tool | When |
|---------|------|------|
| Job queue (work distribution) | Sidekiq, Celery, Bull | Background processing, scheduled tasks |
| Event bus (pub/sub) | RabbitMQ, Redis Pub/Sub, Kafka | Service-to-service notifications |
| Stream processing | Kafka, Redpanda | Log ingestion, analytics, CDC |

### Queue Best Practices
- Make every job idempotent — running it twice produces the same result as running it once
- Set retry limits with exponential backoff. Dead-letter after N failures.
- Monitor queue depth and job processing latency. Alert on backlog growth.

## Error Handling

### Structured Error Response
```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order ord-123 was not found",
    "details": { "orderId": "ord-123" },
    "requestId": "req-abc-456"
  }
}
```
- Use machine-readable error codes, not just HTTP status codes
- Never expose stack traces or internal state in error responses
- Log full error details server-side; return minimal info to the client

### Validation
- Validate at the boundary (request schema validation) before reaching business logic
- Return all validation errors at once, not one at a time
- Use Zod (TypeScript), Pydantic (Python), or Jakarta Validation (Java)

## Observability

### Three Pillars
| Signal | Tool | What to Capture |
|--------|------|-----------------|
| Logs | Structured JSON to stdout | Request ID, user ID, action, duration, error |
| Metrics | Prometheus + Grafana | RED (Rate/Errors/Duration) per endpoint |
| Traces | OpenTelemetry | Request path across services, db queries, external calls |

### Mandatory Endpoints
- `GET /healthz` — Liveness check (returns 200 if the process is alive)
- `GET /ready` — Readiness check (returns 200 when DB, cache, and downstream dependencies are reachable)
- `GET /metrics` — Prometheus metrics endpoint

### Shipping
- Verify health locally: `curl -f http://localhost:8080/healthz`
- Review recent deploys: `gh run list --limit 5 --json conclusion,headBranch`
- On incident: `gh issue create --label incident` with the structured error info

## Constraints

### MUST DO
- Use structured logging (JSON) from day one
- Add health check endpoints before the first deploy
- Validate all input at the boundary
- Write reversible migrations
- Set resource limits (CPU, memory, connections)
- Use environment variables for all configuration
- Include request IDs in every log line and error response
- Use `gh` for PR management: create with `gh pr create`, request reviews with `gh pr review --request`, check CI with `gh pr checks`

### MUST NOT DO
- Store secrets in code or config files (use a secrets manager)
- Use raw SQL without parameterized queries (risk of SQL injection)
- Ship without health checks or metrics
- Expose internal error details to clients
- Run migrations automatically on deploy without a rollback plan
- Use mutable global state in request handlers
- Ignore connection pool limits

## Output Templates

When designing a backend system, provide:
1. **Architecture diagram** (text or mermaid) showing services, data stores, and communication patterns
2. **API contract** (list of endpoints or GraphQL schema) with request/response shapes
3. **Data model** with schema, indexes, and migration strategy
4. **Infrastructure decisions** — cache layout, queue topology, observability setup
5. **Deployment checklist** — CI/CD, health checks, rollback plan
