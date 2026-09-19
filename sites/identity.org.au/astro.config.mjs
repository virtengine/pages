// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://identity.org.au",
  trailingSlash: "never",
  redirects: {
    "/governance": "/about/who-runs-it",
  },
  integrations: [
    sitemap({
      // The 404 page is a client-facing error page; keep it out of the sitemap.
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
});
