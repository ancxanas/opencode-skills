---
name: spring-boot-engineer
description: Generates Spring Boot 4 configurations built on Spring Framework 7 with Spring Security 7 and Jackson 3, creates REST controllers with API versioning, implements Spring Security 7 authentication flows (including WebAuthn/PassKeys), sets up Spring Data JPA with Hibernate 7 on Jakarta EE 11, and configures reactive WebFlux endpoints with virtual threads. Use when building Spring Boot 4 applications, microservices, or reactive Java applications on Java 17+; invoke for Spring Data JPA, Spring Security 7, WebFlux, Spring Cloud 2025.1, declarative HTTP clients (@HttpServiceClient), API versioning, or Jakarta EE 11.
license: MIT
compatibility: opencode
metadata:
  author: https://github.com/Jeffallan
  version: "1.1.0"
  domain: backend
  triggers: Spring Boot, Spring Boot 4, Spring Framework 7, Spring Security 7, Spring Data JPA, Spring WebFlux, Microservices Java, Java REST API, Reactive Java, Jackson 3, Jakarta EE 11, Hibernate 7, @HttpServiceClient, API versioning, virtual threads, OpenTelemetry
  role: specialist
  scope: implementation
  output-format: code
  related-skills: api-designer, database-optimizer, devops-engineer, java-architect, microservices-architect
  targets-version: spring-boot@4
  last-reviewed: 2026-06-08
---

# Spring Boot 4 Engineer

## Stack

| Layer | Version |
|-------|---------|
| Spring Boot | 4.x |
| Spring Framework | 7.x |
| Spring Security | 7.x |
| Jackson | 3.x (`tools.jackson`) |
| Jakarta EE | 11 (Servlet 6.1, JPA 3.2, Bean Validation 3.1) |
| Hibernate | 7.x |
| Java | 17 minimum, 21+ recommended (virtual threads), 25 supported |

## Core Workflow

1. **Analyze requirements** — Identify service boundaries, APIs, data models, security needs
2. **Design architecture** — Plan microservices, data access, cloud integration, API versioning strategy; confirm design before coding
3. **Implement** — Create services with constructor injection and layered architecture (see Quick Start below). Virtual threads are on by default for Tomcat + `@Async` — no configuration needed
4. **Secure** — Add Spring Security 7, OAuth2, WebAuthn/PassKeys, method security, CORS configuration. **CSRF is enabled for API endpoints by default in Security 7** — explicitly disable it for stateless JWT APIs. Verify security rules compile and pass tests. If compilation or tests fail: review error output, fix the failing rule or configuration, and re-run before proceeding
5. **Test** — Write unit, integration, and slice tests with JUnit 5 (JUnit 4 is deprecated in Boot 4). Run `./mvnw test` (or `./gradlew test`) and confirm all pass before proceeding. If tests fail: review the stack trace, isolate the failing assertion or component, fix the issue, and re-run the full suite
6. **Deploy** — Configure health checks and observability via Actuator + `spring-boot-starter-opentelemetry`; validate `/actuator/health` returns `UP`. If health is `DOWN`: check the `components` detail in the response, resolve the failing component (e.g., datasource, broker), and re-validate

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Web Layer | `references/web.md` | Controllers, REST APIs, API versioning, Jackson 3, validation, exception handling |
| Data Access | `references/data.md` | Spring Data JPA, Hibernate 7, repositories, transactions, projections, `@SoftDelete` |
| Security | `references/security.md` | Spring Security 7, OAuth2, JWT, WebAuthn/PassKeys, method security, MFA |
| Cloud Native | `references/cloud.md` | Spring Cloud 2025.1 (Oakwood), Config, Discovery, Gateway, resilience, OpenTelemetry |
| Testing | `references/testing.md` | @SpringBootTest, MockMvc, WebTestClient, Testcontainers, test slices |

## Quick Start — Minimal Working Structure

