/* Halden Studio: a case study built with GSAP. Every scroll effect is created inside gsap.matchMedia, so with
   reduced motion none of it exists: the page is a plain document, with the line drawn and every stop lit. */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
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

  /* 1. headline: split into its real lines once the fonts are in, then each line rises out of a mask */
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

  /* 2. process: pinned for twice its height; each step leaves before the next arrives */
  const steps = gsap.utils.toArray('.step');
  gsap.set(steps.slice(1), { autoAlpha: 0, y: 30 });
  const process = gsap.timeline({
    scrollTrigger: { trigger: '.process', start: 'top top', end: '+=200%', pin: true, scrub: 0.5 },
  });
  steps.slice(1).forEach((step, i) => process.to(steps[i], { autoAlpha: 0, y: -30 }).to(step, { autoAlpha: 1, y: 0 }));
  process.to('.process-bar i', { scaleX: 1, ease: 'none', duration: process.duration() }, 0);

  /* 3. route: the line is drawn by the scroll; a stop lights up when the drawn length passes it */
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
  gsap.fromTo(
    line,
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      ease: 'none',
      scrollTrigger: { trigger: '.route', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (self) => light(self.progress) },
    },
  );

  /* 4. work: the strip moves left by exactly its overflow while the section is pinned */
  const track = document.querySelector('.work-track');
  const pin = document.querySelector('.work-pin');
  const overflow = () => Math.max(0, track.scrollWidth - pin.clientWidth + parseFloat(getComputedStyle(pin).paddingLeft));
  gsap.to(track, {
    x: () => -overflow(),
    ease: 'none',
    scrollTrigger: { trigger: '.work', start: 'top top', end: () => `+=${overflow()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
  });

  /* undone when motion is turned off: back to the plain layout */
  return () => {
    html.classList.remove('animated');
    stops.concat(labels).forEach((el) => el.classList.remove('on'));
  };
});
