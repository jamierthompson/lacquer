---
name: lacquer-message-list
description: The scrolling conversation container with stick-to-bottom behaviour that releases when the user scrolls up.
---

# Message list / thread

> The scrolling conversation container with stick-to-bottom behaviour that releases when the user scrolls up.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Conversation (AI Elements), Thread (assistant-ui), ChatContainer + ScrollButton (prompt-kit), Chatbot (Gradio).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: empty
- states.a11y: empty
- modes.treatment: following, released, loading-history
- modes.a11y: following, released, loading-history
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any threaded AI conversation
- Avoid: single-shot generation surfaces where a result panel is clearer

Built from: `scroll-area`, `button`, `skeleton`, `divider`.

Pairs with: `message`, `composer`, `capability-empty-state`, `live-region-strategy`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `scroll-container` |  | required | scroll container |
| `message-groups` |  | required | message groups |
| `scroll-to-bottom-button` |  | required | scroll-to-bottom button |
| `empty-state-slot` |  | required | empty-state slot |
| `hidden-live-region` |  | required | hidden live region |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `empty` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `following` | missing | missing | following (stuck to bottom) |
| `released` | missing | missing | released (user scrolled up) |
| `loading-history` | missing | missing |  |

## API (framework-neutral)

Interactions:
- stick-to-bottom only while user is at bottom
- release on scroll-up
- scroll-to-bottom button restores following
- arrow keys move between messages

## Accessibility

- Accessible name: missing

Either role=log on the list or a separate hidden role=status region, never both; each message is an article with an accessible name; keyboard navigation between messages and into actions.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `size.measure.prose`, `space.gap.message`, `color.bg.surface`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- NN/g (Apr 2026): do not autoscroll users to the end of a response
- AI Elements ConversationScrollButton

## Sources

- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://elements.ai-sdk.dev/overview
