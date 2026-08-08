/**
 * Run Club — page five.
 *
 * Rebuild of a Shopify running-apparel storefront from a saved-page snapshot.
 * Copy is rewritten for the rebrand; the system block is measured, not guessed:
 * colours, faces, grid, breakpoints and easings are read straight off the
 * snapshot's stylesheet and reproduced in public/run-club/styles.css.
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
    'A commerce template for a technical apparel brand that has to sell product and hold a point of view at the same time. Photography runs edge to edge, the interface stays at 13 to 14px, and retail detail is kept off the image until the moment someone reaches for it.',

  attributes: [
    { label: 'Character', items: ['Technical', 'Editorial', 'Quiet'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'Commerce pages usually get loud where they are least sure of themselves: badges, ribbons, promises. This one does the opposite. It sets the type small and keeps it small, gives the photography every pixel it can, and lets the merchandising rows do their work in silence. What sells here is the photograph; the interface exists to stay out of its way and to be exactly where you expect when you finally want a price.',
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        'The page opens on a full-viewport photograph and holds it for a whole screen before anything is for sale. By the time the first price appears the reader has been given a season and a mood, so the product rows arrive as evidence for a case that has already been made rather than as an opening pitch.',
    },
    {
      principle: 'Color',
      rationale:
        'A near-black, a white, and two greys that differ by a few points. There is no accent colour anywhere in the interface. Every piece of colour on the page comes from a garment or a photograph, which means the merchandising can never be out-shouted by its own chrome, and a new season restyles the site without a single token changing.',
    },
    {
      principle: 'Typography',
      rationale:
        'One grotesk at two weights, and a scale that tops out at 40px. Headlines are set in the same face and the same weight as the prices; hierarchy is carried by size, case and position rather than by a second family. Holding the interface at 13 to 14px keeps it subordinate to the imagery, so the type stays legible without ever being the thing you look at first.',
    },
    {
      principle: 'Grid',
      rationale:
        'Four columns, then eight, then twelve, while the gutter and the page margin stay at 10px at every width. Because only the column count changes, the same layout intent survives all three breakpoints without a set of size-specific rules, and any element can be given an exact span rather than a percentage that happens to look right.',
    },
    {
      principle: 'White space',
      rationale:
        'The page margin is 10px and it never grows. Space is spent vertically instead: one gap token separates every section, widening from 30px to 70px as the viewport does, and images break the margin to reach the screen edge. Tightening the sides and loosening the stack is what makes the page read as a catalogue rather than a brochure.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Interaction is used to hide, not to decorate. Product names, prices and colourways sit on top of the image at zero opacity and fade in on hover, so the grid reads as pure photography until someone asks it a question. Underlines redraw left to right rather than appearing; the swatch marker slides between positions rather than blinking. Every move is a transition between two states the page already had.',
    },
    {
      principle: 'UX',
      rationale:
        'Navigation is split by intent: what you can buy on the left, who you are on the right, brand in the middle. Below 1200px the whole left side collapses to one burger and the layout does not otherwise change. The footer carries language and country as plain selects, because a store that ships internationally has to answer that question on every page, not only at checkout.',
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
