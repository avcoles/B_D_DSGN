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
    "A premium portfolio template for architecture, interior design, and hospitality studios that need to show their work to high-value commercial clients. The editorial layout is built to carry project imagery and make the case for the studio's expertise.",

  attributes: [
    { label: 'Character', items: ['Editorial', 'Luxury', 'Restrained'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      "Quiet editorial luxury, drawn from the way premium architecture publications look. Large-format photography, restraint, and elegant type are doing one job together: letting the reader feel something before they've read anything. That ordering, emotion ahead of information, is the whole premise of the page.",
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs. The
   * title is the subject, the rationale is the argument.
   */
  principles: [
    {
      principle: 'Narrative',
      // PROVISIONAL: the source note broke off at "wrapped in". The second
      // sentence below is a stand-in until that phrase is settled.
      rationale:
        'The goal is a slower, more intentional scroll. Tightly gridded sections get surrounded by open space so the reader moves at a measured pace rather than racing down the page.',
    },
    {
      principle: 'Color',
      rationale:
        'A restrained palette of warm neutrals with charcoal type. Pulling saturated color out means texture, light, and materials in the photography become the source of visual richness instead. The page reads as rich, but the richness comes from the images, not from the interface competing with them.',
    },
    {
      principle: 'Typography',
      rationale:
        'A high-contrast serif display for headlines against a plain sans-serif for body copy. Hierarchy comes from scale and spacing rather than color or weight: dramatic size jumps, generous leading, and consistent type rhythm. The contrast between an ornate headline face and a neutral body face is what signals which is which.',
    },
    {
      principle: 'Grid',
      rationale:
        'A rigorous editorial grid lets oversized statements sit next to tightly composed multi-column content without the page feeling inconsistent. The modular layout creates rhythm, and because everything still aligns to the same underlying structure, the variety reads as composed rather than busy.',
    },
    {
      principle: 'White space',
      rationale:
        "Expansive negative space slows browsing down and gives the photography and type room to breathe. It's what makes each section feel paced, the way turning pages in a magazine sets a rhythm; the emptiness is deliberate timing, not wasted space.",
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Motion stays understated and architectural. Smooth scrolling, restrained fades, subtle hover states, and minimal transitions all confirm interactivity without asking for attention. Quiet motion reinforces the sense of sophistication; loud motion would undercut it.',
    },
    {
      principle: 'UX',
      rationale:
        "The information architecture is narrative-first, moving visitors from philosophy to proof, then portfolio, insights, studio, and contact. Leading with story before the ask builds credibility first, so by the time a visitor reaches the contact point they've already been given reasons to trust the studio.",
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
    btnRadius: '0px',
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
        },
        {
          role: 'Body',
          family: 'Archivo',
          weights: '300 – 700',
          stack: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'Archivo',
          weights: '400 – 500',
          stack: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#EFEEEC', note: 'Primary' },
            { value: '#FFFFFF', note: 'Secondary' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#000000', note: 'Primary' },
            { value: '#5D5346', note: 'Secondary' },
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
        { label: 'View project', className: 'spec-btn--text' },
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
