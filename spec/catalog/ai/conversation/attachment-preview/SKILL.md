---
name: lacquer-attachment-preview
description: How files and images look in the composer and in messages, including generated media with provenance.
---

# Attachment previews and media results

> How files and images look in the composer and in messages, including generated media with provenance.
>
> component · ai/conversation · tier 2 · established · status: draft

Also called: Attachments (AI Elements 1.8.0), Attachment (assistant-ui), FileUpload (prompt-kit), Image (AI Elements utility), Attachments (Shape of AI Tuners).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: error
- states.a11y: error
- modes.treatment: uploading, ready, generated, expired
- modes.a11y: uploading, ready, generated, expired
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: multimodal input or output
- Avoid: text-only products

Built from: `tag`, `card`, `image`, `dialog`, `progress`, `audio-player`.

Pairs with: `composer`, `content-credentials`, `variation-grid`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `composer-chips-thumbnails` |  | required | composer chips/thumbnails: name, size, type icon, remove, upload progress |
| `message-side` |  | required | message-side: image grid, file cards with open/download, audio player |
| `lightbox-for-generated` |  | required | lightbox for generated images with download, vary/edit, content credentials |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `error` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `uploading` | missing | missing |  |
| `ready` | missing | missing |  |
| `generated` | missing | missing |  |
| `expired` | missing | missing |  |

## API (framework-neutral)

Interactions:
- remove before send
- open lightbox
- download
- drag to reorder (optional)

## Accessibility

- Accessible name: missing

Thumbnails have alt from filename or generated description; lightbox is a dialog; progress announced.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.md`, `color.bg.surface-secondary`, `color.border.subtle`, `type.label.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- AI Elements Attachments — files, images, video, audio, source documents
- NN/g — include images, not just links

## Sources

- https://vercel.com/changelog/ai-code-elements
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
