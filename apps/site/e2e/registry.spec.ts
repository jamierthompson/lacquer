import { expect, test } from "@playwright/test";

test("the registry index is served", async ({ request }) => {
  const res = await request.get("/r/registry.json");
  expect(res.ok()).toBe(true);
  const registry = await res.json();
  expect(registry.name).toBe("lacquer");
  expect(Array.isArray(registry.items)).toBe(true);
});

test("the base item is served with its theme", async ({ request }) => {
  const res = await request.get("/r/base.json");
  expect(res.ok()).toBe(true);
  const base = await res.json();
  expect(base.type).toBe("registry:base");
  expect(base.extends).toBe("none");
  expect(base.cssVars.light["lq-color-bg-surface"]).toBeTruthy();
});

test("an unknown item is a 404", async ({ request }) => {
  const res = await request.get("/r/does-not-exist.json");
  expect(res.status()).toBe(404);
});
