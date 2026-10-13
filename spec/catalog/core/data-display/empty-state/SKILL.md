---
name: lacquer-empty-state
description: Explains why a region has no content and offers the next action.
---

# Empty State

> Explains why a region has no content and offers the next action.
>
> component · core/data-display · tier 1 · organism · established · status: draft

Also called: Blankslate, Illustrated message, Empty, Zero state, EmptySearchResult, No results.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, empty, loading, invalid
- states.a11y: enabled, empty, loading, invalid
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Every list, table, search and inbox — the empty case is not optional
- Avoid: Loading has not finished — show a skeleton instead

Pairs with: `search-input`, `data-table`, `button`, `skeleton`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `illustration-or-icon` |  | required | illustration or icon |
| `heading` |  | required | heading |
| `description` |  | required | description |
| `primary-action` |  | required | primary action |
| `secondary-action` |  | required | secondary action |
| `help-link` |  | required | help link |

## Variants

- **variant**: first-run | no-results | error | permission | cleared/done
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `empty` | missing | missing |  |
| `loading` | missing | missing |  |
| `invalid` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Announce dynamic empty results in a polite live region so the change is not silent.
Keyboard: Actions are ordinary focusable controls.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `space.inset.lg`, `type.heading.sm`, `color.fg.muted`, `size.illustration.md`, `space.stack.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
- https://opensource.adobe.com/spectrum-design-data/components
