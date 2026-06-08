------
{% raw %}
-----|---------|---------------|
| Controller | HTTP handlers | `src/Controller/` |
| Service | Business logic | `src/Service/` |
| Repository | Data access | `src/Repository/` |
| Event | Domain events | `src/Event/` |
| EventSubscriber | Event handlers | `src/EventSubscriber/` |
| Command | CLI commands | `src/Command/` |
| Voter | Authorization | `src/Security/Voter/` |
| Message | Async messages | `src/Message/` |
| MessageHandler | Message handlers | `src/MessageHandler/` |
| DTO | Data transfer | `src/DTO/` |

{% endraw %}
