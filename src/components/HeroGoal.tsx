import { useEffect, useRef, useState } from "react";

/**
 * The rotating half of the hero sentence: "A plan for" + one of these.
 *
 * Every word is in the server HTML, stacked in one grid cell, so the box is
 * sized to the widest word from first paint and nothing shifts when they
 * change. The first word rolls in with the rest of the hero — pure CSS,
 * anchored to first paint like the intro. JS only advances the index.
 *
 * Rotation starts when the first word's entrance has *finished* (we listen
 * for its animationend), or 600ms after the intro is skipped, so the visitor
 * always sees a settled word before it moves. Paused while the tab is
 * hidden; static under reduced motion.
 */
/** Exit (~780ms) + entrance (~1.3s) leave each word at rest for ~1.1s. */
const INTERVAL_MS = 3200;
const FALLBACK_START_MS = 12000;

function chars(word: string) {
  return Array.from(word).map((ch, n) => (
    <span
      className={`hero-char${/[.,]/.test(ch) ? " is-mark" : ""}`}
      key={n}
      style={{ ["--i" as string]: n }}
    >
      <span>{ch === " " ? " " : ch}</span>
    </span>
  ));
}

export function HeroGoal({ words }: { words: readonly string[] }) {
  const [state, setState] = useState({ current: 0, previous: -1, started: false });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;

    let timer = 0;
    let lead = 0;
    let started = false;
    const tick = () =>
      setState((s) => ({
        current: (s.current + 1) % words.length,
        previous: s.current,
        started: true,
      }));
    /** First change after `firstDelay`, then every INTERVAL_MS. Idempotent. */
    const start = (firstDelay: number) => {
      if (started) return;
      started = true;
      lead = window.setTimeout(() => {
        tick();
        sync();
      }, firstDelay);
    };

    // The entrance is CSS; its end is our cue. (Fires per character — start() is idempotent.)
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName.startsWith("word-roll")) start(INTERVAL_MS);
    };
    node.addEventListener("animationend", onEnd);

    // Hydration can trail first paint by seconds on a slow phone, so the
    // entrance may already be over by the time we're listening. Then the word
    // has been sitting there a while already: change it soon, not a full
    // interval from now. (A skipped intro restarts the entrance, so its
    // animationend still arrives.)
    const entranceRunning = node
      .getAnimations({ subtree: true })
      .some((a) => a.playState === "running");
    if (!entranceRunning) start(1200);

    const fallback = window.setTimeout(() => start(0), FALLBACK_START_MS);

    // Nobody is watching while the tab is hidden or the hero is scrolled
    // under the next section (it stays pinned beneath the page) — stop.
    let onScreen = true;
    const sync = () => {
      const shouldRun = started && !document.hidden && onScreen;
      if (!shouldRun && timer) {
        window.clearInterval(timer);
        timer = 0;
      } else if (shouldRun && !timer) timer = window.setInterval(tick, INTERVAL_MS);
    };
    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);
    const viewer = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      sync();
    });
    viewer.observe(node);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(lead);
      window.clearTimeout(fallback);
      viewer.disconnect();
      node.removeEventListener("animationend", onEnd);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [words]);

  return (
    <span className="hero-goal" ref={ref} aria-hidden="true">
      {words.map((word, n) => {
        const cls =
          n === state.current
            ? state.started
              ? "is-in"
              : "is-in is-first"
            : n === state.previous
              ? "is-out"
              : "";
        return (
          <span key={word} className={`hero-goal-word ${cls}`}>
            {chars(word)}
          </span>
        );
      })}
    </span>
  );
}
