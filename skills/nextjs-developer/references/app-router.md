------
{% raw %}
|---------|----------|
| `layout.tsx` | Persistent UI across routes | Shared navigation, auth wrapper |
| `page.tsx` | Route UI | Actual page content |
| `loading.tsx` | Loading fallback | Automatic Suspense boundary |
| `error.tsx` | Error boundary | Handle errors gracefully |
| `template.tsx` | Re-mounted layout | Analytics, animations |
| `not-found.tsx` | 404 page | Custom not found UI |
| `route.ts` | API handler | Backend API endpoints |
{% endraw %}
