import Typography from './system/Typography.jsx'
import Colors from './system/Colors.jsx'
import Spacing from './system/Spacing.jsx'
import Icons from './system/Icons.jsx'
import Buttons from './system/Buttons.jsx'
import { system } from '../data/designSystem.js'

/**
 * The design-system bento.
 *
 * A six-column grid with deliberately uneven spans. Equal boxes would read as
 * a spec sheet; the varied sizes let each box be the size its content actually
 * needs — Typography wants the full width for three faces, Spacing reads
 * better as a narrow vertical strip — and that's what makes it scannable.
 *
 *   Typography ██████    Colors ████ · Spacing ██    Icons ██ · Buttons ████
 */
export default function DesignSystem() {
  return (
    <div className="grid gap-4">
      <h2 className="display mt-6 text-[2rem] sm:text-[2.75rem]">Design System</h2>

      <div className="grid gap-4 lg:grid-cols-6">
        <Typography data={system.typography} className="lg:col-span-6" />
        <Colors data={system.colors} className="lg:col-span-4" />
        <Spacing data={system.spacing} className="lg:col-span-2" />
        <Icons data={system.icons} className="lg:col-span-2" />
        <Buttons data={system.buttons} className="lg:col-span-4" />
      </div>
    </div>
  )
}
