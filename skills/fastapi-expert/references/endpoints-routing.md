------
{% raw %}
-----|---------|
| `@router.get("/")` | GET endpoint |
| `@router.post("/", status_code=201)` | POST with status |
| `Query(ge=0)` | Query param validation |
| `Path(gt=0)` | Path param validation |
| `Depends(func)` | Dependency injection |
| `Annotated[T, Depends()]` | Type alias pattern |
| `response_model=Model` | Response schema |
| `HTTPException(status, detail)` | Error response |
{% endraw %}
