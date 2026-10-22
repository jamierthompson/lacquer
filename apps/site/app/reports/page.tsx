import type { Metadata } from "next";
import Link from "next/link";

import { Letter } from "@/components/report";
import { loadReports } from "@/lib/reports";

export const metadata: Metadata = {
  title: "Finish reports",
  description:
    "Every graded implementation in Lacquer, with its letter, its state coverage and every rule's verdict. Regenerated on every pull request.",
};

export default async function ReportsPage() {
  const reports = await loadReports();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-lq-inset-lg">
        <p className="font-lq-mono text-sm text-lq-accent-brand">
          Grade · Finish · CI
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Finish reports
        </h1>
        <p className="mt-2 max-w-lq-measure-prose leading-7 text-lq-fg-muted">
          A composition is finished when its report has zero MUST findings. The
          grader drives the implementation through every state its spec names,
          runs every rule it can execute, runs axe, scans the source, and writes
          one of these. CI regenerates each on every pull request and fails on
          drift.
        </p>
      </header>
      <ul className="grid gap-lq-gap-sm sm:grid-cols-2">
        {reports.map(({ id, report }) => (
          <li key={id}>
            <Link
              href={`/reports/${id}`}
              className="flex h-full gap-lq-gap-md rounded-lq-surface border border-lq-border-default p-lq-inset-md transition-colors duration-lq-fast ease-lq-standard hover:bg-lq-bg-accent"
            >
              <Letter report={report} size="sm" />
              <span className="flex flex-col gap-lq-gap-xs">
                <span className="font-semibold">{report.component ?? id}</span>
                <span className="font-lq-mono text-xs text-lq-fg-muted">
                  {report.subject.renderer ?? report.subject.kind} ·{" "}
                  {report.score.overall}/100
                </span>
                <span className="text-sm leading-6 text-lq-fg-muted">
                  {report.summary}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
