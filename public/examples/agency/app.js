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

/* the sea chart: contour lines across the hero. One function draws a frame from the time, the tide (0 to 1, from the
   scroll) and the pointer; with reduced motion it draws once and holds */
const tideCanvas = document.querySelector('.tide');
const tctx = tideCanvas.getContext('2d');
const sea = { t: 0, tide: 0, px: -999, py: -999 };
function sizeTide() {
  const d = Math.min(devicePixelRatio || 1, 2);
  tideCanvas.width = tideCanvas.clientWidth * d;
  tideCanvas.height = tideCanvas.clientHeight * d;
}
function drawTide() {
  const w = tideCanvas.width;
  const h = tideCanvas.height;
  const d = w / tideCanvas.clientWidth;
  tctx.clearRect(0, 0, w, h);
  const LINES = 34;
  const lift = sea.tide * h * 0.35;
  for (let i = 0; i < LINES; i++) {
    const f = i / (LINES - 1);
    /* lines crowd towards the horizon and spread towards the viewer, like water seen at a low angle */
    const base = h * (0.18 + Math.pow(f, 1.6) * 0.86) - lift * (0.4 + f);
    const amp = (2 + f * 9 + sea.tide * 14) * d;
    tctx.beginPath();
    for (let x = 0; x <= w; x += 10 * d) {
      let y = base + Math.sin((x * 0.004) / d + sea.t * 0.6 + i * 0.4) * amp + Math.sin((x * 0.011) / d - sea.t * 0.35 + i) * amp * 0.35;
      /* the pointer lifts the water around it into a ring of swell */
      const dx = x - sea.px * d;
      const dy = base - sea.py * d;
      const r = Math.hypot(dx, dy) / d;
      if (r < 220) y -= Math.cos((r / 220) * Math.PI * 0.5) * 18 * d * Math.sin(r * 0.06 - sea.t * 3);
      if (x === 0) tctx.moveTo(x, y);
      else tctx.lineTo(x, y);
    }
    tctx.strokeStyle = `rgba(79, 209, 197, ${0.05 + f * 0.22})`;
    tctx.lineWidth = d * (0.6 + f * 0.8);
    tctx.stroke();
  }
}
sizeTide();
drawTide();
addEventListener('resize', () => {
  sizeTide();
  drawTide();
});

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
        type: 'lines,chars',
        mask: 'lines',
        charsClass: 'char',
        autoSplit: true,
        onSplit: (self) => {
          /* the masks only hold the lines for their entrance; after it the letters must be free to fly */
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.1,
            onComplete: () => gsap.set(self.masks, { overflow: 'visible' }),
          });
          /* as the hero leaves, the letters scatter like spray, each its own way; scrolling back gathers them */
          return gsap.to(self.chars, {
            yPercent: () => gsap.utils.random(-160, -40),
            xPercent: () => gsap.utils.random(-30, 30),
            rotation: () => gsap.utils.random(-25, 25),
            opacity: 0.25,
            ease: 'none',
            stagger: { each: 0.01, from: 'random' },
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
          });
        },
      });
      ScrollTrigger.refresh();
    }),
  );
  gsap.from('.hero .kicker, .hero .meta', { opacity: 0, y: 16, duration: 0.9, ease: 'power3.out', delay: 0.5, stagger: 0.1 });
  gsap.from('.horizon path', { drawSVG: '0%', duration: 1.6, ease: 'power2.inOut', delay: 0.6 });
  gsap.to('.hero .title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* the sea moves while the hero is on screen, and the tide rises with the scroll */
  let seaOn = true;
  const sail = () => {
    sea.t += 0.016;
    drawTide();
  };
  gsap.ticker.add(sail);
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => (sea.tide = self.progress),
    onToggle: (self) => {
      if (self.isActive === seaOn) return;
      seaOn = self.isActive;
      if (seaOn) gsap.ticker.add(sail);
      else gsap.ticker.remove(sail);
    },
  });
  const onSea = (e) => {
    const r = tideCanvas.getBoundingClientRect();
    sea.px = e.clientX - r.left;
    sea.py = e.clientY - r.top;
  };
  tideCanvas.parentElement.addEventListener('pointermove', onSea);

  /* the ground changes colour from section to section: night water, deep channel, dry dock */
  gsap.utils.toArray('[data-tint]').forEach((sec) =>
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && gsap.to(html, { '--bg': sec.dataset.tint, duration: 0.9, ease: 'power2.out' }),
    }),
  );

  /* 2. process: pinned for twice its height; each step opens over the last with a circular wipe from the right,
     and the large outlined number rolls to the next one in the same timeline */
  const steps = gsap.utils.toArray('.step');
  gsap.set(steps.slice(1), { clipPath: 'circle(0% at 82% 50%)' });
  const process = gsap.timeline({
    scrollTrigger: { trigger: '.process', start: 'top top', end: '+=200%', pin: true, scrub: 0.5 },
  });
  steps.slice(1).forEach((step, i) =>
    process
      .to(step, { clipPath: 'circle(150% at 82% 50%)', ease: 'power2.inOut' })
      .to('.big-num span', { yPercent: -100 * (i + 1), ease: 'power2.inOut' }, '<')
      .from(step.children, { y: 40, opacity: 0, stagger: 0.05, ease: 'power3.out', duration: 0.5 }, '<0.3')
      .set(steps[i], { autoAlpha: 0 }),
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

  /* the map tips up from the table as it arrives, like a camera rising over it */
  gsap.fromTo(
    '.route svg',
    { rotationX: 52, scale: 0.86, transformPerspective: 1400, transformOrigin: '50% 100%' },
    { rotationX: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.route', start: 'top bottom', end: 'top top', scrub: 0.6 } },
  );

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

  /* each artwork is uncovered from the left as it enters the moving strip */
  gsap.utils.toArray('.work .art').forEach((art) =>
    gsap.fromTo(
      art,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: { trigger: art, containerAnimation: strip, start: 'left 95%', end: 'left 55%', scrub: true },
      },
    ),
  );

  /* a fine pointer gets a ring that grows over anything you can press, and the main button leans towards it */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cursor = document.querySelector('.cursor');
  const cx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
  const cy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
  const onCursor = (e) => {
    html.classList.add('pointer');
    cx(e.clientX);
    cy(e.clientY);
    cursor.classList.toggle('over', !!e.target.closest('a, button, summary, [tabindex]'));
  };
  if (fine) addEventListener('pointermove', onCursor, { passive: true });
  const cta = document.querySelector('.contact .btn');
  const mx = gsap.quickTo(cta, 'x', { duration: 0.6, ease: 'power3.out' });
  const my = gsap.quickTo(cta, 'y', { duration: 0.6, ease: 'power3.out' });
  const onCta = (e) => {
    const r = cta.getBoundingClientRect();
    mx((e.clientX - (r.left + r.width / 2)) * 0.3);
    my((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const offCta = () => {
    mx(0);
    my(0);
  };
  if (fine) {
    cta.addEventListener('pointermove', onCta);
    cta.addEventListener('pointerleave', offCta);
  }

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
    removeEventListener('pointermove', onCursor);
    tideCanvas.parentElement.removeEventListener('pointermove', onSea);
    cta.removeEventListener('pointermove', onCta);
    cta.removeEventListener('pointerleave', offCta);
    gsap.ticker.remove(sail);
    html.classList.remove('pointer');
    html.style.removeProperty('--bg');
    sea.t = 0;
    sea.tide = 0;
    sea.px = sea.py = -999;
    drawTide();
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
