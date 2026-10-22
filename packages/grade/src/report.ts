/**
 * The finish report: assembled from a subject's findings, rule verdicts and
 * state coverage, scored by the rubric, validated against
 * packages/core/grading/report.schema.json before it is written.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  type CatalogComponent,
  REPORT_SCHEMA,
  type Rubric,
  type Rule,
} from "@lacquer/core";
import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { Finding } from "./finding.ts";
import { dimensionOf } from "./rubric.ts";
import { type RuleVerdict, type Score, score } from "./score.ts";
import { type Subject, subjectFiles } from "./subject.ts";

/** A finding with everything the schema requires filled in. */
export type CompleteFinding = Finding &
  Required<Pick<Finding, "id" | "level" | "dimension" | "instances">>;

export interface StateCoverage {
  id: string;
  required: boolean;
  status: "pass" | "fail" | "missing" | "skipped";
  how?: string;
  reason?: string;
  findings?: string[];
}

export interface Detected {
  id: string;
  instances: number;
  confidence: number;
  how?: string;
}

export interface Report {
  version: 1;
  mode: "static" | "runtime";
  generated_at: string;
  component: string;
  subject: {
    kind: "source" | "dom" | "url";
    renderer?: string;
    language?: string;
    url?: string;
    file?: string;
    package?: string;
    binding?: string;
    hash?: string;
  };
  detected: Detected[];
  states: StateCoverage[];
  rules: RuleVerdict[];
  score: Score;
  findings: CompleteFinding[];
  summary: string;
}

export interface Assembly {
  spec: CatalogComponent;
  subject: Subject;
  /** Repo-relative path of the subject's main file. */
  file: string;
  rules: Rule[];
  rubric: Rubric;
  findings: Finding[];
  /** Rules a check ran for, with how; every other applicable rule is skipped. */
  ran: Record<string, { how: "static" | "runtime" }>;
  skipReason: (rule: Rule) => string;
  states: StateCoverage[];
  detected: Detected[];
}

const LEVEL_ORDER = { MUST: 0, SHOULD: 1, MAY: 2 };

/** Fill a finding's level, dimension and fix from the rule catalog and give it its id. */
export function complete(
  findings: Finding[],
  rules: Rule[],
  rubric: Rubric,
): CompleteFinding[] {
  const byId = new Map(rules.map((r) => [r.id, r]));
  const counter = new Map<string, number>();
  const out: CompleteFinding[] = findings.map((f) => {
    const rule = byId.get(f.rule);
    const n = (counter.get(f.rule) ?? 0) + 1;
    counter.set(f.rule, n);
    return {
      ...f,
      id: `${f.rule}#${n}`,
      level: f.level ?? rule?.level ?? "MUST",
      dimension: f.dimension ?? dimensionOf(rubric, f.rule) ?? "structure",
      fix: f.fix ?? rule?.fix,
      instances: f.instances ?? 1,
    };
  });
  return out.sort(
    (a, b) =>
      LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] ||
      a.rule.localeCompare(b.rule) ||
      a.id.localeCompare(b.id),
  );
}

export function verdicts(a: Assembly, findings: Finding[]): RuleVerdict[] {
  return a.rules
    .map((r): RuleVerdict => {
      const dimension = dimensionOf(a.rubric, r.id) ?? "structure";
      const ran = a.ran[r.id];
      if (!ran)
        return {
          id: r.id,
          level: r.level,
          dimension,
          verdict: "skipped",
          reason: a.skipReason(r),
        };
      const n = findings.filter((f) => f.rule === r.id).length;
      return {
        id: r.id,
        level: r.level,
        dimension,
        verdict: n ? "fail" : "pass",
        how: ran.how,
        findings: n,
      };
    })
    .sort((x, y) => x.id.localeCompare(y.id));
}

export function summarize(
  spec: CatalogComponent,
  s: Score,
  findings: Finding[],
  states: StateCoverage[],
  rules: RuleVerdict[],
): string {
  const must = findings.filter((f) => f.level === "MUST");
  const should = findings.filter((f) => f.level === "SHOULD");
  const parts: string[] = [];
  if (must.length)
    parts.push(
      `${must.length} MUST finding${must.length === 1 ? "" : "s"}: ${[...new Set(must.map((f) => f.rule))].join(", ")}; not finished.`,
    );
  else parts.push(`Zero MUST findings: ${spec.name ?? spec.id} is finished.`);
  if (should.length)
    parts.push(
      `${should.length} SHOULD finding${should.length === 1 ? "" : "s"} (${[...new Set(should.map((f) => f.rule))].join(", ")}).`,
    );
  const passed = states.filter((x) => x.status === "pass").length;
  const required = states.filter((x) => x.required).length;
  parts.push(`${passed} of ${required} required states pass.`);
  const ran = rules.filter((r) => r.verdict !== "skipped");
  parts.push(
    `${ran.filter((r) => r.verdict === "pass").length} of ${ran.length} rules run pass, ${rules.length - ran.length} skipped. ${s.letter}${s.capped ? " (capped)" : ""}, ${s.overall}/100.`,
  );
  return parts.join(" ");
}

export async function hashOf(subject: Subject): Promise<string> {
  const h = createHash("sha256");
  for (const f of subjectFiles(subject)) h.update(await readFile(f));
  return `sha256:${h.digest("hex").slice(0, 16)}`;
}

export async function assemble(a: Assembly): Promise<Report> {
  const findings = complete(a.findings, a.rules, a.rubric);
  const rules = verdicts(a, findings);
  const s = score(findings, rules, a.rubric);
  // Coverage rows name finding ids; the ids exist only now.
  const states = a.states.map((st) => {
    const named = findings
      .filter((f) => f.state === st.id)
      .map((f) => f.id as string);
    const status = st.status === "pass" && named.length ? "fail" : st.status;
    return { ...st, status, findings: named.length ? named : undefined };
  });
  const subject: Report["subject"] =
    a.subject.kind === "page"
      ? {
          kind: "url",
          renderer: a.subject.renderer,
          language: "html",
          file: a.file,
          binding: "html",
          hash: await hashOf(a.subject),
        }
      : {
          kind: "source",
          renderer: a.subject.renderer,
          language: "typescript",
          file: a.file,
          package: a.subject.package,
          hash: await hashOf(a.subject),
        };
  const report = {
    version: 1 as const,
    mode:
      a.subject.kind === "page" ? ("runtime" as const) : ("runtime" as const),
    generated_at: new Date().toISOString(),
    component: a.spec.id,
    subject,
    detected: a.detected,
    states,
    rules,
    score: s,
    findings,
    summary: summarize(a.spec, s, findings, states, rules),
  };
  return strip(report) as Report;
}

/** Drop undefined values so the JSON matches the schema's additionalProperties: false cleanly. */
function strip<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

let validator: ValidateFunction | null = null;

/** Validate a report against the schema; throws with the first errors on failure. */
export async function validateReport(report: unknown): Promise<void> {
  if (!validator) {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats.default(ajv);
    validator = ajv.compile(JSON.parse(await readFile(REPORT_SCHEMA, "utf8")));
  }
  const ok = validator(report);
  if (!ok)
    throw new Error(
      `report does not match the schema: ${JSON.stringify(validator.errors, null, 1).slice(0, 1200)}`,
    );
}
