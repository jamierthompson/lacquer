/**
 * Grade one catalog entry: load its compiled spec, resolve its registered
 * implementations to subjects, run every applicable rule the grader can
 * execute against each, and assemble a finish report per subject.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  type CatalogComponent,
  loadBindings,
  loadComponent,
  loadRubric,
  loadRules,
  loadVocab,
  resolvePath,
} from "@lacquer/core";
import { checkMachine } from "./checks/machine.ts";
import {
  coverage,
  findInstances,
  PAGE_CHECKS,
  type PageContext,
  relative,
} from "./checks/page.ts";
import { checkRoles } from "./checks/roles.ts";
import { checkTokens, knownFrom } from "./checks/tokens.ts";
import { PageDriver } from "./drivers/page.ts";
import type { Finding } from "./finding.ts";
import {
  type Assembly,
  assemble,
  type Report,
  validateReport,
} from "./report.ts";
import { rulesFor, skipReason } from "./rules.ts";
import { type Subject, subjectsFor } from "./subject.ts";

export const THEME = resolvePath("spec/bindings/html.theme.css");

export interface Graded {
  subject: Subject;
  report: Report;
}

/** Grade a page subject (the html reference) or a fragment already opened in a driver. */
export async function gradePage(
  spec: CatalogComponent,
  subject: Extract<Subject, { kind: "page" }>,
  driver: PageDriver,
  repo: string,
): Promise<Report> {
  const [vocab, rubric, bindings, { rules: catalog }] = await Promise.all([
    loadVocab(),
    loadRubric(),
    loadBindings(),
    loadRules(),
  ]);
  const rules = rulesFor(spec, catalog);
  const file = relative(repo, subject.file);
  const { instances, detection } = await findInstances(driver, spec);
  const ctx: PageContext = { driver, spec, vocab, file, instances, detection };
  const findings: Finding[] = [];
  const ran: Assembly["ran"] = {};
  for (const rule of rules) {
    if (rule.id === "LQ-TOKEN-01") {
      ran[rule.id] = { how: "static" };
      findings.push(
        ...(await checkTokens(
          [subject.file, ...subject.styles],
          knownFrom(bindings),
          repo,
        )),
      );
      continue;
    }
    if (rule.id === "LQ-TOKEN-02") {
      ran[rule.id] = { how: "static" };
      findings.push(
        ...(await checkRoles(spec, subject.styles, bindings, repo)),
      );
      continue;
    }
    const check = PAGE_CHECKS[rule.id];
    if (!check) continue;
    ran[rule.id] = { how: "runtime" };
    findings.push(...(await check(ctx, rule)));
  }
  const states = await coverage(ctx);
  const report = await assemble({
    spec,
    subject,
    file,
    rules,
    rubric,
    findings,
    ran,
    skipReason: (r) => skipReason(r, "page"),
    states,
    detected: instances.length
      ? [
          {
            id: spec.id,
            instances: instances.length,
            confidence: detection === "data-lacquer" ? 1 : 0.7,
            how: detection,
          },
        ]
      : [],
  });
  await validateReport(report);
  return report;
}

export async function gradeModule(
  spec: CatalogComponent,
  subject: Extract<Subject, { kind: "module" }>,
  repo: string,
): Promise<Report> {
  const [rubric, bindings, { rules: catalog }] = await Promise.all([
    loadRubric(),
    loadBindings(),
    loadRules(),
  ]);
  const rules = rulesFor(spec, catalog);
  const file = relative(repo, subject.file);
  const findings: Finding[] = [];
  const ran: Assembly["ran"] = {};
  if (rules.some((r) => r.id === "LQ-TOKEN-01")) {
    ran["LQ-TOKEN-01"] = { how: "static" };
    findings.push(
      ...(await checkTokens(subject.files, knownFrom(bindings), repo)),
    );
  }
  const m = await checkMachine(spec, subject, rules, file);
  findings.push(...m.findings);
  Object.assign(ran, m.verdicts);
  const report = await assemble({
    spec,
    subject,
    file,
    rules,
    rubric,
    findings,
    ran,
    skipReason: (r) => skipReason(r, "module"),
    states: m.states,
    detected: [{ id: spec.id, instances: 1, confidence: 1, how: "module" }],
  });
  await validateReport(report);
  return report;
}

export async function gradeComponent(
  id: string,
  repo: string,
): Promise<Graded[]> {
  const spec = await loadComponent(id);
  const subjects = await subjectsFor(spec, repo);
  if (!subjects.length)
    throw new Error(`${id} registers no implementation; nothing to grade`);
  const out: Graded[] = [];
  for (const subject of subjects) {
    if (subject.kind === "page") {
      const driver = await PageDriver.open(subject.file);
      try {
        out.push({
          subject,
          report: await gradePage(spec, subject, driver, repo),
        });
      } finally {
        await driver.close();
      }
    } else
      out.push({ subject, report: await gradeModule(spec, subject, repo) });
  }
  return out;
}

/**
 * Grade an html fragment (an example or an anti-example) as if it were the
 * entry's page: wrapped in a shell with the theme and the entry's reference
 * stylesheet. This is how the anti-examples serve as the grader's negative
 * fixtures.
 */
export async function gradeFragment(
  id: string,
  fragment: string,
  repo: string,
): Promise<Report> {
  const spec = await loadComponent(id);
  const html = await readFile(fragment, "utf8");
  const reference = (await subjectsFor(spec, repo)).find(
    (s) => s.kind === "page",
  );
  const styles = reference?.kind === "page" ? reference.styles : [];
  const driver = await PageDriver.fragment(html, styles, THEME);
  try {
    return await gradePage(
      spec,
      {
        kind: "page",
        renderer: "html",
        component: id,
        file: fragment,
        styles: [],
      },
      driver,
      repo,
    );
  } finally {
    await driver.close();
  }
}

/** Where a component's baseline lives: apps/site/reports/<id>.json. */
export const reportPath = (repo: string, id: string, renderer?: string) =>
  path.join(
    repo,
    "apps/site/reports",
    `${id}${renderer ? `.${renderer}` : ""}.json`,
  );
