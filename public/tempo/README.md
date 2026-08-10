# Tempo: landing page rebuild

Reconstruction of a creative agency's homepage from a saved-page snapshot
(the HTML file plus its `_files` bundle), rebranded as **Tempo**. The source is a
Nuxt 2 single-page app on DatoCMS running GSAP, ScrollTrigger, Flip,
SplitText, a Lottie logotype and a Tailwind 2 build; this is a hand-authored
HTML/CSS/JS rebuild of the same design system with no framework, no CMS and no
animation library.

## Running it

    npx -y serve public/tempo -l 5187

Or `preview_start` the `tempo` entry in `.claude/launch.json`.

## Fidelity

At 1440×900 every section in the rebuild lands on the snapshot's exact offset
and height:

| section | snapshot | rebuild |
|---|---|---|
| hero | 1425×1800 @0 | 1425×1800 @0 |
| approach | 1425×715 @1992 | 1425×715 @1992 |
| work | 1425×1234 @3091 | 1425×1234 @3091 |
| services | 1425×574 @4709 | 1425×574 @4709 |
| studio | 1425×858 @5571 | 1425×858 @5571 |
| footer | 1425×885 @6669 | 1425×885 @6669 |

Total document height is 7562 against the snapshot's 7580. The 18px is not
design: the snapshot carries two leftover Nuxt page-transition helpers below
the footer, one of them a zero-height element sitting 18px clear of it.

Smaller boxes match too — the reel card at 385×216 @191, the hero claim at
696×101, the approach headline at 979×187, a case-study card at 689×825, the
services thumbnail at 311×175, the footer wordmark at 806×158.

## Design system

Read off the snapshot's stylesheet, not guessed. The source ships an 11KB base
layer plus a Tailwind build inline in the saved HTML, so every number below is
a measured value.

**The root size is the whole system.** There is one line worth understanding
before anything else:

    html { font-size: clamp(1px, 12px, 10 * 100vw / var(--size)) }

`clamp()` is being used as a floor and ceiling around a fixed preferred value,
which means the third argument usually wins: the root font size is a pure
ratio of the viewport. `--size` is 390 on a phone and 1500 above 650px, so at
a 1440px window the root is 9.6px, and it only reaches its 12px ceiling at
1800px. Every rem on the page therefore tracks the window, and the design
zooms rather than reflows. This is why there is not a single breakpoint in the
type scale.

**Colour.** Four values, and no accent at all:

| token | value | use |
|---|---|---|
| `--dark` | `#000` | type, rules, the theme switch |
| `--light` | `#fff` | the page |
| `--gray-text` | `#888a8b` | body copy |
| `--gray` | `#eee` | the field behind media while it loads |

`--dark` and `--light` are aliases, not colours, and dark mode is the two
swapping places — two lines, because nothing else on the page names a colour.
The absence of an accent is a real decision, not an omission: photography and
video are the only things on the page carrying hue, so any frame of work is
the loudest thing on screen by default.

**Type.** Four display steps and one body size. Weight barely participates —
400 and 700 are the only two used, and 700 appears only on the uppercase
steps.

| step | ≥650px | leading | tracking |
|---|---|---|---|
| `.h1` | 22rem | 0.7 | −.02em |
| `.h2` | 14rem | 1.025 | −.02em |
| `.h3` | 5.75rem | 1.13 | −.02em |
| `.h4` | 4.5rem | 1.17 | −.01em |
| body | 1.8rem | 1.5 | 0 |

Both uppercase steps carry `margin-left: -0.035em`. At 22rem the first glyph's
sidebearing is visible as an indent, and the negative margin is optical
alignment — expressed in ems so it scales with the type.

**Grid.** Six columns and a 2.3rem margin below 650px; twelve columns and
5.8rem above it. The gutter goes from 0.5rem to 2.4rem at the same moment. The
work section is the single exception and runs at 1.6rem, which is what makes
two thumbnails read as a spread rather than as more content.

**Easing.** The source registers two GSAP `CustomEase` paths. Both are
reproduced rather than approximated:

- `unmask` — `M0,0 C0.2,0 0,1 1,1` is exactly `cubic-bezier(.2, 0, 0, 1)`.
  Leaves instantly, arrives slowly, which is what makes masked type read as
  being uncovered rather than moved.
- `snappy` — three cubic segments, no single-cubic equivalent. It clears its
  own midpoint early, stalls around 88%, then creeps. Sampled at 24 points
  into a CSS `linear()` so the shape survives.

Two further curves come straight from the source's own CSS:
`cubic-bezier(.19, 1, .22, 1)` for most transitions and
`cubic-bezier(.785, .135, .15, .86)` for the underline sweeps.

