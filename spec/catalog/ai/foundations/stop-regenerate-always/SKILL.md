---
name: lacquer-stop-regenerate-always
description: The two controls that make probabilistic, slow output tolerable; their absence is the most common agent-built-UI defect.
---

# Stop and regenerate are always available

> The two controls that make probabilistic, slow output tolerable; their absence is the most common agent-built-UI defect.
>
> principle · ai/foundations · tier 1 · established · status: draft

Also called: HAX G8 efficient dismissal, HAX G9 efficient correction, Apple: Edit, Undo, Retry, Adjust near generated content, Regenerate (Shape of AI Inputs).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: always
- Avoid: hiding stop during tool runs
- Avoid: discarding partial output on stop

Built from: `button`, `icon-button`.

Pairs with: `message-state-machine`, `composer`, `message-actions`, `branch-picker`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `stop-in-every` |  | required | Stop in every non-idle state (composer button, Esc) |
| `regenerate-on-every` |  | required | Regenerate on every terminal assistant message |
| `edit-and-resend-on-every` |  | required | Edit-and-resend on every user message |
| `partial-output-kept` |  | required | partial output kept on stop, labelled Stopped |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## API (framework-neutral)

Interactions:
- Esc stops
- Regenerate branches
- Edit resends

## Accessibility

- Accessible name: missing

Stop reachable within one Tab of the composer; stop announced.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- Cursor best practices — 'Stop button: click to cancel agents heading in wrong directions'

## Sources

- https://cursor.com/blog/agent-best-practices
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
