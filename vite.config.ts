import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

/**
 * Build configuration.
 *
 * - TanStack Start provides file-based routing and rendering.
 * - `vite build` pre-renders every page to static HTML in dist/client, which
 *   is the whole deployable. There is no server at runtime.
 * - The dev server listens on all interfaces at :8080.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  css: { transformer: "lightningcss" },
  server: { host: "::", port: 8080 },
  plugins: [
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // The site is static: every page is rendered to HTML at build time and
      // only dist/client is deployed. The server bundle in dist/server is the
      // vehicle the prerenderer runs, nothing more. Pages are written as
      // about.html rather than about/index.html so the address stays /about.
      // The /404 route renders to 404.html; static hosts serve it for any
      // unknown address with a real 404 status. Before hydration the head
      // script moves the address to /404 so the page hydrates as rendered.
      prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: false, failOnError: true },
      pages: [{ path: "/" }, { path: "/about" }, { path: "/404" }],
    }),
    viteReact(),
  ],
});
