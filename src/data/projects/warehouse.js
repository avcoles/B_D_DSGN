/**
 * Warehouse, page eight.
 *
 * Rebuild of a structural-glazing site from a saved-page snapshot, rebranded.
 * The source is a Nuxt 3 app on Storyblok running GSAP 3.13 and Lenis; this is
 * plain HTML, CSS and about 400 lines of JavaScript, and gets the same damped
 * scroll, masked line reveals and sticky video out of a lerp, an
 * IntersectionObserver and position: sticky.
 *
 * Everything in the system block is measured off the snapshot's inline
 * stylesheet. The motion had to be recovered from the transforms GSAP left
 * frozen on the DOM, because the snapshot kept the vendor bundle but not the
 * site's own tween code. The README in public/warehouse says which numbers are
 * measured and which are inferred.
 */

export const warehouse = {
  id: 'warehouse',
  previewSrc: '/warehouse/index.html',

  kicker: 'Design System Template',
  title: 'Warehouse',
  subtitle: 'Architectural Glazing',

  description:
    'A structural glazing contractor selling to architects. The page stays quiet on purpose: no accent colour, no bold weight, and photographs given room to work.',

  attributes: [
    { label: 'Character', items: ['Precise', 'Cool', 'Engineered'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid', 'CSS Sticky'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'Architects already know what they want, so the page does not try to sell them anything. It shows the work on one strict grid and saves its only piece of spectacle for the showroom video.',
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        'The page opens on a photograph and lets the company name scroll away with it. Products, a showroom and five projects all arrive before the first ask, and the one piece of real spectacle, a video growing to full bleed, is spent on the showroom.',
    },
    {
      principle: 'Color',
      rationale:
        'Five values and no accent. Every border, dim state and translucent plate is one of those five mixed down to 10, 20, 40, 60 or 80 percent, so all the colour you actually see comes out of a photograph.',
    },
    {
      principle: 'Typography',
      rationale:
        'One grotesk for anything you read as language, one mono for anything you read as a label. Nothing is bold: the reset takes strong back to 400, so emphasis has to come from size and case.',
    },
    {
      principle: 'Grid',
      rationale:
        'Twenty-four columns above 601px, six below. The root font-size is a fraction of the viewport width, so 1rem is 10px at 1600 and 10px again at 375. Two designs, not a ladder of breakpoints.',
    },
    {
      principle: 'White space',
      rationale:
        'The page margin is a flat 4rem and never grows. Sections get 15rem between them, and the showroom is given two whole viewports so it can spend one of them standing still.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Headings are cut into lines, masked, and released 70ms apart. Anything driven by scroll moves linearly, so the page never seems to accelerate on its own. Seven easing curves are declared once and every component draws from that set.',
    },
    {
      principle: 'UX',
      rationale:
        'The whole interface is one 27.6rem pill at the foot of the screen holding the mark, the page name and the menu. Open the menu and that same plate widens and grows upward, so navigation is the bar you were already looking at, taller.',
    },
  ],

  /**
   * Measured from the snapshot's stylesheet. `ink2` and `ink3` are the page
   * grey at the 60% and 40% mixes the design uses for muted type, since the
   * palette has no third ink.
   */
  specTokens: {
    paper: '#f3f0ec',
    card: '#f3f0ec',
    ink: '#212325',
    ink2: 'rgb(33 35 37 / 0.6)',
    ink3: 'rgb(33 35 37 / 0.4)',
    rule: 'rgb(33 35 37 / 0.2)',
    accent: '#0b1012',
    display: "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    label: "'Roboto Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    labelTracking: '0.08em',
    btnRadius: '0px',
  },

  system: {
    /**
     * Two families, split by role rather than by mood. The source set both in
     * Aeonik, which is licensed and was not in the snapshot; see the README
     * for the substitution.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Figtree',
          weights: 'Regular',
          stack: "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Body',
          family: 'Figtree',
          weights: 'Regular',
          stack: "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'Roboto Mono',
          weights: 'Medium, SemiBold',
          stack: "'Roboto Mono', ui-monospace, 'SF Mono', Menlo, monospace",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#F3F0EC', note: 'Page' },
            { value: '#212325', note: 'Inverted' },
            { value: '#0B1012', note: 'Plate' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#212325', note: 'Primary' },
            { value: '#FFFFFF', note: 'On dark' },
            { value: '#D4CEC6', note: 'Declared, unused' },
          ],
        },
      ],
    },

    /**
     * The base is the gutter. Above the breakpoint the margin is 4rem and the
     * gutter 2rem at every width; only the root unit moves, and it moves with
     * the viewport rather than in steps.
     */
    spacing: {
      base: 20,
      steps: [
        { name: 'XS', value: 10 },
        { name: 'SM', value: 20 },
        { name: 'MD', value: 40 },
        { name: 'LG', value: 150 },
      ],
      applied: [
        { name: 'Grid gutter', value: '2rem' },
        { name: 'Edge margin', value: '4rem' },
        { name: 'Columns', value: '6 → 24' },
        { name: 'Breakpoint', value: '600 / 601' },
      ],
      radii: ['0px', '2rem (chips only)'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'Bespoke' },
        { name: 'Stroke', value: '1.2px' },
        { name: 'Caps', value: 'Butt' },
        { name: 'Style', value: 'Inline SVG' },
      ],
    },

    buttons: {
      variants: [
        { label: 'Get a quote', className: 'spec-btn--primary' },
        { label: 'Who we are', className: 'spec-btn--ghost' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Grid',
      name: 'Viewport-derived rem',
      kind: 'Layout',
      what: 'The root font-size is a fraction of the viewport width, so every rem is a proportion of the window. It is why the layout has two states instead of a ladder of them.',
      attributes: [
        { label: 'Root', value: 'calc(100vw / --size * 10)' },
        { label: 'Divisor', value: '1600 desktop, 375 mobile' },
        { label: 'Columns', value: '24 / 6, 2rem gutter' },
        { label: 'Effect', value: 'A line wraps at all widths or none' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Mouse',
      name: 'Vanilla JavaScript',
      kind: 'Behaviour',
      what: 'No framework and no animation library, against a source that shipped GSAP, three plugins and Lenis. About 400 lines cover the scroller, six scrubbed effects, the reveals, the bar and the quote slider.',
      attributes: [
        { label: 'Scroller', value: 'Exponential chase, frame-rate independent' },
        { label: 'Scrub', value: 'measure/apply split, no per-frame layout reads' },
        { label: 'Reveals', value: 'IntersectionObserver, once each' },
        { label: 'Offsets', value: 'Re-derived from rem, never hard-coded' },
      ],
      tags: ['Motion', 'Accessibility'],
    },
    {
      icon: 'Curve',
      name: 'CSS transitions',
      kind: 'Motion',
      what: 'Seven easing curves are declared once as custom properties and every component draws from that set. Scroll-driven movement is linear, so only the things you touch appear to have inertia.',
      attributes: [
        { label: 'Line reveal', value: 'translateY 200% → 0, 1.1s out-quart' },
        { label: 'Stagger', value: '0.07s per line' },
        { label: 'Slot swap', value: '0.6s in-out-quart' },
        { label: 'Menu plate', value: 'scale 0 → 1 from bottom, 0.8s' },
      ],
      tags: ['Motion'],
    },
  ],
}
