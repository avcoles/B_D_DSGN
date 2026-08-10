/**
 * Tempo — page eight.
 *
 * Rebuild of a creative agency's homepage from a saved-page snapshot,
 * rebranded. The source is a Nuxt 2 app on DatoCMS running GSAP,
 * ScrollTrigger, Flip, SplitText and a Lottie logotype. This is plain HTML,
 * CSS and about 450 lines of JavaScript, and it gets the same scrubbed hero
 * flight, the same masked reveals and the same cursor-tracked reel out of
 * `position: sticky`, one scroll listener and one rAF.
 *
 * Every number in the system block is measured off the snapshot's inline
 * stylesheet and reproduced in public/tempo/styles.css. At 1440 the rebuild
 * lands every section on the snapshot's exact offset and height. The one
 * substitution is the typeface, which the README covers.
 */

export const tempo = {
  id: 'tempo',
  previewSrc: '/tempo/index.html',

  kicker: 'Design System Template',
  title: 'Tempo',
  subtitle: 'Creative Agency',

  description:
    'An agency homepage that shows the work before it makes the pitch. The showcase tracks your cursor and flies into place as you scroll, so you have seen something made before you read a word about it.',

  attributes: [
    { label: 'Character', items: ['Swiss', 'Quiet', 'Kinetic'] },
    { label: 'Tech Stack', items: ['Vanilla JS', 'CSS Grid', 'CSS Sticky'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'The wordmark owns the first screen and the showcase owns the second, and the scroll between them is the transition rather than reading distance.',
      'After that the page goes quiet and lets the photography do the selling.',
    ],
  },

  /**
   * Seven principles, named by the area of the system each one governs.
   */
  principles: [
    {
      principle: 'Narrative',
      rationale:
        'The work arrives before the pitch does. The first screen is the wordmark assembling, the second is the showcase, and the scroll between them is the transition rather than reading distance. You have seen what the agency makes before you read a claim about it.',
    },
    {
      principle: 'Color',
      rationale:
        'Black, white, and a grey for anything that is not a claim. With no accent colour, photography and video are the only things on the page carrying hue. Body copy sits at soft grey and the one claim per block goes to full ink, so you can skim the argument without the support.',
    },
    {
      principle: 'Typography',
      rationale:
        'One face, two weights, and a root size that is a fraction of the viewport rather than a pixel value. Nothing in the scale has a breakpoint: a 22rem headline and a 1.8rem caption hold their ratio at every width, so the design zooms instead of reflowing.',
    },
    {
      principle: 'Grid',
      rationale:
        'Twelve columns, and a page margin the work section is allowed to ignore. Everything else sits 5.8rem off the edge while the two case studies run to 1.6rem, and that one exception is what makes them read as a spread instead of more content.',
    },
    {
      principle: 'White space',
      rationale:
        'The vertical gaps are enormous and they grow as the page goes on, from 16rem after the approach block to 40rem after the work. Middle columns are left empty on purpose: the studio text starts at column eight of twelve and the picture is not allowed to fill the hole.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Everything that moves is scrubbed by something the reader is doing. The showcase card drifts after the cursor, and that drift is scaled by the inverse of the scroll progress, so it stops chasing the mouse at the rate it starts obeying the scroll.',
    },
    {
      principle: 'UX',
      rationale:
        'The header is painted in difference blend mode, so one white bar reads correctly over the page, over black video and over any frame of work. The services list doubles as the position of the card it controls: point at a word and the card slides level with it.',
    },
  ],

  /**
   * Specimen tokens, measured from the snapshot's stylesheet. There is no
   * accent, so `accent` points at the ink. The page genuinely has nothing
   * else and inventing one here would misreport it.
   */
  specTokens: {
    paper: '#ffffff',
    card: '#eeeeee',
    ink: '#000000',
    ink2: '#555555',
    ink3: '#888a8b',
    rule: 'rgb(0 0 0 / 0.15)',
    accent: '#000000',
    display: "'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    label: "'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    labelTracking: '0em',
    btnRadius: '0px',
  },

  system: {
    /**
     * One family, two weights, and no width axis to reach for. Arimo has only
     * a weight axis, so the display role is the same face at the same width
     * and the wordmark is shaped by leading instead.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Arimo',
          weights: '700 · tracking -.02em · leading .68',
          stack: "'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Body',
          family: 'Arimo',
          weights: '400 · leading 1.5',
          stack: "'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'Arimo',
          weights: '500 · tracking 0',
          stack: "'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#FFFFFF', note: 'Page' },
            { value: '#EEEEEE', note: 'Media' },
          ],
        },
        {
          name: 'Ink',
          swatches: [
            { value: '#000000', note: 'Primary' },
            { value: '#888A8B', note: 'Body' },
          ],
        },
      ],
    },

    /**
     * The root size is `clamp(1px, 12px, 10 * 100vw / --size)`, a viewport
     * ratio with a ceiling rather than a fixed value. Every step below is a
     * proportion of the window up to 1800px and a constant after it, which is
     * why the type scale has no breakpoint.
     */
    spacing: {
      base: 10,
      steps: [
        { name: 'XS', value: 15 },
        { name: 'SM', value: 23 },
        { name: 'MD', value: 58 },
        { name: 'LG', value: 85 },
      ],
      applied: [
        { name: 'Gutter', value: '0.5rem → 2.4rem' },
        { name: 'Page margin', value: '2.3rem → 5.8rem' },
        { name: 'Columns', value: '6 → 12' },
        { name: 'Breakpoint', value: '650' },
      ],
      radii: ['0.5rem', '0.75rem', '1rem', '1.2rem'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'None' },
        { name: 'Glyphs', value: 'Two arrows, one play' },
        { name: 'Fill', value: 'currentColor' },
        { name: 'Style', value: 'Drawn as a path' },
      ],
    },

    buttons: {
      variants: [
        { label: 'More on how we work', className: 'spec-btn--ghost' },
        { label: 'See all projects', className: 'spec-btn--primary' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Curve',
      name: 'CSS transitions',
      kind: 'Motion',
      what: 'The source registers two GSAP CustomEase paths and both are reproduced rather than approximated. One turns out to be an exact cubic-bezier. The other is a three-segment path with no cubic equivalent, so it is sampled into a `linear()` and keeps its shape.',
      attributes: [
        { label: 'Unmask', value: 'cubic-bezier(.2, 0, 0, 1)' },
        { label: 'Snappy', value: 'linear(), 24 samples' },
        { label: 'Reveal', value: '1s, staggered .1s per line' },
        { label: 'Underline', value: '.55s, redrawn on a .2s offset' },
      ],
      tags: ['Motion'],
    },
    {
      icon: 'Grid',
      name: 'CSS Grid & sticky',
      kind: 'Layout',
      what: 'A two-screen hero whose first screen is sticky. That screen slides out by exactly one viewport height across the scrub, which cancels the sticky offset and keeps the showcase card flying in a straight line. No pinning maths anywhere.',
      attributes: [
        { label: 'Columns', value: '6 / 12' },
        { label: 'Root size', value: '10 × 100vw ÷ 1500, max 12px' },
        { label: 'Hero', value: '200vh, first screen sticky' },
        { label: 'Work margin', value: '1.6rem, against 5.8rem' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Mouse',
      name: 'Vanilla JavaScript',
      kind: 'Behaviour',
      what: 'About 450 lines standing in for GSAP, ScrollTrigger, Flip, SplitText, Lottie and a Nuxt app. It measures text, reads scroll and reads the cursor. Everywhere else it writes a class or a custom property and lets CSS do the animating.',
      attributes: [
        { label: 'Splitting', value: 'Chars once, lines re-measured' },
        { label: 'Reveals', value: 'One IntersectionObserver, -15% bottom' },
        { label: 'Menu', value: 'aria-hidden + inert, together' },
        { label: 'Frame loop', value: 'One rAF, delta-normalised' },
      ],
      tags: ['Motion', 'Accessibility'],
    },
  ],
}
