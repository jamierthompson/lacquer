---
name: lacquer-version-history
description: Previewable, reversible restore points for both files and conversation, with explicit statements of what a restore does not undo.
---

# Version history, checkpoints and restore

> Previewable, reversible restore points for both files and conversation, with explicit statements of what a restore does not undo.
>
> component · ai/generation · tier 1 · established · status: draft

Also called: Checkpoint (AI Elements), Restore Checkpoint (VS Code), /rewind (Claude Code), checkpoints (Cursor), named checkpoints (Windsurf), History with bookmarks (Lovable), artifact version selector (Claude, ChatGPT).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: current
- states.a11y: current
- modes.treatment: previewing, restored, unrestorable
- modes.a11y: previewing, restored, unrestorable
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: agents edit files
- Use: artifacts iterate
- Avoid: irreversible restores without preview (Windsurf warns 'Reverts are currently irreversible')

Built from: `divider`, `button`, `list`, `dialog`, `badge`, `drawer`.

Pairs with: `diff-review`, `artifact-panel`, `undo-rollback`, `context-meter`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `checkpoint-marker` |  | required | checkpoint marker in the thread with Restore |
| `history-panel` |  | required | history panel: versions, bookmarks, Published badge |
| `snapshot-preview-before` |  | required | snapshot preview before restore |
| `restore-options` |  | required | restore options: code / conversation / both |
| `post-restore-redo` |  | required | post-restore redo |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `current` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `previewing` | missing | missing |  |
| `restored` | missing | missing |  |
| `unrestorable` | missing | missing | unrestorable (too old, external changes) |

## API (framework-neutral)

Interactions:
- preview snapshot
- restore
- bookmark
- summarize from/up to here

## Accessibility

- Accessible name: missing

Markers are buttons with names; history is a list; restore confirms and announces what was and was not restored.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.border.subtle`, `color.fg.muted`, `type.label.sm`, `color.accent.ai-subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Claude Code /rewind — Restore code and conversation / Restore conversation / Restore code / Summarize
- Lovable — preview snapshot, bookmarks, 'does not roll back your database data'
- VS Code — Restore Checkpoint with redo

## Sources

- https://code.claude.com/docs/en/checkpointing
- https://code.visualstudio.com/docs/agents/run/review-code-edits
- https://docs.lovable.dev/features/projects/history.md
- https://elements.ai-sdk.dev/components/checkpoint
