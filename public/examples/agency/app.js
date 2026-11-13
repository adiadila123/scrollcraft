/* Halden Studio: a case study built with GSAP. Every scroll effect is created inside gsap.matchMedia, so with
   reduced motion none of it exists: the page is a plain document, with the line drawn, every stop lit and the ferry
   already at the islands. */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);
const html = document.documentElement;
html.classList.add('js');
/* reduced motion is respected, unless the page was opened with ?motion=on: the tutorial adds it when the reader
   has turned animations on although their device asks for less motion */
const motionOn = new URLSearchParams(location.search).get('motion') === 'on';
if (motionOn) html.classList.add('motion-on');

const mm = gsap.matchMedia();
mm.add(motionOn ? 'all' : '(prefers-reduced-motion: no-preference)', (ctx) => {
  /* the layout for motion: pinned sections and a sideways strip (see .animated in style.css) */
  html.classList.add('animated');

  /* 0. reading progress, along the top edge */
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  /* 1. headline: split into its real lines once the fonts are in, each rising out of a mask; then the horizon line
     is drawn under it, and as you leave the hero the title lifts away faster than the page */
  document.fonts.ready.then(
    ctx.add(() => {
      SplitText.create('.hero .title', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: 'power3.out', stagger: 0.1 }),
      });
      ScrollTrigger.refresh();
    }),
  );
  gsap.from('.hero .kicker, .hero .meta', { opacity: 0, y: 16, duration: 0.9, ease: 'power3.out', delay: 0.5, stagger: 0.1 });
  gsap.from('.horizon path', { drawSVG: '0%', duration: 1.6, ease: 'power2.inOut', delay: 0.6 });
  gsap.to('.hero .title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* 2. process: pinned for twice its height; each step leaves before the next arrives, and the large outlined
     number rolls to the next one in the same timeline */
  const steps = gsap.utils.toArray('.step');
  gsap.set(steps.slice(1), { autoAlpha: 0, y: 30 });
  const process = gsap.timeline({
    scrollTrigger: { trigger: '.process', start: 'top top', end: '+=200%', pin: true, scrub: 0.5 },
  });
  steps.slice(1).forEach((step, i) =>
    process
      .to(steps[i], { autoAlpha: 0, y: -30 })
      .to('.big-num span', { yPercent: -100 * (i + 1), ease: 'power2.inOut' }, '<')
      .to(step, { autoAlpha: 1, y: 0 }),
  );
  process.to('.process-bar i', { scaleX: 1, ease: 'none', duration: process.duration() }, 0);

  /* 3. route: the line is drawn by the scroll, the ferry rides its tip, and a stop lights up when the drawn length
     passes it. One timeline owns all three, so they cannot drift apart */
  const line = document.querySelector('.route-line');
  const length = line.getTotalLength();
  const stops = gsap.utils.toArray('.stop');
  const labels = gsap.utils.toArray('.stops li');
  /* where along the line each stop sits, as a fraction of its length */
  const at = stops.map((s) => {
    const x = +s.getAttribute('cx');
    const y = +s.getAttribute('cy');
    let best = 0;
    let min = Infinity;
    for (let i = 0; i <= 200; i++) {
      const p = line.getPointAtLength((i / 200) * length);
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < min) [min, best] = [d, i / 200];
    }
    return best;
  });
  const light = (progress) =>
    at.forEach((f, i) => {
      const on = progress >= f - 0.01;
      stops[i].classList.toggle('on', on);
      labels[i].classList.toggle('on', on);
    });
  light(0);
  const voyage = gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: { trigger: '.route', start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: (self) => light(self.progress) },
  });
  voyage
    .fromTo('.route-line', { drawSVG: '0%' }, { drawSVG: '100%' }, 0)
    .fromTo('.route-wake', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%' }, 0)
    .to('.boat', { motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5], autoRotate: true } }, 0)
    /* the lighthouse beam sweeps once as the ferry passes it */
    .fromTo('.beam', { rotation: -30, svgOrigin: '166 119' }, { rotation: 40, svgOrigin: '166 119' }, 0.15);

  /* 4. work: the strip moves left by exactly its overflow while the section is pinned; it leans a little with the
     speed of the scroll, and each artwork drifts inside its frame */
  const track = document.querySelector('.work-track');
  const pin = document.querySelector('.work-pin');
  const overflow = () => Math.max(0, track.scrollWidth - pin.clientWidth + parseFloat(getComputedStyle(pin).paddingLeft));
  const strip = gsap.to(track, {
    x: () => -overflow(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.work',
      start: 'top top',
      end: () => `+=${overflow()}`,
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => lean(gsap.utils.clamp(-6, 6, self.getVelocity() / -300)),
      onToggle: () => lean(0),
    },
  });
  const lean = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
  gsap.utils.toArray('.work .art').forEach((art) =>
    gsap.fromTo(
      art,
      { '--drift': '6%' },
      {
        '--drift': '-6%',
        ease: 'none',
        scrollTrigger: { trigger: art, containerAnimation: strip, start: 'left right', end: 'right left', scrub: true },
      },
    ),
  );

  /* 5. contact: the line is drawn once more, under the question */
  gsap.from('.underline path', {
    drawSVG: '0%',
    duration: 1.2,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: '.contact', start: 'top 70%' },
  });

  /* letterbox while the route holds the screen */
  ScrollTrigger.create({ trigger: '.route', start: 'top top', end: 'bottom bottom', toggleClass: { targets: html, className: 'film' } });

  /* a fine pointer leans the hero: the title and its line move a little against it, at two depths */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const titleX = gsap.quickTo('.hero .title', 'x', { duration: 1.2, ease: 'power3.out' });
  const lineX = gsap.quickTo('.horizon', 'x', { duration: 1.2, ease: 'power3.out' });
  const onMove = (e) => {
    const x = (e.clientX / innerWidth) * 2 - 1;
    titleX(x * -10);
    lineX(x * -26);
  };
  if (fine) addEventListener('pointermove', onMove, { passive: true });

  /* 6. the closing sections: each piece rises into place as it arrives, in small groups */
  ScrollTrigger.batch('.rise', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 34, duration: 0.9, ease: 'power3.out', stagger: 0.08 }),
  });

  /* undone when motion is turned off: back to the plain layout */
  return () => {
    removeEventListener('pointermove', onMove);
    html.classList.remove('animated', 'film');
    stops.concat(labels).forEach((el) => el.classList.remove('on'));
  };
});

