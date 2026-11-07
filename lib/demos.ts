/**
 * Small, complete pages for the live previews. Each runs on its own inside a sandboxed iframe and is also the code
 * the reader copies, so it has to be correct as written: no hidden helpers, reduced motion handled in every one.
 */
export type DemoSource = { html: string; css: string; js?: string };

/** Shared look for every preview, so the snippets stay about the technique. Not shown in the code tabs. */
const DEMO_BASE = `*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;background:#000;color:#eaf0f4;font:400 15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.hint{position:fixed;left:10px;bottom:10px;z-index:99;padding:6px 8px;background:rgba(0,0,0,.75);font:500 10px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#7f8c95;pointer-events:none}`;

export const demos: Record<string, DemoSource> = {
  sticky: {
    html: `<section>
  <h2 class="label">01 · Brief</h2>
  <p>Scroll. The label stays under the top edge until its section ends.</p>
</section>
<section>
  <h2 class="label">02 · Build</h2>
  <p>Then the next label takes over.</p>
</section>
<section>
  <h2 class="label">03 · Review</h2>
  <p>No JavaScript at all.</p>
</section>`,
    css: `section { min-height: 360px; padding: 0 20px 40px; border-top: 1px solid #222; }
.label {
  position: sticky; top: 0; margin: 0 -20px; padding: 12px 20px;
  font: 500 12px/1 ui-monospace, monospace; letter-spacing: .14em;
  background: rgba(0,0,0,.8); backdrop-filter: blur(10px);
}
p { color: #9aa7b0; max-width: 32ch; }`,
  },

  snap: {
    html: `<div class="strip" tabindex="0">
  <div>One</div><div>Two</div><div>Three</div><div>Four</div>
</div>`,
    css: `body { display: grid; place-items: center; min-height: 100vh; }
.strip {
  display: flex; gap: 12px; width: 100%; padding: 0 20px;
  overflow-x: auto; scroll-snap-type: x mandatory;
}
.strip > div {
  flex: 0 0 78%; height: 180px; scroll-snap-align: center;
  display: grid; place-items: center; font-size: 28px; font-weight: 300;
  border: 1px solid #2a2f33; background: #06090c;
}`,
  },

  reveal: {
    html: `<p class="lead">Scroll down.</p>
<div class="card reveal">Arrives once</div>
<div class="card reveal">and stays</div>
<div class="card reveal">when you scroll back up</div>`,
    css: `body { padding: 20px 20px 50vh; }
.lead { height: 70vh; color: #7f8c95; }
.card { height: 140px; margin: 16px 0; display: grid; place-items: center; border: 1px solid #2a2f33; background: #06090c; }
/* hidden only when JavaScript runs, so nothing is lost if it fails */
.js .reveal { opacity: 0; transform: translateY(24px);
  transition: opacity .9s, transform .9s cubic-bezier(.2,.7,.2,1); }
.js .reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .js .reveal { transform: none; } }`,
    js: `document.documentElement.classList.add('js');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    e.target.style.transitionDelay = i * 80 + 'ms';
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));`,
  },

  infinite: {
    html: `<ol id="list"></ol>
<p id="sentinel">Loading…</p>`,
    css: `body { padding: 12px 20px; }
ol { margin: 0; padding: 0; list-style: none; }
li { padding: 14px 0; border-bottom: 1px solid #222; }
li span { color: #5cc8ff; font: 12px ui-monospace, monospace; margin-right: 12px; }
#sentinel { color: #7f8c95; font: 12px ui-monospace, monospace; padding: 16px 0 40px; }`,
    js: `const list = document.getElementById('list');
const sentinel = document.getElementById('sentinel');
const MAX = 40;
let n = 0;
function loadBatch() {
  for (let i = 0; i < 8 && n < MAX; i++) {
    const li = document.createElement('li');
    li.innerHTML = '<span>' + String(++n).padStart(2, '0') + '</span>Item ' + n;
    list.append(li);
  }
  if (n >= MAX) { io.disconnect(); sentinel.textContent = 'End of the list'; }
}
/* the sentinel sits under the last item; a margin starts loading before it is visible */
const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) loadBatch(); },
  { rootMargin: '0px 0px 200px 0px' });
loadBatch();
io.observe(sentinel);`,
  },

  driven: {
    html: `<div class="bar"></div>
<section class="pin">
  <p class="words">The scroll becomes the camera and the page becomes the set.</p>
</section>
<p class="after">End of the pinned section.</p>`,
    css: `.bar { position: fixed; inset: 0 0 auto; height: 3px; background: #5cc8ff; transform-origin: 0 50%; transform: scaleX(0); z-index: 2; }
.pin { height: 260vh; }
.words { position: sticky; top: 0; height: 100vh; margin: 0; padding: 0 24px;
  display: flex; flex-wrap: wrap; align-content: center; gap: 0 .3em;
  font-size: clamp(24px, 7vw, 40px); font-weight: 300; line-height: 1.15; }
.words span { opacity: .15; transition: opacity .2s; }
.after { padding: 40px 24px 60vh; color: #7f8c95; }`,
    js: `const bar = document.querySelector('.bar');
const pin = document.querySelector('.pin');
const words = document.querySelector('.words');
words.innerHTML = words.textContent.split(' ').map((w) => '<span>' + w + '</span>').join(' ');
const spans = [...words.children];
function update() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = 'scaleX(' + (max ? scrollY / max : 0) + ')';
  const r = pin.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  spans.forEach((s, i) => { s.style.opacity = p * spans.length > i ? 1 : 0.15; });
}
addEventListener('scroll', update, { passive: true });
update();`,
  },

  zoom: {
    html: `<p class="lead">Scroll down.</p>
<figure>
  <div class="img"></div>
</figure>
<p class="lead"></p>`,
    css: `.lead { height: 60vh; margin: 0; padding: 20px; color: #7f8c95; }
figure { margin: 0 20px; height: 60vh; overflow: hidden; border: 1px solid #2a2f33; }
.img { height: 100%; transform-origin: 50% 50%; will-change: transform;
  background: radial-gradient(circle at 60% 40%, #5cc8ff 0 6%, transparent 7%),
    radial-gradient(circle at 30% 70%, #1d3a4a, #06090c 60%); }`,
    js: `const fig = document.querySelector('figure');
const img = document.querySelector('.img');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
function update() {
  if (still) return;
  const r = fig.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
  img.style.transform = 'scale(' + (1 + 0.6 * p).toFixed(3) + ')';
}
addEventListener('scroll', update, { passive: true });
update();`,
  },

  parallax: {
    html: `<header class="hero">
  <div class="layer far" data-speed="0.2"></div>
  <div class="layer mid" data-speed="0.35"></div>
  <div class="layer near" data-speed="0.5"></div>
  <h1>Depth</h1>
</header>
<main><p>Content scrolls at normal speed over the slower layers.</p></main>`,
    css: `.hero { position: relative; height: 100vh; overflow: hidden; display: grid; place-items: center; }
.layer { position: absolute; inset: -20% 0; will-change: transform; }
.far  { background: radial-gradient(circle at 70% 30%, #12303f, transparent 50%); }
.mid  { background: radial-gradient(circle at 20% 60%, rgba(92,200,255,.25), transparent 30%); }
.near { background: radial-gradient(circle at 80% 80%, rgba(234,240,244,.12), transparent 22%); }
h1 { position: relative; font-size: 56px; font-weight: 300; letter-spacing: -.04em; margin: 0; }
main { height: 120vh; padding: 24px; background: #000; position: relative; color: #9aa7b0; }`,
    js: `const layers = [...document.querySelectorAll('[data-speed]')];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('scroll', () => {
  const y = scrollY;
  if (still || y > innerHeight * 1.3) return;
  layers.forEach((l) => {
    l.style.transform = 'translate3d(0,' + y * (1 - l.dataset.speed) + 'px,0)';
  });
}, { passive: true });`,
  },

  horizontal: {
    html: `<p class="lead">Scroll down.</p>
<section class="hs">
  <div class="pin">
    <div class="track">
      <div class="card">1</div>
      <div class="card">2</div>
      <div class="card">3</div>
      <div class="card">4</div>
      <div class="card">5</div>
    </div>
  </div>
</section>
<p class="lead">After the gallery.</p>`,
    css: `.lead { height: 50vh; margin: 0; padding: 20px; color: #7f8c95; }
.pin { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center; }
.track { display: flex; gap: 16px; padding: 0 20px; width: max-content; will-change: transform; }
.card { width: 62vw; height: 56vh; display: grid; place-items: center; font-size: 40px; font-weight: 300;
  border: 1px solid #2a2f33; background: #06090c; }`,
    js: `const hs = document.querySelector('.hs');
const pin = hs.querySelector('.pin');
const track = hs.querySelector('.track');
let max = 0;
/* the section is as tall as the track overflows, so scrolling down moves it sideways one to one */
function measure() {
  max = Math.max(0, track.scrollWidth - pin.clientWidth);
  hs.style.height = max + pin.offsetHeight + 'px';
}
function update() {
  const p = Math.min(1, Math.max(0, -hs.getBoundingClientRect().top / (max || 1)));
  track.style.transform = 'translate3d(' + -p * max + 'px,0,0)';
}
addEventListener('resize', () => { measure(); update(); });
addEventListener('scroll', update, { passive: true });
measure(); update();`,
  },

  scrolly: {
    html: `<section class="scrolly">
  <div class="vis">
    <div class="shape"></div>
  </div>
  <div class="steps">
    <p class="step">Brief: say what you want.</p>
    <p class="step">Generate: one piece at a time.</p>
    <p class="step">Inspect: look at every width.</p>
    <p class="step">Refine: describe what you saw.</p>
  </div>
</section>`,
    css: `/* phones first: the scene on top, the steps scroll under it */
.scrolly { display: grid; padding: 0 16px; }
.vis { position: sticky; top: 0; z-index: 1; height: 42vh; display: grid; place-items: center; background: #000; }
.shape { width: 80px; height: 80px; border: 1px solid #5cc8ff; transition: border-radius .6s, transform .6s, background .6s; }
.step { min-height: 70vh; display: flex; align-items: center; justify-content: center; text-align: center; margin: 0; opacity: .25; transition: opacity .4s; }
.step.on { opacity: 1; }
@media (min-width: 600px) {
  .scrolly { grid-template-columns: 1fr 1fr; gap: 16px; }
  .vis { height: 100vh; background: none; }
  .shape { width: 110px; height: 110px; }
  .step { justify-content: flex-start; text-align: left; }
}
.shape[data-i="1"] { border-radius: 50%; }
.shape[data-i="2"] { transform: rotate(45deg) scale(.8); }
.shape[data-i="3"] { border-radius: 50%; background: rgba(92,200,255,.2); }`,
    js: `const steps = [...document.querySelectorAll('.step')];
const shape = document.querySelector('.shape');
function update() {
  /* the reading line: the middle of the screen, or of the space under the scene on phones */
  const line = innerWidth < 600 ? innerHeight * 0.66 : innerHeight / 2;
  let best = 0, bd = Infinity;
  steps.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - line);
    if (d < bd) { bd = d; best = i; }
  });
  steps.forEach((s, i) => s.classList.toggle('on', i === best));
  shape.dataset.i = best;
}
addEventListener('scroll', update, { passive: true });
update();`,
  },

  /* ---- real-world recipes ---- */

  tour: {
    html: `<section class="tour">
  <div class="device">
    <div class="screen" data-i="0"><b>Track</b></div>
  </div>
  <div class="features">
    <article>
      <h3>Track</h3>
      <p>Every run, logged without opening the app.</p>
    </article>
    <article>
      <h3>Plan</h3>
      <p>A week of sessions built from your last month.</p>
    </article>
    <article>
      <h3>Share</h3>
      <p>A route card your friends can open in one tap.</p>
    </article>
  </div>
</section>`,
    css: `/* phones first: the device on top, the features scroll under it */
.tour { display: grid; padding: 0 20px; }
.device { position: sticky; top: 0; z-index: 1; height: 44vh; display: grid; place-items: center; background: #000; }
.screen { width: 84px; aspect-ratio: 9 / 19; border-radius: 16px; border: 1px solid #3a444b;
  display: grid; place-items: center; font-size: 18px; transition: background .5s; }
.screen[data-i="0"] { background: linear-gradient(160deg, #0b2a3a, #000); }
.screen[data-i="1"] { background: linear-gradient(160deg, #2a1b3d, #000); }
.screen[data-i="2"] { background: linear-gradient(160deg, #13331f, #000); }
article { min-height: 70vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; opacity: .3; transition: opacity .4s; }
article.on { opacity: 1; }
h3 { margin: 0 0 6px; font-weight: 400; font-size: 24px; }
p { margin: 0; color: #9aa7b0; max-width: 26ch; }
@media (min-width: 600px) {
  .tour { grid-template-columns: 1fr 1fr; gap: 20px; }
  .device { height: 100vh; background: none; }
  .screen { width: 140px; }
  article { min-height: 90vh; align-items: flex-start; text-align: left; }
}`,
    js: `const items = [...document.querySelectorAll('article')];
const heads = items.map((a) => a.querySelector('h3'));
const screen = document.querySelector('.screen');
let active = -1;
/* the active feature is the last one whose heading has passed a reading line: the middle of the screen,
   or just under the device on phones. Checked every frame, so a fast fling never skips one. */
let queued = false;
function update() {
  queued = false;
  const line = innerHeight * (innerWidth < 600 ? 0.7 : 0.55);
  let i = 0;
  heads.forEach((h, k) => { if (h.getBoundingClientRect().top < line) i = k; });
  if (i === active) return;
  active = i;
  items.forEach((a, k) => a.classList.toggle('on', k === i));
  screen.dataset.i = i;
  screen.innerHTML = '<b>' + heads[i].textContent + '</b>';
}
addEventListener('scroll', () => {
  if (!queued) { queued = true; requestAnimationFrame(update); }
}, { passive: true });
update();`,
  },

  clip: {
    html: `<p class="lead">Scroll down.</p>
<figure class="reveal-img">
  <div class="img"></div>
  <figcaption>Case study · 2026</figcaption>
</figure>
<p class="lead"></p>`,
    css: `.lead { height: 55vh; margin: 0; padding: 20px; color: #7f8c95; }
.reveal-img { margin: 0 20px; height: 70vh; position: relative; }
.img { position: absolute; inset: 0;
  background: linear-gradient(135deg, #0b2a3a, #000 55%), radial-gradient(circle at 70% 30%, #5cc8ff, transparent 30%);
  background-blend-mode: screen; }
figcaption { position: absolute; left: 16px; bottom: 14px; font: 11px ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; }`,
    js: `/* the clip is only set from here, so without JavaScript the image is simply visible */
const fig = document.querySelector('.reveal-img');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
function update() {
  const r = fig.getBoundingClientRect();
  /* 0 when the top enters the screen, 1 when the figure fills the middle */
  const p = still ? 1 : Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.9)));
  const y = 30 * (1 - p), x = 20 * (1 - p);
  fig.style.clipPath = 'inset(' + y + '% ' + x + '% ' + y + '% ' + x + '%)';
}
addEventListener('scroll', update, { passive: true });
update();`,
  },

  frames: {
    html: `<section class="seq">
  <canvas></canvas>
</section>
<p class="after">A real site draws image files here: one per frame, preloaded.</p>`,
    css: `.seq { height: 300vh; }
canvas { position: sticky; top: 0; width: 100%; height: 100vh; display: block; }
.after { padding: 30px 20px 60vh; color: #7f8c95; }`,
    js: `const seq = document.querySelector('.seq');
const cv = document.querySelector('canvas');
const ctx = cv.getContext('2d');
const FRAMES = 90;
let last = -1;
/* stand-in for drawImage(frames[i]): a product drawn from frame i, so the preview needs no files */
function drawFrame(i) {
  const w = cv.width, h = cv.height, a = (i / FRAMES) * Math.PI * 2;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#5cc8ff';
  for (let k = 0; k < 14; k++) {
    const t = a + (k / 14) * Math.PI;
    ctx.globalAlpha = 0.25 + 0.75 * Math.abs(Math.cos(t));
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, Math.abs(Math.cos(t)) * h * 0.3 + 2, h * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
function size() { cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio; last = -1; update(); }
function update() {
  const r = seq.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  const i = Math.round(p * (FRAMES - 1));
  if (i !== last) { last = i; requestAnimationFrame(() => drawFrame(i)); }
}
addEventListener('resize', size);
addEventListener('scroll', update, { passive: true });
size();`,
  },

  marquee: {
    html: `<p class="lead">Scroll, fast and slow.</p>
<div class="marquee">
  <div class="row">Strategy · Design · Motion · Build · </div>
</div>
<p class="lead"></p>`,
    css: `.lead { height: 60vh; margin: 0; padding: 20px; color: #7f8c95; }
.marquee { overflow: hidden; border-block: 1px solid #222; padding: 18px 0; }
.row { display: inline-block; white-space: nowrap; font-size: 44px; font-weight: 300; letter-spacing: -.03em; will-change: transform; }`,
    js: `const row = document.querySelector('.row');
row.textContent = row.textContent.repeat(6);
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let x = 0, boost = 0, lastY = scrollY;
addEventListener('scroll', () => { boost += Math.abs(scrollY - lastY) * 0.4; lastY = scrollY; }, { passive: true });
function tick() {
  boost *= 0.92;                       /* the extra speed fades out when scrolling stops */
  x -= 0.6 + boost * 0.1;
  const half = row.scrollWidth / 2;
  if (-x > half) x += half;            /* the text repeats, so wrapping is seamless */
  row.style.transform = 'translate3d(' + x + 'px,0,0)';
  requestAnimationFrame(tick);
}
if (!still) tick();`,
  },

  lines: {
    html: `<p class="lead">Scroll down.</p>
<h2 class="split">
  <span class="line"><span>Quiet pages</span></span>
  <span class="line"><span>that move only</span></span>
  <span class="line"><span>when it matters.</span></span>
</h2>
<p class="lead"></p>`,
    css: `.lead { height: 65vh; margin: 0; padding: 20px; color: #7f8c95; }
.split { margin: 0; padding: 0 20px; font-size: clamp(32px, 9vw, 52px); font-weight: 300; letter-spacing: -.04em; line-height: 1.05; }
.line { display: block; overflow: hidden; }
.line > span { display: block; }
.js .line > span { transform: translateY(105%); transition: transform 1s cubic-bezier(.2,.7,.2,1); }
.js .split.in .line > span { transform: none; }
.js .split.in .line:nth-child(2) > span { transition-delay: .09s; }
.js .split.in .line:nth-child(3) > span { transition-delay: .18s; }
@media (prefers-reduced-motion: reduce) { .js .line > span { transform: none; transition: none; } }`,
    js: `document.documentElement.classList.add('js');
const h = document.querySelector('.split');
const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { h.classList.add('in'); io.disconnect(); }
}, { threshold: 0.4 });
io.observe(h);`,
  },
};

/** The full page for a preview: the shared base, the demo's own CSS and markup, its script, and a scroll hint. */
export function demoDocument(d: DemoSource, hint: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${DEMO_BASE}\n${d.css}</style></head><body>${d.html}<span class="hint">${hint}</span>${d.js ? `<script>${d.js}</script>` : ''}</body></html>`;
}
