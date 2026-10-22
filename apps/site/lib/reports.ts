import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The finish reports the grader committed: apps/site/reports/<id>.json,
 * one per graded implementation, in the shape of
 * packages/core/grading/report.schema.json. The report page renders them;
 * CI regenerates them and fails on drift, so what the site shows is what
 * the last green run measured.
 */
export interface Report {
  version: 1;
  mode: "static" | "runtime";
  generated_at?: string;
  component?: string;
  subject: {
    kind: "source" | "dom" | "url";
    renderer?: string;
    language?: string;
    file?: string;
    package?: string;
    binding?: string;
    hash?: string;
  };
  detected: {
    id: string;
    instances: number;
    confidence: number;
    how?: string;
  }[];
  states?: {
    id: string;
    required: boolean;
    status: "pass" | "fail" | "missing" | "skipped";
    how?: string;
    reason?: string;
    findings?: string[];
  }[];
  rules?: {
    id: string;
    level: "MUST" | "SHOULD" | "MAY";
    dimension: string;
    verdict: "pass" | "fail" | "skipped";
    how?: "static" | "runtime";
    reason?: string;
    findings?: number;
  }[];
  score: {
    overall: number;
    letter: "A" | "B" | "C" | "D" | "F";
    capped?: boolean;
    dimensions: Record<string, number>;
  };
  findings: {
    id: string;
    rule: string;
    level: "MUST" | "SHOULD" | "MAY";
    dimension: string;
    component: string;
    state?: string;
    message: string;
    location?: {
      file?: string;
      line?: number;
      selector?: string;
      snippet?: string;
    };
    evidence?: string;
    fix?: string;
    instances?: number;
    reference?: string;
  }[];
  summary?: string;
}

const DIR = path.join(process.cwd(), "reports");

/** The report slugs, from the file names, sorted. */
export async function reportIds(): Promise<string[]> {
  const files = await readdir(DIR).catch(() => [] as string[]);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -".json".length))
    .sort();
}

export async function loadReport(id: string): Promise<Report | null> {
  if (!/^[a-z0-9.-]+$/.test(id)) return null;
  try {
    return JSON.parse(
      await readFile(path.join(DIR, `${id}.json`), "utf8"),
    ) as Report;
  } catch {
    return null;
  }
}

export async function loadReports(): Promise<{ id: string; report: Report }[]> {
  const out: { id: string; report: Report }[] = [];
  for (const id of await reportIds()) {
    const report = await loadReport(id);
    if (report) out.push({ id, report });
  }
  return out;
}

/** The GitHub URL of a repo-relative file, for the subject line. */
export const sourceUrl = (file: string) =>
  `https://github.com/jamierthompson/lacquer/blob/main/${file}`;
