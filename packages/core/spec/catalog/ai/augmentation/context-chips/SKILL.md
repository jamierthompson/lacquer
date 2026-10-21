---
name: lacquer-context-chips
description: The honest representation of context: if it is not a chip, the model did not get it.
---

# Contextual chips (what the model will see)

> The honest representation of context: if it is not a chip, the model did not get it.
>
> component · ai/augmentation · tier 1 · established · status: draft

Also called: @ mentions (Cursor, Notion, Claude Code), Attachments / Connectors (Shape of AI Tuners), element references (Lovable, v0, Cursor Design Mode), PromptInputHeader attachments (AI Elements).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: loading
- states.a11y: loading
- modes.treatment: attached, unavailable, too-large
- modes.a11y: attached, unavailable, too-large
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any composer that accepts context beyond text
- Avoid: invisible context injection

Built from: `tag`, `popover`, `list`, `icon-button`.

Pairs with: `composer`, `preview-chat-split`, `ask-about-this-page`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `removable-chips` |  | required | removable chips in the composer header: file, selection, page, element, screenshot, connector |
| `type-icon` |  | required | type icon and name |
| `hover-preview` |  | required | hover preview |
| `picker-via` |  | required | picker via @ |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `loading` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `attached` | missing | missing |  |
| `unavailable` | missing | missing |  |
| `too-large` | missing | missing |  |

## API (framework-neutral)

Interactions:
- add via @ or selection
- remove
- preview

## Accessibility

- Accessible name: missing

Chips are list items with remove buttons named 'Remove {name}'; additions announced.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-secondary`, `radius.pill`, `type.label.sm`, `color.border.subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Lovable — selected elements and annotations attach as references to messages
- Cursor — @Branch, @Chats, files

## Sources

- https://docs.lovable.dev/features/preview-toolbar.md
- https://cursor.com/blog/agent-best-practices
