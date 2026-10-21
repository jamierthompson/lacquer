# Lacquer

An AI-native design system; the finishing school for AI-generated UI. Read
`README.md` for the layout.

## Rules for working here

- The loop is the method: contract, composition, grade, finish, CI. Do not
  build a component without its spec, and do not call one finished without
  its report.
- `pnpm` for everything; the shadcn CLI runs through `pnpm dlx shadcn@latest`.
- Prettier formats, Biome lints. Never hand-format. The example fixtures in
  `packages/core/spec/catalog/**/examples` are excluded from Biome: Lacquer's
  own rules grade them, and the anti-examples are meant to fail.
- `packages/core/spec/catalog/**/<id>.yaml` is the source of truth. `SKILL.md`
  files are generated: never edit them; run `pnpm build` and commit the
  result. `pnpm check` fails if stale. `dist/` is build output, not committed.
- Likewise generated and committed: everything in
  `packages/core/spec/bindings/` (the two theme stylesheets) and
  `apps/site/registry/lacquer/foundations/registry.json` (the base item), all
  from `packages/core/spec/tokens/`. Change the tokens, run `pnpm build`,
  commit the result.
- Every enum lives in `packages/core/spec/schema/vocab.yaml`. Add a state,
  group or token category there, not inline.
- A spec names token **roles**, never values or classes. A role is a token
  path in `packages/core/spec/tokens/lacquer.tokens.json` (DTCG 2025.10, with
  dark overrides in `dark.tokens.json`); every binding's property and class
  names are derived from the path and `$type`, so a new role is one token
  entry. Steer a derivation only through `$extensions["dev.lacquer"]`.
- Component code reads roles only: `var(--lq-…)` in CSS, `lq-` utilities or
  `(--lq-…)` in Tailwind. A property a component exposes as a parameter is
  scoped to it, `--lq-<id>-…`, and declared in its spec. `pnpm check` runs
  `lacquer-grade tokens` (LQ-TOKEN-01) over the registry source and the
  catalog's HTML examples; anti-examples are its negative fixtures.
- Forbidden usage is a rule (`rules.local` with `polarity: forbid`), not
  prose. Every anti-example cites the rules it violates.
- Rule ids are `LQ-<AREA>-<NN>` and unique across shared and local rules.
- Registry code: Base UI, Tailwind through the binding, `data-slot` on every
  anatomy part, every state as an attribute, native elements first. No
  literal colours, radii, shadows or durations (LQ-TOKEN-01).
- Framework behavior: read `node_modules/next/dist/docs/` and the installed
  types before writing code; do not trust memory for Next, shadcn or Fumadocs
  specifics.
