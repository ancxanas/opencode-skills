------
{% raw %}
-----|--------|-------|
| Read-only query | `.AsNoTracking()` | Better performance |
| Eager loading | `.Include()` | Load related data |
| Filtered include | `.Include(x => x.Items.Where(...))` | .NET 5+ |
| Split query | `.AsSplitQuery()` | Avoid cartesian explosion |
| Bulk update | `.ExecuteUpdateAsync()` | .NET 7+ |
| Bulk delete | `.ExecuteDeleteAsync()` | .NET 7+ |
| Compiled query | `EF.CompileAsyncQuery()` | Reusable queries |
| Soft delete | Query filter | `HasQueryFilter()` |
{% endraw %}
