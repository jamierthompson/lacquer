---
name: lacquer-variation-grid
description: Show several candidates at once so the user chooses rather than re-prompts; keep the prompt visible and reveal cells as they finish.
---

# Variation grid

> Show several candidates at once so the user chooses rather than re-prompts; keep the prompt visible and reveal cells as they finish.
>
> component · ai/generation · tier 2 · established · status: draft

Also called: 2x2 grid + Vary Subtle/Strong + Upscale (Midjourney), 4-up results (Ideogram, DALL-E, Imagen), Variations (Shape of AI Governors), First Draft alternatives (Figma), /best-of-n (Cursor).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: complete, selected
- states.a11y: complete, selected
- modes.treatment: generating, partial-failure
- modes.a11y: generating, partial-failure
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: image, video, design or code outputs where variability is the point
- Avoid: mixed aspect ratios in one grid
- Avoid: all-or-nothing loading

Built from: `grid`, `card`, `image`, `skeleton`, `icon-button`, `dialog`.

Pairs with: `generation-progress`, `attachment-preview`, `content-credentials`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `grid-of-2` |  | required | grid of 2–4 candidates, identical aspect ratio |
| `per-cell-skeleton` |  | required | per-cell skeleton with progressive reveal |
| `per-item-actions` |  | required | per-item actions: select, vary, upscale, download |
| `grid-level-more-like` |  | required | grid-level 'more like this' |
| `prompt-shown-beneath` |  | required | prompt shown beneath with reuse |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `complete` | missing | missing |  |
| `selected` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `generating` | missing | missing | generating (per-cell) |
| `partial-failure` | missing | missing |  |

## API (framework-neutral)

Interactions:
- select one to continue
- vary creates a new grid
- compare side by side

## Accessibility

- Accessible name: missing

List/grid semantics with per-item names ('Variation 2 of 4'); generated alt text editable; keyboard selection.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `space.gap.sm`, `radius.md`, `color.bg.surface-secondary`, `shadow.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Midjourney — grid with Vary/Upscale actions (product behaviour; docs page not fetched)
- Apple HIG — 'Offering people a choice can give them a greater sense of control'

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://cursor.com/changelog/3-0
