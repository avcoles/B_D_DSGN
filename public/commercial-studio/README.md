# Commercial Studio — landing page rebuild

Reconstruction of a commercial interior design landing page from a saved DOM
snapshot, built with the `landing-page-clone` workflow: instrumented capture,
token derivation, hand-authored rebuild, pixel verification. All copy, client
names, project names, testimonials and addresses are placeholder content.

## Running it

Any static server works:

    python3 -m http.server 8801

## Measured fidelity

Diffed against the captured reference with `scripts/verify.py`:

| Breakpoint | Pixel diff | Page height (ref / rebuild) |
|---|---|---|
| 1440px | 24.5% | 9143 / 9141 |
| 981px  | 25.4% | 8198 / 8253 |
| 566px  | 33.6% | 9975 / 9975 |

Section heights land within a few pixels at every breakpoint. Most of the
residual diff is photographic — scroll-driven parallax sits at a different
point in its scrub between the two full-page screenshots, so every pixel of a
1440×900 photo registers as changed. See "Known deviations" below.

## Stack

Matches the source: plain HTML/CSS with GSAP + ScrollTrigger for scroll motion,
Draggable + InertiaPlugin for the process slider, and Lenis for smooth scroll.
The source also ran Webflow's runtime, jQuery, and Barba.js; none of those are
load-bearing for a single page, so they are not reproduced.

## Files

    index.html      markup
    styles.css      token layer + components + breakpoints
    main.js         Lenis, split reveals, parallax, sliders, hover swaps
    assets/         photography (from the source) and placeholder wordmarks
    fonts/          substituted webfonts
    vendor/         gsap, ScrollTrigger, Draggable, InertiaPlugin, lenis

## Design system

The source exposes a complete Webflow variable system; `:root` in `styles.css`
mirrors it.

**Colour** — `#f2f0e6` light, `#eae7db` light card, `#1d1d1d` dark, `#262626`
dark card, `#ff4101` brand. `.u-theme-dark` flips the theme block, which is how
the featured-projects section inverts.

**Type** — Hanken Grotesk for UI, Instrument Serif for display. Every size is a
fluid `clamp()` interpolating between a 20rem and a 160rem viewport. The general
form, for a token running from `a` to `b` rem:

    slope     = (b - a) / 140
    intercept = a - slope * 20
    clamp(a rem, intercept rem + slope*100 vw, b rem)

**Measure** — the source carries a `data-number` attribute on every text block
and turns it into a `max-width` in `ch`: 39ch for the intro heading, 36ch for
process, 26ch for insights, 24ch for the hero and footer headings, 38ch for the
intro body column, 33ch for card copy. Those are preserved as `--ch` custom
properties.

**Trim** — headings and body copy strip half-leading plus the font's own
ascender slack via `::before`/`::after` table margins, so blocks align on cap
height rather than line box. The `.trim` class implements it:

    margin-bottom: calc(var(--trim-t) - .5em - (var(--lh) - 1) * .5em)

**Layout** — 12 columns, 0.5rem gutter, `--site-margin` fluid from 1rem to
3.001rem, container capped at 160rem. Note that `.u-container` is a *block* in
the source; only the seven containers marked `.is-stack` are flex columns. The
12-column grid survives the 991px step untouched — only spacing tightens. The
real collapse happens at 767px.

**Motion** — `cubic-bezier(.65, 0, 0, 1)` throughout, at 0.15 / 0.3 / 0.6 /
0.9 / 1.2s.

## Font substitution

Saans and Serrif Compressed are commercial faces served from Webflow's CDN and
were not in the snapshot. Substitutes:

| Source | Substitute | Licence |
|---|---|---|
| Saans | Hanken Grotesk (variable) | OFL |
| Serrif Compressed | Instrument Serif | OFL |

Instrument Serif was chosen by measurement, not by eye. Against Bodoni Moda,
Playfair Display, Newsreader, and Prata, it was the only candidate that
reproduced the source's line breaks: the intro and process headings both set to
exactly three lines, insights to two, matching the reference. The others ran
30–60% too wide. Its character width also happens to match Serrif Compressed's
exactly at 0.4583em, so every serif block lands on the original pixel width.

Both faces load from Google Fonts via a single `<link>` in `index.html`, so
neither token needs a local file and there is no `fonts/` directory.

`--ch-serif` and `--ch-sans` hold the *source* faces' character widths so the
`ch`-based measures reproduce the original columns. If you license Saans and
Serrif Compressed, add `@font-face` rules for them and replace both values with
`1ch`, and the rule then resolves natively.

## Known deviations

- **Hero heading sets 4 lines, not 5.** Instrument Serif is slightly narrower
  than Serrif Compressed. The block keeps its faithful 24ch width rather than
  being squeezed to force the extra break.
- **Intro body column is back to the source's 38ch.** An earlier build widened
  it to 40ch to undo Inter running ~4% wide. Hanken Grotesk does not need that
  compensation, and the copy has been rewritten anyway, so line-for-line
  fidelity against the reference no longer applies. It currently sets 22 lines
  in a 336px column.
- **All copy is placeholder.** Studio name, project names, testimonials, post
  titles and addresses are written for this build, not taken from the source.
- **Logo-wall stagger is deterministic.** The source shuffles tile offsets on
  each load, so an exact match is not possible; the offsets here are tuned to
  the captured layout per breakpoint.
- **Contact details, email, and links are placeholders.**
- **Parallax scrub state differs between captures.** Full-page screenshots stitch
  while scrolling, so scroll-driven transforms are frozen at whichever point
  each run happened to reach. This accounts for the worst remaining diff bands
  (the gallery section at all three breakpoints).
- **The reference capture itself is imperfect.** The insights heading had not
  fired its reveal when the reference screenshot was taken, so it reads as blank
  there and as visible in the rebuild. Three source images also 404'd on the
  first capture because their filenames contained `#U00d7` and a literal `%20`;
  those were renamed and the reference re-captured before the numbers above.
