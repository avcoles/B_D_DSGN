import Typography from './system/Typography.jsx'
import Colors from './system/Colors.jsx'
import Spacing from './system/Spacing.jsx'
import Icons from './system/Icons.jsx'
import Buttons from './system/Buttons.jsx'

/**
 * Map a project's specimen tokens onto the CSS custom properties that
 * src/specimen.css consumes. Set once on the grid container, they inherit down
 * to every `.spec` stage inside it, so one object repaints the whole band.
 */
const specStyle = (t) => ({
  '--paper': t.paper,
  '--card': t.card,
  '--ink': t.ink,
  '--ink-2': t.ink2,
  '--ink-3': t.ink3,
  '--rule': t.rule,
  '--accent': t.accent,
  '--spec-display': t.display,
  '--spec-label': t.label,
  '--spec-label-tracking': t.labelTracking,
  '--spec-btn-radius': t.btnRadius,
})

/**
 * The bento, described as data so boxes can be turned on and off in one place.
 *
 * A six-column grid with deliberately uneven spans. Equal boxes would read as a
 * spec sheet; varied sizes let each box be the size its content needs, and that
 * is what makes the band scannable.
 *
 * Current layout:
 *   Typography ██████    Colors ████ · Buttons ██
 *
 * `hidden` keeps a box in the codebase without rendering it. The component and
 * its data both stay put, so bringing one back is flipping the flag. If you do,
 * re-check the spans: each row should add up to 6, so restoring Spacing and
 * Icons means dropping Colors or Buttons back down to make room.
 */
const BOXES = [
  { id: 'typography', Component: Typography, span: 'lg:col-span-6', pick: (s) => s.typography },
  { id: 'colors', Component: Colors, span: 'lg:col-span-4', pick: (s) => s.colors },
  { id: 'buttons', Component: Buttons, span: 'lg:col-span-2', pick: (s) => s.buttons },

  // Hidden for now. Flip `hidden` to false to bring either back.
  { id: 'spacing', Component: Spacing, span: 'lg:col-span-2', pick: (s) => s.spacing, hidden: true },
  { id: 'icons', Component: Icons, span: 'lg:col-span-2', pick: (s) => s.icons, hidden: true },
]

export default function DesignSystem({ system, tokens }) {
  return (
    <div className="grid gap-4">
      <h2 className="display mt-6 text-[2rem] sm:text-[2.75rem]">Design System</h2>

      <div className="grid gap-4 lg:grid-cols-6" style={specStyle(tokens)}>
        {BOXES.filter((box) => !box.hidden).map(({ id, Component, span, pick }) => (
          <Component key={id} data={pick(system)} className={span} />
        ))}
      </div>
    </div>
  )
}
