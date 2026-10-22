import type { Report } from "@/lib/reports";
import { cn } from "@/lib/utils";

/** The letter grade, with the number beside it; capped grades say so. */
export function Letter({
  report,
  size = "lg",
}: {
  report: Report;
  size?: "sm" | "lg";
}) {
  const { letter, overall, capped } = report.score;
  return (
    <span
      className={cn(
        "flex flex-none flex-col items-center justify-center rounded-lq-surface border border-lq-border-default bg-lq-bg-surface-secondary font-lq-mono",
        size === "lg" ? "size-28" : "size-16",
      )}
    >
      <span className="sr-only">
        Grade {letter}
        {capped ? ", capped" : ""}, {overall} out of 100
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "leading-none font-semibold tracking-tight",
          size === "lg" ? "text-6xl" : "text-3xl",
          letter === "A" ? "text-lq-accent-brand" : "text-lq-fg-default",
        )}
      >
        {letter}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 text-lq-fg-muted",
          size === "lg" ? "text-sm" : "text-xs",
        )}
      >
        {overall}
        {capped ? " · capped" : ""}
      </span>
    </span>
  );
}

const STATUS: Record<
  NonNullable<Report["states"]>[number]["status"],
  { dot: string; label: string }
> = {
  pass: { dot: "bg-lq-status-success", label: "pass" },
  fail: { dot: "bg-lq-status-error", label: "fail" },
  missing: { dot: "bg-lq-status-warning", label: "missing" },
  skipped: { dot: "bg-lq-fg-muted", label: "skipped" },
};

/** The state coverage grid: one cell per state the spec names. */
export function Coverage({ states }: { states: Report["states"] }) {
  if (!states?.length) return null;
  return (
    <ul className="grid grid-cols-2 gap-lq-gap-xs sm:grid-cols-4">
      {states.map((s) => (
        <li
          key={s.id}
          className="flex flex-col gap-1 rounded-lq-surface border border-lq-border-default p-lq-inset-sm"
          title={s.reason}
        >
          <span className="flex items-center gap-lq-gap-xs">
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-lq-pill", STATUS[s.status].dot)}
            />
            <span className="font-lq-mono text-sm">{s.id}</span>
            {!s.required ? (
              <span className="text-xs text-lq-fg-muted">optional</span>
            ) : null}
          </span>
          <span className="text-xs text-lq-fg-muted">
            {STATUS[s.status].label}
            {s.how ? ` · ${s.how}` : ""}
          </span>
          {s.reason ? (
            <span className="text-xs text-lq-fg-muted">{s.reason}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Per-dimension scores: the number is the content, the bar beside it is decoration. */
export function Dimensions({ score }: { score: Report["score"] }) {
  const entries = Object.entries(score.dimensions);
  return (
    <ul className="flex flex-col gap-lq-gap-xs">
      {entries.map(([name, value]) => (
        <li
          key={name}
          className="grid grid-cols-[8rem_1fr_3rem] items-center gap-lq-gap-sm text-sm"
        >
          <span className="font-lq-mono">{name}</span>
          <span
            aria-hidden="true"
            className="h-2 overflow-hidden rounded-lq-pill bg-lq-bg-surface-tertiary"
          >
            <span
              className={cn(
                "block h-full rounded-lq-pill",
                value >= 90
                  ? "bg-lq-accent-brand"
                  : value >= 65
                    ? "bg-lq-status-warning"
                    : "bg-lq-status-error",
              )}
              style={{ width: `${value}%` }}
            />
          </span>
          <span className="text-right font-lq-mono text-lq-fg-muted">
            {value}
          </span>
        </li>
      ))}
    </ul>
  );
}
