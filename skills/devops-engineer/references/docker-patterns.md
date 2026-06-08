------
{% raw %}
----|----------------|
| Non-root user | `USER nodejs` or `USER 1001` |
| Minimal base image | Use `-alpine` or `-slim` variants |
| No secrets in image | Use runtime env vars or secrets |
| Pin versions | `FROM node:20.10.0-alpine` not `latest` |
| Scan images | `docker scout`, `trivy`, `snyk` |
| Health checks | `HEALTHCHECK` instruction |
| .dockerignore | Exclude `node_modules`, `.git`, `.env` |

## .dockerignore Template

```
node_modules
.git
.env*
*.md
Dockerfile*
docker-compose*
.dockerignore
coverage
.nyc_output
```

{% endraw %}
