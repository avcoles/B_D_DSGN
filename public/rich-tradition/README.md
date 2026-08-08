# Rich Tradition: landing page rebuild

Reconstruction of a Spanish preserved-foods brand's homepage from a
saved-page snapshot (the HTML file plus its `_files` bundle), rebranded
as **Rich Tradition** and translated from Spanish into English. The
source is a Nuxt 2 single-page app driven by Prismic, with GSAP,
Locomotive Scroll and a per-component scoped-CSS build; this is a
hand-authored HTML/CSS/JS rebuild of the same design system with no
framework, no CMS and no animation library.

## Running it

    npx -y serve public/rich-tradition -l 5186

Or `preview_start` the `rich-tradition` entry in `.claude/launch.json`.

## Design system

Read off the snapshot's stylesheet, not guessed. The source ships its
base layer and forty-odd scoped component blocks inline in the saved
HTML, so every number below is a measured value.

**Colour.** Six tokens, and the page never draws anything that is not
one of them or a photograph:

| token | value | use |
|---|---|---|
| `--c-bg` | `#fbf5e7` | the cream page |
| `--c-text-alt` | `#fbf5e7` | the same cream, as type over photography |
| `--c-accent` | `#d70321` | every headline, the plate, the menu field |
| `--c-secondary` | `#cba058` | nav, ornament, and type on red |
| `--c-accent-dark` | `#9f0005` | declared; unused on this page |
| `--c-placeholder` | `#363636` | declared; unused on this page |

`--text-color` is a seventh, and the interesting one: it is an alias
that defaults to the red and is re-pointed per section, so anything
that has to re-key itself against a changing background reads that
instead of the palette.

**The scale.** `html { font-size: 10px }`, and then every size on the
page — type, spacing, columns, the ornament — is the same clamp shape:

    max(<rem floor>, min(<vw middle>, <rem ceiling>))

A floor so nothing collapses on a phone, a viewport middle so the page
tracks the window, a ceiling so it stops growing on a 5K display. There
is not one size-specific media query in the type system.

| step | size | leading |
|---|---|---|
| `fs-340` | `max(7rem, min(17vw, 34rem))` | 85% |
| `fs-300` | `max(8rem, min(15vw, 30rem))` | 85% |
| `fs-260` | `max(7rem, min(13vw, 26rem))` | 85% |
| `fs-240` | `max(10rem, min(10vw, 24rem))` | 85% |
| `fs-110` | `max(6rem, min(6vw, 11rem))` | 90% |
| `fs-90` | `max(5rem, min(5vw, 9rem))` | 90% |
| `fs-35` | `max(2rem, min(2vw, 3.5rem))` | 100% |
| `fs-24` | `max(1.6rem, min(1.6vw, 2.4rem))` | 100% |
| `fs-20` | `max(1.6rem, min(1.8vw, 2rem))` | 100% |
| body | `max(2rem, min(2vw, 3rem))` | 100% |

Nine spacing steps (`sp-200` down to `sp-14`) use the identical shape as
`margin-bottom` only. Spacing belongs to the element above the gap, so
sections can be reordered without anyone auditing margins.

**Grid.** Column count and page width both move; the ratio does not.

| | columns | gutter | page width |
|---|---|---|---|
| base | 4 | 2rem | 90vw |
| ≥ 960px | 8 | 2rem | 95vw |
| ≥ 1280px | 12 | `max(2rem, min(2vw, 4rem))` | 96vw |

`--offset` is derived — `(100vw − --width) / 2` — and is reused as the
nav's padding and the hero's bottom inset, so the page margin and the
chrome inset can never drift apart. `--col-1` … `--col-12` are computed
from the same three numbers, which is why an element can be given an
exact span at any breakpoint.

**Easing.** Effectively one curve:

    --ease-expo:  cubic-bezier(.19, 1, .22, 1)     almost everything
    --ease-quart: cubic-bezier(.165, .84, .44, 1)  the ornament pop
    --ease-snap:  cubic-bezier(1, 0, 0, 1)         the plate's first move

**Radii.** One: `--radius: 2rem`, plus the cards' own
`max(1.5rem, min(1.5vw, 3rem))`.

## Behaviour

`main.js` is about 300 lines and owns seven things. Everything animated
is animated by CSS; the script only ever adds a class or writes a custom
property.

