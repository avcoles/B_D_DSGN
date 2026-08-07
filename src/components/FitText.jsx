import { useLayoutEffect, useRef } from 'react'

/**
 * Shrinks its text until it fits the width of its parent.
 *
 * Needed because the rail is a fixed 384px and the titles are set in a 900
 * weight. A single long word like COMMERCIAL has no break opportunity, so it
 * overflows and the card's `overflow-hidden` clips it. Wrapping cannot help,
 * and a smaller fixed size would only push the problem to the next longer name.
 *
 * Binary search rather than stepping down a pixel at a time: about five layout
 * reads instead of thirty, landing on the exact largest size that fits.
 * `scrollWidth` exceeds `clientWidth` precisely when a word is too wide to
 * break, which is the condition being solved for.
 *
 * The measured size is written straight to the element rather than held in
 * state. Round-tripping it through React looks tidier but breaks: when the new
 * size matches the old one React skips the re-render, so a font-size cleared
 * during measurement never gets restored and the text collapses to whatever it
 * inherits. One owner for the property, and no render involved.
 */
export default function FitText({ max = 56, min = 22, className = '', children }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const box = el?.parentElement
    if (!el || !box) return

    const fit = () => {
      const available = box.clientWidth
      if (!available) return

      let lo = min
      let hi = max
      let best = min

      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        el.style.fontSize = `${mid}px`
        if (el.scrollWidth <= available) {
          best = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }

      el.style.fontSize = `${best}px`
    }

    // Runs before paint, so there is no flash at the unfitted size.
    fit()

    // Webfonts land after first paint and change every measurement, so redo it
    // once they are in. Without this the title is sized against the fallback.
    document.fonts?.ready.then(fit).catch(() => {})

    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [children, max, min])

  return (
    <span ref={ref} className={`block ${className}`}>
      {children}
    </span>
  )
}
