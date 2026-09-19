"""Harvest CC0 photography for identity.org.au and render it through the brand
treatment (duotone + optional halftone screen), writing WebP variants and a
provenance manifest.

Sources: Openverse API (api.openverse.org), filtered to `license=cc0,pdm`.
Every asset is public domain / CC0; provenance is recorded in the manifest and
surfaced on /media-credits. Nobody in a photograph is presented as a customer:
these are documentary images of documents, devices, rooms and objects.

Run:
    python scripts/media-harvest.py                 # harvest everything missing
    python scripts/media-harvest.py --force         # re-download and re-render all
    python scripts/media-harvest.py --slug padlock  # one asset
"""

from __future__ import annotations

import argparse
import html
import json
import math
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

import numpy as np
from PIL import Image, ImageFilter

SITE = pathlib.Path(__file__).resolve().parents[1]
MEDIA = SITE / "public" / "media"
SOURCES_DIR = SITE / "media-source"  # working masters; never shipped
MANIFEST = MEDIA / "manifest.json"

API = "https://api.openverse.org/v1/images/"
UA = "identity.org.au media harvest/1.0 (https://identity.org.au; hello@det.io)"
REQUEST_PAUSE = 1.5  # polite spacing between search calls (Wikimedia/Openverse)

# ---------------------------------------------------------------- treatment --
# Duotone gradient maps in the identity palette (DESIGN.md, colours).
DUOTONE = {
    # shadow -> mid -> light; document/photographic layer on paper surfaces
    "paper": ((20, 36, 51), (91, 131, 168), (247, 250, 252)),
    # deeper version for night bands (footer, trusted-processing feature)
    "night": ((11, 20, 29), (63, 107, 145), (207, 227, 242)),
}
HALFTONE_INK = (22, 41, 60)
HALFTONE_PAPER = (247, 250, 252)
HALFTONE_ANGLE = 15.0
HALFTONE_CELL_DIVISOR = 120.0
HALFTONE_CELL_MIN, HALFTONE_CELL_MAX = 8.0, 13.0
WEBP_QUALITY = 78


def box9(array: np.ndarray) -> np.ndarray:
    padded = np.pad(array, 1, mode="edge")
    return (
        padded[:-2, :-2] + padded[:-2, 1:-1] + padded[:-2, 2:]
        + padded[1:-1, :-2] + padded[1:-1, 1:-1] + padded[1:-1, 2:]
        + padded[2:, :-2] + padded[2:, 1:-1] + padded[2:, 2:]
    ) / 9.0


def duotone(image: Image.Image, kind: str) -> Image.Image:
    """Map luminance through a three-point brand gradient."""
    shadow, mid, light = DUOTONE[kind]
    grey = np.asarray(image.convert("L")).astype(np.float32) / 255.0
    stops = np.array([0.0, 0.5, 1.0], np.float32)
    channels = []
    for index in range(3):
        values = np.array([shadow[index], mid[index], light[index]], np.float32)
        channels.append(np.interp(grey, stops, values))
    return Image.fromarray(np.stack(channels, axis=-1).astype(np.uint8))


def halftone(image: Image.Image) -> Image.Image:
    """Amplitude-modulated round-dot screen (15 degrees), tone-preserving."""
    src = np.asarray(image.convert("RGB")).astype(np.float32)
    height, width = src.shape[:2]
    lum = (0.299 * src[:, :, 0] + 0.587 * src[:, :, 1] + 0.114 * src[:, :, 2]) / 255.0

    cell = min(HALFTONE_CELL_MAX, max(HALFTONE_CELL_MIN, width / HALFTONE_CELL_DIVISOR))
    theta = math.radians(HALFTONE_ANGLE)
    ct, st = math.cos(theta), math.sin(theta)

    yy, xx = np.mgrid[0:height, 0:width].astype(np.float32)
    u = (xx * ct + yy * st) / cell
    v = (-xx * st + yy * ct) / cell
    iu = np.floor(u) + 0.5
    iv = np.floor(v) + 0.5

    xi = np.clip(np.round(cell * (ct * iu - st * iv)).astype(np.int32), 0, width - 1)
    yi = np.clip(np.round(cell * (st * iu + ct * iv)).astype(np.int32), 0, height - 1)
    local = box9(lum)[yi, xi]

    paper_l = float(np.mean(HALFTONE_PAPER)) / 255.0
    ink_l = float(np.mean(HALFTONE_INK)) / 255.0
    coverage = np.clip((paper_l - local) / (paper_l - ink_l), 0.0, 1.0)

    dx = u - iu
    dy = v - iv
    radius = np.sqrt(dx * dx + dy * dy) / 0.70710678
    threshold = radius * radius * 1.576

    mask = (coverage > threshold).astype(np.uint8) * 255
    mask = np.asarray(Image.fromarray(mask).filter(ImageFilter.GaussianBlur(0.85)))
    alpha = (mask.astype(np.float32) / 255.0)[..., None]
    ink = np.array(HALFTONE_INK, np.float32)[None, None, :]
    paper = np.array(HALFTONE_PAPER, np.float32)[None, None, :]
    out = ink * alpha + paper * (1.0 - alpha)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


