---
name: lacquer-theme-provider
description: Supplies token values and colour scheme to the tree, and exposes the light/dark/system toggle.
---

# Theme Provider

> Supplies token values and colour scheme to the tree, and exposes the light/dark/system toggle.
>
> component · core/utilities · tier 1 · primitive · established · status: draft

Also called: ColorModeProvider, AppProvider, ConfigProvider, ThemeProvider, DirectionProvider.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Always — this is where the token layer physically enters the app
- Avoid: Never; but avoid multiple competing providers in one tree

Pairs with: `box`, `icon`, `chart`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `provider` |  | required | provider |
| `token-css-variables` |  | required | token CSS variables |
| `colour-scheme-attribute` |  | required | colour-scheme attribute |
| `toggle-control` |  | required | toggle control |
| `storage-adapter` |  | required | storage adapter |

## Variants

- **variant**: light | dark | system | high-contrast | brand-scoped | rtl

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Set `color-scheme` so form controls and scrollbars follow; the toggle is a labelled button or radio group.
Keyboard: The toggle is an ordinary control; the choice must persist across sessions.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.canvas`, `color.fg.default`, `radius.*`, `space.*`, `type.*`.

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
- https://atlassian.design/components
