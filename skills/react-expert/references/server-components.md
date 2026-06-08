------
{% raw %}
|---------|------------|
| Server | async/await, db, fs | useState, onClick |
| Client | hooks, events, browser APIs | async component |

| Pattern | Use Case |
|---------|----------|
| Server Component | Data fetching, heavy deps |
| Client Component | Interactivity, state |
| `'use client'` | Mark client boundary |
| `'use server'` | Server Action |
| Suspense | Streaming, loading states |
{% endraw %}
