/**
 * The rubric's arithmetic (grading/rubric.yaml, compiled to dist/rubric.json).
 *
 * Per dimension: start at 100; each rule that fired deducts its level's
 * amount once, then `repeat_instance` per extra instance up to
 * `repeat_cap`; floor at 0. Only dimensions in which at least one rule ran
 * are scored. Overall is the weighted mean; a MUST in a gate dimension caps
 * the letter at C.
 */
import type { Rubric } from "@lacquer/core";
import type { Finding } from "./finding.ts";
import { dimensionOf } from "./rubric.ts";

export interface RuleVerdict {
  id: string;
  level: "MUST" | "SHOULD" | "MAY";
  dimension: string;
  verdict: "pass" | "fail" | "skipped";
  how?: "static" | "runtime";
  reason?: string;
  findings?: number;
}

export interface Score {
  overall: number;
  letter: "A" | "B" | "C" | "D" | "F";
  capped?: boolean;
  dimensions: Record<string, number>;
}

/** Deduction for one rule, over every finding that cites it. */
export function deduction(
  level: "MUST" | "SHOULD" | "MAY",
  instances: number,
  rubric: Rubric,
): number {
  const base = rubric.deductions[level];
  if (base === 0) return 0;
  const extra = Math.min(
    Math.max(0, instances - 1) * rubric.deductions.repeat_instance,
    rubric.deductions.repeat_cap,
  );
  return base + extra;
}

export function letterOf(overall: number, rubric: Rubric): Score["letter"] {
  const ladder = [...(["A", "B", "C", "D", "F"] as const)].sort(
    (a, b) => rubric.letter_grades[b] - rubric.letter_grades[a],
  );
  for (const l of ladder) if (overall >= rubric.letter_grades[l]) return l;
  return "F";
}

export function score(
  findings: Finding[],
  verdicts: RuleVerdict[],
  rubric: Rubric,
): Score {
  const ran = new Set(
    verdicts.filter((v) => v.verdict !== "skipped").map((v) => v.dimension),
  );
  const dimensions: Record<string, number> = {};
  for (const d of Object.keys(rubric.dimensions))
    if (ran.has(d)) dimensions[d] = 100;
  const byRule = new Map<
    string,
    { level: Finding["level"]; instances: number }
  >();
  for (const f of findings) {
    const cur = byRule.get(f.rule) ?? { level: f.level, instances: 0 };
    cur.instances += f.instances ?? 1;
    byRule.set(f.rule, cur);
  }
  for (const [rule, { level, instances }] of byRule) {
    const dim = dimensionOf(rubric, rule);
    if (!dim || !(dim in dimensions) || !level) continue;
    dimensions[dim] = Math.max(
      0,
      dimensions[dim] - deduction(level, instances, rubric),
    );
  }
  let weight = 0;
  let sum = 0;
  for (const [d, s] of Object.entries(dimensions)) {
    weight += rubric.dimensions[d].weight;
    sum += s * rubric.dimensions[d].weight;
  }
  const overall = weight ? Math.round(sum / weight) : 100;
  let letter = letterOf(overall, rubric);
  const mustInGate = findings.some(
    (f) =>
      f.level === "MUST" &&
      rubric.gate.cap_at_c_if_must_in.includes(f.dimension ?? ""),
  );
  let capped = false;
  if (mustInGate && (letter === "A" || letter === "B")) {
    letter = "C";
    capped = true;
  }
  return { overall, letter, ...(capped ? { capped } : {}), dimensions };
}
