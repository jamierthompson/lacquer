---
name: lacquer-toolbar
description: A grouped row of controls that shares one tab stop and arrow-key navigation.
---

# Toolbar

> A grouped row of controls that shares one tab stop and arrow-key navigation.
>
> component · core/actions · tier 2 · organism · established · status: draft

Also called: ActionBar, Command bar, Action group, Ornament.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, hover, focus-visible, active, disabled, selected
- states.a11y: enabled, hover, focus-visible, active, disabled, selected
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Editors, table headers, canvas tools, message action rows
- Avoid: Two or three buttons only — a Button Group is simpler

Pairs with: `icon-button`, `toggle-group`, `dropdown-menu`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `container` |  | required | container |
| `control-groups` |  | required | control groups |
| `separators` |  | required | separators |
| `overflow-menu` |  | required | overflow menu |

## Variants

- **variant**: horizontal | vertical | floating | docked
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `hover` | missing | missing |  |
| `focus-visible` | missing | missing |  |
| `active` | missing | missing |  |
| `disabled` | missing | missing |  |
| `selected` | missing | missing |  |

## Accessibility

- APG pattern: [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- Accessible name: missing

ARIA: `role="toolbar"` with `aria-label` and `aria-orientation`; roving tabindex inside.
Keyboard: One Tab stop; Left/Right (or Up/Down) move between controls; Home/End jump to ends.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.surface`, `color.bg.surface`, `space.gap.xs`, `shadow.sm`, `color.border.subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-STATE-01** (MUST) All five base states. Every interactive component implements enabled, hover, focus-visible, active and disabled with a defined visual treatment, including in dark mode.
  Fix: Add the missing state using the component's token deltas (see its states[] treatment).
- **LQ-STATE-03** (MUST) Every state reaches the accessibility tree. Every visible state has an ARIA expression or an explicit "none" in the spec; selected, expanded, invalid, busy and current are never visual-only.
  Fix: Set the attribute the APG pattern specifies; do not invent a new one.
- **LQ-SEM-01** (MUST) Native element first. Prefer the native element (button, a, select, details, input) until a product requirement makes it impossible; a div or span with a click handler and a role is a defect unless the spec names an exception.
  Fix: Replace with the native element; keep the styling.
- **LQ-NAME-01** (MUST) Every control has an accessible name. Every interactive element has an accessible name from content, a label, aria-label or aria-labelledby; placeholder text and title attributes do not count.
  Fix: Add visible text, a <label>, or aria-label for icon-only controls.
- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-STATE-02** (MUST) No state by colour alone. No state is expressed by colour alone; every state has a second channel (icon, weight, border, position or text).
  Fix: Add an icon, border, weight or text change alongside the colour change.
- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Use `focus-visible:ring-2 ring-ring ring-offset-2` (or the binding's equivalent) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://base-ui.com/react/overview/quick-start
