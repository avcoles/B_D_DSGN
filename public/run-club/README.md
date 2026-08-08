# Run Club: landing page rebuild

Reconstruction of a running-apparel storefront from a saved-page snapshot
(the HTML file plus its `_files` bundle), rebranded as **Run Club**. The
source is a custom Shopify theme built on a page-builder section system;
this is a hand-authored HTML/CSS/JS rebuild of the same design system, with
no Shopify, no jQuery and no Swiper.

## Running it

    npx -y serve public/run-club -l 5184

Or `preview_start` the `run-club` entry in `.claude/launch.json`.

## Design system

Read off the snapshot's stylesheet, not guessed.

**Colour.** The whole palette is five values:

| token | value | use |
|---|---|---|
| `--color-black` | `#171614` | all type |
| `--color-white` | `#ffffff` | page, header plate |
| `--gray-200` | `#eaeaec` | product-tile plate |
| `--gray-400` | `#e8e9eb` | (declared, unused on this page) |
| `--gray-600` | `#828282` | placeholders |

There is no accent colour. Every piece of colour on the page comes from a
photograph.

**Grid.** The page margin and the gutter are both 10px at every width. Only
the column count changes:

| | columns | header height | section gap |
|---|---|---|---|
| base | 4 | 47px | 30px |
| ≥ 768px | 8 | 56px | 50px |
| ≥ 1200px | 12 | 60px | 70px |

**Vertical rhythm.** One value, `--section-gap`, sets the distance between
every top-level section and doubles as the footer's top padding. The rule is
`.row + .row { margin-top: var(--section-gap) }`, so sections can be added,
removed or reordered without anyone having to remember a per-section margin.
Changing the token re-paces the whole page.

**Type.** One family, three weights, and a scale that stops at 40px:

| role | size (base / md / xl) | weight |
|---|---|---|
| hero + promo title | 20 / 32 / 40px, uppercase | 400 |
| section title | 16 / 16 / 18px | 400 |
| standfirst | 14 / 14 / 15px | 400 |
| product name, price | 13 / 13 / 14px | 400 |
| nav | 14px | 500 |
| footer labels | 11px, uppercase | 500 |

**Easing.** Four curves, taken verbatim from the source:

    --ease-out:   cubic-bezier(.215, .61, .355, 1)   swatch marker, cart
    --ease-expo:  cubic-bezier(.19, 1, .22, 1)       menu stagger, reveals
    --ease-inout: cubic-bezier(.645, .045, .355, 1)  underline, image scale
                  cubic-bezier(.25, .46, .45, .94)   swatch hover

**Hero art direction.** The hero photograph is 1.8:1 and cannot hold both
runners inside a 390px-wide window, so a `<picture>` serves a landscape
frame at 768px and up and a portrait negative below it. That mirrors what
the source theme did with the same shoot. The foot of the frame carries a
four-stop scrim rather than a flat wash: the concrete under the headline is
bright, and a single 30% layer left white type at about 2.2:1 against the
lightest patches. The ramp stays near zero through the runners and does all
its work in the bottom 17%, which measures 5.5:1 under the headline and
5.1:1 under the standfirst without visibly darkening the photograph.

**Bleeds.** The one structural trick on the page. Images break the page
margin with a negative `margin-left` plus a matching width increase, so a
figure reaches the viewport edge while its neighbours stay on the grid. The
About row uses it on both figures at once: the right panel's negative margin
closes the gutter so the two photographs butt together, and its extra width
carries the pair out to the right edge.

## Behaviour

`main.js` is about 100 lines and owns four things.

- **Header.** Two independent states. `--inverted` (white type) is on while a
  section marked `data-invert` is behind the bar. That is measured against
  the sections themselves rather than a scroll threshold, so reordering the
  page cannot desynchronise it. `--solid` (white plate) is on when scrolled
  *and* not inverted; the two are mutually exclusive, because the plate
  exists only to give black type something to sit on.
