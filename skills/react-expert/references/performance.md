------
{% raw %}
-----|-------------|
| `memo()` | Prevent re-renders from unchanged props |
| `useMemo()` | Cache expensive calculations |
| `useCallback()` | Stable function references |
| `lazy()` | Code split heavy components |
| `useTransition()` | Keep UI responsive during updates |
| Virtualization | Large lists (1000+ items) |

| Anti-pattern | Fix |
|--------------|-----|
| Inline objects | Lift out or useMemo |
| Inline functions | useCallback |
| Large bundle | lazy() + Suspense |
| Long lists | Virtualization |

{% endraw %}
