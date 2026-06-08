---
title: ai-agent-builder

name: ai-agent-builder
description: Build AI agents and agentic systems using LangChain, LangGraph, AutoGen, CrewAI, or custom orchestration. Use when designing multi-agent architectures, implementing tool-use and function calling, setting up agent memory and state, building RAG agents, or deploying agent workflows with human-in-the-loop.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: ai
  triggers: AI agent, agentic, LangChain, LangGraph, AutoGen, CrewAI, tool-use, function calling, agent orchestration, multi-agent, agent memory, ReAct, chain-of-thought agent, agent loop, human-in-the-loop, agent workflow, agent evaluation
  role: specialist
  scope: implementation
  output-format: code
  related-skills: mcp-developer, prompt-engineer, rag-architect, fine-tuning-expert, fastapi-expert, python-pro, typescript-pro
  targets-version: langchain@latest, langgraph@latest
  last-reviewed: 2026-06-08
parent: AI & Data
nav_order: 1
render_with_liquid: false
---

# AI Agent Builder

Senior AI agent engineer with deep expertise in building agentic systems, orchestrating multi-agent workflows, and integrating tool-use patterns.

## When to Use

- Building AI agents that use tools and APIs
- Designing multi-agent architectures (supervisor, swarm, routing)
- Implementing ReAct, reflection, or planning agent loops
- Adding memory and state management to agents
- Building RAG-enhanced agents with retrieval tool-use
- Setting up human-in-the-loop approval workflows
- Evaluating agent performance and trajectory quality

## When NOT to Use

- Simple LLM calls without tool-use or state — use prompt-engineer instead
- Fine-tuning models for specific behaviors — use fine-tuning-expert
- Building MCP servers (tool provider side) — use mcp-developer
- Single-turn RAG without agent orchestration — use rag-architect

## Architecture Patterns

### Single Agent (ReAct)

```
User → LLM → Tool call → LLM → Tool call → LLM → Response
```

Simple loop: think, act, observe, repeat. Best for linear tool-use chains.

### Supervisor

```
User → Supervisor LLM → Specialist Agent A
                       → Specialist Agent B
                       → Specialist Agent C
                       → Supervisor LLM → Response
```

A routing LLM delegates to specialized sub-agents. Best for domain-routing (e.g. customer support with billing, tech, and sales agents).

### Swarm / Fan-out

```
User → Orchestrator → Agent A (parallel)
                    → Agent B (parallel)
                    → Agent C (parallel)
                    → Orchestrator (aggregates) → Response
```

Agents run in parallel, results merged. Best for research, data gathering, or multi-source analysis.

### Tool-use Agent

```
User → Agent → Tool → Tool → Tool → Response
```

Agent has a tool belt and decides which to call. Best for open-ended tasks needing multiple integrations.

## Tool Integration

### Tool Definition (Python with LangChain)

```python
from langchain_core.tools import tool

@tool
def get_weather(location: str) -> str:
    """Get current weather for a location."""
    return f"Weather data for {location}"

# Or with MCP tools via composio
from composio_langchain import ComposioToolSet
toolset = ComposioToolSet()
tools = toolset.get_tools(apps=["GMAIL", "GITHUB"])
```

### Tool Definition (TypeScript)

```typescript
const getWeatherTool: Tool = {
  name: "get_weather",
  description: "Get current weather for a location",
  parameters: z.object({
    location: z.string().describe("City name"),
  }),
  execute: async ({ location }) => {
    return `Weather data for ${location}`;
  },
};
```

## Agent Memory

| Type | Scope | Use Case |
|------|-------|----------|
| **Conversation buffer** | Session | Chat history in context window |
| **Summarization** | Session | Compress long conversations |
| **Vector store** | Persistent | Long-term knowledge retrieval |
| **Key-value store** | Persistent | User preferences, facts |
| **Entity extraction** | Persistent | Track named entities across sessions |

### LangGraph State

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, MessagesState

graph = StateGraph(MessagesState)
# nodes: agent, tools, router
# edges: conditional routing based on tool calls
```

## Human-in-the-Loop

```python
# LangGraph: interrupt before tool execution
graph.add_node("call_tool")
graph.add_edge("agent", "call_tool")
graph.add_conditional_edges(
    "agent",
    should_continue,
    {"continue": "tools", "interrupt": "__end__"}
)
```

Patterns:
- **Approve before execution**: Pause before tool call, resume on approval
- **Review after execution**: Show result, let human modify or confirm
- **Escalation**: Route to human when confidence below threshold

## Evaluation

### Metrics

| Metric | What it measures |
|--------|-----------------|
| **Tool call accuracy** | Agent called the right tool with right params |
| **Trajectory quality** | Path efficiency to solution |
| **Task completion** | Did it produce the correct final output |
| **Hallucination rate** | Made-up tool results or facts |
| **Latency** | End-to-end and per-step timing |

### Eval Framework

```python
# LangSmith evals
from langsmith import evaluate

def tool_call_correct(run):
    tool_calls = run.outputs.get("tool_calls", [])
    expected = run.inputs["expected_tool"]
    return any(t["name"] == expected for t in tool_calls)

evaluate(
    agent,
    data="test-samples",
    evaluators=[tool_call_correct]
)
```

## Deployment

- **Stateless agents**: Scale horizontally, store state externally (Redis, Postgres)
- **Rate limiting**: Token bucket per user, queue for high-load periods
- **Observability**: Trace every LLM call, tool call, and state transition
- **Caching**: Cache LLM responses for identical inputs (deterministic tools)
- **Cost control**: Budget per user/session, model tiering (cheap model for routing, expensive for final response)

## Security

- Validate all tool inputs (never trust LLM-generated parameters blindly)
- Scope tool permissions to minimum required
- Implement approval gates for destructive operations (delete, write, send)
- Rate-limit tool execution per session
- Audit log every agent action (tool calls, state changes, decisions)
