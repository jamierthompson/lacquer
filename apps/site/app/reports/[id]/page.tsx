import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Coverage, Dimensions, Letter } from "@/components/report";
import { loadReport, reportIds, sourceUrl } from "@/lib/reports";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await reportIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const report = await loadReport(id);
  if (!report) notFound();
  return {
    title: `${report.component ?? id} · ${report.score.letter}`,
    description: report.summary,
  };
}

const VERDICT: Record<string, string> = {
  pass: "text-lq-status-success",
  fail: "text-lq-status-error",
  skipped: "text-lq-fg-muted",
};

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const report = await loadReport(id);
  if (!report) notFound();
  const must = report.findings.filter((f) => f.level === "MUST").length;
  const ran = (report.rules ?? []).filter((r) => r.verdict !== "skipped");
  const generated = report.generated_at
    ? new Date(report.generated_at).toISOString().slice(0, 10)
    : null;
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-lq-inset-sm text-sm">
        <Link
          href="/reports"
          className="rounded-lq-sm text-lq-fg-muted hover:text-lq-fg-default"
        >
          Finish reports
        </Link>
      </nav>
      <header className="mb-lq-inset-lg flex flex-col gap-lq-gap-md sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-lq-mono text-sm text-lq-accent-brand">
            finish report · {report.subject.renderer ?? report.subject.kind}
            {generated ? ` · ${generated}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {report.component ?? id}
          </h1>
          <p className="mt-lq-inset-sm max-w-lq-measure-prose leading-7 text-lq-fg-muted">
            {report.summary}
          </p>
          <p className="mt-lq-inset-sm font-lq-mono text-xs text-lq-fg-muted">
            {must === 0
              ? "Finished: zero MUST findings."
              : `${must} MUST finding${must === 1 ? "" : "s"}: not finished.`}{" "}
            {ran.filter((r) => r.verdict === "pass").length} of {ran.length}{" "}
            rules run pass; {(report.rules?.length ?? 0) - ran.length} skipped.
          </p>
        </div>
        <Letter report={report} />
      </header>

      <section className="mb-lq-inset-lg" aria-labelledby="dimensions">
        <h2
          id="dimensions"
          className="mb-lq-inset-sm text-xl font-semibold tracking-tight"
        >
          Dimensions
        </h2>
        <Dimensions score={report.score} />
      </section>

      <section className="mb-lq-inset-lg" aria-labelledby="states">
        <h2
          id="states"
          className="mb-lq-inset-sm text-xl font-semibold tracking-tight"
        >
          State coverage
        </h2>
        <p className="mb-lq-inset-sm max-w-lq-measure-prose text-sm leading-6 text-lq-fg-muted">
          Every state the spec names, how the grader reached it, and whether it
          passed the state rules.
        </p>
        <Coverage states={report.states} />
      </section>

      {report.findings.length ? (
        <section className="mb-lq-inset-lg" aria-labelledby="findings">
          <h2
            id="findings"
            className="mb-lq-inset-sm text-xl font-semibold tracking-tight"
          >
            Findings
          </h2>
          <ol className="flex flex-col gap-lq-gap-sm">
            {report.findings.map((f) => (
              <li
                key={f.id}
                className="rounded-lq-surface border border-lq-border-default p-lq-inset-md"
              >
                <p className="flex flex-wrap items-center gap-lq-gap-xs font-lq-mono text-xs">
                  <span className="font-semibold">{f.rule}</span>
                  <span
                    className={cn(
                      "rounded-lq-pill border px-2 py-0.5",
                      f.level === "MUST"
                        ? "border-lq-border-danger text-lq-status-error"
                        : "border-lq-border-default text-lq-fg-muted",
                    )}
                  >
                    {f.level}
                  </span>
                  <span className="text-lq-fg-muted">{f.dimension}</span>
                  {f.state ? (
                    <span className="text-lq-fg-muted">in {f.state}</span>
                  ) : null}
                  {f.instances && f.instances > 1 ? (
                    <span className="text-lq-fg-muted">×{f.instances}</span>
                  ) : null}
                </p>
                <p className="mt-2 leading-7">{f.message}</p>
                {f.evidence ? (
                  <p className="mt-1 text-sm leading-6 text-lq-fg-muted">
                    Saw: {f.evidence}
                  </p>
                ) : null}
                {f.fix ? (
                  <p className="mt-1 text-sm leading-6">Fix: {f.fix}</p>
                ) : null}
                {f.location?.file ? (
                  <p className="mt-1 font-lq-mono text-xs text-lq-fg-muted">
                    {f.location.file}
                    {f.location.line ? `:${f.location.line}` : ""}
                    {f.location.selector ? ` ${f.location.selector}` : ""}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mb-lq-inset-lg" aria-labelledby="rules">
        <h2
          id="rules"
          className="mb-lq-inset-sm text-xl font-semibold tracking-tight"
        >
          Rules
        </h2>
        <p className="mb-lq-inset-sm max-w-lq-measure-prose text-sm leading-6 text-lq-fg-muted">
          Every rule the subject is graded against. A rule the grader cannot
          execute yet is skipped with the reason, never hidden.
        </p>
        <div className="overflow-x-auto rounded-lq-surface border border-lq-border-default">
          <table className="w-full text-sm">
            <thead className="bg-lq-bg-surface-secondary text-left text-xs text-lq-fg-muted">
              <tr>
                <th scope="col" className="px-lq-inset-sm py-2 font-medium">
                  Rule
                </th>
                <th scope="col" className="px-lq-inset-sm py-2 font-medium">
                  Level
                </th>
                <th scope="col" className="px-lq-inset-sm py-2 font-medium">
                  Dimension
                </th>
                <th scope="col" className="px-lq-inset-sm py-2 font-medium">
                  Verdict
                </th>
                <th scope="col" className="px-lq-inset-sm py-2 font-medium">
                  How
                </th>
              </tr>
            </thead>
            <tbody>
              {(report.rules ?? []).map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-lq-border-subtle align-top"
                >
                  <td className="px-lq-inset-sm py-2 font-lq-mono text-xs">
                    {r.id}
                  </td>
                  <td className="px-lq-inset-sm py-2 font-lq-mono text-xs">
                    {r.level}
                  </td>
                  <td className="px-lq-inset-sm py-2 text-lq-fg-muted">
                    {r.dimension}
                  </td>
                  <td
                    className={cn(
                      "px-lq-inset-sm py-2 font-lq-mono text-xs",
                      VERDICT[r.verdict],
                    )}
                  >
                    {r.verdict}
                    {r.verdict === "fail" && r.findings
                      ? ` (${r.findings})`
                      : ""}
                  </td>
                  <td className="px-lq-inset-sm py-2 text-lq-fg-muted">
                    {r.verdict === "skipped" ? r.reason : r.how}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-lq-border-subtle pt-lq-inset-sm font-lq-mono text-xs text-lq-fg-muted">
        Subject:{" "}
        {report.subject.file ? (
          <a
            href={sourceUrl(report.subject.file)}
            className="rounded-lq-sm text-lq-fg-link underline underline-offset-4"
          >
            {report.subject.file}
          </a>
        ) : (
          report.subject.kind
        )}
        {report.subject.package ? ` · ${report.subject.package}` : ""}
        {report.subject.hash ? ` · ${report.subject.hash}` : ""}
        {report.detected[0]
          ? ` · ${report.detected[0].instances} instance${report.detected[0].instances === 1 ? "" : "s"} detected by ${report.detected[0].how}`
          : ""}
      </footer>
    </main>
  );
}
