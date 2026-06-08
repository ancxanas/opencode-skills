------
{% raw %}
---|----------|---------|
| Create | POST + form | Validate + insert |
| Read | GET + query | Paginate + filter |
| Update | PATCH + optimistic | Validate + update |
| Delete | DELETE + confirm | Soft delete |
| Auth | Token storage | JWT middleware |
| Upload | FormData | Multer/streaming |

{% endraw %}
