'use client';
import { useEffect } from 'react';

type Flags = Window & { __scrollcraft?: boolean; __allScripts?: boolean; THREE?: unknown; Lenis?: unknown };

/**
 * Starts the scroll engine after hydration: three.js and Lenis come from npm instead of a CDN,
 * then the hero, the router and scroll effects, and the playground experiments are initialised once.
 */
export default function Engine() {
  useEffect(() => {
    const win = window as Flags;
    if (win.__scrollcraft) return;
    win.__scrollcraft = true;
    (async () => {
      const [THREE, lenis] = await Promise.all([import('three'), import('lenis')]);
      win.THREE = THREE;
      win.Lenis = lenis.default;
      const [hero, site, lab] = await Promise.all([
        import('@/lib/legacy/hero'),
        import('@/lib/legacy/site'),
        import('@/lib/legacy/lab'),
      ]);
      hero.default();
      site.default();
      lab.default();
      win.__allScripts = true;
    })();
  }, []);
  return null;
}
