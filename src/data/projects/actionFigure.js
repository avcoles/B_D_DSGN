/**
 * Action Figure — page five.
 *
 * A creative-studio page built from the ToyFight reference snapshot: the CRT
 * boot screen, the typed command terminal, the slot-machine tagline and the
 * raster display face all come from that read. The 3D hero does not — the
 * reference uses filmed and rendered product work, and this page answers it
 * with a real-time articulated figure so the "poseable" claim is literally
 * true rather than illustrated.
 *
 * Everything in the system block is measured off public/action-figure/styles.css
 * and figure.js. Nothing here is estimated.
 */

export const actionFigure = {
  id: 'action-figure',
  previewSrc: '/action-figure/index.html',

  kicker: 'Design System Template',
  title: 'Action Figure',
  subtitle: 'Creative Studio',

  description:
    'A studio template for agencies whose work is the argument. Dark, instrumented and loud, with a real-time 3D figure as the hero and a typed command terminal in place of a conventional menu — built for practices that want the site itself to be a demonstration of what they can do.',

  attributes: [
    { label: 'Character', items: ['Playful', 'Instrumented', 'Loud'] },
    { label: 'Tech Stack', items: ['Three.js', 'Vanilla JS', 'CSS Grid'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'A studio that sells craft has to show craft before it describes it, so the page opens on something the visitor cannot get anywhere else: a figure that is genuinely articulated, rendered live, that turns as they move the mouse and re-poses when they ask it to. Everything after that — the mono readouts, the boot sequence, the terminal — exists to keep the same promise, which is that this is a place where things are actually built.',
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
        'The page opens with a demonstration and closes with a claim, which is the reverse of the usual order. By the time the tagline arrives in the footer the visitor has already watched a figure assemble itself, re-pose on demand and track their cursor, so the words are confirming something they have seen rather than asking to be believed.',
    },
    {
      principle: 'Color',
      rationale:
        'One violet on near-black, with three toy-plastic secondaries held back for the project cards. Because violet appears only on the ticker, on hover and inside the 3D render, it reads as a state rather than a decoration: where the page is violet, the page is live. The secondaries earn their keep by making four otherwise identical cards distinguishable at a glance.',
    },
    {
      principle: 'Typography',
      rationale:
        'A single variable family carries the whole page by moving on its width axis instead of adding families. Display sits at width 112 and weight 900, section labels at width 72, body at 100. The mono is doing a different job entirely — it is the voice of the machine, reserved for readouts, numbers and the terminal, so a mono label always means "this is data".',
    },
    {
      principle: 'Grid',
      rationale:
        'A two-column work grid where two of four cards span the full width. The alternation stops the section from reading as a catalogue and gives the two flagship projects room without moving them to a separate section. Every other section is a single measured column, so the grid change is itself a signal that this part of the page is the portfolio.',
    },
    {
      principle: 'White space',
      rationale:
        'The hero is deliberately crowded and everything after it is not. Compressing the headline, the render and four corner readouts into one viewport buys the attention that the calmer sections then spend slowly. Reversing that — an airy hero and dense sections — would make the studio look like it had more to say than to show.',
    },
    {
      principle: 'Behaviors / Interactions / Cursor',
      rationale:
        'Motion is mechanical rather than organic: masks wipe, reels step, labels swap on a hard cubic-bezier, and the boot columns retract from the centre out. Nothing eases in softly, because a studio whose mascot is an injection-moulded toy should move like one. The figure is the exception — it is damped toward its targets, so it has weight.',
    },
    {
      principle: 'UX',
      rationale:
        'Every navigation route exists twice: as links in the header and as typed commands behind the "/" key. The terminal is a toy, but it is a working one — it routes, it applies screen effects, and it tells you when a command is wrong. Doubling the navigation means the novelty never blocks anyone, which is the condition on which novelty is allowed at all.',
    },
  ],

  /**
   * Specimen tokens, read off styles.css. `paper` is the page's near-black
   * because the specimens have to be judged on the surface they ship on — a
   * violet checked against white would be a different colour decision.
   */
  specTokens: {
    paper: '#0E0E0E',
    paperDeep: '#161616',
    card: '#1F1F1F',
    ink: '#F5F5F5',
    ink2: 'rgb(245 245 245 / 0.66)',
    ink3: 'rgb(245 245 245 / 0.40)',
    rule: 'rgb(245 245 245 / 0.14)',
    accent: '#5D2DE6',
    accentSoft: 'rgb(93 45 230 / 0.16)',
    display: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    label: "'JetBrains Mono', ui-monospace, Menlo, monospace",
    labelTracking: '0.06em',
    btnRadius: '100vw',
  },

  system: {
    /**
     * Two families doing three jobs. Archivo is variable on both axes, so the
     * expanded display cut and the condensed section labels are the same font
     * file at different widths.
     */
    typography: {
      faces: [
        {
          role: 'Display',
          family: 'Archivo',
          weights: '900 · wdth 112',
          stack: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Body',
          family: 'Archivo',
          weights: '400 – 700 · wdth 100',
          stack: "'Archivo', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        },
        {
          role: 'Label',
          family: 'JetBrains Mono',
          weights: '500 – 700',
          stack: "'JetBrains Mono', ui-monospace, Menlo, monospace",
        },
      ],
    },

    colors: {
      groups: [
        {
          name: 'Surface',
          swatches: [
            { value: '#0E0E0E', note: 'Primary' },
            { value: '#161616', note: 'Raised' },
          ],
        },
        {
          name: 'Accent',
          swatches: [
            { value: '#5D2DE6', note: 'Violet' },
            { value: '#9E81F0', note: 'Lavender' },
          ],
        },
      ],
    },

    /**
     * A fluid scale rather than a fixed rhythm: the edge padding and the grid
     * gutter both clamp against the viewport, so the page zooms rather than
     * stepping through breakpoints.
     */
    spacing: {
      base: 8,
      steps: [
        { name: 'XS', value: 8 },
        { name: 'SM', value: 16 },
        { name: 'MD', value: 24 },
        { name: 'LG', value: 40 },
      ],
      applied: [
        { name: 'Edge padding', value: '20 → 64px' },
        { name: 'Grid gutter', value: '16 → 24px' },
        { name: 'Columns', value: '2 → 1' },
        { name: 'Max width', value: '1680px' },
      ],
      radii: ['0px', '2px', '100vw'],
    },

    icons: {
      specs: [
        { name: 'Icon set', value: 'Drawn in place' },
        { name: 'Stroke', value: '1.4px' },
        { name: 'Caps', value: 'Butt' },
        { name: 'Style', value: 'Filled mark, stroked arrows' },
      ],
    },

    buttons: {
      variants: [
        { label: 'Start a build', className: 'spec-btn--primary' },
        { label: 'Meet the studio', className: 'spec-btn--ghost' },
      ],
    },
  },

  techStack: [
    {
      icon: 'Curve',
      name: 'Three.js',
      kind: '3D',
      what: 'The hero figure is built at runtime from capsules and spheres in a nested joint hierarchy — no model file, no loader, no textures.',
      attributes: [
        { label: 'Rig', value: '15 joints, 4 poses' },
        { label: 'Lighting', value: 'Key, fill, rim + procedural env' },
        { label: 'Shadows', value: 'PCF, 1024 map' },
        { label: 'Budget', value: 'DPR capped at 2, paused off-screen' },
      ],
      tags: ['Motion', 'Shapes'],
    },
    {
      icon: 'Grid',
      name: 'CSS Grid',
      kind: 'Layout',
      what: 'The browser’s own layout system. Two columns for work, one for everything else, with clamp() doing the job breakpoints usually do.',
      attributes: [
        { label: 'Max width', value: '1680px' },
        { label: 'Breakpoints', value: '900px, 640px' },
        { label: 'Gutter', value: '16 → 24px' },
        { label: 'Radii', value: '0, 2px, pill' },
      ],
      tags: ['Spacing', 'Shapes'],
    },
    {
      icon: 'Curve',
      name: 'Vanilla JavaScript',
      kind: 'Motion',
      what: 'No animation library. Reveals, reels, the boot wipe and the terminal are all class toggles against CSS transitions.',
      attributes: [
        { label: 'Easing', value: 'cubic-bezier(.16,1,.3,1)' },
        { label: 'Mechanical', value: 'cubic-bezier(.65,0,.35,1)' },
        { label: 'Trigger', value: 'IntersectionObserver at 0.1' },
        { label: 'Stagger', value: '60 – 90ms, set as --d' },
      ],
      tags: ['Motion'],
    },
  ],
}
