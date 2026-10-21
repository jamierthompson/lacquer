---
name: lacquer-virtual-list
description: Renders only visible rows of a large collection, with optional infinite loading.
---

# Virtual List

> Renders only visible rows of a large collection, with optional infinite loading.
>
> component · core/utilities · tier 2 · primitive · established · status: draft

Also called: Virtualizer, VirtualScroller, Windowing, Infinite scroll, Lazy list.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, loading, empty, skeleton
- states.a11y: enabled, loading, empty, skeleton
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Thousands of rows, long chat transcripts, log viewers
- Avoid: Under a few hundred simple rows — complexity outweighs the gain

Pairs with: `list-view`, `data-table`, `scroll-area`, `tree-view`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `scroll-container` |  | required | scroll container |
| `spacer-elements` |  | required | spacer elements |
| `rendered-window` |  | required | rendered window |
| `item-measurement-cache` |  | required | item measurement cache |
| `sentinel-loader` |  | required | sentinel/loader |
| `scroll-restoration` |  | required | scroll restoration |

## Variants

- **variant**: fixed-height | variable-height | grid | infinite | bidirectional

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `loading` | missing | missing |  |
| `empty` | missing | missing |  |
| `skeleton` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Expose `aria-setsize` and `aria-posinset` (or `aria-rowcount`) so assistive tech knows the true total.
Keyboard: Keyboard navigation must move through all items, not only rendered ones; Home/End reach true bounds.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `size.control.row`, `space.gap.2xs`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://react-aria.adobe.com/llms.txt
- https://fluent2.microsoft.design/components/web/react