# ------------------------------------------------------------------ sources --
# slug: guidance query; aspect: width/height crop; widths: exported variants.
SOURCES: list[dict] = [
    {
        "slug": "wallet-in-hand",
        "query": "hand holding smartphone Unsplash",
        "prefer": r"hand holding",
        "pick": "Hand holding (Unsplash)",
        "kind": "paper",
        "halftone": False,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "A hand holding a smartphone.",
    },
    {
        "slug": "document-desk",
        "query": "passport documents desk",
        "pick": "Passport documents desk (Unsplash)",
        "kind": "paper",
        "halftone": False,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "A passport and identity papers on a desk.",
    },
    {
        "slug": "identity-liveness",
        "query": "selfie Unsplash",
        "pick": "The Selfie (Unsplash)",
        "kind": "paper",
        "halftone": False,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "A person holding a phone at arm's length to photograph themselves.",
    },
    {
        "slug": "identity-portrait",
        "query": "close up portrait man Unsplash",
        "pick": "Curly hair and freckles man (Unsplash)",
        "crop_bias": 0.2,
        "kind": "paper",
        "halftone": False,
        "aspect": 0.8,
        "widths": [720, 1100],
        "alt": "A close portrait of a person's face.",
    },
    {
        "slug": "vault-door",
        "query": "safe deposit boxes vault",
        "pick": "Petschkuv Palac Bezpecnostni Schranka B",
        "kind": "night",
        "halftone": False,
        "aspect": 1.7778,
        "widths": [960, 1440],
        "alt": "Rows of safe-deposit boxes in a bank vault.",
    },
    {
        "slug": "padlock-key",
        "query": "padlock with key",
        "prefer": r"padlock",
        "kind": "paper",
        "halftone": True,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "An antique iron padlock and its key.",
    },
    {
        "slug": "support-desk",
        "query": "call center operator headset",
        "prefer": r"call cent|operator|headset",
        "kind": "paper",
        "halftone": False,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "A call-centre workspace with a headset.",
    },
    {
        "slug": "operations-room",
        "query": "server room data center",
        "prefer": r"server|rack|data cent",
        "kind": "night",
        "halftone": False,
        "aspect": 1.7778,
        "widths": [960, 1440],
        "alt": "Cooling equipment on the roof of a data centre.",
    },
    {
        "slug": "desk-paperwork",
        "query": "desk documents papers",
        "prefer": r"desk|documents|papers",
        "kind": "paper",
        "halftone": False,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "Documents and objects arranged on a desk.",
    },
    {
        "slug": "device-security",
        "query": "smartphone in hand Unsplash",
        "pick": "Smartphone in Hand (Unsplash)",
        "kind": "paper",
        "halftone": False,
        "aspect": 1.5,
        "widths": [720, 1200],
        "alt": "A smartphone held in one hand.",
    },
]


def url_looks_like_image(url: str) -> bool:
    """Image check independent of Wikimedia's utm query parameters."""
    path = urllib.parse.urlparse(url).path
    return pathlib.PurePosixPath(path).suffix.lower() in {".jpg", ".jpeg", ".png"}


def plain_text(value: str | None) -> str | None:
    if not value:
        return None
    text = re.sub(r"<[^>]+>", " ", value)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text or None


OPENVERSE_DISABLED = False


