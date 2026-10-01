"""Download and prepare the site's verified CC0 Wikimedia Commons photos.

The processed image files are generated from Commons' 1920px thumbnails, cropped
to 3:2, screened using the same deterministic halftone as the existing library,
and written as responsive WebP variants. Source page and creator are recorded in
public/media/manifest.json. Run with: python scripts/harvest-cc0-media.py
"""

from __future__ import annotations

import importlib.util
import json
import pathlib
import subprocess
import tempfile
import urllib.parse

from PIL import Image, ImageOps
import requests

SITE = pathlib.Path(__file__).resolve().parents[1]
MEDIA = SITE / "public" / "media"
MANIFEST = MEDIA / "manifest.json"
AGENT = "VirtEngineMediaCurator/1.0 (CC0 source records; hello@virtengine.com)"

# Each title's Commons file page was checked for an explicit CC0 1.0 grant.
ASSETS = [
    {
        "slug": "gpu-card",
        "title": "Graphics Card Upgrading - 49259431802.jpg",
        "creator": "Keijiro Takahashi",
        "alt": "A graphics card being installed in a compact computer.",
        "kind": "night",
    },
    {
        "slug": "storage-drive",
        "title": "Hard drive 06.jpg",
        "creator": "Shams948",
        "alt": "A hard disk drive with its cover removed.",
        "kind": "paper",
    },
    {
        "slug": "provider-datacenter",
        "title": "Rear of rack at NERSC data center - closeup.jpg",
        "creator": "Derrick Coetzee from Berkeley, CA, USA",
        "alt": "Network and power connections at the back of a computing rack.",
        "kind": "night",
    },
    {
        "slug": "network-switch",
        "title": "EthernetSwitch.jpg",
        "creator": "Raysonho @ Open Grid Scheduler / Grid Engine",
        "alt": "An Ethernet switch connected to coloured network cables.",
        "kind": "night",
    },
    {
        "slug": "platform-board",
        "title": "Computer Motherboard Closeup.jpg",
        "creator": "Lenharth Systems",
        "alt": "A close view of a computer motherboard and its components.",
        "kind": "night",
    },
    {
        "slug": "saas-workstation",
        "title": "Woman working behind computer.jpg",
        "creator": "PxHere",
        "alt": "A person working at a computer.",
        "kind": "paper",
    },
    {
        "slug": "tenant-laptop",
        "title": "Hands-woman-laptop-notebook (24217008462).jpg",
        "creator": "Pixel.la Free Stock Photos",
        "alt": "Hands using a laptop beside an open notebook.",
        "kind": "paper",
    },
    {
        "slug": "developer-workstation",
        "title": "Laptop on a desk.jpg",
        "creator": "Radek Grzybowski",
        "alt": "A laptop open on a desk in a work setting.",
        "kind": "paper",
    },
]


def get_url(title: str) -> tuple[str, str]:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": f"File:{title}",
            "prop": "imageinfo",
            "iiprop": "url",
            "iiurlwidth": "1920",
            "format": "json",
        }
    )
    response = requests.get(
        f"https://commons.wikimedia.org/w/api.php?{params}",
        headers={"User-Agent": AGENT},
        timeout=30,
    )
    response.raise_for_status()
    payload = response.json()
    page = next(iter(payload["query"]["pages"].values()))
    info = page["imageinfo"][0]
    return info.get("thumburl", info["url"]), info["descriptionurl"]


def variants(source: pathlib.Path, slug: str, screen) -> list[str]:
    with Image.open(source) as opened:
        im = ImageOps.exif_transpose(opened).convert("RGB")
        target_ratio = 1.5
        width, height = im.size
        if width / height > target_ratio:
            crop_width = round(height * target_ratio)
            left = (width - crop_width) // 2
            im = im.crop((left, 0, left + crop_width, height))
        else:
            crop_height = round(width / target_ratio)
            top = (height - crop_height) // 2
            im = im.crop((0, top, width, top + crop_height))

        produced = []
        for size in (720, 1200):
            output = MEDIA / f"{slug}-{size}.webp"
            variant = im.resize((size, round(size / target_ratio)), Image.Resampling.LANCZOS)
            variant.save(output, "WEBP", quality=82, method=6)
            screen(output)
            produced.append(f"/media/{output.name} {size}w")
    return produced


def main() -> None:
    spec = importlib.util.spec_from_file_location(
        "halftone_media", SITE / "scripts" / "halftone-media.py"
    )
    assert spec and spec.loader
    halftone_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(halftone_module)

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    # This Commons photograph replaces an older Rawpixel asset that duplicated
    # the `hero-infrastructure` source image under a second name.
    manifest.pop("provider-rack", None)
    with tempfile.TemporaryDirectory(prefix="virtengine-cc0-") as temp_dir:
        for asset in ASSETS:
            url, source_page = get_url(asset["title"])
            response = requests.get(url, headers={"User-Agent": AGENT}, timeout=(20, 120))
            response.raise_for_status()
            raw = pathlib.Path(temp_dir) / f"{asset['slug']}.jpg"
            raw.write_bytes(response.content)

            srcset = variants(raw, asset["slug"], halftone_module.halftone)
            manifest[asset["slug"]] = {
                "title": asset["title"],
                "creator": asset["creator"],
                "alt": asset["alt"],
                "license": "cc0",
                "source": source_page,
                "provider": "wikimedia",
                "file": f"/media/{asset['slug']}-1200.webp",
                "srcset": srcset,
                "kind": asset["kind"],
                "halftone": True,
                "aspect": 1.5,
            }
            print(f"  processed {asset['slug']} from {source_page}")

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    subprocess.run(["python", str(SITE / "scripts" / "build-media-data.py")], check=True)


if __name__ == "__main__":
    main()
