---
name: lacquer-diff-review
description: Per-file, per-hunk acceptance of AI edits with a global accept/reject and a visible auto-accept policy.
---

# Diff view with accept/reject

> Per-file, per-hunk acceptance of AI edits with a global accept/reject and a visible auto-accept policy.
>
> component · ai/generation · tier 2 · established · status: draft

Also called: Review changes pane (Cursor), Keep/Undo (VS Code Copilot), Accept/Reject (Windsurf), tracked changes for prose, Verification (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: input-streaming
- states.a11y: input-streaming
- modes.treatment: accepted, rejected, auto-accepted, conflict
- modes.a11y: accepted, rejected, auto-accepted, conflict
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: AI edits code or long prose
- Avoid: silent auto-apply without a review surface

Built from: `code-block`, `list`, `button`, `tabs`, `badge`.

Pairs with: `version-history`, `approval-prompt`, `artifact-panel`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `file-list` |  | required | file list with +/- counts |
| `per-file-unified` |  | required | per-file unified or split diff |
| `per-hunk-accept` |  | required | per-hunk Accept / Reject |
| `accept-all` |  | required | Accept all / Reject all |
| `review-helper` |  | required | review helper (Find issues) |
| `auto-accept-delay-setting` |  | required | auto-accept delay setting (visible) |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `input-streaming` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `accepted` | missing | missing |  |
| `rejected` | missing | missing |  |
| `auto-accepted` | missing | missing |  |
| `conflict` | missing | missing |  |

## API (framework-neutral)

Interactions:
- navigate edits with arrows
- keyboard accept/reject
- toggle inline vs panel diffs

## Accessibility

- Accessible name: missing

Hunks are named regions ('Change 2 of 5 in app.tsx'); +/- glyphs alongside colour; shortcuts for accept/reject.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.diff-add`, `color.bg.diff-remove`, `color.fg.diff-add`, `color.fg.diff-remove`, `type.family.mono`, `color.bg.code`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- VS Code — Keep/Undo per file or per edit, auto-accept delay setting
- Cursor 2.5 — inline diffs toggleable, review panel default

## Sources

- https://code.visualstudio.com/docs/agents/run/review-code-edits
- https://cursor.com/changelog/2-5
