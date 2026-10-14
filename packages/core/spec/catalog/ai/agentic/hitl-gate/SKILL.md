---
name: lacquer-hitl-gate
description: The agent pauses and asks a structured question; the answer is folded back into the run and recorded in the thread.
---

# Human-in-the-loop gate / clarifying question

> The agent pauses and asks a structured question; the answer is folded back into the run and recorded in the thread.
>
> component · ai/agentic · tier 1 · emerging · status: draft

Also called: useHumanInTheLoop / useInterrupt (CopilotKit), Escalation Pathway (Smashing), AskUserQuestion, clarifying questions (Cursor), Deep Research plan review (Gemini).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: input-streaming
- states.a11y: input-streaming
- modes.treatment: answered, skipped, expired
- modes.a11y: answered, skipped, expired
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: ambiguous requests
- Use: high-stakes branches
- Use: missing constraints
- Avoid: asking what the agent could safely infer or look up

Built from: `form`, `radio-group`, `checkbox`, `textarea`, `button`, `card`.

Pairs with: `approval-prompt`, `plan-view`, `agent-status`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `inline-question-card` |  | required | inline question card: single-choice, multi-choice, free text or form |
| `context-of-why` |  | required | context of why it is asking |
| `submit-skip` |  | required | submit / skip |
| `answer-becomes` |  | required | answer becomes a user message |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `input-streaming` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `answered` | missing | missing |  |
| `skipped` | missing | missing |  |
| `expired` | missing | missing |  |

## API (framework-neutral)

Interactions:
- answer without stopping unrelated work
- skip with default
- edit answer later

## Accessibility

- Accessible name: missing

Form semantics with a group label; focus moved when it blocks; announced assertively when the run is paused.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-raised`, `color.border.strong`, `radius.md`, `space.gap.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- CopilotKit — 'lets an agent pause mid-run to collect input, confirmation, or a choice'
- NN/g — ChatGPT Agent failed to ask about constraints up front

## Sources

- https://docs.copilotkit.ai/agent-spec/human-in-the-loop
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
