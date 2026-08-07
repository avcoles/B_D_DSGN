import SystemCard, { Stage } from './SystemCard.jsx'

/**
 * Buttons — real elements with real hover states.
 *
 * Rendered rather than screenshotted, which is the entire argument for this
 * page existing. The styles come from src/specimen.css and are the template's
 * own, so what you hover here behaves exactly like what's in the iframe.
 */
export default function Buttons({ data, className }) {
  return (
    <SystemCard title="Buttons" className={className}>
      <Stage className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {data.variants.map((v) => (
            <button key={v.role} type="button" className={`spec-btn ${v.className}`}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Stacked, not columned. This box sits in a two-column slot now, so
            three side-by-side notes came out at 98px each and wrapped their own
            labels. One per row uses the full measure instead. */}
        <div className="grid gap-3 border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
          {data.variants.map((v) => (
            <div key={v.role} className="flex items-baseline justify-between gap-3">
              <span className="spec-mono">{v.role}</span>
              <span className="text-[0.8125rem] text-[var(--ink-2)]">{v.note}</span>
            </div>
          ))}
        </div>
      </Stage>
    </SystemCard>
  )
}
