---
name: lacquer-content-credentials
description: Generated images carry a machine-readable credential and a visible affordance to inspect it; required in the EU for synthetic media marking.
---

# Provenance for generated media (content credentials)

> Generated images carry a machine-readable credential and a visible affordance to inspect it; required in the EU for synthetic media marking.
>
> component · ai/trust · tier 2 · emerging · status: draft

Also called: Content Credentials (C2PA), SynthID (Google), Watermark (Shape of AI), Made with AI labels.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: credentialed, unverified, stripped
- modes.a11y: credentialed, unverified, stripped
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any generated or AI-edited image, audio or video
- Avoid: stripping metadata on export by default

Built from: `icon-button`, `dialog`, `list`, `badge`.

Pairs with: `attachment-preview`, `variation-grid`, `ai-label`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `invisible-credential-watermark-embedded` |  | required | invisible credential/watermark embedded in the file |
| `visible-info-glyph` |  | required | visible info glyph on the media |
| `credentials-panel` |  | required | credentials panel: tool, model, date, edits |
| `download-preserves-metadata` |  | required | download preserves metadata by default |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `credentialed` | missing | missing |  |
| `unverified` | missing | missing |  |
| `stripped` | missing | missing |  |

## API (framework-neutral)

Interactions:
- open panel
- verify
- download with credentials

## Accessibility

- Accessible name: missing

Glyph is a button named 'Content credentials'; panel is a dialog with text content.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-raised`, `radius.sm`, `type.label.sm`, `shadow.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- OpenAI + Google (19 May 2026) — C2PA steering committee, SynthID in ChatGPT/API/Codex images, detection coming to Search and Chrome
- EU AI Act Art. 50(2) — machine-readable marking; interoperability deadline 2 Feb 2027

## Sources

- https://c2paviewer.com/articles/openai-google-c2pa-synthid-2026
- https://www.reedsmith.com/our-insights/blogs/viewpoints/102nbz0/transparency-obligations-for-ai-generated-content-the-code-of-practice-adequacy/
