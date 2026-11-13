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

let shownP = 0;
const lean = { x: 0, tx: 0 };
addEventListener(
  'pointermove',
  (e) => {
    if (still || scrollY > innerHeight || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    lean.tx = (e.clientX / innerWidth) * 2 - 1;
    queue();
  },
  { passive: true },
);

let queued = false;
function update() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max ? scrollY / max : 0})`;

  /* parallax only while the cover is on screen */
  lean.x += (lean.tx - lean.x) * 0.06;
  const leaning = Math.abs(lean.tx - lean.x) > 0.001;
  if (!still && scrollY < innerHeight * 1.2) {
    /* the nearer the layer, the further a fine pointer moves it sideways: depth from the hand as well as the scroll */
    layers.forEach((l) => {
      const near = (0.6 - l.dataset.speed) * 40;
      l.style.transform = `translate3d(${(lean.x * -near).toFixed(1)}px,${(scrollY * l.dataset.speed).toFixed(1)}px,0)`;
    });
  }

  /* the route draws as the reader moves through the five days */
  const r = journey.getBoundingClientRect();
  const target = still ? 1 : clamp((innerHeight * 0.5 - r.top) / (r.height - innerHeight * 0.5), 0, 1);
  /* the line has weight: what is drawn eases towards where the reader is */
  shownP = still ? target : shownP + (target - shownP) * 0.1;
  const p = shownP;
  /* letterbox while the map holds the screen */
  document.documentElement.classList.toggle('film', !still && r.top < innerHeight * 0.1 && r.bottom > innerHeight * 0.9);
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
  /* depth: the day's label drifts slower than its heading */
  if (!still)
    days.forEach((d) => {
      const b = d.getBoundingClientRect();
      if (b.bottom < 0 || b.top > innerHeight) return;
      d.style.setProperty('--shift', ((b.top + b.height / 2 - innerHeight / 2) / innerHeight).toFixed(3));
    });
  if (leaning || Math.abs(target - shownP) > 0.0004) queue();
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

/* ---- the scroll kit, the same in all five projects: navigation that follows the reader, reveals, a zoom that
   follows the scroll, a snapping carousel with buttons, and a list that loads more as you reach it ---- */
(() => {
  const root = document.documentElement;
  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !root.classList.contains('motion-on');

  /* scroll-linked navigation: the link to the section in view is marked as the current location */
  const links = [...document.querySelectorAll('header nav a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = `#${e.target.id}`;
        links.forEach((a) => (a.getAttribute('href') === id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
      }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  targets.forEach((t) => spy.observe(t));

  /* reveal on scroll: pieces marked .kit-reveal fade and rise once, as they enter */
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('kit-in');
        reveal.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.kit-reveal').forEach((el) => reveal.observe(el));

  /* zoom on scroll: the picture inside .kit-zoom starts larger and settles to its frame as the frame crosses the screen */
  const zooms = [...document.querySelectorAll('.kit-zoom')];
  let queued = false;
  function zoom() {
    queued = false;
    zooms.forEach((z) => {
      const r = z.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      z.style.setProperty('--zoom', calm() ? '1' : (1.28 - p * 0.28).toFixed(3));
    });
  }
  if (zooms.length) {
    addEventListener(
      'scroll',
      () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(zoom);
        }
      },
      { passive: true },
    );
    zoom();
  }

  /* snapping carousel: the track snaps by itself; the buttons move it one card at a time */
  document.querySelectorAll('.kit-carousel').forEach((c) => {
    const track = c.querySelector('.kit-track');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width ?? 300) + 16;
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: calm() ? 'auto' : 'smooth' });
    c.querySelector('[data-dir="-1"]')?.addEventListener('click', () => go(-1));
    c.querySelector('[data-dir="1"]')?.addEventListener('click', () => go(1));
  });

  /* infinite scroll: when the end of a .kit-feed comes near, the next items are copied in from its template;
     the button does the same for keyboards, and the status line says when there is nothing more */
  document.querySelectorAll('.kit-feed').forEach((feed) => {
    const list = feed.querySelector('.kit-list');
    const pool = [...feed.querySelector('template').content.children];
    const more = feed.querySelector('.kit-more');
    const status = feed.querySelector('.kit-status');
    const load = () => {
      const next = pool.splice(0, 3);
      next.forEach((el) => list.append(el.cloneNode(true)));
      status.textContent = pool.length ? `${list.children.length} shown` : 'That is everything.';
      if (!pool.length) {
        more.hidden = true;
        watch.disconnect();
        return;
      }
      /* observe again: if the end is still in reach after the new items, this loads the next ones too */
      watch.unobserve(end);
      watch.observe(end);
    };
    const watch = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && load(), { rootMargin: '0px 0px 200px 0px' });
    const end = feed.querySelector('.kit-end');
    watch.observe(end);
    more.addEventListener('click', load);
  });
})();
