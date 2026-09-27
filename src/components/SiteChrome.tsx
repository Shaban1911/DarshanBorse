import { useRouterState } from "@tanstack/react-router";
import { WipeLink, useWipe, contactOffset } from "@/components/PageWipe";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Cursor } from "@/components/Cursor";
import {
  phoneDisplay,
  phoneHref,
  whatsappUrl,
  email,
  instagramUrl,
  mapsUrl,
  legalName,
  practiceName,
  title,
  arn,
  registration,
  addressLine,
  cities,
  marketRiskDisclaimer,
  commissionDisclosure,
  irdaiLicensed,
  irdaiLabel,
  tradeNameNote,
  PLACEHOLDER_notFor,
} from "@/lib/site";

/**
 * There is no header. There is a letterhead: four fixed corners on the paper,
 * no bar, no border, no blur. Identity top-left, two words top-right, the one
 * action bottom-right. It never scrolls and never competes; over dark
 * sections (data-dark) it inverts.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [onDark, setOnDark] = useState(false);
  const [ctaDark, setCtaDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [ending, setEnding] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyNumber = () => {
    navigator.clipboard
      ?.writeText(phoneDisplay)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        /* clipboard blocked: the number is right there to select */
      });
  };
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const wipe = useWipe();
  const onHome = pathname === "/";
  // Contact lives on the home page. There: glide to it. Elsewhere: the curtain home, landing on it.
  const toContact = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (onHome) window.scrollTo({ top: contactOffset(), behavior: "smooth" });
    else wipe("/", contactOffset);
  };

  // Reset scroll on route CHANGE only — never on mount. Hydration trails first
  // paint on slow connections, and a visitor who has already started scrolling
  // must not be yanked back to the top when React arrives.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Hydrated: from here on, reveal blocks may hide until scrolled to. Runs
  // after every child effect (Reveal marks in-view blocks first).
  useEffect(() => {
    document.documentElement.dataset["hydrated"] = "1";
  }, []);

  useEffect(() => {
    let frame = 0;
    // Some phone browsers report the scroll on the document rather than the window.
    const readY = () =>
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let lastY = readY();
    const update = () => {
      frame = 0;
      const y = readY();
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(y / height, 1) : 0);
      const pastHero = y > window.innerHeight * 0.6;
      setCompact(pastHero);
      // Past the hero, content runs under the corners on a phone. Reading
      // down, the letterhead steps aside; the moment you scroll back up it
      // returns — the same manners as the phone's own toolbar. The action
      // in the bottom corner never leaves.
      if (Math.abs(y - lastY) > 4) {
        setTucked(pastHero && y > lastY);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchmove", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The letterhead lives in the top ~8% of the viewport. Watch that band for
  // dark sections and invert the type while one is underneath it.
  useEffect(() => {
    const sections = document.querySelectorAll("[data-dark]");
    if (!sections.length) {
      setOnDark(false);
      return;
    }
    const under = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) under.add(e.target);
          else under.delete(e.target);
        }
        setOnDark(under.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    // The pill lives in the bottom corner: it inverts on what is under IT,
    // not on what is under the letterhead at the top.
    const underCta = new Set<Element>();
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) underCta.add(e.target);
          else underCta.delete(e.target);
        }
        setCtaDark(underCta.size > 0);
      },
      { rootMargin: "-88% 0px 0px 0px", threshold: 0 },
    );
    sections.forEach((s) => ctaObserver.observe(s));
    return () => {
      observer.disconnect();
      ctaObserver.disconnect();
    };
  }, [pathname]);

  // The last screen is the WhatsApp action itself: the pill steps aside there.
  useEffect(() => {
    const end = document.getElementById("contact");
    if (!end) {
      setEnding(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([e]) => setEnding(!!e && e.intersectionRatio >= 0.5),
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="site">
      <Cursor />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <div
        className={`frame ${onDark ? "on-dark" : ""} ${ctaDark ? "cta-dark" : ""} ${compact ? "is-compact" : ""} ${tucked ? "is-tucked" : ""} ${ending ? "is-ending" : ""}`}
      >
        <WipeLink to="/" className="frame-id">
          <em>Hey, I'm</em>
          <strong>
            Darshan <span>Borse</span>
            <i className="frame-dot" title="Taking on new clients" />
          </strong>
          <small>
            {title}, {arn}
          </small>
        </WipeLink>
        <nav className="frame-nav" aria-label="Main navigation">
          {onHome ? <WipeLink to="/about">About</WipeLink> : <WipeLink to="/">Home</WipeLink>}
          <a href="/#contact" onClick={toContact}>
            Contact
          </a>
        </nav>
        <a
          className="frame-cta"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Message ${legalName} on WhatsApp`}
        >
          <MessageCircle /> <span>WhatsApp</span>
        </a>
      </div>

      <main id="main-content">{children}</main>

      {/* the footer is the letterhead's last line: who, where, how to reach him, and the record */}
      <footer className="site-footer" data-dark>
        <div className="footer-grid">
          <div>
            <strong>{legalName}</strong>
            <p>
              {title}, {practiceName}. Goal-based financial planning for Indian families anywhere in
              the world, including NRIs with wealth in India. Offices in {cities.join(" and ")}.
            </p>
            <address>
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                {addressLine}
              </a>
            </address>
          </div>
          <div>
            <a href={`tel:${phoneHref}`}>{phoneDisplay}</a>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <button
              type="button"
              onClick={copyNumber}
              data-copied={copied || undefined}
              aria-live="polite"
            >
              {copied ? "Copied" : "Copy the number"}
            </button>
          </div>
        </div>
        <div className="legal-block">
          <p className="legal-identity">
            {legalName}. {registration}, {arn}.{irdaiLicensed ? ` ${irdaiLabel}.` : ""}
          </p>
          <p>{tradeNameNote}</p>
          <p>{commissionDisclosure}</p>
          <p>I am not the right person if you want {PLACEHOLDER_notFor}.</p>
          <p>{marketRiskDisclaimer}</p>
        </div>
        <div className="legal-line">
          <span>
            © {new Date().getFullYear()} {legalName}, {cities.join(" and ")}
          </span>
          <a
            className="credit"
            href="https://www.linkedin.com/in/shahaban-mallick/"
            target="_blank"
            rel="noreferrer"
          >
            Site by Shahaban Mallick
          </a>
        </div>
      </footer>
    </div>
  );
}
