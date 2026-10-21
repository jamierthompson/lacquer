---
name: lacquer-scrim
description: The dimming layer behind a modal surface that signals the rest of the UI is unavailable.
---

# Scrim

> The dimming layer behind a modal surface that signals the rest of the UI is unavailable.
>
> component · core/overlays · tier 2 · primitive · established · status: draft

Also called: Backdrop, Blanket, Overlay, Modal background, Shade.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: hidden
- modes.a11y: hidden
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Behind every modal dialog, drawer and lightbox
- Avoid: Non-modal popovers and tooltips

Pairs with: `dialog`, `drawer`, `gallery-lightbox`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `full-viewport-layer` |  | required | full-viewport layer |
| `opacity` |  | required | opacity |
| `optional-blur` |  | required | optional blur |
| `click-to-dismiss-handler` |  | required | click-to-dismiss handler |

## Variants

- **variant**: dim | blur | transparent | inverse

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `hidden` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: `aria-hidden` itself; it must be paired with making the content beneath `inert`.
Keyboard: Not focusable; clicking it may dismiss, but Escape must also work.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.scrim`, `z.overlay`, `motion.duration.fast`, `blur.overlay`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://m3.material.io/components
- https://atlassian.design/components
