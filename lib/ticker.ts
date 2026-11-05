/**
 * One requestAnimationFrame loop for the whole site. Lenis, the hero, the particle canvases and the
 * playground all subscribe here instead of running their own loops, and the loop stops while the tab is hidden.
 */
export type Tick = (time: number, dt: number) => void;

const subs = new Set<Tick>();
let raf = 0;
let last = 0;

function frame(time: number) {
  const dt = Math.min(0.05, (time - last) / 1000);
  last = time;
  subs.forEach((fn) => fn(time, dt));
  raf = subs.size ? requestAnimationFrame(frame) : 0;
}

function start() {
  if (raf || !subs.size || document.hidden) return;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

/** Runs fn on every frame until the returned function is called. */
export function subscribe(fn: Tick): () => void {
  subs.add(fn);
  start();
  return () => {
    subs.delete(fn);
    if (!subs.size) stop();
  };
}
