/**
 * One finding, in the shape of a finish report's `findings[]`
 * (packages/core/grading/report.schema.json). A check fills what it saw;
 * `report.ts` assigns the id and fills level, dimension and the fix text
 * from the rule catalog when the check left them out.
 */
export interface Finding {
  /** Stable per report: `<rule>#<n>`. Assigned when a report is assembled. */
  id?: string;
  rule: string;
  level?: "MUST" | "SHOULD" | "MAY";
  dimension?: string;
  /** Catalog id, or "screen" for findings not tied to one entry. */
  component: string;
  /** The state the finding was observed in, when it was. */
  state?: string;
  /** The rule statement, made specific to this instance. */
  message: string;
  location?: {
    file?: string;
    line?: number;
    column?: number;
    selector?: string;
    snippet?: string;
  };
  /** What the detector saw. */
  evidence?: string;
  fix?: string;
  instances?: number;
  reference?: string;
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
  const where = f.location?.file
    ? `${f.location.file}${f.location.line ? `:${f.location.line}` : ""}`
    : (f.location?.selector ?? "");
  const state = f.state ? ` [${f.state}]` : "";
  const n = f.instances && f.instances > 1 ? ` ×${f.instances}` : "";
  return `${f.rule} ${f.level ?? ""}${state}${n} ${where}\n  ${f.message}${f.evidence ? `\n  saw: ${f.evidence}` : ""}`;
}
