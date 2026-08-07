import { useEffect, useRef } from 'react'

/**
 * Reveal-on-scroll wrapper.
 *
 * Unobserves after the first intersection — a section that has already been
 * seen should stay put, not re-animate on the way back up. `rootMargin` fires
 * slightly before the element reaches the fold so the motion completes as it
 * settles into view rather than starting once it's already there.
 */
export default function Reveal({ className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={`reveal ${className}`}>
      {children}
    </section>
  )
}
