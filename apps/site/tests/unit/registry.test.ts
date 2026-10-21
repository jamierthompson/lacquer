import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

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
