/* ============================================================
   Ensemble - behaviour
   Lenis smooth scroll, staggered reveals, custom cursor,
   clip-path menu, theme dots.
   ============================================================ */

const EASE = (t) => 1 - Math.pow(1 - t, 3);          // approx cubic-out
const html = document.documentElement;

/* ------------------------------------------------------------
   1. Lenis smooth scroll
   The source page carries class="lenis" on <html>, so scroll
   position is driven by a rAF loop rather than native scrolling.
------------------------------------------------------------ */
let lenis = null;
function initLenis() {
  if (typeof Lenis === "undefined") return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  html.classList.add("lenis", "lenis-smooth");
}

/* ------------------------------------------------------------
   2. Preloader
   Six images cycle while a 0->100 counter runs; the wordmark
   letters then rise into place and the whole panel wipes up.
------------------------------------------------------------ */
function initPreloader() {
  const pre = document.getElementById("preloader");
  if (!pre) return finishIntro();

  const imgs = [...document.querySelectorAll("#preloader-images img")];
  const countEl = document.querySelector("#preloader-count span");
  const paths = [...document.querySelectorAll("#preloader-mark .ltr")];

  document.body.style.overflow = "hidden";
  if (lenis) lenis.stop();

  let i = 0;
  const cycle = setInterval(() => {
    imgs.forEach((im) => im.classList.remove("active"));
    imgs[i % imgs.length].classList.add("active");
    i++;
  }, 110);

  const DURATION = 2000;
  const start = performance.now();

  function tick(now) {
    const p = Math.min(1, (now - start) / DURATION);
    const v = Math.round(EASE(p) * 100);
    if (countEl) countEl.textContent = String(v);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      clearInterval(cycle);
      imgs.forEach((im) => im.classList.remove("active"));
      revealWordmark(paths, () => {
        // wipe the preloader away
        pre.style.transition = "clip-path 1s cubic-bezier(0.83,0,0.17,1)";
        pre.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
        setTimeout(() => {
          pre.remove();
          document.body.style.overflow = "";
          if (lenis) lenis.start();
          html.classList.add("loaded");
          finishIntro();
        }, 900);
      });
    }
  }
  requestAnimationFrame(tick);
}

/* Letters of the wordmark rise in sequence. */
function revealWordmark(paths, done) {
  paths.forEach((path, idx) => {
    path.style.transition =
      "transform 0.9s cubic-bezier(0.22,1,0.36,1) " + idx * 0.045 + "s";
    path.style.transform = "translateY(0%)";
  });
  setTimeout(done, 900 + paths.length * 45);
}

/* ------------------------------------------------------------
   3. Hero entrance
   Wordmark letters rise, the 5px rule scales out from the left,
   then the copy blocks stagger up.
------------------------------------------------------------ */
function finishIntro() {
  const heroPaths = [...document.querySelectorAll("#hero-mark .ltr")];
  heroPaths.forEach((p, idx) => {
    p.style.transition =
      "transform 1s cubic-bezier(0.22,1,0.36,1) " + idx * 0.05 + "s";
    p.style.transform = "translateY(0%)";
  });

  const line = document.getElementById("hero-line");
  if (line) {
    line.style.transition =
      "transform 1.1s cubic-bezier(0.83,0,0.17,1) 0.35s";
    line.style.transform = "scaleX(1)";
  }

  document.querySelectorAll(".reveal-line > *").forEach((el, idx) => {
    el.style.transition =
      "transform 0.9s cubic-bezier(0.22,1,0.36,1) " + (0.55 + idx * 0.06) + "s";
    el.style.transform = "translateY(0%)";
  });
}

/* ------------------------------------------------------------
   4. Scroll reveals
   The source registers IntersectionObservers and flips an
   `is-inview` class, which is what the CSS transitions key off.
------------------------------------------------------------ */
function initInView() {
  const targets = document.querySelectorAll("[data-inview]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-inview"));
    return;
  }

  // Safety net: anything still hidden after this window is revealed
  // regardless, so content can never be stranded at opacity:0 (matters
  // for full-page screenshots, printing, and no-scroll viewports).
  const failsafe = setTimeout(() => {
    targets.forEach((t) => t.classList.add("is-inview"));
  }, 4000);
  window.addEventListener("beforeprint", () =>
    targets.forEach((t) => t.classList.add("is-inview"))
  );
  window.__revealAll = () => {
    clearTimeout(failsafe);
    targets.forEach((t) => t.classList.add("is-inview"));
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || "0");
        setTimeout(() => el.classList.add("is-inview"), delay * 1000);
        io.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

