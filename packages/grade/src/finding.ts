/**
 * One finding, in the shape of a finish report's `findings[]`
 * (packages/core/grading/report.schema.json). The grader will collect these
 * from every check into one report; until then each check prints its own.
 */
export interface Finding {
  /** Stable per report: `<rule>#<n>`. Assigned when a report is assembled. */
  id?: string;
  rule: string;
  level: "MUST" | "SHOULD" | "MAY";
  dimension: string;
  /** Catalog id, or "screen" for findings not tied to one entry. */
  component: string;
  /** The rule statement, made specific to this instance. */
  message: string;
  location: { file: string; line: number; snippet?: string };
  /** What the detector saw. */
  evidence: string;
  fix: string;
}

/** The catalog id a source file belongs to, from where it lives. */
export function componentOf(file: string): string {
  const spec = file.match(/spec\/catalog\/[^/]+\/[^/]+\/([^/]+)\//);
  if (spec) return spec[1];
  const registry = file.match(/registry\/lacquer\/[^/]+\/([^/]+)\//);
  if (registry) return registry[1];
  return "screen";
}

export function formatFinding(f: Finding): string {
  const where = `${f.location.file}:${f.location.line}`;
  return `${f.rule} ${f.level} ${where}\n  ${f.message}\n  saw: ${f.evidence}`;
}
