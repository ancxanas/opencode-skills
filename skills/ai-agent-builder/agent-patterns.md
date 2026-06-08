# Agent Architecture Patterns

## Supervisor Pattern
One controller agent routes tasks to specialized child agents.
```
User → Supervisor → [Researcher, Coder, Reviewer] → Response
```
- **When**: Tasks require multiple domains or sequential subtasks
- **Pros**: Clear control flow, debuggable
- **Cons**: Supervisor is a single point of failure / bottleneck

## Swarm / Round-Robin
Agents broadcast to each other; consensus drives output.
- **When**: Brainstorming, diverse perspective generation
- **Pros**: Emergent behavior, creativity
- **Cons**: Expensive, hard to control

## Routing
Classifier agent determines destination, dispatches once.
```
Input → Router → Specialist Agent → Response
```
- **When**: Known categories of input
- **Pros**: Fast, simple
- **Cons**: Router accuracy is critical

## Tool-Using Agent (ReAct)
LLM decides which tools to call in a thought-action-observation loop.
```
Thought → Action (tool call) → Observation → Thought → Final Answer
```
- **When**: Tasks requiring external data or computation
- **Pros**: Grounded, extensible
- **Cons**: Token cost, latency per tool call

## Reflection / Self-Critique
Agent generates output, then critiques and revises it.
- **When**: Quality-critical output (code, writing)
- **Pros**: Better quality without external feedback
- **Cons**: 2x+ token cost

## Human-in-the-Loop
Agent pauses at checkpoints for human approval.
- **When**: High-stakes decisions, content moderation, approvals
- **Pros**: Safe, auditable
- **Cons**: Slower, requires synchronous human

## Memory Types
| Type | Scope | Backend |
|------|-------|---------|
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