A standard Spring Boot feature consists of these layers. Use these as copy-paste starting points.

### Entity

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @DecimalMin("0.0")
    private BigDecimal price;

    // getters / setters or use @Data (Lombok)
}
```

### Repository

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
}
```

### Service (constructor injection)

```java
@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Product> search(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    @Retryable(retryPolicy = "exponentialBackoff", maxAttempts = 3) // Built into spring-core — no spring-retry dependency
    public Product create(ProductRequest request) {
        var product = new Product();
        product.setName(request.name());
        product.setPrice(request.price());
        return repo.save(product);
    }
}
```

### REST Controller (with API Versioning)

```java
@RestController
@RequestMapping("/api/products")
@Validated
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping(version = "1.0") // Built-in API versioning (Framework 7)
    public List<Product> search(@RequestParam(defaultValue = "") String name) {
        return service.search(name);
    }

    @PostMapping(version = "1.0")
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest request) {
        return service.create(request);
    }
}
```

Versioning can be configured via path segment, header (`API-Version`), query param, or media type:

```yaml
# application.yml — API versioning config
spring:
  mvc:
    apiversion:
      use-request-header: API-Version
      deprecation:
        enabled: true  # auto-appends Deprecation/Sunset/Link headers per RFC 9745
```

### DTO (record)

```java
public record ProductRequest(
    @NotBlank String name,
    @DecimalMin("0.0") BigDecimal price
) {}
```

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(EntityNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }
}
```

### Test Slice

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean ProductService service;

    @Test
    void createProduct_validRequest_returns201() throws Exception {
        var product = new Product(); product.setName("Widget"); product.setPrice(BigDecimal.TEN);
        when(service.create(any())).thenReturn(product);

        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"name":"Widget","price":10.0}"""))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Widget"));
    }
}
```

## Constraints

### MUST DO

| Rule | Correct Pattern |
|------|----------------|
| Constructor injection | `public MyService(Dep dep) { this.dep = dep; }` |
| Validate API input | `@Valid @RequestBody MyRequest req` on every mutating endpoint |
| Type-safe config | `@ConfigurationProperties(prefix = "app")` bound to a record/class |
| Appropriate stereotype | `@Service` for business logic, `@Repository` for data, `@RestController` for HTTP |
| Transaction scope | `@Transactional` on multi-step writes; `@Transactional(readOnly = true)` on reads |
| Hide internals | Catch domain exceptions in `@RestControllerAdvice`; return RFC 9457 problem details, not stack traces |
| Externalize secrets | Use environment variables or Spring Cloud Config — never `application.properties` |
| Prefer `RestClient` | Use `RestClient` for imperative HTTP — `RestTemplate` auto-config is opt-in in Boot 4 |
| Use `JsonMapper` | Jackson 3's `tools.jackson.databind.JsonMapper` replaces `ObjectMapper` for new code |

### MUST NOT DO
- Use field injection (`@Autowired` on fields)
- Skip input validation on API endpoints
- Use `@Component` when `@Service`/`@Repository`/`@Controller` applies
- Mix blocking and reactive code (e.g., calling `.block()` inside a WebFlux chain)
- Store secrets or credentials in `application.properties`/`application.yml`
- Hardcode URLs, credentials, or environment-specific values
- Use deprecated Spring Boot 3.x patterns (all deprecations from 3.x are removed in 4.x)
- Expect Undertow — removed in Boot 4 (switch to Tomcat or Jetty)
- Ignore CSRF for stateless APIs — Security 7 enables CSRF for all endpoints by default
- Depend on `spring-retry` — use `@Retryable` from `spring-context` (built-in)
- Write `catch (IOException e)` for Jackson errors — `JacksonException` is a `RuntimeException` in Jackson 3
- Assume JSON date timestamps — Jackson 3 default is ISO strings (`WRITE_DATES_AS_TIMESTAMPS=false`)
