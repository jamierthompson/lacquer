---
name: lacquer-alert
description: Contextual, in-page message about the state of a task, region or system.
---

# Alert

> Contextual, in-page message about the state of a task, region or system.
>
> component · core/feedback · tier 1 · molecule · established · status: draft

Also called: InlineMessage, Callout, Banner, Notification (inline), SectionMessage, MessageBar, Notification banner, Site alert, Summary box, Flag.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states: base states active, disabled (LQ-STATE-01)
- states.treatment: enabled, hover, focus-visible, success, warning, invalid
- states.a11y: enabled, hover, focus-visible, success, warning, invalid
- modes.treatment: info, dismissed
- modes.a11y: info, dismissed
- api.props
- accessibility.name
- accessibility.keyboard
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Explaining an error, warning about consequences, confirming a state that persists
- Avoid: The message is transient — use a toast
- Avoid: It blocks the flow — use a dialog

Pairs with: `form-error-summary`, `button`, `toast`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `container` |  | required | container |
| `status-icon` |  | required | status icon |
| `title` |  | required | title |
| `body` |  | required | body |
| `action-links` |  | required | action links |
| `dismiss-button` |  | required | dismiss button |

## Variants

- **variant**: info | success | warning | danger/error | neutral | inline | page-level/global | dismissible
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `hover` | missing | missing |  |
| `focus-visible` | missing | missing |  |
| `success` | missing | missing |  |
| `warning` | missing | missing |  |
| `invalid` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `info` | missing | missing |  |
| `dismissed` | missing | missing |  |

## Accessibility

- APG pattern: [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- Accessible name: missing

ARIA: Static messages are plain regions; messages appearing in response to an action use `role="alert"` or `role="status"`.
Keyboard: Dismiss and action controls are focusable; Escape may dismiss a page-level banner.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.info-subtle`, `color.border.info`, `radius.surface`, `space.inset.md`, `color.fg.default`, `size.icon.md`.

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

- https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- https://m3.material.io/components
- https://carbondesignsystem.com/components/overview/components/
