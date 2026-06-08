------
{% raw %}
-------|-------|----------|
| Index every column | Write overhead, storage waste | Index based on query patterns |
| Redundant indexes | `(a)` + `(a,b)` | Keep only `(a,b)` |
| Wrong column order | `(created_at, user_id)` for `WHERE user_id = ?` | Put filtered columns first |
| Over-covering | Including rarely-used columns | Include only frequently accessed columns |
| Ignoring WHERE clause | Full index for 5% of data | Use partial indexes |
| Expression mismatch | Index `email`, query `LOWER(email)` | Create expression index |

## Index Design Checklist

1. **Analyze queries**: Use pg_stat_statements or slow query log
2. **Check execution plans**: Look for Seq Scan on large tables
3. **Design indexes**: Equality → Range → Include
4. **Create concurrently**: Avoid locking (PostgreSQL)
5. **Validate improvement**: Compare before/after EXPLAIN
6. **Monitor usage**: Remove unused indexes after 30 days
7. **Maintain regularly**: VACUUM, ANALYZE, REINDEX as needed
{% endraw %}
