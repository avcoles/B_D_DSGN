import Reveal from './Reveal.jsx'
import { designPrinciples } from '../data/designPrinciples.js'

/**
 * Design principles (part one of the audit: the reasoned read).
 *
 * Register note. Part one is opinion and part two is measurement, and the audit
 * skill is explicit that the two must not read as one voice contradicting
 * itself. Part two breaks into five boxes on the template's paper. This section
 * is a single box on white: measurement gets compartments, argument gets one
 * continuous page.
 *
 * Inside that box the rows are split so the principle and its reasoning sit
 * side by side, which lets the left edge be scanned for all seven without
 * reading a single rationale.
 */
export default function DesignPrinciples() {
  const { principles } = designPrinciples

  return (
    <div className="grid gap-4">
      <h2 className="display mt-6 text-[2rem] sm:text-[2.75rem]">Design Principles</h2>

      {/* One wrapper. The card's own border closes the list top and bottom, so
          the hairlines inside are dividers only and never double up with it. */}
      <div className="card px-5 md:px-8">
        {principles.map((p, i) => (
          <Reveal
            key={p.principle}
            className={[
              'grid gap-5 py-8 md:grid-cols-[minmax(0,7fr)_minmax(0,6fr)] md:gap-10 md:py-10',
              // Vertical rhythm lives on the rows, not the wrapper, so the space
              // between two principles is always the sum of their padding and
              // the divider lands exactly halfway. Every row but the first
              // carries the rule; the card's own border closes the ends.
              i > 0 ? 'border-t border-iron' : '',
            ].join(' ')}
          >
            <div className="grid justify-items-start gap-4">
              {/* Numerals derived from position rather than stored, so they
                  can never disagree with the order they're rendered in. */}
              <span className="micro rounded-edge bg-platinum px-2 py-1.5 text-dim-gray">
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* Measure capped in characters rather than pixels, so the line
                  breaks stay in the same place as the size scales up. */}
              <h3 className="max-w-[22ch] text-[1.75rem] leading-[1.15] font-normal tracking-[-0.03em] text-anthrazit lg:text-[2.25rem]">
                {p.principle}
              </h3>
            </div>

            <p className="max-w-[52ch] self-center text-[0.9375rem] leading-[1.65] text-dim-gray">
              {p.rationale}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
