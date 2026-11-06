import { mulberry, prefersReducedMotion } from '@/lib/motion';
import { subscribe } from '@/lib/ticker';
import { drawShape, makeShape, type Shape } from './shapes';

export const FACE_SRC = '/face.jpg';

type Inst = {
  cv: HTMLCanvasElement;
  kind: string;
  ctx: CanvasRenderingContext2D;
  shape: Shape | null;
  vis: boolean;
  ready: boolean;
  painted: boolean;
  dpr: number;
  mx: number;
  my: number;
  /** how visible the canvas is, 0..1, as set by its owner: invisible ones stop drawing, faint ones draw at half rate */
  level: number;
};

/* All particle canvases share one ResizeObserver, one IntersectionObserver, one pointer listener and the site ticker. */
const insts = new Map<HTMLCanvasElement, Inst>();
let ro: ResizeObserver | null = null;
let io: IntersectionObserver | null = null;
let stopTick: (() => void) | null = null;
let t0 = 0;
let face: { w: number; h: number; d: Uint8ClampedArray } | null = null;
let tick = 0;

/** Phones and laptops with few cores or little memory, or with data saver on: lower resolution, half frame rate. */
const lowPower = () => {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (n.hardwareConcurrency || 8) <= 4 || (n.deviceMemory ?? 8) <= 4 || !!n.connection?.saveData;
};
let faceLoading = false;

function paintFace(inst: Inst) {
  inst.painted = true;
  const D = face;
  if (!D) return;
  const { cv, ctx: c } = inst,
    w = cv.width,
    h = cv.height;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'source-over';
  c.fillStyle = '#000';
  c.fillRect(0, 0, w, h);
  const sc = (h * 1.02) / D.h,
    ox = (w - D.w * sc) / 2,
    oy = (h - D.h * sc) / 2,
    st = 2,
    R = mulberry(5);
  c.globalCompositeOperation = 'lighter';
  for (let y = 0; y < D.h; y += st)
    for (let x = 0; x < D.w; x += st) {
      const i = (y * D.w + x) * 4,
        r = D.d[i],
        g = D.d[i + 1],
        b = D.d[i + 2];
      const v = Math.max(r, g, b) / 255;
      if (v < 0.22) continue;
      c.fillStyle = `rgb(${Math.min(255, (r * 1.4) | 0)},${Math.min(255, (g * 1.4) | 0)},${Math.min(255, (b * 1.4) | 0)})`;
      c.beginPath();
      c.arc(ox + (x + R() * st) * sc, oy + (y + R() * st) * sc, sc * st * (0.26 + 0.6 * v), 0, 6.2832);
      c.fill();
    }
}

function ensureFace() {
  if (face || faceLoading) return;
  faceLoading = true;
  const im = new Image();
  im.onload = () => {
    const cc = document.createElement('canvas');
    cc.width = im.width;
    cc.height = im.height;
    const cx = cc.getContext('2d', { willReadFrequently: true })!;
    cx.drawImage(im, 0, 0);
    face = { w: im.width, h: im.height, d: cx.getImageData(0, 0, im.width, im.height).data };
    insts.forEach((p) => {
      if (p.kind === 'face' && p.ready && p.vis) paintFace(p);
    });
  };
  im.onerror = () => {
    faceLoading = false;
  };
  im.src = FACE_SRC;
}

function showFace(inst: Inst) {
  if (face) paintFace(inst);
  else ensureFace();
}

function size(inst: Inst) {
  const { cv } = inst,
    w = cv.clientWidth,
    h = cv.clientHeight;
  if (!w || !h) return;
  const d = Math.min(window.devicePixelRatio || 1, lowPower() ? 1 : 2) * (inst.kind === 'face' ? 1.5 : 1);
  const bw = Math.min(Math.round(w * d), 3200);
  cv.width = bw;
  cv.height = Math.round((h * bw) / w);
  inst.dpr = bw / w;
  inst.ready = true;
  inst.painted = false;
  if (inst.kind === 'face') {
    if (inst.vis) showFace(inst);
  } else if (prefersReducedMotion() && inst.shape) drawShape(inst.ctx, cv.width, cv.height, inst.dpr, inst.shape, 3, 0, 0);
}

