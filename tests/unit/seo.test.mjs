import { describe, expect, it } from "vitest";
import { readSiteUrl, renderRobots, renderSitemap } from "../../scripts/seo.mjs";

describe("seo script", () => {
  it("reads siteUrl out of the config source", () => {
    expect(readSiteUrl('export const siteUrl = "https://example.in";')).toBe("https://example.in");
    expect(readSiteUrl('export const siteUrl = "";')).toBe("");
  });

  it("writes a plain robots file until the domain is known", () => {
    expect(renderRobots("")).toBe("User-agent: *\nAllow: /\n");
  });

  it("points robots at the sitemap once the domain is set", () => {
    expect(renderRobots("https://example.in")).toContain("Sitemap: https://example.in/sitemap.xml");
  });

  it("renders one absolute entry per page with the home page first", () => {
    const xml = renderSitemap("https://example.in", ["/", "/about"], "2026-09-26");
    expect(xml).toContain("<loc>https://example.in/</loc>");
    expect(xml).toContain("<loc>https://example.in/about</loc>");
    expect(xml.indexOf("example.in/</loc>")).toBeLessThan(xml.indexOf("/about</loc>"));
    expect(xml).toContain("<lastmod>2026-09-26</lastmod>");
    expect(xml.match(/<priority>1.0<\/priority>/g)).toHaveLength(1);
  });
});