**Radii.** Four: `.5rem` on the services card, `.75rem` on case studies,
`1rem` on the studio photograph, `1.2rem` on the reel — the last held as a
`clip-path` rather than a `border-radius`, because the intro opens it from a
slit and the cinema transition squares it off, and both of those are the same
property animating.

## Behaviour

`main.js` is about 450 lines and stands in for GSAP, ScrollTrigger, Flip,
SplitText, Lottie and a Nuxt app. The division of labour is deliberate: CSS
owns every transition with a fixed duration; JavaScript owns only the three
things CSS cannot do — measuring text to split it, reading scroll position,
and reading the cursor. Everywhere else the script writes a class or a custom
property and stops.

- **The reel.** The page's whole argument, and the reason the hero is two
  screens tall. One card carries three behaviours that compose rather than
  conflict: it tracks the cursor horizontally on a lazy lerp; it flies into an
  empty 16:9 box on the second screen, scrubbed by scroll; and it opens to
  full screen on click. The tracking is multiplied by the inverse of the
  scroll progress, so the card stops chasing the mouse at exactly the rate it
  starts obeying the scroll.

  The geometry is the interesting part. Nothing is a hard-coded size — the
  card is flown from its own resting box to whatever the target box measures.
  And the sticky panel translates out by exactly one viewport height across
  the same scroll range, which cancels the sticky offset and is what keeps the
  flight path a straight line. Get that wrong and the card arcs.

- **The wordmark.** Live text, not paths. It has to split per letter twice
  over — once rising on entry, once leaving on scroll — and a font does that
  for free at any size. Its font-size is solved for rather than guessed: the
  string is measured at `width: max-content` and scaled to fill its box. That
  measurement waits for the webfont, because sizing against the fallback gives
  a wordmark that jumps the moment the real face lands.

  The letters and the wordmark each carry their entrance and exit offsets in
  *separate* custom properties, composed in one `transform`. A fast scroll
  overlaps the two runs, and neither may cancel the other.

- **Split text.** Lines are measured, because where a line breaks depends on
  the box: every word gets a probe span, words sharing an `offsetTop` are a
  line, and the element is rebuilt as one mask per line. That re-runs on a
  width change and waits for `document.fonts.ready`. Characters are not
  measured — a character is a character at any width — so those are cut once
  and left alone. Height-only resizes are ignored, so a phone's URL bar does
  not trigger a reflow.

  For the character reveal the *word* is the mask and the characters inside it
  move. A mask per character would clip each glyph to its own advance width
  and eat the overhangs.

- **Reveals.** One `IntersectionObserver` for the page, at the source's own
  trigger point — ScrollTrigger's `top bottom-=15%` is a `-15%` bottom root
  margin. Three behaviours hang off it: masked lines, masked characters, and a
  plain 3rem fade for supporting copy that should arrive without announcing
  itself.

- **The header.** Painted in `mix-blend-mode: difference`, which is why it
  needs no scroll listener and no second colour: white type over the white
  page resolves to black, and the same type over the black reel card resolves
  to white. Correct over anything, including a frame of work.

- **Services.** Two things move together — which card is shown, and where the
  card sits. The offset is measured from the buttons, so the card slides down
  to sit level with whichever word is active and nothing has to draw a
  connection between them. Leaving is not the reverse of arriving: the
  outgoing card shrinks in place rather than sliding back out, so the two
  never look like one card moving.

- **Case-study hover.** The thumbnail rests at 1.05 and un-zooms to 1, so the
  hover state is the photograph's true framing and the resting state is a
  detail of it. A blurred copy fades in underneath at the same time, which is
  what the loop frame plays against so the picture behind never competes.

## Font substitution

The source's typeface is Suisse Int'l, loaded as `SuisseIntl-Book.woff2` and
`SuisseIntl-Bold.woff2`. Neither file is in the snapshot — both 404 against
the saved bundle — and neither is licensable from it.

| Source | Substitute | Licence |
|---|---|---|
| Suisse Int'l Book (400) | Arimo 400 | OFL |
| Suisse Int'l Bold (700) | Arimo 700 | OFL |

Arimo is metrically compatible with Arial, which is the reason to pick it.
Suisse Int'l is a neo-grotesque built on roughly the Helvetica skeleton, so a
face cut to Arial's metrics lands closer to it than a wider American gothic
would, and the page's measures and line breaks come out near the source's
without any tuning.

