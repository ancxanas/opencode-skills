---
render_with_liquid: false
---

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

## Docker Configuration

```dockerfile
# Dockerfile (Multi-stage)
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","com.example.Application"]
```

## Boot 4 Actuator Changes

- `/actuator/info` now includes OS and process information by default
- `spring-boot-starter-opentelemetry` replaces manual Micrometer + Zipkin wiring
- Actuator probes (liveness/readiness) configured out of the box for Kubernetes

## Quick Reference

| Component | Purpose |
|---
{% raw %}
--------|---------|
| **Config Server** | Centralized configuration management |
| **Eureka** | Service discovery and registration |
| **Gateway** | API gateway with routing, filtering, load balancing |
| **Circuit Breaker** | Fault tolerance via Resilience4j |
| **Load Balancer** | Client-side load balancing (Spring Cloud LoadBalancer) |
| **OpenTelemetry** | Unified metrics, traces, and logs via `spring-boot-starter-opentelemetry` |
| **Actuator** | Production-ready monitoring and management |
| **Kubernetes** | Container orchestration and deployment |

{% endraw %}
