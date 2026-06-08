---
render_with_liquid: false
---------|------------------|------------------|
| Data fetching | ✅ Yes | ⚠️ Use SWR/React Query |
| Backend access | ✅ Yes (DB, files) | ❌ No |
| Event handlers | ❌ No | ✅ Yes |
| State/Effects | ❌ No | ✅ Yes |
| Browser APIs | ❌ No | ✅ Yes |
| Bundle size | 0 KB | Adds to bundle |
| Streaming | ✅ Yes | ❌ No |

## Best Practices

1. **Default to Server Components** - Only use 'use client' when needed
2. **Move Client Components down** - Push them to leaves of component tree
3. **Pass data down** - Fetch in Server Components, pass to Client Components
4. **Use composition** - Nest Server Components inside Client Components via children
5. **Cache expensive operations** - Use React cache() for deduplication
