---
name: lacquer-back-to-top
description: Floating control that returns the viewport to the top of a long page.
---

# Back to Top

> Floating control that returns the viewport to the top of a long page.
>
> component · core/navigation · tier 3 · molecule · established · status: draft

Also called: ScrollTop, BackTop, FloatButton.BackTop, Scroll to top.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, hover, focus-visible, active, disabled
- states.a11y: enabled, hover, focus-visible, active, disabled
- modes.treatment: hidden
- modes.a11y: hidden
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Very long documents, search results, chat transcripts
- Avoid: Short pages or when it covers content

Pairs with: `scroll-area`, `icon-button`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `floating-button` |  | required | floating button |
| `icon` |  | required | icon |
| `appearance-threshold` |  | required | appearance threshold |

## Variants

- **variant**: icon | with-label | docked
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

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `hidden` | missing | missing |  |

## Accessibility

- APG pattern: [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- Accessible name: missing

ARIA: Labelled button that moves focus to the top landmark, not just the scroll position.
Keyboard: Reachable by Tab once visible; Enter/Space scrolls and moves focus.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `radius.full`, `shadow.md`, `z.sticky`, `motion.duration.base`.

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

- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://ant.design/components/overview/
- https://primevue.dev/