/* ------------------------------------------------------------
   5. Parallax on card imagery
   Source images carry will-change:transform and an inline
   translate that updates with scroll.
------------------------------------------------------------ */
function initParallax() {
  const items = [...document.querySelectorAll("[data-parallax]")];
  if (!items.length) return;

  let ticking = false;
  function update() {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      // -1 (below fold) .. 1 (above fold)
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2);
      const shift = progress * -6; // percent
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}%, 0) scale(1.12)`;
    });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

/* ------------------------------------------------------------
   6. Custom cursor
   A small red dot that follows with easing and swells into a
   "View" pill over elements marked data-cursor="text".
------------------------------------------------------------ */
function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  const dot = cursor.querySelector(".dot");
  html.classList.add("has-custom-cursor");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.opacity = "1";
  });
  document.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));

  function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('[data-cursor="text"]').forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("is-text");
      dot.textContent = "View";
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-text");
      dot.textContent = "";
    });
  });
}

/* ------------------------------------------------------------
   7. Theme switcher
   Three dots -> data-theme on <html>; the marker slides across.
------------------------------------------------------------ */
function initThemes() {
  document.querySelectorAll(".swatches").forEach((group) => {
    const marker = group.querySelector(".marker");
    const swatches = [...group.querySelectorAll(".swatch")];

    function place(el, animate = true) {
      if (!marker) return;
      marker.style.transition = animate
        ? "transform 0.4s cubic-bezier(0.22,1,0.36,1)"
        : "none";
      const gr = group.getBoundingClientRect();
      const sr = el.getBoundingClientRect();
      const x = sr.left - gr.left + sr.width / 2 - marker.offsetWidth / 2;
      const y = sr.top - gr.top + sr.height / 2 - marker.offsetHeight / 2;
      marker.style.transform = `translate(${x}px, ${y}px)`;
    }

    swatches.forEach((s) => {
      s.addEventListener("click", () => {
        html.setAttribute("data-theme", s.dataset.set);
        document.querySelectorAll(".swatches").forEach((g) => {
          const m = g.querySelector(".marker");
          const match = g.querySelector(`.swatch[data-set="${s.dataset.set}"]`);
          if (m && match) {
            const gr = g.getBoundingClientRect();
            const sr = match.getBoundingClientRect();
            m.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1)";
            m.style.transform = `translate(${sr.left - gr.left + sr.width / 2 - m.offsetWidth / 2}px, ${sr.top - gr.top + sr.height / 2 - m.offsetHeight / 2}px)`;
          }
        });
      });
    });

    const current = html.getAttribute("data-theme") || "red";
    const active = group.querySelector(`.swatch[data-set="${current}"]`);
    if (active) requestAnimationFrame(() => place(active, false));
    window.addEventListener("resize", () => {
      const a = group.querySelector(
        `.swatch[data-set="${html.getAttribute("data-theme")}"]`
      );
      if (a) place(a, false);
    });
  });
}

/* ------------------------------------------------------------
   8. Menu overlay — clip-path wipe from the top
------------------------------------------------------------ */
function initMenu() {
  const menu = document.getElementById("menu");
  const toggle = document.getElementById("menu-toggle");
  if (!menu || !toggle) return;
  let open = false;
  toggle.addEventListener("click", () => {
    open = !open;
    menu.classList.toggle("open", open);
    toggle.textContent = open ? "Close" : "Menu";
    if (lenis) open ? lenis.stop() : lenis.start();
  });
}

/* ------------------------------------------------------------
   Boot
------------------------------------------------------------ */
initLenis();
initCursor();
initThemes();
initMenu();
initInView();
initParallax();
window.addEventListener("load", initPreloader);
setTimeout(() => {
  if (document.getElementById("preloader")) initPreloader();
}, 3000);