def rank(candidates: list[dict], prefer: str | None, pick: str | None = None) -> dict | None:
    """Pin an exact title when asked; otherwise prefer title matches, then rank."""
    if not candidates:
        return None
    if pick:
        pattern = re.compile(re.escape(pick), re.IGNORECASE)
        matches = [c for c in candidates if pattern.search(c.get("title") or "")]
        if not matches:
            print(f"    (pinned pick not found: {pick})")
            return None
        candidates = matches
    elif prefer:
        pattern = re.compile(prefer, re.IGNORECASE)
        preferred = [c for c in candidates if pattern.search(c.get("title") or "")]
        if preferred:
            candidates = preferred
    candidates.sort(key=lambda r: (r.get("rank", 0), -min(r.get("width") or 0, 3200)))
    return candidates[0]


def openverse_search(
    query: str, prefer: str | None, pick: str | None, minimum_width: int = 1000
) -> dict | None:
    global OPENVERSE_DISABLED
    if OPENVERSE_DISABLED:
        return None

    params = urllib.parse.urlencode(
        {
            "q": query,
            "license": "cc0,pdm",
            "page_size": 50,
            "mature": "false",
        }
    )
    request = urllib.request.Request(f"{API}?{params}", headers={"User-Agent": UA})
    payload = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.loads(response.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as error:
            if error.code in (401, 429):
                # anonymous quota exhausted: stop trying for this run
                OPENVERSE_DISABLED = True
                print("    (openverse quota exhausted — falling back to Wikimedia Commons)")
                return None
            if attempt == 2:
                print(f"    (openverse unavailable: {error})")
                return None
            time.sleep(2 + attempt * 3)

    preferences = {"wikimedia": 0, "stocksnap": 1, "rawpixel": 2, "flickr": 3}
    candidates = []
    for result in (payload or {}).get("results", []):
        width = result.get("width") or 0
        height = result.get("height") or 0
        url = result.get("url") or ""
        if width < minimum_width or height < 640:
            continue
        if not url_looks_like_image(url):
            continue
        if not result.get("foreign_landing_url"):
            continue
        candidates.append(
            {**result, "rank": preferences.get(result.get("provider") or "", 4)}
        )

    return rank(candidates, prefer, pick)


ARTWORK_TITLE = re.compile(
    r"\b(painting|drawing|engraving|lithograph|etching|sketch|illustration|"
    r"woodcut|watercolou?r|manuscript|calligraphy|poster|diagram|map|logo|coat of arms)\b",
    re.IGNORECASE,
)


def commons_search(
    query: str, prefer: str | None, pick: str | None, minimum_width: int = 1000
) -> dict | None:
    """Wikimedia Commons fallback: search photographs and keep CC0 / public domain."""
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrsearch": f"filetype:bitmap {query}",
            "gsrnamespace": "6",
            "gsrlimit": "40",
            "prop": "imageinfo",
            "iiprop": "url|size|mime|extmetadata",
        }
    )
    request = urllib.request.Request(
        f"https://commons.wikimedia.org/w/api.php?{params}", headers={"User-Agent": UA}
    )
    payload = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.loads(response.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as error:
            if error.code == 429 and attempt < 2:
                time.sleep(5 + attempt * 10)
                continue
            print(f"    (commons unavailable: {error})")
            return None
        except Exception as error:  # noqa: BLE001 - fallback is best effort
            print(f"    (commons unavailable: {error})")
            return None

    candidates = []
    for page in (payload.get("query", {}).get("pages") or {}).values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata") or {}
        license_name = (meta.get("LicenseShortName", {}).get("value") or "").lower()
        if "cc0" not in license_name and "public domain" not in license_name:
            continue
        title = page.get("title", "").removeprefix("File:")
        if ARTWORK_TITLE.search(title):
            continue
        if info.get("mime") not in {"image/jpeg"}:
            continue
        width = info.get("width") or 0
        height = info.get("height") or 0
        url = info.get("url") or ""
        if width < minimum_width or height < 640:
            continue
        if not url_looks_like_image(url):
            continue
        candidates.append(
            {
                "title": title,
                "creator": plain_text(meta.get("Artist", {}).get("value")),
                "license": "cc0" if "cc0" in license_name else "pdm",
                "provider": "wikimedia",
                "foreign_landing_url": info.get("descriptionurl"),
                "url": url,
                "width": width,
                "height": height,
                "rank": page.get("index") or 99,
            }
        )

    if not candidates:
        return None
    return rank(candidates, prefer, pick)


def search(query: str, prefer: str | None, pick: str | None) -> dict | None:
    return openverse_search(query, prefer, pick) or commons_search(query, prefer, pick)


def download(url: str) -> Image.Image:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=120) as response:
        data = response.read()
    from io import BytesIO

    return Image.open(BytesIO(data)).convert("RGB")


