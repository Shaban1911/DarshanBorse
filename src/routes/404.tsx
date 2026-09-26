import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/NotFound";

/**
 * The 404 page as an addressable route, rendered to 404.html at build time so
 * static hosts serve it, with a real 404 status, for any unknown address. It
 * moves such an address to /404 before hydration so the page hydrates exactly
 * as it was rendered. Kept out of search.
 */
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [{ title: "Not found — Darshan Borse" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <NotFound moveAddress />,
});
