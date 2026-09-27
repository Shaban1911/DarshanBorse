import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * The page-level guarantees every deploy must keep: no console errors, no
 * failed requests, nothing scrolls sideways at any position, every image
 * paints, nothing meant to reveal stays hidden, and no serious accessibility
 * violations.
 */
const pages = [
  { path: "/?intro=0", title: /Darshan Borse — Financial Advisor/ },
  // the still version Safari and older engines get
  { path: "/?intro=0&static=1", title: /Darshan Borse — Financial Advisor/ },
  { path: "/about?intro=0", title: /About Darshan Borse/ },
];

async function scrollThrough(page: Page) {
  return page.evaluate(async () => {
    const de = document.documentElement;
    let maxWidth = 0;
    for (let y = 0; y <= de.scrollHeight; y += 250) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 30));
      maxWidth = Math.max(maxWidth, de.scrollWidth, document.body.scrollWidth);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    return { maxWidth, viewport: window.innerWidth };
  });
}

for (const { path, title } of pages) {
  test.describe(path, () => {
    test("loads cleanly and stays inside the viewport", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`console: ${m.text()}`);
      });
      page.on("requestfailed", (r) => errors.push(`request: ${r.url()} ${r.failure()?.errorText}`));

      await page.goto(path);
      await expect(page).toHaveTitle(title);
      await page.waitForFunction(() => document.documentElement.dataset["hydrated"] === "1");

      const { maxWidth, viewport } = await scrollThrough(page);
      expect(maxWidth, "horizontal overflow").toBeLessThanOrEqual(viewport);

      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
      );
      expect(broken).toEqual([]);

      // Reveals are driven by IntersectionObserver callbacks, which can lag a
      // fast scroll on a cold dev server; a second pass settles them.
      const hiddenReveals = () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll(".reveal-block")].filter(
              (b) => getComputedStyle(b).opacity === "0",
            ).length,
        );
      if ((await hiddenReveals()) > 0) await scrollThrough(page);
      expect(await hiddenReveals(), "reveal blocks left hidden after scrolling").toBe(0);

      expect(errors).toEqual([]);
    });

    test("has no serious accessibility violations", async ({ page }) => {
      await page.goto(path);
      await page.waitForFunction(() => document.documentElement.dataset["hydrated"] === "1");
      await scrollThrough(page);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  });
}

test("a wrong address answers 404 in the site's own words", async ({ page }) => {
  const response = await page.goto("/nothing-here");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("It isn't in the plan.");
  await expect(page.locator(".intro")).toHaveCount(0);
});
