---
name: lacquer-plan-view
description: The agent proposes an editable plan before acting; approval is explicit and changes the agent's mode visibly.
---

# Plan view / task list

> The agent proposes an editable plan before acting; approval is explicit and changes the agent's mode visibly.
>
> component · ai/agentic · tier 1 · emerging · status: draft

Also called: Plan, Task, Queue (AI Elements), Action plan (Shape of AI), plan mode (Claude Code, Cursor), Plan mode (Lovable), todo lists (Windsurf Cascade), Steps (prompt-kit).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: awaiting-approval, complete
- states.a11y: awaiting-approval, complete
- modes.treatment: drafting, approved, executing, abandoned
- modes.a11y: drafting, approved, executing, abandoned
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: multi-step agent tasks
- Use: any edit to code or data
- Avoid: single-shot answers

Built from: `disclosure`, `list`, `checkbox`, `badge`, `button`, `textarea`.

Pairs with: `agent-status`, `approval-prompt`, `autonomy-dial`, `activity-log`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `title-and-summary` |  | required | title and summary |
| `ordered-steps` |  | required | ordered steps with status glyph (pending, active with shimmer, done, error, skipped) |
| `files-artifacts-per-step` |  | required | files/artifacts per step |
| `footer` |  | required | footer: Approve / Edit plan / Keep planning |
| `editable-as-markdown` |  | required | editable as markdown |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `awaiting-approval` | missing | missing |  |
| `complete` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `drafting` | missing | missing | drafting (streaming) |
| `approved` | missing | missing | approved (mode switch) |
| `executing` | missing | missing | executing (progress n/m) |
| `abandoned` | missing | missing |  |

## API (framework-neutral)

Interactions:
- edit plan text
- approve with explicit mode choice
- keep planning with feedback
- collapse when executing

## Accessibility

- Accessible name: missing

Ordered list with per-step status text; approval controls are buttons with focus on the safest option; progress announced per step.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.status.pending`, `color.status.running`, `color.status.success`, `color.status.error`, `shimmer.duration`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Claude Code — 'Yes, and use auto mode' / 'Yes, manually approve edits' / 'No, keep planning'
- Lovable — plan as a readable markdown document, edits blocked until approved
- AI Elements Plan/Task — streaming shimmer, file chips, progress counters

## Sources

- https://code.claude.com/docs/en/permission-modes
- https://docs.lovable.dev/features/plan-mode.md
- https://elements.ai-sdk.dev/components/plan
- https://elements.ai-sdk.dev/components/task
