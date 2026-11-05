'use client';
import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { subscribe } from '@/lib/ticker';

type Scroll = { toTop: (smooth: boolean) => void; lenis: () => Lenis | null };
const Ctx = createContext<Scroll>({ toTop: () => {}, lenis: () => null });

/** Inertial smooth scrolling. Off when the visitor prefers reduced motion, so the page scrolls natively. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.2, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true, autoRaf: false });
    ref.current = lenis;
    const off = subscribe((time) => lenis.raf(time));
    return () => {
      off();
      lenis.destroy();
      ref.current = null;
    };
  }, []);

  const toTop = useCallback((smooth: boolean) => {
    const lenis = ref.current;
    if (lenis) lenis.scrollTo(0, { immediate: !smooth, force: true });
    else window.scrollTo({ top: 0, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' });
  }, []);

  const lenis = useCallback(() => ref.current, []);
  return <Ctx.Provider value={{ toTop, lenis }}>{children}</Ctx.Provider>;
}

export const useSmoothScroll = () => useContext(Ctx);
