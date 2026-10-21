---
name: lacquer-sources-panel
description: The answer-level view of all sources: a count at the action bar plus an expandable list or side panel.
---

# Sources row / panel

> The answer-level view of all sources: a count at the action bar plus an expandable list or side panel.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Sources (AI Elements: 'Used N sources'), Sources tab / sidebar (Perplexity), References (Shape of AI), Links tab.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: expanded, empty
- states.a11y: expanded, empty
- modes.treatment: collapsed, panel
- modes.a11y: collapsed, panel
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any grounded answer with more than one source
- Avoid: single-source answers (inline marker suffices)

Built from: `disclosure`, `list`, `drawer`, `tabs`, `card`.

Pairs with: `inline-citation`, `message-actions`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `favicon-stack` |  | required | favicon stack + count at action-bar prominence |
| `collapsible-list` |  | required | collapsible list or side panel of source cards |
| `per-card` |  | required | per-card: favicon, title, domain, snippet, open |

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
| `collapsed` | missing | missing | collapsed (count) |
| `panel` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click count to expand or open panel
- filter by domain type (optional)
- report wrong source

## Accessibility

- Accessible name: missing

List semantics; panel is a dialog or complementary region with focus management.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-secondary`, `radius.md`, `space.gap.sm`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Perplexity — favicon stack + '10 sources' beside share/copy
- AI Elements Sources — 'Used 3 sources' trigger

## Sources

- https://elements.ai-sdk.dev/components/sources
- https://aiuxplayground.com/teardowns/perplexity/citations/
