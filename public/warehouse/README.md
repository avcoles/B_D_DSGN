# Warehouse: landing page rebuild

Reconstruction of a structural-glazing site from a saved-page snapshot (the HTML
file plus its `_files` bundle), rebranded as **Warehouse**. The source is a Nuxt
3 / Vue application with Storyblok behind it, running GSAP 3.13 (ScrollTrigger,
SplitText, DrawSVG) on top of Lenis. This is a hand-authored HTML/CSS/JS rebuild
of the same design system: no Nuxt, no Vue, no GSAP, no Lenis.

## Running it

    npx -y serve public/warehouse -l 5189

Or `preview_start` the `warehouse` entry in `.claude/launch.json`. The snapshot
itself is served by the `wh-snapshot` entry, which is what the numbers below
were measured against.

## The unit

One thing governs the whole page:

    --font-s: calc((100vw / var(--size)) * 10);
    html { font-size: var(--font-s); }

`--size` is 1600 above 600px wide and 375 below it. So `1rem` is exactly 10px at
a 1600px viewport and exactly 10px at a 375px viewport, and every value in
between is a proportion of the window. Type, gutters, grid gaps, image sizes and
section padding are all authored in `rem` and therefore all scale together.

The practical consequence is that **the layout has no intermediate states**.
There are two designs, one at each side of the 600/601 boundary, and each is
drawn at 1:1 and then scaled. It also means text either fits a line at every
width or at none, which is what makes the hard-authored line breaks below safe.

## Design system

Read off the snapshot's stylesheet, not guessed.

**Colour.** Five values and no accent:

| token | value | use |
|---|---|---|
| `--color-black` | `#0b1012` | button plates, footer ground |
| `--color-white` | `#fff` | type on dark |
| `--color-cream` | `#f3f0ec` | the page |
| `--color-taupe` | `#d4cec6` | declared; unused on this page |
| `--color-grey` | `#212325` | all body type, dark sections |

Every border, dim state and translucent plate on the page is one of these five
run through `color-mix` at 10, 20, 40, 60 or 80 percent. There is no sixth
colour and no shadow anywhere.

**Grid.** 24 columns above 601px, 6 below, with a 2rem gutter and a 4rem page
margin (1.5rem and 2rem on mobile). Sections opt in individually — several are
flex, and the collection tiles are placed by explicit `grid-column` spans that
deliberately overlap, which is what pushes the fourth tile onto a second row.

**Type.** Two families, four cuts, and a scale that only ever takes six values:

| role | size | family | tracking |
|---|---|---|---|
| display heading | 6.4rem | Pro 400 | -0.03em |
| section heading | 4rem | Pro 400 | -0.02em |
| menu link | 3.2rem | Pro 400 | -0.02em |
| sub-heading, quotee | 2.4rem | Pro 400 | — |
| body, standfirst | 1.6 / 1.8rem | Pro 400 | — |
| section name | 1.4rem | Mono 600 | 0.1em, uppercase |
| label, button, chip | 1.2rem | Mono 500 | 0.08em, uppercase |

Display sizes drop to 4rem / 3.2rem below 600px. Nothing on the page is bold:
`strong { font-weight: 400 }` in the reset, so the emphasis in the collection
standfirst is semantic only.

**Easing.** Seven curves are declared as custom properties and the page draws
from that set rather than inventing curves per component:

    --ease-in-out-quart  cubic-bezier(.77, 0, .175, 1)      slot swaps, menu plate
    --ease-in-out-cubic  cubic-bezier(.645, .045, .355, 1)
    --ease-in-out-quad   cubic-bezier(.455, .03, .515, .955)
    --ease-out-quart     cubic-bezier(.165, .84, .44, 1)    line reveals, hovers
    --ease-out-cubic     cubic-bezier(.215, .61, .355, 1)
    --ease-out-quad      cubic-bezier(.25, .46, .45, .94)   opacity states
    --ease-none          cubic-bezier(.25, .25, .75, .75)

## Structure

The document never scrolls. `body` and `html` are `position: fixed; inset: 0;
overflow: hidden`, and the page lives inside `.scroll`, a fixed full-bleed pane
with `overflow-y: auto`. That is why the bottom bar, the menu and the cursor can
be `position: fixed` without ever compositing against a scrolling root, and it
is why every measurement in `main.js` reads `.scroll.scrollTop` rather than
`window.scrollY`.

