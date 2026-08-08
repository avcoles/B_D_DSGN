/* ==========================================================================
   main.js — page behaviour
   --------------------------------------------------------------------------
   Everything the page does that is not the 3D hero: the boot wipe, scroll
   reveals, the footer word reels, the accordion, and the command terminal.

   No animation library. All of it is IntersectionObserver, class toggles and
   CSS transitions, which keeps the whole page at four requests and means the
   motion is described in one place (styles.css) rather than two.
   ========================================================================== */

import { createFigure } from './figure.js';

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   Hero — 3D figure
   ========================================================================== */

const canvas = $('#figure-canvas');
const figure = canvas ? createFigure(canvas) : null;

if (!figure) {
  // No WebGL. The stage keeps its scanlines and vignette, so the hero still
  // reads as a screen rather than an empty black box.
  $('#stage-fallback')?.removeAttribute('hidden');
}

/* Hero scroll progress drives the turntable and the camera lift. */
if (figure) {
  const hero = $('#hero');
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    figure.setScroll(Math.min(1, Math.max(0, -rect.top / (rect.height || 1))));
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

/* Pose control. The button borrows the pose name for a moment so the change
   is legible — otherwise a joint moving 20 degrees looks like a glitch. */
const poseBtn = $('[data-pose]');
let poseLabelTimer;

function cyclePose() {
  if (!figure || !poseBtn) return;
  const name = figure.nextPose();
  const label = poseBtn.firstChild;
  if (label) label.nodeValue = `${name} `;
  clearTimeout(poseLabelTimer);
  poseLabelTimer = setTimeout(() => {
    if (label) label.nodeValue = 'Pose ';
  }, 1600);
}

poseBtn?.addEventListener('click', cyclePose);

/* ==========================================================================
   Boot sequence
   ========================================================================== */

const boot = $('#boot');

function runBoot() {
  if (!boot) return;

  const words = $$('[data-boot-word]', boot);
  const fill = $('#boot-fill');
  const readout = $('#boot-readout');

  const lines = [
    'AF-2016 // INIT',
    'LOADING SHELL',
    'SEATING JOINTS',
    'CALIBRATING 32 PTS',
    'READY',
  ];

  // The columns retract from the centre outwards, which reads as a shutter
  // opening rather than a curtain falling.
  const cols = $$('.boot__cols i', boot);
  const mid = (cols.length - 1) / 2;
  cols.forEach((col, i) => {
    col.style.transitionDelay = `${Math.abs(i - mid) * 0.045}s`;
  });

  const finish = () => {
    boot.classList.add('is-done');
    figure?.start();
    revealHero();
    setTimeout(() => boot.setAttribute('hidden', ''), 1400);
  };

  if (reduced) {
    finish();
    return;
  }

  let step = 0;
  const tick = setInterval(() => {
    words.forEach((w, i) => w.classList.toggle('is-lit', i === step % words.length));
    if (fill) fill.style.width = `${Math.min(100, (step / 11) * 100)}%`;
    if (readout) readout.textContent = lines[Math.min(lines.length - 1, Math.floor(step / 2.4))];
    step += 1;
    if (step > 11) {
      clearInterval(tick);
      finish();
    }
  }, 150);
}

/* ==========================================================================
   Reveals
   ========================================================================== */

/**
 * Line masks and fades share one observer.
 *
 * Stagger is written as a `--d` custom property rather than a JS timeline, so
 * the delays live next to the durations they belong with and a reduced-motion
 * user gets them zeroed out by the media query for free.
 */
function setupReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );

  $$('[data-reveal]').forEach((el, i) => {
    // Siblings that reveal together step by 60ms; the counter resets whenever
    // a new parent starts, so a long page never accumulates a 2s delay.
    const siblings = [...(el.parentElement?.children || [])].filter((n) => n.hasAttribute?.('data-reveal'));
    el.style.setProperty('--d', `${siblings.indexOf(el) * 0.06}s`);
    io.observe(el);
  });

  // Headline line-masks: stagger within their own heading.
  $$('h2, h3').forEach((heading) => {
    const masks = $$('.lm', heading);
    if (!masks.length) return;
    masks.forEach((m, i) => m.querySelector('.l')?.style.setProperty('--d', `${i * 0.08}s`));
    io.observe(heading);
  });
}

/** The hero headline is not scroll-triggered — it lands as the boot wipe goes. */
function revealHero() {
  const h1 = $('.hero__type .display');
  if (!h1) return;
  $$('.lm', h1).forEach((m, i) => m.querySelector('.l')?.style.setProperty('--d', `${0.15 + i * 0.09}s`));
  h1.classList.add('is-in');
}

/* ==========================================================================
   Footer word reels
   ========================================================================== */

/**
 * Each reel is a vertical stack that steps one word at a time. Reels advance
 * on a shared interval but with an offset per reel, so the sentence rewrites
 * itself a word at a time rather than all at once.
 */
