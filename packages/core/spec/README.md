# The Lacquer spec layer

This folder is the source of truth for Lacquer. Everything
else in the repo — the generated skills, the registry, the MCP server and,
once it lands, the grader — reads from here. Nothing here depends on any
framework or product.

The model behind the catalog, the authoring workflow and the definition of
done are in the package [README](../README.md); the rules for working here
are in [AGENTS.md](../../../AGENTS.md). This file covers only what is specific
to writing the files in `spec/`.

## What is in here

```
spec/
  schema/
    component.schema.json   the contract for one entry (JSON Schema 2020-12)
    vocab.yaml              every enum, once: kinds, groups, tiers, states, token roles, aliases
  rules/
    universal.yaml          cross-component rules (LQ-STATE, LQ-FOCUS, LQ-TOKEN …)
    ai-loop.yaml            agent-loop rules (LQ-WAIT, LQ-STREAM, LQ-TOOL, LQ-GATE …)
  bindings/
    html.yaml               token role -> CSS custom property (the contract)
    html.theme.css          reference theme: a default for every property, so examples render
  catalog/
    core/<group>/<id>/      product-agnostic components
    ai/<group>/<id>/        AI-interface components, patterns and principles
      <id>.yaml             the spec
      guidance.md           optional prose merged into SKILL.md
      examples/html/        reference implementation (<id>.html + <id>.css) and good examples
      examples/anti/        forbidden usage as code, each citing the rules it breaks
      SKILL.md              GENERATED — what an agent installs and reads
```

The build (`../scripts/build-spec.ts`) compiles all of this into `../dist/`,
which is not committed.

## Writing an HTML example

Open `catalog/core/actions/button/examples/html/button.html` in a browser; it
links the reference theme and its own stylesheet with relative paths and needs
no build. Each good example is a fragment, one file per `examples.good[].id`,
captured in the state it demonstrates, with a leading comment that says what it
shows and which rules it exercises. Each anti-example is the same shape and
must fail the rules it cites. Stateful behaviour (a toggle, a loading
transition) is shown as a snapshot with the attributes set; the reference page
may add a few lines of script to make a disclosure usable, nothing more.

`button` shows the full shape: guidance, an HTML reference, examples and
anti-examples. `tool-call-card` is an AI component with lifecycle states and an
HTML reference; `message-state-machine` is a principle with a `machine` block.
Every entry's SKILL.md lists what it is still missing.

## Registering an implementation

The React implementation will live in the registry, under
`apps/site/registry/lacquer/<group>/<id>/`, as the item the shadcn CLI
installs, and the entry will register it under `implementations` with
`renderer: react`, the registry item name and the named `export`. No entry
does yet. The Oct 14 implementations on the html binding are at the git tag
`catalog-2026-10`; `message-state-machine` there reads its own `machine`
block from the compiled entry so the reducer cannot drift from the YAML, and
the registry version keeps that guarantee as a test.