- **Overlays.** Search, mobile nav and cart share one mechanism that flips
  `aria-hidden` and `inert` together, so the screen-reader state and the
  keyboard state can never disagree. Opening one closes the others; Escape
  and any in-page link close all three.
- **Swatches.** The active marker is a single pseudo-element positioned from
  `--active-index`, so selecting a colourway is one custom-property write and
  the slide is the browser's.
- **Reveals.** Media enters at `scale(1.06)` and settles over 1.2s, once per
  figure, then the observer releases it.

## Typeface

PP Neue Montreal, the face the source theme used, self-hosted from `fonts/`.
The snapshot referenced it by relative URL only and shipped no font files;
these are supplied separately.

| cut | declared weight | used for |
|---|---|---|
| Thin | 100–200 | nothing; declared for completeness |
| Book | 300–400 | body, headlines, prices, standfirst |
| Medium | 500–600 | nav, footer labels |
| Bold | 700–900 | nothing; declared for completeness |

**Book claims the 300–400 band on purpose.** There is no Regular cut in this
set, and 400 is the weight nearly every element asks for. Left unqualified,
CSS font matching answers a 400 request with Medium, because for a desired
weight of exactly 400 it checks 500 before it checks anything lighter. The
whole page would render one step heavy. Book is the closer neighbour in
practice: it is this family's text weight, Medium its emphasis weight.

Only Book and Medium are ever requested, so the browser fetches two files
(249KB) and ignores the other two. They are OTF rather than WOFF2 because no
conversion tool was available here; converting would cut the transfer by
roughly half and is the obvious first optimisation.

The showcase chrome loads Book and Medium separately from `src/fonts/`, so
the type specimens render in the real face rather than describing it.

Self-hosting redistributes the font files with the site, which needs a
webfont licence rather than a desktop one.

## Known deviations

- **The photography is the source snapshot's and carries its wordmark.**
  The old brand name is printed on the garments, embroidered on the caps and
  taped across the shipping boxes. Removing the full-bleed band under the
  hero took out the most legible instance, but the prints on the tees and the
  script on the blue cap are still readable. Every file in `assets/` has to be
  replaced with commissioned or licensed photography before this goes
  anywhere real. Nothing in the markup, the CSS or the copy refers to the old
  brand.
- **Two background videos are stills.** The source plays video under the hero
  and in the right-hand About panel; both were hosted on the Shopify CDN and
  are not in the snapshot. The hero band has been cut from this rebuild; the
  About panel takes a photograph at the same aspect ratio.
- **Colour swatches do not change the product image.** The snapshot shipped
  one photograph per product, not one per colourway. The marker slides and
  the pressed state updates; the image stays.
- **Three photographs are used twice.** Ten editorial slots, seven distinct
  images. The portrait hero negative is the same frame as the About panel,
  and the cap and the lookbook shot each appear once more in the four
  service cards.
- **The hero photograph tops out at 1440px.** It fills a full-viewport hero,
  so it upscales on a 1920-wide display. The portrait variant served below
  768px is 768px wide and is the softer of the two.
- **Both runners in the hero wear visibly branded shoes.** The three stripes
  read clearly at desktop size. Same problem as the wordmark above, different
  brand, and the same fix: commissioned photography.
- **Cart, search and account are chrome only.** They open, close and trap
  nothing; there is no cart state behind them.
- **Product names, prices and copy are invented** for the rebrand. Prices are
  carried over from the source at their original values purely to keep the
  column widths honest.

## Snapshot notes

The saved page arrived mostly intact. One browser extension had injected
several `<style>` blocks and a `div.grammarly-desktop-integration` node into
the serialised HTML, and non-ASCII characters throughout the copy were
mojibaked (`Montreal’s` became `Montrealâ€™s`). Both were dealt with by
re-authoring rather than repairing, since nothing from the snapshot's markup
is used directly.
