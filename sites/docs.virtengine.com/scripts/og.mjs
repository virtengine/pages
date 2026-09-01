import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const icon = await sharp(join(root, 'public', 'brand', 'virtengine-icon.png'))
  .png()
  .toBuffer();

const card = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
        <path d="M72 0H0V72" fill="none" stroke="#dee3de" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="630" fill="#f7f8f7"/>
    <rect width="1200" height="630" fill="url(#grid)" opacity="0.72"/>
    <path d="M0 0H1200V10H0Z" fill="#60cc5d"/>
    <text x="86" y="224" font-family="Questrial, Century Gothic, Arial, sans-serif" font-size="74" fill="#575757">VirtEngine</text>
    <text x="90" y="276" font-family="Arial, sans-serif" font-size="20" letter-spacing="7" fill="#2b7d29">PROTOCOL DOCUMENTATION</text>
    <text x="90" y="370" font-family="Arial, sans-serif" font-size="28" fill="#575757">Open infrastructure markets, verifiable identity,</text>
    <text x="90" y="412" font-family="Arial, sans-serif" font-size="28" fill="#575757">provider operations, settlement, and development.</text>
    <text x="90" y="526" font-family="monospace" font-size="19" letter-spacing="2" fill="#6d736d">docs.virtengine.com</text>
    <path d="M1130 0H1200V70Z" fill="#eff8ee"/>
  </svg>
`);

await sharp(card)
  .composite([{ input: icon, left: 805, top: 134 }])
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'public', 'og.png'));

console.log('og.mjs: wrote public/og.png (1200x630)');
