/* =============================================================================
   Warehouse — behaviour
   -----------------------------------------------------------------------------
   The source ran GSAP 3.13 (ScrollTrigger, SplitText, DrawSVG) on top of Lenis.
   Only one of its script chunks survived in the snapshot, so the tween code
   itself is gone; what remains is the frozen inline state GSAP had written at
   the moment the page was saved. Every number below is either read straight off
   that frozen state or noted as inferred.

   Nothing here is a framework. Five moving parts:

     1. a damped scroller standing in for Lenis
     2. one rAF pass that maps scroll position onto every scrubbed transform
     3. an IntersectionObserver that reveals split headings once each
     4. the bottom bar / menu state machine
     5. the quote slider

   All five read from the same `scroll` element, because the document itself
   never scrolls — see the note at the top of styles.css.
============================================================================= */

const scroller = document.querySelector('.scroll')
const root = document.documentElement

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

/* Progress of `value` across the range [from, to], clamped to 0..1. */
const progress = (value, from, to) => (to === from ? 0 : clamp((value - from) / (to - from), 0, 1))

/* -------------------------------------------------------------------------- */
/* 1. Damped scrolling                                                        */
/* -------------------------------------------------------------------------- */

/* Lenis in about thirty lines. A wheel event moves a target; the rendered
   position chases it exponentially, frame-rate independent, so the page keeps
   gliding for a moment after the wheel stops. Touch and keyboard are left to
   the browser — Lenis does the same by default — and any scroll we did not
   write ourselves resyncs the target, so the two can never fight. */
const damping = 9

let target = 0
let current = 0
let written = -1
let raf = 0

const maxScroll = () => scroller.scrollHeight - scroller.clientHeight

function onWheel(event) {
  if (document.body.classList.contains('is-menu')) return
  event.preventDefault()
  target = clamp(target + event.deltaY, 0, maxScroll())
}

scroller.addEventListener('wheel', onWheel, { passive: false })

/* Native scrolls (touch, keyboard, scrollbar, hash jumps) land here. */
scroller.addEventListener(
  'scroll',
  () => {
    if (Math.abs(scroller.scrollTop - written) > 1) {
      target = current = scroller.scrollTop
    }
    /* Render here as well as in the frame loop. A native scroll — touch,
       keyboard, scrollbar drag — can land between two frames, and rAF is
       throttled outright when the page is not compositing. */
    render(current)
  },
  { passive: true },
)

/* Anchor links have to move the damped target, not the scroll position, or the
   chase would immediately drag the page back. */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href').slice(1)
    const el = document.getElementById(id)
    if (!el) return
    event.preventDefault()
    closeMenu()
    target = clamp(scroller.scrollTop + el.getBoundingClientRect().top, 0, maxScroll())
  })
})

/* -------------------------------------------------------------------------- */
/* 2. Scrubbed transforms                                                     */
/* -------------------------------------------------------------------------- */

/* Everything that moves with the scroll registers one entry here. `measure`
   runs on resize and caches the scroll range the effect spans; `apply` runs
   every frame with that range's progress. Keeping the two apart is what stops
   the rAF pass from reading layout and thrashing.

   `rem` is not a constant: the root font-size is a fraction of the viewport
   width, so any pixel offset taken from the snapshot has to be re-derived at
   the current width rather than hard-coded. */
const effects = []
let rem = 10

function effect(el, measure, apply) {
  if (!el) return
  effects.push({ el, measure, apply, from: 0, to: 1 })
}

const sectionTop = (el) => scroller.scrollTop + el.getBoundingClientRect().top

/* --- hero -----------------------------------------------------------------
   The snapshot froze the hero image at translateY(2.6385%) and the scroll
   indicator at opacity 0.7361. Those are the same moment on two different
   curves: 1 - 0.7361 = 0.2639, and 0.2639 x 10 = 2.639. So the image travels a
   flat 10% down the frame while the indicator fades out, both across one pass
   of the hero. The pass length is the inferred part — the section's own height
   is the conventional choice and is what is used here. */
