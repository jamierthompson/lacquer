import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { AXE_TAGS } from "./axe-tags";

for (const url of ["/", "/docs"]) {
  test(`${url} renders and passes axe`, async ({ page }) => {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lacquer");
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });
}
