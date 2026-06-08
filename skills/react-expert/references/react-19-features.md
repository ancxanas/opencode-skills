------
{% raw %}
|---------|
| `use()` | Read promise/context in render |
| `useActionState()` | Form action state + pending |
| `useFormStatus()` | Form pending state (child) |
| `useOptimistic()` | Optimistic UI updates |

| Pattern | When |
|---------|------|
| `use(promise)` | Suspense data fetching |
| `use(context)` | Conditional context read |
| `useActionState` | Server Actions with state |
{% endraw %}
