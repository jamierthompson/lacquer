#!/usr/bin/env node
/**
 * lacquer-grade: the Lacquer grader's command line.
 *
 *   lacquer-grade <id>… [--write] [--json]
 *     Grade each entry's registered implementation and print the report.
 *     Exits 1 on any MUST finding (the gate). --write commits the report as
 *     the baseline, apps/site/reports/<id>.json.
 *
 *   lacquer-grade check [<id>…]
 *     Regenerate the report for every committed baseline (or the given ids)
 *     and fail on the gate or on drift: a state or rule that passed and no
 *     longer does, or a dimension score that fell. What CI runs.
 *
 *   lacquer-grade tokens [--json] [path…]
 *     LQ-TOKEN-01 over the registry source and the catalog's examples (the
 *     defaults), or over the given files and folders. Exits 1 on any finding.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadBindings } from "@lacquer/core";

import { checkTokens, knownFrom } from "./checks/tokens.ts";
import { drift, gate, same } from "./drift.ts";
import { formatFinding } from "./finding.ts";
import { gradeComponent, reportPath } from "./grade.ts";
import type { Report } from "./report.ts";

const REPO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const DEFAULT_ROOTS = ["apps/site/registry", "packages/core/spec/catalog"];

async function tokens(args: string[]) {
  const json = args.includes("--json");
  const given = args.filter((a) => !a.startsWith("--"));
  const roots = given.length
    ? given.map((p) => path.resolve(p))
    : DEFAULT_ROOTS.map((p) => path.resolve(REPO, p));
  const known = knownFrom(await loadBindings());
  const findings = await checkTokens(roots, known, REPO);
  if (json) {
    console.log(JSON.stringify({ rule: "LQ-TOKEN-01", findings }, null, 2));
  } else {
    for (const f of findings) console.log(formatFinding(f));
    console.log(
      findings.length
        ? `\nLQ-TOKEN-01: ${findings.length} finding(s)`
        : "LQ-TOKEN-01: no literals; every value reads a role through the binding",
    );
  }
  process.exitCode = findings.length ? 1 : 0;
}

function print(report: Report) {
  const s = report.score;
  console.log(`\n${report.component} · ${report.subject.file}`);
  console.log(
    `  ${s.letter}${s.capped ? " (capped)" : ""} ${s.overall}/100  ${Object.entries(
      s.dimensions,
    )
      .map(([d, v]) => `${d} ${v}`)
      .join(", ")}`,
  );
  console.log(
    `  states: ${report.states.map((x) => `${x.id} ${x.status === "pass" ? "✓" : x.status === "fail" ? "✗" : x.status === "missing" ? "missing" : "–"}`).join("  ")}`,
  );
  const ran = report.rules.filter((r) => r.verdict !== "skipped");
  console.log(
    `  rules: ${ran.filter((r) => r.verdict === "pass").length}/${ran.length} pass, ${report.rules.length - ran.length} skipped`,
  );
  for (const f of report.findings)
    console.log(`  ${formatFinding(f).replace(/\n/g, "\n  ")}`);
  console.log(`  ${report.summary}`);
}

const file = (id: string, renderer?: string) => reportPath(REPO, id, renderer);

async function grade(args: string[]) {
  const write = args.includes("--write");
  const json = args.includes("--json");
  const ids = args.filter((a) => !a.startsWith("--"));
  let failed = false;
  for (const id of ids) {
    const graded = await gradeComponent(id, REPO);
    for (const { report, subject } of graded) {
      const target = file(id, graded.length > 1 ? subject.renderer : undefined);
      if (json) console.log(JSON.stringify(report, null, 2));
      else print(report);
      const problems = gate(report);
      if (problems.length) failed = true;
      if (write) {
        const current = await readFile(target, "utf8")
          .then((t) => JSON.parse(t) as Report)
          .catch(() => null);
        if (current && same(current, report))
          console.log(`  baseline unchanged: ${path.relative(REPO, target)}`);
        else {
          await writeFile(target, `${JSON.stringify(report, null, 2)}\n`);
          console.log(`  wrote ${path.relative(REPO, target)}`);
        }
      }
      for (const p of problems) console.log(`  ${p}`);
    }
  }
  process.exitCode = failed ? 1 : 0;
}

async function check(args: string[]) {
  const dir = path.join(REPO, "apps/site/reports");
  const ids = args.filter((a) => !a.startsWith("--"));
  const baselines = ids.length
    ? ids.map((id) => `${id}.json`)
    : (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  let failed = false;
  for (const name of baselines) {
    const baseline = JSON.parse(
      await readFile(path.join(dir, name), "utf8"),
    ) as Report;
    const graded = await gradeComponent(baseline.component, REPO);
    const fresh =
      graded.find((g) => g.report.subject.file === baseline.subject.file)
        ?.report ?? graded[0].report;
    print(fresh);
    const problems = [...gate(fresh), ...drift(baseline, fresh)];
    if (problems.length) {
      failed = true;
      console.log(`  FAIL ${name}:`);
      for (const p of problems) console.log(`    ${p}`);
    } else if (!same(baseline, fresh))
      console.log(
        `  ok ${name} (the baseline is stale but nothing regressed; refresh it with: lacquer-grade ${baseline.component} --write)`,
      );
    else console.log(`  ok ${name}`);
  }
  process.exitCode = failed ? 1 : 0;
}

// pnpm forwards a literal `--` when a script is given one; it is not a command.
const [command, ...rest] = process.argv.slice(2).filter((a) => a !== "--");
switch (command) {
  case "tokens":
    await tokens(rest);
    break;
  case "check":
    await check(rest);
    break;
  case undefined:
  case "--help":
  case "-h":
    console.error(
      "usage: lacquer-grade <id>… [--write] [--json] | check [<id>…] | tokens [--json] [path…]",
    );
    process.exitCode = 2;
    break;
  default:
    await grade([command, ...rest]);
}
