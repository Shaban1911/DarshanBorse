import { useEffect, useRef } from "react";

/**
 * Custom cursor for pointer devices: a dot that tracks the pointer exactly and
 * a ring that follows with a little inertia, swelling over links and buttons.
 * Does nothing on touch devices, under reduced motion, or before JS runs — the
 * native cursor is only hidden once this has mounted (html.has-cursor).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const dot = el?.querySelector<HTMLElement>(".cursor-dot");
    const ring = el?.querySelector<HTMLElement>(".cursor-ring");
    if (!el || !dot || !ring) return;

    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      rx = x,
      ry = y,
      raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      const target =
        e.target instanceof Element ? e.target.closest("a, button, [role=button]") : null;
      el.classList.toggle("is-link", !!target);
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const hide = () => {
      el.style.opacity = "0";
    };
    const show = () => {
      el.style.opacity = "1";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor-ring" />
      <div className="cursor-dot" />
    </div>
  );
}
