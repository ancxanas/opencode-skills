# Architecture Decision Record Template

## ADR-NNN: Title

**Status**: Proposed | Accepted | Deprecated | Superseded
**Date**: YYYY-MM-DD

### Context
What is the problem or opportunity? What forces are at play? What constraints exist?

### Decision
What is the change being made? Be specific. Name the technology, pattern, or approach.

### Consequences
- **Positive**: What improves? (performance, maintainability, scalability, etc.)
- **Negative**: What trade-offs exist? (complexity, cost, lock-in, etc.)
- **Neutral**: What else changes? (team skills, deployment, monitoring)

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

### References
- Links to RFCs, docs, related ADRs

---

## Common Backend Architecture Patterns

| Pattern | Problem It Solves | When to Use |
|---------|-------------------|-------------|
| **Repository** | Abstracts data access | Multiple data sources or testing needs |
| **Service Layer** | Business logic organization | Complex domain logic |
| **CQRS** | Separate read/write models | Different read vs write perf needs |
| **Event Sourcing** | Audit trail / rebuild state | Financial, audit, event-driven |
| **Saga** | Distributed transaction | Multi-service workflows |
| **Outbox** | Reliable message publishing | DB + message queue consistency |
| **Circuit Breaker** | Fail-fast on dependency | External service calls |
| **Bulkhead** | Isolate failure domains | Multi-tenant, mixed-criticality |
| **Strangler Fig** | Incremental migration | Legacy system replacement |

## API Design Decision Tree

```
Who is the primary consumer?
├── External developers / 3rd party → REST or GraphQL (schema-first)
├── Internal SPA / mobile app → REST or GraphQL (code-first)
├── Service-to-service inside cluster → gRPC
├── Real-time / streaming → WebSocket, SSE, or gRPC streams
└── Browser extensions / plugins → REST + CORS

Is consistency more important than flexibility?
├── Yes → REST (POST/PUT/PATCH/DELETE semantics)
└── No → GraphQL (client-driven queries)

Do you need event-driven communication?
├── Yes → Message queue (RabbitMQ, Kafka, SQS/SNS)
└── No → Direct HTTP (synchronous) or gRPC
```
