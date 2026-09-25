import { useEffect, useState } from "react";
import { introWords } from "@/lib/site";

/**
 * Opening sequence: words roll up through a masked line, one character at a
 * time, then the curtain lifts to reveal the page.
 *
 * ARCHITECTURE — everything visual is CSS, anchored to first paint.
 * All words are in the server HTML with staggered animation-delays; the lift
 * and the hero entrance are delayed CSS animations too. Nothing waits for
 * React. This matters because hydration on a 4G phone can trail first paint
 * by seconds, and a JS-timed sequence would sit half-played until it arrived
 * (which is exactly what the first version did).
 *
 * JS is responsible only for: skip (tap/scroll/key) and unmounting the
 * overlay once the sequence is over. The opening plays on every load.
 *
 * Decided BEFORE first paint by the inline script in __root.tsx:
 *   data-intro-seen    prefers-reduced-motion or ?intro=0 → no overlay,
 *                      hero animates immediately, scroll never locked
 *   data-intro-force   ?intro=1 → play even under reduced motion
 * Set by this component afterwards:
 *   data-intro-skipped skipped early → the words stop and the curtain parts
 *                      NOW; the hero rolls in behind it exactly as it would
 *                      have (the stylesheet swaps every entrance animation
 *                      for a restart variant with a zero offset)
 *   data-intro-done    curtain gone → overlay unmounted, scroll freed
 */

/**
 * The stylesheet owns the timing (src/styles/intro.css: --word-ms, --pause-ms,
 * --lift-ms); this component reads those tokens at runtime so there is one
 * source of truth. The defaults below only cover a missing stylesheet.
 *   word 2000ms · pause 650ms · curtain 1300ms  ->  ~8s to a settled hero.
 * Long enough that the skip must be discoverable: a progress hairline runs
 * the whole time and a "tap to skip" hint fades in after a second.
 */
const SKIP_GRACE_MS = 600;

/** Reads a <time> token. Minifiers rewrite "2000ms" as "2s", so both units are handled. */
function readMs(style: CSSStyleDeclaration, token: string, fallback: number): number {
  const raw = style.getPropertyValue(token).trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("ms") ? value : value * 1000;
}

/**
 * Stagger index per character. Punctuation shares the index of the letter
 * before it, so a trailing "." leaves with its word instead of lingering
 * alone for one stagger step after the last letter has gone.
 */
function staggered(word: string): Array<[string, number]> {
  let i = -1;
  return Array.from(word).map((char) => {
    if (/[\p{L}\p{N}]/u.test(char)) i += 1;
    return [char, Math.max(i, 0)];
  });
}

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset["introSeen"] === "1") {
      setDone(true);
      return;
    }

    // Anchor to first contentful paint, not to hydration.
    const fcp = performance
      .getEntriesByType("paint")
      .find((e) => e.name === "first-contentful-paint");
    const elapsed = performance.now() - (fcp?.startTime ?? 0);

    const tokens = getComputedStyle(root);
    const wordMs = readMs(tokens, "--word-ms", 2000);
    const pauseMs = readMs(tokens, "--pause-ms", 650);
    const liftMs = readMs(tokens, "--lift-ms", 1300);
    const totalMs = introWords.length * wordMs + pauseMs + liftMs;

    const timers: number[] = [];
    let finished = false;
    let skipped = false;

    // Skip = jump to the curtain. The overlay stays for one lift, then goes.
    const skip = () => {
      if (skipped || finished) return;
      skipped = true;
      root.dataset["introSkipped"] = "1";
      timers.forEach(window.clearTimeout);
      timers.push(window.setTimeout(finish, liftMs));
    };
    const unlisten = () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
    // Once the sequence is over the listeners must go with it: the component
    // stays mounted (it renders null), so a later tap would otherwise "skip"
    // again and restart every entrance on the page.
    const finish = () => {
      if (finished) return;
      finished = true;
      unlisten();
      root.dataset["introDone"] = "1";
      setDone(true);
    };
    timers.push(window.setTimeout(finish, Math.max(0, totalMs - elapsed)));

    // Grace period: without it, the tap that opened the page (or any stray
    // touch during load) dismisses the sequence before it is ever seen.
    timers.push(
      window.setTimeout(
        () => {
          window.addEventListener("pointerdown", skip);
          window.addEventListener("keydown", skip);
          window.addEventListener("wheel", skip, { passive: true });
          window.addEventListener("touchmove", skip, { passive: true });
        },
        Math.max(0, SKIP_GRACE_MS - elapsed),
      ),
    );

    return () => {
      timers.forEach(window.clearTimeout);
      unlisten();
    };
  }, []);

  if (done) return null;

  return (
    <div className="intro" role="presentation" aria-hidden="true">
      <div className="intro-stage">
        {introWords.map((word, k) => (
          <div className="intro-row" key={word} style={{ ["--k" as string]: k }}>
            <span className="intro-index">{String(k + 1).padStart(2, "0")}</span>
            <span className="intro-word">
              {staggered(word).map(([char, i], n) => (
                <span className="intro-char" key={n} style={{ ["--i" as string]: i }}>
                  <span>{char}</span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="intro-progress" />
      <p className="intro-hint">
        <span className="hint-touch">tap to skip</span>
        <span className="hint-pointer">click to skip</span>
      </p>
    </div>
  );
}
