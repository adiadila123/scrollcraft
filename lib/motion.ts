export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** localStorage key for the reader's choice when their device asks for less motion: 'on' or 'off'. */
export const MOTION_KEY = 'sc-motion';

/** The device or browser asks for less motion (on many lab and remote-desktop machines this is set by policy). */
export function systemReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** The reader's answer to the notice shown when the device asks for less motion, or null if not answered yet. */
export function motionChoice(): 'on' | 'off' | null {
  try {
    const v = localStorage.getItem(MOTION_KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

/** The device asks for less motion, and the reader turned animations on anyway. */
export const motionOverride = () => systemReducedMotion() && motionChoice() === 'on';

/**
 * Pages shown in frames cannot read the reader's choice, so it is passed in. A preview's source has its
 * reduced-motion query made impossible to match (in its CSS and its scripts alike); an example site gets ?motion=on.
 */
export const withMotion = (doc: string) => doc.replaceAll('(prefers-reduced-motion: reduce)', '(prefers-reduced-motion: reduce) and (scripting: none)');
export const withMotionParam = (src: string) => `${src}?motion=on`;

/** Reduced motion is respected unless the reader turned animations back on themselves. */
export function prefersReducedMotion(): boolean {
  return systemReducedMotion() && motionChoice() !== 'on';
}

export function finePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Seeded PRNG so the particle shapes come out the same on every load. */
export function mulberry(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let q = Math.imul(a ^ (a >>> 15), 1 | a);
    q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q;
    return ((q ^ (q >>> 14)) >>> 0) / 4294967296;
  };
}

/** Reads a localStorage value without throwing in private mode or on the server. */
export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
