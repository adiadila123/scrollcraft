/* Field Studio: one scroll loop for the clip reveals and the horizontal gallery,
   one animation loop for the marquee, which keeps drifting when the page is still. */
document.documentElement.classList.add('js');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

requestAnimationFrame(() => document.querySelector('.split').classList.add('in'));

/* clip reveal: from a small window to the full frame while the figure rises to the middle.
   The clip is only ever set here, so without JavaScript the artwork is simply visible. */
const clips = [...document.querySelectorAll('.clip')];
function revealClips() {
  clips.forEach((fig) => {
    const r = fig.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = still ? 1 : clamp((innerHeight - r.top) / (innerHeight * 0.85), 0, 1);
    const e = 1 - (1 - p) ** 3;
    const y = 18 * (1 - e),
      x = 24 * (1 - e);
    fig.style.clipPath = `inset(${y}% ${x}% ${y}% ${x}%)`;
    fig.firstElementChild.style.transform = `scale(${(1.25 - 0.25 * e).toFixed(3)})`;
  });
}

/* horizontal gallery: the section is as tall as the strip overflows, so scrolling down moves it sideways one to one */
const hs = document.querySelector('.hs');
const pin = hs.querySelector('.hs-pin');
const track = hs.querySelector('.hs-track');
let max = 0;
function measure() {
  max = Math.max(0, track.scrollWidth - pin.clientWidth);
  hs.style.height = `${max + pin.offsetHeight}px`;
}
function moveTrack() {
  const p = clamp(-hs.getBoundingClientRect().top / (max || 1), 0, 1);
  track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
}

let queued = false;
function update() {
  queued = false;
  revealClips();
  moveTrack();
}
const queue = () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(update);
  }
};
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', () => {
  measure();
  queue();
});
measure();
update();

/* marquee: a steady drift plus a boost from scroll speed that fades out. The text is repeated so it wraps without a gap. */
const row = document.querySelector('.marquee-row');
row.textContent = `${row.textContent.trim()} `.repeat(6);
let x = 0,
  boost = 0,
  lastY = scrollY;
addEventListener(
  'scroll',
  () => {
    boost = Math.min(60, boost + Math.abs(scrollY - lastY) * 0.3);
    lastY = scrollY;
  },
  { passive: true },
);
function drift() {
  boost *= 0.92;
  x -= 0.5 + boost * 0.12;
  const half = row.scrollWidth / 2;
  if (-x > half) x += half;
  row.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
  requestAnimationFrame(drift);
}
if (!still) drift();
