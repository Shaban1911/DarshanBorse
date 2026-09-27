import { describe, expect, it } from "vitest";
import { cubicBezier, viewProgress } from "@/lib/scroll-motion";

/** The hand-run timelines must read the ranges the way the CSS spec does. */
describe("view timeline ranges", () => {
  const H = 1000;

  it("a short subject: entry runs until it is fully inside, contain until it starts leaving", () => {
    const h = 400;
    expect(viewProgress({ top: H, height: h }, H)).toEqual({ cover: 0, entry: 0, contain: 0 });
    expect(viewProgress({ top: H - h, height: h }, H).entry).toBe(1);
    expect(viewProgress({ top: H - h, height: h }, H).contain).toBe(0);
    expect(viewProgress({ top: 0, height: h }, H).contain).toBe(1);
    expect(viewProgress({ top: -h, height: h }, H).cover).toBe(1);
  });

  it("a tall subject (the plan stage): entry ends once it covers the viewport, contain spans the covering", () => {
    const h = 3300;
    expect(viewProgress({ top: 0, height: h }, H).entry).toBe(1);
    expect(viewProgress({ top: H / 2, height: h }, H).entry).toBeCloseTo(0.5);
    expect(viewProgress({ top: 0, height: h }, H).contain).toBe(0);
    expect(viewProgress({ top: -(h - H) / 2, height: h }, H).contain).toBeCloseTo(0.5);
    expect(viewProgress({ top: H - h, height: h }, H).contain).toBe(1);
  });
});

describe("easing", () => {
  const ease = cubicBezier(0.4, 0, 0.2, 1);
  it("is anchored at both ends and eases through the middle", () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    // fast out of the gate, settling gently: past the midpoint by halfway
    expect(ease(0.5)).toBeGreaterThan(0.7);
    expect(ease(0.5)).toBeLessThan(0.85);
    expect(ease(0.2)).toBeLessThan(0.2);
    expect(ease(0.8)).toBeGreaterThan(0.8);
  });
});
