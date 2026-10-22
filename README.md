# Lacquer

An AI-native design system. The finishing school for AI-generated UI.

Lacquer is a design system for AI interfaces: foundations with a point of
view, components on Base UI that carry Lacquer's own look, and AI-interface
components that are first-class members of the system. Every component has a
written contract. It is built from that contract and graded against it before
it ships and on every pull request after, and the finish report is the proof.
People and coding agents are both first-class users: the contract is what the
page, the agent, the grader and the person all read.

## Run it

```bash
nvm use        # Node 24
pnpm install
pnpm dev       # the site on http://localhost:3000
pnpm gate      # what CI runs: format, lint, typecheck, check, test, build
pnpm grade:check  # regrade every finish report and fail on drift (CI runs it too)
pnpm test:e2e  # Playwright with axe against the site
pnpm mcp       # the MCP server over stdio
```

## Structure

A pnpm workspace.

```
packages/core   the spec layer: schema, vocabulary, rules, bindings and
                every component's contract, compiled to dist/
packages/grade  the grader: drives an implementation through its spec's
                states, runs the rules, axe and the source scans, writes
                the finish report
packages/mcp    the MCP server over the spec layer
apps/site       Next 16: the site, the registry and its routes
```

## Foundations

A spec names token roles, never values. The roles and their values live once,
in `packages/core/spec/tokens/`, in the W3C Design Tokens (DTCG 2025.10)
format; two bindings are derived from them: `html` (a `--lq-*` custom property
per role) and `tailwind` (a theme variable and utility per role, aliasing the
html properties). The Lacquer theme ships as the registry's base item:

```bash
pnpm dlx shadcn@latest init https://lacquer.dev/r/base.json
```

It installs every `--lq-*` value in light and dark, the `lq-` utilities
(`bg-lq-bg-primary`, `rounded-lq-control`), Base UI and the `@lacquer`
registry. Dark mode follows the system preference unless a `light` or `dark`
class says otherwise. The colours are OKLCH, and every text and boundary pairing the tokens declare is measured
by the build against its WCAG floor. The two theme stylesheets and the
registry item are generated from the tokens, and `pnpm check` fails if any is
stale, if a pairing misses, or if any component source sets a literal colour,
radius, shadow, duration or z-index (LQ-TOKEN-01). The site renders its
`/foundations` pages from the same compiled bindings.

## The grader and the finish report

A spec registers its implementations, and `@lacquer/grade` grades each one
against the contract: it reaches every state the spec names (by input for
hover, focus and active, by the vocabulary's attribute for the rest), runs
every rule with a detect clause it can execute, runs axe, scans the source
for literals and undeclared roles, and writes a finish report in the shape of
`packages/core/grading/report.schema.json`, scored by `grading/rubric.yaml`.
A rule it cannot execute yet is listed as skipped with the reason. A
composition is finished at zero MUST findings; the report is committed as
`apps/site/reports/<id>.json`, rendered at `/reports/<id>`, and CI regrades
it on every pull request, failing on a MUST finding, a lost state, a rule that
passed and now fails, or a lower score. Two are graded today: `button`'s html
reference and the message state machine, which ships as
`@lacquer/message-state-machine` with the transitions table in the module a
consumer installs and a test that holds it to the spec's.

```bash
pnpm grade button            # grade and print
pnpm grade button --write    # commit the baseline
```

`packages/core/README.md` explains the model behind the spec layer,
`packages/core/spec/README.md` how to write a spec and
`packages/grade/README.md` what each check does. `AGENTS.md` has the rules
for working here.

## License

[MIT](LICENSE).
