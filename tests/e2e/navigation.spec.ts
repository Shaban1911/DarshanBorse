import { expect, test } from "@playwright/test";

/** The letterhead's three actions, and the opening sequence's skip. */

test("Contact on the home page glides to the ending", async ({ page }) => {
  await page.goto("/?intro=0");
  await page.waitForFunction(() => document.documentElement.dataset["hydrated"] === "1");
  await page.getByRole("link", { name: "Contact" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const reveal = document.querySelector(".reveal")!.getBoundingClientRect();
        return Math.abs(reveal.bottom - window.innerHeight) < 2;
      }),
    )
    .toBe(true);
  await expect(page.locator(".hello-title")).toBeVisible();
});

test("Contact from About plays the curtain home without a reload", async ({ page }) => {
  await page.goto("/about?intro=0");
  await page.waitForFunction(() => document.documentElement.dataset["hydrated"] === "1");
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  const marker = await page.evaluate(
    () => ((window as unknown as { __m?: number }).__m = Date.now()),
  );
  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  // the same document is still alive: no full page load happened
  expect(await page.evaluate(() => (window as unknown as { __m?: number }).__m)).toBe(marker);
  await expect(page.locator(".intro")).toHaveCount(0);
});

test("the opening sequence can be skipped to the curtain, and a later tap changes nothing", async ({
  page,
}) => {
  // Warm the dev server first: a cold first load can hydrate after the
  // sequence has already ended, and then there is nothing left to skip.
  await page.goto("/?intro=0");
  await page.waitForFunction(() => document.documentElement.dataset["hydrated"] === "1");
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await page.waitForFunction(() => document.documentElement.dataset["hydrated"] === "1");
  await page.waitForTimeout(800);
  // a tap on a touch device, a click elsewhere: both are documented skip paths
  const tap = async () => {
    if (await page.evaluate(() => "ontouchstart" in window)) await page.touchscreen.tap(10, 300);
    else await page.mouse.click(10, 300);
  };
  await tap();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset["introSkipped"]))
    .toBe("1");
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 5_000 });
  // A tap after the sequence must not restart the entrances: the hero's first
  // character animation keeps its age instead of starting over from zero.
  const age = () =>
    page.evaluate(() => {
      const span = document.querySelector<HTMLElement>(".hero-goal-word.is-in .hero-char > span");
      const anim = span?.getAnimations()[0];
      return anim ? Number(anim.currentTime) : -1;
    });
  await page.waitForTimeout(400);
  const before = await age();
  await tap();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.documentElement.dataset["introDone"])).toBe("1");
  expect(await age()).toBeGreaterThanOrEqual(before);
});