What Arimo does not have is a width axis. It ships a weight axis and nothing
else, and that single fact shapes the wordmark. The lockup is fitted to a
fixed box, so with no way to widen the face, a wordmark that fills 1352px
arrives too tall. The fix is leading rather than any horizontal scaling of the
glyphs, which would be the wrong trade at this size:

- The hero wordmark runs at leading 0.68 and measures 1352×264 against the
  source's 1352×262, a ratio of 5.12 : 1 against 5.16 : 1.
- The footer wordmark runs at 0.69 and measures 806×158 against 806×159. It
  needs its own number because the hero letters sit in masks whose bottom
  padding adds to the box, and the footer mark is bare text.

One more compensation is in the hero: the letter masks are opened 0.12em at
the bottom and pulled back by the same amount, because a flush mask trims the
overshoot on the O.

Swap the `font-family` and reset both leadings to the source's if you ever
license the original.

## Known deviations

- **Every video slot holds a still.** This is the largest deviation and worth
  being blunt about: in the source, seven of the page's media slots are video,
  namely the showcase loop, the full showcase, two case-study hover loops,
  three service loops and the studio film. None of them are in the snapshot.
  All of them sit on the CMS's CDN and the saved bundle contains nothing but
  analytics. The slots are built to the exact aspect ratios and every
  behaviour around them is wired, so the card still flies and opens, the
  service cards still cross-fade and the hover frame still scales in. What
  plays is a photograph rather than a film. Swapping the `<img>` elements in
  `assets/` for `<video muted loop playsinline>` is the whole change.
- **Nine slots, seven photographs.** The knitwear shot and the LED wall each
  appear twice at different crops, which is the one place the page repeats
  itself. Nothing is cropped on disk: every file is shipped at its original
  size and framed by `object-fit: cover`, so the crop is a stylesheet
  decision. Two helper classes shift the window off centre where the subject
  is not in the middle of the frame, and the studio portrait needs neither
  because it is already 4:5.
- **The blurred thumbnail is derived, not exported.** The source ships a
  second, pre-blurred copy of every case-study image for the layer that sits
  under the hover frame. This applies a CSS filter to the same file instead,
  which halves the image payload and cannot drift out of sync with the sharp
  version. The slight scale on that layer hides the soft edge a blur leaves
  at the frame.
- **The two case studies in the snapshot were real client work.** The source's
  saved page carried two thumbnails, both for named brands, and both are
  discarded here along with the studio name, the address, the email and the
  copy. Nothing in the markup, the CSS or the copy refers to the source brand.
- **The logotype is a typeface, not a drawing.** The source's is a Lottie
  animation — an SVG rendered from `vucko_logo_intro_white.json`, five letters
  and a trademark flying in from off-canvas. That JSON is not in the snapshot
  either, and a licensed logotype would not be reusable if it were. The
  rebuild sets the wordmark in the substitute face and gets the per-letter
  entrance and exit from CSS instead, which is a fair trade: the source needed
  a 2.5MB renderer to move six glyphs.
- **The nav, footer and menu links are in-page anchors.** This is one page;
  the source is five.
- **The page-transition layer is gone.** The source's `js-t-slide` and
  `js-t-bg` elements stage a dark wipe between routes — the outgoing page
  parks at `position: fixed`, a grey panel fades up behind it, and the
  incoming page slides a full viewport height. With one page there is no
  transition to run, so both elements and their timeline are cut.
- **The dark theme is honoured but under-specified.** The source ships
  `.is-dark` rules for exactly three components and swaps two custom
  properties for everything else; the rebuild does the same. It is a real
  feature of the design, but neither version has been designed past the
  alias swap.

## Snapshot notes

The saved page was in good shape and needed little sorting out. The markup was
post-hydration, so every masked headline arrived already exploded into
per-line and per-character `<div>`s and the reel had its inline flip transform
baked in. None of it was used directly — the DOM was read to recover the
structure and the copy, and the page was re-authored from the CSS.

The behaviour could be recovered exactly, which is unusual. The Nuxt bundle's
page chunks are minified but not mangled past readability, and the homepage
component, the reel component, the services component, the scroll-reveal mixin
and the two `CustomEase` registrations are all present in full. Every duration,
stagger, ease name and trigger offset quoted above was read out of that source
rather than inferred from watching the page — including the reel's tracking
formula, which is not something that could have been guessed from the outside.

The two `@font-face` rules point at `/_nuxt/fonts/`, which the snapshot did not
save, so the saved page renders in a fallback face. Any measurement taken from
the running snapshot is therefore a fallback measurement; the numbers in the
fidelity table above are box geometry, which the missing font does not move,
and not glyph widths, which it does.
