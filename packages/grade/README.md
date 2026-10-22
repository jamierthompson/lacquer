# @lacquer/grade

The grader. It reads a component's contract from `@lacquer/core`, resolves
the implementations the spec registers, drives each through every state the
spec names, runs every rule it can execute, runs axe, scans the source, and
writes the finish report (`packages/core/grading/report.schema.json`). A
composition is finished when its report has zero MUST findings; CI
regenerates every committed report on every pull request and fails on drift.

## Subjects

The spec's `implementations` say what to grade:

- An html reference (`renderer: html`, `file: examples/html/<id>.html`) is
  opened in Chromium over `file://`, with its stylesheet beside it. Every
  `[data-lacquer="<id>"]` instance is an instance; the first one in no
  attribute state is the enabled fixture the states are driven on.
- A registry lib (`renderer: react`, `package: @lacquer/<id>`) is imported in
  Node and exercised directly: the message state machine's table and reducer.
- A React component in the registry becomes a page subject once the site
  renders its states file on a harness route; that driver lands with the
  first composition.

## How a state is reached

The spec lists the states; the vocabulary (`spec/schema/vocab.yaml`) says how
each is expressed. `hover`, `focus-visible` and `active` are reached by input
(the pointer, Tab from a helper so `:focus-visible` matches, a held pointer).
Every other state is an attribute (`disabled`, `aria-busy=true`,
`aria-pressed=true`), applied to the enabled fixture and reverted; a state
the spec's `accessibility.aria` names picks that attribute first. A required
attribute state no instance on the page demonstrates is `missing` in the
coverage grid; an optional one is `skipped` and not driven.

## What runs

| Rule                     | How     | What it does                                                                                                                                    |
| ------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| LQ-STATE-01              | runtime | Each driven state's computed styles (root and parts) differ from enabled.                                                                       |
| LQ-STATE-02              | runtime | The difference survives grayscale: a non-colour property, or a colour whose luminance changed.                                                  |
| LQ-STATE-03              | runtime | Every required attribute state is demonstrated with its attribute.                                                                              |
| LQ-FOCUS-01              | runtime | Keyboard focus has an outline or a box-shadow change, at 3:1 against the page (and the component at offset 0).                                  |
| LQ-SEM-01, LQ-BUTTON-01  | runtime | The root is the spec's native element; Enter and Space both activate it.                                                                        |
| LQ-NAME-01, LQ-BUTTON-05 | runtime | Playwright's accessible name is not empty; icon-only without a name is BUTTON-05 too.                                                           |
| LQ-ANAT-01               | runtime | Every required part renders with its `data-slot`.                                                                                               |
| LQ-COPY-01               | runtime | No label on the stoplist (OK, Yes, No, Submit, Click here).                                                                                     |
| LQ-BUTTON-02             | runtime | Width before and during loading is equal; a click and Enter during loading reach no handler; no spinner without aria-busy or without the label. |
| LQ-BUTTON-03             | runtime | At most one `data-emphasis="primary"` per landmark.                                                                                             |
| LQ-MOTION-02             | runtime | Under `prefers-reduced-motion`, no movement animation runs and no transition exceeds 150 ms.                                                    |
| LQ-A11Y-02               | runtime | axe-core at WCAG 2.2 AA plus best practice; each violation is a finding.                                                                        |
| LQ-TOKEN-01              | static  | No literal colour, radius, shadow, duration or z-index; every `var()` and utility reads a role.                                                 |
| LQ-TOKEN-02              | static  | The stylesheet reads only the roles the spec declares.                                                                                          |
| LQ-MACHINE-04            | runtime | The module's table is the spec's, row for row; every (status, event) pair resolves as the table says.                                           |
| LQ-MACHINE-05            | static  | No `useState` or loading/done boolean beside the status.                                                                                        |

A rule the subject is graded against that none of these implements is
reported as `skipped` with the reason (`src/rules.ts`), never dropped. A
rendered component is graded against its resolved rules plus every universal
rule whose `applies_to` names it; a principle only against the rules it
cites, since it renders nothing itself.

## Scoring

`grading/rubric.yaml`, compiled to `dist/rubric.json`: per dimension, 100
minus 25 per MUST and 8 per SHOULD, plus 2 per extra instance of the same
rule up to 10; only dimensions in which a rule ran are scored; overall is
the weighted mean; a MUST in structure or accessibility caps the letter at
C. The build fails if any rule maps to no dimension.

## Commands

```bash
pnpm grade button                     # grade and print; exit 1 on a MUST finding
pnpm grade button --write             # commit the report as apps/site/reports/button.json
pnpm grade:check                      # CI: regrade every baseline, fail on the gate or on drift
pnpm --filter @lacquer/grade check    # LQ-TOKEN-01 over the registry source and the catalog's examples
```

Drift is a state that passed and no longer does, a rule that passed and now
fails, or a dimension score that fell. A better report is not drift; the
baseline is stale, and `--write` refreshes it. `generated_at` is ignored when
comparing, and an unchanged report is not rewritten.

## Fixtures

The anti-examples (`examples/anti/`) are the grader's negative fixtures:
`tests/fixtures.test.ts` grades each as a fragment wrapped in the theme and
asserts that every cited rule the grader implements fires. The reference
implementation is the positive fixture. `tests/machine.test.ts` mutates the
state machine's table and asserts the module checks catch it.
