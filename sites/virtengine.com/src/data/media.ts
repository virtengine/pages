/**
 * Brand media manifest — generated from `public/media/manifest.json` by
 * scripts/build-media-data.py. Do not edit by hand: re-run the harvest instead.
 *
 * Every image is public-domain / CC0 (Openverse, filtered to cc0 + pdm) and has
 * been rendered through the brand duotone treatment — see DESIGN.md §12.
 */

export interface MediaAsset {
  /** default source (largest width) */
  src: string;
  /** responsive candidates */
  srcset: string;
  /** intrinsic size of the default source, for layout stability */
  width: number;
  height: number;
  /** alt text (short, factual) */
  alt: string;
  /** treatment applied by the harvest pipeline */
  kind: "paper" | "night";
  halftone: boolean;
  /** provenance (all CC0 / public domain) */
  credit: string;
}

export const media = {
  "closing-hands": {
    src: "/media/closing-hands-1920.webp",
    srcset: "/media/closing-hands-960.webp 960w, /media/closing-hands-1440.webp 1440w, /media/closing-hands-1920.webp 1920w",
    width: 1920,
    height: 1080,
    alt: "Two people shaking hands across a table.",
    kind: "paper",
    halftone: true,
    credit: "Kristin Hardwick",
    source: "https://stocksnap.io/photo/work-business-J5LXKNDREC",
    license: "cc0",
  },
  "hero-infrastructure": {
    src: "/media/hero-infrastructure-1920.webp",
    srcset: "/media/hero-infrastructure-960.webp 960w, /media/hero-infrastructure-1440.webp 1440w, /media/hero-infrastructure-1920.webp 1920w",
    width: 1920,
    height: 1080,
    alt: "A data-centre aisle: racks of servers receding into the distance.",
    kind: "night",
    halftone: false,
    credit: "rawpixel",
    source: "https://www.rawpixel.com/image/5912401/image-public-domain-black-technology",
    license: "cc0",
  },
  "hpc-supercomputer": {
    src: "/media/hpc-supercomputer-1920.webp",
    srcset: "/media/hpc-supercomputer-960.webp 960w, /media/hpc-supercomputer-1440.webp 1440w, /media/hpc-supercomputer-1920.webp 1920w",
    width: 1920,
    height: 1080,
    alt: "A high-performance computing cluster, racks in a row.",
    kind: "night",
    halftone: false,
    credit: "U.S. Department of Energy",
    source: "https://www.rawpixel.com/image/3325544/free-photo-image-server-network",
    license: "cc0",
  },
  "identity-document": {
    src: "/media/identity-document-1200.webp",
    srcset: "/media/identity-document-720.webp 720w, /media/identity-document-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "Hands holding a document during a verification step.",
    kind: "paper",
    halftone: true,
    credit: "rawpixel",
    source: "https://www.rawpixel.com/image/3286308/free-photo-image-pen-arm-bright",
    license: "cc0",
  },
  "identity-liveness": {
    src: "/media/identity-liveness-1200.webp",
    srcset: "/media/identity-liveness-720.webp 720w, /media/identity-liveness-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "People checking a phone together — an active liveness step.",
    kind: "paper",
    halftone: false,
    credit: "Brodie Vissers",
    source: "https://stocksnap.io/photo/people-men-XO53SBWVMF",
    license: "cc0",
  },
  "identity-portrait": {
    src: "/media/identity-portrait-1100.webp",
    srcset: "/media/identity-portrait-720.webp 720w, /media/identity-portrait-1100.webp 1100w",
    width: 1100,
    height: 1375,
    alt: "A person's face in profile, lit from the side.",
    kind: "paper",
    halftone: false,
    credit: "Joseph L. Etchingham",
    source: "https://stocksnap.io/photo/woman-portrait-KHUKGKJ70W",
    license: "cc0",
  },
  "learn-library": {
    src: "/media/learn-library-1200.webp",
    srcset: "/media/learn-library-720.webp 720w, /media/learn-library-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "Shelves in a library, looking up through the stacks.",
    kind: "paper",
    halftone: false,
    credit: "Patrik Goethe",
    source: "https://stocksnap.io/photo/books-library-EB9B6BC1F6",
    license: "cc0",
  },
  "marketplace-hardware": {
    src: "/media/marketplace-hardware-1200.webp",
    srcset: "/media/marketplace-hardware-720.webp 720w, /media/marketplace-hardware-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "An ethernet cable seated in a network switch port.",
    kind: "night",
    halftone: false,
    credit: "rawpixel",
    source: "https://www.rawpixel.com/image/6038427/photo-image-public-domain-technology-line",
    license: "cc0",
  },
  "network-earth": {
    src: "/media/network-earth-1920.webp",
    srcset: "/media/network-earth-960.webp 960w, /media/network-earth-1440.webp 1440w, /media/network-earth-1920.webp 1920w",
    width: 1920,
    height: 1080,
    alt: "An operations room with wall displays.",
    kind: "night",
    halftone: false,
    credit: "UrusHyby",
    source: "https://commons.wikimedia.org/w/index.php?curid=175250226",
    license: "cc0",
  },
  "open-source-screen": {
    src: "/media/open-source-screen-1200.webp",
    srcset: "/media/open-source-screen-720.webp 720w, /media/open-source-screen-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "Source code on a laptop screen.",
    kind: "night",
    halftone: false,
    credit: "Christina Morillo",
    source: "https://stocksnap.io/photo/developer-code-NT1Q3GZVFI",
    license: "cc0",
  },
  "provider-datacenter": {
    src: "/media/provider-datacenter-1200.webp",
    srcset: "/media/provider-datacenter-720.webp 720w, /media/provider-datacenter-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "Server racks in a provider data centre.",
    kind: "night",
    halftone: false,
    credit: "rawpixel",
    source: "https://www.rawpixel.com/image/5912401/image-public-domain-black-technology",
    license: "cc0",
  },
  "provider-technician": {
    src: "/media/provider-technician-1200.webp",
    srcset: "/media/provider-technician-720.webp 720w, /media/provider-technician-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "A technician working on hardware in a server room.",
    kind: "paper",
    halftone: false,
    credit: "Derrick Coetzee from Berkeley, CA, USA",
    source: "https://commons.wikimedia.org/w/index.php?curid=17445570",
    license: "cc0",
  },
  "settlement-ledger": {
    src: "/media/settlement-ledger-1200.webp",
    srcset: "/media/settlement-ledger-720.webp 720w, /media/settlement-ledger-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "A hand writing in a ledger — metered usage being settled.",
    kind: "paper",
    halftone: true,
    credit: "Green Chameleon",
    source: "https://stocksnap.io/photo/writing-drawing-8Y0EDX4VP9",
    license: "cc0",
  },
  "staking-security": {
    src: "/media/staking-security-1200.webp",
    srcset: "/media/staking-security-720.webp 720w, /media/staking-security-1200.webp 1200w",
    width: 1200,
    height: 800,
    alt: "A padlock and key — bonded stake under slash conditions.",
    kind: "paper",
    halftone: true,
    credit: "rawpixel",
    source: "https://www.rawpixel.com/image/10136242/padlock-with-key-1650-1700-baroque-scandinavian-and-german",
    license: "cc0",
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaSlug = keyof typeof media;
