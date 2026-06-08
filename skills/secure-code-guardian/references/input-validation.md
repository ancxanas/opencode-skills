------
{% raw %}
------|------------|
| Email | Regex + max length |
| URL | Protocol + host allowlist |
| File path | basename + resolve check |
| SQL | Parameterized queries |
| Command | execFile + no shell |
| File upload | Type + size + magic bytes |
{% endraw %}
