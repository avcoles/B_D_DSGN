# Action Figure — creative studio landing page

A studio page for a fictional design practice, built from a saved-page snapshot
of `toyfight.co` used as a **design reference, not a clone target**. The
snapshot's own stylesheet was not recoverable — the saved copy contains only
`@font-face` rules plus a large amount of browser-extension CSS — so nothing
here is measured off the original. What was read off it is the design language:

- a CRT boot screen that counts up before releasing the page,
- a typed command terminal standing in for a menu,
- a slot-machine tagline whose middle words keep changing,
- a raster/bitmap display voice against a condensed grotesk and a mono,
- a registered-mark tagline as the studio's whole positioning.

Everything else — the copy, the projects, the studio, the 3D hero — is written
for this page.

## Running it

    npm run dev        # then http://localhost:5180/action-figure/index.html

The folder is self-contained static files; any static server pointed at it
works too.

## The hero

`figure.js` builds a poseable action figure at runtime out of `CapsuleGeometry`
limbs and `SphereGeometry` ball joints, arranged as a nested `Group` hierarchy.
There is no model file, no loader and no texture.

The hierarchy is the point. A pose is a table of Euler angles keyed by joint
name; rotating `shoulderL` carries the forearm and hand with it, so the figure
genuinely articulates rather than playing back a baked clip. Four poses ship
(`AT REST`, `ARTICULATED`, `LAUNCH`, `ON GUARD`) and the HUD button cycles them.

Joints are damped toward their targets rather than tweened on a timeline, which
lets the pose, the pointer tracking and the breathing all push on the same
joint in the same frame without fighting.

| | |
|---|---|
| Joints | 15 driven, 32 articulation points claimed on the spec plate |
| Materials | `MeshPhysicalMaterial`, clearcoat 0.85 |
| Environment | 512×256 canvas gradient → `PMREMGenerator`, no HDR file |
| Lights | Key + lavender fill + violet rim + ambient |
| Shadows | `PCFShadowMap`, 1024 map, radius 3 |
| Budget | DPR capped at 2, `IntersectionObserver` pauses the loop off-screen |

Three failure modes are handled: no WebGL falls back to the empty CRT stage with
a mono note, `prefers-reduced-motion` renders one settled frame and never starts
the loop, and a backgrounded tab resumes from clamped deltas instead of jumping.

## Design system

**Colour** — near-black `#0E0E0E`, paper `#F5F5F5`, violet `#5D2DE6`. Violet
appears on the ticker, on hover and inside the render, and nowhere else, so it
reads as "live" rather than as decoration. Three toy-plastic secondaries
(`#9E81F0`, `#F7CECE`, `#C5F1D8`) exist only to tell four project cards apart.

**Type** — one variable family moving on its width axis instead of three
families:

| | family | axes | size |
|---|---|---|---|
| `.display` | Archivo | wdth 112 / wght 900 | `clamp(2.5rem, 7.6vw, 8rem)` |
| `.h2` | Archivo | wdth 104 / wght 800 | `clamp(2rem, 5.4vw, 4.75rem)` |
| `.condensed` | Archivo | wdth 72 / wght 700 | contextual |
| `.mono` | JetBrains Mono | 500 | `clamp(0.625rem, …, 0.75rem)` |

Mono is reserved for machine voice — readouts, numbers, the terminal — so a
mono label always means "this is data".

**Layout** — `--pad` and `--gutter` both `clamp()` against the viewport, so the
page zooms rather than stepping. Two breakpoints only: 900px drops the desktop
nav, 640px collapses the work grid.

**Motion** — two easings and nothing else. `cubic-bezier(.16,1,.3,1)` for
reveals, `cubic-bezier(.65,0,.35,1)` for anything mechanical (label swaps, the
boot wipe, reel steps). Stagger is written as a `--d` custom property so the
delay lives next to the duration and the reduced-motion query zeroes both.

## Font substitution

The reference's three faces are commercial and absent from the snapshot.

| Source | Substitute | Licence |
|---|---|---|
| FK Raster Grotesk | Pixelify Sans | OFL |
| Spezia Condensed | Archivo at wdth 72 | OFL |
| Spezia Mono | JetBrains Mono | OFL |

FK Raster Grotesk is a grotesk redrawn on a coarse pixel grid — a display face
that carries the "screen" idea in its outlines. Pixelify Sans is the closest
open equivalent, but it is more overtly pixel-art than the original, so it is
held back to the boot screen and the spec plate rather than used for headlines.
Archivo's width axis covers Spezia Condensed adequately at the sizes used here.

## Vendored dependencies

`vendor/three.module.min.js` and `vendor/three.core.min.js` are Three.js
**r185.1**, copied from `node_modules/three/build/`. They are committed rather
than fetched from a CDN so the page has no external runtime dependency and
works from any static host. `three` is kept in the root `devDependencies` only
so the vendored version is reproducible — nothing in the React app imports it.

To update: `npm i -D three@latest`, copy both files across, re-check the console
for new deprecations (r183 deprecated `Clock` and `PCFSoftShadowMap`, both of
which this file already avoids).

## Known deviations

- **The command terminal routes and applies effects but does not search.** The
  reference appears to run a fuzzy match over its whole site; this one matches
  a fixed command table and says so when it misses.
- **Project artwork is drawn in CSS**, not photographed. Four generative-looking
  figures give the grid rhythm without shipping stock imagery.
- **`prefers-reduced-motion` disables the slot reels entirely** rather than
  cross-fading them. A word that changes under you is the thing that motion
  setting exists to prevent.
