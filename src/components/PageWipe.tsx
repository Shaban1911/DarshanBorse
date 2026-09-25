import { Link, useRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

/**
 * Page transitions, in the site's own language. The intro opened with
 * curtains; the ending lifts the ink like one. A page change does the same:
 * a sheet rises from the bottom to cover the page (sand, then paper, a beat
 * apart), the route changes underneath, and the paper parts as two curtains
 * on the new page.
 *
 * Built from fixed panels and plain transforms with JS timing — no View
 * Transitions API — so it behaves identically in Safari, Chrome, Samsung
 * Internet and older Android. Reduced motion: instant change. Browser
 * back/forward cannot be intercepted, so those change instantly too.
 *
 * The timings below are the single source: they are passed to the stylesheet
 * as --wipe-cover and --wipe-reveal on the overlay.
 */
const COVER_MS = 480;
const SETTLE_MS = 80;
const REVEAL_MS = 760;

type Phase = "idle" | "cover" | "reveal";
/** Where to land after the route changes: a scroll offset, computed once the new page is laid out. */
type Landing = () => number;
const WipeContext = createContext<(to: string, landing?: Landing) => void>(() => {});

/** The contact section: on the home page it is the pinned ending beneath the conversation. */
export function contactOffset(): number {
  const reveal = document.querySelector(".reveal");
  if (reveal) return reveal.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
  const el = document.getElementById("contact");
  return el ? el.getBoundingClientRect().top + window.scrollY - 24 : 0;
}

export function useWipe() {
  return useContext(WipeContext);
}

export function PageWipe({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);

  const go = useCallback(
    async (to: string, landing?: Landing) => {
      if (busy.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Entrances on the next page are timed from the intro; on a navigation
      // there is no intro, so they must start at once.
      document.documentElement.dataset["nav"] = "1";
      if (reduce) {
        await router.navigate({ to });
        await wait(SETTLE_MS);
        window.scrollTo({ top: landing ? landing() : 0, behavior: "instant" });
        return;
      }
      busy.current = true;
      setPhase("cover");
      await wait(COVER_MS);
      await router.navigate({ to });
      window.scrollTo({ top: 0, behavior: "instant" });
      await wait(SETTLE_MS);
      if (landing) window.scrollTo({ top: landing(), behavior: "instant" });
      setPhase("reveal");
      await wait(REVEAL_MS);
      setPhase("idle");
      busy.current = false;
    },
    [router],
  );

  // A back/forward navigation still gets its entrances at once.
  useEffect(() => {
    return router.subscribe("onBeforeNavigate", () => {
      document.documentElement.dataset["nav"] = "1";
    });
  }, [router]);

  return (
    <WipeContext.Provider value={go}>
      {children}
      <div
        className={`wipe is-${phase}`}
        aria-hidden="true"
        style={{
          ["--wipe-cover" as string]: `${COVER_MS}ms`,
          ["--wipe-reveal" as string]: `${REVEAL_MS}ms`,
        }}
      >
        <div className="wipe-back" />
        <div className="wipe-left" />
        <div className="wipe-right" />
      </div>
    </WipeContext.Provider>
  );
}

type WipeLinkProps = {
  to: "/" | "/about";
  className?: string;
  "aria-label"?: string;
  activeProps?: { className?: string };
  children: ReactNode;
};

/** A router Link that plays the wipe. Modifier-clicks (new tab) are left alone. */
export function WipeLink({ to, children, ...rest }: WipeLinkProps) {
  const go = useContext(WipeContext);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void go(to);
  };
  return (
    <Link to={to} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
