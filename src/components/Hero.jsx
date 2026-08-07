import PreviewPanel from './PreviewPanel.jsx'
import Overview from './Overview.jsx'
import FitText from './FitText.jsx'

/**
 * Hero — live preview on the left, metadata rail on the right.
 *
 * The asymmetry is intentional: the preview gets the fluid column so it grows
 * with the viewport, while the rail is fixed at 384px so the measure of the
 * description paragraph stays readable at any screen size.
 */
export default function Hero({ t }) {
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
        <div className="rail-scroll grid content-start gap-6 p-5 lg:absolute lg:inset-0 lg:overflow-y-auto">
          {/* --- Title block --------------------------------------------
              Accent fill, rich black text. The one place the brand colour
              appears at full strength, which is why it can carry the
              classification tag without a border or icon helping it. */}
        <div className="grid justify-items-start gap-4">
          <span className="micro rounded-pill bg-accent px-3 py-1.5 text-rich-black">
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
            just looks cropped. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-12 bg-linear-to-t from-white to-transparent lg:block" />
      </aside>
    </section>
  )
}
