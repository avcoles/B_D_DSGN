/**
 * Hand-rolled icon set — 16px grid, 1.25px stroke.
 *
 * Deliberately not a library: at this weight and scale, off-the-shelf icons
 * (1.5–2px stroke) read as too heavy against hairline rules and the mono
 * micro-labels. Owning them keeps the stroke consistent with the borders.
 */

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Monitor = (p) => (
  <svg {...base} {...p}>
    <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
    <path d="M5.5 14h5M8 11.5V14" />
  </svg>
)

export const Tablet = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="1.5" width="9" height="13" rx="1.5" />
    <path d="M7 12.5h2" />
  </svg>
)

export const Phone = (p) => (
  <svg {...base} {...p}>
    <rect x="4.5" y="1.5" width="7" height="13" rx="1.5" />
    <path d="M7.25 12.5h1.5" />
  </svg>
)

export const Reload = (p) => (
  <svg {...base} {...p}>
    <path d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97" />
    <path d="M13.5 2v3.2h-3.2" />
  </svg>
)

export const Expand = (p) => (
  <svg {...base} {...p}>
    <path d="M6 2H2v4M10 14h4v-4M14 6V2h-4M2 10v4h4" />
  </svg>
)

export const Close = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </svg>
)

export const ArrowUpRight = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
)

export const ChevronLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M10 3.5L5.5 8l4.5 4.5" />
  </svg>
)

export const ChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3.5L10.5 8 6 12.5" />
  </svg>
)

/* --- Tech stack badges --------------------------------------------------- */

export const Curve = (p) => (
  <svg {...base} {...p}>
    <path d="M1.8 12.5C6 12.5 5.6 3.5 14.2 3.5" />
  </svg>
)

export const Cube = (p) => (
  <svg {...base} {...p}>
    <path d="M8 1.9l5.4 3.05v6.1L8 14.1 2.6 11.05v-6.1z" />
    <path d="M2.6 4.95L8 8l5.4-3.05M8 8v6.1" />
  </svg>
)

export const Mouse = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="1.8" width="6" height="12.4" rx="3" />
    <path d="M8 4.4v2.2" />
  </svg>
)

export const Grid = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
)