function onPointer(e: PointerEvent) {
  insts.forEach((p) => {
    if (!p.vis || p.kind === 'face') return;
    const r = p.cv.getBoundingClientRect();
    if (!r.width) return;
    p.mx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    p.my = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)));
  });
}

function frame(now: number) {
  const t = (now - t0) / 1000;
  const odd = ++tick % 2 === 1;
  const slow = lowPower();
  insts.forEach((p) => {
    if (p.level < 0.02 || (odd && (slow || p.level < 0.35))) return;
    if (p.shape && p.ready && p.vis) drawShape(p.ctx, p.cv.width, p.cv.height, p.dpr, p.shape, t, p.mx, p.my);
  });
}

function setup() {
  ro = new ResizeObserver((es) =>
    es.forEach((e) => {
      const p = insts.get(e.target as HTMLCanvasElement);
      if (p) size(p);
    }),
  );
  io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        const p = insts.get(e.target as HTMLCanvasElement);
        if (!p) return;
        p.vis = e.isIntersecting;
        if (p.vis && p.kind === 'face' && p.ready && !p.painted) showFace(p);
      }),
    { rootMargin: '120px' },
  );
  window.addEventListener('pointermove', onPointer, { passive: true });
  /* the clock keeps running across pages, so a shape that flies from one page to the next arrives already formed */
  if (!t0) t0 = performance.now();
  if (!prefersReducedMotion()) stopTick = subscribe(frame);
}

function teardown() {
  ro?.disconnect();
  io?.disconnect();
  ro = io = null;
  window.removeEventListener('pointermove', onPointer);
  stopTick?.();
  stopTick = null;
}

/** Where a shape was drawn on screen (centre and size), so the next page can fly the same shape on from there. */
const FLY = 'sc-fly';
type Fly = { kind: string; x: number; y: number; s: number; at: number };

export function rememberFlight(cv: HTMLCanvasElement | null | undefined, kind: string) {
  if (!cv) return;
  const r = cv.getBoundingClientRect();
  const f: Fly = { kind, x: r.left + r.width / 2, y: r.top + r.height / 2, s: Math.min(r.width, r.height), at: Date.now() };
  try {
    sessionStorage.setItem(FLY, JSON.stringify(f));
  } catch {}
}

/** Animates a canvas from the remembered position of the same shape to where it now sits. Runs once, within 3 seconds. */
export function landFlight(cv: HTMLCanvasElement | null | undefined, kind: string) {
  let f: Fly | null = null;
  try {
    f = JSON.parse(sessionStorage.getItem(FLY) ?? 'null');
    sessionStorage.removeItem(FLY);
  } catch {}
  if (!cv || !f || f.kind !== kind || Date.now() - f.at > 3000 || prefersReducedMotion()) return;
  const r = cv.getBoundingClientRect();
  const s = Math.min(r.width, r.height);
  if (!s) return;
  const dx = f.x - (r.left + r.width / 2), dy = f.y - (r.top + r.height / 2), k = f.s / s;
  cv.animate(
    [{ transform: `translate(${dx}px, ${dy}px) scale(${k})` }, { transform: 'none' }],
    { duration: 1100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
}

/** Tells the manager how visible a canvas is (its opacity), so faded-out backdrops cost little or nothing. */
export function setLevel(cv: HTMLCanvasElement | null | undefined, level: number) {
  const p = cv && insts.get(cv);
  if (p) p.level = level;
}

/** Starts drawing a particle shape into a canvas. Returns the function that stops it. */
export function register(cv: HTMLCanvasElement, kind: string): () => void {
  const ctx = cv.getContext('2d');
  if (!ctx) return () => {};
  if (!insts.size) setup();
  const inst: Inst = { cv, kind, ctx, shape: kind === 'face' ? null : makeShape(kind), vis: false, ready: false, painted: false, dpr: 1, mx: 0, my: 0, level: 1 };
  insts.set(cv, inst);
  ro!.observe(cv);
  io!.observe(cv);
  return () => {
    ro?.unobserve(cv);
    io?.unobserve(cv);
    insts.delete(cv);
    if (!insts.size) teardown();
  };
}