/* ---- the scroll kit, the same in all five projects: navigation that follows the reader, reveals, a zoom that
   follows the scroll, a snapping carousel with buttons, and a list that loads more as you reach it ---- */
(() => {
  const root = document.documentElement;
  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !root.classList.contains('motion-on');

  /* scroll-linked navigation: the link to the section in view is marked as the current location */
  const links = [...document.querySelectorAll('header nav a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = `#${e.target.id}`;
        links.forEach((a) => (a.getAttribute('href') === id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
      }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  targets.forEach((t) => spy.observe(t));

  /* reveal on scroll: pieces marked .kit-reveal fade and rise once, as they enter */
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('kit-in');
        reveal.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.kit-reveal').forEach((el) => reveal.observe(el));

  /* zoom on scroll: the picture inside .kit-zoom starts larger and settles to its frame as the frame crosses the screen */
  const zooms = [...document.querySelectorAll('.kit-zoom')];
  let queued = false;
  function zoom() {
    queued = false;
    zooms.forEach((z) => {
      const r = z.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      z.style.setProperty('--zoom', calm() ? '1' : (1.28 - p * 0.28).toFixed(3));
    });
  }
  if (zooms.length) {
    addEventListener(
      'scroll',
      () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(zoom);
        }
      },
      { passive: true },
    );
    zoom();
  }

  /* snapping carousel: the track snaps by itself; the buttons move it one card at a time */
  document.querySelectorAll('.kit-carousel').forEach((c) => {
    const track = c.querySelector('.kit-track');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width ?? 300) + 16;
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: calm() ? 'auto' : 'smooth' });
    c.querySelector('[data-dir="-1"]')?.addEventListener('click', () => go(-1));
    c.querySelector('[data-dir="1"]')?.addEventListener('click', () => go(1));
  });

  /* infinite scroll: when the end of a .kit-feed comes near, the next items are copied in from its template;
     the button does the same for keyboards, and the status line says when there is nothing more */
  document.querySelectorAll('.kit-feed').forEach((feed) => {
    const list = feed.querySelector('.kit-list');
    const pool = [...feed.querySelector('template').content.children];
    const more = feed.querySelector('.kit-more');
    const status = feed.querySelector('.kit-status');
    const load = () => {
      const next = pool.splice(0, 3);
      next.forEach((el) => list.append(el.cloneNode(true)));
      status.textContent = pool.length ? `${list.children.length} shown` : 'That is everything.';
      if (!pool.length) {
        more.hidden = true;
        watch.disconnect();
        return;
      }
      /* observe again: if the end is still in reach after the new items, this loads the next ones too */
      watch.unobserve(end);
      watch.observe(end);
    };
    const watch = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && load(), { rootMargin: '0px 0px 200px 0px' });
    const end = feed.querySelector('.kit-end');
    watch.observe(end);
    more.addEventListener('click', load);
  });
})();
