// Runs before every build. Writes robots.txt and sitemap.xml from the one
// address in src/lib/site.ts (siteUrl). Until the domain is set, the sitemap
// is skipped and robots stays plain — sitemaps must carry absolute URLs.
import { readFileSync, writeFileSync } from "node:fs";

const site = readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8");
const siteUrl = (site.match(/export const siteUrl = "([^"]*)"/) ?? [])[1] ?? "";
const pages = ["/", "/about"];
const today = new Date().toISOString().slice(0, 10);

let robots = "User-agent: *\nAllow: /\n";
if (siteUrl) {
  robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`;
  const urls = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${siteUrl}${p === "/" ? "/" : p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p === "/" ? "1.0" : "0.8"}</priority>\n  </url>`,
    )
    .join("\n");
  writeFileSync(
    new URL("../public/sitemap.xml", import.meta.url),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`seo: sitemap.xml for ${siteUrl}`);
} else {
  console.log("seo: siteUrl is empty — sitemap skipped (set it in src/lib/site.ts before launch)");
}
writeFileSync(new URL("../public/robots.txt", import.meta.url), robots);
