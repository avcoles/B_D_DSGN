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
    'A merch store for a design studio wearing its own label. Thirteen products, two colours, and a grid that changes rhythm row to row so the page reads as a curated release rather than a catalogue.',

  attributes: [
    { label: 'Character', items: ['Retail', 'Editorial', 'Rectilinear'] },
    { label: 'Tech Stack', items: ['Next.js', 'GSAP', 'Lenis', 'Tailwind'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'A merch store landing page for a design studio’s own apparel label. Its job is to make thirteen products feel like a curated release rather than a catalogue, and almost every decision on the page serves that one idea.',
      'It works by removing rather than adding. No hero photograph, no headline, no shop button anywhere. A wordmark fills the screen, two colours carry the entire layout, and the only saturated colour left belongs to the products themselves.',
    ],
  },

  /**
   * The design constitution, eight principles. Each one has to travel and each
   * one is earned by a component on the page.
   */
  principles: [
    {
      principle: 'Set the name big enough that it stops being text',
      rationale:
        'A wordmark filling the screen tells you what the site is in the glance you would have spent on a hero photo. No tagline needed.',
      // Earned by: OUTFIT as vector letterforms, edge to edge, a fifth of the screen tall
    },
    {
      principle: 'Two colours, and let the photographs be the third',
      rationale:
        'If the layout is only a background and an ink, every scrap of colour on screen belongs to a product. The eye lands on merchandise by default.',
      // Earned by: three themes, each exactly two values
    },
    {
      principle: 'Take out corners and shadows so nothing looks like a button',
      rationale:
        'Rounded floating boxes read as software. Flat square edges read as printed matter, and people slow down for printed matter.',
      // Earned by: radius 0px on every content element, box-shadow none everywhere
    },
    {
      principle: 'Change the grid rhythm row to row',
      rationale:
        'Identical rows read as inventory and get scanned. A different count at a different size keeps people scrolling to see what is next.',
      // Earned by: a straight row of four, then staggered and stepped rows
    },
    {
      principle: 'Leave more empty space than feels comfortable',
      rationale:
        'Gaps give each product its own moment. A page that fills every column is telling you it has stock to move.',
      // Earned by: 136px section rhythm against 4 to 12px card internals
    },
    {
      principle: 'Personality in the words, strictness in the layout',
      rationale:
        'If the copy jokes, the grid can stay severe without going cold. The humour also survives a redesign, because it lives in the writing.',
      // Earned by: the footer statement against an entirely rectilinear grid
    },
    {
      principle: 'Let the pointer carry the instruction',
      rationale:
        'When the cursor becomes a view more label over a product, no card needs a button. The grid stays a clean wall of pictures.',
      // Earned by: the custom cursor, swelling to a red disc over any product
    },
    {
      principle: 'Use the first seconds to set tone, not to apologise for loading',
      rationale:
        'A counter and flickering product shots turn a wait into a title sequence. The counter has a visible end, so the wait feels bounded.',
      // Earned by: the preloader, 000 to 100 behind flickering product photography
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
          sample: 'Made to be worn',
        },
        {
          role: 'Body',
          family: 'Neue Haas Grotesk',
          weights: '400',
          stack: "'NHG', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          sample: 'Product titles, prices, and lead copy',
        },
        {
          role: 'Label',
          family: 'Neue Haas Grotesk',
          weights: '700',
          stack: "'NHG', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          sample: 'Apparel',
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
            { value: '#000000', note: 'Ground or ink' },
            { value: '#EDE4DD', note: 'Ground or ink' },
            { value: '#FF0001', note: 'Signal, cursor' },
          ],
        },
        {
          name: 'Support',
          swatches: [{ value: '#D2CAC3', note: 'Image placeholder' }],
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
        {
          label: 'Shop',
          className: 'spec-btn--text',
          role: 'Nav link',
          note: 'Underline wipes in from the left',
        },
        {
          label: 'View more',
          className: 'spec-btn--primary',
          role: 'Pointer',
          note: 'The only call to action, and it rides the cursor',
        },
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
