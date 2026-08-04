// Rasterize the hand-drawn SVG social card to PNG (crawlers do not render SVG OG images).
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = `${root}public/og.svg`;
const out = `${root}public/og.png`;

if (!existsSync(src)) {
  console.error(`og.mjs: missing ${src}`);
  process.exit(1);
}

await sharp(src, { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log("og.mjs: wrote public/og.png (1200x630)");
