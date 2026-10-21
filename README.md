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
pnpm test:e2e  # Playwright with axe against the site
pnpm mcp       # the MCP server over stdio
```

## Structure

A pnpm workspace.

```
packages/core   the spec layer: schema, vocabulary, rules, bindings and
                every component's contract, compiled to dist/
packages/grade  the grader; today its first check, LQ-TOKEN-01 over source
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
registry. The two theme stylesheets and the registry item are generated from
the tokens, and `pnpm check` fails if any is stale or if any component source
sets a literal colour, radius, shadow, duration or z-index (LQ-TOKEN-01).

`packages/core/README.md` explains the model behind the spec layer and
`packages/core/spec/README.md` how to write a spec. `AGENTS.md` has the rules
for working here.

## License

[MIT](LICENSE).
