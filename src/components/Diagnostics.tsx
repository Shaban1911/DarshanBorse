import { useEffect, useState } from "react";

/**
 * A small readout for checking a device in the field: open any page with
 * ?debug=1 and the corner shows which motion path the head script chose, what
 * the engine reports, and whether the scroll driver is running. Renders
 * nothing otherwise, and nothing on the server.
 */
export function Diagnostics() {
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    if (!/[?&]debug(=|&|$)/.test(location.search)) return;
    const read = () => {
      const d = document.documentElement.dataset;
      const slip = document.querySelector(".slip");
      const w = window as unknown as { __scrollMotion?: string };
      setLines([
        `motion ${d["motion"] ?? "(unset)"} · engine ${d["engine"] ?? "other"}`,
        `driver ${w.__scrollMotion ?? "not started"}`,
        `reduced motion ${matchMedia("(prefers-reduced-motion: reduce)").matches ? "ON" : "off"}`,
        `scroll-driven css ${CSS.supports("animation-timeline: view()") ? "yes" : "no"}`,
        `slips ${document.querySelectorAll(".slip").length}, first ${slip ? getComputedStyle(slip).display : "none"}`,
        `hydrated ${d["hydrated"] ?? "no"} · ${innerWidth}×${innerHeight} · dpr ${devicePixelRatio}`,
        navigator.userAgent.replace(/^Mozilla\/5\.0 /, "").slice(0, 90),
      ]);
    };
    read();
    const t = window.setInterval(read, 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!lines) return null;
  return (
    <pre
      style={{
        position: "fixed",
        left: 8,
        bottom: 8,
        zIndex: 1000,
        margin: 0,
        padding: "8px 10px",
        maxWidth: "calc(100vw - 16px)",
        whiteSpace: "pre-wrap",
        font: "11px/1.4 ui-monospace, Menlo, Consolas, monospace",
        color: "#f1eee8",
        background: "rgba(6, 18, 18, 0.9)",
        borderRadius: 6,
      }}
    >
      {lines.join("\n")}
    </pre>
  );
}
