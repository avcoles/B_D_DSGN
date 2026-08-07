/* Studio Boutique — rebuild behaviour.
   Line reveals on scroll plus a header that hides on the way down. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-ready');

  if (!reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var lines = e.target.querySelectorAll('.line');
        lines.forEach(function (l, i) { l.style.transitionDelay = (i * 0.08) + 's'; });
        e.target.classList.add('is-revealed');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-revealed'); });
  }

  // Header retracts on scroll down, returns on scroll up. It also runs white
  // while the dark hero is what sits behind it: the old build keyed that off
  // fractions of innerHeight, which only held while the hero was offset down
  // the page. Now the hero is pinned full-bleed at the top, so the switch is
  // driven by where the overlaying sheet actually is.
  var header = document.querySelector('.header');
  var over = document.querySelector('.sections__over');
  var last = 0;
  addEventListener('scroll', function () {
    var y = scrollY;
    if (header) {
      header.style.transition = 'transform .5s var(--ease), color .3s';
      header.style.transform = (y > 140 && y > last) ? 'translateY(-105%)' : 'translateY(0)';
      // offsetHeight, not the live rect: the retract transform moves the rect
      // off-screen and would flip the test while the header is hidden.
      var onHero = over
        ? over.getBoundingClientRect().top > header.offsetHeight
        : y < innerHeight;
      header.style.color = onHero ? '#fff' : '#000';
    }
    last = y;
  }, { passive: true });

  dispatchEvent(new Event('scroll'));

  var top = document.querySelector('[data-back-to-top]');
  if (top) top.addEventListener('click', function () { scrollTo({ top: 0, behavior: 'smooth' }); });
})();
