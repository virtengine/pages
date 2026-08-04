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
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
});
