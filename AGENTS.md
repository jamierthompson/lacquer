# Lacquer

The finishing school for AI-generated UI. This repo is a framework-agnostic
catalog of UI components and AI-interface patterns, modelled as data, plus the
rules a grader uses to judge generated UI against it. Read `README.md` first.

## Rules for working here

- `spec/catalog/**/<id>.yaml` is the source of truth. `SKILL.md` files and
  everything in `spec/dist/` are generated — never edit them; run `pnpm spec:build`
  (or `npm run spec:build`) and commit the result. `spec:check` fails if stale.
- Every enum lives in `spec/schema/vocab.yaml`. Add a state, group or token
  category there, not inline.
- A spec names token **roles**, never values or classes. Classes belong in
  `spec/bindings/<binding>.yaml` and in example code written against a binding.
- Forbidden usage is a rule (`rules.local` with `polarity: forbid`), not prose.
  Every anti-example cites the rules it violates.
- Rule ids are `LQ-<AREA>-<NN>` and unique across shared and local rules.
- Cross-references (`usage.instead`, `pairs_well_with`, `reuses`) must resolve
  to catalog ids for stable entries. Use `vocab.component_aliases` for other
  systems' names.
- Example code is style-neutral: binding classes only, `data-slot` on every
  anatomy part, native elements first.
