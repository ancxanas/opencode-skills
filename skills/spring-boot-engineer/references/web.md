# Web Layer - Controllers & REST APIs (Spring Framework 7)

## REST Controller Pattern with API Versioning

```java
@RestController
@RequestMapping("/api/users")
@Validated
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping(version = "1.0") // Built-in API versioning — Framework 7 feature
    public ResponseEntity<Page<UserResponse>> getUsers(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        Page<UserResponse> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        UserResponse user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping(version = "1.0")
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserCreateRequest request) {
        UserResponse user = userService.create(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(user.id())
                .toUri();
        return ResponseEntity.created(location).body(user);
    }

    @PutMapping(value = "/{id}", version = "1.0")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserResponse user = userService.update(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping(value = "/{id}", version = "1.0")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

### API Versioning Configuration

The `version` attribute on mapping annotations supports four resolution strategies:

```yaml
# application.yml
spring:
  mvc:
    apiversion:
      # Strategy: use-request-header, use-path-segment, use-query-param, use-media-type
      use-request-header: API-Version
      deprecation:
        enabled: true  # RFC 9745 Deprecation/Sunset/Link headers on deprecated versions
```

Multiple strategies can be combined for backward compatibility during migration.

## Declarative HTTP Client (@HttpServiceClient)

Spring Framework 7 introduces declarative HTTP clients — define an interface, Spring generates the implementation:

```java
// Declarative client interface
@HttpServiceClient(baseUrl = "https://api.example.com")
public interface UserApiClient {
    @GetExchange("/users/{id}")
    UserResponse getUser(@PathVariable Long id);

    @GetExchange("/users")
    List<UserResponse> getUsers(@PageableDefault(size = 20) Pageable pageable);

    @PostExchange("/users")
    ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request);

    @PutExchange("/users/{id}")
    UserResponse updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request);

    @DeleteExchange("/users/{id}")
    ResponseEntity<Void> deleteUser(@PathVariable Long id);
}

// Usage in service
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserApiClient apiClient;

    public UserResponse getUser(Long id) {
        return apiClient.getUser(id);
    }
}
```

## RestClient (Preferred over RestTemplate)

`RestClient` is the default HTTP client in Boot 4. `RestTemplate` auto-configuration is opt-in.

```java
@Service
public class ExternalService {
    private final RestClient restClient;

    public ExternalService(RestClient.Builder builder) {
        this.restClient = builder
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    public ExternalData fetchData(String id) {
        return restClient.get()
            .uri("/data/{id}", id)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                throw new ResourceNotFoundException("Not found");
            })
            .body(ExternalData.class);
    }
}
```

## Request DTOs with Validation

```java
public record UserCreateRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be 8-100 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).*$",
             message = "Password must contain uppercase, lowercase, and digit")
    String password,

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username must be alphanumeric")
    String username,

    @Min(value = 18, message = "Must be at least 18")
    @Max(value = 120, message = "Must be at most 120")
    Integer age
) {}

public record UserUpdateRequest(
    @Email(message = "Email must be valid")
    String email,

    @Size(min = 3, max = 50)
    String username
) {}
```

## Response DTOs

```java
public record UserResponse(
    Long id,
    String email,
    String username,
    Integer age,
    Boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getAge(),
            user.getActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
```

## Global Exception Handling (RFC 9457 Problem Details)

Boot 4 defaults to RFC 9457 `application/problem+json` responses via ProblemDetail:

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        var problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation failed");
        problem.setProperty("errors", ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                e -> e.getDefaultMessage() != null ? e.getDefaultMessage() : "Invalid value"
            )));
        return problem;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex) {
        log.error("Data integrity violation", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
            "Data integrity violation — resource may already exist");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGlobalException(Exception ex) {
        log.error("Unexpected error", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred");
    }
}
```

## Custom Validation

```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    private final UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true;
        return !userRepository.existsByEmail(email);
    }
}
```

## WebClient for External APIs

```java
@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .filter(logRequest())
            .build();
    }

    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(request -> {
            log.info("Request: {} {}", request.method(), request.url());
            return Mono.just(request);
        });
    }
}

@Service
@RequiredArgsConstructor
public class ExternalApiService {
    private final WebClient webClient;

    public Mono<ExternalDataResponse> fetchData(String id) {
        return webClient
            .get()
            .uri("/data/{id}", id)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, response ->
                Mono.error(new ResourceNotFoundException("External resource not found")))
            .onStatus(HttpStatusCode::is5xxServerError, response ->
                Mono.error(new ServiceUnavailableException("External service unavailable")))
            .bodyToMono(ExternalDataResponse.class)
            .timeout(Duration.ofSeconds(5))
            .retry(3);
    }
}
```

## CORS Configuration

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "https://example.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

## Quick Reference

| Annotation | Purpose |
|------------|---------|
| `@RestController` | Marks class as REST controller (combines @Controller + @ResponseBody) |
| `@RequestMapping` | Maps HTTP requests to handler methods |
| `@GetMapping/@PostMapping/@HttpExchange` | HTTP method-specific mappings (declarative client) |
| `@PathVariable` | Extracts values from URI path |
| `@RequestParam` | Extracts query parameters |
| `@RequestBody` | Binds request body to method parameter |
| `@Valid` | Triggers validation on request body |
| `@RestControllerAdvice` | Global exception handling returning `ProblemDetail` (RFC 9457) |
| `@ResponseStatus` | Sets HTTP status code for method |
| `@HttpServiceClient` | Declarative HTTP client — Spring generates the implementation |

## Jackson 3 Notes

- **Package**: `com.fasterxml.jackson` → `tools.jackson`
- **Builder**: Use `tools.jackson.databind.JsonMapper` (extends `ObjectMapper` with immutable builder API)
- **Customizer**: `JsonMapperBuilderCustomizer` replaces `Jackson2ObjectMapperBuilderCustomizer`
- **Dates**: `WRITE_DATES_AS_TIMESTAMPS` defaults to `false` (ISO strings, not Unix timestamps)
- **Property order**: `SORT_PROPERTIES_ALPHABETICALLY` defaults to `true`
- **Exceptions**: `JacksonException` extends `RuntimeException`, not `IOException` — audit `catch (IOException e)` blocks
- **Annotations**: `@JsonProperty`, `@JsonIgnore`, `@JsonView` remain at `com.fasterxml.jackson.annotation` (shared with Jackson 2)
- **Compatibility**: Add `spring.jackson.use-jackson2-defaults: true` + `spring-boot-jackson2` for incremental migration
