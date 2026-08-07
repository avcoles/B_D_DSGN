import SystemCard, { Stage } from './SystemCard.jsx'
import { ArrowUpRight, Close, Expand, Monitor, Phone, Reload, Tablet } from '../icons.jsx'

const SET = [Monitor, Tablet, Phone, Reload, Expand, Close, ArrowUpRight]

/**
 * Icons — the live set, plus the four rules that define it.
 *
 * Specimens are rendered at 24px rather than the 16px they ship at, because
 * a 1.25px stroke at 16px is hard to assess by eye. The spec table states the
 * real values; the render is there to show the drawing style.
 */
export default function Icons({ data, className }) {
  return (
    <SystemCard title="Icons" className={className}>
      <Stage className="grid gap-5">
        <div className="grid grid-cols-4 gap-2">
          {SET.map((Icon, i) => (
            <span
              key={i}
              className="grid aspect-square place-items-center rounded-[6px] border transition-colors duration-(--dur-fast)"
              style={{ background: 'var(--card)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <Icon width={24} height={24} />
            </span>
          ))}
        </div>

        <div className="grid gap-2 border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
          {data.specs.map((spec) => (
            <div key={spec.name} className="flex items-baseline justify-between gap-3">
              <span className="text-[0.8125rem] text-[var(--ink-2)]">{spec.name}</span>
              <span className="text-[0.8125rem] tabular-nums text-[var(--ink)]">{spec.value}</span>
            </div>
          ))}
        </div>
      </Stage>
    </SystemCard>
  )
}
