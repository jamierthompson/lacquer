import { readFile } from "node:fs/promises";
import path from "node:path";
import bindings from "@lacquer/core/bindings.json" with { type: "json" };
import { describe, expect, it } from "vitest";
import { render } from "../../scripts/build-registry.ts";

const root = path.resolve(import.meta.dirname, "../..");
const read = async (file: string) =>
  JSON.parse(await readFile(path.join(root, file), "utf8"));

// The registry's shape: one file per catalog group under registry/lacquer,
// each listed in the root include, in the same groups the spec layer uses.
describe("registry.json", () => {
  it("includes one registry file per group", async () => {
    const registry = await read("registry.json");
    expect(registry.name).toBe("lacquer");
    expect(registry.include).toHaveLength(18);
    for (const file of registry.include) {
      expect(file).toMatch(/^registry\/lacquer\/[a-z-]+\/registry\.json$/);
      const group = await read(file);
      expect(Array.isArray(group.items)).toBe(true);
    }
  });
});

// The foundations group is the Lacquer theme: a registry:base item generated
// from the spec layer's bindings, so its values are the reference theme's.
describe("foundations/base", () => {
  it("is committed in its generated form", async () => {
    const committed = await readFile(
      path.join(root, "registry/lacquer/foundations/registry.json"),
      "utf8",
    );
    expect(committed).toBe(render());
  });

  it("is a standalone base carrying every token role", async () => {
    const { items } = await read("registry/lacquer/foundations/registry.json");
    const [base] = items;
    expect(base.name).toBe("base");
    expect(base.type).toBe("registry:base");
    expect(base.extends).toBe("none");
    const properties = Object.values(bindings.html.roles).map((r) =>
      r.var.replace(/^--/, ""),
    );
    expect(Object.keys(base.cssVars.light).sort()).toEqual(properties.sort());
    for (const key of Object.keys(base.cssVars.dark))
      expect(base.cssVars.light).toHaveProperty(key);
    // Every Tailwind theme variable aliases an --lq-* property, never a value.
    for (const value of Object.values<string>(base.cssVars.theme))
      expect(value).toMatch(/^var\(--lq-[a-z0-9-]+\)$/);
  });
});

// The message state machine ships as a lib item: the module with the table,
// the hook beside it (one target folder, so the relative import holds), and
// the skill the spec layer generates, copied into the chunk so the item's
// files live beside its registry.json.
describe("foundations/message-state-machine", () => {
  it("ships the module, the hook and the skill", async () => {
    const { items } = await read("registry/lacquer/foundations/registry.json");
    const item = items.find(
      (i: { name: string }) => i.name === "message-state-machine",
    );
    expect(item.type).toBe("registry:lib");
    expect(item.files.map((f: { type: string }) => f.type)).toEqual([
      "registry:lib",
      "registry:hook",
      "registry:file",
    ]);
    const targets = item.files.map((f: { target: string }) => f.target);
    expect(path.dirname(targets[0])).toBe(path.dirname(targets[1]));
    expect(targets[2]).toMatch(
      /^~\/\.claude\/skills\/lacquer-message-state-machine\/SKILL\.md$/,
    );
    for (const f of item.files)
      await expect(
        readFile(
          path.join(root, "registry/lacquer/foundations", f.path),
          "utf8",
        ),
      ).resolves.toBeTruthy();
  });

  it("carries the spec layer's generated skill unchanged", async () => {
    const shipped = await readFile(
      path.join(
        root,
        "registry/lacquer/foundations/message-state-machine/SKILL.md",
      ),
      "utf8",
    );
    const generated = await readFile(
      path.join(
        root,
        "../../packages/core/spec/catalog/ai/foundations/message-state-machine/SKILL.md",
      ),
      "utf8",
    );
    expect(shipped).toBe(generated);
    expect(shipped).toMatch(/^---\nname: lacquer-message-state-machine\n/);
  });
});
