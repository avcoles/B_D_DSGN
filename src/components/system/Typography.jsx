import SystemCard, { Stage } from './SystemCard.jsx'

/**
 * Typography — one specimen per face.
 *
 * Each card renders in the face it documents rather than describing it, which
 * is why the extra font files are loaded. Everything labelling the specimen
 * stays in the chrome's own type, so you always know which text is the sample
 * and which is the caption.
 *
 * The role sits at the foot of the card under a rule. Beside the giant Aa it
 * competed with the specimen for the same corner; underneath, it reads as the
 * card's caption and the Aa gets the top of the card to itself.
 */
export default function Typography({ data, className }) {
  return (
    <SystemCard title="Typography" className={className}>
      <div className="grid gap-3 lg:grid-cols-3">
        {data.faces.map((face) => (
          <Stage key={face.role} className="grid content-start gap-4">
            <span
              className="spec-serif text-[3.5rem] leading-none"
              style={{ fontFamily: face.stack }}
              aria-hidden
            >
              Aa
            </span>

            <div className="grid gap-1">
              <span className="text-[0.9375rem] text-[var(--ink)]">{face.family}</span>
              <span className="text-[0.75rem] text-[var(--ink-3)]">{face.weights}</span>
            </div>

            <span className="spec-mono border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
              {face.role}
            </span>
          </Stage>
        ))}
      </div>
    </SystemCard>
  )
}
