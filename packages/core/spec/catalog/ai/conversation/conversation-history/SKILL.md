---
name: lacquer-conversation-history
description: Left rail listing threads grouped by date and project, with search and per-thread management.
---

# Conversation history sidebar and search

> Left rail listing threads grouped by date and project, with search and per-thread management.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: ThreadList (assistant-ui), Chats sidebar (ChatGPT, Claude, Gemini), chat history search (Cursor 2.5).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: expanded, empty
- states.a11y: expanded, empty
- modes.treatment: collapsed, searching
- modes.a11y: collapsed, searching
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: multi-thread products
- Avoid: single-purpose embedded assistants (use a compact history menu instead)

Built from: `sidebar-nav`, `list`, `search-input`, `context-menu`, `dialog`.

Pairs with: `message-list`, `memory-indicator`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `new-chat-button` |  | required | new chat button |
| `search` |  | required | search |
| `projects-folders-section` |  | required | projects/folders section |
| `date-grouped-list` |  | required | date-grouped list (Today, Yesterday, Previous 7 days) |
| `item-hover-menu` |  | required | item hover menu: rename, pin, archive, delete, share |
| `collapse-control` |  | required | collapse control |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `expanded` | missing | missing |  |
| `empty` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `collapsed` | missing | missing | collapsed (rail) |
| `searching` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click switches thread
- inline rename
- delete with confirm
- drag into project (optional)

## Accessibility

- Accessible name: missing

Navigation landmark; list with current item marked; menu reachable by keyboard; collapse state announced.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-secondary`, `color.border.subtle`, `type.body.sm`, `space.gap.xs`, `space.gap.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- ChatGPT — Projects above date-grouped chats
- Cursor 2.5 — chat history search

## Sources

- https://www.assistant-ui.com/docs/primitives
- https://cursor.com/changelog/2-5
