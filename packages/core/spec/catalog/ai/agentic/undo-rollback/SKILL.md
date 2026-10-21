---
name: lacquer-undo-rollback
description: Every reversible agent action can be undone; irreversible ones are gated and labelled before they run.
---

# Undo / rollback for agent actions

> Every reversible agent action can be undone; irreversible ones are gated and labelled before they run.
>
> component · ai/agentic · tier 1 · established · status: draft

Also called: Restore checkpoint, Undo (VS Code), Action Audit & Undo (Smashing), revert (Carbon AI label).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: undoable, undone, expired, irreversible
- modes.a11y: undoable, undone, expired, irreversible
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: always, for actions with effects
- Avoid: announcing irreversibility only after the fact

Built from: `toast`, `button`, `dialog`.

Pairs with: `version-history`, `activity-log`, `approval-prompt`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `undo-affordance` |  | required | Undo affordance with grace period on reversible actions |
| `restore-for-files` |  | required | restore for files (checkpoints) |
| `compensating-action` |  | required | compensating action for external effects |
| `irreversible-label-before` |  | required | irreversible label before execution |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `undoable` | missing | missing |  |
| `undone` | missing | missing |  |
| `expired` | missing | missing |  |
| `irreversible` | missing | missing |  |

## API (framework-neutral)

Interactions:
- undo
- restore
- view what changed

## Accessibility

- Accessible name: missing

Undo announced with what was reverted; irreversible warnings in text.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.fg.muted`, `color.status.warning`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Apple HIG — 'revert or retry content transformations or other actions they don't agree with'
- Carbon — revert button replaces the AI label after override

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://carbondesignsystem.com/components/ai-label/usage/
