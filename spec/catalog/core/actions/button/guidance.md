## How to think about it

A button is the smallest promise an interface makes: press this and *that* will happen,
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
