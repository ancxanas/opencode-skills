------
{% raw %}
--|---------|
| `route.fulfill()` | Return mock response |
| `route.continue()` | Pass to real server |
| `route.fetch()` | Get real response |
| `route.abort()` | Block request |
| `waitForResponse()` | Wait for API call |
| `routeFromHAR()` | Use recorded responses |

| Pattern | Use Case |
|---------|----------|
| Mock all | Isolated testing |
| Mock errors | Error handling |
| Modify response | Test edge cases |
| Network delay | Loading states |
{% endraw %}
