import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

/**
 * Build configuration.
 *
 * - TanStack Start provides file-based routing and SSR; the server entry is
 *   `src/server.ts`, which wraps the framework handler with a friendly 500.
 * - On `vite build`, Nitro packages the app as a Cloudflare Worker (module
 *   syntax, Node compatibility on) and emits the deploy config next to it.
 * - The dev server listens on all interfaces at :8080.
 */
export default defineConfig(({ command }) => ({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  css: { transformer: "lightningcss" },
  server: { host: "::", port: 8080 },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    ...(command === "build"
      ? [
          nitro({
            preset: "cloudflare-module",
            cloudflare: { nodeCompat: true, deployConfig: true },
          }),
        ]
      : []),
    viteReact(),
  ],
}));