Ten sections, in order: page header (the wordmark, absolutely positioned over
the hero), hero, text CTA, collection, showroom banner, featured projects, image
pair, quotes, closing CTA, footer.

## Behaviour

`main.js` is about 400 lines and owns five things.

- **Damped scrolling.** Lenis in thirty lines. A wheel event moves a target; the
  rendered position chases it exponentially with a frame-rate-independent
  coefficient, so the page keeps gliding after the wheel stops. Touch and
  keyboard are left to the browser, which is what Lenis does by default, and any
  scroll position we did not write ourselves resyncs the target so the two can
  never fight each other.
- **Scrubbed transforms.** Six effects, each registering a `measure` pass that
  caches its scroll range and an `apply` pass that takes that range's progress.
  Splitting them is what keeps the per-frame pass from reading layout. Because
  `rem` is a fraction of the viewport, pixel offsets taken from the snapshot are
  re-derived at the current width rather than hard-coded.
- **Reveals.** Split headings rise into their masks once, on an
  IntersectionObserver with a -15% bottom margin, and are then released.
- **Bar and menu.** One state class on `body` drives both. The plate behind the
  bar widens from 27.6rem to the menu's 40rem as the menu's own plate scales up
  out of the bar's bottom edge, so the two never read as separate surfaces.
- **Quote slider.** Five quotes stacked in one grid cell with one visible.

### How the motion was recovered

The snapshot preserved only one of the site's script chunks, and it is the
vendor bundle — GSAP core, ScrollTrigger, SplitText and DrawSVG, but none of the
site's own tween code. What survived instead is the inline style GSAP had
written to each element at the instant the page was saved, and that turned out
to be enough, because the page had only just loaded: every scroll-driven element
below the fold was still frozen at its start value.

| element | frozen inline value | read as |
|---|---|---|
| hero image | `translate(0%, 2.6385%)` | mid-scrub, see below |
| scroll indicator | `opacity: 0.7361` | mid-scrub, see below |
| collection tile 2 | `translate(0%, 50%)` | start; settles to 0 |
| collection tile 3 | `translate(0%, -50%)` | start; settles to 0 |
| showroom rule | `scale(0, 1)` | start; wipes to full width |
| showroom columns | `translate(±91.8531px, 0)` | start; spreads to 0 |
| showroom video | `scale(0.55)`, `opacity: 0.7` | start; grows to full bleed |
| footer plate | `translate(0%, -50%)` | start; settles to 0 |

The hero is the one that confirms the whole reading. Its two frozen numbers are
the same moment on two different curves: `1 - 0.7361 = 0.2639`, and
`0.2639 x 10 = 2.639`. So the image travels a flat 10% down its frame while the
indicator fades out, both driven by one progress value. The rebuild reproduces
that pair to four decimal places at the same progress.

What the frozen state does **not** give is the length of each scroll range, only
the start and end values. Those lengths are inferred, and they are conventional
choices: a section's own height for the hero, the section crossing the viewport
for the tiles and the image pair, the sticky overhang for the showroom, and one
viewport of approach for the footer.

## Typefaces

The source sets everything in **Aeonik Pro** (400/700) and **Aeonik Mono**
(500/600), which are licensed from CoType and were referenced by absolute URL —
no font files are in the snapshot. Both are substituted:

| source | substitute | why |
|---|---|---|
| Aeonik Pro | **Figtree** 400/700 | neutral geometric grotesque, single-storey `g`, which is the most visible letter at 6.4rem |
| Aeonik Mono | **Roboto Mono** 500/600 | only ever appears as tracked uppercase at 12–14px, where a neutral mono is indistinguishable |

Figtree is a little wider than Aeonik. Since the display headings are split into
hard-authored lines, three lines overflowed their measure and the copy on those
lines was recomposed to fit rather than being allowed to wrap — see below.

## Known deviations

- **The copy is rewritten and the brand is invented.** Nothing in the markup,
  the CSS or the copy refers to the original company. Project names, product
  names and the standfirsts are new. The address block and phone number are
  carried over unchanged purely to keep the column widths honest, and are not a
  real address for anything.
