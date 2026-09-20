"""Apply the brand halftone dot screen to media that arrived without it.

The site's photographic layer is a fixed treatment: green duotone + an optional
print halftone screen (DESIGN.md §12). The duotone is baked into the WebP files,
but a handful of assets were harvested with `halftone: false`. This script
re-screens those files in place so every photograph reads as one system.

Rules:
  * the screen is a 15 deg amplitude-modulated round-dot screen, cell ~ width/120
    (10 px at 1200 px, matching the existing screens);
  * ink is the brand screen green #153723, paper is #fafcf9;
  * dot coverage tracks luminance, so the mean tone of each image is preserved;
  * `network-earth` is the closing/footer image and is intentionally left alone.

Run:  python scripts/halftone-media.py
"""

from __future__ import annotations

import json
import math
import pathlib
import re

import numpy as np
from PIL import Image, ImageFilter

SITE = pathlib.Path(__file__).resolve().parents[1]
MEDIA = SITE / "public" / "media"
MANIFEST = MEDIA / "manifest.json"
MEDIA_TS = SITE / "src" / "data" / "media.ts"

INK = (21, 55, 35)          # #153723 — sampled from the existing screens
PAPER = (250, 252, 250)     # #fafcf9
ANGLE = 15.0                # degrees (DESIGN.md §12)
CELL_DIVISOR = 120.0        # 10 px cells at 1200 px wide
CELL_MIN, CELL_MAX = 8.0, 13.0
SOFTEN = 0.85               # anti-aliasing blur on the dot mask
# finer ruling for the infrastructure plates, which are shown small (the
# "kinds" band): smaller dots preserve the picture while staying retro
FINE_SLUGS = {
    "hero-infrastructure",
    "hpc-supercomputer",
    "marketplace-hardware",
    "provider-datacenter",
}
FINE_DIVISOR = 185.0
FINE_MIN = 4.5
FINE_SOFTEN = 0.55
QUALITY = 70
EXCLUDE = {"network-earth"}  # the closing band / footer image stays untouched


def _box9(a: np.ndarray) -> np.ndarray:
    p = np.pad(a, 1, mode="edge")
    return (
        p[:-2, :-2] + p[:-2, 1:-1] + p[:-2, 2:]
        + p[1:-1, :-2] + p[1:-1, 1:-1] + p[1:-1, 2:]
        + p[2:, :-2] + p[2:, 1:-1] + p[2:, 2:]
    ) / 9.0


def halftone(
    src_path: pathlib.Path,
    cell_divisor: float = CELL_DIVISOR,
    cell_min: float = CELL_MIN,
    soften: float = SOFTEN,
) -> None:
    im = Image.open(src_path).convert("RGB")
    width, height = im.size
    src = np.asarray(im).astype(np.float32)
    lum = (0.299 * src[:, :, 0] + 0.587 * src[:, :, 1] + 0.114 * src[:, :, 2]) / 255.0

    cell = min(CELL_MAX, max(cell_min, width / cell_divisor))
    theta = math.radians(ANGLE)
    ct, st = math.cos(theta), math.sin(theta)

    yy, xx = np.mgrid[0:height, 0:width].astype(np.float32)
    u = (xx * ct + yy * st) / cell
    v = (-xx * st + yy * ct) / cell
    iu = np.floor(u) + 0.5
    iv = np.floor(v) + 0.5

    # sample the continuous tone at each screen-cell centre
    xi = np.clip(np.round(cell * (ct * iu - st * iv)).astype(np.int32), 0, width - 1)
    yi = np.clip(np.round(cell * (st * iu + ct * iv)).astype(np.int32), 0, height - 1)
    local = _box9(lum)[yi, xi]

    paper_l = float(np.mean(PAPER)) / 255.0
    ink_l = float(np.mean(INK)) / 255.0
    coverage = np.clip((paper_l - local) / (paper_l - ink_l), 0.0, 1.0)

    dx = u - iu
    dy = v - iv
    rr = np.sqrt(dx * dx + dy * dy) / 0.70710678
    threshold = rr * rr * 1.576  # dot whose area equals `coverage`

    mask = (coverage > threshold).astype(np.uint8) * 255
    # soften the dot edges so the screen prints smoothly and compresses well
    mask = np.asarray(Image.fromarray(mask).filter(ImageFilter.GaussianBlur(soften)))
    alpha = (mask.astype(np.float32) / 255.0)[..., None]
    ink = np.array(INK, np.float32)[None, None, :]
    paper = np.array(PAPER, np.float32)[None, None, :]
    out = ink * alpha + paper * (1.0 - alpha)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(
        src_path, quality=QUALITY, method=6
    )


def variants(entry: dict) -> list[str]:
    srcset = entry.get("srcset") or [entry["file"] + " 1200w"]
    files = [s.split()[0] for s in srcset]
    if entry.get("file") not in files:
        files.append(entry["file"])
    return files


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    changed: list[str] = []

    for slug, entry in manifest.items():
        if entry.get("halftone") or slug in EXCLUDE:
            continue
        for rel in variants(entry):
            path = MEDIA / pathlib.Path(rel).name
            if not path.exists():
                print(f"  ! missing {path.name}")
                continue
            if slug in FINE_SLUGS:
                halftone(path, FINE_DIVISOR, FINE_MIN, FINE_SOFTEN)
            else:
                halftone(path)
        entry["halftone"] = True
        changed.append(slug)
        print(f"  screened {slug}")

    if changed:
        MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

        ts = MEDIA_TS.read_text(encoding="utf-8")
        for slug in changed:
            ts = re.sub(
                r'("' + re.escape(slug) + r'":\s*\{[^}]*?halftone:\s*)false',
                r"\1true",
                ts,
            )
        MEDIA_TS.write_text(ts, encoding="utf-8")

    print(f"done — {len(changed)} asset(s) screened: {', '.join(changed) or 'none'}")


if __name__ == "__main__":
    main()
