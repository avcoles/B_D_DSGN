/* ============================================================
   Editorial Portfolio: behaviour

   The source runs Nuxt, Vuex, GSAP, GSAP Flip and a CustomEase
   plugin. This file replaces all of it and owns five things.

     1. The intro. Measure where the wordmark is born, hand the
        numbers to CSS, let go.
     2. The stack. Raise the hovered project's photograph to the top
        of the pile.
     3. The clock. Lisbon time, updated on the minute.
     4. The menu. The mobile field, and the header mark that takes
        the wordmark's place while it is open.
     5. Contact. The wipe, the address copy, the form.

   Nothing here animates anything. Every move on the page is a CSS
   transition, and this file only ever adds a class or writes a
   custom property. So there is no timeline to keep in sync and
   nothing to tear down on resize.
   ============================================================ */

(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

  /* ============================================================
     1. The intro

     The wordmark's resting place is the floor: two columns at 40.5%
     and 59.5% of the content width, filling the screen edge to edge.
     The intro starts it somewhere else, scaled down into two small
     boxes in the middle of the viewport, and brings it home.

     The trick is to lay the page out at the destination and express
     the *start* as one transform per word. Removing that transform is
     the whole animation. There is no per-frame maths, only one layout
     read at the beginning, and the browser composites the rest.

     Three numbers come off the source's own timeline and everything
     else falls out of them:

       letters   1.3s each, 70ms apart
       parting   1s, starting half a second before the letters land
       the flip  1.5s, starting half a second after the parting

     The parting is easy to get backwards. In the source the two small
     boxes are pushed 12.5rem apart *before* the wordmark flips, so
     the flip's start position is the parted one. The column therefore
     begins at +12.5rem (for the left word) and travels to zero, while
     the word's own transform targets the box it will have arrived in.
     ============================================================ */

  const LETTER_DURATION = 1.3;
  const LETTER_STAGGER = 0.07;
  const PART_REM = 12.5;

  const lockup = $('[data-lockup]');
  const stages = [$('[data-stage-a]'), $('[data-stage-b]')];
  const cols = $$('[data-lockup-col]');
  const letters = $$('.lockup__letter');

  function arm() {
    if (!lockup || cols.length !== 2) return;

    const rem = parseFloat(getComputedStyle(root).fontSize);
    const part = PART_REM * rem;

    /* Below the breakpoint the two words stack instead of sitting
       side by side, and the source parts them by half as much. */
    const spread = matchMedia('(min-width: 650px)').matches ? part : part / 2;

    const lockRect = lockup.getBoundingClientRect();

    /* Measure everything before writing anything.

       The word element is not the design box. It carries a negative
       left margin so its first glyph's ink starts on the page margin
       rather than a side bearing inside it, which makes the word's own
       rect wider than the column it fills and shifted left of it. The
       column is what the wordmark is fitted to, so the column is what
       the flip has to land on the stage. Scaling by the word's rect
       instead put the roman half 4% under size. */
    const specs = cols.map((col, i) => {
      const word = $('[data-lockup-word]', col);
      const stage = stages[i];
      if (!word || !stage) return null;

      const from = stage.getBoundingClientRect();
      const box = col.getBoundingClientRect();
      const own = word.getBoundingClientRect();
      if (!from.width || !box.width) return null;

      return { col, word, from, box, own, scale: from.width / box.width };
    });

    if (specs.some((spec) => !spec)) return;

    /* One vertical anchor, shared. Centring each word inside its own
       stage box would let the two baselines drift apart in flight,
       because the halves are different faces at different sizes and
       neither their boxes nor their scales match. Anchoring the whole
       lockup instead carries the baseline they share at rest through
       the entire flip. */
    const meanScale = (specs[0].scale + specs[1].scale) / 2;
    const top = specs[0].from.top + (specs[0].from.height - lockRect.height * meanScale) / 2;

    specs.forEach((spec, i) => {
      /* Left word parts left, right word parts right. */
      const dir = i === 0 ? -1 : 1;
      const targetX = spec.from.left + dir * spread;
      const targetY = top + (spec.box.top - lockRect.top) * spec.scale;

      /* Solve for the translate that puts the *column* on the target,
         given that the transform is applied to the word and measured
         from the word's own top left corner. Below the breakpoint the
         columns stack, and the (box - lock) term is what keeps the
         second line under the first instead of on top of it. */
      const x = targetX - spec.own.left - spec.scale * (spec.box.left - spec.own.left);
      const y = targetY - spec.own.top - spec.scale * (spec.box.top - spec.own.top);

      spec.word.style.setProperty('--flip', `translate(${x}px, ${y}px) scale(${spec.scale})`);
      spec.col.style.setProperty('--part', `${-dir * spread}px`);
    });

    /* The schedule, derived rather than typed twice. */
    const lettersEnd = LETTER_DURATION + (letters.length - 1) * LETTER_STAGGER;
    const partAt = Math.max(0, lettersEnd - 0.5);
    const flipAt = partAt + 0.5;

    root.style.setProperty('--part-delay', `${partAt}s`);
    root.style.setProperty('--flip-delay', `${flipAt}s`);
    root.style.setProperty('--fade-delay', `${flipAt + 0.6}s`);
    root.style.setProperty('--list-delay', `${flipAt - 1}s`);

    return flipAt + 1.5;
  }

  function play() {
    if (reduced) {
      root.classList.remove('is-intro');
      return;
    }

    const end = arm() || 0;

    /* Two frames: one for the armed transforms to be committed as the
       starting style, one to change them. A single frame is enough in
       most browsers and not in all of them. */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add('is-playing'));
    });

    /* Clear up after the last transition so the resting page carries
       no transform, no inline custom property and no class. A resize
       afterwards is then an ordinary reflow. */
    setTimeout(() => {
      root.classList.remove('is-intro', 'is-playing');
      cols.forEach((col) => {
        col.style.removeProperty('--part');
        const word = $('[data-lockup-word]', col);
        if (word) word.style.removeProperty('--flip');
      });
    }, (end + 1.5) * 1000);
  }

  /* Fonts decide the wordmark's width, and the wordmark's width is
     the flip's scale factor. Measuring before they land would arm the
     intro against the fallback face and the flip would finish on the
     wrong size.

     But the page holds its breath until this resolves, so the wait is
     capped. If the faces are slow the intro starts anyway against
     whatever has loaded. A slightly wrong scale is a much smaller
     failure than two seconds of blank white. */
  const fontsReady = document.fonts && document.fonts.ready
    ? document.fonts.ready
    : Promise.resolve();

  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(play);

  /* ============================================================
     2. The stack

     Eleven photographs in one box, all of them painted, none of them
     hidden. What you see is whichever one is on top, so hovering a
     project costs a single z-index write on its own image. There is
     no fade to schedule and no previous state to unwind, and the pile
     cannot end up showing two things at once.

     The counter only ever goes up, which keeps the most recently
     hovered image in front of everything hovered before it.
     ============================================================ */

  const stack = $('[data-stack]');
  const list = $('[data-list]');

  if (stack && list) {
    const images = $$('img', stack);
    const links = $$('.list-li', list);
    let z = images.length;

    links.forEach((link, i) => {
      const image = images[i];
      if (!image) return;

      /* The lit name and the raised photograph are the same piece of
         state, and it persists: the last project entered stays lit
         after the pointer leaves. That is why this is a class rather
         than a :hover rule. */
      const raise = () => {
        image.style.zIndex = ++z;
        links.forEach((other) => other.classList.toggle('is-active', other === link));
      };

      link.addEventListener('mouseenter', raise);
      link.addEventListener('focus', raise);
    });
  }

  /* ============================================================
     3. The clock

     Lisbon, to the minute. The next tick is scheduled for the top of
     the following minute instead of every second, so the page holds
     one timer and wakes up sixty times less often than an interval
     would. The colon blinks in CSS and owes nothing to this.
     ============================================================ */

  const hoursEl = $('[data-hours]');
  const minutesEl = $('[data-minutes]');

  if (hoursEl && minutesEl) {
    const tick = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Lisbon',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      })
        .format(now)
        .split(':');

      hoursEl.textContent = String(Number(parts[0]));
      minutesEl.textContent = parts[1];

      setTimeout(tick, (60 - now.getSeconds()) * 1000);
    };

    tick();
  }

  /* ============================================================
     4. The menu

     A black field on small screens. `aria-hidden` and the open class
     move together so the screen-reader state and the visual state
     cannot disagree, and the header swaps its three disciplines for
     the name while the field is up. The disciplines are a statement
     about the work, and a menu is the wrong place to make it.
     ============================================================ */

  const menu = $('#menu');
  const menuToggle = $('[data-menu-toggle]');

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    root.classList.toggle('is-menu-open', open);
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  }

  if (menu) {
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
  }

  /* ============================================================
     5. Contact

     The panel is the only coloured surface the site owns and it
     arrives as a diagonal wipe: two corner percentages on one
     clip-path, running at 1s and 1.25s so the polygon is never a
     rectangle while it is moving. Both are registered with
     @property in the stylesheet. Without that they would jump.
     ============================================================ */

  const contact = $('[data-contact]');

  function setContact(open) {
    if (!contact) return;
    contact.classList.toggle('is-open', open);
    contact.setAttribute('aria-hidden', String(!open));
    if (open) setMenu(false);
  }

  $$('[data-contact-open]').forEach((btn) => btn.addEventListener('click', () => setContact(true)));
  $$('[data-contact-close]').forEach((btn) => btn.addEventListener('click', () => setContact(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setContact(false);
    setMenu(false);
  });

  /* The address row is a button dressed as a form field. Clicking it
     puts the address on the clipboard and says so in place of the
     label, which is all the feedback the source gives too. */
  const copyRow = $('[data-copy]');
  const copyLabel = $('[data-copy-label]');

  if (copyRow && copyLabel) {
    copyRow.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('hello@milanavas.com');
        copyLabel.textContent = 'Copied';
      } catch {
        copyLabel.textContent = 'hello@milanavas.com';
      }
    });
  }

  /* Nothing is listening at the other end. The source posts to a
     Netlify form handler. The three states are here because the
     button label is the only status display the form has. */
  const form = $('[data-contact-form]');

  if (form) {
    const say = (text) => $$('[data-status]', form).forEach((el) => (el.textContent = text));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) return;

      say('Sending');
      setTimeout(() => {
        say('On its way');
        form.reset();
      }, 900);
    });
  }
})();
