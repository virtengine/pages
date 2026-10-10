// Publish the optimized social card as JPEG for broad social crawler support.
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
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(out);

console.log("og.mjs: wrote public/og.jpg (1200x630)");
