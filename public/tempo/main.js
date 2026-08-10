/* ============================================================================
   Tempo — behaviour

   The source runs GSAP, ScrollTrigger, Flip, SplitText, a Lottie logotype and
   a Nuxt app to do what is below. This is the same page without any of them.

   The division of labour is deliberate and worth stating once: CSS owns every
   transition that has a fixed duration — reveals, underlines, the theme
   switch, the intro. JavaScript owns only the three things CSS cannot do,
   which are measuring text to split it, reading scroll position, and reading
   the cursor. Everywhere else this file writes a class or a custom property
   and stops.
   ========================================================================= */

(() => {
  'use strict'

  // First statement, deliberately. Every hidden starting state in the
  // stylesheet — masked lines, faded blocks, the header, the intro sheet —
  // hangs off this class, so a page whose script never arrives renders
  // finished rather than blank.
  document.documentElement.classList.add('js')

  const $ = (sel, ctx = document) => ctx.querySelector(sel)
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)]
  const clamp = (min, max, v) => (v < min ? min : v > max ? max : v)
  const lerp = (a, b, t) => a + (b - a) * t

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const pointer = matchMedia('(hover: hover) and (pointer: fine)')
  const wide = matchMedia('(min-width: 650px)')

  /* -------------------------------------------------------------------------
     Frame loop

     One rAF for the whole page. Everything that runs per-frame registers here
     and gets the same delta, which is what keeps the reel's easing consistent
     whether the display is 60Hz or 120Hz.
     ---------------------------------------------------------------------- */

  const ticks = new Set()
  let last = performance.now()

  function frame(now) {
    // Normalised against a 60Hz frame. Clamped because a backgrounded tab
    // returns with a delta measured in seconds and would snap everything.
    const ratio = clamp(0, 3, (now - last) / 16.666)
    last = now
    ticks.forEach((fn) => fn(ratio))
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  /* -------------------------------------------------------------------------
     Fitted wordmarks

     The wordmark is live text, so its width depends on the face that actually
     loaded. Rather than guess a font-size, measure the string once and solve
     for the size that fills the box. Re-run on width changes and after the
     webfont arrives — measuring against the fallback gives a wordmark that
     jumps the moment Archivo lands.
     ---------------------------------------------------------------------- */

  /**
   * Size a wordmark so it exactly fills the box it is in.
   *
   * The measurement is taken at `width: max-content` rather than from
   * `scrollWidth`, which reports the padding box and not the overflow for a
   * `white-space: nowrap` block — it would answer with the container's own
   * width and the solve would be a no-op.
   */
  function fit(el, prop) {
    if (!el) return
    const target = el.getBoundingClientRect().width
    if (!target) return

    const prevWidth = el.style.width
    el.style.setProperty(prop, '100px')
    el.style.width = 'max-content'
    const natural = el.getBoundingClientRect().width
    el.style.width = prevWidth

    if (natural) el.style.setProperty(prop, `${(100 * target) / natural}px`)
  }

  const logo = $('#logo')
  const footMark = $('#foot-wordmark')

  function fitAll() {
    fit(logo, '--fit')
    fit(footMark, '--fit-foot')
  }

  /* -------------------------------------------------------------------------
     Split text

     Two shapes. Lines need measuring because where a line breaks depends on
     the box, so this waits for the font and re-runs on a width change.
     Characters do not — a character is a character at any width — so those
     are cut once and left alone.
     ---------------------------------------------------------------------- */

  const lineSources = new WeakMap()

  function splitLines(el) {
    if (!lineSources.has(el)) lineSources.set(el, el.textContent)
    const text = lineSources.get(el)

    // Measure: every word gets a box, and words sharing an offsetTop are on
    // the same line. This is the only reliable way to find a line break — the
    // browser has already made the decision and will not report it.
    el.textContent = ''
    const probes = text.split(/\s+/).filter(Boolean).map((word) => {
      const s = document.createElement('span')
      s.textContent = word
      el.append(s, document.createTextNode(' '))
      return s
    })

    const lines = []
    let top = null
    probes.forEach((s) => {
      const y = Math.round(s.offsetTop)
      if (y !== top) { lines.push([]); top = y }
      lines[lines.length - 1].push(s.textContent)
    })

    // Rebuild: one mask per line, one moving piece inside it.
    el.textContent = ''
    lines.forEach((words, i) => {
      const mask = document.createElement('span')
      mask.className = 's-mask'
      const piece = document.createElement('span')
      piece.className = 's-piece'
      piece.style.setProperty('--i', i)
      piece.textContent = words.join(' ')
      mask.append(piece)
      el.append(mask)
    })
  }

  function splitChars(el) {
    const text = el.textContent
    el.textContent = ''
    let index = 0
    text.split(/\s+/).filter(Boolean).forEach((word, w) => {
      // The word is the mask; the characters inside it are what move. A mask
      // per character would clip each glyph to its own advance width and eat
      // the overhangs.
      const mask = document.createElement('span')
      mask.className = 's-mask'
      ;[...word].forEach((ch) => {
        const piece = document.createElement('span')
        piece.className = 's-piece'
        piece.style.setProperty('--i', index++)
        piece.textContent = ch
        mask.append(piece)
      })
      if (w) el.prepend(document.createTextNode(' '))
      el.append(mask)
    })
  }

  const lineTargets = $$('.s-lines')
  lineTargets.forEach((el) => el.classList.add('s-split'))
  $$('.s-chars').forEach(splitChars)

  function relines() {
    lineTargets.forEach((el) => {
      const revealed = el.classList.contains('is-inview')
      splitLines(el)
      if (revealed) el.classList.add('is-inview')
    })
  }

  /* -------------------------------------------------------------------------
     Reveals

     One observer for the page. The source's ScrollTrigger start is
     "top bottom-=15%" — the element's top crossing 85% of the viewport — which
     is a bottom root margin of -15%.
     ---------------------------------------------------------------------- */

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-inview')
        // Once each. The source's ScrollTrigger runs the masked reveals with
        // `once: true` and leaves the fades on the default toggleActions,
        // which play on enter and do nothing afterwards — so neither replays,
        // and a long page never re-animates itself on the way back up.
        io.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -15% 0px' }
  )

  $$('.s-lines, .s-chars, .s-fade, .approach').forEach((el) => io.observe(el))

  /* -------------------------------------------------------------------------
     Header: clock, theme, hover
     ---------------------------------------------------------------------- */

  const clockH = $('#clock-h')
  const clockM = $('#clock-m')
  const clockP = $('#clock-p')

  function clock() {
    // No timezone is pinned, so this reads the reader's own clock. The source
    // names a city and shows that city's time. Put a real one back here and
    // set `timeZone` to match it.
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(new Date())
    const get = (t) => (parts.find((p) => p.type === t) || {}).value || ''
    clockH.textContent = get('hour')
    clockM.textContent = get('minute')
    clockP.textContent = get('dayPeriod').toLowerCase()
  }
  if (clockH) { clock(); setInterval(clock, 10000) }

  const themeBtn = $('#theme-toggle')
  const stored = localStorage.getItem('tempo-theme')
  if (stored === 'dark') document.documentElement.classList.add('is-dark')
  themeBtn?.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('is-dark')
    themeBtn.setAttribute('aria-pressed', String(dark))
    localStorage.setItem('tempo-theme', dark ? 'dark' : 'light')
  })

  const menuBtn = $('#menu-toggle')
  const mmenu = $('#mmenu')

  function setMenu(open) {
    document.documentElement.classList.toggle('is-menu', open)
    menuBtn.classList.toggle('is-active', open)
    menuBtn.setAttribute('aria-expanded', String(open))
    // Both at once. A menu that is hidden to the screen reader but still in
    // the tab order is the standard way this goes wrong.
    mmenu.setAttribute('aria-hidden', String(!open))
    if (open) mmenu.removeAttribute('inert')
    else mmenu.setAttribute('inert', '')
  }

  menuBtn?.addEventListener('click', () =>
    setMenu(!document.documentElement.classList.contains('is-menu'))
  )
  mmenu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false) })
  addEventListener('keyup', (e) => { if (e.key === 'Escape') setMenu(false) })

  // Hovering one nav link dims the others rather than lighting itself, so the
  // set moves and the target stays still. One attribute, rest in CSS.
  const nav = $('#site-nav')
  nav?.addEventListener('pointerover', (e) => {
    if (e.target.closest('.sh-link')) nav.setAttribute('data-hovering', '')
  })
  nav?.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget?.closest?.('.sh-link')) nav.removeAttribute('data-hovering')
  })

  /* -------------------------------------------------------------------------
     Footer: copy address, back to top
     ---------------------------------------------------------------------- */

  const mail = $('#copy-mail')
  const bubble = $('#copy-bubble')
  mail?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(mail.dataset.mail)
      bubble.textContent = 'Copied!'
    } catch {
      // Clipboard is permission-gated and can simply refuse. Say so rather
      // than claiming a copy that did not happen.
      bubble.textContent = mail.dataset.mail
    }
  })
  mail?.addEventListener('pointerleave', () => { bubble.textContent = 'Click to copy' })

  $$('.back-to-top').forEach((btn) =>
    btn.addEventListener('click', () =>
      scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    )
  )

  /* -------------------------------------------------------------------------
     Services

     Two things move together: which card is shown, and where the card sits.
     The offset is measured from the buttons, so the card lines up with
     whichever word is active without anything drawing a connection.
     ---------------------------------------------------------------------- */

  const svcTarget = $('#services-target')
  const svcCard = $('#services-card')
  const svcList = $('#services-list')

  if (svcList) {
    const toggles = $$('.services__toggle', svcList)
    const thumbs = $$('.services__thumb')
    const texts = $$('.services__text')
    let current = 0
    let offsets = []

    function measure() {
      const cardH = svcCard.getBoundingClientRect().height
      const first = toggles[0].getBoundingClientRect().top
      offsets = toggles.map((btn) => {
        const { bottom } = btn.getBoundingClientRect()
        // 1.2 card-heights of slack: the card trails the list rather than
        // tracking it exactly, so it never sits above the first word.
        return Math.max(0, bottom - first - 1.2 * cardH)
      })
    }

    function select(next) {
      if (next === current) return
      const from = thumbs[current]
      const to = thumbs[next]

      from.classList.remove('is-active')
      from.classList.add('is-leaving')
      // The leaving card is only un-stacked once its own transition is over,
      // otherwise it reappears at the bottom of the pile mid-shrink.
      setTimeout(() => from.classList.remove('is-leaving'), 800)

      to.classList.remove('is-leaving')
      to.classList.add('is-active')
      to.style.zIndex = String(10 + next)

      texts[current].classList.remove('is-active')
      texts[next].classList.add('is-active')
      toggles[current].classList.remove('is-active')
      toggles[next].classList.add('is-active')

      current = next
      svcTarget.style.transform = `translate3d(0, ${offsets[next] || 0}px, 0)`
    }

    toggles.forEach((btn, i) => {
      const act = () => select(i)
      // Pointer devices swap on hover, which makes comparing three options
      // one gesture. Touch has to have a tap.
      btn.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') act() })
      btn.addEventListener('click', act)
    })

    measure()
    addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
  }

  /* -------------------------------------------------------------------------
     The reel

     Three behaviours on one card, and they compose rather than conflict:

       · horizontal tracking of the cursor, scaled by (1 − scroll progress)
       · a scrubbed flight into the target box, driven by that same progress
       · a click that flies it to full screen and back

     The middle one is the reason the hero is two screens tall. Everything is
     measured from two elements' boxes — the card's resting box and the target
     box — so nothing here contains a hard-coded size.
     ---------------------------------------------------------------------- */

  const hero = $('#hero')
  const stick = $('#hero-stick')
  const stickText = $('#hero-foot')
  const reelBox = $('#reel-box')
  const flip = $('#reel-flip')
  const target = $('#stick-target')
  const content = $('#reel-content')
  const letters = $$('#logo i')

  let track = null       // scroll distance the scrub runs over
  let delta = null       // base box → target box, in document coordinates
  let progress = 0
  let cinema = false

  function measureReel() {
    if (!hero || !flip || !target) return
    if (!pointer.matches || !wide.matches) { track = null; return }

    // Measure with every transform cleared, so the numbers describe the
    // layout rather than the current state of the animation.
    const prevFlip = flip.style.cssText
    const prevStick = stick.style.transform
    flip.style.cssText = ''
    stick.style.transform = ''

    const b = reelBox.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    delta = {
      x: t.left - b.left,
      y: t.top - b.top,
      w0: b.width, h0: b.height,
      w1: t.width, h1: t.height,
    }
    track = hero.offsetHeight - innerHeight

    flip.style.cssText = prevFlip
    stick.style.transform = prevStick
    applyScroll()
  }

  function applyScroll() {
    if (!track || track <= 0 || cinema) return
    const p = clamp(0, 1, scrollY / track)
    progress = p

    flip.style.width = `${lerp(delta.w0, delta.w1, p)}px`
    flip.style.height = `${lerp(delta.h0, delta.h1, p)}px`
    flip.style.transform = `translate3d(${delta.x * p}px, ${delta.y * p}px, 0)`

    // The sticky panel slides out by exactly one viewport height over the
    // same range. That is not decoration — it is what cancels the sticky
    // offset and keeps the card's flight path a straight line.
    stick.style.transform = `translate3d(0, ${-p * stick.offsetHeight}px, 0)`

    // The wordmark drops as its own letters lift out of it, so the letters
    // clear their masks in half the scroll it would otherwise take.
    logo.style.setProperty('--logo-exit', `${p * logo.offsetHeight}px`)
    letters.forEach((el, i) => {
      const lp = clamp(0, 1, (p - i * 0.05) / 0.5)
      el.style.setProperty('--exit', `${-110 * lp}%`)
    })

    stickText.style.opacity = String(1 - clamp(0, 1, p * 2))
  }

  /* --- horizontal cursor tracking --------------------------------------- */

  const followers = $$('.js-mm')
  let mouseX = 0
  let currentX = 0

  if (pointer.matches && followers.length) {
    mouseX = 0.695 * innerWidth
    currentX = -0.035 * innerWidth

    hero?.addEventListener('mousemove', (e) => {
      const min = 0.035 * innerWidth
      const max = 0.73 * innerWidth - min
      mouseX = clamp(min, max, e.clientX)
    })

    ticks.add((ratio) => {
      if (cinema) return
      const mpc = 1 - progress
      // The follow gets sharper as the scrub takes over: at rest the card
      // drifts after the cursor, and by the end of the hero it is pinned.
      const ease = clamp(0, 1, (0.935 * (1 - mpc) + 0.065) * ratio)
      currentX = lerp(currentX, mouseX * mpc, ease)
      const x = `translate3d(${currentX}px, 0, 0)`
      followers.forEach((el) => { el.style.transform = x })
    })
  }

  /* --- cinema ------------------------------------------------------------ */

  const inner = $('.reel__inner', flip || document.body)
  const cinemaLayer = $('#cinema-layer')
  let origin = { x: 0, y: 0 }

  /**
   * Fly the card between where it is now and where it would be under the
   * given state. Both ends are read off the live layout — `from` is measured
   * before the state changes, `to` after — so neither position is ever
   * calculated, and open and close are the same run in reverse.
   */
  function fly(from, parent) {
    parent.append(inner)
    inner.classList.remove('is-flying')
    inner.style.cssText = ''
    const to = cinema
      ? { left: 0, top: 0, width: innerWidth, height: innerHeight }
      : inner.getBoundingClientRect()

    inner.classList.add('is-flying')
    inner.style.transition = 'none'

    // Where the card's own containing block starts. Collapsing it to nothing
    // and reading the corner is the only reliable way to find that out —
    // `position: fixed` is viewport-relative in the cinema layer but
    // flip-relative on the way back, and the same translate cannot mean both.
    inner.style.transform = 'none'
    inner.style.width = '0px'
    inner.style.height = '0px'
    const o = inner.getBoundingClientRect()
    origin = { x: o.left, y: o.top }

    place(from)
    // Read back, so the browser commits the starting geometry as its own
    // frame instead of collapsing both writes into the end state.
    void inner.offsetWidth
    inner.style.transition = ''
    place(to)

    if (!cinema) {
      const done = (e) => {
        if (e.propertyName !== 'width' || e.target !== inner) return
        inner.removeEventListener('transitionend', done)
        inner.classList.remove('is-flying')
        inner.style.cssText = ''
      }
      inner.addEventListener('transitionend', done)
    }
  }

  function place(r) {
    inner.style.width = `${r.width}px`
    inner.style.height = `${r.height}px`
    inner.style.transform =
      `translate3d(${r.left - origin.x}px, ${r.top - origin.y}px, 0)`
  }

  function openCinema() {
    if (cinema || !content || !inner) return
    const from = inner.getBoundingClientRect()
    cinema = true
    document.documentElement.classList.add('is-cinema')
    cinemaLayer.setAttribute('aria-hidden', 'false')
    fly(from, cinemaLayer)
    // The cursor tracking is released rather than frozen: the caption slides
    // back to its own column while the frame opens over it.
    followers.forEach((el) => {
      el.style.transition = 'transform 1.25s var(--ease-snappy)'
      el.style.transform = 'translate3d(0,0,0)'
    })
  }

  function closeCinema() {
    if (!cinema || !inner) return
    const from = inner.getBoundingClientRect()
    cinema = false
    document.documentElement.classList.remove('is-cinema')
    cinemaLayer.setAttribute('aria-hidden', 'true')
    // The scrub has been frozen for as long as the frame was open, so the
    // card's landing box is re-derived before anything is measured against it.
    applyScroll()
    fly(from, flip)
    followers.forEach((el) => { el.style.transition = '' })
  }

  content?.addEventListener('click', (e) => {
    // Once open, the frame itself is the only thing that is not a close
    // button — otherwise reaching for the picture would dismiss it.
    if (cinema && e.target.closest('.reel__full')) return
    cinema ? closeCinema() : openCinema()
  })
  content?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cinema ? closeCinema() : openCinema() }
  })
  addEventListener('keyup', (e) => { if (e.key === 'Escape') closeCinema() })

  /* -------------------------------------------------------------------------
     Intro

     A white sheet lifts, and then the page assembles in a fixed order. Every
     step is a delay against one origin, expressed in CSS; this only moves the
     page between two states and gets out of the way.
     ---------------------------------------------------------------------- */

  function intro() {
    document.body.classList.remove('is-loading')

    if (reduced) {
      document.documentElement.classList.add('is-intro', 'is-intro-out', 'is-ready')
      $('#intro-mask')?.remove()
      return
    }

    document.documentElement.classList.add('is-intro-out')

    // Before it plays, the wordmark sits centred in the screen and rises to
    // its real position — so the first thing the page does is put its own
    // name where you are already looking, then move it out of the way.
    if (logo) {
      const box = logo.getBoundingClientRect()
      logo.style.setProperty('--logo-intro', `${innerHeight / 2 - (box.top + box.height / 2)}px`)
    }

    setTimeout(() => {
      document.documentElement.classList.add('is-intro')
      // The offset is written inline, so no stylesheet rule can clear it —
      // the class only supplies the transition, and removing the property is
      // what actually moves the wordmark. Reading a layout property in
      // between forces the browser to commit the offset as a start value
      // rather than folding both changes into one frame.
      void logo?.offsetWidth
      logo?.style.removeProperty('--logo-intro')
      $('#intro-mask')?.remove()
      // Once the entrance has finished, the letters' transition is removed so
      // the scroll scrub can drive them directly without fighting a 1.25s
      // ease on every frame.
      setTimeout(() => document.documentElement.classList.add('is-ready'), 2200)
    }, 500)
  }

  /* -------------------------------------------------------------------------
     Wiring
     ---------------------------------------------------------------------- */

  let width = innerWidth

  function onResize() {
    // Height-only changes are the mobile URL bar, not a layout change.
    // Re-splitting on those would reflow the page on every scroll gesture.
    if (innerWidth === width) return
    width = innerWidth
    fitAll()
    relines()
    measureReel()
  }

  addEventListener('scroll', applyScroll, { passive: true })
  addEventListener('resize', onResize)
  pointer.addEventListener('change', measureReel)

  fitAll()
  relines()
  measureReel()

  // Splitting against the fallback face produces masks of the wrong height
  // and line breaks in the wrong places, so the real work waits for the font.
  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  ready.then(() => {
    fitAll()
    relines()
    measureReel()
    intro()
  })

  // A font that never resolves should not leave the page behind a white sheet.
  setTimeout(() => {
    if (document.body.classList.contains('is-loading')) intro()
  }, 2600)
})()
