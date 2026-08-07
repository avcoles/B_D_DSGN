/**
 * Top bar. A breadcrumb and nothing else.
 *
 * Left aligned rather than centred: with no second element to balance against,
 * a centred title floats against empty space and reads as an accident.
 */
export default function Nav({ title }) {
  return (
    <nav className="flex min-h-9 items-center">
      <span className="micro truncate">{title}</span>
    </nav>
  )
}
