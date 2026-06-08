-----|---
{% raw %}
------|---------|
| `@param` | Parameter description | `@param name - User's name` |
| `@returns` | Return value | `@returns User object` |
| `@throws` | Exception thrown | `@throws {Error} If invalid` |
| `@example` | Usage example | Code block |
| `@see` | Reference link | `@see UserService` |
| `@deprecated` | Mark deprecated | `@deprecated Use v2 instead` |
| `@template` | Generic type param | `@template T - Item type` |
| `@async` | Async function | Mark async |
| `@private` | Private member | Internal use |
| `@readonly` | Read-only property | Cannot modify |

## Common Patterns

```typescript
// Optional parameters
/** @param [options] - Optional configuration */

// Default values
/** @param [limit=10] - Items per page (default: 10) */

// Multiple types
/** @param input - Input value (string or number) */

// Callback parameters
/**
 * @callback FilterFn
 * @param item - Item to filter
 * @returns Whether item passes filter
 */
```

{% endraw %}