const heroSection = document.querySelector('.home-header')
const heroAsset = document.querySelector('[data-parallax="hero"]')
const heroIndicator = document.querySelector('.home-header .indicator')

effect(
  heroAsset,
  (e) => {
    e.from = sectionTop(heroSection)
    e.to = e.from + heroSection.offsetHeight
  },
  (e, p) => {
    heroAsset.style.transform = `translate3d(0, ${(p * 10).toFixed(4)}%, 0)`
    if (heroIndicator) heroIndicator.style.opacity = (1 - p).toFixed(4)
  },
)

/* --- collection tiles ------------------------------------------------------
   Tiles two and three were frozen at translateY(+50%) and (-50%) with the
   section still below the fold, so those are their start values and both
   settle to zero as the section crosses the viewport. Tiles one and four
   carried no transform at all and stay put — the stagger in the layout is
   already doing that work for them. */
const collection = document.querySelector('.product-collection')

;[
  ['[data-parallax="block-2"]', 50],
  ['[data-parallax="block-3"]', -50],
].forEach(([selector, fromPercent]) => {
  const el = document.querySelector(selector)
  effect(
    el,
    (e) => {
      e.from = sectionTop(collection) - window.innerHeight
      e.to = sectionTop(collection) + collection.offsetHeight - window.innerHeight
    },
    (e, p) => {
      el.style.transform = `translate3d(0, ${(fromPercent * (1 - p)).toFixed(4)}%, 0)`
    },
  )
})

/* --- showroom --------------------------------------------------------------
   The section is two viewports tall with a one-viewport sticky stage inside,
   so the second viewport of scroll is the whole budget for this move and
   nothing below it shifts while it plays. Frozen start values: the rule at
   scaleX(0), the two columns pulled 91.85px toward the centre, and the video
   at scale 0.55 / opacity 0.7. All four resolve to their rest state together. */
const showroom = document.querySelector('.banner-showroom')
const showroomBorder = document.querySelector('[data-showroom="border"]')
const showroomLeft = document.querySelector('[data-showroom="column-left"]')
const showroomRight = document.querySelector('[data-showroom="column-right"]')
const showroomBg = document.querySelector('[data-showroom="background"]')

/* 91.8531px at the 1600px design width, expressed in rem so it tracks. */
const COLUMN_SPREAD = 9.18531

