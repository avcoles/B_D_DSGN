import { useCallback, useEffect, useRef, useState } from 'react'
import PreviewPanel from './PreviewPanel.jsx'
import Overview from './Overview.jsx'
import FitText from './FitText.jsx'

/**
 * Watches a scroll container and reports whether it currently has anything
 * left to scroll to.
 *
 * The rail is sized to the preview panel, and the preview is a 4:3 box in a
 * fluid column, so the rail's height tracks the window width. Between about
 * 1024 and 1400px the content is taller than that box and the last paragraph
 * ends up below the fold. The fade that signals this used to be painted
 * unconditionally, which meant it also washed out copy that was not
 * scrollable, and readers saw text dissolving for no reason.
 */
function useHasMoreBelow(ref) {
  const [hasMore, setHasMore] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    // A pixel of slack: fractional layout heights can leave scrollHeight a
    // hair above clientHeight on a container that is not really scrollable.
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop
    setHasMore(remaining > 1)
  }, [ref])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    measure()

    // Height changes come from the window resizing, and content changes come
    // from paging to another project. One observer on the container catches
    // both without a window listener.
    const observer = new ResizeObserver(measure)
    observer.observe(el)

    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [ref, measure])

  return hasMore
}

/**
 * Hero — live preview on the left, metadata rail on the right.
 *
 * The asymmetry is intentional: the preview gets the fluid column so it grows
 * with the viewport, while the rail is fixed at 384px so the measure of the
 * description paragraph stays readable at any screen size.
 */
export default function Hero({ t }) {
  const railRef = useRef(null)
  const hasMoreBelow = useHasMoreBelow(railRef)

  return (
    // No min-height on the row. The preview panel's 4:3 ratio is the only thing
    // setting the hero's height now, and the rail matches it.
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_384px]">
      <div>
        <PreviewPanel src={t.previewSrc} title={`${t.title} — ${t.subtitle}`} />
      </div>

      {/* The rail's content runs taller than the preview, so above lg it is
          taken out of flow and scrolled inside the card. Absolute positioning is
          what makes the match possible: an in-flow child would push the grid row
          to its own height, which is the whitespace this is fixing. Below lg the
          columns stack and the rail is an ordinary card again. */}
      <aside className="card relative overflow-hidden">
        <div
          ref={railRef}
          data-scrollable={hasMoreBelow ? '' : undefined}
          className="rail-scroll grid content-start gap-6 p-5 lg:absolute lg:inset-0 lg:overflow-y-auto"
        >
          {/* --- Title block --------------------------------------------
              Accent fill, rich black text. The one place the brand colour
              appears at full strength, which is why it can carry the
              classification tag without a border or icon helping it. */}
        <div className="grid justify-items-start gap-4">
          {/* White on white, so it needs the hairline to exist at all. Reads as
              a quiet classification tag rather than the loudest thing in the
              rail, which is what the accent fill was doing. */}
          <span className="micro rounded-pill border border-iron bg-white px-3 py-1.5 text-rich-black">
            {t.kicker}
          </span>

          {/* Full width so FitText measures against the rail rather than
              against its own shrink-to-fit box. */}
          <h1 className="display w-full">
            <FitText max={56} min={24}>
              {t.title}
            </FitText>
            <span className="mt-1.5 block text-[1.0625rem] font-extralight tracking-[-0.03em] text-dim-gray">
              {t.subtitle}
            </span>
          </h1>

          <p className="max-w-[40ch] text-[0.9375rem] leading-[1.55] text-anthrazit">
            {t.description}
          </p>
        </div>

        {/* --- Attributes -------------------------------------------------
            Both groups use the identical pill so the eye reads them as one
            family of facts; only the labels separate them. Differentiating
            the pills too would imply the two lists rank against each other. */}
        <div className="grid gap-5 border-t border-iron pt-5">
          {t.attributes.map((group) => (
            <div key={group.label} className="grid gap-2.5">
              <span className="micro">{group.label}</span>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="micro block cursor-default rounded-pill border border-iron px-3 py-2 text-anthrazit transition-colors duration-(--dur-fast) hover:border-rich-black hover:bg-rich-black hover:text-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

          <Overview overview={t.overview} />
        </div>

        {/* Signals that the rail continues past the fold. Needed because the
            scrollbar is hidden by default on macOS, so without it the content
            just looks cropped. Rendered only while there is something left to
            reach: over copy that has nowhere to scroll, a fade is not an
            affordance, it is a rendering fault. */}
        {hasMoreBelow && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-12 bg-linear-to-t from-white to-transparent lg:block" />
        )}
      </aside>
    </section>
  )
}
