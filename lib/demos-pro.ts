import type { DemoSource } from './demos';

/** Previews for the level 3 chapters: a page built from design tokens, and a loop that stops when it is off screen. */
export const proDemos: Record<string, DemoSource> = {
  tokens: {
    html: `<header class="top">
  <span class="brand">Field</span>
  <button class="swap" type="button" aria-pressed="false">Change the accent</button>
</header>
<h1 class="t-xl">One set of tokens.</h1>
<p class="t-md muted">Every size, gap, colour and timing on this page comes from the variables at the top of the CSS.</p>
<div class="grid">
  <article class="card reveal"><span class="t-xs">01</span><h2 class="t-lg">Type scale</h2><p class="muted">Four steps, each one a clamp.</p></article>
  <article class="card reveal"><span class="t-xs">02</span><h2 class="t-lg">Spacing</h2><p class="muted">Multiples of one unit.</p></article>
  <article class="card reveal"><span class="t-xs">03</span><h2 class="t-lg">Motion</h2><p class="muted">Two durations and one curve.</p></article>
</div>`,
    css: `:root {
  /* colour */
  --surface: #070a0d; --line: #20262b; --fg: #eaf0f4; --muted: #8d989f; --accent: #5cc8ff;
  /* type: four steps that grow with the screen */
  --t-xs: 11px;
  --t-md: clamp(15px, 1.2vw + 12px, 18px);
  --t-lg: clamp(20px, 2vw + 14px, 28px);
  --t-xl: clamp(36px, 7vw, 64px);
  /* space: multiples of 8 */
  --s1: 8px; --s2: 16px; --s3: 24px; --s4: 48px;
  /* motion: two durations, one curve */
  --dur-short: .2s; --dur-long: .9s;
  --ease-out: cubic-bezier(.2, .7, .2, 1);
}
/* a theme is only a different value for a token */
[data-accent="warm"] { --accent: #ff8a3d; }

body { padding: var(--s3) var(--s3) 40vh; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--s4); }
.brand { font: 500 var(--t-xs)/1 ui-monospace, monospace; letter-spacing: .3em; text-transform: uppercase; }
.swap { padding: var(--s1) var(--s2); border: 1px solid var(--line); border-radius: 99px; background: none;
  color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; transition: border-color var(--dur-short); }
.swap:hover, .swap:focus-visible { border-color: var(--accent); }
.t-xs { font: 500 var(--t-xs)/1 ui-monospace, monospace; letter-spacing: .14em; color: var(--accent); transition: color var(--dur-long); }
.t-md { font-size: var(--t-md); }
.t-lg { margin: var(--s1) 0; font-size: var(--t-lg); font-weight: 400; }
.t-xl { margin: 0 0 var(--s2); font-size: var(--t-xl); font-weight: 300; line-height: 1; letter-spacing: -.04em; }
.muted { margin: 0; color: var(--muted); max-width: 34ch; }
.grid { display: grid; gap: var(--s2); margin-top: var(--s4); }
.card { padding: var(--s3); background: var(--surface); border: 1px solid var(--line); border-top-color: var(--accent);
  transition: border-color var(--dur-long) var(--ease-out); }
/* hidden only when JavaScript runs, so nothing is lost if it fails */
.js .reveal { opacity: 0; transform: translateY(var(--s3));
  transition: opacity var(--dur-long) var(--ease-out), transform var(--dur-long) var(--ease-out), border-color var(--dur-long); }
.js .reveal.in { opacity: 1; transform: none; }
@media (min-width: 640px) { .grid { grid-template-columns: repeat(3, 1fr); } }
/* reduced motion: change the motion tokens, not every rule that uses them */
@media (prefers-reduced-motion: reduce) {
  :root { --dur-short: 0s; --dur-long: 0s; }
  .js .reveal { transform: none; }
}`,
    js: `document.documentElement.classList.add('js');
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* one attribute changes one token, and every rule that reads --accent follows */
const swap = document.querySelector('.swap');
swap.addEventListener('click', () => {
  const warm = swap.getAttribute('aria-pressed') !== 'true';
  swap.setAttribute('aria-pressed', String(warm));
  document.documentElement.dataset.accent = warm ? 'warm' : '';
});`,
  },

  offscreen: {
    html: `<p class="lead">The animation below only runs while you can see it.</p>
<figure class="stage"><canvas width="600" height="300" aria-hidden="true"></canvas></figure>
<p class="lead tall">Keep scrolling until it leaves the screen, and watch the counter stop.</p>
<p class="meter">Frames drawn: <b>0</b> · <span>paused</span></p>`,
    css: `.lead { min-height: 45vh; margin: 0; padding: 20px; display: flex; align-items: flex-end; color: #7f8c95; }
.tall { min-height: 130vh; align-items: flex-start; }
.stage { margin: 0 20px; border: 1px solid #222; }
canvas { display: block; width: 100%; height: auto; }
.meter { position: fixed; top: 10px; right: 10px; margin: 0; padding: 6px 8px; background: rgba(0,0,0,.8);
  font: 500 11px/1 ui-monospace, monospace; color: #9aa7b0; }
.meter b { color: #5cc8ff; font-weight: 500; }`,
    js: `const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const count = document.querySelector('.meter b');
const state = document.querySelector('.meter span');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let frames = 0;
let raf = 0;

function draw(t) {
  ctx.clearRect(0, 0, 600, 300);
  for (let i = 0; i < 24; i++) {
    const h = 60 + Math.sin(t / 600 + i / 2) * 50;
    ctx.fillStyle = i % 6 ? '#26313a' : '#5cc8ff';
    ctx.fillRect(12 + i * 24.5, 150 - h / 2, 14, h);
  }
}
function loop(t) {
  draw(t);
  count.textContent = ++frames;
  raf = requestAnimationFrame(loop);
}

/* start the loop when the canvas comes into view, stop it when it leaves */
new IntersectionObserver(([e]) => {
  if (e.isIntersecting && !still && !raf) {
    raf = requestAnimationFrame(loop);
    state.textContent = 'running';
  }
  if (!e.isIntersecting && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
    state.textContent = 'paused';
  }
}).observe(canvas);

/* reduced motion: one still frame */
if (still) {
  draw(0);
  state.textContent = 'still';
}`,
  },
};
