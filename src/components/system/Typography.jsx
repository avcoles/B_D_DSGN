import SystemCard, { Stage } from './SystemCard.jsx'

/**
 * Typography — three face specimens, then the scale that uses them.
 *
 * Each specimen renders in its own face rather than describing it, which is
 * why the two extra font files are loaded. The giant Aa is set in the face
 * being documented; everything labelling it stays in the chrome's Inter, so
 * you always know which text is the specimen and which is the caption.
 */
export default function Typography({ data, className }) {
  return (
    <SystemCard title="Typography" className={className}>
      <div className="grid gap-3 lg:grid-cols-3">
        {data.faces.map((face) => (
          <Stage key={face.role} className="grid content-start gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className="spec-serif text-[3.5rem] leading-none"
                style={{ fontFamily: face.stack }}
                aria-hidden
              >
                Aa
              </span>
              <span className="spec-mono">{face.role}</span>
            </div>

            <div className="grid gap-1">
              <span className="text-[0.9375rem] text-[var(--ink)]">{face.family}</span>
              <span className="text-[0.75rem] text-[var(--ink-3)]">{face.weights}</span>
            </div>

            <p
              className="border-t pt-3 text-[1.0625rem] leading-snug text-[var(--ink)]"
              style={{ fontFamily: face.stack, borderColor: 'var(--rule)' }}
            >
              {face.sample}
            </p>
          </Stage>
        ))}
      </div>
    </SystemCard>
  )
}
