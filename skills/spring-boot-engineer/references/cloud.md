# Cloud Native - Spring Cloud 2025.1 (Oakwood)

Spring Cloud 2025.1 (Oakwood) is aligned with Spring Boot 4, adopting Jakarta EE 11, Jackson 3, and JSpecify null-safety.

## Spring Cloud Config Server

```java
// Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

// application.yml
server:
  port: 8888

spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/example/config-repo
          default-label: main
          search-paths: '{application}'
          username: ${GIT_USERNAME}
          password: ${GIT_PASSWORD}
        native:
          search-locations: classpath:/config
  security:
    user:
      name: config-user
      password: ${CONFIG_PASSWORD}

// Config Client
@SpringBootApplication
public class ClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClientApplication.class, args);
    }
}

// application.yml (Config Client)
spring:
  application:
    name: user-service
  config:
    import: "configserver:http://localhost:8888"
  cloud:
    config:
      username: config-user
      password: ${CONFIG_PASSWORD}
      fail-fast: true
      retry:
        max-attempts: 6
        initial-interval: 1000
```

## Dynamic Configuration Refresh

```java
@RestController
@RefreshScope
public class ConfigController {
    @Value("${app.feature.enabled:false}")
    private boolean featureEnabled;

    @Value("${app.max-connections:100}")
    private int maxConnections;

    @GetMapping("/config")
    public Map<String, Object> getConfig() {
        return Map.of(
            "featureEnabled", featureEnabled,
            "maxConnections", maxConnections
        );
    }
}

// Refresh configuration via Actuator endpoint:
// POST /actuator/refresh
```

## Service Discovery - Eureka

```java
// Eureka Server
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

// application.yml (Eureka Server)
server:
  port: 8761

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/

// Eureka Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

// application.yml (Eureka Client)
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    registry-fetch-interval-seconds: 5
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 10
    lease-expiration-duration-in-seconds: 30
```

## Spring Cloud Gateway

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .rewritePath("/api/users/(?<segment>.*)", "/users/${segment}")
                    .addRequestHeader("X-Gateway", "Spring-Cloud-Gateway")
                    .circuitBreaker(config -> config
                        .setName("userServiceCircuitBreaker")
                        .setFallbackUri("forward:/fallback/users")
                    )
                    .retry(config -> config
                        .setRetries(3)
                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                    )
                )
                .uri("lb://user-service")
            )
            .route("order-service", r -> r
                .path("/api/orders/**")
                .filters(f -> f
                    .rewritePath("/api/orders/(?<segment>.*)", "/orders/${segment}")
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver())
                    )
                )
                .uri("lb://order-service")
            )
            .build();
    }

    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(10, 20); // replenishRate, burstCapacity
    }

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getHeaders().getFirst("X-User-Id")
        );
    }
}

// application.yml (Gateway)
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Origin
      globalcors:
        cors-configurations:
          '[/**]':
            allowed-origins: "*"
            allowed-methods:
              - GET
              - POST
              - PUT
              - DELETE
            allowed-headers: "*"
```

## Circuit Breaker - Resilience4j

```java
@Service
@RequiredArgsConstructor
public class ExternalApiService {
    private final WebClient webClient;

    @CircuitBreaker(name = "externalApi", fallbackMethod = "getFallbackData")
    @Retry(name = "externalApi")
    @RateLimiter(name = "externalApi")
    public Mono<ExternalData> getData(String id) {
        return webClient
            .get()
            .uri("/data/{id}", id)
            .retrieve()
            .bodyToMono(ExternalData.class)
            .timeout(Duration.ofSeconds(3));
    }

    private Mono<ExternalData> getFallbackData(String id, Exception e) {
        log.warn("Fallback triggered for id: {}, error: {}", id, e.getMessage());
        return Mono.just(new ExternalData(id, "Fallback data", LocalDateTime.now()));
    }
}

// application.yml
resilience4j:
  circuitbreaker:
    instances:
      externalApi:
        register-health-indicator: true
        sliding-window-size: 10
        minimum-number-of-calls: 5
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
        wait-duration-in-open-state: 5s
        failure-rate-threshold: 50
        event-consumer-buffer-size: 10

  retry:
    instances:
      externalApi:
        max-attempts: 3
        wait-duration: 1s
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2

  ratelimiter:
    instances:
      externalApi:
        limit-for-period: 10
        limit-refresh-period: 1s
        timeout-duration: 0s
```

## Observability - OpenTelemetry Starter

Boot 4 ships `spring-boot-starter-opentelemetry` — single dependency for metrics, traces, and logs:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-opentelemetry</artifactId>
</dependency>
```

```yaml
# application.yml
management:
  tracing:
    sampling:
      probability: 1.0
  otlp:
    tracing:
      endpoint: http://localhost:4318/v1/traces
    metrics:
      endpoint: http://localhost:4318/v1/metrics

logging:
  pattern:
    level: "%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]"
```

Custom spans use OpenTelemetry's `Span` API directly (no Micrometer Tracing Tracer needed):

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OpenTelemetry openTelemetry;

    public Order processOrder(OrderRequest request) {
        var tracer = openTelemetry.getTracer("order-service");
        var span = tracer.spanBuilder("processOrder")
            .startSpan();
        try (var ignored = span.makeCurrent()) {
            span.setAttribute("order.type", request.type());
            span.addEvent("order.created");

            Order order = createOrder(request);
            return order;
        } finally {
            span.end();
        }
    }
}
```

## Load Balancing with Spring Cloud LoadBalancer

```java
@Configuration
@LoadBalancerClient(name = "user-service", configuration = UserServiceLoadBalancerConfig.class)
public class LoadBalancerConfiguration {
}

@Configuration
public class UserServiceLoadBalancerConfig {

    @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(
            LoadBalancerClientFactory clientFactory,
            ObjectProvider<LoadBalancerProperties> properties) {
        return new RandomLoadBalancer(
            clientFactory.getLazyProvider("user-service", ServiceInstanceListSupplier.class),
            "user-service"
        );
    }
}

@Service
@RequiredArgsConstructor
public class UserClientService {
    private final WebClient.Builder webClientBuilder;

    public Mono<User> getUser(Long id) {
        return webClientBuilder
            .baseUrl("http://user-service")
            .build()
            .get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

## Health Checks & Actuator

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        boolean serviceUp = checkExternalService();

        if (serviceUp) {
            return Health.up()
                .withDetail("externalService", "Available")
                .withDetail("timestamp", LocalDateTime.now())
                .build();
        } else {
            return Health.down()
                .withDetail("externalService", "Unavailable")
                .withDetail("error", "Connection timeout")
                .build();
        }
    }

    private boolean checkExternalService() {
        // Check external dependency
        return true;
    }
}

// application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: ${spring.application.name}
```

## Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "kubernetes"
        - name: JAVA_OPTS
          value: "-Xmx512m -Xms256m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
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
|-----------|---------|
| **Config Server** | Centralized configuration management |
| **Eureka** | Service discovery and registration |
| **Gateway** | API gateway with routing, filtering, load balancing |
| **Circuit Breaker** | Fault tolerance via Resilience4j |
| **Load Balancer** | Client-side load balancing (Spring Cloud LoadBalancer) |
| **OpenTelemetry** | Unified metrics, traces, and logs via `spring-boot-starter-opentelemetry` |
| **Actuator** | Production-ready monitoring and management |
| **Kubernetes** | Container orchestration and deployment |
