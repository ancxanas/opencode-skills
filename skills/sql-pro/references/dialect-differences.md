------
{% raw %}
---|-----------|-------|------------|--------|
| Integer | INT, BIGINT | INT, BIGINT | INT, BIGINT | NUMBER(10), NUMBER(19) |
| Decimal | NUMERIC, DECIMAL | DECIMAL | DECIMAL, NUMERIC | NUMBER(p,s) |
| String | VARCHAR, TEXT | VARCHAR, TEXT | VARCHAR, NVARCHAR | VARCHAR2, CLOB |
| Binary | BYTEA | BLOB, BINARY | VARBINARY, IMAGE | BLOB, RAW |
| Boolean | BOOLEAN | BOOLEAN/TINYINT(1) | BIT | NUMBER(1) |
| Date | DATE | DATE | DATE | DATE |
| Timestamp | TIMESTAMP | DATETIME, TIMESTAMP | DATETIME, DATETIME2 | TIMESTAMP |
| UUID | UUID | CHAR(36), BINARY(16) | UNIQUEIDENTIFIER | RAW(16) |
| JSON | JSON, JSONB | JSON | NVARCHAR(MAX) | CLOB |
| Array | ARRAY | JSON | Table variable | VARRAY, nested table |

## Performance Tips by Database

**PostgreSQL:**
- Use EXPLAIN ANALYZE with BUFFERS
- Leverage JSONB with GIN indexes
- Use parallel query settings for large scans
- Vacuum and analyze regularly
- Consider table partitioning for 10M+ rows

**MySQL:**
- Choose InnoDB over MyISAM
- Optimize buffer pool size
- Use covering indexes aggressively
- Be aware of case-insensitive defaults
- Consider read replicas for scaling

**SQL Server:**
- Update statistics regularly
- Use columnstore indexes for warehousing
- Leverage query hints sparingly
- Monitor execution plans
- Use In-Memory OLTP for hot tables

**Oracle:**
- Use EXPLAIN PLAN
- Leverage partitioning features
- Use bind variables to avoid parsing
- Configure SGA/PGA appropriately
- Consider Real Application Clusters (RAC)

{% endraw %}
