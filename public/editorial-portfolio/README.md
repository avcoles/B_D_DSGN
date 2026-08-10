# Editorial Portfolio: landing page rebuild

Reconstruction of a digital artist's index page from a saved-page snapshot
(the HTML file plus its `_files` bundle), rebranded as **Editorial
Portfolio**. The source is a Nuxt 2 single-page app on DatoCMS running
Tailwind 2, GSAP, GSAP Flip and a CustomEase plugin. This is a
hand-authored HTML/CSS/JS rebuild of the same design system with no
framework, no CMS and no animation library.

The snapshot is of the site's `/list` route, which is the index seen as a
list of names rather than as a carousel of covers.

## Running it

    npx -y serve public/editorial-portfolio -l 5187

Or `preview_start` the `editorial-portfolio` entry in `.claude/launch.json`.

## Before this goes anywhere public

The page is set in **Dia**, by Schick Toikka, and the files in `fonts/` are
trial cuts. The Schick Toikka trial licence covers internal testing,
evaluation and presentation. It rules out websites by name, including any
site whose code refers to the trial files or renders text in them. Buy the
retail licence at schick-toikka.com before this is deployed, or swap the
`@font-face` block at the top of `styles.css`.

The trial subset is A to Z, a to z, 0 to 9, and five punctuation marks. The
colon in the clock, the arrows in the contact panel and the @ in the
address all fall through to the next face in the stack. At 18px it is
invisible. It would not be at 70px, which is why the contact headline is
written without a question mark.

## The page in one paragraph

Nothing scrolls. The whole site is one fixed screen: a header pinned to the
top in difference blend mode, a wordmark lying along the floor at full
width, eleven project names floating over the middle in a three-quarter
width block, and a single 4:5 photograph in the left margin that changes to
whichever project you are pointing at. Every link sits at 25% black and
comes up to 100%. That is all the hover behaviour there is.

## Design system

Read off the snapshot's stylesheet rather than guessed. The source ships
Tailwind 2 with a custom theme plus a small hand-written layer, and every
number below is a measured value.

**Colour.** Two, and a third that only the contact panel draws:

| token | value | use |
|---|---|---|
| ink | `#000000` | all type |
| paper | `#ffffff` | the page |
| brown | `rgb(177 104 77)` | the contact panel, nothing else |
| gray-2 | `#868686` | declared, unused on this page |
| selection | `#d8d8d8` | text selection |

The header carries no colour of its own. It is set in white and painted
with `mix-blend-mode: difference`, so it reads black against the page and
inverts the instant the black menu field or a photograph passes underneath.
One header covers every background the site can produce, and no script has
to watch what is behind it.

**The scale.** No fixed root size and no type-specific media query:

    font-size: calc(1000vw / var(--size))          /* --size: 390  */
    font-size: clamp(7px, 14px, 1000vw / --size)   /* --size: 1500, ≥650px */

`--size` is the width the design was drawn at, so 1rem is a thousandth of
the viewport in those units and a 5.8rem headline is always 5.8/1500 of the
screen. The desktop clamp reads backwards until you notice the *preferred*
value is the constant one: under a 2100px viewport the page tracks the
window, over it the root freezes at 14px.

| step | value | use |
|---|---|---|
| `1.8rem` | 18px @ 1500 | body, nav, list of links, clock |
| `4rem` / `7rem` | 40 / 70px | contact headline |
| `5.8rem` | 58px @ 1500 | the project list |
| `6rem` | 60px | mobile menu |
| `9.5rem` | 95px | contact field height |

Leading is 1.25 on the list, 1.05 on the two headline tiers, 1.5 on body.
Nothing is tracked except the wordmark.

**Grid.** One breakpoint, at 650px, moving three things at once:

| | columns | gutter | page padding |
|---|---|---|---|
| base | 6 | 7rem | 2rem |
| ≥ 650px | 12 | 2.4rem | 5rem |

