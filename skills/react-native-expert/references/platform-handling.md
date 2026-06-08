---
render_with_liquid: false
---
{% raw %}
-----|---

------|
| `Platform.OS` | Get platform ('ios' / 'android') |
| `Platform.select()` | Platform-specific values |
| `Platform.Version` | OS version number |
| `.ios.tsx` / `.android.tsx` | Platform-specific files |

| Component | Purpose |
|-----------|---------|
| `SafeAreaView` | Avoid notch/home indicator |
| `KeyboardAvoidingView` | Keyboard handling |
| `StatusBar` | Status bar styling |
| `BackHandler` | Android back button |
{% endraw %}
