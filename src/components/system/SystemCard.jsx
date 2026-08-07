import Reveal from '../Reveal.jsx'

/**
 * Shared shell for every box in the design-system bento.
 *
 * Heading, optional lead, then whatever the box renders. Keeping the header
 * identical across all five is what lets the *contents* vary as wildly as they
 * do without the grid falling apart.
 */
export default function SystemCard({ title, className = '', children }) {
  return (
    <Reveal className={`card grid content-start gap-5 p-5 md:p-6 ${className}`}>
      <h3 className="display text-[1.375rem]">{title}</h3>
      {children}
    </Reveal>
  )
}

/**
 * The recessed panel every specimen sits on. It carries the *template's* paper
 * colour, not the chrome's white — a palette judged against the wrong
 * background teaches you nothing, and the tonal shift also gives the bento its
 * visual rhythm.
 */
export const Stage = ({ className = '', children }) => (
  <div className={`spec rounded-edge border border-iron p-4 md:p-5 ${className}`}>{children}</div>
)
