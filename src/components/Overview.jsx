/**
 * Overview — the strategic read, inside the metadata rail.
 *
 * Sized down from a full-width section: at 384px the rail can't carry a 40px
 * heading or a 15px paragraph without the measure collapsing to five or six
 * words a line. A hairline separates it from the attributes above rather than a
 * second card, keeping the rail one continuous sheet.
 */
export default function Overview({ overview }) {
  const { heading, lead, body } = overview

  return (
    <section className="grid gap-3 border-t border-iron pt-5">
      <h2 className="display text-[1.5rem]">{heading}</h2>
      <p className="text-[0.875rem] text-dim-gray">{lead}</p>

      <div className="mt-1 grid gap-3">
        {body.map((paragraph, i) => (
          <p key={i} className="text-[0.8125rem] leading-[1.6] text-anthrazit">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