- **Split text.** The page's signature move, and the only genuinely
  tricky piece. Headlines are cut into characters, paragraphs into
  measured lines, each piece inside a mask that clips it while it rises
  from 115% below. The stagger is arithmetic, not scripted:

      delay = --index * --stagger + --delay * --speed

  with `--speed: 1.25s` and `--stagger: .025s` for characters, `.1s` for
  lines. A headline's own `--delay` pushes its whole run back without
  disturbing the per-character rhythm, which is how the hero's three
  lines are choreographed against each other with one number apiece.

  Characters are deterministic and could be cut once. Lines are not —
  where a line breaks depends on the box — so line splitting waits for
  `document.fonts.ready` and re-runs on a width change. Splitting against
  the fallback face produces masks of the wrong height and breaks in the
  wrong places. Height changes are ignored, so mobile URL-bar scroll does
  not trigger a reflow.

- **Observation.** One `IntersectionObserver` drives every reveal on the
  page. `data-observe` marks an element as watched, `data-observe="once"`
  releases it after it lands, and everything downstream is a CSS rule
  hanging off `.is-inview`. A new reveal costs an attribute.

- **Media.** Each photograph is two stacked layers in one grid area: a
  blurred copy underneath, the real picture on top at opacity 0 until it
  decodes. Images resolve out of their own blur rather than popping in
  against the cream.

- **The plate.** The red block at the top centre is both the wordmark's
  ground and the menu button. Past 80px of scroll it narrows to a sliver,
  the inner gap collapses, the lockup rides up out of the top and the
  monogram fades in behind it — four transitions on three elements,
  staggered against each other in CSS off one class.

- **The menu.** `aria-hidden` and `inert` move together, so the
  screen-reader state and the keyboard state cannot disagree. Escape and
  any in-page link close it. The hamburger's two rules pinch toward each
  other and tilt rather than crossing — an X would say "close window";
  this says "put it back".

- **The cursor.** A gold disc carrying its own verb, over elements that
  opt in with `data-cursor-text`. Positioned by two custom properties
  rather than a `transform` write per pointer move.

- **The showcase.** Two independent axes. Format decides which pack you
  are looking at; filling decides the colour of the panel, and
  `--text-color` rides with the background so the type and the tab
  underlines re-key themselves without a second rule. Both throw the jar
  off one edge and bring it back from the other, and the direction is
  read from which control moved.

Three motion pieces are worth naming because they are pure CSS:

- **The card fan.** Three photographs stacked in one box, rotated apart
  (+12°, −30°, −14°). On entry the outer two translate a full width out
  and counter-rotate while the centre levels — two seconds, one curve.
- **The tasting ribbons.** A `clip-path` that unfolds. Closed, the
  notches are parked at 12%/88% and the button is squeezed to
  `scaleX(.8)`; open, the notches travel out past the edges into a double
  chevron. The label only fades in after the shape has settled, so the
  geometry reads first and the word second.
- **The stack.** The table photograph, the product panel and the award
  section are three sticky layers on ascending z-indexes. Each holds for
  a screen while the next rises over it. There is no scroll library and
  no pinning maths — it is `position: sticky` and a z-index each.

## Font substitution

The source's typeface ships as `super-med` and `super-reg`, referenced by
relative URL only (`/fonts/super-med.woff2`). Neither file is in the
snapshot and neither is licensable from it.

| Source | Substitute | Licence |
|---|---|---|
| `super-med` | Anton, single weight | OFL |
| `super-reg` | — (declared, never loads) | — |

Only `super-med` is actually used. `super-reg` appears in the font list
and in an `@font-face` rule, but no element on the page ever requests
it, and the source runs weight 400 across headings, body, nav and
buttons alike. The page is genuinely one face at one weight, so Anton is
a closer structural match than a variable family would be: it has no
axes to reach for, and size, case and tracking carry the entire
hierarchy.

Anton is narrower than the face it replaces and its capitals stand
taller in the em, so two compensations are needed. Both are named and
both live in one place each:

- `--display-fill: 1.05` multiplies the display steps. At the source's
  own sizes Anton stops short of the page edge, and the page is built on
  headlines that reach it. It stays modest because the tall capitals
  already read as large and every point of size costs height twice over.
  Below 960px it drops to 1: the display steps sit on their rem floors
  there, and multiplying a floor overflows the screen.
- `--display-leading: 1.02` replaces the source's 85%. Anton's capitals
  measure **0.87 of the em**, against roughly 0.55 for the source cut,
  so anything under 87% seats one line of capitals inside the one above
  it. 1.02 leaves a gap of about a sixth of the cap height, which is as
  tight as this face goes. The same floor applies to the line-split
  headings, whose leading is set per element: the showcase title and the
  award heading were on 85% and 90% and both had to come up.

