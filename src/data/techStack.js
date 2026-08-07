/**
 * Tech stack (part two of the design audit).
 *
 * Placeholder content. The page in the preview iframe is plain HTML and CSS, so
 * there is nothing here to probe. These entries exist to exercise the layout and
 * will be replaced per page.
 *
 * Written for a reader who does not know the library. That decides every field
 * below: no version strings, no detection markers, no confidence scoring. Those
 * answer "where did you get this", and the question being answered here is
 * "what is this doing to the page I am looking at".
 *
 *   name        The library, as someone would search for it.
 *   kind        Its category, in plain words.
 *   what        One line on what the thing is, for someone meeting it cold.
 *   attributes  Four readable facts. Labels are nouns, values are plain, and
 *               between them they carry what the library does to the page.
 *   tags        Related surfaces, for scanning.
 */

export const techStack = [
  {
    icon: 'Curve',
    name: 'GSAP',
    kind: 'Animation',
    what: 'A library for sequencing animation, so movements run in a planned order rather than all at once.',
    attributes: [
      { label: 'Sequence', value: 'Six timelines' },
      { label: 'Trigger', value: 'Scroll position' },
      { label: 'Effect', value: 'Split headline, staggered cards' },
      { label: 'Feel', value: 'Ease out, no bounce' },
    ],
    tags: ['Motion', 'Hero', 'Scroll'],
  },
  {
    icon: 'Cube',
    name: 'Three.js',
    kind: '3D rendering',
    what: 'A library for drawing three dimensional scenes directly in the browser, using the graphics card.',
    attributes: [
      { label: 'Scene', value: '3D surface, one camera' },
      { label: 'Effect', value: 'Depth fade at the edges' },
      { label: 'Primitives', value: 'Grid lines and points' },
      { label: 'Motion', value: 'Slow breathing pulse' },
    ],
    tags: ['WebGL', 'Hero', 'Pointer'],
  },
  {
    icon: 'Mouse',
    name: 'Lenis',
    kind: 'Scroll',
    what: 'A layer that takes over scrolling from the browser so the page moves with weight instead of stopping dead.',
    attributes: [
      { label: 'Feel', value: 'Glide, 1.2s to settle' },
      { label: 'Easing', value: 'Fast start, long tail' },
      { label: 'Axis', value: 'Vertical only' },
      { label: 'Reach', value: 'Whole page and anchors' },
    ],
    tags: ['Motion', 'Scroll'],
  },
  {
    icon: 'Grid',
    name: 'Tailwind CSS',
    kind: 'Styling',
    what: 'A styling system where sizes, spaces, and colours come from one shared set of values rather than being written by hand each time.',
    attributes: [
      { label: 'Rhythm', value: '4px base unit' },
      { label: 'Palette', value: 'One shared set' },
      { label: 'Scope', value: 'Layout, spacing, colour' },
      { label: 'Exceptions', value: 'One off values allowed' },
    ],
    tags: ['Spacing', 'Colors', 'Shapes'],
  },
]
