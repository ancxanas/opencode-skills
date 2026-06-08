------
{% raw %}
|-------|---------|
| Short-term | Current conversation | Context window |
| Working | Current task (multi-step) | LangGraph state |
| Long-term | Across sessions | Vector store, SQLite |
| Entity | Facts about entities | Knowledge graph |

## Agent State Machine (LangGraph)
```mermaid
[__start__] → [agent_node] → [tool_node]
    ↑                           |
    └──── (loop if tools) ←─────┘
    ↓
[__end__]
```
{% endraw %}
