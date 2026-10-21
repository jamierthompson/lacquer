---
name: lacquer-ai-summary-card
description: A labelled summary that always keeps a path to the underlying content and marks itself stale when sources change.
---

# AI summary in lists and cards

> A labelled summary that always keeps a path to the underlying content and marks itself stale when sources change.
>
> component · ai/augmentation · tier 1 · established · status: draft

Also called: AI review summaries (Amazon), Enhanced notes (Granola), thread summaries (Gmail, Notion, GitHub), Summary / Synthesis (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: error
- states.a11y: error
- modes.treatment: generating, ready, stale
- modes.a11y: generating, ready, stale
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: long lists, threads, transcripts, reviews
- Avoid: summaries without access to the source

Built from: `card`, `badge`, `link`, `disclosure`, `button`.

Pairs with: `ai-label`, `inline-citation`, `feedback-control`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `labelled-block` |  | required | labelled block ('Summarized with AI') |
| `summary-text` |  | required | summary text |
| `expand-to-source-links` |  | required | expand-to-source / links back to source spans |
| `regenerate` |  | required | regenerate |
| `feedback` |  | required | feedback |
| `timestamp` |  | required | timestamp |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `error` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `generating` | missing | missing |  |
| `ready` | missing | missing |  |
| `stale` | missing | missing | stale (source changed) |

## API (framework-neutral)

Interactions:
- open source
- regenerate
- collapse

## Accessibility

- Accessible name: missing

Region with a heading naming it as AI-generated; source links are real links.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.accent.ai-subtle`, `color.border.ai`, `radius.md`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Granola — 'My notes' alongside 'Enhanced'
- NN/g — AI Summaries of Reviews

## Sources

- https://www.granola.ai/
- https://www.nngroup.com/articles/designing-ai-study-guide/
