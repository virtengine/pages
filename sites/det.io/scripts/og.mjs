// Publish the optimized social card as JPEG for broad social crawler support. q50 + 4:2:0 is
// visually clean for this flat line art and ~57% smaller than q90 (161 KB -> ~70 KB); the perf
// ledger counts og.jpg as the site's largest asset.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = `${root}assets/social-card.jpg`;
const out = `${root}public/og.jpg`;

if (!existsSync(src)) {
  console.error(`og.mjs: missing ${src}`);
  process.exit(1);
}

await sharp(src)
  .resize(1200, 630, { fit: "contain", background: "#fffaf1" })
  .jpeg({ quality: 50, mozjpeg: true, chromaSubsampling: "4:2:0" })
  .toFile(out);

console.log("og.mjs: wrote public/og.jpg (1200x630)");
