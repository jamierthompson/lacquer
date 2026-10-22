---
name: lacquer-button
description: Triggers an action in the current context; the single most-used interactive component in any product.
---

# Button

> Triggers an action in the current context; the single most-used interactive component in any product.
>
> component · core/actions · tier 1 · atom · established · status: draft

Also called: Btn, Pressable, CTA, UnstyledButton, ActionButton.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## How to think about it

A button is the smallest promise an interface makes: press this and _that_ will happen,
here, now. Everything in the spec protects that promise. Emphasis tells the eye which
promise matters most, so there is one primary per view. The loading state keeps the
promise visible while it is being kept, which is why the width never changes and the
label never disappears. Navigation is a different promise ("take me somewhere"), which is
why it is a Link even when it wears button clothes.

## Composition over props

Put icons in children, not in `leftIcon` / `rightIcon` props. The icon set is the
consumer's choice, the label stays in the accessible name, and the API stays at two
closed-set props (`emphasis`, `size`) plus booleans. If you find yourself adding a
`color`, `appearance` or `tone` prop next to `emphasis`, stop: that is the overlapping-axes
smell. Destructive is an emphasis.

## Agent checklist

Before you emit a button, confirm:

1. It is a native `<button type="button">` (or `type="submit"` inside a form, deliberately).
2. It has a visible verb-first label, or you are using `icon-button` with `aria-label`.
3. It is the only primary-emphasis button in its view.
4. Hover, focus-visible, active, disabled and loading each read token roles through the binding's custom properties; no literal values.
5. If it navigates, you have switched to `link`.

## Use it when / not when

- Use: Submitting, saving, opening a dialog, running an operation.
- Use: The action happens in the current context and does not change the URL.
- Avoid: The action navigates to a URL — that is a Link, even if it looks like a button.
- Avoid: The control has no visible label — that is an Icon Button.
- Avoid: The control stays pressed — that is a Toggle Button.
- Avoid: More than one primary button is visible in a view.
- If it navigates → use `link`
- If it has no text label → use `icon-button`
- If it toggles and stays on → use `toggle-button`
- If it opens a menu of related actions → use `split-button`

Pairs with: `button-group`, `dialog`, `form`, `toast`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` | button | required | The native button. Carries every state attribute. |
| `leading-icon` |  | optional | slot. Optional icon before the label; decorative (aria-hidden). |
| `label` |  | required | Visible text. Required unless the button is icon-only, in which case use Icon Button instead. |
| `trailing-icon` |  | optional | slot. Optional icon after the label; usually a chevron or external-link glyph. |
| `spinner` |  | optional | Shown centred over the content while loading. The label and icons keep their boxes, so the width holds and nothing beside the button shifts. |
| `focus-ring` |  | optional | Not a DOM node. Rendered by the focus-visible treatment and checked by LQ-FOCUS-01, not by a data-slot. |

## Variants

- **emphasis**: primary | secondary | tertiary | outline | ghost | link | destructive (default `secondary`) — One primary per view. Destructive is an emphasis, not a colour; it still obeys every state rule.
- **size**: xs | sm | md | lg (default `md`) — Size changes height, inset and label style together; never one without the others.
- Modifiers: full-width

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | Base tokens for the chosen emphasis. | Default semantics. |  |
| `hover` | Background one step (color.bg.*-hover). Never move the element. Transition motion.duration.fast. | none — hover is not available to keyboard or touch and must never be the only cue. |  |
| `focus-visible` | 2px ring in color.border.focus with focus.ring.offset, ≥3:1 against component and page. Use :focus-visible, not :focus. | Implicit. Never outline none without a replacement (LQ-FOCUS-01). |  |
| `active` | Darken one step past hover or inset the surface; ~50ms so it feels immediate. | none (transient). |  |
| `disabled` | opacity.disabled, pointer-events none, hover/active responses removed. Keep legible. | `disabled` removes it from tab order. Prefer `aria-disabled="true"` (soft-disable) for anything a user might reasonably try, so the reason can be discovered. |  |
| `loading` | The spinner is centred over the content; the label and icons keep their boxes at opacity 0, so the width holds and the name stays in the accessibility tree. Re-submission is blocked. | aria-busy="true"; announce start and finish politely from the surrounding region, not the button. |  |
| `selected` (opt.) | Persistent color.bg.selected plus a weight or border change. Only for toggle usage — see Toggle Button. | aria-pressed="true". |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `emphasis` | `enum(primary\|secondary\|tertiary\|outline\|ghost\|link\|destructive)` | `secondary` |  | Visual weight. Called `variant` in most libraries; Lacquer calls the axis by what it controls. |
| `size` | `enum(xs\|sm\|md\|lg)` | `md` |  |  |
| `loading` | `boolean` | `false` | aria-busy | Shows the spinner, blocks activation, keeps width. |
| `disabled` | `boolean` | `false` | disabled \| aria-disabled |  |
| `softDisabled` | `boolean` | `false` | aria-disabled | Keeps the button focusable so a tooltip can explain why it is unavailable. |
| `fullWidth` | `boolean` | `false` |  |  |
| `type` | `enum(button\|submit\|reset)` | `button` |  | Default is `button`, not `submit`, so a button inside a form never submits by accident. |

Slots: `leading-icon`, `children`, `trailing-icon`.
Events: `press`.

Icons are children, not props (`<Button><Icon/>Save</Button>`), so any icon set works and the label stays in the accessible name. Emphasis and size are props because they are closed sets the system owns. There is no `color` prop: destructive is an emphasis.

## Accessibility

- APG pattern: [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- Role: button (implicit from the native element)
- Accessible name: From the label content. Icon-only buttons are a different component (icon-button) and require aria-label.
- `aria-disabled` = true when softDisabled
- `aria-pressed` = true | false when used as a toggle
- `aria-busy` = true when loading

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the button. Disabled (hard) buttons are skipped; soft-disabled are not. |
| `Enter` | Activates. |
| `Space` | Activates on key-up. |

Focus: Focus stays on the button after activation unless the action moves it deliberately (opening a dialog moves focus into the dialog).

A `div` with role="button" needs tabindex, Enter and Space handling and is still worse than the native element. The spec names no exception.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.primary`, `color.bg.primary-hover`, `color.fg.on-primary`, `color.bg.secondary`, `color.bg.secondary-hover`, `color.fg.on-secondary`, `color.bg.destructive`, `color.bg.destructive-hover`, `color.fg.on-destructive`, `color.bg.accent`, `color.bg.surface`, `color.fg.default`, `color.border.input`, `color.border.focus`, `color.fg.link`, `radius.control`, `radius.pill`, `shadow.sm`, `space.gap.sm`, `space.inset.control.sm`, `space.inset.control.md`, `space.inset.control.lg`, `size.control.xs`, `size.control.sm`, `size.control.md`, `size.control.lg`, `size.icon.md`, `type.label.sm`, `type.label.md`, `focus.ring.width`, `focus.ring.offset`, `motion.duration.fast`, `motion.easing.standard`, `opacity.disabled`, `motion.duration.spin`.

