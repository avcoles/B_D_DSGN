/**
 * Studio Boutique — page three.
 *
 * Copy is placeholder. Anything marked TODO is waiting on you.
 *
 * The system block is not placeholder: colours, typefaces, grid and easing are
 * read straight off public/boutique/styles.css. Two values are derived rather
 * than measured, and are marked where they appear.
 */

export const boutique = {
  id: 'boutique',
  previewSrc: '/boutique/index.html',

  kicker: 'Design System Template',
  title: 'Studio Boutique',
  subtitle: 'Hospitality Interiors',

  description:
    'TODO. Two or three sentences on what this page is and who it is for. Match the length of the Auralis and Ensemble entries so the rail keeps its rhythm.',

  attributes: [
    { label: 'Character', items: ['Editorial', 'Luxury', 'Restrained'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'TODO. Replace with the strategic read: what the page is trying to achieve, and the one decision that shapes everything else about it.',
    ],
  },

  // TODO: five to eight principles. Each has to travel (it could judge a
  // different page) and be earned (something on this page proves it).
  principles: [
    {
      principle: 'TODO: an imperative rule, short enough to repeat back',
      rationale:
        'TODO: one or two sentences making the reasoning legible to someone who has never opened a design tool. No jargon, no em dashes.',
    },
    {
      principle: 'TODO: a second rule',
      rationale: 'TODO: what it buys the page, in plain words.',
    },
    {
      principle: 'TODO: a third rule',
      rationale: 'TODO: what it buys the page, in plain words.',
    },
  ],

  /**
   * Specimen tokens. Colours and faces are measured. `ink3` and `rule` are
   * derived from the brown, since the page has no third ink and no border token.
   */
  specTokens: {
    paper: '#efeeec',
    paperDeep: '#e6e4e1',
    card: '#ffffff',
    ink: '#000000',
    ink2: '#5d5346',
    ink3: 'rgba(93, 83, 70, 0.68)',
    rule: 'rgba(93, 83, 70, 0.22)',
    accent: '#5d5346',
    accentSoft: '#efeeec',
    display: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    label: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    labelTracking: '0.06em',
  },

  system: {
    /**
     * Two families. A high-contrast serif for display, a grotesk for
     * everything that has to be read.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Cormorant Garamond',
          weights: '300 – 700',
          stack: "'Cormorant Garamond', Georgia, serif",
          sample: 'Hospitality interiors',
        },
        {
          role: 'Body',
          family: 'Archivo',
          weights: '300 – 700',
          stack: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          sample: 'Used for reading copy and captions',
        },
        {
          role: 'Label',
          family: 'Archivo',
          weights: '400 – 500',
          stack: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          sample: 'Project index',
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#EFEEEC', note: 'Page canvas' },
            { value: '#FFFFFF', note: 'Raised surface' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#000000', note: 'Headings' },
            { value: '#5D5346', note: 'Body copy' },
          ],
        },
      ],
    },

    /**
     * A fluid grid rather than a fixed rhythm: the column count and the gutter
     * both double at the 650px breakpoint.
     */
    spacing: {
      base: 8,
      steps: [
        { name: 'XS', value: 8 },
        { name: 'SM', value: 16 },
        { name: 'MD', value: 24 },
        { name: 'LG', value: 32 },
      ],
      applied: [
        { name: 'Grid gutter', value: '16 / 32px' },
        { name: 'Edge padding', value: '16 / 32px' },
        { name: 'Columns', value: '12 → 24' },
        { name: 'Design width', value: '402 → 1740' },
      ],
      radii: ['0px'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'TODO' },
        { name: 'Stroke', value: 'TODO' },
        { name: 'Caps', value: 'TODO' },
        { name: 'Style', value: 'TODO' },
      ],
    },

    buttons: {
      variants: [
        {
          label: 'View project',
          className: 'spec-btn--text',
          role: 'Arrow link',
          note: 'The arrow slides on hover',
        },
      ],
    },
  },

  techStack: [
    {
      icon: 'Grid',
      name: 'CSS Grid',
      kind: 'Layout',
      what: 'The browser’s own layout system, which lets a page describe columns once and let content fall into them.',
      attributes: [
        { label: 'Columns', value: '12, doubling to 24' },
        { label: 'Breakpoint', value: '650px' },
        { label: 'Gutter', value: '16 / 32px' },
        { label: 'Radii', value: 'Zero everywhere' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Curve',
      name: 'Vanilla JavaScript',
      kind: 'Motion',
      what: 'No animation library. Reveals and hover states are written directly against the browser’s own APIs.',
      attributes: [
        { label: 'Easing', value: 'cubic-bezier(.65,0,.35,1)' },
        { label: 'Reveals', value: 'Lines rise over 1s' },
        { label: 'Trigger', value: 'TODO' },
        { label: 'At rest', value: 'TODO' },
      ],
      tags: ['Motion'],
    },
  ],
}
