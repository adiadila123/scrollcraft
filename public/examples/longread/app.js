/* The Long Way North: one scroll loop for the progress bar, the cover parallax, the route drawing and the
   active day. Paragraph reveals use IntersectionObserver, since they happen once. */
document.documentElement.classList.add('js');
/* reduced motion is respected, unless the page was opened with ?motion=on: the tutorial adds it when the reader
   has turned animations on although their device asks for less motion */
const motionOn = new URLSearchParams(location.search).get('motion') === 'on';
if (motionOn) document.documentElement.classList.add('motion-on');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches && !motionOn;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const bar = document.querySelector('.progress');
const layers = [...document.querySelectorAll('[data-speed]')];
const journey = document.querySelector('.journey');
const route = document.querySelector('.route');
const days = [...document.querySelectorAll('.day')];
const heads = days.map((d) => d.querySelector('h2'));
const stops = [...document.querySelectorAll('.stops circle')];
const wide = matchMedia('(min-width: 761px)');
let active = -1;
const walker = document.querySelector('.walker');
const length = route.getTotalLength();
route.style.strokeDasharray = `${length}`;
route.style.strokeDashoffset = `${length}`;

let queued = false;
function update() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max ? scrollY / max : 0})`;

  /* parallax only while the cover is on screen */
  if (!still && scrollY < innerHeight * 1.2) {
    layers.forEach((l) => {
      l.style.transform = `translate3d(0,${(scrollY * l.dataset.speed).toFixed(1)}px,0)`;
    });
  }

  /* the route draws as the reader moves through the five days */
  const r = journey.getBoundingClientRect();
  const p = still ? 1 : clamp((innerHeight * 0.5 - r.top) / (r.height - innerHeight * 0.5), 0, 1);
  route.style.strokeDashoffset = `${(length * (1 - p)).toFixed(1)}`;
  /* the walker stands at the tip of the drawn line */
  const at = route.getPointAtLength(length * p);
  walker.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`);

  /* the active day is the last one whose heading has passed a reading line: the middle of the screen, or just
     under the map on phones. Checked every frame, so a fast fling or a jump never skips a day. */
  const line = innerHeight * (wide.matches ? 0.55 : 0.72);
  let i = -1;
  heads.forEach((h, k) => {
    if (h.getBoundingClientRect().top < line) i = k;
  });
  if (i !== active) {
    active = i;
    days.forEach((d, k) => d.classList.toggle('on', k === Math.max(0, i)));
    document.documentElement.dataset.day = Math.max(0, i);
    stops.forEach((s, k) => s.classList.toggle('on', k <= i));
  }
}
const queue = () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(update);
  }
};
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', queue);
update();

/* paragraphs arrive once and stay */
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));
