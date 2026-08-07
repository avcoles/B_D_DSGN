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
      <Stage>
        <div className="flex flex-wrap items-center gap-3">
          {data.variants.map((v) => (
            <button key={v.label} type="button" className={`spec-btn ${v.className}`}>
              {v.label}
            </button>
          ))}
        </div>
      </Stage>
    </SystemCard>
  )
}
