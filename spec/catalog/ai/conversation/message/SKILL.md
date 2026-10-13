---
name: lacquer-message
description: User messages are right-aligned bubbles; assistant messages are full-width, unbubbled containers for ordered parts (reasoning, tools, text, sources, actions).
---

# Message (user / assistant)

> User messages are right-aligned bubbles; assistant messages are full-width, unbubbled containers for ordered parts (reasoning, tools, text, sources, actions).
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Message (AI Elements, prompt-kit), UserMessage / AssistantMessage (assistant-ui), st.chat_message (Streamlit).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: streaming, complete, error, cancelled
- states.a11y: streaming, complete, error, cancelled
- modes.treatment: edited, branch-n-of-m
- modes.a11y: edited, branch-n-of-m
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any thread
- Avoid: symmetric bubble layouts that make assistant prose narrow and hard to read

Built from: `avatar`, `badge`, `icon-button`, `textarea`.

Pairs with: `streaming-markdown`, `message-actions`, `branch-picker`, `reasoning-disclosure`, `tool-call-card`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `identity-row` |  | required | identity row (optional name / AI label) |
| `parts-in-order` |  | required | parts in order: reasoning, tool cards, streamed content, media, sources row |
| `actions-bar` |  | required | actions bar |
| `branch-picker` |  | required | branch picker |
| `user-variant` |  | required | user variant: bubble with edit affordance and attachment chips |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `streaming` | missing | missing |  |
| `complete` | missing | missing |  |
| `error` | missing | missing |  |
| `cancelled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `edited` | missing | missing |  |
| `branch-n-of-m` | missing | missing | branch n-of-m |

## API (framework-neutral)

Interactions:
- hover/focus reveals actions
- edit turns user bubble into inline composer
- regenerate creates sibling branch

## Accessibility

- Accessible name: missing

Article with accessible name (You said / Assistant said); actions visible on focus; edit is a real form.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.user-bubble`, `radius.bubble`, `color.bg.assistant`, `space.gap.message`, `type.body.md`, `size.measure.prose`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- AI Elements Message — from='user|assistant' switches bubble vs full-width
- ChatGPT/Claude — assistant text without bubble, no avatar required

## Sources

- https://elements.ai-sdk.dev/components/message
