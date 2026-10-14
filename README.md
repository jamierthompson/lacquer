# Lacquer

**The finishing school for AI-generated UI.**
Tokens are the primer. Components are the finish.

Lacquer is a framework-agnostic catalog of UI components and AI-interface
patterns — each with anatomy, variants, every state it must express, its
accessibility contract, the token roles it consumes, content rules, forbidden
usage and examples — modelled as data so that people, agents and tools all read
the same thing. The same data feeds a skill per component, an MCP server, and a
grader that scores generated UI against the catalog.

It is for anyone, human or agent, designing or building UI for the web, in any
framework, for any product. HTML is the reference for every entry: plain markup
and CSS, which is what every framework produces and every design tool can
read. `@lacquer/react` implements it in React.

## Status

Every entry is a draft, and every draft says what it is still missing. The
pipeline runs end to end on all 202 entries. `button` shows the full shape of
a core entry, with guidance, an HTML reference, examples and anti-examples;
`message-state-machine`, `composer`, `thinking-indicator`, `message`,
`tool-call-card` and `approval-prompt` have React implementations and pages
in the site, with `button`, `textarea` and `icon-button` beneath them. The
MCP server implements the seven read tools over stdio (`pnpm mcp`); the grader
is a rubric and a report schema.

## Run it

```bash
nvm use     # Node 24 (22.18+ works)
pnpm install
pnpm build  # validate every spec, compile dist/, regenerate SKILL.md files
pnpm check  # CI mode: fail on invalid or stale output
pnpm mcp    # the MCP server over stdio; point a client at it
pnpm dev    # the site
```

To see a reference implementation without the site, open its page in a
browser. No build step, no server:

```bash
open packages/core/spec/catalog/core/actions/button/examples/html/button.html
```

## Why a spec layer

