---
name: lacquer-resizable-panels
description: Split layout whose regions are resized by dragging a handle between them.
---

# Resizable Panels

> Split layout whose regions are resized by dragging a handle between them.
>
> component · core/layout · tier 3 · organism · established · status: draft

Also called: Splitter, Split view, SplitPageLayout, Panes.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, hover, focus-visible, active, disabled, dragging
- states.a11y: enabled, hover, focus-visible, active, disabled, dragging
- modes.treatment: collapsed
- modes.a11y: collapsed
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Editor plus preview, chat plus canvas, file tree plus content
- Avoid: Mobile widths — collapse to stacked or tabbed layout instead

Pairs with: `sidebar-nav`, `code-block`, `scroll-area`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `panel-group` |  | required | panel group |
| `panel` |  | required | panel |
| `resize-handle` |  | required | resize handle |
| `collapse-affordance` |  | required | collapse affordance |

## Variants

- **variant**: horizontal | vertical | nested | collapsible

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `hover` | missing | missing |  |
| `focus-visible` | missing | missing |  |
| `active` | missing | missing |  |
| `disabled` | missing | missing |  |
| `dragging` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `collapsed` | missing | missing |  |

## Accessibility

- APG pattern: [Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)
- Accessible name: missing

ARIA: `role="separator"` on the handle with `aria-valuenow/min/max` and `aria-controls`.
Keyboard: Arrow keys move the splitter; Enter collapses/restores; Home/End jump to extremes; F6 cycles panes.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.border.default`, `color.bg.subtle`, `size.control.sm`, `motion.duration.fast`.

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
  Fix: Draw the ring on `:focus-visible` from the binding's roles (`focus.ring.width`, `color.border.focus`, `focus.ring.offset`) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- https://ui.shadcn.com/docs/components
- https://chakra-ui.com/docs/components/concepts/overview
