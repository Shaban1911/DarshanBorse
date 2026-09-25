import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroGoal } from "@/components/HeroGoal";

const words = ["Retirement.", "Dream home.", "Marriage."] as const;

const current = (root: HTMLElement) =>
  [...root.querySelectorAll(".hero-goal-word")].map((w) =>
    w.className.replace("hero-goal-word", "").trim(),
  );

describe("HeroGoal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // jsdom has no IntersectionObserver; the component only pauses on it.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders every word in the server HTML with the first one entering", () => {
    const { container } = render(<HeroGoal words={words} />);
    const spans = container.querySelectorAll(".hero-goal-word");
    expect(spans).toHaveLength(3);
    expect(current(container)).toEqual(["is-in is-first", "", ""]);
    // the full stop is a mark, styled separately
    expect(container.querySelector(".hero-char.is-mark > span")?.textContent).toBe(".");
  });

  it("rotates on an interval once the entrance has settled, the leaving word rolling out", () => {
    const { container } = render(<HeroGoal words={words} />);
    // No running entrance in jsdom, so the first change comes after the short lead.
    act(() => vi.advanceTimersByTime(1200));
    expect(current(container)).toEqual(["is-out", "is-in", ""]);
    act(() => vi.advanceTimersByTime(3200));
    expect(current(container)).toEqual(["", "is-out", "is-in"]);
    act(() => vi.advanceTimersByTime(3200));
    expect(current(container)).toEqual(["is-in", "", "is-out"]);
  });

  it("does not rotate when the visitor prefers reduced motion", () => {
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes("reduce"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList) as typeof window.matchMedia;
    const { container } = render(<HeroGoal words={words} />);
    act(() => vi.advanceTimersByTime(20_000));
    expect(current(container)).toEqual(["is-in is-first", "", ""]);
  });
});