if (showroom) {
  effect(
    showroom,
    (e) => {
      e.from = sectionTop(showroom)
      e.to = e.from + showroom.offsetHeight - window.innerHeight
    },
    (e, p) => {
      if (window.innerWidth <= 600) {
        showroomBorder.style.transform = ''
        showroomLeft.style.transform = ''
        showroomRight.style.transform = ''
        showroomBg.style.transform = ''
        showroomBg.style.opacity = ''
        return
      }
      const offset = COLUMN_SPREAD * rem * (1 - p)
      showroomBorder.style.transform = `scale(${p.toFixed(4)}, 1)`
      showroomLeft.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`
      showroomRight.style.transform = `translate3d(${(-offset).toFixed(2)}px, 0, 0)`
      const scale = 0.55 + 0.45 * p
      showroomBg.style.transform = `scale(${scale.toFixed(4)})`
      showroomBg.style.opacity = (0.7 + 0.3 * p).toFixed(4)
    },
  )
}

/* --- assets duo ------------------------------------------------------------
   The taller right-hand image is flush to the top of the row and the shorter
   left one is not, so a small counter-drift on the left keeps the pair from
   reading as a single static block. Frozen at translate(0,0) with the section
   below the fold; the travel is inferred. */
const duoSection = document.querySelector('.assets-duo')
const duoBlock = document.querySelector('[data-parallax="duo"]')

effect(
  duoBlock,
  (e) => {
    e.from = sectionTop(duoSection) - window.innerHeight
    e.to = sectionTop(duoSection) + duoSection.offsetHeight
  },
  (e, p) => {
    if (window.innerWidth <= 600) {
      duoBlock.style.transform = ''
      return
    }
    duoBlock.style.transform = `translate3d(0, ${((0.5 - p) * 12 * rem).toFixed(2)}px, 0)`
  },
)

/* --- footer ----------------------------------------------------------------
   Frozen at translateY(-50%) with the footer below the fold: the whole footer
   plate is held half a screen up and released as it arrives, so the page ends
   on the photograph catching up rather than simply appearing. */
const footer = document.querySelector('.footer')
const footerInner = document.querySelector('[data-parallax="footer"]')

effect(
  footerInner,
  (e) => {
    e.from = sectionTop(footer) - window.innerHeight
    e.to = sectionTop(footer)
  },
  (e, p) => {
    footerInner.style.transform = `translate3d(0, ${(-50 * (1 - p)).toFixed(4)}%, 0)`
  },
)

/* -------------------------------------------------------------------------- */
/* The frame                                                                  */
/* -------------------------------------------------------------------------- */

function measureAll() {
  rem = parseFloat(getComputedStyle(root).fontSize) || 10
  effects.forEach((e) => e.measure(e))
}

/* Everything that depends on scroll position, and nothing that depends on
   time. Safe to call from the frame loop and from a scroll event alike. */
function render(position) {
  effects.forEach((e) => e.apply(e, progress(position, e.from, e.to)))
  document.body.classList.toggle('is-scrolled', position > window.innerHeight * 0.5)
}

let lastTime = performance.now()

function frame(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  const distance = target - current
  if (Math.abs(distance) < 0.1) {
    current = target
  } else {
    current += distance * (1 - Math.exp(-damping * delta))
    written = current
    scroller.scrollTop = current
  }

  render(current)

  raf = requestAnimationFrame(frame)
}

/* -------------------------------------------------------------------------- */
/* 3. Reveals                                                                 */
/* -------------------------------------------------------------------------- */

/* Split headings rise into their masks once, then the observer lets them go.
   The hero is marked `data-reveal="load"` and is released on load instead,
   because it is already in view when the page arrives. */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-inview')
      revealObserver.unobserve(entry.target)
    })
  },
  { rootMargin: '0px 0px -15% 0px', threshold: 0 },
)

document.querySelectorAll('.base-heading[data-reveal]').forEach((el) => {
  if (el.dataset.reveal === 'load') return
  revealObserver.observe(el)
})

/* -------------------------------------------------------------------------- */
/* 4. Bottom bar and menu                                                     */
/* -------------------------------------------------------------------------- */

/* The bar and the menu are one object. The plate behind the bar widens to the
   menu's width as the menu's own plate scales up out of the bar's bottom edge,
   so the two never read as separate surfaces. */
const body = document.body
const menu = document.querySelector('.menu')
const burger = document.querySelector('.header .burger')
const closeButton = document.querySelector('.header .close')
const headerPlate = document.querySelector('.header .background')
const topButton = document.querySelector('.header .arrow')

const BAR_WIDTH = 27.6
const MENU_WIDTH = () => (window.innerWidth <= 600 ? 32 : 40)

function openMenu() {
  body.classList.add('is-menu')
  menu.setAttribute('aria-hidden', 'false')
  burger.setAttribute('aria-expanded', 'true')
  headerPlate.style.width = `${MENU_WIDTH()}rem`
}

function closeMenu() {
  if (!body.classList.contains('is-menu')) return
  body.classList.remove('is-menu')
  menu.setAttribute('aria-hidden', 'true')
  burger.setAttribute('aria-expanded', 'false')
  headerPlate.style.width = `${BAR_WIDTH}rem`
}

if (headerPlate) headerPlate.style.width = `${BAR_WIDTH}rem`
if (burger) burger.addEventListener('click', openMenu)
if (closeButton) closeButton.addEventListener('click', closeMenu)

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})

if (topButton) {
  topButton.addEventListener('click', () => {
    target = 0
  })
}

/* -------------------------------------------------------------------------- */
/* 5. Quote slider                                                            */
/* -------------------------------------------------------------------------- */

/* Every quote is stacked in the same grid cell and only one is visible, so the
   stack has no height of its own and something has to write one.

   The snapshot froze it at 810px, which is not a height any quote on this page
   measures — the five run 381, 317, 509, 573 and 573 — so that number cannot be
   derived from the content and is not copied here. The stack takes the tallest
   quote instead, which is the only choice that keeps everything below the
   section still while you page between a three-line quote and a seven-line one. */
const reviewBlocks = [...document.querySelectorAll('.reviews .block')]
const reviewIndicator = document.querySelector('.reviews .indicator')
const reviewStack = document.querySelector('.reviews .blocks')
const [previousButton, nextButton] = document.querySelectorAll('.reviews .arrow-nav .button')

let reviewIndex = 0

function setReviewHeight() {
  if (!reviewStack || !reviewBlocks.length) return
  reviewStack.style.height = `${Math.max(...reviewBlocks.map((b) => b.offsetHeight))}px`
}

function showReview(index) {
  if (!reviewBlocks.length) return
  reviewIndex = (index + reviewBlocks.length) % reviewBlocks.length
  reviewBlocks.forEach((block, i) => {
    block.classList.toggle('is-active', i === reviewIndex)
    const quote = block.querySelector('.blockquote')
    if (quote) quote.classList.toggle('is-inview', i === reviewIndex)
  })
  if (reviewIndicator) {
    reviewIndicator.textContent = `${String(reviewIndex + 1).padStart(2, '0')} / ${String(
      reviewBlocks.length,
    ).padStart(2, '0')}`
  }
  setReviewHeight()
}

if (previousButton) previousButton.addEventListener('click', () => showReview(reviewIndex - 1))
if (nextButton) nextButton.addEventListener('click', () => showReview(reviewIndex + 1))

/* The stack's height is measured from content, so it cannot be taken once at a
   moment of our choosing — a webfont swapping in mid-measure leaves it holding
   a height no quote has. Watching the blocks themselves makes the measurement
   independent of when anything happens to settle. */
if (reviewStack && 'ResizeObserver' in window) {
  const stackObserver = new ResizeObserver(() => setReviewHeight())
  reviewBlocks.forEach((block) => stackObserver.observe(block))
}

/* The first quote holds its lines below the mask until the section arrives,
   the same as any other split heading on the page. */
if (reviewStack) {
  const quoteObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const quote = reviewBlocks[reviewIndex].querySelector('.blockquote')
        if (quote) quote.classList.add('is-inview')
        quoteObserver.disconnect()
      })
    },
    { rootMargin: '0px 0px -15% 0px' },
  )
  quoteObserver.observe(reviewStack)
}

/* -------------------------------------------------------------------------- */
/* 6. Cursor                                                                  */
/* -------------------------------------------------------------------------- */

const cursor = document.querySelector('.cursor')
const cursorLabel = cursor && cursor.querySelector('.label')

if (cursor) {
  if (!window.matchMedia('(hover: hover)').matches) {
    cursor.classList.add('is-touch')
  } else {
    let cursorX = 0
    let cursorY = 0

    window.addEventListener(
      'pointermove',
      (event) => {
        cursorX = event.clientX
        cursorY = event.clientY
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      },
      { passive: true },
    )

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => {
        cursorLabel.textContent = el.dataset.cursor
        cursor.classList.add('is-visible')
      })
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'))
    })
  }
}

/* -------------------------------------------------------------------------- */
/* Boot                                                                       */
/* -------------------------------------------------------------------------- */

function relayout() {
  measureAll()
  setReviewHeight()
  render(current)
}

function start() {
  showReview(0)
  relayout()
  document.querySelector('.base-heading[data-reveal="load"]')?.classList.add('is-inview')
  if (!raf) raf = requestAnimationFrame(frame)
}

window.addEventListener('resize', relayout)

/* Split lines are sized by the webfont, so the stack height and every cached
   scroll range have to be taken again once it has actually loaded — and again
   on load, because the lazy images below the fold settle later still. */
if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout)

window.addEventListener('load', () => {
  relayout()
  document.body.classList.add('is-ready')
})

start()
