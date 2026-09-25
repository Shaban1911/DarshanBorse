import { describe, expect, it } from "vitest";
import {
  heroGoals,
  introWords,
  phoneDisplay,
  phoneHref,
  siteUrl,
  whatsappUrl,
  cities,
  arn,
} from "@/lib/site";

/**
 * The site config is copy and facts. These tests pin the constraints the
 * layout depends on, so a copy edit cannot silently break the hero.
 */
describe("site config", () => {
  it("keeps every hero goal to one line on a 360px phone", () => {
    for (const goal of heroGoals) {
      expect(goal.length, goal).toBeLessThanOrEqual(12);
      expect(goal.endsWith(".")).toBe(true);
    }
  });

  it("keeps the intro words short enough for the opening type size", () => {
    for (const word of introWords) {
      expect(word.length, word).toBeLessThanOrEqual(13);
      expect(word.endsWith(".")).toBe(true);
    }
    expect(introWords).toHaveLength(3);
  });

  it("uses one phone number in E.164 for links and a spaced form for display", () => {
    expect(phoneHref).toMatch(/^\+91\d{10}$/);
    expect(phoneDisplay.replace(/\s/g, "")).toBe(phoneHref);
  });

  it("pre-fills the WhatsApp message and encodes it", () => {
    const url = new URL(whatsappUrl);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe(`/${phoneHref.replace("+", "")}`);
    expect(url.searchParams.get("text")).toMatch(/^Hi Darshan/);
  });

  it("stores the live origin without a trailing slash", () => {
    expect(siteUrl.endsWith("/")).toBe(false);
  });

  it("names the offices, and the registration is an ARN", () => {
    expect(cities).toEqual(["Dhule", "Pune"]);
    expect(arn).toMatch(/^ARN-\d+$/);
  });
});
