------
{% raw %}
|---------|-------------|
| `feat` | MINOR | A new feature |
| `fix` | PATCH | A bug fix |
| `BREAKING CHANGE` | MAJOR | Use in footer or `!` after type/scope |
| `build` | — | Build system or external dependency changes |
| `chore` | — | Other changes (no production code change) |
| `ci` | — | CI config and scripts |
| `docs` | — | Documentation only |
| `perf` | — | Performance improvements |
| `refactor` | — | Code change that neither fixes nor adds |
| `revert` | — | Reverts a previous commit |
| `style` | — | Formatting, missing semicolons, etc. |
| `test` | — | Adding or correcting tests |

## Scopes (common)
`api`, `auth`, `db`, `ui`, `deps`, `config`, `docs`, `ci`

## Examples
```
feat(api): add pagination to list endpoints
fix(auth): handle token refresh race condition
feat!: drop Node 18 support
docs: fix broken link in README
perf(db): add index on user.email
BREAKING CHANGE: removed deprecated /v1/orders endpoint
```

## Automated Versioning
```
fix → PATCH (1.0.0 → 1.0.1)
feat → MINOR (1.0.0 → 1.1.0)
BREAKING CHANGE → MAJOR (1.0.0 → 2.0.0)
```

## Changelog Categories from Commits
| Commit Type | Changelog Section |
|-------------|-------------------|
| `feat` | Features |
| `fix` | Bug Fixes |
| `BREAKING CHANGE` | Breaking Changes |
| `perf` | Performance |
| `docs` | Documentation |
| `refactor` | (omit from user-facing changelog) |
| `test`, `chore`, `ci`, `style`, `build` | (omit from user-facing changelog) |

## Tools
- `standard-version` — Automatic versioning + CHANGELOG.md
- `semantic-release` — Full pipeline (version, changelog, publish)
- `commitlint` — Lint commit messages
- `git-cliff` — Configurable changelog generator
{% endraw %}
