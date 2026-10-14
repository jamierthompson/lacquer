---
name: lacquer-textarea
description: Multi-line free-text entry, usually growing with its content up to a limit, then scrolling.
---

# Textarea

> Multi-line free-text entry, usually growing with its content up to a limit, then scrolling.
>
> component · core/inputs · tier 1 · atom · established · status: draft

Also called: TextArea, Multiline input, Autosize textarea, Prompt box.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti

## Use it when / not when

- Use: Comments, descriptions, prompt composition.
- Avoid: Rich formatting is required; use a rich text editor.
- Avoid: One line will always do; that is text-input.
- If the value is a single line → use `text-input`

Pairs with: `field`, `button`, `file-upload`, `composer`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` |  | required | The wrapper. Carries data-sizing, data-frame, data-size and data-empty, and the `--lq-textarea-max-rows` parameter the autosize limit reads. |
| `control` | textarea | required | The native textarea. Every state is an attribute on it; it is where the name lives. |
| `counter` |  | optional | Characters used of the limit, beneath the control; referenced by aria-describedby. |

## Variants

- **sizing**: fixed | autosize (default `autosize`) — Autosize grows with content from `rows` to maxRows using the `field-sizing` property, then scrolls; fixed keeps `rows` and lets the user drag the resize handle.
- **frame**: outlined | borderless (default `outlined`) — Borderless is for embedding inside a parent that draws the frame and the focus ring, such as composer.
- **size**: sm | md | lg (default `md`) — Size changes the inset; the text style stays type.body.md so lines align with the rest of the form.

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | color.bg.surface, a color.border.input border, radius.control, type.body.md in color.fg.default. | Default semantics; the name comes from a label. |  |
| `hover` | Border one step to color.border.default. | none |  |
| `focus-visible` | Ring in color.border.focus (focus.ring.width, focus.ring.offset) on the control; borderless frames leave the ring to the parent. | Implicit. Never outline none without a replacement (LQ-FOCUS-01). |  |
| `active` | none; typing has no pressed state, the focus treatment applies. | none |  |
| `disabled` | opacity.disabled; no hover or focus response; the resize handle is removed. | `disabled` on the control. |  |
| `read-only` | Surface one step to color.bg.surface-secondary; the text is selectable; no resize handle. | `readonly` on the control; it stays in the tab order. |  |
| `invalid` | Border in color.border.danger plus the error message the field renders; never colour alone. | aria-invalid="true" and aria-describedby pointing at the message. |  |
| `placeholder` | The placeholder in color.fg.muted; data-empty on the root. | The placeholder is a hint, never the name (LQ-NAME-01). |  |
| `filled` | Placeholder gone; data-empty removed. | none |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` |  |  | The text, when controlled. |
| `defaultValue` | `string` |  |  | The initial text, when uncontrolled. |
| `sizing` | `enum(fixed\|autosize)` | `autosize` | data-sizing |  |
| `frame` | `enum(outlined\|borderless)` | `outlined` | data-frame |  |
| `size` | `enum(sm\|md\|lg)` | `md` | data-size |  |
| `rows` | `number` | `1` | rows | Lines shown while empty; the minimum height when autosizing. |
| `maxRows` | `number` | `8` | --lq-textarea-max-rows | Lines the control grows to before it scrolls (autosize only). |
| `maxLength` | `number` |  | maxlength | Renders the counter when set. |
| `invalid` | `boolean` | `false` | aria-invalid |  |
| `disabled` | `boolean` | `false` | disabled |  |
| `readOnly` | `boolean` | `false` | readonly |  |

Events: `change`.

Interactions:
- Type; Enter inserts a newline unless the parent (composer) binds it
- Drag the handle to resize (sizing=fixed)

The control is the native element and the props are its attributes; the only thing the component adds is the wrapper that carries the sizing parameter. Labelling is the field's job, which is why this component has no label prop and composes with field.

## Accessibility

- Role: textbox (implicit, multi-line)
- Accessible name: From a `<label for>` or aria-labelledby supplied by the field or parent; aria-label when there is no visible label. Never the placeholder.
- `aria-invalid` on control = true when invalid
- `aria-describedby` on control = ids of counter and message when a counter or message is rendered

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the control. Tab never inserts a tab character. |
| `Enter` | Inserts a newline. If a parent submits on Enter, Shift+Enter must insert a newline. |

Focus: Focus stays on the control; growing or scrolling never moves it or the caret.

Announcements: The counter is announced politely only at thresholds (90 %, limit), not per keystroke.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface`, `color.bg.surface-secondary`, `color.border.input`, `color.border.default`, `color.border.focus`, `color.border.danger`, `color.fg.default`, `color.fg.muted`, `radius.control`, `space.inset.control.sm`, `space.inset.control.md`, `space.inset.control.lg`, `type.body.md`, `type.label.sm`, `focus.ring.width`, `focus.ring.offset`, `opacity.disabled`, `motion.duration.fast`, `motion.easing.standard`.

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

## Implementations

- html: `examples/html/textarea.html` (reference)
- react: `@lacquer/react#Textarea` (reference)

## Sources

- https://m3.material.io/components
- https://carbondesignsystem.com/components/overview/components/
- https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
