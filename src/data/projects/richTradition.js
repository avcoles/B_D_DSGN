/**
 * Rich Tradition — page seven.
 *
 * Rebuild of a Spanish preserved-foods homepage from a saved-page snapshot,
 * rebranded and translated into English. The source is a Nuxt 2 app on
 * Prismic running GSAP and Locomotive Scroll; the rebuild is plain HTML,
 * CSS and about 300 lines of JavaScript, and gets the same three sticky
 * panels, the same masked character reveals and the same clip-path ribbons
 * out of `position: sticky` and CSS transitions.
 *
 * Everything in the system block is measured off the snapshot's inline
 * stylesheet and reproduced in public/rich-tradition/styles.css. The one
 * substitution is the typeface — see the README in that folder.
 */

export const richTradition = {
  id: 'rich-tradition',
  previewSrc: '/rich-tradition/index.html',

  kicker: 'Design System Template',
  title: 'Rich Tradition',
  subtitle: 'Heritage Food',

  description:
    'A brand template whose job is to make a thirty-year-old preserved-food recipe look like something you would order in a restaurant. It behaves like packaging rather than like a website. A seal sits stamped dead centre of every screen, the buttons are cut into ribbons, and the type runs large enough that you see pattern before you read words.',

  attributes: [
    { label: 'Character', items: ['Loud', 'Warm', 'Graphic'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid', 'CSS Sticky'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'You cannot argue anyone into wanting a jar of stuffed peppers, so the page does not try. It opens on a photograph of a laid table and sits there for a beat before a single word shows up. Appetite first, pitch second. After that it stops borrowing from the web and starts borrowing from the jar: a circular seal that turns as you pass it, buttons cut like ribbon, and one red used often enough that you know whose page this is without a logo ever being on screen.',
      'Below the hero it stops scrolling like a document. The page becomes a stack of full-screen panels sliding over one another, each holding for exactly one screen, which gives a four-variant range the pacing of a campaign. The source used a smooth-scroll library for that. This gets there with sticky positioning and a z-index apiece.',
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        'Delay the headline, not the food. A screen of photography lands first and holds. The copy arrives a beat later, after appetite has done its work. The range is three screens further down and a price never turns up at all, so by the time you see a jar the case is already made and the product reads as proof rather than as an offer.',
    },
    {
      principle: 'Color',
      rationale:
        'One saturated red, used past the point of restraint. It carries the headlines, the plate at the top, the buttons and the menu field, and it repeats often enough that you learn the brand without a logo ever being on screen. Cream and gold are the only other colours the page draws. Everything else comes out of a photograph, or out of the product panel, whose background belongs to whichever filling you picked.',
    },
    {
      principle: 'Typography',
      rationale:
        'Let letters fill the frame. At a fifth of the viewport a headline registers as pattern before it registers as language, which is most of why the page feels loud before you have read anything. It runs on one face at one weight, from a 34rem headline down to a 1.6rem caption, and nothing but size, case and tracking separates the roles. Every step is the same clamp, so no rule in the type system is tied to a screen size.',
    },
    {
      principle: 'Grid',
      rationale:
        'A narrow measured column against edge-to-edge photography. Content runs at 90vw over four columns and widens to 96vw over twelve, and the page margin is never declared: it is derived from the page width. The nav padding and the hero inset read that same derived value, so the chrome cannot drift away from the content at any width.',
    },
    {
      principle: 'White space',
      rationale:
        'The type is oversized and the column is tight, so the air has to go somewhere. It goes vertical, in nine steps built on the same clamp as the type and applied only as margin-bottom. A gap belongs to the element above it, never the one below, which is why you can drop a section into the middle of the page without auditing a single margin.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Make scroll pay off in scale. Headlines get cut into characters and paragraphs into measured lines, each one masked and rising on a delay worked out from its own index. The seal turns the whole time. The ribbon buttons take a full two seconds to unfold, and their labels wait for the shape to finish before they fade in. One curve does nearly all of it. Over anything that leads somewhere, the cursor turns into a gold disc with the verb printed on it.',
    },
    {
      principle: 'UX',
      rationale:
        'Borrow the jar’s graphics, not the web’s. The header is a wax stamp: a red plate fixed dead centre instead of tucked into a corner, and it doubles as the menu button, narrowing to a sliver on scroll while the monogram replaces the wordmark. Under 960px it is the whole interface. The flavour switcher runs on the same logic. Four variants share one jar and one headline, so comparing them never means learning a new layout.',
    },
  ],

  /**
   * Specimen tokens. Every colour is measured from the snapshot's stylesheet.
   * `ink2` and `ink3` are the gold and a step down from it, since the source
   * has no muted ink — it changes hue rather than opacity.
   */
  specTokens: {
    paper: '#fbf5e7',
    paperDeep: '#f2e9d4',
    card: '#fbf5e7',
    ink: '#d70321',
    ink2: '#cba058',
    ink3: 'rgb(203 160 88 / 0.72)',
    rule: 'rgb(215 3 33 / 0.24)',
    accent: '#d70321',
    accentSoft: '#ffb82e',
    display: "'Anton', 'Haettenschweiler', 'Arial Narrow', Helvetica, sans-serif",
    label: "'Anton', 'Haettenschweiler', 'Arial Narrow', Helvetica, sans-serif",
    labelTracking: '0.14em',
    btnRadius: '0px',
  },

  system: {
    /**
     * One face, one weight, no axes. The three roles below are positions in
     * the page, not separate cuts — which is the point being made. All that
     * separates them is size, case and tracking.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Anton',
          weights: '400 · tracking 0',
          stack: "'Anton', 'Haettenschweiler', 'Arial Narrow', Helvetica, sans-serif",
        },
        {
          role: 'Body',
          family: 'Anton',
          weights: '400 · tracking .02em',
          stack: "'Anton', 'Haettenschweiler', 'Arial Narrow', Helvetica, sans-serif",
        },
        {
          role: 'Label',
          family: 'Anton',
          weights: '400 · tracking .14em',
          stack: "'Anton', 'Haettenschweiler', 'Arial Narrow', Helvetica, sans-serif",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#FBF5E7', note: 'Page' },
            { value: '#FFB82E', note: 'Panel' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#D70321', note: 'Primary' },
            { value: '#CBA058', note: 'Gold' },
          ],
        },
      ],
    },

    /**
     * The root is 10px, so every step below is that scale in rem. The gutter
     * and the page width both move with the column count — unusually, the
     * page gets *wider* as the screen does, from 90vw to 96vw.
     */
    spacing: {
      base: 10,
      steps: [
        { name: 'XS', value: 14 },
        { name: 'SM', value: 20 },
        { name: 'MD', value: 40 },
        { name: 'LG', value: 60 },
      ],
      applied: [
        { name: 'Gutter', value: '2rem → 2vw' },
        { name: 'Page width', value: '90 / 95 / 96vw' },
        { name: 'Columns', value: '4 → 8 → 12' },
        { name: 'Breakpoints', value: '960 / 1280' },
      ],
      radii: ['0px', '2rem'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'None' },
        { name: 'Ornament', value: 'One crown mark' },
        { name: 'Fill', value: 'Follows --text-color' },
        { name: 'Style', value: 'Drawn as a path' },
      ],
    },

    buttons: {
      variants: [
        { label: 'Come and taste', className: 'spec-btn--primary' },
        { label: 'Where to buy', className: 'spec-btn--ghost' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Curve',
      name: 'CSS transitions',
      kind: 'Motion',
      what: 'Every move is a CSS transition on effectively one curve. Reveal delays get computed in `calc()` from two custom properties, so a headline of any length works out its own choreography and there is no timeline to keep in sync.',
      attributes: [
        { label: 'Easing', value: 'cubic-bezier(.19, 1, .22, 1)' },
        { label: 'Reveal', value: '1.25s, staggered .025s per character' },
        { label: 'Ribbon CTA', value: 'clip-path 2s, transform 1s' },
        { label: 'Panel colour', value: '2s, delayed .25s' },
      ],
      tags: ['Motion'],
    },
    {
      icon: 'Grid',
      name: 'CSS Grid & sticky',
      kind: 'Layout',
      what: 'Three full-screen panels on ascending z-indexes, each holding for a screen while the next rises over it. The source runs Lenis underneath for inertial scroll. This gets the same staging from `position: sticky` and a z-index apiece, with no pinning maths anywhere.',
      attributes: [
        { label: 'Columns', value: '4 / 8 / 12' },
        { label: 'Content width', value: '90 → 96vw, gutter 2rem' },
        { label: 'Panels', value: '3 sticky, z-index 1 / 5 / 10' },
        { label: 'Radii', value: '2rem, or clip-path' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Mouse',
      name: 'Vanilla JavaScript',
      kind: 'Behaviour',
      what: 'About 300 lines covering split text, one observer, the plate, the menu, the cursor and the product switcher, standing in for a Nuxt app plus a smooth-scroll library. The script only ever adds a class or writes a custom property. CSS does the animating.',
      attributes: [
        { label: 'Splitting', value: 'Chars once, lines re-measured' },
        { label: 'Reveals', value: 'One IntersectionObserver, page-wide' },
        { label: 'Menu', value: 'aria-hidden + inert, together' },
        { label: 'Reflow', value: 'Width changes only, debounced' },
      ],
      tags: ['Motion', 'Accessibility'],
    },
  ],
}
