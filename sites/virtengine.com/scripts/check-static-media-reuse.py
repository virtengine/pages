"""Fail when a literal media asset is assigned to multiple static Astro pages.

Data-driven article collections intentionally use topic-specific media keys;
this check covers literal page-level ``media`` and ``slug`` assignments. The
media credits page is excluded because it is a catalog of every asset.
"""

from __future__ import annotations

import collections
import json
import pathlib
import re
import sys

SITE = pathlib.Path(__file__).resolve().parents[1]
PAGES = SITE / "src" / "pages"
MEDIA = SITE / "src" / "data" / "media.ts"
MANIFEST = SITE / "public" / "media" / "manifest.json"
MEDIA_DIR = SITE / "public" / "media"
SKIP = {"media-credits.astro"}
ATTR = re.compile(r'\b(?:media|slug)="([a-z0-9-]+)"')
SRC = re.compile(r'"([a-z0-9-]+)": \{\s*\n\s*src: "([^"]+)"', re.M)


def main() -> int:
    known_assets = {slug: src for slug, src in SRC.findall(MEDIA.read_text(encoding="utf-8"))}
    pages_by_asset: dict[str, set[str]] = collections.defaultdict(set)
    unknown: list[str] = []

    for page in PAGES.rglob("*.astro"):
        if page.name in SKIP or "[" in page.name:
            continue
        route = "/" + page.relative_to(PAGES).with_suffix("").as_posix()
        for slug in set(ATTR.findall(page.read_text(encoding="utf-8"))):
            source = known_assets.get(slug)
            if source is None:
                unknown.append(f"{route}: unknown media slug {slug}")
            else:
                pages_by_asset[source].add(route)

    duplicates = {
        source: routes for source, routes in pages_by_asset.items() if len(routes) > 1
    }
    records = json.loads(MANIFEST.read_text(encoding="utf-8"))
    source_slugs: dict[str, list[str]] = collections.defaultdict(list)
    missing_files: list[str] = []
    for slug, record in records.items():
        source = record.get("source")
        if source:
            source_slugs[source.rstrip("/")].append(slug)
        variants = [record.get("file", "")]
        variants.extend(candidate.split()[0] for candidate in record.get("srcset", []))
        for variant in set(variants):
            if variant and not (MEDIA_DIR / pathlib.PurePosixPath(variant).name).is_file():
                missing_files.append(f"{slug}: missing {variant}")
        if record.get("halftone") is not True:
            unknown.append(f"{slug}: brand halftone is not recorded as applied")
    repeated_sources = {
        source: slugs for source, slugs in source_slugs.items() if len(slugs) > 1
    }
    if unknown or duplicates or repeated_sources or missing_files:
        for issue in unknown:
            print(issue)
        for source, routes in sorted(duplicates.items()):
            print(f"reused image {source}: {', '.join(sorted(routes))}")
        for source, slugs in sorted(repeated_sources.items()):
            print(f"duplicate source recorded for {', '.join(slugs)}: {source}")
        for issue in missing_files:
            print(issue)
        return 1

    print(
        f"No repeated photo assignments across {len(pages_by_asset)} static page assets; "
        f"all {len(records)} manifest sources are unique, and all registered files "
        "exist with the halftone treatment recorded."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
