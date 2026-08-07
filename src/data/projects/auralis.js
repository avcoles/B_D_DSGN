/**
 * Auralis — one showcased site, everything about it in one file.
 *
 * To add a page: copy this file, change `id`, point `previewSrc` at the new
 * site, and rewrite the content. Then add it to the array in ./index.js. That
 * is the whole process; nothing else in the app needs touching.
 *
 * `previewSrc` takes a path under /public, or a full https:// URL for any site
 * that permits framing.
 */

export const auralis = {
  id: 'auralis',

  // Hidden from the pager. The file, its data, and /public/preview all stay
  // exactly as they are; flip this to false to bring the page back.
  hidden: true,

  previewSrc: '/preview/index.html',

  kicker: 'Design System Template',
  title: 'Auralis',
  subtitle: 'Clean Paper Workflow',

  description:
    'A warm, print-led interface system built for products that need to feel considered rather than loud. Hairline rules, a single accent, and an eight-point rhythm carry the entire layout — no filled panels, no decorative gradients.',

  /**
   * The at-a-glance read: what this page is, and what it's made of.
   *
   * Two groups rather than one because the two lists answer different
   * questions — "Luxury" describes how the page feels, "GSAP" describes what's
   * in the bundle. A single label covering both has to be vague enough to be
   * true of either, which is how you end up with "Tags".
   *
   * The renderer walks this array, so the shape is the control: add a third
   * group and it appears; collapse to one and it renders as a single row.
   */
  attributes: [
    { label: 'Character', items: ['Editorial', 'Luxury', 'Interactive'] },
    { label: 'Tech Stack', items: ['React Native', 'GSAP'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },

  /**
   * Part one of the audit: the reasoned read. Every principle clears two bars.
   *
   *   It travels.   Could this rule be used to judge a different landing page?
   *                 If it only describes this one, it's an observation, not a
   *                 principle.
   *   It's earned.  Something on the page in the iframe has to prove it. The
   *                 source of each proof is noted so it can be checked.
   *
   * House style: no em or en dashes, no jargon, no inflated significance.
   */
  principles: [
    {
      principle: 'Start from paper, not from white',
      rationale:
        'The background is a warm off-white rather than pure white, so a white card has something to sit on. Start from pure white and every panel you add needs a heavy border just to become visible.',
      // Earned by: --paper #FAF8F5 against --card #FFFFFF
    },
    {
      principle: 'Spend one colour, and spend it where you want the eye',
      rationale:
        'A single burnt orange does all the highlighting on the page and nothing else competes with it. When one colour is the only colour, nobody has to hunt for what matters.',
      // Earned by: --accent #C2500F on buttons, nav underlines, feature numerals
    },
    {
      principle: 'Let hairlines do the work of boxes',
      rationale:
        'Sections are divided by a one pixel line instead of a filled panel. The line separates just as clearly and leaves the page feeling open rather than chopped into compartments.',
      // Earned by: --rule rgba(26,23,19,0.12), used for every division on the page
    },
    {
      principle: 'Give every typeface a single job',
      rationale:
        'A serif for headings, a plain sans for reading, a monospace for small labels. Three faces are enough that you know what kind of text you are looking at before you read it, and a fourth would leave you guessing.',
      // Earned by: Instrument Serif, Inter, JetBrains Mono, each with one role
    },
    {
      principle: 'Move fast on response, slow on arrival',
      rationale:
        'A hover answers in about a sixth of a second. Something arriving on screen takes closer to half. Quick when you asked for it, calmer when the page is settling on its own.',
      // Earned by: 160ms on buttons, 240ms on transitions, 640ms on scroll reveals
    },
    {
      principle: 'Rank the actions so the ranking needs no reading',
      rationale:
        'Filled button, outlined button, plain underlined text. Someone skimming should be able to point at the main path without reading a single label.',
      // Earned by: .btn-primary, .btn-ghost, and the underlined nav text action
    },
    {
      principle: 'Stop the text before the screen does',
      rationale:
        'Paragraphs stop at about 1080 pixels no matter how wide the monitor gets. Long lines make readers lose their place on the way back to the left margin.',
      // Earned by: .wrap max 1080px, .sec-head 52ch, hero paragraph 46ch
    },
  ],

  /**
   * Specimen tokens. These paint the design-system stages below, so the palette
   * is judged against the page's own ground rather than the chrome's white.
   */
  specTokens: {
    paper: '#faf8f5',
    paperDeep: '#f1ece4',
    card: '#ffffff',
    ink: '#1a1713',
    ink2: '#554d42',
    ink3: '#928878',
    rule: 'rgba(26, 23, 19, 0.12)',
    accent: '#c2500f',
    accentSoft: '#f7ebe1',
    display: "'Instrument Serif', serif",
    label: "'JetBrains Mono', monospace",
    labelTracking: '0.16em',
    btnRadius: '6px',
  },

  /**
   * The showcased page's own design system. Values are read off the real page;
   * the styles that render the specimens live in src/specimen.css.
   *
   * Labels and rendered specimens are driven from the same strings wherever
   * possible, so a swatch can't display one hex and paint another.
   */
  system: {
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Instrument Serif',
          weights: 'Regular · Italic',
          stack: "'Instrument Serif', serif",
        },
        {
          role: 'Body',
          family: 'Inter',
          weights: '300 – 600',
          stack: "'Inter', system-ui, sans-serif",
        },
        {
          role: 'Label',
          family: 'JetBrains Mono',
          weights: '400 · 500',
          stack: "'JetBrains Mono', monospace",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#FAF8F5', note: 'Primary' },
            { value: '#F1ECE4', note: 'Secondary' },
            { value: '#FFFFFF', note: 'Tertiary' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#1A1713', note: 'Primary' },
            { value: '#554D42', note: 'Secondary' },
            { value: '#928878', note: 'Tertiary' },
          ],
        },
        {
          // The hairline is left unlabelled: it is a border value, not a step
          // in the accent hierarchy beside it.
          name: 'Line & Accent',
          swatches: [
            { value: 'rgba(26, 23, 19, 0.12)' },
            { value: '#C2500F', note: 'Accent' },
            { value: '#F7EBE1', note: 'Accent tint' },
          ],
        },
      ],
    },

    spacing: {
      base: 8,
      steps: [
        { name: 'XS', value: 8 },
        { name: 'SM', value: 16 },
        { name: 'MD', value: 24 },
        { name: 'LG', value: 48 },
      ],
      applied: [
        { name: 'Section padding', value: '72px' },
        { name: 'Card padding', value: '24px' },
        { name: 'Grid gap', value: '16px' },
        { name: 'Content width', value: '1080px' },
      ],
      radii: ['6px', '12px', '999px'],
    },

    icons: {
      specs: [
        { name: 'Grid', value: '16 × 16' },
        { name: 'Stroke', value: '1.25px' },
        { name: 'Caps', value: 'Round' },
        { name: 'Style', value: 'Line' },
      ],
    },

    buttons: {
      variants: [
        { label: 'Start free', className: 'spec-btn--primary' },
        { label: 'See how it works', className: 'spec-btn--ghost' },
        { label: 'Read the docs', className: 'spec-btn--text' },
      ],
    },
  },

  /**
   * Part two of the audit. Placeholder content: the page in the iframe is plain
   * HTML and CSS, so there is nothing here to probe.
   *
   * Written for a reader who does not know the library, which is why there are
   * no version strings or detection markers. `icon` names one of the badges
   * exported from src/components/icons.jsx.
   */
  techStack: [
    {
      icon: 'Curve',
      name: 'GSAP',
      kind: 'Animation',
      what: 'A library for sequencing animation, so movements run in a planned order rather than all at once.',
      attributes: [
        { label: 'Sequence', value: 'Six timelines' },
        { label: 'Trigger', value: 'Scroll position' },
        { label: 'Effect', value: 'Split headline, staggered cards' },
        { label: 'Feel', value: 'Ease out, no bounce' },
      ],
      tags: ['Motion', 'Hero', 'Scroll'],
    },
    {
      icon: 'Cube',
      name: 'Three.js',
      kind: '3D rendering',
      what: 'A library for drawing three dimensional scenes directly in the browser, using the graphics card.',
      attributes: [
        { label: 'Scene', value: '3D surface, one camera' },
        { label: 'Effect', value: 'Depth fade at the edges' },
        { label: 'Primitives', value: 'Grid lines and points' },
        { label: 'Motion', value: 'Slow breathing pulse' },
      ],
      tags: ['WebGL', 'Hero', 'Pointer'],
    },
    {
      icon: 'Mouse',
      name: 'Lenis',
      kind: 'Scroll',
      what: 'A layer that takes over scrolling from the browser so the page moves with weight instead of stopping dead.',
      attributes: [
        { label: 'Feel', value: 'Glide, 1.2s to settle' },
        { label: 'Easing', value: 'Fast start, long tail' },
        { label: 'Axis', value: 'Vertical only' },
        { label: 'Reach', value: 'Whole page and anchors' },
      ],
      tags: ['Motion', 'Scroll'],
    },
    {
      icon: 'Grid',
      name: 'Tailwind CSS',
      kind: 'Styling',
      what: 'A styling system where sizes, spaces, and colours come from one shared set of values rather than being written by hand each time.',
      attributes: [
        { label: 'Rhythm', value: '4px base unit' },
        { label: 'Palette', value: 'One shared set' },
        { label: 'Scope', value: 'Layout, spacing, colour' },
        { label: 'Exceptions', value: 'One off values allowed' },
      ],
      tags: ['Spacing', 'Colors', 'Shapes'],
    },
  ],
}
