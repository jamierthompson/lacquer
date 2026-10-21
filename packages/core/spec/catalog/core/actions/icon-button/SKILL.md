---
name: lacquer-icon-button
description: A button whose entire visible label is an icon, used where space is tight and the meaning is conventional.
---

# Icon Button

> A button whose entire visible label is an icon, used where space is tight and the meaning is conventional.
>
> component · core/actions · tier 1 · atom · established · status: draft

Also called: ActionIcon, IconButton, Action button, Square button, Toolbar button.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti

## Use it when / not when

- Use: Toolbars, table row actions, close affordances, message actions, a composer's send control.
- Avoid: The icon's meaning is not universally understood; add a visible text label (button).
- If the meaning needs words → use `button`
- If it toggles and stays on → use `toggle-button`

Built from: `badge`.

Pairs with: `tooltip`, `toolbar`, `table`, `composer`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` | button | required | The native button, square, at least size.control.*; carries aria-label and every state attribute. |
| `icon` |  | required | slot. The glyph. Decorative (aria-hidden); the name is on the root. |
| `spinner` |  | optional | Replaces the icon while loading, same box, so the button does not change size. |
| `badge` |  | optional | A count or dot pinned to the corner (reuses badge); its text is appended to the name. |

## Variants

- **emphasis**: ghost | outline | tonal | filled | destructive (default `ghost`) — Same ladder as button, minus link; ghost is the toolbar default. Destructive is an emphasis, not a colour.
- **shape**: square | round (default `square`) — Round for a lone control (a composer's send); square inside toolbars and rows so edges align.
- **size**: xs | sm | md | lg (default `md`) — Size sets the box and the icon together; the hit area is never smaller than size.control.sm.

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | Base tokens for the emphasis; icon in color.fg.default (or on-* for filled and destructive). | Default semantics; aria-label is the name. |  |
| `hover` | Background one step (color.bg.*-hover, or color.bg.accent for ghost and outline). Never move the element. | none |  |
| `focus-visible` | Ring in color.border.focus with focus.ring.width and focus.ring.offset. Use :focus-visible, not :focus. | Implicit. Never outline none without a replacement (LQ-FOCUS-01). |  |
| `active` | One pixel down, so the state is not colour alone. | none (transient) |  |
| `disabled` | opacity.disabled; pointer-events none; hover and active removed. | `disabled` removes it from the tab order; aria-disabled keeps it focusable so the reason can be discovered. |  |
| `selected` | color.bg.selected plus a border change. Toggle usage only. | aria-pressed="true". |  |
| `loading` | The spinner replaces the icon in the same box; activation blocked. | aria-busy="true" and aria-disabled="true". |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `label`* | `string` |  | aria-label | The accessible name. Required; there is no icon-button without one (LQ-NAME-01). |
| `emphasis` | `enum(ghost\|outline\|tonal\|filled\|destructive)` | `ghost` | data-emphasis |  |
| `shape` | `enum(square\|round)` | `square` | data-shape |  |
| `size` | `enum(xs\|sm\|md\|lg)` | `md` | data-size |  |
| `pressed` | `boolean` |  | aria-pressed | Toggle usage; omitted means not a toggle. |
| `loading` | `boolean` | `false` | aria-busy |  |
| `disabled` | `boolean` | `false` | disabled |  |
| `softDisabled` | `boolean` | `false` | aria-disabled | Keeps the button focusable so a tooltip can explain why it is unavailable. |
| `type` | `enum(button\|submit\|reset)` | `button` |  |  |

Slots: `icon`, `badge`.
Events: `press`.

The icon is a child, wrapped in the icon part and hidden from assistive tech; the name is a required prop so the component cannot be rendered without one. Emphasis, shape and size are closed sets the system owns.

## Accessibility

- APG pattern: [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- Role: button (implicit from the native element)
- Accessible name: From aria-label, always; the icon is aria-hidden. A tooltip may repeat the name but never replaces it.
- `aria-label` on root = label
- `aria-pressed` on root = true | false when used as a toggle
- `aria-busy` on root = true when loading
- `aria-disabled` on root = true when softDisabled or loading

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the button. Hard-disabled buttons are skipped; soft-disabled are not. |
| `Enter` | Activates. |
| `Space` | Activates on key-up. |

Focus: Focus stays on the button after activation unless the action moves it deliberately.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.primary`, `color.bg.primary-hover`, `color.fg.on-primary`, `color.bg.secondary`, `color.bg.secondary-hover`, `color.fg.on-secondary`, `color.bg.accent`, `color.bg.selected`, `color.bg.destructive`, `color.bg.destructive-hover`, `color.fg.on-destructive`, `color.fg.default`, `color.border.input`, `color.border.focus`, `radius.control`, `radius.pill`, `size.control.xs`, `size.control.sm`, `size.control.md`, `size.control.lg`, `size.icon.sm`, `size.icon.md`, `focus.ring.width`, `focus.ring.offset`, `motion.duration.fast`, `motion.easing.standard`, `opacity.disabled`.

## Content

- Label: Verb first, then the object, as the aria-label ("Send message", "Close dialog", "Copy code").
- Never: Never the icon's name ("Arrow up", "X") as the label.

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
- **LQ-MOTION-02** (MUST) Reduced motion is honoured. Any transition longer than 150 ms or any looping animation has a `prefers-reduced-motion` branch that removes movement (opacity-only is fine).
  Fix: Add `motion-reduce:transition-none` / `motion-reduce:animate-none` or an equivalent media query.

### Forbidden

- **LQ-STATE-02** (MUST) No state by colour alone. No state is expressed by colour alone; every state has a second channel (icon, weight, border, position or text).
  Fix: Add an icon, border, weight or text change alongside the colour change.
- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Use `focus-visible:ring-2 ring-ring ring-offset-2` (or the binding's equivalent) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Implementations

- html: `examples/html/icon-button.html` (reference)

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://m3.material.io/components
- https://fluent2.microsoft.design/components/web/react
