// Publish the supplied VirtEngine social card as the canonical Open Graph image.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const artwork = `${root}public/brand/virtengine-social-card.png`;
const out = `${root}public/og.png`;

if (!existsSync(artwork)) {
  console.error(`og.mjs: missing ${artwork}`);
  process.exit(1);
}

await sharp(artwork)
  .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log("og.mjs: wrote public/og.png (1200x630) from the supplied VirtEngine card");