The gutter runs opposite to the column count on purpose: six columns of a
phone need air between them, twelve of a desktop need edges to align
against. The page padding is declared once for the grid, the container and
the gutter helper, so the header inset, the list and the wordmark cannot
drift apart.

At 1500px the list is `col-start-5 / span 8`, which is 915px starting at
520px, and the thumbnail is `span 2` with 3rem of trailing padding, putting
a 181px photograph in the left margin.

**Easing.** Two curves, both from the source's own CustomEase definitions:

    --ease-gil:   cubic-bezier(.549, .054, .014, 1)    the intro
    --ease-rise:  cubic-bezier(.075, .82, .165, 1)     the list, the wipe
    --ease-uline: cubic-bezier(.785, .135, .15, .86)   the underline

**Radii.** Zero everywhere, except the two pills in the contact panel at
`9999px`.

## Behaviour

`main.js` is about 250 lines and owns five things. None of it animates
anything: every move on the page is a CSS transition, and the script only
adds a class or writes a custom property.

- **The intro.** The signature move, and the only genuinely tricky piece.
  The wordmark is born small and centred, its letters rise into it one at a
  time, the two words part, and the lockup flips down to the floor at full
  size.

  It is built backwards. The wordmark is laid out at its destination, on
  the floor at full width, and the *start* is expressed as one transform
  per word, measured against two empty boxes centred in the viewport that
  draw nothing. Playing the intro removes that transform and the browser
  interpolates the whole journey in one composited step, with no per-frame
  measurement and no layout thrash.

  The source's own numbers drive it, and the schedule is derived from them
  rather than typed out twice:

      letters   1.3s each, 70ms apart          → ends at 2.0s
      parting   1s, starting 0.5s before that  → 1.5s
      the flip  1.5s, starting 0.5s after      → 2.0s

  The parting is the piece that is easy to get backwards. The two small
  boxes are pushed 12.5rem apart *before* the wordmark flips, so the flip's
  start position is the parted one, and the column begins at +12.5rem and
  travels to zero while the word's own transform targets the box it will
  have arrived in.

  Arming waits on `document.fonts.ready`, because the face decides the
  wordmark's width and the width is the flip's scale factor. The wait is
  capped at 1.2s. A slightly wrong scale is a much smaller failure than two
  seconds of blank white.

- **The stack.** Eleven photographs in one 4:5 box, all painted, none
  hidden. What you see is whichever one is on top, so pointing at a project
  costs a single z-index write on its own image. There is no crossfade to
  schedule and no previous state to unwind, and the pile cannot end up
  showing two things at once. The counter only goes up, which keeps the
  most recently entered image in front of everything entered before it.

  The lit name and the raised photograph are one piece of state, and it
  persists. The last project entered stays lit after the pointer leaves, so
  the page always has one project selected and the thumbnail always has
  something to show. That is why it is a class and not a `:hover` rule.

- **The clock.** Lisbon, to the minute, with a colon that blinks on the
  second. The next tick is scheduled for the top of the following minute
  instead of every second, so the page holds one timer. On a screen that
  never scrolls it is the only thing showing the page is live.

- **The menu.** A black field on small screens. `aria-hidden` and the open
  class move together so the screen-reader state and the visual state
  cannot disagree, and the header swaps its three disciplines for the name
  while the field is up.

- **Contact.** A wipe rather than a fade. Two corner percentages drive one
  `clip-path` polygon at different speeds, the left edge in 1s and the
  right in 1.25s, so the panel is never a rectangle while it moves. Both
  are registered with `@property`, which is what makes them animatable at
  all. As plain custom properties they would jump from 0% to 100%.

Three smaller pieces are worth naming because they are pure CSS:

- **The double underline.** Two rules in the same place. At rest the first
  is drawn and the second is not. On hover the drawn one wipes out to the
  right while the other wipes in from the left a fifth of a second behind,
  so the line looks redrawn rather than switched off and on. Leaving
  reverses it after half a second, which stops a fast pass across the
  button from flickering.
- **The arrow.** It never moves. A second copy of it does, sliding in from
  the left as the first slides out to the right, 100ms apart.
