---
name: lacquer-voice-input
description: Dictation into the composer and full voice conversation, both with a visible transcript.
---

# Voice input, waveform and transcript

> Dictation into the composer and full voice conversation, both with a visible transcript.
>
> component · ai/augmentation · tier 2 · established · status: draft

Also called: Speech Input, Transcription, Audio Player, Mic Selector, Voice Selector, Persona (AI Elements Voice), Orb, Live Waveform, Voice Button (ElevenLabs UI), ChatGPT Voice, Gemini Live, dictation (assistant-ui Composer).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: idle, error
- states.a11y: idle, error
- modes.treatment: listening, transcribing, speaking, muted
- modes.a11y: listening, transcribing, speaking, muted
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: mobile, hands-free, accessibility
- Avoid: voice-only flows without transcript

Built from: `icon-button`, `audio-player`, `dialog`, `select`.

Pairs with: `composer`, `reduced-motion-streaming`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `dictation` |  | required | dictation: mic button, live transcript into composer, stop |
| `conversation` |  | required | conversation: full-screen orb/waveform, mute, end, running transcript |
| `mic-voice-selectors` |  | required | mic/voice selectors |
| `captions-for-playback` |  | required | captions for playback |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `idle` | missing | missing |  |
| `error` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `listening` | missing | missing |  |
| `transcribing` | missing | missing |  |
| `speaking` | missing | missing |  |
| `muted` | missing | missing |  |

## API (framework-neutral)

Interactions:
- push-to-talk or toggle
- interrupt speaking
- switch to text

## Accessibility

- Accessible name: missing

Transcript always available; orb/waveform aria-hidden with text status; permission errors explained.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.accent.ai`, `color.accent.brand`, `radius.pill`, `motion.reduce`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- NN/g — 'please, please have a voice-to-text option'
- AI Elements Voice components (Jan 2026)

## Sources

- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://elements.ai-sdk.dev/overview
- https://ui.elevenlabs.io/