Nathan Curtis's point in [_We're focused too much on design tokens_](https://www.designsystemscollective.com/were-focused-too-much-on-design-tokens-nathan-curtis-on-design-systems-today-a329fdd79d4c)
is the thesis: token problems are solved at the depth the community discusses
them; **component architecture is an order of magnitude harder** and almost
nobody models it as data. His recommendations map onto what this repo is:

| Curtis says                                                                          | Lacquer does                                                                                                              |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Store decisions about props, structure, behaviour and guidance as data tools consume | One YAML per entry, validated by a JSON Schema, compiled to JSON. Skills, MCP and grader all read the same file.          |
| Composition over props; props overwhelm with choices                                 | `variants` are orthogonal axes; `api.composition` says what is children vs props; overlapping axes are a schema smell.    |
| Provide more ready-made examples as starting points                                  | Every stable entry ships `examples/` (good) and `examples/anti/` (forbidden usage) that the grader also uses as fixtures. |
| Alignment of design and code is the most fragile part of a system                    | The spec is the alignment. The HTML reference implements it; `spec:check` fails when the implementation drifts.           |
| Design for malleability, not just colour theming                                     | Specs name token **roles**; the binding maps roles to CSS custom properties. Swap the theme, keep the catalog.            |
| AI increases demand for well-architected systems                                     | The catalog is written for agents first: every rule has a detection hint, every forbidden pattern has code.               |

## Structure

A pnpm workspace. `@lacquer/core` is the catalog and its types; everything
else reads from it.

```
packages/
  core/                       @lacquer/core
    spec/
      schema/
        component.schema.json the contract for one entry (JSON Schema 2020-12)
        vocab.yaml            every enum, once: kinds, groups, tiers, states, token roles, aliases
      rules/
        universal.yaml        cross-component rules (LQ-STATE, LQ-FOCUS, LQ-TOKEN, LQ-SEM …)
        ai-loop.yaml          agent-loop rules (LQ-WAIT, LQ-STREAM, LQ-TOOL, LQ-GATE, LQ-TRUST …)
      bindings/
        html.yaml             token role -> CSS custom property (the contract)
        html.theme.css        a reference theme: a default value for every property, so examples render
      catalog/
        core/<group>/<id>/    134 product-agnostic components (11 groups)
        ai/<group>/<id>/       68 AI-interface components, patterns and principles (7 groups)
          <id>.yaml           the spec
          guidance.md         optional prose merged into SKILL.md
          examples/html/      reference implementation (<id>.html + <id>.css) and good examples
          examples/anti/      forbidden usage as code, each citing the rules it breaks
          SKILL.md            GENERATED — what an agent installs and reads
    grading/
      rubric.yaml             how findings become scores; dimensions, deductions, gates
      report.schema.json      the finish report an agent or CI consumes
      samples/report.example.json
    scripts/
      build-spec.ts           validate + compile dist/ + render SKILL.md; --check for CI
      lib/spec.ts             shared readers
    src/
      index.ts                typed loaders over dist/ for Node consumers
      types.ts                the types of every compiled shape
    dist/                     GENERATED by `pnpm build`, not committed
      catalog.json            every entry, validated, shared rules resolved inline, gaps and missing items listed
      index.json              light listing for search and MCP
      rules.json              one rule catalog, one id space (shared + every local rule)
      components/<id>.json    one file per entry
      index.js, index.d.ts    the typed entry
  react/                      @lacquer/react
    src/<id>.ts(x)            one module per entry, written from its spec; registered in the
                              entry's `implementations` as package + export
  mcp/                        @lacquer/mcp
    tools.yaml                the MCP tool contract (read tools now, grade tools next)
    server.ts                 the read tools over @lacquer/core
apps/
  site/                       @lacquer/site: one page per entry, the React implementation live
                              beside its contract
```

## One entry, end to end

Take `button` (`spec/catalog/core/actions/button/button.yaml`). The spec says:

- **what it is** — id, kind, catalog, group, tier, atomic level, aliases, where it is found
- **what it is made of** — `anatomy`: parts in DOM order, each becomes a `data-slot`
- **how it varies** — `variants`: orthogonal axes with defaults; `modifiers`: booleans
- **every state it must express** — `states`: treatment in token roles + how it reaches the accessibility tree
- **its API, framework-neutral** — `api.props` with what each maps to in the DOM; `api.composition` explains children vs props
- **the accessibility contract** — APG pattern, role, name source, ARIA attributes, keyboard table, focus rules
- **what it consumes** — `tokens.consumes`: roles, never values
- **what it says** — `content`: label rules, voice, stoplist, default strings
- **when to use it, and what instead** — `usage.instead` is the decision rule a search tool returns
- **what is forbidden** — `rules.local` with `polarity: forbid`, each with a detection hint and a fix; `rules.shared` cites the universal ones
- **where the code is** — `examples.good`, `examples.anti`, `implementations`

From that one file the build produces:

1. `SKILL.md` beside it — the agent-facing document, with `guidance.md` merged in and every cited rule stated in full under **Required** / **Forbidden**.
2. `dist/components/button.json` — the same data with shared rules resolved, for the MCP server and grader.
3. A row in `dist/index.json` — for search.
4. Its local rules merged into `dist/rules.json` — so `LQ-BUTTON-01` has the same standing as `LQ-STATE-01`.

And three consumers use it without touching YAML:

- **An agent building UI** calls `lacquer_search("confirm delete")` → `alert-dialog`, `lacquer_get` for the contract, `lacquer_example` for a starting point, `lacquer_tokens` to resolve roles to custom properties, then `lacquer_lint` on its output before returning it.
- **The grader** detects a `<button>` in a screen, loads `dist/components/button.json`, runs the `detect.static` hint of every resolved rule, and emits findings that cite `LQ-BUTTON-02` with the fix text straight from the spec. See `grading/samples/report.example.json` for what that looks like.
- **A person or a tool porting it** reads `examples/html/button.html` and `button.css`: the markup pattern, every state as an attribute, every value as a `var(--lq-…)`. A React, Vue, Svelte or Web Component version is a translation of that file, not a second design.

## The two catalogs

**core** (134) is product-agnostic UI; each entry lists the systems it is found
in. **ai** (68) is what AI-native and AI-augmented products add. AI entries declare `usage.reuses` — the core ids they are built from — so
the dependency graph is explicit: `approval-prompt` reuses `button` and
`textarea`.

The build reports **gaps**: core ids the AI catalog depends on that do not
exist. Today: `iframe`, `audio-player`, `code-editor`, `filter-bar`,
`highlight`.

## Kinds

Not everything in a design system is a thing on screen. `kind` separates them:

- `component` — rendered, reusable, has anatomy and states
- `pattern` — a composition that solves a job (an approval flow, a settings page)
- `principle` — a rule set a whole group obeys; uses the `machine` block (see `message-state-machine`)
- `method` — a way of working (latency patterns, disclosure conventions)

Principles can `tokens.defines` roles that components `tokens.consumes`; the
status colours every AI component uses are defined once, by the state machine.

## States vs modes

`states` are the universal interaction-state matrix (enabled, hover,
focus-visible, active, disabled, loading, invalid …) plus the AI lifecycle
states. They are a closed vocabulary in `vocab.yaml` so the grader can check
coverage mechanically — LQ-STATE-01 says every interactive component has the
five base states.

`modes` are component-specific display modes that are not interaction states:
a message list `following` vs `released`, a citation `single` vs `multiple`.
Same contract (treatment + a11y), open vocabulary.

## Rules are the product

A rule is one testable sentence with an id, a level (MUST / SHOULD / MAY), a
polarity (require / forbid), a detection hint (static or runtime) and a fix.
Forbidden usage is not a prose section; it is a `forbid` rule, and every
anti-example cites the rules it violates so the grader has fixtures.

Three places define rules, one id space:

| Where                       | What                                  | Example        |
| --------------------------- | ------------------------------------- | -------------- |
| `spec/rules/universal.yaml` | cross-component UI rules              | `LQ-FOCUS-01`  |
| `spec/rules/ai-loop.yaml`   | what a trustworthy agent surface does | `LQ-GATE-01`   |
| `<id>.yaml` → `rules.local` | rules only one entry can state        | `LQ-BUTTON-03` |

`grading/rubric.yaml` maps rule prefixes to dimensions and levels to
deductions; a finish report is the list of findings plus the resulting scores.

## Token roles and the binding

A spec never names a value or a class. It names a role: `color.bg.primary`,
`radius.control`, `motion.duration.fast`. The binding
(`spec/bindings/html.yaml`) maps every role to a CSS custom property, derived
mechanically: `color.bg.primary` is `--lq-color-bg-primary`. Component CSS reads
roles only, through `var()`. The token lint (LQ-TOKEN-01/02) resolves every
property an implementation reads back to a role and fails on any literal.

The binding names properties, never values. `html.theme.css` beside it is a
reference theme that gives each property a default so the examples render on
their own; a product overrides any of them and nothing in `spec/catalog/`
changes. A design tool, a CLI or a Tailwind preset can generate its own output
from the same binding, because custom properties are the one token format every
tool already understands.

## Renderers

HTML is the reference. The contract of a component is anatomy + states + ARIA +
keyboard + token roles, and all of that is expressible in markup and a
stylesheet with no framework in the way.

- `examples/html/<id>.html` is the reference implementation: a page you can
  open that documents the markup pattern and shows every state and variant.
- `examples/html/<id>.css` styles it, reading only binding properties. The root
  carries `data-lacquer="<id>"`, every part carries `data-slot`, every state is
  an attribute (`disabled`, `aria-busy`, `aria-expanded`, `data-state`).
- `examples/html/<example-id>.html` are fragments an agent copies: one file per
  example id in the spec, captured in the state it demonstrates.
- `examples/anti/<example-id>.html` are forbidden usage, each citing the rules
  it breaks, so the grader has negative fixtures.

This is why the catalog is usable by **any** framework. HTML is what every
framework produces, so the HTML reference is the one every framework can read
and port, and the one the grader's runtime mode inspects anyway.

`@lacquer/react` (`packages/react`) implements the catalog in React: one
module per entry, written from its spec and registered in the entry's
`implementations` as a package and a named export. Each component renders
the HTML reference's markup and loads the reference's stylesheet from
`@lacquer/core`, so an entry has one design, not two: binding custom
properties only, `data-slot` on every anatomy part, every state as an
attribute. The package depends on `@lacquer/core` for the compiled contract
and those stylesheets, and on nothing else. The site drives
each implementation through every state its spec names and shows the contract
beside it. A principle has no HTML reference; its React implementation is the
code the principle describes, so `message-state-machine` ships as a reducer
that reads its own `machine.transitions` table from the compiled spec.

## Authoring workflow

```
# edit <id>.yaml; its SKILL.md lists what is still missing
pnpm build    # validate, compile dist/, regenerate SKILL.md
pnpm check    # CI: fail if anything generated is stale or invalid
```

Every entry starts as `draft`. In a draft only `id`, `catalog`, `group` and
`status` are required; the build lists everything else that is missing, in the
entry's SKILL.md and in its dist JSON, without failing. An entry becomes
`stable` when it meets the definition of done and a maintainer signs it off;
from then on any gap is a build error. `deprecated` entries are kept for
reference.

**Definition of done for `status: stable`** (the build enforces the checkable parts):

1. Every anatomy part is a real part with a `data-slot` name, not a sentence.
2. Every interactive entry has the five base states with a treatment and an a11y expression.
3. `accessibility.name` says where the name comes from; keyboard is a table, not prose.
4. `api.props` are framework-neutral and each maps to a DOM/ARIA attribute where one exists.
5. At least three `rules.local`, at least one of them `forbid`.
6. At least one good example and one anti-example in `examples/html/` and `examples/anti/`, files present.
7. Cross-references (`instead`, `pairs_well_with`, `reuses`) all resolve.

## License

[MIT](LICENSE).
