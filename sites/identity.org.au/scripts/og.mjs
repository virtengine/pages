// Build the social card from the supplied identity.org.au logo.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = `${root}public/brand/logo.png`;
const out = `${root}public/og.png`;

if (!existsSync(src)) {
  console.error(`og.mjs: missing ${src}`);
  process.exit(1);
}

const logo = await sharp(src).resize({ width: 940, withoutEnlargement: true }).png().toBuffer();
const card = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#fbf8f5"/>
    <rect y="0" width="1200" height="16" fill="#28205b"/>
    <text x="130" y="455" fill="#28205b" font-family="Public Sans, Arial, sans-serif" font-size="34" font-weight="600">The Identity Wallet for the VirtEngine ecosystem</text>
  </svg>
`);

await sharp(card)
  .composite([{ input: logo, left: 130, top: 165 }])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log("og.mjs: wrote public/og.png (1200x630)");
