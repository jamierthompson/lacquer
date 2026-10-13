---
name: lacquer-approval-prompt
description: Gate for side-effecting actions: exact payload, risk framing, and allow-once / always-scoped / deny-with-correction.
---

# Permission / approval prompt

> Gate for side-effecting actions: exact payload, risk framing, and allow-once / always-scoped / deny-with-correction.
>
> component · ai/agentic · tier 1 · emerging · status: draft

Also called: Confirmation (AI Elements), permission prompt (Claude Code), terminal command approval (VS Code), sandbox access controls (Cursor), useHumanInTheLoop (CopilotKit), Intent Preview (Smashing), Controls (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: approval-requested, output-denied
- states.a11y: approval-requested, output-denied
- modes.treatment: approved, approved-always, denied-with-correction, timed-out
- modes.a11y: approved, approved-always, denied-with-correction, timed-out
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any action outside the sandbox or with external effects
- Avoid: an 'always' option that grants more than the prompt showed
- Avoid: prompting for read-only actions

Built from: `alert-dialog`, `code-block`, `button`, `textarea`, `badge`.

Pairs with: `tool-call-card`, `autonomy-dial`, `activity-log`, `undo-rollback`, `hitl-gate`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `title-naming` |  | required | title naming the action in plain language |
| `exact-payload` |  | required | exact payload (monospace when a command) |
| `risk-framing` |  | required | risk framing: what it touches, reversibility, leaves sandbox/repo? |
| `actions` |  | required | actions: Allow once (default focus), Always allow [scoped], Deny (+ correction field) |
| `optional-switch` |  | required | optional 'switch to auto mode' |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `approval-requested` | missing | missing |  |
| `output-denied` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `approved` | missing | missing |  |
| `approved-always` | missing | missing | approved-always (rule saved) |
| `denied-with-correction` | missing | missing |  |
| `timed-out` | missing | missing |  |

## API (framework-neutral)

Interactions:
- Enter = allow once
- Esc = deny
- type a correction
- view what a saved rule would cover

## Accessibility

- Accessible name: missing

Assertive announcement; focus moves into the prompt; safest option is default; fully keyboard operable.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.status.error`, `color.status.warning`, `color.status.success`, `type.family.mono`, `color.bg.surface-raised`, `shadow.lg`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Claude Code — offers 'don't ask again' only when the prompt can show everything the rule would allow; never auto-approves protected paths; pauses auto mode after repeated blocks
- AI Elements Confirmation — request/accepted/rejected wired to needsApproval
- NN/g — ChatGPT Agent 'requested final approval before submitting the reservation'

## Sources

- https://code.claude.com/docs/en/permissions
- https://code.claude.com/docs/en/permission-modes
- https://elements.ai-sdk.dev/components/confirmation
- https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/
