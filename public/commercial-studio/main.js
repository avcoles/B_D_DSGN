/* ==========================================================================
   Commercial Studio — rebuild behavior
   GSAP + ScrollTrigger + Draggable/Inertia, Lenis for scroll.
   ========================================================================== */
(function () {
  'use strict';

  // GSAP drives every reveal, parallax and slider here, but the markup and the
  // generated lists have to stand up without it. Treat a missing library the
  // same way as prefers-reduced-motion: build everything, animate nothing.
  var motion = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Draggable) gsap.registerPlugin(Draggable);
    if (window.InertiaPlugin) gsap.registerPlugin(InertiaPlugin);
    gsap.defaults({ ease: 'power3.out' });
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reduced = !motion || prefersReduced;

  /* ---------------------------------------------------------------- data */

  var PROCESS = [
    ['01', 'Briefing', 'We pin down what the project has to achieve and what it has to earn, then write a brief the business can stand behind.'],
    ['02', 'Concept', 'We turn that into a spatial idea and push it against the brand, the experience and what can realistically be built.'],
    ['03', 'Scheme', 'We grow the concept into coordinated layouts and systems, and lock the decisions that drive programme and cost.'],
    ['04', 'Detail', 'We resolve interfaces, materials and methods into a buildable pack before anyone breaks ground.'],
    ['05', 'Documentation', 'We write the documents contractors need to price the job accurately and on the same basis as each other.'],
    ['06', 'Tender', 'We run the tender, read the returns, and help you appoint the contractor that fits.'],
    ['07', 'On site', 'We stay close to the build, answer queries fast, and protect the design intent while it gets made.'],
    ['08', 'Rollout pack', 'We codify the design into a package that repeats across sites without thinning out.'],
    ['09', 'Review', 'We measure the finished space against what it set out to do and carry the findings into the next one.']
  ];

  var TESTIMONIALS = [
    ['A. Reyes', 'Regional Director, Northbrook Retail', 'They found the problems we had been quietly working around for years, and then designed them out.'],
    ['M. Hollis', 'Harper & Vale', 'Working with Commercial Studio was easy in a way that surprised us. Strong design, a tight scope, and delivered when they said it would be.'],
    ['J. Lindqvist', 'Northline Group', 'I would recommend them without hesitating. They matter to how our business runs now, and they are already on the next round of sites.'],
    ['R. Osei', 'Verdant Health Products', 'Rigorous, and they can read a P&L. The finished space does exactly what we needed it to do.'],
    ['C. Marchetti', 'Meridian Leisure Group', 'A difficult brief handled with real clarity. The result speaks for itself.']
  ];

  // Eight marks across two walls; the second wall repeats four of them,
  // which is how the source fills a six-tile grid from a short client list.
  var LOGOS = {
    a: [1, 2, 3, 4, 5, 6],
    b: [7, 8, 3, 1, 6, 2]
  };

  /* --------------------------------------------------------- build lists */

  function buildProcess() {
    var track = document.querySelector('[data-slider-track]');
    if (!track) return;
    track.innerHTML = PROCESS.map(function (p, i) {
      return '' +
        '<div class="process_slider_item" data-slide>' +
          '<div class="process_slider_content">' +
            '<span class="process_slider_number trim">' + p[0] + '</span>' +
            '<h3 class="process_slider_title u-text-h5 trim">' + p[1] + '</h3>' +
            '<div class="process_slider_text u-text-main u-color-faded trim">' + p[2] + '</div>' +
            '<a class="button_text_link" href="#services">Detail' +
              '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
                '<path d="M2.9 2.64h6.2v6.2" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke"/>' +
                '<path d="M9.1 2.64L2.9 8.84" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke"/>' +
              '</svg>' +
            '</a>' +
          '</div>' +
          '<div class="process_slider_visual">' +
            '<div class="u-image-wrapper is-wide-3-2">' +
              '<img class="u-image" src="./assets/process-0' + (i + 1) + '.avif" alt="" loading="lazy">' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  function buildLogoWalls() {
    document.querySelectorAll('[data-logo-wall]').forEach(function (wall) {
      var set = LOGOS[wall.getAttribute('data-logo-set')] || LOGOS.a;
      wall.innerHTML = set.map(function (n) {
        var id = ('0' + n).slice(-2);
        return '' +
          '<div class="logo-wall_item">' +
            '<div class="logo-wall_logo">' +
              '<div class="logo-wall_target" data-logo-target>' +
                '<img src="./assets/logo-' + id + '.svg" alt="" loading="lazy">' +
              '</div>' +
            '</div>' +
          '</div>';
      }).join('');
    });
  }

  function buildTestimonials() {
    var meta = document.querySelector('[data-testimonial-meta]');
    var quotes = document.querySelector('[data-testimonial-quotes]');
    if (!meta || !quotes) return;
    meta.innerHTML = TESTIMONIALS.map(function (t, i) {
      return '<div class="testimonial-slider_meta_item' + (i === 0 ? ' is-active' : '') + '">' +
        '<p class="testimonial-slider_text u-text-h5 trim">' + t[0] + '</p>' +
        '<p class="testimonial-slider_text u-text-main u-color-faded trim">' + t[1] + '</p>' +
        '</div>';
    }).join('');
    quotes.innerHTML = TESTIMONIALS.map(function (t, i) {
      return '<div class="testimonial-slider_item' + (i === 0 ? ' is-active' : '') + '">' +
        '<div class="testimonial-slider_quote-marks">' +
          '<svg viewBox="0 0 28 27" fill="currentColor" aria-hidden="true">' +
            '<path d="M0 27V15.4C0 6.9 4.2 1.4 12.6 0l1.2 3.7c-4.9 1.2-7.3 3.9-7.3 8h5.9V27H0zm15.2 0V15.4C15.2 6.9 19.4 1.4 27.8 0L29 3.7c-4.9 1.2-7.3 3.9-7.3 8h5.9V27h-12.4z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="testimonial-slider_quote u-text-h2 trim">' + t[2] + '</div>' +
        '</div>';
    }).join('');
  }

  /* ------------------------------------------------------ smooth scroll */

  // How much of the distance is carried over rather than travelled this frame.
  // 0 is native scrolling, 1 never arrives. 0.9 is Lenis' own default and the
  // editorial end of the useful range; drop toward 0.8 for a tighter response.
  var SMOOTHING = 0.9;

  var lenis = null;

  function initLenis() {
    if (prefersReduced) return;

    if (motion && typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 1 - SMOOTHING, wheelMultiplier: 1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('[data-lenis-prevent]').forEach(function (el) {
        el.addEventListener('wheel', function (e) { e.stopPropagation(); });
      });
      return;
    }

    initSmoothScroll();
  }

  // Same idea as Lenis without the dependency: hold the scroll position the
  // wheel is asking for, and ease the real one toward it every frame.
  function initSmoothScroll() {
    // Touch already has momentum of its own; hijacking it makes things worse.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var lerp = 1 - SMOOTHING;
    var target = window.scrollY;
    var current = target;
    var ticking = false;
    var paused = false;

    function limit() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function frame() {
      current += (target - current) * lerp;
      if (Math.abs(target - current) < 0.3) {
        current = target;
        ticking = false;
      }
      window.scrollTo(0, current);
      if (ticking) requestAnimationFrame(frame);
    }

    function run() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener('wheel', function (e) {
      if (paused || e.ctrlKey) return;
      if (e.target.closest && e.target.closest('[data-lenis-prevent]')) return;
      e.preventDefault();
      target = Math.min(limit(), Math.max(0, target + e.deltaY));
      run();
    }, { passive: false });

    // Anything that moves the page by other means (anchor jump, scrollbar drag,
    // a keyboard page-down) has to become the new target, or the next wheel
    // tick would snap the page back to where the easing left off.
    window.addEventListener('scroll', function () {
      if (ticking) return;
      target = current = window.scrollY;
    }, { passive: true });

    window.addEventListener('resize', function () {
      target = Math.min(target, limit());
    });

    // The nav and the process slider expect to be able to freeze the page.
    lenis = {
      stop: function () { paused = true; },
      start: function () { paused = false; target = current = window.scrollY; }
    };
  }

  /* ------------------------------------------------- split-text reveals */

  // Wrap each word in a clipping span so it can be masked on reveal.
  // Words stay inline-block, so wrapping and any inline siblings (the
  // bracketed section labels) behave exactly as they do unsplit.
  function splitIntoWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (chunk) {
        if (chunk === '') return;
        if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
        var mask = document.createElement('span');
        mask.className = 'split-word';
        var inner = document.createElement('span');
        inner.className = 'split-inner';
        inner.textContent = chunk;
        mask.appendChild(inner);
        frag.appendChild(mask);
      });
      el.replaceChild(frag, node);
    });
    return el.querySelectorAll('.split-inner');
  }

  function initSplitHeadings() {
    document.querySelectorAll('[data-split-heading]').forEach(function (el) {
      // Without the reveal there is nothing to hide, so leave the heading whole
      // rather than wrapping it in boxes that would clip its descenders.
      if (reduced) return;

      var inners = splitIntoWords(el);
      var masks = el.querySelectorAll('.split-word');
      function mask(on) {
        masks.forEach(function (m) { m.classList.toggle('is-masked', on); });
      }

      mask(true);
      gsap.set(inners, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(inners, {
            yPercent: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.018,
            onComplete: function () { mask(false); }
          });
        }
      });
    });
  }

  // Line-by-line reveal for the section headings that carry a bracketed label.
  // Deliberately independent of GSAP: a transform and a transition per word is
  // all it needs, and it should not go dark when the vendor bundle is absent.
  function initLineHeadings() {
    var targets = document.querySelectorAll('[data-split-lines]');
    var regroup = [];

    targets.forEach(function (el) {
      splitIntoWords(el);
      var words = Array.prototype.slice.call(el.querySelectorAll('.split-word'));
      if (!words.length) return;

      // Words that share a top edge share a line. vertical-align:top keeps the
      // boxes flush, so a few pixels of tolerance is plenty.
      function group() {
        var top = null, line = -1;
        words.forEach(function (w) {
          if (top === null || Math.abs(w.offsetTop - top) > 4) {
            line += 1;
            top = w.offsetTop;
          }
          w.firstChild.style.setProperty('--line', line);
        });
        return line;
      }

      if (prefersReduced) { el.classList.add('is-revealed'); return; }

      words.forEach(function (w) { w.classList.add('is-masked'); });
      group();
      regroup.push(function () {
        if (!el.classList.contains('is-revealed')) group();
      });

      function unmask() {
        words.forEach(function (w) { w.classList.remove('is-masked'); });
      }

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var lines = group();
        el.classList.add('is-revealed');
        // Drop the masks once the last line has landed, otherwise the clip
        // would keep shaving descenders for the rest of the session.
        var last = words[words.length - 1].firstChild;
        // Belt and braces: transitionend can be missed, and a stuck mask would
        // shave descenders for the rest of the session. Mirrors the CSS timing.
        last.addEventListener('transitionend', unmask, { once: true });
        setTimeout(unmask, 1500 + lines * 160 + 250);
      }, { rootMargin: '0px 0px -15% 0px' });

      io.observe(el);
    });

    if (!regroup.length) return;
    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        regroup.forEach(function (fn) { fn(); });
      }, 150);
    });
  }

  function initFades() {
    var targets = document.querySelectorAll('[data-fade-in],[data-reveal]');
    targets.forEach(function (el) {
      if (reduced) { el.style.opacity = 1; return; }
      gsap.set(el, { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        }
      });
    });
  }

  /* ------------------------------------------------------------ parallax */

  function initParallax() {
    if (reduced) return;

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var start = parseFloat(el.getAttribute('data-parallax-start') || '-20');
      var end = parseFloat(el.getAttribute('data-parallax-end') || '20');
      var scrub = parseFloat(el.getAttribute('data-parallax-scrub') || '1');
      var trigger = el.closest('section') || el;
      gsap.fromTo(el,
        { yPercent: start },
        {
          yPercent: end,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: scrub
          }
        }
      );
    });

    // Hero visual drifts slower than the page.
    var heroWrap = document.querySelector('[data-parallax-hero]');
    if (heroWrap) {
      gsap.to(heroWrap.querySelectorAll('.hero_home_visual'), {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroWrap.closest('section'),
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Logo wall targets rise slightly through their tile.
    document.querySelectorAll('[data-logo-target]').forEach(function (el, i) {
      gsap.fromTo(el,
        { yPercent: 18 },
        {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.logo-wall_item'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1 + (i % 3) * 0.4
          }
        }
      );
    });
  }

  /* ------------------------------------------------- hero image swapping */

  function initHeroHover() {
    var section = document.querySelector('.hero_home_wrap');
    if (!section) return;
    var images = section.querySelectorAll('[data-hero-image]');
    var links = section.querySelectorAll('[data-hero-target]');

    function show(key) {
      images.forEach(function (img) {
        img.classList.toggle('is-active', img.getAttribute('data-hero-image') === key);
      });
    }

    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        section.setAttribute('data-hero-hover', '');
        link.classList.add('is-active');
        show(link.getAttribute('data-hero-target'));
      });
      link.addEventListener('mouseleave', function () {
        section.removeAttribute('data-hero-hover');
        link.classList.remove('is-active');
        show('default');
      });
    });
  }

  /* -------------------------------------------- featured image swapping */

  function initFeaturedHover() {
    var section = document.querySelector('[data-featured]');
    if (!section) return;
    var items = section.querySelectorAll('[data-featured-trigger]');
    var images = section.querySelectorAll('[data-featured-image]');

    function show(key) {
      images.forEach(function (img) {
        img.classList.toggle('is-active', img.getAttribute('data-featured-image') === key);
      });
    }

    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        section.setAttribute('data-featured-hover', '');
        item.classList.add('is-active');
        show(item.getAttribute('data-featured-trigger'));
      });
      item.addEventListener('mouseleave', function () {
        section.removeAttribute('data-featured-hover');
        item.classList.remove('is-active');
        show('default');
      });
    });
  }

  /* ----------------------------------------------- footer image swapping */

  function initFooterHover() {
    var section = document.querySelector('.footer_wrap');
    if (!section) return;
    var items = section.querySelectorAll('.footer_bg_item');
    var triggers = section.querySelectorAll('[data-footer-hover-trigger]');

    // No key means no backdrop: the footer rests on the page colour and only
    // takes a city while one of the addresses is under the cursor.
    function show(key) {
      items.forEach(function (item) {
        item.classList.toggle('is-active', item.getAttribute('data-footer-image') === key);
      });
    }

    triggers.forEach(function (t) {
      t.addEventListener('mouseenter', function () {
        section.setAttribute('data-footer-hover', 'on');
        t.style.opacity = '1';
        show(t.getAttribute('data-footer-hover-trigger'));
      });
      t.addEventListener('mouseleave', function () {
        section.setAttribute('data-footer-hover', 'off');
        t.style.opacity = '';
        show(null);
      });
    });
  }

  /* ------------------------------------------------------- process slider */

  function initProcessSlider() {
    var wrap = document.querySelector('[data-slider]');
    var track = document.querySelector('[data-slider-track]');
    if (!wrap || !track || !window.Draggable) return;

    function bounds() {
      var max = 0;
      var min = Math.min(0, wrap.clientWidth - track.scrollWidth);
      return { minX: min, maxX: max };
    }

    Draggable.create(track, {
      type: 'x',
      inertia: !!window.InertiaPlugin,
      edgeResistance: 0.9,
      bounds: bounds(),
      onPress: function () { wrap.classList.add('is-dragging'); },
      onRelease: function () { wrap.classList.remove('is-dragging'); },
      onDragStart: function () { if (lenis) lenis.stop(); },
      onDragEnd: function () { if (lenis) lenis.start(); }
    });

    window.addEventListener('resize', function () {
      var d = Draggable.get(track);
      if (d) { d.applyBounds(bounds()); }
    });
  }

  /* --------------------------------------------------- testimonial slider */

  function initTestimonialSlider() {
    var root = document.querySelector('[data-testimonial]');
    if (!root) return;
    var metas = root.querySelectorAll('.testimonial-slider_meta_item');
    var quotes = root.querySelectorAll('.testimonial-slider_item');
    var index = 0;

    function go(next) {
      index = (next + quotes.length) % quotes.length;
      metas.forEach(function (m, i) { m.classList.toggle('is-active', i === index); });
      quotes.forEach(function (q, i) { q.classList.toggle('is-active', i === index); });
      if (motion) ScrollTrigger.refresh();
    }

    var prev = root.querySelector('[data-testimonial-prev]');
    var next = root.querySelector('[data-testimonial-next]');
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
  }

  /* --------------------------------------------------------- gallery */

  function initGallery() {
    var root = document.querySelector('[data-slideshow]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-thumb]'));
    var index = 0;
    var busy = false;

    function paint(i) {
      slides.forEach(function (s, n) { s.classList.toggle('is-current', n === i); });
      thumbs.forEach(function (t, n) { t.classList.toggle('is-current', n === i); });
    }

    // Sweep duration is read off the stylesheet so the token stays the source
    // of truth for both the GSAP and the CSS path.
    var SWEEP = (parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--dur-double')) || 1.2) * 1000;

    function sweepWithGsap(leaving, leavingImg, arrivingImg, dir, done) {
      gsap.timeline({
        defaults: { duration: SWEEP / 1000, ease: 'expo.out' },
        onComplete: function () { gsap.set([leaving, leavingImg], { xPercent: 0 }); done(); }
      })
        .fromTo(leaving, { xPercent: 0 }, { xPercent: -100 * dir }, 0)
        .fromTo(leavingImg, { xPercent: 0 }, { xPercent: 28 * dir }, 0)
        .fromTo(arrivingImg, { xPercent: 14 * dir }, { xPercent: 0 }, 0);
    }

    // Same three-layer move in plain CSS, for when the motion libraries are not
    // on the page. Start frame is written first and committed with a reflow so
    // the transition has something to run from.
    function sweepWithCss(leaving, leavingImg, arrivingImg, dir, done) {
      var arriving = arrivingImg.parentNode;
      leaving.style.transform = 'translateX(0)';
      leavingImg.style.transform = 'translateX(0)';
      arrivingImg.style.transform = 'translateX(' + (14 * dir) + '%)';
      void leaving.offsetWidth;
      leaving.classList.add('is-sweeping');
      arriving.classList.add('is-sweeping');
      leaving.style.transform = 'translateX(' + (-100 * dir) + '%)';
      leavingImg.style.transform = 'translateX(' + (28 * dir) + '%)';
      arrivingImg.style.transform = 'translateX(0)';
      setTimeout(function () {
        leaving.classList.remove('is-sweeping');
        arriving.classList.remove('is-sweeping');
        leaving.style.transform = '';
        leavingImg.style.transform = '';
        arrivingImg.style.transform = '';
        done();
      }, SWEEP);
    }

    // The outgoing slide sweeps off and uncovers the next one, which is already
    // sitting in place underneath. Three layers move at once so the sweep reads
    // as depth rather than a panel on a track: the leaving frame travels the
    // full width, its own image lags inside that frame, and the revealed image
    // drifts a little the same way, slowest of the three.
    function go(next) {
      var to = (next + slides.length) % slides.length;
      if (to === index || busy) return;

      // Gate on the user's own preference, not on `reduced` — that also covers
      // a missing GSAP, and this transition has a library-free path.
      if (prefersReduced) { index = to; paint(to); return; }

      var dir = to > index ? 1 : -1;          // forward exits left, back exits right
      var leaving = slides[index];
      var leavingImg = leaving.querySelector('.gallery_slide_img');
      var arrivingImg = slides[to].querySelector('.gallery_slide_img');

      busy = true;
      leaving.classList.add('is-leaving');    // rides above the slide being revealed
      paint(to);
      index = to;

      function done() { leaving.classList.remove('is-leaving'); busy = false; }
      (motion ? sweepWithGsap : sweepWithCss)(leaving, leavingImg, arrivingImg, dir, done);
    }

    thumbs.forEach(function (t) {
      t.addEventListener('click', function () { go(parseInt(t.getAttribute('data-index'), 10)); });
    });

    // Drag left/right to page through.
    var startX = null;
    root.addEventListener('pointerdown', function (e) {
      startX = e.clientX; root.classList.add('is-dragging');
    });
    root.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
      startX = null; root.classList.remove('is-dragging');
    });
    root.addEventListener('pointerleave', function () {
      startX = null; root.classList.remove('is-dragging');
    });

    // The source drifts the slide image inside its frame as the section passes.
    if (!reduced) {
      gsap.to(root.querySelectorAll('.gallery_slide_img'), {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  }

  /* -------------------------------------------------------------- nav */

  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;
    var toggle = nav.querySelector('[data-nav-toggle="toggle"]');
    var closer = nav.querySelector('[data-nav-toggle="close"]');

    function setState(active) {
      nav.setAttribute('data-nav-status', active ? 'active' : 'not-active');
      if (toggle) toggle.setAttribute('aria-expanded', String(active));
      if (lenis) { active ? lenis.stop() : lenis.start(); }
    }

    if (toggle) toggle.addEventListener('click', function () {
      setState(nav.getAttribute('data-nav-status') !== 'active');
    });
    if (closer) closer.addEventListener('click', function () { setState(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setState(false);
    });

    // Nav colour follows the section under it.
    if (!motion) return;
    document.querySelectorAll('[data-nav-theme-to]').forEach(function (section) {
      var theme = section.getAttribute('data-nav-theme-to');
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom-=88',
        end: 'bottom bottom-=88',
        onToggle: function (self) { if (self.isActive) nav.setAttribute('data-theme-nav', theme); }
      });
    });
  }

  /* -------------------------------------------------------------- init */

  function init() {
    document.documentElement.classList.add('js-ready');
    var yr = document.querySelector('[data-current-year]');
    if (yr) yr.textContent = new Date().getFullYear();

    buildProcess();
    buildLogoWalls();
    buildTestimonials();

    initLenis();
    initSplitHeadings();
    initLineHeadings();
    initFades();
    initParallax();
    initHeroHover();
    initFeaturedHover();
    initFooterHover();
    initProcessSlider();
    initTestimonialSlider();
    initGallery();
    initNav();

    if (motion) ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', function () { if (motion) ScrollTrigger.refresh(); });
})();
