---
name: lacquer-dialog
description: Modal window that interrupts the flow for a focused task and traps focus until dismissed.
---

# Dialog

> Modal window that interrupts the flow for a focused task and traps focus until dismissed.
>
> component · core/overlays · tier 1 · organism · established · status: draft

Also called: Modal, Standard dialog, Sheet (desktop), Window, Takeover dialog, Modal dialog.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: A short task must be completed or abandoned before the user continues.
- Use: The user needs to confirm something with consequences (use alert-dialog for the destructive case).
- Avoid: The content is long or deserves its own URL — use a page.
- Avoid: You are stacking dialogs — flatten into steps or use a drawer.
- Avoid: The content is contextual and non-blocking — use a popover.
- Avoid: On mobile with a long form — use a full-screen or bottom drawer.
- If destructive confirmation requiring an explicit answer → use `alert-dialog`
- If side panel with the page still usable → use `drawer`
- If small contextual content anchored to a trigger → use `popover`

Pairs with: `alert-dialog`, `focus-trap`, `portal`, `form`, `button`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `scrim` |  | required | Full-viewport backdrop in color.bg.scrim. Click-to-close is a choice, not a default; destructive confirms disable it. |
| `root` | dialog | required | The container. role="dialog" aria-modal="true". Prefer the native `<dialog>` with showModal(); it provides the top layer and inertness for free. |
| `title` | h2 | required | Labels the dialog via aria-labelledby. Required. States the task, not the product ("Rename project", not "Project"). |
| `close-button` |  | optional | Icon button with aria-label="Close". Omit for dialogs that must be answered (see alert-dialog). |
| `body` |  | required | The scroll region when content overflows; the header and footer stay fixed. |
| `footer` |  | required | Actions, right-aligned on desktop, stacked on mobile; the primary action is last in DOM and visual order. |
| `focus-trap` |  | required | Behavioural part. Tab cycles inside the dialog while open. |

## Variants

- **size**: sm | md | lg | xl | full (default `md`) — Width only. Height follows content up to a viewport-relative max, then the body scrolls.
- **modality**: modal | non-modal (default `modal`) — Non-modal dialogs do not trap focus or use a scrim; they are for tool palettes, not tasks.
- Modifiers: scrollable-body, nested

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | color.bg.surface, radius.surface, shadow.lg, z.modal; scrim at color.bg.scrim. | role="dialog" aria-modal="true" aria-labelledby=<title id>. Everything behind it is inert. |  |
| `expanded` | Entry motion of motion.duration.base — fade + 2–4% scale, opacity-only under reduced motion. | Focus moves in on open; announcement is the title. |  |
| `loading` | aria-busy on the body; footer actions keep width (see button loading). | aria-busy="true" on the body region. |  |
| `focus-visible` | Standard ring on every focusable inside; the dialog container itself is not focused unless nothing inside is. | Implicit. |  |
| `hover` (opt.) | none on the container; close-button and footer buttons own their own. | none |  |
| `active` (opt.) | none on the container. | none |  |
| `disabled` (opt.) | Dialogs are not disabled; actions inside may be. | none |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `open`* | `boolean` |  | open attribute / showModal() |  |
| `onOpenChange`* | `(open: boolean) => void` |  |  |  |
| `size` | `enum(sm\|md\|lg\|xl\|full)` | `md` |  |  |
| `modal` | `boolean` | `true` |  |  |
| `dismissible` | `boolean` | `true` |  | Whether Escape and scrim-click close it. False for confirms that need an explicit answer. |
| `initialFocus` | `ref \| selector` |  |  | Where focus lands on open. Default is the first focusable element; for destructive confirms, the cancel button. |

Slots: `title`, `description`, `children`, `footer`.
Events: `openChange`.

Trigger, Title, Description, Body and Footer are composed as children so any content works and headings stay real headings. Size and modality are props because the system owns those sets. Do not add `confirmLabel` / `onConfirm` props; that is alert-dialog.

## Accessibility

- APG pattern: [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- Role: dialog
- Accessible name: aria-labelledby pointing at the title; aria-describedby at the description when present.
- `aria-modal` on root = true
- `aria-labelledby` on root = id of title
- `aria-describedby` on root when a description exists
- `inert` on everything outside the dialog when open and modal

| Key | Action |
| --- | --- |
| `Tab / Shift+Tab` | Cycles focus within the dialog; never escapes to the page. |
| `Escape` | Closes the dialog when dismissible. (dismissible) |

Focus: On open, focus moves to initialFocus, else the first focusable, else the container (tabindex=-1). On close, focus returns to the element that opened it. If that element is gone, focus the nearest logical ancestor.

Announcements: The title is announced on open by virtue of focus movement; no extra live region.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface`, `color.bg.scrim`, `color.fg.default`, `color.fg.muted`, `radius.surface`, `shadow.lg`, `z.modal`, `space.inset.lg`, `space.gap.md`, `type.heading.md`, `type.body.md`, `motion.duration.base`, `motion.easing.standard`.

## Content

- Label: Title is the task as a verb phrase ("Rename project", "Invite teammates"). Footer buttons name the outcome ("Rename", "Send invites"), never "OK".
- Never: One paragraph of description at most; longer content is a page, not a dialog.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

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
- **LQ-COPY-01** (SHOULD) Labels are verb-first and specific. Action labels start with a verb and name the object ("Save changes", "Delete 3 files"); never "OK", "Yes", "Submit" or "Click here" when a specific label is possible.
  Fix: Rewrite as verb + object, sentence case, ≤3 words where possible.
- **LQ-DIALOG-01** (MUST) Focus in, focus back. Opening moves focus inside the dialog; closing returns focus to the trigger.
  Fix: Use the native <dialog>.showModal() or the renderer's focus-scope primitive; store the trigger on open.
- **LQ-DIALOG-02** (MUST) Background is inert. While a modal dialog is open, content outside it is inert (not focusable, not clickable, hidden from assistive tech).
  Fix: Use <dialog>.showModal() or set `inert` on siblings of the portal root.
- **LQ-DIALOG-04** (SHOULD) Destructive confirms default to safety. When the primary action is destructive, initial focus and the default (Enter) action are the non-destructive option, and scrim-click does not close.
  Fix: Set initialFocus to the cancel action and dismissible=false.

### Forbidden

- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Draw the ring on `:focus-visible` from the binding's roles (`focus.ring.width`, `color.border.focus`, `focus.ring.offset`) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).
- **LQ-LAYER-01** (MUST) No stacked modals. A modal dialog never opens another modal dialog; use a step inside the same dialog, a drawer, or a non-modal popover.
  Fix: Flatten into a stepper inside one dialog, or convert the inner one to non-modal.
- **LQ-DIALOG-03** (MUST) Never an unlabeled dialog. Every dialog has a visible title referenced by aria-labelledby; a visually-hidden title is acceptable only for full-screen media viewers.
  Fix: Add a Title part.

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- https://base-ui.com/react/components/dialog
