------
{% raw %}
|---------|
| `removeClippedSubviews` | Unmount off-screen items |
| `maxToRenderPerBatch` | Items per render batch |
| `windowSize` | Render window multiplier |
| `initialNumToRender` | Initial items to render |
| `getItemLayout` | Skip measurement (fixed height) |

| Optimization | When |
|--------------|------|
| `memo()` | All list items |
| `useCallback` | renderItem, keyExtractor |
| `getItemLayout` | Fixed height items |
| `FlashList` | Very large lists |
{% endraw %}
