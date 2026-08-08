/**
 * Run Club — page five.
 *
 * Rebuild of a Shopify running-apparel storefront from a saved-page snapshot.
 * Copy is rewritten for the rebrand; the system block is measured, not guessed:
 * colours, faces, grid, breakpoints and easings are read straight off the
 * snapshot's stylesheet and reproduced in public/run-club/styles.css.
 *
 * The prose below now follows the Balmoral Running design audit, which was run
 * against the live page. Its constitution is written as imperative rules; the
 * headings here keep the subject-and-argument shape the other pages use, so the
 * set reads as one document when you page through it.
 *
 * The one substitution is the typeface — see the README in that folder.
 */

export const runClub = {
  id: 'run-club',
  previewSrc: '/run-club/index.html',

  kicker: 'Design System Template',
  title: 'Run Club',
  subtitle: 'Performance Retail',

  description:
    'A direct-to-consumer apparel storefront for a small running label. Its job is to read as an established house, so a visitor browses the collection rather than price-shopping a single hat.',

  attributes: [
    { label: 'Character', items: ['Technical', 'Editorial', 'Quiet'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'Commerce pages usually get loud where they are least sure of themselves: badges, ribbons, promises. This one does the opposite. It gives its largest surfaces to photography and keeps every word small, so you judge the clothes the way you would in a shop window rather than reading claims about them.',
      'The restraint is what does the persuading. A whole screen goes to a film panel that asks for nothing, collections are introduced before any price appears, and product names and prices share one size with the navigation. A label that behaves as though it does not need the sale reads as one that has been around a while.',
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        'The largest surfaces go to photography and every word stays small, so you judge the clothes the way you would in a shop window rather than reading claims about them. A full-width film panel carries the wordmark and nothing else: no copy, no button, no ask. A screen that wants nothing from the visitor buys the label more credibility than a slogan would.',
    },
    {
      principle: 'Color',
      rationale:
        'A white, a grey product field, and a near-black ink. There is no accent colour anywhere in the interface, and surfaces are told apart by a background swap rather than a border or a shadow. Every piece of colour on the page therefore comes from a garment or a photograph, so a new season restyles the site without a single token changing.',
    },
    {
      principle: 'Typography',
      rationale:
        'One grotesk at two weights, on a scale that runs from 11px to 32px and almost never leaves the bottom of it. Product names, prices and navigation all sit at 13px, which flattens the hierarchy and makes the goods look priced rather than promoted. Uppercase is reserved for 12px action links, so even emphasis is rationed.',
    },
    {
      principle: 'Grid',
      rationale:
        'One 10px gutter and one 10px page margin, repeated around every block, while only the column count moves between breakpoints. Because nothing between the sections ever changes width, eleven stacked blocks end up reading as a single continuous surface rather than a sequence of separate modules.',
    },
    {
      principle: 'White space',
      rationale:
        'The page margin is 10px and it never grows. Space is spent vertically instead, and images break the margin to reach the screen edge. Gutters this thin read as dense on purpose: tightening the sides while loosening the stack is what makes the page feel like a catalogue rather than a brochure.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Motion is timed to confirm arrival rather than to be watched. Most transitions land at a quarter of a second, reveals are driven by a section entering the viewport, and nothing animates on its own once settled. Action links carry an underline instead of a button box, so even the interactive elements avoid becoming shapes on the page.',
    },
    {
      principle: 'UX',
      rationale:
        'Every block opens with a collection name and a paragraph before it shows a price, so a hat arrives as part of a range instead of an item in a feed. The shop link then sits on the same line as the section heading, at the far right, which puts it where the eye already is at the moment it needs somewhere to go next.',
    },
  ],

  /**
   * Specimen tokens. Every colour is measured from the snapshot's stylesheet.
   * `ink3` and `rule` are derived from the page grey, since the source has no
   * third ink and draws no borders at all.
   */
  specTokens: {
    paper: '#ffffff',
    paperDeep: '#eaeaec',
    card: '#ffffff',
    ink: '#171614',
    ink2: '#828282',
    ink3: 'rgba(130, 130, 130, 0.85)',
    rule: 'rgba(23, 22, 20, 0.14)',
    accent: '#171614',
    accentSoft: '#eaeaec',
    display: "'PP Neue Montreal', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    label: "'PP Neue Montreal', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    labelTracking: '0.04em',
    btnRadius: '0px',
  },

  system: {
    /**
     * One family, two cuts. The roles below are positions in the page, not
     * separate typefaces, which is the point being made. Book covers both
     * display and body because the family has no Regular in this licence and
     * 400 resolves down to Book rather than up to Medium.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'PP Neue Montreal',
          weights: 'Book',
          stack: "'PP Neue Montreal', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Body',
          family: 'PP Neue Montreal',
          weights: 'Book',
          stack: "'PP Neue Montreal', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'PP Neue Montreal',
          weights: 'Medium',
          stack: "'PP Neue Montreal', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#FFFFFF', note: 'Primary' },
            { value: '#EAEAEC', note: 'Plate' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#171614', note: 'Primary' },
            { value: '#828282', note: 'Muted' },
          ],
        },
      ],
    },

    /**
     * The gutter and the page margin are the same 10px at every width. Only
     * the column count moves, which is why one number governs the whole page.
     */
    spacing: {
      base: 10,
      steps: [
        { name: 'XS', value: 5 },
        { name: 'SM', value: 10 },
        { name: 'MD', value: 20 },
        { name: 'LG', value: 30 },
      ],
      applied: [
        { name: 'Grid gutter', value: '10px' },
        { name: 'Edge margin', value: '10px' },
        { name: 'Columns', value: '4 → 8 → 12' },
        { name: 'Breakpoints', value: '768 / 1200' },
      ],
      radii: ['0px'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'None' },
        { name: 'Stroke', value: '1px' },
        { name: 'Caps', value: 'Square' },
        { name: 'Style', value: 'Drawn in CSS' },
      ],
    },

    buttons: {
      variants: [{ label: 'Shop now', className: 'spec-btn--text' }],
    },
  },

  techStack: [
    {
      icon: 'Grid',
      name: 'CSS Grid',
      kind: 'Layout',
      what: 'The browser’s own layout system. Here it does something a flex row cannot: images break out of their column to reach the page edge while everything else stays on the grid.',
      attributes: [
        { label: 'Columns', value: '4 / 8 / 12' },
        { label: 'Breakpoints', value: '768, 1200px' },
        { label: 'Gutter', value: '10px, fixed' },
        { label: 'Radii', value: 'Zero everywhere' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Mouse',
      name: 'Vanilla JavaScript',
      kind: 'Behaviour',
      what: 'No framework and no animation library. Roughly 100 lines cover the header’s two states, three overlays, the colour swatches and the reveal pass.',
      attributes: [
        { label: 'Header', value: 'Section-driven, not scroll-threshold' },
        { label: 'Overlays', value: 'aria-hidden + inert, together' },
        { label: 'Swatches', value: 'One custom-property write' },
        { label: 'Reveals', value: 'IntersectionObserver, once each' },
      ],
      tags: ['Motion', 'Accessibility'],
    },
    {
      icon: 'Curve',
      name: 'CSS transitions',
      kind: 'Motion',
      what: 'Four easing curves carry every move on the page. Nothing animates on load; motion only ever responds to a pointer or to a section entering the viewport.',
      attributes: [
        { label: 'Rollover', value: 'opacity .25s → .4s linear' },
        { label: 'Underline', value: '.75s cubic-bezier(.645,.045,.355,1)' },
        { label: 'Swatch marker', value: '.35s cubic-bezier(.215,.61,.355,1)' },
        { label: 'Reveal', value: 'scale 1.06 → 1 over 1.2s' },
      ],
      tags: ['Motion'],
    },
  ],
}
