------
{% raw %}
----|--------------|------------------|
| JavaScript | ESLint + security | npm audit |
| TypeScript | ESLint + security | npm audit |
| Python | Bandit | Safety |
| Go | GoSec | govulncheck |
| Java | SpotBugs | OWASP Dependency-Check |
| Ruby | Brakeman | bundler-audit |

| Tool | Strengths | Best For |
|------|-----------|----------|
| Semgrep | Multi-language, custom rules | General SAST |
| Trivy | Container + code + secrets | Comprehensive |
| Bandit | Python-specific | Python projects |
| GoSec | Go-specific | Go projects |
| npm audit | Built-in, fast | Node.js deps |

{% endraw %}