## Content

- Label: Verb first, then the object — "Save changes", "Delete 3 files". Sentence case. Three words or fewer when possible.
- Voice: Say what happens, not what the user should do. "Send" not "Click to send".
- Never: Never "OK", "Yes", "No", "Submit", "Click here" when a specific verb is possible. Never ellipsis unless the button opens a dialog that asks for more input ("Export…").
- Default strings: loading="Loading"

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
- **LQ-TOKEN-02** (SHOULD) Consume only declared roles. An implementation consumes only the token roles its spec declares under tokens.consumes, or roles declared by entries it reuses.
  Fix: Either add the role to the spec (and justify it) or drop it from the code.
- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.
- **LQ-COPY-01** (SHOULD) Labels are verb-first and specific. Action labels start with a verb and name the object ("Save changes", "Delete 3 files"); never "OK", "Yes", "Submit" or "Click here" when a specific label is possible.
  Fix: Rewrite as verb + object, sentence case, ≤3 words where possible.
- **LQ-BUTTON-02** (MUST) Loading keeps width and blocks re-press. While loading, the button keeps its enabled width, shows an in-place spinner, sets aria-busy="true" and ignores further presses.
  Fix: Reserve the icon slot for the spinner and gate the press handler on `loading`.

### Forbidden

- **LQ-STATE-02** (MUST) No state by colour alone. No state is expressed by colour alone; every state has a second channel (icon, weight, border, position or text).
  Fix: Add an icon, border, weight or text change alongside the colour change.
- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Draw the ring on `:focus-visible` from the binding's roles (`focus.ring.width`, `color.border.focus`, `focus.ring.offset`) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).
- **LQ-BUTTON-01** (MUST) Never a div with onClick. A button is a native `<button>`; a `div`, `span` or `a` without `href` carrying a click handler is a defect.
  Fix: Replace with `<button type="button">` and keep the classes.
- **LQ-BUTTON-03** (MUST) One primary per view. A view (page, dialog, drawer, card) shows at most one primary-emphasis button.
  Fix: Demote the others to secondary or tertiary; if two actions are equally important, neither is primary.
- **LQ-BUTTON-04** (SHOULD) No navigation disguised as a button. A button never calls router.push / location.assign as its only effect; a Link styled as a button does that.
  Fix: Use `<Link emphasis="primary">` (link rendered with button styles) so middle-click, copy-link and prefetch work.
- **LQ-BUTTON-05** (MUST) Icon-only needs a name. A button whose only child is an icon has no accessible name and is a defect; use icon-button with aria-label.
  Fix: Switch to icon-button, or add visible text.
- **LQ-BUTTON-06** (SHOULD) No disabled submit as validation. Do not hard-disable a submit button to signal an invalid form; let the user press it and show the errors (LQ-ERR-01 pattern). Soft-disable with an explanation is acceptable for truly unavailable actions.
  Fix: Keep the button enabled; validate on submit; focus the first invalid field.

## Examples

- All seven emphases at md — `examples/html/emphasis-ladder.html` (variant:emphasis=*)
- Submit that keeps its width while loading — `examples/html/loading-submit.html` (state:loading, rule:LQ-BUTTON-02)
- Soft-disabled button that explains itself — `examples/html/soft-disabled-with-reason.html` (state:disabled, rule:LQ-STATE-03)
- Destructive confirm with a secondary cancel — `examples/html/destructive-in-dialog-footer.html` (variant:emphasis=destructive, rule:LQ-BUTTON-03, rule:LQ-COPY-01)
- ✗ A div pretending to be a button — `examples/anti/div-as-button.html` violates LQ-BUTTON-01, LQ-SEM-01, LQ-NAME-01
- ✗ Literal palette values and a removed focus ring — `examples/anti/literal-purple-no-focus.html` violates LQ-TOKEN-01, LQ-FOCUS-01, LQ-STYLE-01
- ✗ Loading state that swaps the label for a spinner and reflows — `examples/anti/spinner-reflow.html` violates LQ-BUTTON-02

## Implementations

- html: `examples/html/button.html` (reference)

## Exemplars

- GOV.UK Button — one primary per page, enforced in guidance; the clearest statement of emphasis discipline.
- React Aria Button — press events unify mouse, touch, keyboard and screen-reader activation.

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://design-system.service.gov.uk/components/button/
- https://react-spectrum.adobe.com/react-aria/Button.html
- https://m3.material.io/components
- https://developer.apple.com/design/human-interface-guidelines/components
