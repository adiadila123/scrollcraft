'use client';
import { useEffect, useEffectEvent } from 'react';

/**
 * Calls fn with the scroll position at most once per frame, on scroll and on resize, and once on mount.
 * Lenis drives native scrolling, so the window scroll event covers both smooth and native modes.
 */
export function useScroll(fn: (y: number, vh: number) => void, deps: unknown[] = []) {
  const onFrame = useEffectEvent(fn);
  useEffect(() => {
    let queued = 0;
    const run = () => {
      queued = 0;
      onFrame(window.scrollY || 0, window.innerHeight);
    };
    const queue = () => {
      if (!queued) queued = requestAnimationFrame(run);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    run();
    return () => {
      cancelAnimationFrame(queued);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
