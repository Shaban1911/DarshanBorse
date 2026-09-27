import { describe, expect, it } from "vitest";
import { pageMeta, pages, structuredData } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

describe("titles and descriptions", () => {
  for (const [key, page] of Object.entries(pages)) {
    it(`${key}: fit a search result whole`, () => {
      expect(page.title.length).toBeLessThanOrEqual(60);
      expect(page.description.length).toBeLessThanOrEqual(165);
      expect(page.description.endsWith(".")).toBe(true);
    });
  }
  it("says where and what on the home page", () => {
    for (const word of ["Financial advisor", "Dhule", "Pune", "mutual fund", "SIP", "NRI"]) {
      expect(pages.home.description).toContain(word);
    }
  });
  it("produces the shared head entries with an absolute share image", () => {
    const meta = pageMeta("home");
    const og = meta.find((m) => "property" in m && m.property === "og:image");
    expect(og && "content" in og && og.content.startsWith("https://")).toBe(true);
    expect(meta.some((m) => "name" in m && m.name === "robots")).toBe(true);
  });
});

describe("structured data", () => {
  for (const key of ["home", "about"] as const) {
    it(`${key}: is valid JSON with the practice, the person and the website`, () => {
      const data = JSON.parse(structuredData(key)) as { "@graph": Array<Record<string, unknown>> };
      const types = data["@graph"].map((n) => n["@type"]).flat();
      expect(types).toContain("FinancialService");
      expect(types).toContain("Person");
      expect(types).toContain("WebSite");
      expect(types).toContain("WebPage");
      expect(structuredData(key)).not.toContain("undefined");
      expect(structuredData(key)).not.toContain("PLACEHOLDER");
    });
  }
  it("about: carries a breadcrumb back home", () => {
    expect(structuredData("about")).toContain("BreadcrumbList");
    expect(structuredData("about")).toContain(`${siteUrl}/about`);
  });
});
