---
name: lacquer-carousel
description: Cycles through a set of slides in one region, manually or automatically.
---

# Carousel

> Cycles through a set of slides in one region, manually or automatically.
>
> component · core/media · tier 3 · organism · established · status: draft

Also called: Slider, Slideshow, Image rotator, Gallery strip, Swiper.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, hover, focus-visible, active, disabled, current, dragging, loading
- states.a11y: enabled, hover, focus-visible, active, disabled, current, dragging, loading
- modes.treatment: paused
- modes.a11y: paused
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Product galleries, onboarding tours, constrained mobile space
- Avoid: Content matters — carousels are consistently under-engaged with

Pairs with: `image`, `gallery-lightbox`, `pagination`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `viewport` |  | required | viewport |
| `slides` |  | required | slides |
| `previous-next` |  | required | previous/next |
| `pagination-dots` |  | required | pagination dots |
| `play-pause` |  | required | play/pause |
| `live-region` |  | required | live region |
| `counter` |  | required | counter |

## Variants

- **variant**: single-slide | multi-item | auto-play | peek | thumbnail-nav
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
| `current` | missing | missing |  |
| `dragging` | missing | missing |  |
| `loading` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `paused` | missing | missing |  |

## Accessibility

- APG pattern: [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- Accessible name: missing

ARIA: `role="group"` with `aria-roledescription="carousel"`; slides labelled 'n of m'; auto-rotation needs a pause control.
Keyboard: Left/Right move between slides; Tab reaches controls; auto-rotation stops on hover and focus.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.surface`, `space.gap.md`, `motion.duration.base`, `shadow.sm`, `size.control.md`.

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

- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- https://m3.material.io/components
- https://fluent2.microsoft.design/components/web/react
