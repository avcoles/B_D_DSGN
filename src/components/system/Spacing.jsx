import SystemCard, { Stage } from './SystemCard.jsx'

/**
 * Spacing — the rhythm, drawn to scale.
 *
 * The bars are the point. A table of numbers tells you 48 is bigger than 8;
 * a bar four times longer than another shows you the ratio, which is the thing
 * you actually have to hold in your head while laying something out.
 */
export default function Spacing({ data, className }) {
  const max = Math.max(...data.steps.map((s) => s.value))

  return (
    <SystemCard title="Spacing" className={className}>
      <Stage className="grid gap-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="spec-mono">Base rhythm</span>
          <span className="spec-serif text-[1.75rem] leading-none">{data.base}px</span>
        </div>

        {/* Scale, drawn proportionally against the largest step. */}
        <div className="grid gap-2 border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
          {data.steps.map((step) => (
            <div key={step.name} className="grid grid-cols-[2rem_1fr_2.5rem] items-center gap-3">
              <span className="spec-mono">{step.name}</span>
              <span
                className="h-2 rounded-[2px]"
                style={{
                  width: `${(step.value / max) * 100}%`,
                  background: 'var(--accent)',
                }}
              />
              <span className="text-right text-[0.75rem] tabular-nums text-[var(--ink-2)]">
                {step.value}px
              </span>
            </div>
          ))}
        </div>

        {/* Where those steps actually land. */}
        <div className="grid gap-2 border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
          {data.applied.map((row) => (
            <div key={row.name} className="flex items-baseline justify-between gap-3">
              <span className="text-[0.8125rem] text-[var(--ink-2)]">{row.name}</span>
              <span className="text-[0.8125rem] tabular-nums text-[var(--ink)]">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Radii, shown as the shapes they produce rather than as numbers. */}
        <div className="grid gap-2.5 border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
          <span className="spec-mono">Corner radii</span>
          <div className="flex items-center gap-2.5">
            {data.radii.map((r) => (
              <div key={r} className="grid flex-1 justify-items-center gap-1.5">
                <span
                  className="h-9 w-full border"
                  style={{ borderRadius: r, background: 'var(--card)', borderColor: 'var(--rule)' }}
                />
                <span className="text-[0.6875rem] tabular-nums text-[var(--ink-3)]">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </Stage>
    </SystemCard>
  )
}