function setupReels() {
  const reels = $$('[data-reel]');
  if (!reels.length) return;

  const state = reels.map((reel) => {
    const items = $$('i', reel);
    const inner = document.createElement('span');
    inner.className = 'slot__reel-inner';
    items.forEach((item) => inner.appendChild(item));
    reel.appendChild(inner);
    return { reel, inner, items, index: 0 };
  });

  // Width has to be measured after layout or every reel reports zero.
  const sizeTo = (s) => {
    const w = s.items[s.index].getBoundingClientRect().width;
    if (w) s.reel.style.width = `${Math.ceil(w)}px`;
  };

  const sizeAll = () => state.forEach(sizeTo);

  // Fonts change the measurement, so re-run once they have landed.
  sizeAll();
  document.fonts?.ready.then(sizeAll);
  window.addEventListener('resize', sizeAll);

  if (reduced) return;

  state.forEach((s, i) => {
    setTimeout(() => {
      setInterval(() => {
        s.index = (s.index + 1) % s.items.length;
        s.inner.style.transform = `translateY(${-s.index * 1.22}em)`;
        sizeTo(s);
      }, 2600);
    }, i * 550);
  });
}

/* ==========================================================================
   Accordion
   ========================================================================== */

function setupAccordion() {
  const items = $$('.acc');

  /**
   * Drive the panel height in pixels.
   *
   * Opening goes to a measured height and is released to `auto` on
   * transitionend, so the panel keeps working if the text rewraps at a new
   * viewport width. Closing has to go auto → px → 0 with a forced reflow in
   * between, because a transition needs a start value it can subtract from.
   */
  const setOpen = (item, open, instant = false) => {
    const panel = $('.acc__panel', item);
    const inner = $('.acc__inner', item);
    const head = $('.acc__head', item);
    if (!panel || !inner || !head) return;

    item.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));

    if (instant) {
      panel.style.transition = 'none';
      panel.style.height = open ? 'auto' : '0px';
      void panel.offsetHeight;
      panel.style.transition = '';
      return;
    }

    panel.style.height = `${inner.scrollHeight}px`;
    if (!open) {
      void panel.offsetHeight;
      panel.style.height = '0px';
    }
  };

  items.forEach((item) => {
    const panel = $('.acc__panel', item);

    panel?.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'height') return;
      if (item.classList.contains('is-open')) panel.style.height = 'auto';
    });

    $('.acc__head', item)?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      // One open at a time: the panels are long enough that two of them turn
      // the section into a wall.
      items.forEach((other) => other !== item && setOpen(other, false));
      setOpen(item, willOpen);
    });
  });

  if (items[0]) setOpen(items[0], true, true);
}

/* ==========================================================================
   Mobile menu
   ========================================================================== */

function setupMenu() {
  const toggle = $('#menu-toggle');
  const menu = $('#menu');
  if (!toggle || !menu) return;

  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
}

/* ==========================================================================
   Command terminal
   ========================================================================== */

const SECTIONS = {
  home: '#top',
  work: '#work',
  parts: '#parts',
  services: '#parts',
  studio: '#studio',
  latest: '#latest',
  news: '#latest',
  contact: '#contact',
};

const EFFECTS = ['bw', 'negative', 'crt'];

function setupTerminal() {
  const term = $('#term');
  const input = $('#term-input');
  const help = $('#term-help');
  if (!term || !input) return;

  const DEFAULT_HELP = help?.textContent ?? '';

  const open = () => {
    term.removeAttribute('hidden');
    input.value = '';
    if (help) {
      help.textContent = DEFAULT_HELP;
      help.classList.remove('is-error');
    }
    input.focus();
  };

  const close = () => {
    term.setAttribute('hidden', '');
    input.blur();
  };

  const say = (message, isError = false) => {
    if (!help) return;
    help.textContent = message;
    help.classList.toggle('is-error', isError);
  };

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'close' || cmd === 'exit') return close();

    if (cmd === 'help' || cmd === '?') {
      return say('Navigate: work, parts, studio, latest, contact. Effects: bw, negative, crt, reset. Also: pose, close.');
    }

    if (cmd === 'reset') {
      delete document.documentElement.dataset.fx;
      return say('Effects cleared.');
    }

    if (EFFECTS.includes(cmd)) {
      document.documentElement.dataset.fx = cmd;
      return say(`Effect "${cmd}" applied. Type reset to clear.`);
    }

    if (cmd === 'pose') {
      cyclePose();
      close();
      $('#hero')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    if (SECTIONS[cmd]) {
      close();
      $(SECTIONS[cmd])?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    say(`Unknown command: "${cmd}". Type help for the list.`, true);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input.value);
      input.value = '';
    }
  });

  $$('[data-cmd]').forEach((chip) =>
    chip.addEventListener('click', () => run(chip.dataset.cmd)),
  );
  $$('[data-term-close]').forEach((el) => el.addEventListener('click', close));
  $$('[data-term-open]').forEach((el) => el.addEventListener('click', open));

  window.addEventListener('keydown', (e) => {
    const isOpen = !term.hasAttribute('hidden');

    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      return close();
    }

    // "/" is only a shortcut when it is not a character someone is typing.
    if (e.key === '/' && !isOpen) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      open();
    }
  });
}

/* ==========================================================================
   HUD clock
   ========================================================================== */

function setupClock() {
  const el = $('[data-hud-clock]');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   Go
   ========================================================================== */

setupReveals();
setupReels();
setupAccordion();
setupMenu();
setupTerminal();
setupClock();
runBoot();
