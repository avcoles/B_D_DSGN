/* Run Club — rebuild behaviour.

   Four things, none of them a framework:
   the header's two states, the three overlays, the colour swatches,
   and a reveal pass for the media. */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var header = doc.getElementById('site-header');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header --------------------------------------------
     Two independent states. `--solid` is the white plate, which is on
     whenever the page has scrolled at all. `--inverted` is white type,
     which is on while a section marked data-invert is behind the bar.
     Keying the second off the sections rather than off a scroll
     threshold means reordering the page cannot desynchronise it. */
  var inverts = [].slice.call(doc.querySelectorAll('[data-invert]'));

  function syncHeader() {
    if (!header) return;
    var probe = header.querySelector('.site-header__bg').offsetHeight / 2;

    var onDark = inverts.some(function (el) {
      var r = el.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });

    header.classList.toggle('--inverted', onDark);
    // The plate exists to give black type something to sit on. Over a
    // dark section the type is already white, so the plate would only
    // erase it — the two states are mutually exclusive, not additive.
    header.classList.toggle('--solid', scrollY > 4 && !onDark);
  }

  addEventListener('scroll', syncHeader, { passive: true });
  addEventListener('resize', syncHeader);
  syncHeader();

  /* ---- Overlays ------------------------------------------
     Search, mobile nav and cart are the same mechanism: flip
     aria-hidden and inert together so the state the screen reader sees
     and the state the keyboard sees can never disagree. */
  function setOpen(el, open) {
    if (!el) return;
    el.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) el.removeAttribute('inert'); else el.setAttribute('inert', '');
  }

  function bindToggle(btnSelector, panelId, bodyClass) {
    var btns = [].slice.call(doc.querySelectorAll(btnSelector));
    var panel = doc.getElementById(panelId);
    if (!btns.length || !panel) return null;

    var api = {
      panel: panel,
      close: function () {
        setOpen(panel, false);
        btns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
        if (bodyClass) body.classList.remove(bodyClass);
      },
      toggle: function () {
        var open = panel.getAttribute('aria-hidden') === 'true';
        closeAll(api);
        setOpen(panel, open);
        btns.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
        if (bodyClass) body.classList.toggle(bodyClass, open);
      }
    };

    btns.forEach(function (b) { b.addEventListener('click', api.toggle); });
    return api;
  }

  var panels = [];
  function closeAll(except) {
    panels.forEach(function (p) { if (p && p !== except) p.close(); });
  }

  panels.push(bindToggle('.site-header__searchBtn', 'searchbar', null));
  panels.push(bindToggle('.site-header__burger', 'site-nav', '--nav-open'));
  panels.push(bindToggle('.site-header__cartBtn', 'site-cart', '--locked'));

  var cart = doc.getElementById('site-cart');
  if (cart) {
    // Backdrop and Close both dismiss; clicks inside the panel do not.
    cart.addEventListener('click', function (e) {
      if (e.target === cart || e.target.closest('.site-cart__close')) closeAll(null);
    });
  }

  // Any in-page link is a navigation, so the overlay it was clicked
  // from should not survive it.
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) closeAll(null);
  });

  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });

  /* ---- Colour swatches -----------------------------------
     The marker under the row is one pseudo-element positioned from
     --active-index, so selecting a swatch is a single custom-property
     write and the slide is the browser's. */
  doc.querySelectorAll('.product-preview__colors').forEach(function (list) {
    var swatches = [].slice.call(list.querySelectorAll('.product-preview__color'));
    swatches.forEach(function (btn, i) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        list.style.setProperty('--active-index', i);
        swatches.forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); });
      });
    });
  });

  /* ---- Reveals -------------------------------------------
     Media scales back to rest as it enters the viewport. It runs once
     per figure and the observer releases it, so a long scroll does not
     accumulate work. */
  if (!reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    doc.querySelectorAll('.row-promo__promoMedia, .row-textmedia__leftMedia, .row-textmedia__rightMedia')
      .forEach(function (el) {
        el.classList.add('will-reveal');
        io.observe(el);
      });
  }
})();
