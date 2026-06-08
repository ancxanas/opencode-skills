------
{% raw %}
-----|---------|
| `OAuth2PasswordBearer` | Extract token from header |
| `OAuth2PasswordRequestForm` | Login form data |
| `jwt.encode()` | Create JWT |
| `jwt.decode()` | Verify JWT |
| `pwd_context.hash()` | Hash password |
| `pwd_context.verify()` | Check password |
| `Depends(get_current_user)` | Require auth |
| `require_roles()` | Role-based access |

{% endraw %}
