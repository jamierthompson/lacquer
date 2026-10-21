# @lacquer/grade

The grader. It reads a component's contract from `@lacquer/core`, drives the
implementation through every state the spec names, runs every rule with a
testable detect clause, runs axe, scans the source, and writes the finish
report (`packages/core/grading/report.schema.json`). A composition is
finished when its report has zero MUST findings; CI regenerates the report on
every pull request and fails on drift.

That is the grader milestone. What exists today is its first check.

## `lacquer-grade tokens`

LQ-TOKEN-01, static: component styles read token roles only, through the
binding. Over CSS it flags a literal colour, radius, shadow, duration or
z-index and any `var()` that is not a binding property. Over TS/TSX it flags
the Tailwind forms of the same thing: a palette class (`bg-zinc-900`), a
shadcn semantic class (`bg-primary`), a default scale class (`rounded-lg`,
`shadow-md`, `duration-200`, `z-50`) or an arbitrary literal (`bg-[#fff]`).
The `lq-` utilities and the `(--lq-…)` variable form pass.

```bash
pnpm --filter @lacquer/grade check        # the registry source and the catalog's HTML examples
node packages/grade/src/cli.ts tokens --json apps/site/registry
```

`pnpm check` at the root runs it. Anti-examples (`examples/anti/`) are
skipped by the walk and asserted to fail in `tests/`, so they stay negative
fixtures. Findings are in the finish report's `findings[]` shape so the grader
can collect them unchanged.
