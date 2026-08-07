import { ChevronLeft, ChevronRight } from './icons.jsx'

/**
 * Top bar. Breadcrumb on the left, page pager on the right.
 *
 * The counter sits between the two arrows rather than off to one side, so the
 * controls read as one object and you always know where you are without
 * counting clicks. Ends are disabled rather than wrapping: with the position
 * shown, silently looping back to page one would feel like a glitch.
 */
export default function Nav({ title, index, total, onPrev, onNext }) {
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <nav className="flex min-h-9 items-center justify-between gap-4">
      <span className="micro truncate">{title}</span>

      <div className="flex shrink-0 items-center gap-2">
        <PagerButton label="Previous page" onClick={onPrev} disabled={index === 0}>
          <ChevronLeft />
        </PagerButton>

        <span className="micro tabular-nums text-rich-black">
          {pad(index + 1)} <span className="text-dim-gray">/ {pad(total)}</span>
        </span>

        <PagerButton label="Next page" onClick={onNext} disabled={index === total - 1}>
          <ChevronRight />
        </PagerButton>
      </div>
    </nav>
  )
}

const PagerButton = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={[
      'grid h-8 w-8 place-items-center rounded-pill border border-iron',
      'transition-colors duration-(--dur-fast) ease-(--ease-out-soft)',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      disabled
        ? 'cursor-not-allowed text-iron'
        : 'cursor-pointer text-rich-black hover:border-rich-black hover:bg-rich-black hover:text-white',
    ].join(' ')}
  >
    {children}
  </button>
)
