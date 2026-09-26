// Renders share.html to public/og-image.jpg (1200×630) with the site's own
// fonts. Run:  node brand/share.mjs   (uses the Chrome that Playwright's e2e
// tests use; pass --chromium to use the bundled browser instead.)
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const useBundled = process.argv.includes("--chromium");
const browser = await chromium.launch(useBundled ? {} : { channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "share.html")).href);
await page.evaluate(() => document.fonts.ready);
const out = path.join(here, "..", "public", "og-image.jpg");
await page.screenshot({ path: out, type: "jpeg", quality: 90 });
await browser.close();
console.log("wrote", out);