The line masks also gained an 8% bottom inset. Anton's `Q` has a tail
that a flush mask cuts off, and 8% is well short of the 115% a waiting
line sits at, so the mask still hides one.

Tracking runs the opposite way from a variable face. Rather than pulling
the display sizes tight, the small sizes are opened up: `.02em` on body,
`.14em` on labels, zero on display, and a `.08em` word space so two
words at 230px do not weld together.

Archivo was chosen for the traits that actually matter at 34rem: a
truncated flat apex on the `A`, a straight splayed leg on the `R`,
horizontal terminals, and counters small enough to survive a 900 weight.
The width axis is what lets one family stand in for a face the page uses
at every size — display type runs at `wdth 92 / wght 880`, body at
`wdth 94 / wght 800`, the standing claims at `wdth 84`, and the two
wordmark lines are narrowed independently so they finish flush.

Two compensations were needed and are worth knowing about if the real
face is ever licensed:

- `letter-spacing: -.022em` on the display steps. Archivo sets looser
  than the source cut.
- `word-spacing: .06em` alongside it. Negative tracking eats the word
  space along with everything else, and at 190px a lost space welds two
  words together.

Both live on one rule in `styles.css`; drop them and swap `--ff` if you
license the original.

## Known deviations

- **The photography is the source snapshot's and carries its wordmark.**
  The old brand name is embossed on every jar lid, printed on every
  label and moulded into the product shot that anchors the showcase.
  Every file in `assets/` has to be replaced with commissioned or
  licensed photography before this goes anywhere real. Nothing in the
  markup, the CSS or the copy refers to the old brand.
- **`assets/award.png` is the worst instance of that.** It is not a
  photograph but a marketing card carrying the old logotype, the old
  Spanish headline and a screenshot of the source site inside a laptop.
  It is kept because the section is built around an image at that aspect
  ratio and the layout should be judged with one in place. It is the
  first asset to replace.
- **One product image for sixteen products.** Four formats × four
  fillings, and the snapshot saved a single pack shot. The tabs are fully
  wired — active states move, the panel colour crossfades, the jar
  throws out and returns, the alt text updates — but the photograph does
  not change. The four filling colours are invented; only the yellow
  (`#ffb82e`) is measured from the source.
- **The intro is a curtain, not a loader.** The source morphs an SVG
  logotype through four states while the Nuxt bundle boots. There is no
  bundle here, so the curtain holds for the hero photograph and lifts on
  a 2.6s ceiling.
- **The nav, footer and menu links are in-page anchors.** This is one
  page; the source is four.
- **The copy is written for the template, not translated.** An earlier
  pass rendered the Spanish original into English close to literally.
  That read as one producer's story rather than as a page anyone could
  take, so it was replaced: the headlines, the standfirst, the CTAs and
  the awards section are now original and carry no place name, no family
  anecdote and no borrowed prize list. One device is lost in the move.
  The source is bilingual on purpose, with Spanish carrying the heritage
  copy and a short English label beside it, which is how a regional
  producer signals it ships beyond its region. A single-language page
  cannot do that.
- **The rural-development funding block is cut.** The source closes its
  footer with an EU co-financing notice, two government emblems and
  their captions — a real disclosure obligation for that producer, and
  not one this template inherits. Removing it takes the footer's last
  rule and its only small-caption tier with it, so the footer now ends
  on the legal links and the copyright line. If a real producer needs
  the notice back, it was a `.footer__fondo` block between the two.

## Snapshot notes

The saved page arrived in reasonable shape but needed sorting out. Two
browser extensions had injected style blocks and shadow-root nodes into
the serialised HTML — one of them a 39KB Tailwind build that has nothing
to do with the site, which is a good trap to avoid mistaking for the
source's stylesheet. The real base layer is an 11KB inline block; the
component styles are thirty-seven further scoped blocks, each tagged
with its own `data-v-*` hash.

The markup itself was post-hydration, so every headline arrived already
exploded into per-character `<div>`s and every paragraph into measured
line boxes. None of it is used directly — the DOM was read to recover
the structure and the copy, and the page was re-authored from the CSS.

The product taxonomy could not be recovered at all: formats and fillings
come from the Prismic API at runtime, and the only network responses in
the bundle are analytics.
