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

/* the speaker's story in three acts, all from one number: it turns and plays (sound rings spread around it), it opens
   (the fabric shell lifts off the aluminium core and the driver), and it closes again while the view tilts down to
   the one button. Frame 0 is the closed speaker from the front: the still frame for reduced motion. */
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const span = (p, a, b) => ease((p - a) / (b - a));

/* one side of a cylinder: a band between two ellipses, shaded from a light on the left */
function band(cx, top, bottom, R, k, stops) {
  const g = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
  stops.forEach(([at, c]) => g.addColorStop(at, c));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, bottom, R, R * k, 0, 0, Math.PI);
  ctx.lineTo(cx - R, top);
  ctx.ellipse(cx, top, R, R * k, 0, Math.PI, 0, true);
  ctx.closePath();
  ctx.fill();
}
/* an ellipse's outline; front only draws the near half, the edge you can actually see at the bottom of a body */
function rim(cx, y, R, k, color, width = 1, front = false) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.ellipse(cx, y, R, R * k, 0, 0, front ? Math.PI : Math.PI * 2);
  ctx.stroke();
}

function drawFrame(i) {
  const p = i / (FRAMES - 1);
  const w = cv.width;
  const h = cv.height;
  const u = Math.min(w, h);
  const open = span(p, 0.3, 0.46) * (1 - span(p, 0.6, 0.76)); /* 0 closed, 1 fully open */
  const tilt = span(p, 0.66, 0.95); /* the view tilts down to the top of the speaker */
  const k = 0.2 + tilt * 0.3; /* how round the ellipses are: the camera's height */
  const a = p * Math.PI * 2.4; /* the turn */
  const cx = w / 2;
  const cy = h * (0.46 + open * 0.1 + tilt * 0.02); /* lower while open, so the lifted shell clears the bar */
  const R = u * 0.18;
  const H = R * 1.55;
  const lift = open * H * 0.85;
  const top = cy - H / 2;
  const bottom = cy + H / 2;
  ctx.clearRect(0, 0, w, h);

  /* the floor: a warm pool of light and a contact shadow */
  const g = ctx.createRadialGradient(cx, bottom, 0, cx, bottom, R * 3.2);
  g.addColorStop(0, 'rgba(255,138,61,.26)');
  g.addColorStop(1, 'rgba(255,138,61,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,.6)';
  ctx.beginPath();
  ctx.ellipse(cx, bottom + R * 0.04, R * 1.1, R * k * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();

  /* sound: rings spreading out across the floor, their phase set by the scroll, fading as the speaker opens */
  const loud = 1 - span(p, 0.26, 0.36);
  if (loud > 0) {
    for (let n = 0; n < 4; n++) {
      const t = (p * 9 + n / 4) % 1;
      rim(cx, bottom, R * (1.15 + t * 2.1), k, `rgba(255,138,61,${(1 - t) * 0.5 * loud})`, Math.max(1, u / 700));
    }
  }

  /* inside: the driver (a cone seen from the side) on an aluminium core */
  const core = R * 0.82;
  if (open > 0.01) {
    band(cx, top + H * 0.08, bottom, core, k, [
      [0, '#9aa3a9'],
      [0.25, '#e4e8ea'],
      [0.55, '#7d868c'],
      [1, '#2f3438'],
    ]);
    /* brushed lines on the core */
    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    ctx.lineWidth = 1;
    for (let y = top + H * 0.12; y < bottom; y += Math.max(3, u / 160)) {
      ctx.beginPath();
      ctx.ellipse(cx, y, core, core * k, 0, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }
    /* the driver, rising a little out of the core as it opens */
    const dy = top + H * 0.08 - open * H * 0.18;
    ctx.fillStyle = '#16191b';
    ctx.beginPath();
    ctx.ellipse(cx, dy, core * 0.92, core * 0.92 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let r = 0.85; r > 0.1; r -= 0.18) rim(cx, dy, core * r, k, `rgba(242,244,245,${0.12 + (0.85 - r) * 0.5})`);
    ctx.fillStyle = '#ff8a3d';
    ctx.beginPath();
    ctx.ellipse(cx, dy, core * 0.12, core * 0.12 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    /* leader lines and names, drawn only while it is open */
    /* sized in CSS pixels, so the names stay readable on a phone; narrow screens put all three on the right */
    const d = cv.width / cv.clientWidth;
    const narrow = cv.clientWidth < 600;
    const reach = narrow ? R + 18 * d : R * 1.7;
    const lw = Math.max(1, d);
    ctx.font = `${Math.round(13 * d)}px system-ui, sans-serif`;
    ctx.textBaseline = 'middle';
    const label = (x1, y1, x2, text, alpha) => {
      ctx.strokeStyle = `rgba(242,244,245,${alpha * 0.5})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.stroke();
      ctx.fillStyle = `rgba(242,244,245,${alpha})`;
      ctx.textAlign = x2 > x1 ? 'left' : 'right';
      ctx.fillText(text, x2 + (x2 > x1 ? 8 : -8), y1);
    };
    const la = span(open, 0.6, 1);
    label(cx + R * 1.02, top - lift + H * 0.3, cx + reach, 'Fabric shell', la);
    if (narrow) label(cx + core, cy + H * 0.15, cx + reach, 'Aluminium core', la);
    else label(cx - core, cy + H * 0.15, cx - reach, 'Aluminium core', la);
    label(cx + core * 0.9, dy, cx + reach, 'Driver', la);
  }

  /* the shell: dark fabric with a turning grid of perforations; it lifts and turns translucent as it opens */
  const sTop = top - lift;
  const sBottom = bottom - lift;
  ctx.globalAlpha = 1 - open * 0.55;
  band(cx, sTop, sBottom, R, k, [
    [0, '#33393d'],
    [0.3, '#1b1f22'],
    [1, '#07080a'],
  ]);
  const dot = Math.max(1, u / 520);
  for (let col = 0; col < 36; col++) {
    const t = a + (col / 36) * Math.PI * 2;
    const front = Math.cos(t);
    if (front < 0.02) continue;
    const x = cx + Math.sin(t) * R * 0.985;
    ctx.fillStyle = `rgba(242,244,245,${0.05 + front * 0.22})`;
    for (let row = 1; row < 18; row++) {
      const y = sTop + (row / 18) * (sBottom - sTop) + front * R * k * 0.9;
      ctx.beginPath();
      ctx.ellipse(x, y, dot * Math.max(0.3, front), dot, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  /* the cap on top, and the one button turning with the body */
  ctx.fillStyle = '#0d0f11';
  ctx.beginPath();
  ctx.ellipse(cx, sTop, R, R * k, 0, 0, Math.PI * 2);
  ctx.fill();
  rim(cx, sTop, R, k, 'rgba(242,244,245,.55)', Math.max(1, u / 800));
  rim(cx, sBottom, R, k, 'rgba(242,244,245,.18)', Math.max(1, u / 800), true);
  const bx = cx + Math.sin(a) * R * 0.42;
  const by = sTop + Math.cos(a) * R * k * 0.42;
  const pulse = span(p, 0.8, 1);
  if (pulse > 0) rim(bx, by, R * (0.16 + pulse * 0.12), k * 1.4, `rgba(255,138,61,${0.7 * (1 - pulse * 0.4)})`, Math.max(1, u / 600));
  ctx.fillStyle = '#ff8a3d';
  ctx.beginPath();
  ctx.ellipse(bx, by, R * 0.12, R * 0.12 * k * 1.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
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
