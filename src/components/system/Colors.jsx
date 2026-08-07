import SystemCard, { Stage } from './SystemCard.jsx'

/**
 * Colors — role-based swatches, grouped.
 *
 * The chip's background and the hex printed beneath it come from the same
 * string, so the label physically cannot disagree with the paint. Chips carry
 * a hairline because three of the nine values are within a few percent of the
 * paper they sit on and would otherwise have no visible edge.
 */
export default function Colors({ data, className }) {
  return (
    <SystemCard title="Colors" className={className}>
      <Stage className="grid gap-5">
        {data.groups.map((group) => (
          <div key={group.name} className="grid gap-2.5">
            <span className="spec-mono">{group.name}</span>
            <div className="grid grid-cols-3 gap-2.5">
              {group.swatches.map((s) => (
                <div key={s.value} className="grid gap-2">
                  <div
                    className="h-14 rounded-[6px] border"
                    style={{ background: s.value, borderColor: 'var(--rule)' }}
                  />
                  {/* Value first, role beneath. With the name gone the hex is
                      the identifier, so it takes the ink weight. The role is
                      only rendered when there is one: a swatch whose place in
                      the hierarchy isn't clear is left unlabelled rather than
                      given a guess, and an empty line would leave the grid
                      rows out of step. */}
                  <div className="grid gap-0.5">
                    <span className="text-[0.8125rem] leading-tight text-[var(--ink)]">
                      {s.value}
                    </span>
                    {s.note && (
                      <span className="text-[0.6875rem] leading-tight text-[var(--ink-3)]">
                        {s.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Stage>
    </SystemCard>
  )
}
