/* Field Studio: one scroll loop for the clip reveals and the horizontal gallery,
   one animation loop for the marquee, which keeps drifting when the page is still. */
document.documentElement.classList.add('js');
/* reduced motion is respected, unless the page was opened with ?motion=on: the tutorial adds it when the reader
   has turned animations on although their device asks for less motion */
const motionOn = new URLSearchParams(location.search).get('motion') === 'on';
if (motionOn) document.documentElement.classList.add('motion-on');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches && !motionOn;
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
    fig.firstElementChild.style.transform = `scale(${(1.25 - 0.21 * e).toFixed(3)})`;
    /* the artwork's layers settle at different speeds: the far ones barely move, the near ones travel most */
    fig.querySelectorAll('[data-depth]').forEach((l) => {
      l.style.transform = `translateY(${((1 - e) * +l.dataset.depth).toFixed(1)}px)`;
    });
  });
}

/* the hero's last line, "that move.", moves: it slides right as the hero scrolls away */
const hero = document.querySelector('.hero');
/* the line's outer mask moves, so its rise-in reveal on the inner span is left alone */
const mover = hero.querySelector('.dim').parentElement;
function moveHero() {
  const r = hero.getBoundingClientRect();
  const p = still ? 0 : clamp(-r.top / r.height, 0, 1);
  mover.style.transform = `translate3d(${(p * 12).toFixed(2)}vw,0,0)`;
}

/* horizontal gallery: the section is as tall as the strip overflows, so scrolling down moves it sideways one to one */
const hs = document.querySelector('.hs');
const pin = hs.querySelector('.hs-pin');
const track = hs.querySelector('.hs-track');
const bar = hs.querySelector('.hs-progress i');
let max = 0;
function measure() {
  max = Math.max(0, track.scrollWidth - pin.clientWidth);
  hs.style.height = `${max + pin.offsetHeight}px`;
}
/* the strip has weight: the position shown eases towards the scrolled one */
let shownP = 0;
function moveTrack() {
  const r = hs.getBoundingClientRect();
  const target = clamp(-r.top / (max || 1), 0, 1);
  shownP = still ? target : shownP + (target - shownP) * 0.12;
  track.style.transform = `translate3d(${(-shownP * max).toFixed(1)}px,0,0)`;
  bar.style.transform = `scaleX(${shownP.toFixed(3)})`;
  /* letterbox while the strip holds the screen */
  document.documentElement.classList.toggle('film', !still && r.top <= 1 && r.bottom >= innerHeight - 1);
  return Math.abs(target - shownP) > 0.0004;
}

/* a fine pointer moves each artwork's layers by their depth, so the frames feel like windows */
const lean = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener(
  'pointermove',
  (e) => {
    if (still || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    lean.tx = (e.clientX / innerWidth) * 2 - 1;
    lean.ty = (e.clientY / innerHeight) * 2 - 1;
    queue();
  },
  { passive: true },
);
function leanArt() {
  lean.x += (lean.tx - lean.x) * 0.08;
  lean.y += (lean.ty - lean.y) * 0.08;
  document.documentElement.style.setProperty('--lx', lean.x.toFixed(3));
  document.documentElement.style.setProperty('--ly', lean.y.toFixed(3));
  return Math.abs(lean.tx - lean.x) + Math.abs(lean.ty - lean.y) > 0.002;
}

/* the statement: split into words once; the share that is dark follows the reader through the section */
const manifesto = document.querySelector('.manifesto');
const words = manifesto.querySelector('.words');
words.innerHTML = words.textContent
  .trim()
  .split(/\s+/)
  .map((w) => `<span>${w}</span>`)
  .join(' ');
const spans = [...words.children];
function lightWords() {
  const r = manifesto.getBoundingClientRect();
  const p = still ? 1 : clamp((innerHeight * 0.7 - r.top) / (r.height * 0.75), 0, 1);
  const lit = Math.round(p * spans.length);
  spans.forEach((s, k) => s.classList.toggle('lit', k < lit));
}

let queued = false;
function update() {
  queued = false;
  revealClips();
  moveHero();
  lightWords();
  const gliding = moveTrack();
  const leaning = leanArt();
  if (gliding || leaning) queue();
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

/* reading progress, along the top edge, in its own scheduled frame */
{
  const progress = document.querySelector('.progress');
  let pending = false;
  const paint = () => {
    pending = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? (scrollY / max).toFixed(4) : 0})`;
  };
  addEventListener(
    'scroll',
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(paint);
      }
    },
    { passive: true },
  );
  paint();
}
