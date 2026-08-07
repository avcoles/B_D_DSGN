/**
 * Commercial Studio — interior design for retail, workplace and hospitality.
 *
 * Copy is placeholder. Anything marked TODO is waiting on you.
 *
 * The system block is not placeholder: colours, typefaces and easing are read
 * straight off public/commercial-studio/styles.css. Spacing values are still
 * unmeasured and marked as such.
 *
 * The site ships light and dark themes. The specimens below use the light one,
 * since that is what loads first in the window.
 */

export const commercialStudio = {
  id: 'commercial-studio',
  previewSrc: '/commercial-studio/index.html',

  kicker: 'Design System Template',
  title: 'Commercial Studio',
  subtitle: 'Retail, Workplace, Hospitality',

  description:
    'TODO. Two or three sentences on what this page is and who it is for. Match the length of the other entries so the rail keeps its rhythm.',

  attributes: [
    { label: 'Character', items: ['Editorial', 'Architectural', 'Dual Theme'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Custom Properties'] },
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
   * Specimen tokens, taken from the light theme. `ink3` and `rule` are the
   * page's own faded-text and border values rather than anything derived.
   */
  specTokens: {
    paper: '#f2f0e6',
    paperDeep: '#eae7db',
    card: '#eae7db',
    ink: '#1d1d1d',
    ink2: 'rgb(29 29 29 / 0.85)',
    ink3: 'rgb(29 29 29 / 0.7)',
    rule: 'rgb(29 29 29 / 0.16)',
    accent: '#ff4101',
    accentSoft: 'rgb(29 29 29 / 0.05)',
    display: "'Instrument Serif', 'Times New Roman', serif",
    label: "'Hanken Grotesk', Arial, sans-serif",
    labelTracking: '0.06em',
  },

  system: {
    /**
     * A grotesk carrying the page, with a serif reserved for display moments.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Instrument Serif',
          weights: 'Regular · Italic',
          stack: "'Instrument Serif', 'Times New Roman', serif",
          sample: 'Interior design for retail',
        },
        {
          role: 'Body',
          family: 'Hanken Grotesk',
          weights: '300 – 500',
          stack: "'Hanken Grotesk', Arial, sans-serif",
          sample: 'Used for reading copy and interface text',
        },
        {
          role: 'Label',
          family: 'Hanken Grotesk',
          weights: '400 – 500',
          stack: "'Hanken Grotesk', Arial, sans-serif",
          sample: 'Selected work',
        },
      ],
    },

    /**
     * Two full themes rather than one palette. Each swatch has a light and a
     * dark counterpart, and the brand orange is shared by both.
     */
    colors: {
      groups: [
        {
          name: 'Light theme',
          swatches: [
            { value: '#F2F0E6', note: 'Page canvas' },
            { value: '#EAE7DB', note: 'Raised surface' },
          ],
        },
        {
          name: 'Dark theme',
          swatches: [
            { value: '#1D1D1D', note: 'Page canvas' },
            { value: '#262626', note: 'Raised surface' },
          ],
        },
        {
          name: 'Brand',
          swatches: [{ value: '#FF4101', note: 'Accent, shared by both themes' }],
        },
      ],
    },

    // TODO: measure these off the real stylesheet.
    spacing: {
      base: 8,
      steps: [
        { name: 'XS', value: 8 },
        { name: 'SM', value: 16 },
        { name: 'MD', value: 24 },
        { name: 'LG', value: 48 },
      ],
      applied: [
        { name: 'Section padding', value: 'TODO' },
        { name: 'Grid gutter', value: 'TODO' },
        { name: 'Card padding', value: 'TODO' },
        { name: 'Content width', value: 'TODO' },
      ],
      radii: ['TODO'],
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
          label: 'View work',
          className: 'spec-btn--primary',
          role: 'Primary',
          note: 'TODO',
        },
        {
          label: 'Get in touch',
          className: 'spec-btn--ghost',
          role: 'Secondary',
          note: 'TODO',
        },
      ],
    },
  },

  techStack: [
    {
      icon: 'Grid',
      name: 'CSS Custom Properties',
      kind: 'Theming',
      what: 'Values declared once and referenced everywhere, so swapping a theme means changing a handful of variables rather than restyling the page.',
      attributes: [
        { label: 'Themes', value: 'Light and dark' },
        { label: 'Swaps', value: 'Canvas, card, text, border' },
        { label: 'Constant', value: 'Brand orange, both themes' },
        { label: 'Fades', value: 'Alpha on the ink, not new colours' },
      ],
      tags: ['Colors', 'Shapes'],
    },
    {
      icon: 'Curve',
      name: 'Vanilla JavaScript',
      kind: 'Motion',
      what: 'No animation library. Reveals and hover states are written directly against the browser’s own APIs.',
      attributes: [
        { label: 'Interface easing', value: 'cubic-bezier(.65,0,0,1)' },
        { label: 'Reveal easing', value: 'cubic-bezier(.16,1,.3,1)' },
        { label: 'Trigger', value: 'TODO' },
        { label: 'At rest', value: 'TODO' },
      ],
      tags: ['Motion'],
    },
  ],
}
