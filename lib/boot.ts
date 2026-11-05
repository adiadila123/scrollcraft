/**
 * Shared state between the loader and the hero. The loader reads the milestones to drive its counter,
 * and the hero waits for loaderDone before the particles assemble.
 */
export type Boot = { three: boolean; hero: boolean; failed: boolean; loaderDone: boolean };

const state: Boot = { three: false, hero: false, failed: false, loaderDone: true };
const listeners = new Set<() => void>();

export const boot = {
  get: () => state,
  set(patch: Partial<Boot>) {
    Object.assign(state, patch);
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
