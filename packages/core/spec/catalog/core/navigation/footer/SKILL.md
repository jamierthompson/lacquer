---
name: lacquer-footer
description: Site-wide closing region with secondary navigation, legal links and contact information.
---

# Footer

> Site-wide closing region with secondary navigation, legal links and contact information.
>
> component · core/navigation · tier 2 · organism · established · status: draft

Also called: Site footer, FooterColumns, Layout.Footer, FooterHelp.

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

- Use: Public-facing sites and any product with legal obligations
- Avoid: Full-height app shells where it would compete with content

Pairs with: `container`, `link`, `app-header`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `contentinfo-landmark` |  | required | contentinfo landmark |
| `link-columns` |  | required | link columns |
| `legal-row` |  | required | legal row |
| `locale-selector` |  | required | locale selector |
| `social-links` |  | required | social links |
| `back-to-top` |  | required | back-to-top |

## Variants

- **variant**: minimal | columns | with-newsletter | app-footer
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- APG pattern: [Landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- Accessible name: missing

ARIA: `footer` mapped to `role="contentinfo"` at the page level; internal nav gets `nav[aria-label]`.
Keyboard: Standard link tabbing; must come last in DOM order.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.subtle`, `type.body.sm`, `space.inset.page`, `space.gap.lg`, `color.fg.muted`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/
- https://design-system.service.gov.uk/components/
- https://designsystem.digital.gov/components/overview/
