/**
 * LQ-TOKEN-02, static: an implementation consumes only the roles its spec
 * declares under `tokens.consumes` (or roles the entries it reuses define).
 * The implementation's stylesheets are scanned for `--lq-*` references,
 * mapped back to roles through the html binding, and diffed against the
 * spec. A property scoped to the component (`--lq-<id>-…`) is a parameter,
 * not a role.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Bindings, CatalogComponent } from "@lacquer/core";
import type { Finding } from "../finding.ts";

export const RULE = "LQ-TOKEN-02";

/** `--lq-color-bg-primary` -> `color.bg.primary`, from the compiled binding. */
export function roleByProperty(bindings: Bindings): Map<string, string> {
  return new Map(
    Object.entries(bindings.html.roles).map(([role, r]) => [r.var, role]),
  );
}

export async function checkRoles(
  spec: CatalogComponent,
  styles: string[],
  bindings: Bindings,
  relativeTo: string,
): Promise<Finding[]> {
  const byProperty = roleByProperty(bindings);
  const declared = new Set(spec.tokens?.consumes ?? []);
  const undeclared = new Map<string, string>();
  for (const file of styles) {
    const css = await readFile(file, "utf8");
    for (const m of css.matchAll(/--lq-[a-z0-9-]+/g)) {
      const property = m[0];
      if (property.startsWith(`--lq-${spec.id}-`)) continue;
      const role = byProperty.get(property);
      if (!role) continue; // LQ-TOKEN-01's business
      if (!declared.has(role))
        undeclared.set(role, path.relative(relativeTo, file));
    }
  }
  if (!undeclared.size) return [];
  const roles = [...undeclared.keys()].sort();
  return [
    {
      rule: RULE,
      component: spec.id,
      message: `The implementation reads ${roles.length} role${roles.length === 1 ? "" : "s"} the spec does not declare under tokens.consumes.`,
      location: { file: [...new Set(undeclared.values())].join(", ") },
      evidence: roles.join(", "),
      instances: roles.length,
    },
  ];
}
