---
name: lacquer-kbd
description: Renders a keyboard key or chord, and doubles as the shortcut hint on menus and buttons.
---

# Kbd

> Renders a keyboard key or chord, and doubles as the shortcut hint on menus and buttons.
>
> component · core/typography · tier 2 · atom · established · status: draft

Also called: KeyboardKey, KeybindingHint, Shortcut, Hotkey.

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

- Use: Command palettes, menu items, empty states teaching shortcuts
- Avoid: The shortcut is not actually implemented

Pairs with: `command-palette`, `dropdown-menu`, `tooltip`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `key-cap` |  | required | key cap |
| `modifier-separator` |  | required | modifier separator |
| `group-of-caps` |  | required | group of caps |

## Variants

- **variant**: single-key | chord | subtle | outline
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `kbd`; include the platform-correct modifier names in the text.
Keyboard: Decorative — the shortcut itself must be bound elsewhere.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.code.sm`, `color.bg.subtle`, `color.border.default`, `radius.control`, `shadow.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://chakra-ui.com/docs/components/concepts/overview
- https://mantine.dev/core/package/
