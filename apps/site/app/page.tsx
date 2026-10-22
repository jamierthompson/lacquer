import Link from "next/link";

import { FOUNDATIONS } from "@/lib/foundations";

const LOOP = [
  {
    step: "Contract",
    body: "A spec per component: anatomy, what it composes, variants, states, token roles, rules, forbidden usage.",
  },
  {
    step: "Composition",
    body: "Built on Base UI and Tailwind against the spec, with every smaller part it needs. The spec is corrected when building shows it was wrong.",
  },
  {
    step: "Grade",
    body: "The grader drives every state the spec names, runs every rule it can execute, runs axe, scans the source, and writes a finish report.",
  },
  {
    step: "Finish",
    body: "Finished means zero MUST findings. The report is committed as the baseline.",
  },
  {
    step: "CI",
    body: "Every pull request regenerates the report and fails on drift: a lost state, a new finding, a lower score.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <section className="flex flex-col gap-lq-gap-md py-16 sm:py-24">
        <p className="font-lq-mono text-sm text-lq-accent-brand">
          AI-native design system
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          The finishing school for AI-generated UI.
        </h1>
        <p className="max-w-lq-measure-prose text-lg leading-8 text-lq-fg-muted">
          Foundations with a point of view, components on Base UI that carry
          Lacquer's own look, and AI-interface components as first-class members
          of the system. Every component has a written contract, is built from
          it, and is graded against it before it ships and on every pull request
          after.
        </p>
        <div className="flex flex-wrap items-center gap-lq-gap-sm pt-lq-inset-sm">
          <Link
            href="/foundations"
            className="inline-flex h-lq-control-md items-center rounded-lq-control bg-lq-bg-primary px-lq-inset-md text-sm font-medium text-lq-fg-on-primary shadow-lq-sm transition-colors duration-lq-fast ease-lq-standard hover:bg-lq-bg-primary-hover"
          >
            Read the foundations
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-lq-control-md items-center rounded-lq-control border border-lq-border-input px-lq-inset-md text-sm font-medium transition-colors duration-lq-fast ease-lq-standard hover:bg-lq-bg-accent"
          >
            Install the theme
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="loop"
        className="border-t border-lq-border-subtle py-12"
      >
        <h2 id="loop" className="text-xl font-semibold tracking-tight">
          The loop
        </h2>
        <p className="mt-2 max-w-lq-measure-prose text-lq-fg-muted">
          Every composition goes through the same five steps. The system is the
          set of compositions that have completed them.
        </p>
        <ol className="mt-lq-inset-lg grid gap-lq-gap-sm sm:grid-cols-2 lg:grid-cols-5">
          {LOOP.map((item, i) => (
            <li
              key={item.step}
              className="flex flex-col gap-lq-gap-xs rounded-lq-surface border border-lq-border-default bg-lq-bg-surface-secondary p-lq-inset-md"
            >
              <span className="font-lq-mono text-xs text-lq-accent-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold">{item.step}</h3>
              <p className="text-sm leading-6 text-lq-fg-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="foundations"
        className="border-t border-lq-border-subtle py-12"
      >
        <h2 id="foundations" className="text-xl font-semibold tracking-tight">
          Foundations
        </h2>
        <p className="mt-2 max-w-lq-measure-prose text-lq-fg-muted">
          A spec names token roles, never values. The roles live once, with
          every text and boundary pairing proven at build time.
        </p>
        <ul className="mt-lq-inset-lg grid gap-lq-gap-sm sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDATIONS.map((f) => (
            <li key={f.slug}>
              <Link
                href={`/foundations/${f.slug}`}
                className="flex h-full flex-col gap-lq-gap-xs rounded-lq-surface border border-lq-border-default p-lq-inset-md transition-colors duration-lq-fast ease-lq-standard hover:bg-lq-bg-accent"
              >
                <span className="font-semibold">{f.title}</span>
                <span className="text-sm leading-6 text-lq-fg-muted">
                  {f.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="install"
        className="border-t border-lq-border-subtle py-12"
      >
        <h2 id="install" className="text-xl font-semibold tracking-tight">
          Start on the theme
        </h2>
        <p className="mt-2 max-w-lq-measure-prose text-lq-fg-muted">
          The base item installs every role as a custom property in light and
          dark, the matching Tailwind utilities and Base UI, and registers the
          registry.
        </p>
        <pre className="mt-lq-inset-md overflow-x-auto rounded-lq-surface bg-lq-bg-surface-tertiary p-lq-inset-md font-lq-mono text-sm">
          <code>
            pnpm dlx shadcn@latest init https://lacquer.dev/r/base.json
          </code>
        </pre>
      </section>
    </main>
  );
}
