---
name: lacquer-ask-about-this-page
description: A consistent, page-aware assistant entry point that shows what context it has.
---

# 'Ask about this page' affordance

> A consistent, page-aware assistant entry point that shows what context it has.
>
> component · ai/augmentation · tier 2 · emerging · status: draft

Also called: Ask Raycast AI about what you're looking at, Copilot sidebar (Edge), Perplexity sidebar, CopilotSidebar / CopilotPopup (CopilotKit), AssistantModal (assistant-ui).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: closed, open, context-attached, answering
- modes.a11y: closed, open, context-attached, answering
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: documentation, dashboards, any content-heavy product
- Avoid: adding a second chatbot beside an existing one (NN/g: consolidate)

Built from: `drawer`, `popover`, `button`, `tag`.

Pairs with: `context-chips`, `composer`, `inline-citation`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `persistent-entry-point` |  | required | persistent entry point (button or side panel) |
| `current-page-document-attached` |  | required | current page/document attached as a context chip |
| `compact-composer` |  | required | compact composer |
| `answer-with-citations` |  | required | answer with citations into the page |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `closed` | missing | missing |  |
| `open` | missing | missing |  |
| `context-attached` | missing | missing |  |
| `answering` | missing | missing |  |

## API (framework-neutral)

Interactions:
- open from any page
- resize/dock
- continue in full chat

## Accessibility

- Accessible name: missing

Panel is a complementary region or dialog; entry point consistent across pages; resizable by keyboard.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-raised`, `shadow.lg`, `color.border.subtle`, `radius.lg`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- NN/g (Apr 2026) — keep the chatbot accessible across pages; consolidate chats
- Raycast — 'leverage AI about whatever you're looking at'

## Sources

- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://manual.raycast.com/ai
- https://docs.copilotkit.ai/
