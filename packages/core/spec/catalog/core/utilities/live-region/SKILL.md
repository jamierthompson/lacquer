---
name: lacquer-live-region
description: Announces dynamic changes to screen readers without moving focus.
---

# Live Region

> Announces dynamic changes to screen readers without moving focus.
>
> component · core/utilities · tier 1 · primitive · established · status: draft

Also called: Announcer, aria-live region, Status region, VisuallyHidden status.

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

- Use: Search result counts, save confirmations, streaming status, validation summaries
- Avoid: Assertive for anything non-urgent — it interrupts whatever is being read

Pairs with: `toast`, `search-input`, `copy-button`, `visually-hidden`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `persistent-container` |  | required | persistent container |
| `politeness-setting` |  | required | politeness setting |
| `message-queue` |  | required | message queue |
| `clear-reset-timer` |  | required | clear/reset timer |

## Variants

- **variant**: polite | assertive | atomic | status | log

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: `aria-live="polite|assertive"`, or `role="status"`/`"alert"`/`"log"`; the node must exist before text is inserted.
Keyboard: No focus change — that is the entire point.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://react-aria.adobe.com/llms.txt
- https://www.radix-ui.com/primitives/docs/overview/introduction
