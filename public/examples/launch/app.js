/* Orbit One: one scroll loop drives the progress bar, the frame scrub, the lit words and the product tour. */
document.documentElement.classList.add('js');
/* reduced motion is respected, unless the page was opened with ?motion=on: the tutorial adds it when the reader
   has turned animations on although their device asks for less motion */
const motionOn = new URLSearchParams(location.search).get('motion') === 'on';
if (motionOn) document.documentElement.classList.add('motion-on');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches && !motionOn;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
/* how far the reader is through a tall section, 0 at its top and 1 when its end reaches the bottom of the screen */
const through = (el) => {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight), 0, 1);
};

/* headline: lines slide up once it is on screen */
const headline = document.querySelector('.split');
requestAnimationFrame(() => headline.classList.add('in'));

/* frame scrub. A real launch page draws preloaded images: ctx.drawImage(frames[i], ...).
   Here each frame is drawn in code so the example needs no files. */
const spin = document.querySelector('.spin');
const cv = document.querySelector('.spin-canvas');
const ctx = cv.getContext('2d');
const caps = [...document.querySelectorAll('.spin-cap')];
const FRAMES = 120;
let frame = -1;

function drawFrame(i) {
  const w = cv.width,
    h = cv.height;
  const a = (i / FRAMES) * Math.PI * 2;
  const cx = w / 2,
    cy = h * 0.44;
  const R = Math.min(w, h) * 0.17,
    H = R * 1.5;
  ctx.clearRect(0, 0, w, h);
  /* glow under the speaker */
  const g = ctx.createRadialGradient(cx, cy + H * 0.7, 0, cx, cy + H * 0.7, R * 2.6);
  g.addColorStop(0, 'rgba(255,138,61,.22)');
  g.addColorStop(1, 'rgba(255,138,61,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  /* the body: a shaded cylinder, lit from the left */
  const body = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
  body.addColorStop(0, '#2a2e31');
  body.addColorStop(0.35, '#15181a');
  body.addColorStop(1, '#08090a');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(cx, cy + H / 2, R, R * 0.22, 0, 0, Math.PI);
  ctx.lineTo(cx - R, cy - H / 2);
  ctx.ellipse(cx, cy - H / 2, R, R * 0.22, 0, Math.PI, 0, true);
  ctx.closePath();
  ctx.fill();
  /* vertical seams of the fabric, turning with the frame */
  ctx.lineWidth = Math.max(1, w / 900);
  for (let k = 0; k < 28; k++) {
    const t = a + (k / 28) * Math.PI * 2;
    const x = Math.sin(t) * R;
    const front = Math.cos(t);
    if (front < -0.05) continue;
    ctx.strokeStyle = `rgba(242,244,245,${0.06 + front * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(cx + x, cy - H / 2);
    ctx.lineTo(cx + x, cy + H / 2);
    ctx.stroke();
  }
  /* top and bottom rims */
  ctx.strokeStyle = 'rgba(242,244,245,.7)';
  for (const y of [cy - H / 2, cy + H / 2]) {
    ctx.beginPath();
    ctx.ellipse(cx, y, R, R * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  /* the one button, on the top, turning with the body */
  ctx.fillStyle = '#ff8a3d';
  ctx.beginPath();
  ctx.ellipse(cx + Math.sin(a) * R * 0.45, cy - H / 2 + Math.cos(a) * R * 0.1, R * 0.12, R * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
}

function sizeCanvas() {
  const d = Math.min(devicePixelRatio || 1, 2);
  cv.width = cv.clientWidth * d;
  cv.height = cv.clientHeight * d;
  frame = -1;
}

/* words light up at the pace of the scroll */
const statement = document.querySelector('.statement');
const words = statement.querySelector('.words');
words.innerHTML = words.textContent
  .trim()
  .split(/\s+/)
  .map((w) => `<span>${w}</span>`)
  .join(' ');
const spans = [...words.children];

const bar = document.querySelector('.progress');
let queued = false;
function update() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max ? scrollY / max : 0})`;

  const p = through(spin);
  const i = still ? 0 : Math.round(p * (FRAMES - 1));
  if (i !== frame) {
    frame = i;
    drawFrame(i);
  }
  let cur = 0;
  caps.forEach((c, k) => {
    if (p >= +c.dataset.at) cur = k;
  });
  caps.forEach((c, k) => c.classList.toggle('on', k === cur));

  const lit = Math.round(through(statement) * 1.25 * spans.length);
  spans.forEach((s, k) => s.classList.toggle('lit', still || k < lit));
  updateTour();
}
const queue = () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(update);
  }
};
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', () => {
  sizeCanvas();
  queue();
});

/* product tour: the active feature is the last one whose heading has passed a reading line, checked in the same
   frame as everything else. Fast flings and jumps can never skip one, and the lit text is always the text in view.
   On phones the device sits on top, so the line sits just under it. */
const feats = [...document.querySelectorAll('.feat')];
const heads = feats.map((f) => f.querySelector('h2'));
const screen = document.querySelector('.tour-screen');
const wide = matchMedia('(min-width: 761px)');
let active = -1;
function updateTour() {
  const line = innerHeight * (wide.matches ? 0.55 : 0.7);
  let i = 0;
  heads.forEach((h, k) => {
    if (h.getBoundingClientRect().top < line) i = k;
  });
  if (i === active) return;
  active = i;
  feats.forEach((f, k) => f.classList.toggle('on', k === i));
  screen.dataset.i = i;
  screen.firstElementChild.textContent = heads[i].textContent;
}

sizeCanvas();
update();
