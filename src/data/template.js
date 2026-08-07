/**
 * All showcase copy and design-system data lives here.
 *
 * Swap the page in the preview by changing `previewSrc` — it points at a
 * standalone HTML file in /public, loaded into an iframe so its CSS is fully
 * isolated from this showcase's CSS. Drop your own file in /public/preview/
 * and update this one line.
 */

export const template = {
  // A full https:// URL also works here, for any site that permits framing.
  previewSrc: '/preview/index.html',

  kicker: 'Design System Template',
  title: 'Auralis',
  subtitle: 'Clean Paper Workflow',

  description:
    'A warm, print-led interface system built for products that need to feel considered rather than loud. Hairline rules, a single accent, and an eight-point rhythm carry the entire layout — no filled panels, no decorative gradients.',

  /**
   * The at-a-glance read: what this page is, and what it's made of.
   *
   * Two groups rather than one because the two lists answer different
   * questions — "Luxury" describes how the page feels, "GSAP" describes what's
   * in the bundle. A single label covering both has to be vague enough to be
   * true of either, which is how you end up with "Tags".
   *
   * The renderer walks this array, so the shape is the control: add a third
   * group and it appears; collapse to one and it renders as a single row.
   */
  attributes: [
    { label: 'Character', items: ['Editorial', 'Luxury', 'Interactive'] },
    { label: 'Tech Stack', items: ['React Native', 'GSAP'] },
  ],

  overview: {
    heading: 'Overview',
    lead: 'The strategic read of this page.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
}
