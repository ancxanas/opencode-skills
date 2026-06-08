------
{% raw %}
----|--------|----------|
| **SSG** | `cache: 'force-cache'` | Static content |
| **SSR** | `cache: 'no-store'` | Always fresh data |
| **ISR** | `next: { revalidate: 60 }` | Periodic updates |
| **Tag-based** | `next: { tags: ['posts'] }` | On-demand revalidation |
| **Dynamic** | `export const dynamic = 'force-dynamic'` | Per-request data |

## Best Practices

1. **Default to caching** - Use force-cache for static content
2. **Use ISR** - Revalidate periodically for semi-dynamic content
3. **Parallel fetching** - Use Promise.all for independent requests
4. **Deduplicate** - Use React cache() for repeated calls
5. **Stream with Suspense** - Show content progressively
6. **Tag your fetches** - Enable granular revalidation
7. **Handle errors** - Use error.tsx for graceful degradation

{% endraw %}
