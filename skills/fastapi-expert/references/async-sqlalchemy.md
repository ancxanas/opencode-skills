------
{% raw %}
-----|--------|
| Select one | `result.scalar_one_or_none()` |
| Select many | `result.scalars().all()` |
| Eager load | `.options(selectinload(...))` |
| Create | `db.add(obj)` + `await db.flush()` |
| Update | `update(Model).where(...).values(...)` |
| Delete | `delete(Model).where(...)` |
| Commit | `await db.commit()` |
| Rollback | `await db.rollback()` |
{% endraw %}
