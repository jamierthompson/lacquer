---
name: lacquer-live-region-strategy
description: How screen-reader users experience streaming without being buried: batched, transition-based announcements from a single pre-existing region.
---

# Live-region strategy for streamed output

> How screen-reader users experience streaming without being buried: batched, transition-based announcements from a single pre-existing region.
>
> method · ai/foundations · tier 1 · emerging · status: draft

Also called: aria-live polite status region, role=alert for errors/approvals, WCAG 2.2 SC 4.1.3 Status Messages.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: any streamed content
- Avoid: per-token announcements
- Avoid: assertive for routine progress

Built from: `visually-hidden`.

Pairs with: `message-state-machine`, `streaming-markdown`, `approval-prompt`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `one-hidden-role-status` |  | required | one hidden role=status region created empty at mount |
| `sentence-paragraph-batching` |  | required | sentence/paragraph batching (or ~1–2 s), aria-atomic=false, aria-relevant=additions |
| `one-announcement-per` |  | required | one announcement per state transition and per tool transition |
| `role-alert-for-errors` |  | required | role=alert for errors and approvals |
| `response-complete-once` |  | required | 'Response complete' once |
| `setting` |  | required | setting: announce full response at end only |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## API (framework-neutral)

Interactions:
- none

## Accessibility

- Accessible name: missing

Never per-token; never aria-live on the whole list plus a status region; region must pre-exist in the DOM (MDN).

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- MDN — start with an empty live region, then change its content; polite for non-urgent
- assistant-ui Error — accessible alert role

## Sources

- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- https://www.a11y-collective.com/blog/aria-live/
- https://www.assistant-ui.com/docs/primitives
