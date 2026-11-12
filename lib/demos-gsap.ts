import type { DemoSource } from './demos';

/**
 * Previews for the GSAP chapter. The script tags point at jsDelivr, which is what a reader pastes into their own
 * page; inside the tutorial demoDocument() swaps them for the copies in public/vendor.
 */
const GSAP = 'https://cdn.jsdelivr.net/npm/gsap@3.15.1/dist';

export const gsapDemos: Record<string, DemoSource> = {
  'gsap-timeline': {
    html: `<script src="${GSAP}/gsap.min.js"></script>
<section class="hero">
  <h1>
    <span class="ln"><span>Sound that</span></span>
    <span class="ln"><span>fills the room.</span></span>
  </h1>
  <p class="sub">A small speaker that plays in every direction.</p>
  <a class="cta" href="#">Pre-order</a>
</section>`,
    css: `.hero { min-height: 100vh; display: grid; align-content: center; gap: 18px; padding: 24px; }
h1 { margin: 0; font-size: clamp(38px, 11vw, 64px); font-weight: 300; line-height: 1; letter-spacing: -.04em; }
.ln { display: block; overflow: hidden; }
.ln > span { display: block; }
.sub { margin: 0; color: #9aa7b0; }
.cta { justify-self: start; padding: 12px 20px; border-radius: 99px; background: #eaf0f4; color: #000; text-decoration: none; }`,
    js: `/* one timeline, three steps; the position parameter overlaps them so it reads as one movement */
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });
tl.from('.ln > span', { yPercent: 110, stagger: 0.12 })
  .from('.sub', { y: 16, opacity: 0 }, '-=0.6')     /* starts 0.6s before the lines finish */
  .from('.cta', { scale: 0.92, opacity: 0 }, '<0.2'); /* 0.2s after the subtitle starts */
if (still) tl.progress(1);                           /* jump to the end: everything visible, nothing moves */`,
  },

  'gsap-scrub': {
    html: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<section class="stage">
  <div class="frame"><div class="box"></div></div>
</section>
<p class="after">The timeline follows the scroll, both ways.</p>`,
    css: `.stage { height: 300vh; }
.frame { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; }
.box { width: 96px; height: 96px; border: 1px solid #eaf0f4; }
.after { padding: 24px 24px 60vh; color: #9aa7b0; }`,
    js: `gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();
/* only build the scrubbed timeline when motion is welcome; gsap.matchMedia undoes it if that changes */
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.timeline({
    scrollTrigger: { trigger: '.stage', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  })
    .to('.box', { rotate: 135, ease: 'none' })
    .to('.box', { borderRadius: '50%', scale: 1.6, ease: 'none' })
    .to('.box', { backgroundColor: '#5cc8ff', borderColor: '#5cc8ff', scale: 0.6, ease: 'none' });
});`,
  },

  'gsap-pin': {
    html: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<p class="lead">Scroll down.</p>
<section class="pin">
  <div class="bar"><i></i></div>
  <article><h2>Listen</h2><p>A week of questions before any sketch.</p></article>
  <article><h2>Reduce</h2><p>One idea, said as plainly as possible.</p></article>
  <article><h2>Move</h2><p>Motion rules, so the brand behaves the same everywhere.</p></article>
</section>
<p class="lead">The section let go.</p>`,
    css: `.lead { height: 60vh; margin: 0; padding: 20px; color: #7f8c95; }
.pin { position: relative; height: 100vh; overflow: hidden; border-block: 1px solid #222; }
article { position: absolute; inset: 0; display: grid; align-content: center; gap: 8px; padding: 24px; }
h2 { margin: 0; font-size: 44px; font-weight: 300; letter-spacing: -.03em; }
article p { margin: 0; color: #9aa7b0; max-width: 28ch; }
.bar { position: absolute; left: 24px; right: 24px; top: 24px; height: 1px; background: #222; }
.bar i { display: block; height: 100%; background: #5cc8ff; transform-origin: 0 50%; transform: scaleX(0); }`,
    js: `gsap.registerPlugin(ScrollTrigger);
const steps = gsap.utils.toArray('article');
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.set(steps.slice(1), { autoAlpha: 0, y: 30 });
  /* pin the section for twice its height; each step leaves before the next arrives, so they never overlap */
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.pin', start: 'top top', end: '+=200%', pin: true, scrub: 0.5 },
  });
  steps.slice(1).forEach((step, i) => {
    tl.to(steps[i], { autoAlpha: 0, y: -30 }).to(step, { autoAlpha: 1, y: 0 });
  });
  tl.to('.bar i', { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);
});
/* without motion the steps simply stack, one under the other */
mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set('.pin', { height: 'auto' });
  gsap.set(steps, { position: 'static', minHeight: '40vh' });
});`,
  },

  'gsap-svg': {
    html: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="${GSAP}/DrawSVGPlugin.min.js"></script>
<section class="stage">
  <div class="frame">
    <svg viewBox="0 0 300 200" aria-hidden="true">
      <path class="ghost" d="M20 170 C 70 20, 120 20, 150 100 S 230 180, 280 30" />
      <path class="line" d="M20 170 C 70 20, 120 20, 150 100 S 230 180, 280 30" />
      <circle class="dot" r="5" cx="20" cy="170" />
    </svg>
  </div>
</section>
<p class="after">DrawSVG draws the stroke; the dot rides along the same path.</p>`,
    css: `.stage { height: 260vh; }
.frame { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; padding: 24px; }
svg { width: min(100%, 520px); overflow: visible; }
path { fill: none; stroke-width: 2; stroke-linecap: round; }
.ghost { stroke: #222; stroke-dasharray: 3 6; }
.line { stroke: #5cc8ff; }
.dot { fill: #eaf0f4; }
.after { padding: 24px 24px 60vh; color: #9aa7b0; }`,
    js: `gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
const path = document.querySelector('.line');
const length = path.getTotalLength();
const dot = document.querySelector('.dot');
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.fromTo(path, { drawSVG: '0%' }, {
    drawSVG: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.stage', start: 'top top', end: 'bottom bottom', scrub: true,
      /* move the dot to the drawn end of the line */
      onUpdate: (self) => {
        const pt = path.getPointAtLength(self.progress * length);
        gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
      },
    },
  });
});`,
  },

  'gsap-split': {
    html: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="${GSAP}/SplitText.min.js"></script>
<p class="lead">Scroll down.</p>
<h2 class="title">Quiet pages that move only when it matters, and say one thing at a time.</h2>
<p class="lead"></p>`,
    css: `.lead { height: 70vh; margin: 0; padding: 20px; color: #7f8c95; }
.title { margin: 0; padding: 0 24px; font-size: clamp(30px, 8vw, 48px); font-weight: 300; line-height: 1.08; letter-spacing: -.03em; }`,
    js: `gsap.registerPlugin(ScrollTrigger, SplitText);
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  /* SplitText measures the real line breaks after the fonts load, and keeps an accessible copy of the text */
  document.fonts.ready.then(() => {
    SplitText.create('.title', {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,                       /* re-splits when the width changes */
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110, duration: 1, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.title', start: 'top 80%', once: true },
        }),
    });
  });
});`,
  },
};
