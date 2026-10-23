/**
 * What CI fails on: the gate (any MUST finding) and drift against the
 * committed baseline: a state or rule that passed and no longer does, in
 * any direction (it fails, it is skipped, or it is gone from the report), or
 * a dimension score that fell. A check removed from the grader or a rule
 * dropped from the catalog is a weaker grade, so it is drift too. A better
 * report is not drift; the baseline is just stale, and `--write` refreshes it.
 */
import type { Report } from "./report.ts";

export function gate(fresh: Report): string[] {
  const must = fresh.findings.filter((f) => f.level === "MUST");
  return must.length
    ? [
        `gate: ${must.length} MUST finding${must.length === 1 ? "" : "s"} (${[...new Set(must.map((f) => f.rule))].join(", ")})`,
      ]
    : [];
}

export function drift(baseline: Report, fresh: Report): string[] {
  const out: string[] = [];
  if (baseline.component !== fresh.component)
    out.push(
      `component: baseline is ${baseline.component}, fresh is ${fresh.component}`,
    );
  const was = new Map(baseline.states.map((s) => [s.id, s.status]));
  for (const s of fresh.states) {
    const before = was.get(s.id);
    if (before === "pass" && s.status !== "pass")
      out.push(
        `state ${s.id}: was pass, now ${s.status}${s.reason ? ` (${s.reason})` : ""}`,
      );
  }
  for (const [id, before] of was)
    if (before === "pass" && !fresh.states.some((s) => s.id === id))
      out.push(`state ${id}: was pass, now absent from the spec`);
  const ruleWas = new Map(baseline.rules.map((r) => [r.id, r.verdict]));
  for (const r of fresh.rules) {
    const before = ruleWas.get(r.id);
    if (before !== "pass" || r.verdict === "pass") continue;
    if (r.verdict === "fail")
      out.push(
        `rule ${r.id}: was pass, now fail (${r.findings} finding${r.findings === 1 ? "" : "s"})`,
      );
    else
      out.push(
        `rule ${r.id}: was pass, now skipped${r.reason ? ` (${r.reason})` : ""}`,
      );
  }
  for (const [id, before] of ruleWas)
    if (before === "pass" && !fresh.rules.some((r) => r.id === id))
      out.push(`rule ${id}: was pass, now absent from the report`);
  for (const [d, before] of Object.entries(baseline.score.dimensions)) {
    const now = fresh.score.dimensions[d];
    if (now !== undefined && now < before)
      out.push(`dimension ${d}: was ${before}, now ${now}`);
  }
  if (fresh.score.overall < baseline.score.overall)
    out.push(
      `overall: was ${baseline.score.overall}, now ${fresh.score.overall}`,
    );
  return out;
}

/** Equal apart from the timestamp: nothing to rewrite. */
export function same(a: Report, b: Report): boolean {
  const { generated_at: _a, ...x } = a;
  const { generated_at: _b, ...y } = b;
  return JSON.stringify(x) === JSON.stringify(y);
}
