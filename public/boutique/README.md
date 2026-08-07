# Studio Boutique — landing page rebuild

Reconstruction of `studiodado.com` from a saved-page snapshot, built with the
`landing-page-clone` workflow: repair the snapshot → instrumented capture →
token derivation → hand-authored rebuild → pixel verification.

## Running it

    python3 -m http.server 8812

## Measured fidelity

Diffed against the captured reference with `scripts/verify.py`:

| Breakpoint | Pixel diff | Page height (ref / rebuild) |
|---|---|---|
| 1960px | 23.3% | 8253 / 8205 |
| 1014px | 34.1% | 5161 / 5161 |
| 390px  | 56.1% | 9073 / 8727 |

At 1014px the total height matches exactly and every section lands within
20px: hero 900/900, intro 981/1001, projects 1005/1002, blog 941/951,
footer 629/626. At 1960px the hero, `studio__grid` (925), `footer__cols`
(294), `intro__claim` (1408x467) and the `.h2` block (1408x241) are exact.
390px is the weakest breakpoint and is the obvious next thing to work on.

## Stack

The source is a WordPress theme built with Tailwind (custom config, one `s:`
breakpoint) plus Lenis for smooth scroll. No GSAP — reveals are CSS
transitions on line masks driven by an IntersectionObserver. This rebuild is
plain HTML/CSS with ~40 lines of JS, which is easier to verify against and
easier to port.

## Design system

Everything derives from one rule:

    html { font-size: calc(10 * 100vw / var(--size)) }
    :root                      { --size: 402;  --columns: 12; --gap: 1rem }
    @media (min-width: 650px)  { --size: 1500; --columns: 24; --gap: 2rem }
    @media (min-width: 1920px) { --size: 1740 }

`1rem` is always 10 design-pixels scaled to the viewport, so the whole page is
a single proportional zoom rather than a set of breakpoint-specific sizes.
Spacing utilities follow the same scale: `pb-200` is `20rem`, `mb-15` is
`1.5rem`.

**Type** — four rules cover the page:

| | family | size (desktop) | line-height | tracking |
|---|---|---|---|---|
| `.h1` | disp | 16.2rem | 0.8 | -0.02em |
| `.h2` | disp | 7rem, uppercase | 102% | -0.02em |
| `.h3` | sans | 3rem | 102% | -0.02em |
| body | sans | 2rem | 1.2 | -0.02em |

**Colour** — white, black, and `rgb(93 83 70)` brown. That's the whole palette.

**Layout** — `.site-max` is a full-width container with `--padding` inline
margin; `.site-grid` lays 12 or 24 columns with `--gap`. A white `.sections`
layer sits above the brown body so the footer's brown shows only at the end.

**Reveals** — text is pre-split into `.line-mask` / `.line` pairs; the mask
clips and the line translates up from 105%. An IntersectionObserver at
threshold 0.15 adds `.is-revealed` and staggers the lines by 80ms.

## Font substitution

Both faces are commercial and absent from the snapshot.

| Source | Substitute | Licence |
|---|---|---|
| ABC Arizona Flare (`disp`) | Marcellus | OFL |
| AppDADO (`sans`) | Inter | OFL |

Arizona Flare is a *flare* serif, not a didone — its stems widen at the
terminals rather than carrying true serifs, which is why the same family reads
as a serif at 182px in the hero and nearly as a sans at 79px in the intro
heading. Marcellus was picked by measurement against Cinzel, Gilda Display,
Fraunces, Playfair Display and Cormorant Garamond: it had the lowest width
error on the hero words and reproduced the intro heading's three-line break.

If you license the originals, drop them into `fonts/` and the `@font-face`
rules resolve without any other change.

## Snapshot repairs

The saved page was damaged in several ways that all look like rebuild bugs if
you don't catch them first. `prep.py`-equivalent logic lives in the reference
build; the issues were:

- **`<div>` inside `<p>`.** The theme builds line masks as divs inside
  paragraphs, which is fine in a live DOM and illegal in serialised HTML. On
  re-parse every one was evicted from its paragraph, leaving `p.h2` empty and
  the text rendering as unstyled 13px copy. Renamed them to `<span>` and
  re-adopted the evicted nodes.
- **Images frozen at `opacity: 0`.** The lazy-loader hadn't run, so all three
  blog cards and the studio portrait were invisible.
- **A duplicate `.line` at `translateY(100%)`.** The splitter had re-run over
  already-split markup; the outer copy animated, the inner one never did.
- **A header parked off-screen** with white-on-white links.
- **`app.js` saved as `.js.download`**, served as `application/octet-stream`
  and refused as a module.
- **Charset meta pushed past the sniffing window** by a browser extension node,
  producing mojibake throughout.
- **Two Vimeo backgrounds** that are unreachable offline; given local posters
  so neither render is a black rectangle.

## Known deviations

- **The hero renders 15.5rem down via a transform, not a margin.** Its layout
  box stays at the top of `.sections` so the intro tucks underneath; the media
  carries the same offset again inside the clipped hero. This reproduces the
  observed state, which appears to be where the preload animation settles.
- **390px is not finished.** Column spans below 650px are still partly
  guessed; projects and blog run short there.
- **Client logo is a placeholder mark**, and contact details, email and links
  are placeholders.
- **Blog card images are best guesses** — the snapshot shipped seven
  photographs for more slots than that, so some are reused.
- **Parallax scrub state differs between captures**, which accounts for the
  crop differences on the project and blog imagery.
