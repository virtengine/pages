"""Generate src/data/media.ts from public/media/manifest.json so components can
reference brand photography by slug with typed srcset/alt metadata.

Run:  python scripts/build-media-data.py
"""

import json
import pathlib

SITE = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = SITE / "public" / "media" / "manifest.json"

manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

lines = [
    "/**",
    " * Brand media manifest — generated from `public/media/manifest.json` by",
    " * scripts/build-media-data.py. Do not edit by hand: re-run the harvest instead.",
    " *",
    " * Every photograph is public-domain / CC0 (Openverse, filtered to cc0 + pdm,",
    " * with a Wikimedia Commons fallback) and has been rendered through the one",
    " * brand treatment — navy duotone, optional halftone screen. See DESIGN.md §11.",
    " */",
    "",
    "export interface MediaAsset {",
    "  /** default source (largest width) */",
    "  src: string;",
    "  /** responsive candidates */",
    "  srcset: string;",
    "  /** intrinsic size of the default source, for layout stability */",
    "  width: number;",
    "  height: number;",
    "  /** alt text (short, factual) */",
    "  alt: string;",
    "  /** treatment applied by the harvest pipeline */",
    '  kind: "paper" | "night";',
    "  halftone: boolean;",
    "  /** provenance (all CC0 / public domain) */",
    "  credit: string;",
    "  source: string;",
    "  license: string;",
    "}",
    "",
    "export const media = {",
]

for slug in sorted(manifest):
    entry = manifest[slug]
    srcset = entry.get("srcset") or [f"{entry['file']} 1200w"]
    largest = max(int(item.split()[1][:-1]) for item in srcset)
    aspect = entry.get("aspect") or 1.5
    height = int(round(largest / aspect))
    credit = (entry.get("creator") or entry.get("provider") or "public domain").replace('"', "'")
    source = entry.get("source") or ""
    alt = (entry.get("alt") or slug.replace("-", " ")).replace('"', "'")
    lines += [
        f'  "{slug}": {{',
        f'    src: "{entry["file"]}",',
        f'    srcset: "{", ".join(srcset)}",',
        f"    width: {largest},",
        f"    height: {height},",
        f'    alt: "{alt}",',
        f'    kind: "{entry.get("kind", "paper")}",',
        f'    halftone: {str(bool(entry.get("halftone"))).lower()},',
        f'    credit: "{credit}",',
        f'    source: "{source}",',
        f'    license: "{entry.get("license", "cc0")}",',
        "  },",
    ]

lines += [
    "} as const satisfies Record<string, MediaAsset>;",
    "",
    "export type MediaSlug = keyof typeof media;",
    "",
]

dest = SITE / "src" / "data" / "media.ts"
dest.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {dest} ({len(manifest)} assets)")
