/**
 * Commercial Studio — interior design credentials page.
 *
 * Content comes from the Studio X design audit, run against the live page in a
 * connected browser. Values in the system block are measured, not estimated.
 *
 * Two things to know. The audit describes the original Webflow site, while the
 * page in the iframe is the static rebuild in /public/commercial-studio, so the
 * tech stack documents the original build rather than the copy on screen. And
 * the rebuild substitutes fonts: the original licenses Serrif Compressed and
 * Saans, which are named here because they are the real system, but the
 * specimens fall back to the nearest loaded faces.
 */

export const commercialStudio = {
  id: 'commercial-studio',
  previewSrc: '/commercial-studio/index.html',

  kicker: 'Design System Template',
  title: 'Commercial Studio',
  subtitle: 'Retail, Workplace, Hospitality',

  description: 'A design studio credentials page for commercial interiors',

  attributes: [
    { label: 'Character', items: ['Editorial', 'Credentials', 'Client-led'] },
    { label: 'Tech Stack', items: ['Webflow', 'GSAP', 'Lenis', 'Barba'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      "Commercial editorial minimalism that sits between luxury hospitality and business strategy. Warm photography, restrained layouts, and classic typography are doing the persuading here: authority comes across through clarity, so the page doesn't need decoration to signal that the firm is serious.",
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs. The
   * title is the subject, the rationale is the argument.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        "The premise is that good design starts with how a space feels, not how it's dressed up, and the page mirrors that by leading with atmosphere and pacing. Spacious layouts, timeless type, immersive photography, and editorial composition let each project feel intentional and lived-in. The interface deliberately recedes so the spaces carry the story; anything more assertive from the UI would pull attention away from the work.",
    },
    {
      principle: 'Color',
      rationale:
        'Warm ivory, rich browns, charcoal, and a restrained orange accent. Keeping the palette close to the tones of the materials themselves means the photography supplies most of the visual interest, and the interface reads as a quiet backdrop rather than a competing layer of color.',
    },
    {
      principle: 'Typography',
      rationale:
        'A high-contrast serif for headlines against an understated sans-serif for body. Hierarchy comes from scale, leading, and proportion rather than swapping between many fonts. Two well-chosen faces used at different sizes do more work, and read as more disciplined, than a wider type mix would.',
    },
    {
      principle: 'Grid',
      rationale:
        'A disciplined editorial grid with structured columns and generous gutters. Alternating full-bleed images, modular cards, and asymmetric compositions is what creates rhythm, and because they all sit on the same grid, the variety stays measured instead of chaotic.',
    },
    {
      principle: 'White space',
      rationale:
        'Large vertical spacing and wide margins set a calm reading pace. Negative space separates one idea from the next and gives each photo and headline room to land, which is also what raises the perceived quality: crowding signals cheap, spacing signals considered.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Interactions stay deliberate and restrained: smooth scrolling, subtle fades, quiet hover states, minimal animation. The understatement is the point, since restrained motion reads as professional where spectacle would read as a distraction from the work.',
    },
    {
      principle: 'UX',
      rationale:
        "The flow is structured like an executive presentation. It establishes expertise, explains methodology, shows proof through projects and clients, reinforces trust with testimonials, and ends on a focused conversion path. Sequencing credibility before the ask means a visitor has reasons to trust the firm before they're invited to act.",
    },
  ],

  /**
   * Specimen tokens, taken from the light theme. The button radius is the
   * page's `round` token, since every control on the page is a full pill.
   */
  specTokens: {
    paper: '#f2f0e6',
    card: '#eae7db',
    ink: '#1d1d1d',
    ink2: 'rgb(29 29 29 / 0.85)',
    ink3: 'rgb(29 29 29 / 0.7)',
    rule: 'rgb(29 29 29 / 0.16)',
    accent: '#ff4101',
    display: "'Serrif Compressed', 'Instrument Serif', Georgia, serif",
    label: "'Saans', 'Hanken Grotesk', Arial, sans-serif",
    labelTracking: '0.06em',
    btnRadius: '100vw',
  },

  system: {
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Serrif Compressed',
          weights: '300',
          stack: "'Serrif Compressed', 'Instrument Serif', Georgia, serif",
        },
        {
          role: 'Body',
          family: 'Saans',
          weights: '400 · 500',
          stack: "'Saans', 'Hanken Grotesk', Arial, sans-serif",
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
            { value: '#F2F0E6', note: 'Primary' },
            { value: '#EAE7DB', note: 'Secondary' },
          ],
        },
        {
          name: 'Dark theme',
          swatches: [
            { value: '#1D1D1D', note: 'Primary' },
            { value: '#262626', note: 'Secondary' },
          ],
        },
        {
          name: 'Brand',
          swatches: [{ value: '#FF4101', note: 'Accent' }],
        },
      ],
    },

    /**
     * Fluid throughout. Every token interpolates between a 20rem and a 160rem
     * viewport, so the numbers below are the floor of each range.
     */
    spacing: {
      base: 8,
      steps: [
        { name: 'Tiny', value: 28 },
        { name: 'Small', value: 48 },
        { name: 'Main', value: 64 },
        { name: 'Large', value: 88 },
      ],
      applied: [
        { name: 'Grid', value: '12 columns' },
        { name: 'Gutter', value: '8px' },
        { name: 'Page margin', value: '16 – 48px' },
        { name: 'Huge section', value: '144 – 432px' },
      ],
      radii: ['8px', '16px', '24px', '100vw'],
    },

    icons: {
      specs: [
        { name: 'Style', value: 'Linear' },
        { name: 'Fills', value: 'None' },
        { name: 'Glyphs', value: 'Arrows' },
        { name: 'Controls', value: 'Full pill' },
      ],
    },

    buttons: {
      variants: [
        { label: 'Start a Project', className: 'spec-btn--primary' },
        { label: 'Menu', className: 'spec-btn--ghost' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Grid',
      name: 'Webflow',
      kind: 'Platform',
      what: 'A visual site builder that hosts the page and generates its stylesheet from a shared set of variables.',
      attributes: [
        { label: 'Hosts', value: 'The page and its assets' },
        { label: 'Supplies', value: 'The class and token system' },
        { label: 'Collections', value: 'Projects, process, insights' },
        { label: 'Grid', value: '12 columns' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Curve',
      name: 'GSAP',
      kind: 'Animation',
      what: 'A library for sequencing animation, so movements run in a planned order rather than all at once.',
      attributes: [
        { label: 'Drives', value: 'Scroll reveals, split lines' },
        { label: 'Also runs', value: 'The draggable process slider' },
        { label: 'Scale', value: '20 triggers, 48 live tweens' },
        { label: 'Easing', value: 'cubic-bezier(.65,0,0,1)' },
      ],
      tags: ['Motion'],
    },
    {
      icon: 'Mouse',
      name: 'Lenis',
      kind: 'Scroll',
      what: 'A layer that takes over scrolling from the browser so the page moves with weight instead of stopping dead.',
      attributes: [
        { label: 'Feel', value: 'Glide, takes over the wheel' },
        { label: 'Feeds', value: 'Scroll position to GSAP' },
        { label: 'Axis', value: 'Vertical only' },
        { label: 'Reach', value: 'The whole document' },
      ],
      tags: ['Motion', 'Scroll'],
    },
    {
      icon: 'Cube',
      name: 'Barba.js',
      kind: 'Transitions',
      what: 'Swaps the contents of a page without a full browser reload, so moving between pages does not blank the screen.',
      attributes: [
        { label: 'Swaps', value: 'Content, not the document' },
        { label: 'Covered by', value: 'The clip-path loader' },
        { label: 'Result', value: 'No white flash between pages' },
        { label: 'Scope', value: 'Every route on the site' },
      ],
      tags: ['Motion'],
    },
  ],
}
