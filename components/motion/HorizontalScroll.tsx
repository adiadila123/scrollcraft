'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { clamp, prefersReducedMotion } from '@/lib/motion';
import { useScroll } from '@/lib/useScroll';

/**
 * Technique 8: a pinned section that turns vertical scroll into sideways movement. The wrapper is sized so the
 * vertical scroll distance equals the track overflow, after fonts load and whenever the track resizes.
 */
export default function HorizontalScroll({ head, children }: { head: ReactNode; children: ReactNode }) {
  const hs = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const max = useRef(0);

  useEffect(() => {
    /* with reduced motion the track is a plain sideways-scrolling strip, so keyboard users must be able to reach it */
    if (prefersReducedMotion()) {
      track.current?.setAttribute('tabindex', '0');
      return;
    }
    let alive = true;
    const measure = () => {
      /* fonts.ready can resolve after the page has been left, when the refs are already null */
      const p = pin.current,
        t = track.current,
        h = hs.current;
      if (!alive || !p || !t || !h || !p.offsetHeight) return;
      t.style.transform = '';
      max.current = Math.max(0, t.scrollWidth - p.clientWidth);
      h.style.height = max.current ? `${max.current + p.offsetHeight}px` : '';
      window.dispatchEvent(new Event('scroll'));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track.current!);
    ro.observe(pin.current!);
    document.fonts.ready.then(measure);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  useScroll(() => {
    if (!max.current || !hs.current) return;
    const bar0 = document.getElementById('topbar')?.offsetHeight ?? 0;
    const p = clamp((bar0 - hs.current.getBoundingClientRect().top) / max.current, 0, 1);
    track.current!.style.transform = `translate3d(${(-p * max.current).toFixed(1)}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
  });

  return (
    <section className="hs" ref={hs}>
      <div className="hs-pin" ref={pin}>
        {head}
        <div className="hs-track" ref={track}>
          {children}
        </div>
        <div className="hs-prog" aria-hidden="true">
          <i ref={bar}></i>
        </div>
      </div>
    </section>
  );
}
