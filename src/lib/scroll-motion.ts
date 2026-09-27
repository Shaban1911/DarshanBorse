/**
 * The scroll choreography, driven from JavaScript.
 *
 * The stylesheet describes every scroll-driven moment with native
 * scroll-driven animations (`animation-timeline`, `animation-range`). Where
 * the engine lacks them, or has them but paints them wrongly (WebKit, see
 * __root.tsx), the head script sets `data-motion="js"` and this runs the same
 * timelines by hand: it measures the subject elements on every frame the page
 * scrolls, turns each named range into a 0–1 progress with the same easing,
 * and writes it to a custom property the stylesheet maps to the same
 * transform or opacity. The two paths must stay in step: the ranges here are
 * the `animation-range` values in plan.css, recognition.css and hero.css.
 *
 * Costs almost nothing: a few getBoundingClientRect calls and ~30 property
 * writes per scrolled frame, only while the sections are near the viewport.
 */

type Range = readonly [start: number, end: number];

/** contain 3% + n·2.2% → contain 22% + n·2.2% (plan.css) */
const SLIP_GATHER = (n: number): Range => [0.03 + n * 0.022, 0.22 + n * 0.022];
const SLIP_FADE: Range = [0.43, 0.49];
const SHEET_GROW: Range = [0.45, 0.58];
const LINE_RISE = (n: number): Range => [0.57 + n * 0.06, 0.63 + n * 0.06];
const PEN_LINE = (n: number): Range => [0.62 + n * 0.06, 0.67 + n * 0.06];
const SIGN_RISE: Range = [0.83, 0.88];
const HEADING_RISE: Range = [0.55, 1]; // entry
const THREAD_DRAW: Range = [0.06, 0.72]; // cover
const THREAD_DOT: Range = [0.68, 0.76]; // cover

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const within = (p: number, [a, b]: Range) => clamp01((p - a) / (b - a));

/** cubic-bezier(0.4, 0, 0.2, 1), the easing the gathering slips and the sheet use. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 1 - 3 * x2 + 3 * x1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 1 - 3 * y2 + 3 * y1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const s = slopeX(t);
      if (Math.abs(s) < 1e-6) break;
      t -= dx / s;
    }
    return sampleY(clamp01(t));
  };
}
const easeGather = cubicBezier(0.4, 0, 0.2, 1);

/**
 * View-timeline progress for a subject, per the CSS ranges:
 *   cover   0 when the subject's top reaches the viewport bottom, 1 when its bottom leaves the top;
 *   entry   0 at that same start, 1 once the subject is fully inside;
 *   contain from fully inside (or fully covering, when taller than the viewport) to leaving that state.
 */
export function viewProgress(rect: { top: number; height: number }, viewport: number) {
  const top = rect.top;
  const height = rect.height;
  const cover = clamp01((viewport - top) / (viewport + height));
  // entry ends when the subject is fully inside, or fully covers the viewport, whichever comes first
  const entry = clamp01((viewport - top) / Math.min(height, viewport));
  const containStart = Math.max(viewport - height, 0);
  const containEnd = Math.min(viewport - height, 0);
  const span = containStart - containEnd || 1;
  const contain = clamp01((containStart - top) / span);
  return { cover, entry, contain };
}

function indexOf(el: HTMLElement): number {
  const n = parseFloat(el.style.getPropertyValue("--n"));
  return Number.isFinite(n) ? n : 0;
}

/** Writes a custom property only when its value changed, so idle frames cost nothing. */
class Vars {
  private last = new Map<HTMLElement, Map<string, string>>();
  set(el: HTMLElement, name: string, value: number) {
    const text = value.toFixed(4);
    let store = this.last.get(el);
    if (!store) this.last.set(el, (store = new Map()));
    if (store.get(name) === text) return;
    store.set(name, text);
    el.style.setProperty(name, text);
  }
}

/** Starts the driver on the current page. Returns the function that stops it. */
export function startScrollMotion(): () => void {
  const root = document.documentElement;
  const vars = new Vars();

  const gather = document.querySelector<HTMLElement>(".gather");
  const heading = gather?.querySelector<HTMLElement>(".gather-heading") ?? null;
  const slips = gather ? Array.from(gather.querySelectorAll<HTMLElement>(".slip")) : [];
  const sheet = gather?.querySelector<HTMLElement>(".plan-sheet") ?? null;
  const lines = gather ? Array.from(gather.querySelectorAll<HTMLElement>(".plan-line")) : [];
  const pens = lines.map((line) => Array.from(line.querySelectorAll<HTMLElement>("b")));
  const sign = gather?.querySelector<HTMLElement>(".plan-sign") ?? null;
  const thread = document.querySelector<HTMLElement>(".thread");

  let frame = 0;
  const update = () => {
    frame = 0;
    const viewport = window.innerHeight;

    // the hero: scroll(root) over the first viewport
    vars.set(root, "--sy", clamp01((window.scrollY || root.scrollTop || 0) / viewport));

    if (gather) {
      const rect = gather.getBoundingClientRect();
      // skip the work while the stage is far away
      if (rect.bottom > -viewport && rect.top < viewport * 2) {
        const { entry, contain } = viewProgress(rect, viewport);
        if (heading) vars.set(heading, "--t", within(entry, HEADING_RISE));
        slips.forEach((slip) => {
          const n = indexOf(slip);
          vars.set(slip, "--t", easeGather(within(contain, SLIP_GATHER(n))));
          vars.set(slip, "--f", within(contain, SLIP_FADE));
        });
        if (sheet) vars.set(sheet, "--t", easeGather(within(contain, SHEET_GROW)));
        lines.forEach((line, i) => {
          const n = indexOf(line);
          vars.set(line, "--t", within(contain, LINE_RISE(n)));
          const pen = within(contain, PEN_LINE(n));
          pens[i]?.forEach((b) => vars.set(b, "--p", pen));
        });
        if (sign) vars.set(sign, "--t", within(contain, SIGN_RISE));
      }
    }

    if (thread) {
      const rect = thread.getBoundingClientRect();
      if (rect.bottom > -viewport && rect.top < viewport * 2) {
        const { cover } = viewProgress(rect, viewport);
        vars.set(thread, "--draw", within(cover, THREAD_DRAW));
        vars.set(thread, "--dot", within(cover, THREAD_DOT));
      }
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  // fonts and images settle the layout after first paint
  window.addEventListener("load", schedule);
  const settle = window.setTimeout(schedule, 600);

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("load", schedule);
    window.clearTimeout(settle);
    if (frame) cancelAnimationFrame(frame);
  };
}

/** Whether this page should run the driver: the head script chose the JS path and motion is wanted. */
export function wantsScrollMotion(): boolean {
  if (typeof document === "undefined") return false;
  const d = document.documentElement.dataset;
  if (d["motion"] !== "js") return false;
  if (d["introForce"]) return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
