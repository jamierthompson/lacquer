# @lacquer/core

The spec layer: the schema, the vocabulary, the rules, the bindings and every
component's contract, compiled to JSON. Everything else in the repo reads from
here: the registry, the site, the MCP server, the generated skills and, once
it lands, the grader. Nothing here depends on a framework.

`spec/README.md` covers writing the files in `spec/`. This file explains the
model.

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
2. `dist/components/button.json` — the same data with shared rules resolved, for the MCP server and the grader.
3. A row in `dist/index.json` — for search.
4. Its local rules merged into `dist/rules.json` — so `LQ-BUTTON-01` has the same standing as `LQ-STATE-01`.

And three consumers use it without touching YAML (the MCP server exists, the
grader has its first check, the registry implementation arrives with the
first composition):

- **An agent building UI** calls `lacquer_search("confirm delete")` → `alert-dialog`, `lacquer_get` for the contract, `lacquer_example` for a starting point, `lacquer_tokens` to resolve roles to custom properties, and, once the grade tools exist, `lacquer_lint` on its output before returning it.
- **The grader** (`packages/grade`) will load `dist/components/button.json`, drive the registry's button through every state the spec names, run every rule whose `detect` hint it can execute, and emit findings that cite `LQ-BUTTON-02` with the fix text straight from the spec. `grading/samples/report.example.json` is the shape of that report. Today it runs one of those rules, LQ-TOKEN-01, statically over source.
- **The registry implementation**, and anyone porting the entry, reads `examples/html/button.html` and `button.css`: the markup pattern, every state as an attribute, every value as a role through the binding. The React version on Base UI and Tailwind is a translation of that file, not a second design.

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
deductions; a finish report will be the list of findings plus the resulting
scores, in the shape of `grading/report.schema.json`.

## Tokens, roles and the bindings

A spec never names a value or a class. It names a role: `color.bg.primary`,
`radius.control`, `motion.duration.fast`. A role is a token's path in
`spec/tokens/`, written in the W3C Design Tokens Community Group format
(Format Module 2025.10): `lacquer.tokens.json` holds every role with its
`$type`, `$description` and light `$value`, `dark.tokens.json` holds only the
roles that change, and `lacquer.resolver.json` (Resolver Module 2025.10) says
how the two compose under a `theme` modifier. That file set is the single
source: a new role is one entry there, and every binding picks it up.

A binding is a derivation, not a list. The **html** binding reads a role as a
custom property, `--lq-` plus the path with dashes: `--lq-color-bg-primary`.
The **tailwind** binding reads it as a Tailwind 4 theme variable and utility
chosen from the token's type and category: `--color-lq-bg-primary`, used as
`bg-lq-bg-primary`; `rounded-lq-control`; `shadow-lq-sm`; `z-lq-modal`. Every
theme variable aliases the html property, so retheming the `--lq-*` properties
rethemes both. A role whose type has no Tailwind namespace (a padding
shorthand, a `typography` setting, the focus ring) keeps its `--lq-*` property
and is read with Tailwind's variable syntax, `p-(--lq-space-inset-control-md)`.
The few places the derivation needs steering sit on the token itself, in
`$extensions["dev.lacquer"]`.

The build validates the tokens (types and shapes, aliases, categories against
`vocab.yaml`), derives both bindings into `dist/bindings.json`, and generates
the two stylesheets in `spec/bindings/`: `html.theme.css`, which the catalog's
HTML examples link, and `tailwind.theme.css`, which the site imports and the
registry's base item is built from. Component CSS reads roles only, through
`var(--lq-…)`; registry code reads them through the `lq-` utilities.
`@lacquer/grade` runs the LQ-TOKEN-01 check over both today; the grader's
token dimension grows from it.

## Renderers

HTML is the html binding's reference. The contract of a component is anatomy

- states + ARIA + keyboard + token roles, and all of that is expressible in
  markup and a stylesheet, so every entry carries one.

* `examples/html/<id>.html` is the reference implementation: a page you can
  open that documents the markup pattern and shows every state and variant.
* `examples/html/<id>.css` styles it, reading only binding properties. The root
  carries `data-lacquer="<id>"`, every part carries `data-slot`, every state is
  an attribute (`disabled`, `aria-busy`, `aria-expanded`, `data-state`).
* `examples/html/<example-id>.html` are fragments an agent copies: one file per
  example id in the spec, captured in the state it demonstrates.
* `examples/anti/<example-id>.html` are forbidden usage, each citing the rules
  it breaks, so the grader has negative fixtures.

HTML is what every framework produces, so the HTML reference is the one any
framework can read and port, and the one the grader's runtime mode will
inspect.

The React implementation of an entry will live in the registry
(`apps/site/registry/lacquer/<group>/<id>/`), written from the spec on Base UI
and Tailwind through the `tailwind` binding, and registered in the entry's
`implementations`. The binding exists; no component does yet. The Oct 14
implementations on the html binding are at the git tag `catalog-2026-10`.

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
