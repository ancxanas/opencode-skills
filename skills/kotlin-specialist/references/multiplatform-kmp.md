------
{% raw %}
---|---------|
| `expect class` | Declare platform-specific type in common |
| `actual class` | Implement platform-specific type |
| `commonMain` | Shared code across all platforms |
| `androidMain` | Android-specific implementations |
| `iosMain` | iOS-specific implementations (all targets) |
| `jvmMain` | JVM/Desktop-specific code |
| `jsMain` | JavaScript-specific code |
| `*Test` | Platform-specific tests |
| `dependsOn` | Source set hierarchy |
| `.freeze()` | iOS memory model (legacy) |
| `kotlin("multiplatform")` | KMP Gradle plugin |
{% endraw %}
