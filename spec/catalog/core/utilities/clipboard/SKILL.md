---
name: lacquer-clipboard
description: Behaviour that writes to and reads from the system clipboard with fallbacks and feedback.
---

# Clipboard

> Behaviour that writes to and reads from the system clipboard with fallbacks and feedback.
>
> component · core/utilities · tier 2 · primitive · established · status: draft

Also called: useClipboard, CopyToClipboard, Clipboard root, Copy behaviour.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, success, invalid
- states.a11y: enabled, success, invalid
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: API keys, share links, code, generated text
- Avoid: Insecure contexts where the API is unavailable and no fallback exists

Pairs with: `copy-button`, `code-block`, `toast`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `value-source` |  | required | value source |
| `trigger` |  | required | trigger |
| `indicator` |  | required | indicator |
| `live-region` |  | required | live region |
| `fallback-text-field` |  | required | fallback text field |

## Variants

- **variant**: copy | cut | paste-handler | copy-rich-text

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `success` | missing | missing |  |
| `invalid` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Announce the outcome politely; the fallback must let users select the text manually.
Keyboard: Ctrl/Cmd+C on selected content must keep working; the trigger is a button.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.success`, `motion.duration.base`.

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
- https://ark-ui.com/docs/components/accordion
