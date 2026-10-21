---
name: lacquer-branch-picker
description: Regenerating or editing creates sibling versions that the user can page through without losing earlier attempts.
---

# Branching and edit-and-resend

> Regenerating or editing creates sibling versions that the user can page through without losing earlier attempts.
>
> component · ai/conversation · tier 2 · established · status: draft

Also called: BranchPicker (assistant-ui), MessageBranch (AI Elements), Branches (Shape of AI Governors), Fork Chat (Cursor), /branch (Claude Code).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: single, n-of-m, editing
- modes.a11y: single, n-of-m, editing
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: conversation products where regeneration is common
- Avoid: linear support transcripts that must be immutable

Built from: `icon-button`, `textarea`.

Pairs with: `message`, `message-actions`, `version-history`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `n-m` |  | required | ‹ n/m › control on the message |
| `edit-affordance` |  | required | edit affordance on user messages |
| `regenerate-creates-sibling` |  | required | regenerate creates sibling |
| `thread-re-renders` |  | required | thread re-renders to selected branch |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `single` | missing | missing |  |
| `n-of-m` | missing | missing |  |
| `editing` | missing | missing |  |

## API (framework-neutral)

Interactions:
- previous/next sibling
- edit-and-resend
- fork whole thread

## Accessibility

- Accessible name: missing

Control announces 'Version 2 of 3'; editing is a form with Save/Cancel.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.fg.muted`, `type.label.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- ChatGPT — '< 2/3 >' under edited messages
- Cursor — Fork Chat

## Sources

- https://www.assistant-ui.com/docs/primitives
- https://elements.ai-sdk.dev/components/message
