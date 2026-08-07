/**
 * Ensemble — page two.
 *
 * Content comes from the OUTFIT design audit, which was run against the live
 * page in a connected browser. Values in the system block are measured, not
 * estimated.
 *
 * One thing to know: the audit describes the original Next.js site, while the
 * page in the iframe is the static rebuild in /public/ensemble. The design is
 * the same, the delivery is not, so the tech stack section documents the
 * original build rather than the copy on screen.
 */

export const ensemble = {
  id: 'ensemble',
  previewSrc: '/ensemble/index.html',

  kicker: 'Design System Template',
  title: 'Ensemble',
  subtitle: 'Everyday Pieces, Small Runs',

  description:
    'A DTC ecommerce template for fashion and streetwear brands that merchandise products with a graphic, editorial look rather than a standard retail grid.',

  attributes: [
    { label: 'Character', items: ['Retail', 'Editorial', 'Rectilinear'] },
    { label: 'Tech Stack', items: ['Next.js', 'GSAP', 'Lenis', 'Tailwind'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'Swiss-inspired brutalist minimalism with premium DTC polish. Restraint puts the product first: oversized graphics, editorial layout, and asymmetric composition.',
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
        'The page reads as immediate, graphic, and deliberately designed. The interface is treated as an extension of the brand rather than a neutral container for products, which is why industrial textures, assertive type, disciplined grids, and unexpected composition all pull in one direction. The effect is a space that feels like a design studio that happens to make clothing, rather than a retailer selling it.',
    },
    {
      principle: 'Color',
      rationale:
        'A neutral foundation lets a single saturated accent do the signaling. Because that accent is the only strong color on the page, the eye learns to read it as meaning "act here": navigation, pricing, branding, and calls to action. Consistency is what makes it work; the moment the accent appears somewhere decorative, the cue breaks.',
    },
    {
      principle: 'Typography',
      rationale:
        "Hierarchy comes from scale, not weight. Using a large neo-grotesk at very different sizes, with few styles and tight spacing, means the size jump alone tells you what's a headline and what's body. That's why the oversized headlines read as editorial rather than loud: there's nothing competing with them.",
    },
    {
      principle: 'Grid',
      rationale:
        "A rigid modular grid sets the baseline consistency, and selective column spans create rhythm against it. The reason the asymmetry looks intentional rather than sloppy is that every element still aligns to the underlying grid; you're breaking a rule that's clearly present, not working without one.",
    },
    {
      principle: 'White space',
      rationale:
        'Generous negative space isolates each product so the eye has one thing to focus on at a time, which is what reads as premium. Here the empty space is doing a job (separation and emphasis) rather than sitting there as leftover room.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        "Interactions stay understated on purpose. Hover states, subtle transitions, and cursor feedback confirm that something is interactive and reward exploration, but they're quiet enough that they never compete with the products for attention.",
    },
    {
      principle: 'UX',
      rationale:
        'The commerce flow borrows the logic of an editorial gallery. Clear hierarchy tells you where to look, predictable scanning patterns and persistent navigation keep you oriented, and products reveal themselves progressively as you move down the page, so browsing stays low-effort.',
    },
  ],

  /**
   * Specimen tokens. These paint the design-system stages below so the palette
   * is judged against the page's own ground rather than the chrome's white.
   */
  specTokens: {
    paper: '#ede4dd',
    paperDeep: '#d2cac3',
    card: '#ede4dd',
    ink: '#000000',
    ink2: '#5a5a5a',
    ink3: '#7a7a7a',
    rule: 'rgba(0, 0, 0, 0.16)',
    accent: '#ff0001',
    accentSoft: '#d2cac3',
    display: "'Neue Haas Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    label: "'Neue Haas Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    labelTracking: '0.02em',
    // Radius is 0px on every element of this page.
    btnRadius: '0px',
  },

  system: {
    /**
     * One family across nine roles. Three cuts load, mapped to 400 / 700 / 800.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Neue Haas Grotesk',
          weights: '800',
          stack: "'NHG', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Body',
          family: 'Neue Haas Grotesk',
          weights: '400',
          stack: "'NHG', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'Neue Haas Grotesk',
          weights: '700',
          stack: "'NHG', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      ],
    },

    /**
     * Three themes, each exactly two values. White is aliased to cream, so no
     * true white exists anywhere on the page.
     */
    colors: {
      groups: [
        {
          name: 'Theme values',
          swatches: [
            { value: '#000000', note: 'Primary' },
            { value: '#EDE4DD', note: 'Secondary' },
            { value: '#FF0001', note: 'Accent' },
          ],
        },
        {
          // Left unlabelled: this is an image placeholder tone and has no
          // place in the hierarchy above.
          name: 'Support',
          swatches: [{ value: '#D2CAC3' }],
        },
      ],
    },

    spacing: {
      base: 4,
      steps: [
        { name: 'XS', value: 4 },
        { name: 'SM', value: 8 },
        { name: 'MD', value: 16 },
        { name: 'LG', value: 24 },
      ],
      applied: [
        { name: 'Section rhythm', value: '136px' },
        { name: 'Grid gutter', value: '16 / 24px' },
        { name: 'Card internals', value: '4 – 12px' },
        { name: 'Media ratio', value: '9:12' },
      ],
      radii: ['0px', '999px'],
    },

    /**
     * There is no icon set. The only round objects are controls and markers,
     * which is what this box documents instead.
     */
    icons: {
      specs: [
        { name: 'Icon set', value: 'None' },
        { name: 'Theme dots', value: '18 / 68px' },
        { name: 'Category marker', value: '8px' },
        { name: 'Round shapes', value: 'Controls only' },
      ],
    },

    /**
     * The page has no buttons in the usual sense. Affordance lives in the
     * underline and in the cursor.
     */
    buttons: {
      variants: [
        { label: 'Shop', className: 'spec-btn--text' },
        { label: 'View more', className: 'spec-btn--primary' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Cube',
      name: 'Next.js',
      kind: 'Framework',
      what: 'A React framework that builds the page on the server and sends finished HTML, then wakes up the interactive parts in the browser.',
      attributes: [
        { label: 'Renders', value: 'Server first, then hydrates' },
        { label: 'Wakes up', value: 'Theme switcher, cursor, bag' },
        { label: 'Fonts', value: 'Self hosted, metric matched' },
        { label: 'Product data', value: 'Embedded in the page' },
      ],
      tags: ['Typography', 'Structure'],
    },
    {
      icon: 'Grid',
      name: 'Tailwind CSS',
      kind: 'Styling',
      what: 'A styling system where sizes, spaces, and colours come from one shared set of values rather than being written by hand each time.',
      attributes: [
        { label: 'Rhythm', value: '4px base unit' },
        { label: 'Themes', value: 'Three, two values each' },
        { label: 'Grids', value: 'Editorial 16, products 4' },
        { label: 'Radii', value: 'Zero everywhere' },
      ],
      tags: ['Spacing', 'Colors', 'Shapes'],
    },
    {
      icon: 'Curve',
      name: 'GSAP',
      kind: 'Animation',
      what: 'A library for sequencing animation, so movements run in a planned order rather than all at once.',
      attributes: [
        { label: 'Handles', value: 'Programmatic scrolling' },
        { label: 'Reveals', value: 'Images settle in on entry' },
        { label: 'Easing', value: 'Long, extreme ease out' },
        { label: 'At rest', value: 'Nothing moves on its own' },
      ],
      tags: ['Motion', 'Scroll'],
    },
    {
      icon: 'Mouse',
      name: 'Lenis',
      kind: 'Scroll',
      what: 'A layer that takes over scrolling from the browser so the page moves with weight instead of stopping dead.',
      attributes: [
        { label: 'Feel', value: 'Glide, takes over the wheel' },
        { label: 'Axis', value: 'Vertical only' },
        { label: 'Reach', value: 'The whole document' },
        { label: 'Length', value: 'Just under four screens' },
      ],
      tags: ['Motion', 'Scroll'],
    },
  ],
}
