// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://det.io",
  trailingSlash: "never",
  integrations: [
    sitemap({
      // The 404 page is a client-facing error page; keep it out of the sitemap.
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  vite: {
    // JSDoc cast avoids editor-only type collisions with sibling sites' vite copies.
    plugins: [/** @type {import("vite").PluginOption} */ (tailwindcss())],
  },
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
});
