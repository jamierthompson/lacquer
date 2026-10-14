---
name: lacquer-tabs
description: Switches between sibling panels of content within the same context.
---

# Tabs

> Switches between sibling panels of content within the same context.
>
> component · core/selection · tier 1 · organism · established · status: draft

Also called: TabList, UnderlineNav, Tab views, Navs & tabs, Content switcher.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, hover, focus-visible, active, disabled, selected, current
- states.a11y: enabled, hover, focus-visible, active, disabled, selected, current
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Peer views of one object (Overview / Activity / Settings)
- Avoid: Content is sequential — use a stepper
- Avoid: Each tab is really a separate page — use nav

Pairs with: `card`, `badge`, `empty-state`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `tab-list` |  | required | tab list |
| `tab` |  | required | tab |
| `active-indicator` |  | required | active indicator |
| `tab-panel` |  | required | tab panel |
| `overflow-control` |  | required | overflow control |

## Variants

- **variant**: underline | pill | enclosed | vertical | scrollable | with-icons | with-counters
- **size**: sm | md | lg

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
| `current` | missing | missing |  |

## Accessibility

- APG pattern: [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Accessible name: missing

ARIA: `role="tablist"` / `tab` / `tabpanel`; `aria-selected` and `aria-controls` link them.
Keyboard: One tab stop; Left/Right (Up/Down when vertical) move; Home/End jump; automatic or manual activation.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.accent`, `color.border.accent`, `type.label.md`, `space.inset.control.sm`, `motion.duration.fast`.

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

- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://m3.material.io/components
- https://developer.apple.com/design/human-interface-guidelines/components
