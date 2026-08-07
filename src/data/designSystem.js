/**
 * The showcased template's design system.
 *
 * This describes the page inside the iframe — NOT the chrome around it. Every
 * value here is copied from public/preview/index.html; the paired rendering
 * styles live in src/specimen.css. When you swap in your own page, those two
 * files plus this one are what change.
 *
 * Labels and rendered specimens are driven from the same strings wherever
 * possible, so a swatch can't display one hex and paint another.
 */

export const system = {
  typography: {
    faces: [
      {
        role: 'Display',
        family: 'Instrument Serif',
        weights: 'Regular · Italic',
        stack: "'Instrument Serif', serif",
        sample: 'Build seamless systems',
        note: 'Headings and numerals. Tracked to −0.02em so the high-contrast strokes close up at large sizes.',
      },
      {
        role: 'Body',
        family: 'Inter',
        weights: '300 – 600',
        stack: "'Inter', system-ui, sans-serif",
        sample: 'Used for summaries and supporting copy',
        note: 'Paragraphs, lists, and interface copy at a 1.6 line-height.',
      },
      {
        role: 'Label',
        family: 'JetBrains Mono',
        weights: '400 · 500',
        stack: "'JetBrains Mono', monospace",
        sample: 'Skills used',
        note: 'Uppercase at 0.16em. The widest tracking in the system, and the only place it is used.',
      },
    ],
  },

  colors: {
    groups: [
      {
        name: 'Surface',
        swatches: [
          { value: '#FAF8F5', note: 'Page canvas' },
          { value: '#F1ECE4', note: 'Wells, insets' },
          { value: '#FFFFFF', note: 'Raised surface' },
        ],
      },
      {
        name: 'Ink',
        swatches: [
          { value: '#1A1713', note: 'Headings' },
          { value: '#554D42', note: 'Body copy' },
          { value: '#928878', note: 'Metadata' },
        ],
      },
      {
        name: 'Line & Accent',
        swatches: [
          { value: 'rgba(26, 23, 19, 0.12)', note: 'Hairline' },
          { value: '#C2500F', note: 'Actions' },
          { value: '#F7EBE1', note: 'Accent fill' },
        ],
      },
    ],
  },

  spacing: {
    base: 8,
    steps: [
      { name: 'XS', value: 8 },
      { name: 'SM', value: 16 },
      { name: 'MD', value: 24 },
      { name: 'LG', value: 48 },
    ],
    applied: [
      { name: 'Section padding', value: '72px' },
      { name: 'Card padding', value: '24px' },
      { name: 'Grid gap', value: '16px' },
      { name: 'Content width', value: '1080px' },
    ],
    radii: ['6px', '12px', '999px'],
  },

  icons: {
    specs: [
      { name: 'Grid', value: '16 × 16' },
      { name: 'Stroke', value: '1.25px' },
      { name: 'Caps', value: 'Round' },
      { name: 'Style', value: 'Line' },
    ],
  },

  buttons: {
    variants: [
      { label: 'Start free', className: 'spec-btn--primary', role: 'Primary', note: 'One per view' },
      { label: 'See how it works', className: 'spec-btn--ghost', role: 'Secondary', note: 'Repeatable' },
      { label: 'Read the docs', className: 'spec-btn--text', role: 'Text action', note: 'Inline' },
    ],
  },
}
