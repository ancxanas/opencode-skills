------
{% raw %}
---|-------|-------|----------|
| AsyncStorage | Slow | Yes | Small data, simple apps |
| MMKV | Fast | No | Large data, frequent access |
| SecureStore | Medium | Yes | Sensitive data (tokens) |

| Hook | Returns |
|------|---------|
| `useStorage()` | { value, setValue, loading } |
| `useMMKVString()` | [value, setValue] |
| `useMMKVNumber()` | [value, setValue] |
| `useMMKVBoolean()` | [value, setValue] |

{% endraw %}
