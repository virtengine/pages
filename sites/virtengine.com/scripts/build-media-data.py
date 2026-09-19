"""Generate src/data/media.ts from public/media/manifest.json so components can
reference brand media by slug with typed srcset/alt metadata."""

import json
import pathlib

SITE = pathlib.Path(r"D:\source\repos\DET-IO FOUNDATION\pages\sites\virtengine.com")
man = json.loads((SITE / "public" / "media" / "manifest.json").read_text(encoding="utf-8"))

ALT = {
    "hero-infrastructure": "A data-centre aisle: racks of servers receding into the distance.",
    "identity-portrait": "A person's face in profile, lit from the side.",
    "identity-document": "Hands holding a document during a verification step.",
    "identity-liveness": "People checking a phone together — an active liveness step.",
    "marketplace-hardware": "An ethernet cable seated in a network switch port.",
    "provider-technician": "A technician working on hardware in a server room.",
    "provider-datacenter": "Server racks in a provider data centre.",
    "hpc-supercomputer": "A high-performance computing cluster, racks in a row.",
    "settlement-ledger": "A hand writing in a ledger — metered usage being settled.",
    "learn-library": "Shelves in a library, looking up through the stacks.",
    "open-source-screen": "Source code on a laptop screen.",
    "network-earth": "An operations room with wall displays.",
    "staking-security": "A padlock and key — bonded stake under slash conditions.",
    "closing-hands": "Two people shaking hands across a table.",
}

lines = [
    "/**",
    " * Brand media manifest — generated from `public/media/manifest.json` by",
    " * scripts/build-media-data.py. Do not edit by hand: re-run the harvest instead.",
    " *",
    " * Every image is public-domain / CC0 (Openverse, filtered to cc0 + pdm) and has",
    " * been rendered through the brand duotone treatment — see DESIGN.md §12.",
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
    "  kind: \"paper\" | \"night\";",
    "  halftone: boolean;",
    "  /** provenance (all CC0 / public domain) */",
    "  credit: string;",
    "}",
    "",
    "export const media = {",
]

for slug in sorted(man):
    m = man[slug]
    srcset = m.get("srcset") or [m["file"] + " 1200w"]
    largest = max(int(s.split()[1][:-1]) for s in srcset)
    aspect = m.get("aspect") or 1.5
    height = int(round(largest / aspect))
    credit = m.get("creator") or m.get("provider") or "public domain"
    source = m.get("source") or ""
    license_ = m.get("license") or "cc0"
    lines += [
        f'  "{slug}": {{',
        f'    src: "{m["file"]}",',
        f'    srcset: "{", ".join(srcset)}",',
        f"    width: {largest},",
        f"    height: {height},",
        f'    alt: "{ALT.get(slug, slug.replace("-", " "))}",',
        f'    kind: "{m.get("kind", "paper")}",',
        f'    halftone: {str(bool(m.get("halftone"))).lower()},',
        f'    credit: "{credit.replace(chr(34), chr(39))}",',
        f'    source: "{source}",',
        f'    license: "{license_}",',
        "  },",
    ]

lines += ["} as const satisfies Record<string, MediaAsset>;", "", "export type MediaSlug = keyof typeof media;", ""]

dest = SITE / "src" / "data" / "media.ts"
dest.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {dest} ({len(man)} assets)")
