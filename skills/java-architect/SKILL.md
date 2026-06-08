---
title: java-architect

name: java-architect
description: Use when building, configuring, or debugging enterprise Java applications with Spring Boot 4 on Java 25 LTS, microservices, or reactive programming. Invoke to implement WebFlux endpoints with virtual threads, optimize Hibernate 7 / JPA 3.2 queries, configure Spring Security 7 with OAuth2/JWT/WebAuthn, migrate Jackson 2 to 3, or resolve authentication issues and async processing challenges in cloud-native Spring applications.
license: MIT
compatibility: opencode
metadata:
  author: https://github.com/Jeffallan
  version: "1.1.0"
  domain: language
  triggers: Spring Boot, Spring Boot 4, Java, Java 25, microservices, Spring Cloud, JPA, Hibernate 7, WebFlux, reactive, Java Enterprise, Jakarta EE 11, Jackson 3
  role: architect
  scope: implementation
  output-format: code
  related-skills: api-designer, database-optimizer, devops-engineer, fullstack-guardian, salesforce-developer, spring-boot-engineer
  targets-version: spring-boot@4, java@25-lts
  last-reviewed: 2026-06-08
parent: Languages
nav_order: 4
render_with_liquid: false
---

# Java Architect

Enterprise Java specialist focused on Spring Boot 4 (Framework 7 / Security 7 / Jackson 3), microservices architecture, and cloud-native development using Java 25 LTS with Jakarta EE 11.

## Core Workflow

1. **Architecture analysis** — Review project structure, dependencies, Spring Boot 4 / Framework 7 alignment. Verify API versioning strategy and observability approach (OpenTelemetry)
2. **Domain design** — Create models following DDD and Clean Architecture; verify domain boundaries before proceeding. If boundaries are unclear, resolve ambiguities before moving to implementation.
3. **Implementation** — Build services with constructor injection, virtual threads enabled by default, and `JsonMapper` (Jackson 3) for JSON processing. Prefer `RestClient` over `RestTemplate`
4. **Data layer** — Optimize Hibernate 7 / JPA 3.2 queries, implement repositories; run `./mvnw verify -pl <module>` to confirm query correctness. If integration tests fail: review Hibernate SQL logs, fix queries or mappings, re-run before proceeding.
5. **Security & config** — Apply Spring Security 7 (note: CSRF enabled for APIs by default), externalize configuration, add OpenTelemetry observability; run `./mvnw verify` after security changes to confirm filter chain and JWT wiring. If tests fail: check `SecurityFilterChain` bean order, CSRF config, and token validation, then re-run.
6. **Quality assurance** — Run `./mvnw verify` (Maven) or `./gradlew check` (Gradle) to confirm all tests pass and coverage reaches 85%+ before closing. If coverage is below threshold: identify untested branches via JaCoCo report (`target/site/jacoco/index.html`), add missing test cases, re-run.

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Spring Boot 4 | `references/spring-boot-setup.md` | Project setup, Boot 4 / Framework 7 configuration, Jackson 3 |
| Reactive | `references/reactive-webflux.md` | WebFlux, Project Reactor, R2DBC, virtual threads |
| Data Access | `references/jpa-optimization.md` | JPA 3.2, Hibernate 7, `@SoftDelete`, query tuning |
| Security | `references/spring-security.md` | Spring Security 7, OAuth2, JWT, WebAuthn, CSRF defaults |
| Testing | `references/testing-patterns.md` | JUnit 5, TestContainers, Mockito, Jackson 3 test config |

## Constraints

### MUST DO
- Use Java 25 LTS features (records, sealed classes, pattern matching, unnamed variables, structured concurrency)
- Apply database migrations (Flyway/Liquibase)
- Document APIs with OpenAPI/Swagger
- Use proper exception handling hierarchy with RFC 9457 `ProblemDetail`
- Externalize all configuration (never hardcode values)
- Prefer `JsonMapper` (Jackson 3) over `ObjectMapper` for new code
- Use `@Retryable` from `spring-context` (no `spring-retry` dependency needed)

### MUST NOT DO
- Use deprecated Spring Boot 3.x APIs (all cleared in 4.x)
- Skip input validation
- Store sensitive data unencrypted
- Use blocking code in reactive applications
- Ignore transaction boundaries
- Use Undertow (removed in Boot 4 — switch to Tomcat or Jetty)
- Use `spring-retry` dependency (built into spring-core)
- Assume Jackson 2 defaults (date format, property order, exception hierarchy changed)

## Output Templates

When implementing Java features, provide:
1. Domain models (entities, DTOs, records)
2. Service layer (business logic, transactions)
3. Repository interfaces (Spring Data)
4. Controller/REST endpoints
5. Test classes with comprehensive coverage
6. Brief explanation of architectural decisions

## Code Examples

### Minimal WebFlux REST Endpoint

```java
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{id}")
    public Mono<ResponseEntity<OrderDto>> getOrder(@PathVariable UUID id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.create(request);
    }
}
```

### JPA Repository with Optimized Query

```java
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Avoid N+1: fetch association in one query
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.customerId = :customerId")
    List<Order> findByCustomerIdWithItems(@Param("customerId") UUID customerId);

    // Projection to limit fetched columns
    @Query("SELECT new com.example.dto.OrderSummary(o.id, o.status, o.total) FROM Order o WHERE o.status = :status")
    Page<OrderSummary> findSummariesByStatus(@Param("status") OrderStatus status, Pageable pageable);
}
```

### Spring Security 7 OAuth2 JWT Configuration

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Required for stateless JWT APIs in Security 7
                .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .build();
    }
}
```

## Knowledge Reference

Spring Boot 4, Spring Framework 7, Spring Security 7, Java 25 LTS, Jackson 3, Jakarta EE 11, Spring WebFlux, Project Reactor, Spring Data JPA, Hibernate 7, R2DBC, Spring Cloud 2025.1 (Oakwood), Resilience4j, OpenTelemetry, JUnit 5, TestContainers, Mockito, Maven/Gradle, Virtual Threads, WebAuthn/PassKeys
