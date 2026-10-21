#!/usr/bin/env node
/**
 * lacquer-grade: the Lacquer grader's command line.
 *
 *   lacquer-grade tokens [--json] [path…]
 *     LQ-TOKEN-01 over the registry source and the catalog's HTML examples
 *     (the defaults), or over the given files and folders. Exits 1 on any
 *     finding.
 *
 * The runtime checks (states, axe, every rule with a detect clause) and the
 * report writer land with the grader milestone; this is its first check.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadBindings } from "@lacquer/core";

import { checkTokens } from "./checks/tokens.ts";
import { formatFinding } from "./finding.ts";

const REPO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const DEFAULT_ROOTS = ["apps/site/registry", "packages/core/spec/catalog"];

async function tokens(args: string[]) {
  const json = args.includes("--json");
  const given = args.filter((a) => !a.startsWith("--"));
  const roots = (given.length ? given : DEFAULT_ROOTS).map((p) =>
    path.resolve(REPO, p),
  );
  const bindings = await loadBindings();
  const known = new Set(Object.values(bindings.html.roles).map((r) => r.var));
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

const [command, ...rest] = process.argv.slice(2);
switch (command) {
  case "tokens":
    await tokens(rest);
    break;
  default:
    console.error("usage: lacquer-grade tokens [--json] [path…]");
    process.exitCode = 2;
}
