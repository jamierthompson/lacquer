---
name: lacquer-autonomy-dial
description: Lets the user set how much the agent does without asking, always visible, with a floor of actions that never auto-approve.
---

# Autonomy dial / permission modes

> Lets the user set how much the agent does without asking, always visible, with a floor of actions that never auto-approve.
>
> component · ai/agentic · tier 2 · emerging · status: draft

Also called: Autonomy Dial (Smashing), permission modes (Claude Code: default, acceptEdits, plan, auto, dontAsk, bypassPermissions), auto-run levels (Cursor), auto-continue (Windsurf), Modes (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: suggest-only, ask-for-edits, auto-edits, auto-with-reviewer, unrestricted
- modes.a11y: suggest-only, ask-for-edits, auto-edits, auto-with-reviewer, unrestricted
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: agents that can act with varying risk
- Avoid: hiding the current level
- Avoid: defaulting to unrestricted

Built from: `segmented-control`, `dropdown-menu`, `badge`, `alert`.

Pairs with: `approval-prompt`, `agent-status`, `plan-view`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `segmented-control` |  | required | segmented control or menu of levels with plain descriptions |
| `always-visible-current-level` |  | required | always-visible current level while an agent is active |
| `list-of-actions` |  | required | list of actions never auto-approved |
| `shortcut-to-cycle` |  | required | shortcut to cycle |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `suggest-only` | missing | missing |  |
| `ask-for-edits` | missing | missing |  |
| `auto-edits` | missing | missing |  |
| `auto-with-reviewer` | missing | missing |  |
| `unrestricted` | missing | missing | unrestricted (warned) |

## API (framework-neutral)

Interactions:
- switch mid-run
- prompt offers 'switch to auto' at approval time

## Accessibility

- Accessible name: missing

Radio/segmented semantics; level change announced; warning for unrestricted levels.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-secondary`, `color.status.warning`, `type.body.sm`, `radius.pill`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Claude Code — Shift+Tab cycles modes; status bar shows the mode; a classifier reviews actions in auto mode
- Smashing — 'suggest-only through fully autonomous'

## Sources

- https://code.claude.com/docs/en/permission-modes
- https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/
