# VirtEngine Docs brand guide

The documentation uses the same official identity as `virtengine.com`. The
canonical source is the original nested downward-triangle mark and the shared
brand system in `sites/virtengine.com/DESIGN.md`.

## Logo

- Use `public/brand/virtengine-icon.png`, the pixel-exact crop of the official
  VirtEngine mark. Do not trace, redraw, rotate, or recolor it.
- The documentation header combines that mark with the Questrial wordmark,
  the original `by DET.io` attribution, and a restrained `Docs` tag.
- The favicon is the official mark without a surrounding tile.

## Color

| Token | Value | Role |
| --- | --- | --- |
| Brand green | `#60CC5D` | Official mark and graphic accent |
| Deep green | `#2B7D29` | Accessible links and controls on light surfaces |
| Wordmark grey | `#575757` | Wordmark and body copy |
| Ink | `#262B26` | Headings |
| Paper | `#F7F8F7` | Light-theme background |
| Panel | `#FFFFFF` | Light cards and content surfaces |
| Night | `#1B201B` | Dark-theme navigation and technical surfaces |

Brand green is not used for small text on white. Interactive text uses deep
green for accessible contrast. The teal palette formerly used by this site is
not part of the VirtEngine identity.

## Typography

| Role | Face |
| --- | --- |
| Display, headings, wordmark | Questrial 400 |
| Body and interface | Inter 400/500/600 |
| Code, labels, captions | JetBrains Mono 400/500 |

## Visual language

The light theme uses engineering-paper surfaces, fine rules, tight radii, and
the green accent. Dark mode uses the same green on near-black neutral surfaces.
Cards and diagrams use a clipped upper-right corner derived from the triangular
mark. The landing-page hero displays the official mark rather than an invented
symbol.

Diagrams inherit Starlight color tokens, so marketplace, settlement, staking,
VEID, and HPC figures remain legible in both themes without introducing a
second accent color.

## Accessibility

- Deep green is used for text and controls on light backgrounds.
- Light text and official green meet contrast requirements on night surfaces.
- Focus treatment remains visible in both themes.
- Motion is disabled under `prefers-reduced-motion`.
- The official logo has an accessible name in the header; decorative repeats
  use empty alternative text.
