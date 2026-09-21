"""Generate public/brand/ribbon-glass.webp — the card-surface texture.

Every white card on the site paints this image as a viewport-fixed
background, so the ribbon veil behind the page appears to show through
each card at the position it occupies on screen (see the "Ribbon glass"
block in src/styles/marketplace.css).

How it works: one resting frame of the homepage's fixed ribbon-veil
canvas is captured in Chromium, composited over white (what a slightly
translucent white card over the veil looks like), softened and dialled
back to a slight gradient, then saved as a small WebP.

Regenerate after changing the veil (RibbonField.astro) or the strength:

    pnpm --filter virtengine-com exec astro preview --port 4321   # in one shell
    python scripts/make-ribbon-glass.py                           # in another

The script expects http://localhost:4321 to serve the site.
"""

import base64
import os

from playwright.sync_api import sync_playwright
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "brand", "ribbon-glass.webp")

# 1.0 reproduces the raw veil over white; lower values make the effect more
# subtle. 0.32 reads as "slightly translucent" over the light sections.
STRENGTH = 0.32
BLUR = 7
WIDTH = 1600

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=2)
    page.goto("http://localhost:4321/", wait_until="networkidle")
    page.wait_for_timeout(2500)
    data = page.evaluate(
        """() => {
            const c = document.querySelector('.ribbon-veil--fixed canvas');
            return c ? c.toDataURL('image/png') : null;
        }"""
    )
    browser.close()

if not data:
    raise SystemExit("veil canvas not found — is the preview server running?")

veil_path = os.path.join(os.environ.get("TEMP", "/tmp"), "veil-raw.png")
with open(veil_path, "wb") as f:
    f.write(base64.b64decode(data.split(",", 1)[1]))

veil = Image.open(veil_path).convert("RGBA")
white = Image.new("RGBA", veil.size, (255, 255, 255, 255))
flat = Image.alpha_composite(white, veil).convert("RGB")
flat = flat.filter(ImageFilter.GaussianBlur(BLUR))
flat = Image.blend(Image.new("RGB", flat.size, (255, 255, 255)), flat, STRENGTH)

height = round(veil.size[1] * WIDTH / veil.size[0])
flat = flat.resize((WIDTH, height), Image.LANCZOS)
flat.save(OUT, "WEBP", quality=80, method=6)
print("saved", OUT, os.path.getsize(OUT), "bytes", flat.size)
