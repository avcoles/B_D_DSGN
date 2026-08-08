/* ============================================================
   Rich Tradition — behaviour

   No framework, no animation library, no scroll hijack. The file owns
   seven things and nothing else:

     1. Split text     — cut headlines into characters and paragraphs
                         into measured lines, each in its own mask.
     2. Observation    — one IntersectionObserver drives every reveal
                         on the page by toggling a single class.
     3. Media          — fade a photograph in over its own blur.
     4. The plate      — collapse the wordmark into the monogram.
     5. The menu       — open, close, and keep ARIA honest.
     6. The cursor     — a gold disc over elements that opt in.
     7. The showcase   — format, filling, colour and the jar swap.

   Everything animated is animated by CSS. This file only ever adds a
   class or writes a custom property.
   ============================================================ */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. Split text

     Two modes. `chars` is deterministic — it can be built once and
     never rebuilt, because a character is a character at any width.
     `lines` is not: where a line breaks depends on the box, so the
     words are laid out, their offsetTops are read, and the runs that
     share one are grouped. That measurement is why line splitting
     waits for the webfont and re-runs on a width change; splitting
     against a fallback face produces masks that are the wrong height
     and breaks that land in the wrong place.
     ============================================================ */

  const splits = [...document.querySelectorAll('.st')];

  // Keep the authored markup. Every re-split works from this, never
  // from the DOM it produced last time.
  splits.forEach((el) => {
    el.dataset.source = el.innerHTML.trim();
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  });

  const segmentsOf = (html) => html.split(/<br\s*\/?>/i);
  const wordsOf = (segment) => segment.split(/\s+/).filter(Boolean);

  // Strip the tags the copy is allowed to carry, so a word can be
  // measured and re-emitted as text without smuggling markup through.
  const plain = (html) => {
    const box = document.createElement('div');
    box.innerHTML = html;
    return box.textContent;
  };

  function splitChars(el) {
    const frag = document.createDocumentFragment();
    let index = 0;

    segmentsOf(el.dataset.source).forEach((segment, s) => {
      if (s > 0) frag.appendChild(document.createElement('br'));

      wordsOf(plain(segment)).forEach((word, w) => {
        // A real space between words: `.word` is inline-block, so the
        // text node is what keeps them apart and what lets the line
        // break between them.
        if (w > 0) frag.appendChild(document.createTextNode(' '));

        const wordEl = document.createElement('span');
        wordEl.className = 'word';

        for (const character of word) {
          const mask = document.createElement('span');
          mask.className = 'char-mask';
          mask.setAttribute('aria-hidden', 'true');

          const charEl = document.createElement('span');
          charEl.className = 'char';
          charEl.style.setProperty('--index', index++);
          charEl.textContent = character;

          mask.appendChild(charEl);
          wordEl.appendChild(mask);
        }

        frag.appendChild(wordEl);
      });
    });

    el.replaceChildren(frag);
  }

  function splitLines(el) {
    // Pass one: every word in its own probe span, breaks preserved.
    const probe = document.createDocumentFragment();
    const probes = [];

    segmentsOf(el.dataset.source).forEach((segment, s) => {
      if (s > 0) {
        const br = document.createElement('br');
        br.dataset.forced = 'true';
        probe.appendChild(br);
        probes.push(br);
      }

      wordsOf(plain(segment)).forEach((word, w) => {
        if (w > 0) probe.appendChild(document.createTextNode(' '));
        const span = document.createElement('span');
        span.textContent = word;
        probe.appendChild(span);
        probes.push(span);
      });
    });

    el.replaceChildren(probe);

    // Pass two: group by vertical position. A forced break always
    // starts a new run even if the browser happened to agree.
    const lines = [];
    let current = null;
    let top = null;

    probes.forEach((node) => {
      if (node.tagName === 'BR') { current = null; top = null; return; }
      const y = node.offsetTop;
      if (current === null || Math.abs(y - top) > 1) {
        current = [];
        lines.push(current);
        top = y;
      }
      current.push(node.textContent);
    });

    // Pass three: rebuild as masked lines.
    const frag = document.createDocumentFragment();
    lines.forEach((words, index) => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      mask.setAttribute('aria-hidden', 'true');

      const line = document.createElement('span');
      line.className = 'line';
      line.style.setProperty('--index', index);
      line.textContent = words.join(' ');

      mask.appendChild(line);
      frag.appendChild(mask);
    });

    el.replaceChildren(frag);
  }

  function splitAll(mode) {
    splits.forEach((el) => {
      if (mode && el.dataset.split !== mode) return;
      const delay = el.dataset.delay;
      if (delay) el.style.setProperty('--delay', delay);
      if (el.dataset.split === 'lines') splitLines(el);
      else splitChars(el);
    });
  }

  splitAll('chars');

  // Lines wait for the real face. Until then the paragraph stays as
  // authored, which is legible — it just is not animated yet.
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    splitAll('lines');
    // Characters are re-cut too: the fallback's advance widths change
    // where a headline wraps, and a stale wrap leaves a word orphaned.
    splitAll('chars');
    observeAll();
  });

  // A width change can move every break on the page. Height changes
  // cannot, so mobile URL-bar scroll does not trigger a reflow.
  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      splits.forEach((el) => {
        const wasIn = el.classList.contains('is-inview');
        if (el.dataset.split === 'lines') splitLines(el);
        else splitChars(el);
        if (wasIn) el.classList.add('is-inview');
      });
    }, 180);
  });

  /* ============================================================
     2. Observation

     One observer for the whole page. `data-observe` marks an element
     as watched; `data-observe="once"` releases it the first time it
     lands. Everything downstream is a CSS rule hanging off
     `.is-inview`, so a new reveal costs an attribute, not a script.
     ============================================================ */

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        if (entry.target.dataset.observe !== 'once') entry.target.classList.remove('is-inview');
        return;
      }
      entry.target.classList.add('is-inview');
      if (entry.target.dataset.observe === 'once') observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

  function observeAll() {
    document.querySelectorAll('[data-observe]').forEach((el) => {
      if (reduced) { el.classList.add('is-inview'); return; }
      observer.observe(el);
    });
  }

  observeAll();

  /* ============================================================
     3. Media

     The blurred copy is already painted; the sharp one is transparent
     until it decodes. Cached images are `complete` before this runs,
     which is why the check is a check and not only a listener.
     ============================================================ */

  document.querySelectorAll('.media__picture').forEach((img) => {
    const reveal = () => img.classList.remove('is-loading');
    if (img.complete && img.naturalWidth) reveal();
    else {
      img.addEventListener('load', reveal, { once: true });
      img.addEventListener('error', reveal, { once: true });
    }
  });

  /* ============================================================
     4. The plate

     Past the first screen the red block narrows and the lockup rides
     up out of it. One threshold, one class, applied to two elements
     whose transitions are staggered against each other in CSS.
     ============================================================ */

  const plate = document.getElementById('plate');
  const logos = document.getElementById('logos');
  const heroMedia = document.querySelector('.hero .pr');
  const parallax = heroMedia ? parseFloat(heroMedia.dataset.parallax || '0') : 0;
  const hero = document.querySelector('.hero');

  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    const collapsed = y > 80;
    plate.classList.toggle('is-collapsed', collapsed);
    logos.classList.toggle('is-collapsed', collapsed);

    // Hero parallax. The image is pre-scaled 1.15, so it can travel
    // 7.5% of its height in either direction without exposing an edge;
    // the translation is clamped to the hero's own height so the rig
    // stops working the moment the section leaves.
    if (heroMedia && !reduced) {
      const limit = hero.offsetHeight;
      const offset = Math.min(y, limit) * parallax;
      heroMedia.style.transform = `translate3d(0, ${offset}px, 0) scale(1.15)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  if (heroMedia) heroMedia.style.transform = 'translate3d(0, 0, 0) scale(1.15)';
  onScroll();

  /* ============================================================
     5. The menu

     `aria-hidden` and `inert` move together, so the screen-reader
     state and the keyboard state can never disagree.
     ============================================================ */

  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  function setMenu(open) {
    document.body.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('--locked', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert');
    else menu.setAttribute('inert', '');
  }

  burger.addEventListener('click', () => {
    setMenu(!document.body.classList.contains('is-menu-open'));
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  /* ============================================================
     6. The cursor

     Only over elements that ask for it. The disc is positioned by two
     custom properties rather than by writing `transform` on every
     move, which keeps the pointer handler down to two writes.
     ============================================================ */

  const cursor = document.getElementById('cursor');
  const cursorLabel = document.getElementById('cursor-label');

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      cursor.style.setProperty('--x', event.clientX);
      cursor.style.setProperty('--y', event.clientY);

      const target = event.target.closest('[data-cursor-text]');
      if (target) {
        cursorLabel.textContent = target.dataset.cursorText;
        cursor.classList.add('is-active');
      } else {
        cursor.classList.remove('is-active');
      }
    }, { passive: true });
  }

  /* ============================================================
     7. The showcase

     Two independent axes. Format decides which pack you are looking
     at; filling decides the colour of the panel. Both throw the jar
     off one edge and bring it back from the other — the direction is
     read from which control moved, so pressing a tab on the right
     sends the jar right.
     ============================================================ */

  const showcase = document.getElementById('products');

  if (showcase) {
    const stage = document.getElementById('showcase-media');
    const image = document.getElementById('showcase-image');

    let format = 'Jar';
    let flavour = 'Beef';
    let busy = null;

    function describe() {
      image.alt = `A ${format.toLowerCase()} of ${flavour.toLowerCase()}-filled piquillo peppers`;
    }

    function swap(direction) {
      if (reduced) { describe(); return; }
      clearTimeout(busy);
      stage.style.setProperty('--exit', `${direction * 60}vw`);
      stage.classList.add('is-switching');

      busy = setTimeout(() => {
        describe();
        // Re-enter from the opposite side, then let the resting
        // transition carry it back to centre.
        stage.style.setProperty('--exit', `${direction * -60}vw`);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => stage.classList.remove('is-switching'));
        });
      }, 560);
    }

    showcase.querySelectorAll('[data-format]').forEach((button, index, all) => {
      button.addEventListener('click', () => {
        if (button.classList.contains('is-active')) return;
        all.forEach((other) => other.classList.remove('is-active'));
        button.classList.add('is-active');
        format = button.dataset.format;
        // The two lists sit either side of the crown; the first pair
        // is on the left of it, the second on the right.
        swap(index < 2 ? -1 : 1);
      });
    });

    showcase.querySelectorAll('[data-flavour]').forEach((button, index, all) => {
      button.addEventListener('click', () => {
        if (button.classList.contains('is-active')) return;
        const previous = [...all].findIndex((other) => other.classList.contains('is-active'));
        all.forEach((other) => other.classList.remove('is-active'));
        button.classList.add('is-active');
        flavour = button.dataset.flavour;
        showcase.style.background = button.dataset.color;
        swap(index > previous ? 1 : -1);
      });
    });
  }

  /* ============================================================
     Intro

     Lifted on the next frame after the hero photograph is usable, or
     after a ceiling, whichever comes first — a curtain that outstays
     its welcome is worse than no curtain.
     ============================================================ */

  const intro = document.getElementById('intro');
  const heroImage = document.querySelector('.hero .media__picture');

  document.body.classList.add('--locked');

  const lift = () => {
    intro.classList.add('is-done');
    document.body.classList.remove('--locked');
  };

  requestAnimationFrame(() => intro.classList.add('is-ready'));

  const ready = heroImage && !heroImage.complete
    ? new Promise((resolve) => {
        heroImage.addEventListener('load', resolve, { once: true });
        heroImage.addEventListener('error', resolve, { once: true });
      })
    : Promise.resolve();

  Promise.race([ready, new Promise((resolve) => setTimeout(resolve, 2600))])
    .then(() => setTimeout(lift, reduced ? 0 : 700));
})();
