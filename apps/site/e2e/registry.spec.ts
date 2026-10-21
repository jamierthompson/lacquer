import { expect, test } from "@playwright/test";

test("the registry index is served", async ({ request }) => {
  const res = await request.get("/r/registry.json");
  expect(res.ok()).toBe(true);
  const registry = await res.json();
  expect(registry.name).toBe("lacquer");
  expect(Array.isArray(registry.items)).toBe(true);
});

test("an unknown item is a 404", async ({ request }) => {
  const res = await request.get("/r/does-not-exist.json");
  expect(res.status()).toBe(404);
});
