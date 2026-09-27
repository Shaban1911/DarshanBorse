// Pre-build step: writes public/robots.txt and, once `siteUrl` is set in
// src/lib/site.ts, public/sitemap.xml. Sitemaps must carry absolute URLs, so
// without a domain the sitemap is skipped and robots stays plain.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const PAGES = ["/", "/about"];

/** The files whose last commit dates a page: its route, the facts, and what every page shares. */
const SOURCES = {
  "/": ["src/routes/index.tsx", "src/components", "src/lib/site.ts", "src/styles"],
  "/about": ["src/routes/about.tsx", "src/components", "src/lib/site.ts", "src/styles"],
};

/** Last commit date (YYYY-MM-DD) touching any of the paths, or undefined without git. */
export function lastChanged(paths) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? out.slice(0, 10) : undefined;
  } catch {
    return undefined;
  }
}

/** Reads `siteUrl` out of the site config without importing TypeScript. */
export function readSiteUrl(siteSource) {
  return (siteSource.match(/export const siteUrl = "([^"]*)"/) ?? [])[1] ?? "";
}

export function renderRobots(siteUrl) {
  return "User-agent: *\nAllow: /\n" + (siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : "");
}

export function renderSitemap(
  siteUrl,
  pages = PAGES,
  today = new Date().toISOString().slice(0, 10),
  lastmod = {},
) {
  const urls = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${siteUrl}${p}</loc>\n    <lastmod>${lastmod[p] ?? today}</lastmod>\n` +
        `    <changefreq>monthly</changefreq>\n    <priority>${p === "/" ? "1.0" : "0.8"}</priority>\n` +
        `    <image:image>\n      <image:loc>${siteUrl}/og-image.jpg</image:loc>\n` +
        `      <image:title>Darshan Borse, financial advisor</image:title>\n    </image:image>\n  </url>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `${urls}\n</urlset>\n`
  );
}

function main() {
  const site = readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8");
  const siteUrl = readSiteUrl(site);
  writeFileSync(new URL("../public/robots.txt", import.meta.url), renderRobots(siteUrl));
  if (siteUrl) {
    const lastmod = Object.fromEntries(
      PAGES.map((p) => [p, lastChanged(SOURCES[p] ?? [])]).filter(([, d]) => d),
    );
    writeFileSync(
      new URL("../public/sitemap.xml", import.meta.url),
      renderSitemap(siteUrl, PAGES, undefined, lastmod),
    );
    console.log(`seo: sitemap.xml for ${siteUrl}`);
  } else {
    console.log(
      "seo: siteUrl is empty — sitemap skipped (set it in src/lib/site.ts before launch)",
    );
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