- **The pill.** A circle clipped from nothing to half the box, growing the
  button's inverse out from its centre. On a 1:1 element it reaches the
  corners exactly as it finishes.

## Type substitution

The source's three faces are all commercially licensed and none of the
files are in the snapshot. One face replaces all of them.

| Source | Replacement | Terms |
|---|---|---|
| ABC Diatype Medium (`dia`) | Dia Regular, Schick Toikka | trial, see above |
| Respira Black Italic (`respira`) | Dia Regular | trial, see above |
| Inferi Normal Italic (`inf`) | none, unused here | |

Dia sets the whole page at one weight: the nav, the list, the clock, the
form and both halves of the wordmark. Its cap height is 0.6275 of the em
and its x-height 0.4775, both shorter than most grotesques, and those are
the numbers the wordmark is fitted against. The italic cut ships in
`fonts/` and is declared, but nothing on the page currently draws it.

That collapses the source's own pairing. Its lockup runs a grotesque
against a high-contrast display italic, and here both words are the same
cut at different sizes. The rest of the page is unaffected, since the
source only ever used one face for it.

### The wordmark

The source's lockup is outlined SVG, one path per letter, drawn as
artwork. This is live text, which is what makes the per-letter intro
possible without shipping a second copy of the artwork. Outlines have no
side bearings and no leading; live type has both. Three values per word
close the gap, and none of them is a preference:

| | word one | word two |
|---|---|---|
| `font-size` | `47.51cqw` | `40.68cqw` |
| `margin-block` | `-0.1608em / -0.1883em` | `-0.2921em / -0.1864em` |
| `margin-inline` | `-0.0165em / -0.09em` | `-0.0465em / -0.085em` |

**The width is justified, not tracked.** Fitting live type to a fixed box
by hand means solving for a letter-spacing value, and that value is wrong
the moment the word, the face or the column changes. The word is a flex
row of letter boxes with `justify-content: space-between`, so every
leftover pixel goes to the gaps between letters and the ink lands on the
page margin by construction. The two font sizes only have to be close,
and both sit a hair under the natural fit so there is always a small
positive amount to distribute rather than an overflow to clip. They are
tuned against each other so the two words carry the same letter gap,
3.75px and 3.82px at a 1500px screen, rather than one reading looser than
the other.

The inline margins cancel the outer side bearings, measured by scanning
the rendered glyphs pixel by pixel rather than trusting the font's
reported bounds. Without them the glyph box lands on the page margin and
the ink sits a couple of pixels inside it.

**The block margins are solved for a baseline.** `line-height: 1` puts
the baseline at 0.8 of the em in this face, so a word set larger has its
baseline further down its own box, and an even trim would leave the second
word floating several pixels high. The top margin is solved so both
baselines land 170.3px below the shared column top; the bottom margin is
whatever is left to make the box the height the source's artboard was. The
intro leans on this. Both words are anchored off the lockup rather than
centred in their own stage boxes, so a baseline they share at rest is one
they hold through the entire flip, measured at 0.08px apart at rest, in
the small centred state and after the parting.

The sizes are in `cqw`, a share of the word's own column rather than of
the viewport, because that is what an SVG scaling to its box does. It also
means the lockup survives the column changing width at the breakpoint
without a second rule.

The name was chosen to fit. Four capitals and five lowercase letters, the
same count as the source, with the second word picked for having neither
an ascender nor a descender, as the source's second word does not, since
the lockup's flush top and bottom edges depend on it. Change the name and
the six values above change with it.

The result matches the source's box at both breakpoints, and the ink runs
flush from the left page margin to the right:

| | source | rebuild |
|---|---|---|
| lockup @1500 | `50, 685.1 · 1384.7 × 174.9` | `50, 685.2 · 1384.7 × 174.8` |
| word one column | `560.8 × 173.4` | `560.8 × 173.4` |
| word two column | `823.9 × 174.9` | `823.9 × 174.8` |
| lockup @390 | `20, 676.3 · 350 × 147.7` | `20, 676.4 · 350 × 147.6` |
| ink, left edge | page margin | 50.01 |
| ink, the seam | words meet | 610.78 / 610.79 |
| ink, right edge | page margin | 1434.66 |