def crop_to_aspect(image: Image.Image, aspect: float, bias: float = 0.4) -> Image.Image:
    width, height = image.size
    current = width / height
    if abs(current - aspect) < 0.01:
        return image
    if current > aspect:  # too wide: trim sides
        new_width = int(round(height * aspect))
        left = (width - new_width) // 2
        return image.crop((left, 0, left + new_width, height))
    new_height = int(round(width / aspect))
    top = int((height - new_height) * bias)  # bias above centre: faces sit high
    return image.crop((0, top, width, top + new_height))


def render(entry: dict, force: bool) -> bool:
    slug = entry["slug"]
    master_path = SOURCES_DIR / f"{slug}-master.jpg"
    files = [MEDIA / f"{slug}-{width}.webp" for width in entry["widths"]]

    if not force and master_path.exists() and all(path.exists() for path in files):
        print(f"  = {slug}: present")
        return False

    result = search(entry["query"], entry.get("prefer"), entry.get("pick"))
    if result is None:
        print(f"  ! {slug}: no CC0 candidate found for “{entry['query']}”")
        return False

    print(f"  + {slug}: {result.get('provider')} · {(result.get('width'), result.get('height'))} · {result.get('title', '')[:60]}")
    image = download(result["url"])
    image = crop_to_aspect(image, entry["aspect"], entry.get("crop_bias", 0.4))

    source_width = image.size[0]
    master_width = min(1600, source_width)
    master = image.resize((master_width, int(round(master_width / entry["aspect"]))), Image.LANCZOS)
    master.save(master_path, quality=92)

    widths = [width for width in entry["widths"] if width <= master_width]
    if not widths:
        widths = [int(round(master_width / 10) * 10)]
        print(f"    ! small source ({source_width}px): exporting {widths[0]}px only")
    if widths[-1] != master_width and master_width <= 1600:
        widths.append(master_width)

    treated = duotone(master, entry["kind"])
    if entry.get("halftone"):
        treated = halftone(treated)

    for width in widths:
        variant = treated.resize((width, int(round(width / entry["aspect"]))), Image.LANCZOS)
        variant.save(MEDIA / f"{slug}-{width}.webp", quality=WEBP_QUALITY, method=6)
        print(f"    -> {slug}-{width}.webp")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    manifest[slug] = {
        "title": result.get("title") or slug,
        "creator": result.get("creator"),
        "license": result.get("license") or "cc0",
        "source": result.get("foreign_landing_url"),
        "provider": result.get("provider"),
        "query": entry["query"],
        "file": f"/media/{slug}-{max(widths)}.webp",
        "srcset": [f"/media/{slug}-{width}.webp {width}w" for width in widths],
        "kind": entry["kind"],
        "halftone": bool(entry.get("halftone")),
        "aspect": entry["aspect"],
        "alt": entry["alt"],
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"    manifest updated")
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="re-download and re-render everything")
    parser.add_argument("--slug", help="render a single asset by slug")
    args = parser.parse_args()

    MEDIA.mkdir(parents=True, exist_ok=True)
    SOURCES_DIR.mkdir(parents=True, exist_ok=True)
    targets = [entry for entry in SOURCES if not args.slug or entry["slug"] == args.slug]
    if args.slug and not targets:
        print(f"unknown slug: {args.slug}", file=sys.stderr)
        sys.exit(2)

    changed = 0
    for entry in targets:
        changed_now = render(entry, args.force)
        if changed_now:
            changed += 1
            time.sleep(REQUEST_PAUSE)
        elif not args.slug:
            time.sleep(0.3)

    print(f"done — {changed} asset(s) rendered, {len(targets) - changed} skipped")


if __name__ == "__main__":
    main()
