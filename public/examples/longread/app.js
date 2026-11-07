/* The Long Way North: one scroll loop for the progress bar, the cover parallax and the route drawing.
   Reveals and the active day use IntersectionObserver. */
document.documentElement.classList.add('js');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const bar = document.querySelector('.progress');
const layers = [...document.querySelectorAll('[data-speed]')];
const journey = document.querySelector('.journey');
const route = document.querySelector('.route');
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

/* the day crossing the middle of the screen lights its stop on the map */
const days = [...document.querySelectorAll('.day')];
const stops = [...document.querySelectorAll('.stops circle')];
const band = matchMedia('(max-width: 760px)').matches ? '-68% 0px -22% 0px' : '-45% 0px -45% 0px';
const dayIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = days.indexOf(e.target);
    days.forEach((d, k) => d.classList.toggle('on', k === i));
    stops.forEach((s, k) => s.classList.toggle('on', k <= i));
  });
}, { rootMargin: band });
days.forEach((d) => dayIO.observe(d));

/* paragraphs arrive once and stay */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    revealIO.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));
