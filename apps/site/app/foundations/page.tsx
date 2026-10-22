import type { Metadata } from "next";
import Link from "next/link";

import { FOUNDATIONS } from "@/lib/foundations";

export const metadata: Metadata = {
  title: "Foundations",
  description:
    "The Lacquer brand theme as token roles, and the AI principles every component in the system follows.",
};

export default function FoundationsPage() {
  const tokens = FOUNDATIONS.filter((f) => f.kind === "tokens");
  const principles = FOUNDATIONS.filter((f) => f.kind === "principle");
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-lq-inset-lg">
        <h1 className="text-3xl font-semibold tracking-tight">Foundations</h1>
        <p className="mt-2 max-w-lq-measure-prose text-lq-fg-muted">
          A spec names token roles, never values. The roles and their values
          live once, bindings are derived from them, and these pages render from
          the compiled bindings.
        </p>
      </header>
      <Section title="The theme" items={tokens} />
      <Section title="AI principles" items={principles} />
    </main>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: typeof FOUNDATIONS;
}) {
  return (
    <section className="mb-lq-inset-lg">
      <h2 className="mb-lq-inset-sm text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <ul className="grid gap-lq-gap-sm sm:grid-cols-2">
        {items.map((f) => (
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
  );
}
