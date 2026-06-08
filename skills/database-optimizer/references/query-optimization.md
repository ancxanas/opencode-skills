------
{% raw %}
---|-------|----------|
| `SELECT *` | Fetches unnecessary columns | Select only needed columns |
| `OR` conditions | Prevents index usage | Use UNION or separate queries |
| `LIKE '%term%'` | Full table scan | Use full-text search or trigram indexes |
| `WHERE DATE(column) = ...` | Function prevents index usage | Use range: `column >= '2024-01-01' AND column < '2024-01-02'` |
| Large `IN` lists | Inefficient for >100 items | Use temporary table or JOIN |
| Implicit type conversion | Prevents index usage | Match column data types exactly |

## Performance Validation

```sql
-- PostgreSQL: Compare query performance
EXPLAIN (ANALYZE, BUFFERS)
-- your query here

-- Check buffer cache hits
SELECT
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;

-- MySQL: Check handler statistics
SHOW STATUS LIKE 'Handler%';
FLUSH STATUS;
-- run your query
SHOW STATUS LIKE 'Handler%';
```
{% endraw %}
