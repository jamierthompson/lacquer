---
name: lacquer-focus-trap
description: Confines Tab order inside a region while it is open and restores focus when it closes.
---

# Focus Trap

> Confines Tab order inside a region while it is open and restores focus when it closes.
>
> component · core/utilities · tier 1 · primitive · established · status: draft

Also called: TrapFocus, FocusScope, FocusLock, Focus manager.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states: base states hover, active, disabled (LQ-STATE-01)
- states.treatment: enabled, focus-visible
- states.a11y: enabled, focus-visible
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Every modal dialog, drawer, lightbox and mobile nav
- Avoid: Non-modal overlays, where trapping strands the user

Pairs with: `dialog`, `drawer`, `portal`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `sentinel-elements` |  | required | sentinel elements |
| `focusable-node-query` |  | required | focusable-node query |
| `restore-focus-reference` |  | required | restore-focus reference |
| `inert-siblings` |  | required | inert siblings |

## Variants

- **variant**: modal | non-modal | auto-focus-first | restore-on-close

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `focus-visible` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Pair with `aria-modal` and `inert` on the rest of the document.
Keyboard: Tab and Shift+Tab cycle within the region; Escape is handled by the owning component.

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

- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
- https://react-aria.adobe.com/llms.txt
