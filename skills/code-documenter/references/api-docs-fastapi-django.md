------
{% raw %}
-----|---------------------|--------|
| FastAPI | Type hints + docstrings | Auto Swagger UI |
| DRF | Serializers + drf-spectacular | Auto Swagger UI |

| FastAPI Decorator | Purpose |
|-------------------|---------|
| `summary` | Short endpoint description |
| `description` | Detailed description |
| `tags` | Group endpoints |
| `response_model` | Response schema |
| `responses` | Additional response codes |

| DRF Decorator | Purpose |
|---------------|---------|
| `@extend_schema` | Customize schema |
| `OpenApiParameter` | Query/path params |
| `OpenApiExample` | Request examples |

{% endraw %}
