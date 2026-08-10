// Build the social card around the untouched official raster lockup.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const logo = `${root}public/brand/virtengine-original.png`;
const out = `${root}public/og.png`;

if (!existsSync(logo)) {
  console.error(`og.mjs: missing ${logo}`);
  process.exit(1);
}

const grid = Array.from({ length: 17 }, (_, i) => {
  const x = i * 72;
  return `<path d="M${x} 0V630"/>`;
}).join("");
const rows = Array.from({ length: 9 }, (_, i) => {
  const y = i * 72;
  return `<path d="M0 ${y}H1200"/>`;
}).join("");

const card =
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f7f8f7"/>
  <g fill="none" stroke="#dee3de" stroke-width="1">${grid}${rows}</g>
  <rect width="1200" height="10" fill="#60cc5d"/>
  <text x="96" y="450" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="40" fill="#262b26">The decentralized cloud marketplace protocol</text>
  <text x="96" y="510" font-family="Segoe UI,Arial,sans-serif" font-size="27" fill="#575757">On-chain compute leasing · VEID identity · escrow &amp; settlement · Apache 2.0</text>
  <path d="M96 566H1104" stroke="#c2cac2"/>
  <text x="96" y="602" font-family="Consolas,monospace" font-size="22" fill="#2b7d29">virtengine.com</text>
  <text x="1104" y="602" text-anchor="end" font-family="Consolas,monospace" font-size="22" fill="#7c827c">CometBFT · Cosmos SDK · AU2024203136B2</text>
</svg>`);

const officialLockup = await sharp(logo)
  .resize({ width: 800 })
  .png()
  .toBuffer();

await sharp(card)
  .composite([{ input: officialLockup, left: 96, top: 120 }])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log("og.mjs: wrote public/og.png (1200x630)");
