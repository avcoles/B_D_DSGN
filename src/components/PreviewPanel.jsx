import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, Close, Expand, Monitor, Phone, Reload, Tablet } from './icons.jsx'

/**
 * Live preview of the showcased page, inside an iframe.
 *
 * The iframe is load-bearing, not incidental: it gives the previewed page a
 * completely separate CSS scope and its own viewport, so its media queries
 * respond to the panel width rather than the browser width. That's what makes
 * the device toggles actually meaningful.
 *
 * Tablet and mobile render the iframe at true device width (834 / 390) and
 * scale it down with a transform, rather than just narrowing the element.
 * A narrowed element would trigger the page's mobile breakpoints while still
 * rendering text at desktop size — this way the proportions stay honest.
 */

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: null, Icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: 834, Icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: 390, Icon: Phone },
]

const STAGE_PAD = 28 // breathing room around a scaled device

/**
 * Resolve the preview path against the app's base URL.
 *
 * A GitHub Pages project site is served from a subfolder, so a leading-slash
 * path like '/preview/index.html' would resolve to the domain root and 404.
 * Prefixing with Vite's BASE_URL keeps it correct in both places. Full URLs are
 * passed straight through, since an external site has nothing to do with our
 * base path.
 */
const resolveSrc = (src) =>
  /^https?:\/\//i.test(src) ? src : import.meta.env.BASE_URL + src.replace(/^\//, '')

export default function PreviewPanel({ src: rawSrc, title }) {
  const src = resolveSrc(rawSrc)
  const [device, setDevice] = useState('desktop')
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [nonce, setNonce] = useState(0) // bump to force an iframe remount
  const [stage, setStage] = useState({ w: 0, h: 0 })

  const stageRef = useRef(null)

  const active = DEVICES.find((d) => d.id === device)

  // Track the stage box so we can compute the scale factor for device modes.
  //
  // The first measurement is taken synchronously rather than waiting on the
  // observer. ResizeObserver reports *changes*, so leaning on its first callback
  // for the initial value means a frame where the stage is zero wide, and any
  // device mode chosen before that callback lands silently falls back to fluid.
  //
  // Keyed on `nonce` because the reload button remounts the stage: without it
  // the observer would still be watching the detached element from before.
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return

    const measure = () => setStage({ w: el.clientWidth, h: el.clientHeight })
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nonce])

  // Escape leaves fullscreen; lock body scroll while it's open.
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e) => e.key === 'Escape' && setFullscreen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [fullscreen])

  const reload = useCallback(() => {
    setLoading(true)
    setNonce((n) => n + 1)
  }, [])

  return (
    <>
      <div className="card flex flex-col overflow-hidden">
        {/* --- Chrome bar ------------------------------------------------- */}
        <div className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-b border-iron px-3 sm:px-4">
          <div className="flex items-center gap-3">
            {/* Monochrome window dots. Coloured traffic lights would be the
                only saturated non-brand colour anywhere in the chrome. */}
            <div aria-hidden className="flex shrink-0 items-center gap-[5px]">
              <Dot className="bg-rich-black" />
              <Dot className="bg-dim-gray" />
              <Dot className="bg-iron" />
            </div>
            <span className="micro hidden sm:block">
              {active.width ? `${active.width}px` : 'Fluid'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Device segmented control */}
            <div
              role="group"
              aria-label="Preview width"
              className="flex items-center gap-0.5 rounded-pill bg-platinum p-0.5"
            >
              {DEVICES.map(({ id, label, Icon }) => {
                const on = id === device
                return (
                  <button
                    key={id}
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={on}
                    onClick={() => setDevice(id)}
                    className={[
                      'grid h-7 w-7 cursor-pointer place-items-center rounded-pill',
                      'transition-colors duration-(--dur-fast) ease-(--ease-out-soft)',
                      'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent',
                      on ? 'bg-rich-black text-white' : 'text-dim-gray hover:text-rich-black',
                    ].join(' ')}
                  >
                    <Icon />
                  </button>
                )
              })}
            </div>

            <IconButton label="Reload preview" onClick={reload}>
              <Reload />
            </IconButton>
            <IconButton label="Expand preview" onClick={() => setFullscreen(true)}>
              <Expand />
            </IconButton>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              title="Open in new tab"
              aria-label="Open in new tab"
              className="grid h-7 w-7 place-items-center rounded-pill text-dim-gray transition-colors duration-(--dur-fast) hover:bg-platinum hover:text-rich-black focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            >
              <ArrowUpRight />
            </a>
          </div>
        </div>

        {/* --- Stage -------------------------------------------------------- */}
        <Stage
          ref={stageRef}
          key={nonce}
          src={src}
          title={title}
          width={active.width}
          stage={stage}
          loading={loading}
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* --- Fullscreen ----------------------------------------------------- */}
      {fullscreen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-white/95 p-3 backdrop-blur-sm sm:p-5">
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <span className="micro">Preview — {title}</span>
            <IconButton label="Close preview" onClick={() => setFullscreen(false)}>
              <Close />
            </IconButton>
          </div>
          <iframe src={src} title={`${title} (fullscreen)`} className="card min-h-0 w-full flex-1" />
        </div>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */

const Stage = ({ ref, src, title, width, stage, loading, onLoad }) => {
  // Fluid mode: the iframe simply fills the panel.
  // Device mode: render at true width, then scale to fit the available box.
  // Until the stage has been measured, fall back to fluid rather than computing
  // a scale from a zero width, which comes out negative and renders nothing.
  const measured = stage.w > 0
  const scale = width && measured ? Math.min(1, (stage.w - STAGE_PAD * 2) / width) : 1
  const scaled = Boolean(width) && measured && scale > 0

  return (
    /* 4:3 is 16:10 with 20% more height: 16:10 puts the stage at 0.625w, and
       0.625 x 1.2 is 0.75, exactly 4:3. Still reads as a desktop window, with
       more room before content is cut off. The stage previously stretched to
       match the metadata rail and came out at 0.77, taller than it was wide,
       which reads as a phone. Below sm the ratio would leave a stage under
       300px tall, so a floor takes over there instead. */
    <div
      ref={ref}
      className="relative min-h-[24rem] w-full overflow-hidden bg-platinum sm:aspect-[4/3] sm:min-h-0"
    >
      {scaled ? (
        <div className="absolute inset-0 grid place-items-start justify-center overflow-hidden pt-6">
          <div
            className="overflow-hidden rounded-edge border border-iron bg-white transition-[width] duration-(--dur-base) ease-(--ease-out-soft)"
            style={{ width: width * scale, height: Math.max(0, stage.h - 24) }}
          >
            <iframe
              src={src}
              title={title}
              onLoad={onLoad}
              loading="lazy"
              className="block border-0"
              style={{
                width,
                height: (stage.h - 24) / scale,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          </div>
        </div>
      ) : (
        <iframe
          src={src}
          title={title}
          onLoad={onLoad}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-platinum">
          <span className="micro animate-pulse">Rendering design…</span>
        </div>
      )}
    </div>
  )
}

const Dot = ({ className }) => <span className={`h-[9px] w-[9px] rounded-full ${className}`} />

const IconButton = ({ label, onClick, children }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    className="grid h-7 w-7 cursor-pointer place-items-center rounded-pill text-dim-gray transition-colors duration-(--dur-fast) hover:bg-platinum hover:text-rich-black focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
  >
    {children}
  </button>
)