- **Quotes are invented and unattributed.** The source ran five real, named
  testimonials with four accompanying headshots. Putting invented words in a
  real person's mouth, or an invented name under a real person's face, is not a
  substitution this rebuild is willing to make, so the quotes are written fresh
  and attributed by role and place instead of by name. The four portraits are
  dropped with them. **This costs no desktop fidelity**: the portrait is
  `position: absolute` in that layout, and the source itself ships an imageless
  fifth quote, so an empty portrait slot is a first-class state of the
  component rather than a compromise. On mobile the portrait is an inline
  element and its absence closes up a 5.9rem column.
- **The quote stack height is derived, not copied.** The snapshot froze
  `.blocks` at `height: 810px`. No quote on the page measures that — the five
  run 381, 317, 509, 573 and 573 — so the number cannot be reproduced from the
  content and is most likely a transient caught mid-transition. The stack takes
  the tallest quote instead, which is the only choice that keeps everything
  below it still while you page through. This is the single largest difference
  from the snapshot: it makes the page 237px shorter.
- **Heading lines are composed to fit Figtree, which is wider than Aeonik.**
  Every display line is authored, measured against its own column, and rewritten
  where it overflowed rather than allowed to wrap, so each heading keeps the line
  count its section's height depends on: four lines in the text CTA, and 4, 3, 6,
  7 and 7 across the five quotes. Because the whole page scales with the
  viewport, a line that fits at one width fits at all of them above 601px.
- **Below 600px the authored lines wrap.** The source re-splits its headings per
  breakpoint at runtime; this rebuild authors the desktop split once. The mobile
  layout has a different measure, so some lines take two visual rows inside
  their mask. The reveal still animates per authored line, and the masks grow to
  suit, but the mobile line composition is not the source's.
- **Two background videos are stills.** The source plays Vimeo files under the
  hero and behind the showroom banner. Both were hosted on Vimeo's CDN and are
  not in the snapshot, so each takes the poster frame the snapshot did preserve,
  at the same box and the same object-fit.
- **The wordmark is set type, not a logotype.** The source drew its name as a
  traced SVG, 140 x 30px in the header and a 1523 x 254px mask in the footer,
  and it is considerably more condensed than any face will set. The rebuild
  matches the 3rem header slot and lands within 7px of the footer mask's width,
  but the header wordmark is about 12% wider than the slot it replaces. The
  footer effect is rebuilt as `background-clip: text` over the same photograph
  with the same 20% white wash and 30% opacity, which composites identically and
  survives the rename.
- **The photography is the source snapshot's.** Fourteen images, all of them the
  original site's project and product photography. Every file in `assets/` has
  to be replaced with commissioned or licensed photography before this goes
  anywhere real.
- **The two image-pair photographs are oversized.** They ship at 3200 x 4800 for
  a box that is at most 742px wide, which is 1.9MB of the page's 3.3MB. Resizing
  them to 1600px wide is the obvious first optimisation and would roughly halve
  the page.
- **The SVG draw-on is not reproduced.** DrawSVG is in the vendor bundle and the
  button arrows carry its dash values — the shaft at `18.5px, 0.1px`, which is
  fully drawn, and the diamond at `11.1213px, 11.2213px`, which is half — but
  what triggered the draw is in the missing chunk. Rather than invent a trigger
  and risk a wrong resting state, the arrows are simply drawn and the hover is
  carried by the label slide alone.
- **Cart, search, the video player and the cookie banner are absent.** The
  snapshot contains scoped CSS for a filter panel, a video player, a quote panel
  and a cookie notice that this page never renders. They are not rebuilt.
- **Links are in-page.** Every navigation target is an anchor to a section on
  this page; there are no other pages.

## Snapshot notes

The saved HTML nests `<div class="line-mask">` inside `<p class="base-heading">`.
That is valid in the live DOM — SplitText builds those nodes at runtime — but it
is not valid HTML, so re-parsing the saved file ejects every split line out of
its heading and the headings collapse to about a tenth of their height. Any
measurement taken from the snapshot without repairing that first is wrong; the
ground-truth geometry this rebuild was verified against was taken after moving
the lines back. The rebuild avoids the problem by using `<span>` for the masks,
which a `<p>` may legally contain.
