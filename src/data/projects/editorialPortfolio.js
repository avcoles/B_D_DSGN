/**
 * Editorial Portfolio.
 *
 * Rebuild of a digital artist's index page from a saved-page snapshot,
 * rebranded. The source is a Nuxt 2 app on DatoCMS running Tailwind 2, GSAP
 * and GSAP Flip. This gets the same per-letter wordmark entrance, the same
 * z-index photograph stack and the same clip-path contact wipe out of CSS
 * transitions and about 250 lines of plain JavaScript.
 *
 * Everything in the system block is measured off the snapshot's stylesheet
 * and reproduced in public/editorial-portfolio/styles.css. Two typefaces are
 * substituted and one wordmark was redrawn as live text; the README in that
 * folder covers both, plus the trial licence on Dia.
 */

export const editorialPortfolio = {
  id: 'editorial-portfolio',
  previewSrc: '/editorial-portfolio/index.html',

  kicker: 'Design System Template',
  title: 'Editorial Portfolio',
  subtitle: 'Digital Artist',

  description:
    'A portfolio index that fits on one screen and never scrolls: eleven client names, one photograph, and the artist’s name across the floor.',

  attributes: [
    { label: 'Character', items: ['Quiet', 'Typographic', 'Precise'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid', 'CSS Transitions'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'The page opens on a list of clients instead of the best image, which only works because the names are set at 58px and nothing else is competing for the screen.',
      'Nothing scrolls, so the whole pitch has to land at a glance.',
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        'Lead with the client list, not the showreel. Eleven names and one small photograph invert what a portfolio usually does, and it reads as confidence: the work is assumed to be good, so the only question left is which piece you want to see. Showing one image at a time also means nobody is comparing, only choosing.',
    },
    {
      principle: 'Color',
      rationale:
        'Two colours, and a third you have to ask for. Black type on white, plus a warm brown that exists only inside the contact panel, so the one moment the site changes colour is the one moment it wants something from you. The header carries no colour at all. It is white type in difference blend mode, which reads black over the page and flips itself the instant the black menu field passes under it.',
    },
    {
      principle: 'Typography',
      rationale:
        'One face at one weight, and a second face used twice. Nav, list, clock and the roman half of the wordmark are all the same cut, so size and position carry the hierarchy on their own. The exception is the wordmark, where a high-contrast italic sits beside the grotesque with its x-height set to the roman’s cap height. Two cases in two faces, reading as one size.',
    },
    {
      principle: 'Grid',
      rationale:
        'Twelve columns, and the list only takes eight of them. Starting the projects at the fifth column leaves two columns for the photograph and one of air between, which is what keeps a wrapping list of names from reading as a paragraph. One breakpoint moves three things at once: six columns to twelve, a 7rem gutter down to 2.4rem, a 2rem page margin out to 5rem.',
    },
    {
      principle: 'White space',
      rationale:
        'The screen is the unit, not the section. On a fixed page that never scrolls, the empty area is the composition rather than what is left after the content, and only three zones are occupied: the chrome across the top, the list in the upper middle, the wordmark on the floor. Everything right of the list and below it is empty on purpose.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Hover is one property, and it stays put. Every link sits at 25% black and comes up to 100%. Nothing changes size, weight or colour, and the highlight does not follow the pointer: the last project entered stays lit after the cursor leaves, so the page always has one thing selected and the photograph always has something to show. The entrance is the only piece of spectacle. The wordmark is born small and centred, its letters rise into it one at a time, the two words part, and the lockup flips down to the floor at full size.',
    },
    {
      principle: 'UX',
      rationale:
        'Give the page one live detail and put it where the eye already rests. A Lisbon clock sits at the end of the footer rule with a colon blinking on the second. On a screen that never scrolls it is the only thing proving the page is running, and it quietly tells a client in another timezone what hour they are writing into. The contact panel works the same way: it wipes in diagonally instead of opening as a modal, and the form is laid out as a letter, with the address row a button that copies rather than a field you retype.',
    },
  ],

  /**
   * Specimen tokens. The page draws in two colours, so ink2 and ink3 are the
   * two opacity steps it actually uses on black.
   */
  specTokens: {
    paper: '#ffffff',
    card: '#ffffff',
    ink: '#000000',
    ink2: 'rgb(0 0 0 / 0.5)',
    ink3: 'rgb(0 0 0 / 0.25)',
    rule: 'rgb(0 0 0 / 0.14)',
    accent: '#b1684d',
    display: "'Playfair Display', Georgia, 'Times New Roman', serif",
    label: "'Dia', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    labelTracking: '0em',
    btnRadius: '9999px',
  },

  system: {
    /**
     * Two faces, three jobs. Body and Label are the same cut at the same
     * weight; what separates them is position, which is the point the page
     * is making. Display is the only place the italic appears.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Playfair Display',
          weights: '700 italic',
          stack: "'Playfair Display', Georgia, 'Times New Roman', serif",
        },
        {
          role: 'Body',
          family: 'Dia',
          weights: '400',
          stack: "'Dia', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'Dia',
          weights: '400 · 1.8rem at 25%',
          stack: "'Dia', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#FFFFFF', note: 'Page' },
            { value: '#B1684D', note: 'Contact' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#000000', note: 'Primary' },
            { value: '#868686', note: 'Muted' },
          ],
        },
      ],
    },

    /**
     * The root is a thousandth of the viewport, capped at 14px, so every step
     * below is that scale in rem and the page is one proportion at any width.
     */
    spacing: {
      base: 10,
      steps: [
        { name: 'XS', value: 10 },
        { name: 'SM', value: 20 },
        { name: 'MD', value: 50 },
        { name: 'LG', value: 120 },
      ],
      applied: [
        { name: 'Gutter', value: '7rem → 2.4rem' },
        { name: 'Page margin', value: '2rem → 5rem' },
        { name: 'Columns', value: '6 → 12' },
        { name: 'Breakpoint', value: '650' },
      ],
      radii: ['0px', '9999px'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'None' },
        { name: 'Ornament', value: 'One arrow glyph' },
        { name: 'Fill', value: 'currentColor' },
        { name: 'Style', value: 'Set as text' },
      ],
    },

    buttons: {
      variants: [
        { label: 'Send it', className: 'spec-btn--primary' },
        { label: 'Drop me a line', className: 'spec-btn--ghost' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Curve',
      name: 'CSS transitions',
      kind: 'Motion',
      what: 'The source runs GSAP, GSAP Flip and a CustomEase plugin. This gets the same entrance from CSS: the wordmark is laid out at its destination and its start is written as one transform per word, so removing the transform is the whole animation. One composited step, nothing measured per frame.',
      attributes: [
        { label: 'Easing', value: 'cubic-bezier(.549, .054, .014, 1)' },
        { label: 'Letters', value: '1.3s, staggered .07s' },
        { label: 'The flip', value: '1.5s, after a 1s parting' },
        { label: 'List reveal', value: '1.25s, staggered .075s' },
      ],
      tags: ['Motion'],
    },
    {
      icon: 'Grid',
      name: 'CSS Grid & container units',
      kind: 'Layout',
      what: 'One fixed screen with three occupied zones, and a root font-size that is a thousandth of the viewport, so the page is a single proportion. The wordmark is sized in cqw, a share of its own column rather than of the window, which is how live type behaves like the outlined artwork it replaces.',
      attributes: [
        { label: 'Columns', value: '6 / 12' },
        { label: 'Root size', value: '1000vw ÷ 390 or 1500, ≤14px' },
        { label: 'Lockup', value: '40.5% / 59.5%, no gap' },
        { label: 'Radii', value: '0, or a full pill' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Mouse',
      name: 'Vanilla JavaScript',
      kind: 'Behaviour',
      what: 'About 250 lines in place of a Nuxt app, a store and three GSAP plugins. It measures the intro once, raises a photograph on hover, keeps a clock and opens two overlays. It never animates anything. It adds a class or writes a custom property, and CSS does the moving.',
      attributes: [
        { label: 'Thumbnail', value: 'One z-index write per hover' },
        { label: 'Selection', value: 'Persists after the pointer leaves' },
        { label: 'Clock', value: 'One timer, next minute boundary' },
        { label: 'Overlays', value: 'aria-hidden and class, together' },
      ],
      tags: ['Motion', 'Accessibility'],
    },
  ],
}
