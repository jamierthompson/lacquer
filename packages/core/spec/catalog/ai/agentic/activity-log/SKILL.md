---
name: lacquer-activity-log
description: The audit surface: every agent action with time, target and result, filterable and exportable; the basis for undo and 'why did it do that'.
---

# Activity log / trace

> The audit surface: every agent action with time, target and result, filterable and exportable; the basis for undo and 'why did it do that'.
>
> component · ai/agentic · tier 2 · established · status: draft

Also called: transcript / tool log (Claude Code), agent trace (Cursor, Vercel), chain of thought (Chainlit), Action Audit (Smashing), Footprints (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: complete, empty
- states.a11y: complete, empty
- modes.treatment: live, filtered
- modes.a11y: live, filtered
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: agents that act on files, data or external systems
- Avoid: read-only assistants

Built from: `table`, `list`, `disclosure`, `badge`, `filter-bar`.

Pairs with: `tool-call-card`, `undo-rollback`, `approval-prompt`, `explainability-popover`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `chronological-list` |  | required | chronological list: timestamp, action, target, result, cost |
| `filters-by-type-status` |  | required | filters by type/status |
| `collapsible-detail` |  | required | collapsible detail |
| `export` |  | required | export |
| `undo-affordance-per` |  | required | undo affordance per reversible entry |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `complete` | missing | missing |  |
| `empty` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `live` | missing | missing |  |
| `filtered` | missing | missing |  |

## API (framework-neutral)

Interactions:
- expand entry
- filter
- jump to message
- undo/compensate

## Accessibility

- Accessible name: missing

Log region (polite) for live entries; table or list semantics; filters are form controls.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `type.family.mono`, `type.label.sm`, `color.fg.muted`, `color.border.subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Smashing (Yocco 2026) — Action Audit & Undo
- HAX G11 — make clear why the system did what it did

## Sources

- https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/
- https://www.microsoft.com/en-us/haxtoolkit/library/