## Known deviations

- **The photography is the source snapshot's and is the artist's own client
  work.** Eleven covers for eleven real commercial projects. Every file in
  `assets/` has to be replaced with commissioned or licensed photography
  before this goes anywhere real. Nothing in the markup, the CSS or the
  copy refers to the original artist, the original studio or any of the
  original clients.
- **The name, the copy and the project list are written for the template.**
  The source is one person's portfolio, so the wordmark is their name, the
  nav is their routes and the eleven list items are their clients. None of
  it carries over. The replacements keep the source's register and its
  shapes: a discipline line instead of a name in the header, five
  comma'd nav items, a two-word toggle for the two index views, a city and
  a clock, and eleven project names whose widths reproduce the source's
  wrap. The list breaks 3 / 3 / 3 / 2 into four rows at 110, 172.5, 235 and
  297.5, which are the source's own row positions, and the rag down the
  right edge falls in the same order.
- **Mobile is corrected, not reproduced.** Below 650px the source's list
  page is broken: it keeps the twelve-column placement on a six-column
  grid, so the list starts at 300px on a 390px screen and runs off the
  right edge of a page that cannot scroll. In practice it is unreachable,
  since the Covers/Names toggle is desktop-only, so it is a route nobody
  was meant to arrive at on a phone. Two corrections, and they are the only
  invented numbers in the build: the list takes the full six columns, and
  it drops from 5.8rem to 3.2rem so eleven projects fit a screen with no
  second page. The hover thumbnail is hidden, since a touch device has
  nothing to drive it. Everything else at that width is the source's, and
  the wordmark's mobile geometry matches it to a tenth of a pixel.
- **The intro belongs to the site, not to this route.** In the source the
  full entrance belongs to the carousel: the wordmark flips out of the
  middle while a cover photograph expands between the two words, and
  arriving at `/list` from the carousel skips all of it. This is a single
  page with no carousel to arrive from, so the entrance plays here, minus
  the photograph it has nowhere to put. Every duration, stagger and curve
  is the source's.
- **Contact posts nowhere.** The source posts to a Netlify form handler.
  The panel, the wipe, the field geometry, the copy-address row and the
  three button states are reproduced. The submit resolves locally after
  900ms.
- **The nav goes nowhere.** Five routes and two views of a sixth, on a page
  that is one page. They are in-page anchors that keep their resting and
  current states.
- **`snappy` is approximated.** The contact wipe runs on a four-segment
  CustomEase in the source, which no single `cubic-bezier` can express. It
  is replaced with the list's quart-out, which has the same shape at the
  front and differs only in the tail.

## Snapshot notes

The saved page was in good order. The markup is post-hydration Nuxt, so it
arrived as the rendered DOM rather than as a template, which is the useful
form: the structure and the class strings are all there. The design system
is a single 51KB inline `<style>` block holding a Tailwind 2 build plus the
site's own layer. The fourteen smaller style blocks after it are browser
extension injections and none of them belong to the site.

Two things could not be read from the DOM and had to come out of the
JavaScript bundles: the intro timeline, which lives in the layout component
alongside GSAP Flip calls, and the contact panel, which is rendered behind
a `v-if` and is not in the saved HTML at all. The list component is legible
in the bundle and confirmed what the DOM implied, that the thumbnail is a
z-index stack rather than a crossfade and that the highlight is state
rather than hover.

Running the snapshot with its scripts enabled is not useful. The bundles
boot, fail to reach the CMS and the analytics endpoints, and the router
replaces the page. It was measured with scripts stripped, which gives the
server-rendered DOM under the real stylesheet. Note that in that state the
snapshot renders in a system fallback, since none of the three licensed
faces are in the bundle either, so any type width quoted from the source is
the fallback's rather than Diatype's. The box geometry, which is what the
rebuild is matched against, is unaffected.
