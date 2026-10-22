import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { AXE_TAGS } from "./axe-tags";

const PAGES: Record<string, string | RegExp> = {
  "/": /finishing school/,
  "/docs": "Lacquer",
  "/foundations": "Foundations",
  "/foundations/color": "Color",
  "/foundations/stop-regenerate-always": /Stop and regenerate/,
};

for (const [url, heading] of Object.entries(PAGES)) {
  test(`${url} renders and passes axe`, async ({ page }) => {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });
}
