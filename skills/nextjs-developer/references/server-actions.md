------
{% raw %}
------|-------|
| **Define** | Add 'use server' at top of file or function |
| **Form** | Pass action to `<form action={serverAction}>` |
| **Programmatic** | Call directly: `await serverAction(data)` |
| **Validation** | Use Zod/TypeBox before mutations |
| **Revalidate** | `revalidatePath()` or `revalidateTag()` |
| **Redirect** | `redirect()` after mutation |
| **Errors** | Return error objects, handle in client |
| **Files** | Access via `formData.get()` as File |

## Best Practices

1. **Always validate** - Use Zod/TypeBox for type-safe validation
2. **Revalidate** - Call revalidatePath() after mutations
3. **Handle errors** - Return error objects instead of throwing
4. **Auth checks** - Verify session before mutations
5. **Rate limiting** - Protect against abuse
6. **Type safety** - Define input/output types
7. **Optimistic updates** - Use useOptimistic for better UX
{% endraw %}
