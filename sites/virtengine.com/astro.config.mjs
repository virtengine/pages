// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://virtengine.com",
  trailingSlash: "never",
  integrations: [
    sitemap({
      // Keep noindex / non-canonical routes out of the sitemap entirely: the
      // sitemap should list only pages we want indexed.
      filter: (page) => !/\/(404|blog\/archive\/page\/\d+)\/?$/.test(page),
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
