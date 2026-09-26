/**
 * Brand media manifest — generated from `public/media/manifest.json` by
 * scripts/build-media-data.py. Do not edit by hand: re-run the harvest instead.
 *
 * Every photograph is public-domain / CC0 (Openverse, filtered to cc0 + pdm,
 * with a Wikimedia Commons fallback) and has been rendered through the one
 * brand treatment — navy duotone, optional halftone screen. See DESIGN.md §11.
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
  source: string;
  license: string;
}

export const media = {
  "document-desk": {
    src: "/media/document-desk-1600.webp",
    srcset: "/media/document-desk-720.webp 720w, /media/document-desk-1200.webp 1200w, /media/document-desk-1600.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A passport and identity papers on a desk.",
    kind: "paper",
    halftone: false,
    credit: "Alex Robert alexrobert",
    source: "https://commons.wikimedia.org/wiki/File:Passport_documents_desk_(Unsplash).jpg",
    license: "cc0",
  },
  "identity-liveness": {
    src: "/media/identity-liveness-1600.webp",
    srcset: "/media/identity-liveness-720.webp 720w, /media/identity-liveness-1200.webp 1200w, /media/identity-liveness-1600.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A person holding a phone at arm's length to photograph themselves.",
    kind: "paper",
    halftone: false,
    credit: "Annie Spratt anniespratt",
    source: "https://commons.wikimedia.org/wiki/File:The_Selfie_(Unsplash).jpg",
    license: "cc0",
  },
  "identity-portrait": {
    src: "/media/identity-portrait-1600.webp",
    srcset: "/media/identity-portrait-720.webp 720w, /media/identity-portrait-1100.webp 1100w, /media/identity-portrait-1600.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "A close portrait of a person's face.",
    kind: "paper",
    halftone: false,
    credit: "Jeremy Bishop tidesinourveins",
    source: "https://commons.wikimedia.org/wiki/File:Curly_hair_and_freckles_man_(Unsplash).jpg",
    license: "cc0",
  },
  "operations-room": {
    src: "/media/operations-room-1600.webp",
    srcset: "/media/operations-room-960.webp 960w, /media/operations-room-1440.webp 1440w, /media/operations-room-1600.webp 1600w",
    width: 1600,
    height: 900,
    alt: "Cooling equipment on the roof of a data centre.",
    kind: "night",
    halftone: false,
    credit: "Rsparks3",
    source: "https://commons.wikimedia.org/wiki/File:Data_center_roof.jpg",
    license: "cc0",
  },
  "vault-door": {
    src: "/media/vault-door-1600.webp",
    srcset: "/media/vault-door-960.webp 960w, /media/vault-door-1440.webp 1440w, /media/vault-door-1600.webp 1600w",
    width: 1600,
    height: 900,
    alt: "Two circular steel vault doors in a strongroom, one standing open.",
    kind: "night",
    halftone: false,
    credit: "The Cleveland Trust Company: An Epitome of the Past, A Chronicle of the Present, A Promise of the Future . Cleveland: The Cleveland Trust Company, 1908, p. 75 overleaf.",
    source: "https://commons.wikimedia.org/wiki/File:Safe_deposit_vault_1908.jpg",
    license: "pdm",
  },
  "wallet-in-hand": {
    src: "/media/wallet-in-hand-1600.webp",
    srcset: "/media/wallet-in-hand-720.webp 720w, /media/wallet-in-hand-1200.webp 1200w, /media/wallet-in-hand-1600.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A hand holding a smartphone.",
    kind: "paper",
    halftone: false,
    credit: "Samson Vowles [1]",
    source: "https://commons.wikimedia.org/wiki/File:Hand_holding_(Unsplash).jpg",
    license: "cc0",
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaSlug = keyof typeof media;
