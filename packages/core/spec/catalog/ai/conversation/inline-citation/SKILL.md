---
name: lacquer-inline-citation
description: A compact marker on the claim that reveals its source on hover/focus; cite claims, not paragraphs, and show missing sources as missing.
---

# Inline citation

> A compact marker on the claim that reveals its source on hover/focus; cite claims, not paragraphs, and show missing sources as missing.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Inline Citation (AI Elements), Source (prompt-kit), Citations (Shape of AI), Perplexity citation chips, NotebookLM numbered citations, Copilot references.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: single, multiple, missing-broken, weak
- modes.a11y: single, multiple, missing-broken, weak
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: retrieval- or search-grounded answers
- Use: document Q&A
- Avoid: decorative citations without a real retrieval step
- Avoid: hiding gaps when a source is missing

Built from: `hover-card`, `popover`, `badge`, `link`.

Pairs with: `sources-panel`, `feedback-control`, `explainability-popover`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `marker-attached` |  | required | marker attached to the claim: superscript number or publisher chip with favicon and +N |
| `hover-focus-card` |  | required | hover/focus card: title, domain, snippet or quote |
| `carousel-with-index` |  | required | carousel with index (1/5) when several sources |
| `deep-link` |  | required | deep link to passage |

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
| `multiple` | missing | missing | multiple (+N) |
| `missing-broken` | missing | missing | missing/broken (shown explicitly) |
| `weak` | missing | missing | weak (optional strength indicator) |

## API (framework-neutral)

Interactions:
- hover or focus opens card
- Enter/click opens source
- Esc closes
- paging through sources

## Accessibility

- Accessible name: missing

Marker is a button named 'Source 3: example.com'; card opens on focus and closes on Esc; not announced live.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.citation-chip`, `color.fg.muted`, `type.label.sm`, `radius.pill`, `color.bg.surface-raised`, `shadow.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Perplexity — publisher-first chips with +N; three routes into sources
- NotebookLM — click reveals the exact passage
- AI Elements InlineCitationCarousel — 1/5 index

## Sources

- https://elements.ai-sdk.dev/components/inline-citation
- https://aiuxplayground.com/teardowns/perplexity/citations/
- https://www.shapeof.ai/patterns/citations
