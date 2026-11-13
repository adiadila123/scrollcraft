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

  /* undone when motion is turned off: back to the plain layout */
  return () => {
    html.classList.remove('animated');
    stops.concat(labels).forEach((el) => el.classList.remove('on'));
  };
});
