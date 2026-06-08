------
{% raw %}
-----|-------------|---------|
| 400 | Invalid request format | Malformed JSON |
| 401 | Not authenticated | Missing/invalid token |
| 403 | Not authorized | Wrong permissions |
| 404 | Resource not found | User doesn't exist |
| 409 | Conflict | Duplicate email |
| 422 | Validation failed | Invalid email format |
| 429 | Rate limited | Too many requests |
| 500 | Server error | Unhandled exception |

{% endraw %}
