import Reveal from './Reveal.jsx'
import { Cube, Curve, Grid, Mouse } from './icons.jsx'

const ICONS = { Curve, Cube, Mouse, Grid }

/**
 * Tech stack (part two of the audit: the measured teardown).
 *
 * Each card splits into an authored side and a measured side. The left column
 * says what the thing is and what it drives; the right column is the raw read,
 * laid out as a table because that is what the values are. The divider between
 * them is the point: it keeps a sentence and a measurement from sitting in the
 * same visual register, which is the rule the audit skill cares most about.
 */
export default function TechStack({ items }) {
  return (
    <div className="grid gap-4">
      <h2 className="display mt-6 text-[2rem] sm:text-[2.75rem]">Tech Stack</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((t) => {
          const Icon = ICONS[t.icon]

          return (
            <Reveal
              key={t.name}
              className="card grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              {/* --- Authored side ---------------------------------------- */}
              <div className="grid content-between gap-6 p-5 md:p-6">
                <div className="grid justify-items-start gap-5">
                  {/* Accent fill carrying a rich black glyph, which is the one
                      safe way to use this orange at icon scale. */}
                  <span className="grid h-9 w-9 place-items-center rounded-pill bg-accent text-rich-black">
                    <Icon width={18} height={18} />
                  </span>

                  <h3 className="display text-[1.5rem]">{t.name}</h3>

                  <p className="text-[0.875rem] leading-[1.6] text-dim-gray">{t.what}</p>
                </div>

                <span className="micro">{t.kind}</span>
              </div>

              {/* --- Measured side ----------------------------------------- */}
              <div className="grid content-start border-t border-iron md:border-t-0 md:border-l">
                {/* Attributes as a real table. Two columns, hairline ruled,
                    last row loses its bottom edge to the tag strip. */}
                <div className="grid grid-cols-2">
                  {t.attributes.map((a, i) => (
                    <div
                      key={a.label}
                      className={[
                        'grid content-start gap-1.5 p-4',
                        i % 2 === 0 ? 'border-r border-iron' : '',
                        i < t.attributes.length - 2 ? 'border-b border-iron' : '',
                      ].join(' ')}
                    >
                      <span className="micro">{a.label}</span>
                      <span className="text-[0.8125rem] leading-tight text-rich-black">
                        {a.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 border-t border-iron p-4">
                  {t.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

const Chip = ({ children }) => (
  <span className="micro rounded-pill border border-iron px-2.5 py-1.5 text-dim-gray">
    {children}
  </span>
)
