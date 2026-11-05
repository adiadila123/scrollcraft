'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { routeOf } from '@/lib/chapters';
import { markDone } from '@/lib/progress';

/** Invisible marker at the end of a chapter. Once it scrolls into view, the chapter counts as read. */
export default function ChapterDone() {
  const ref = useRef<HTMLSpanElement>(null);
  const route = routeOf(usePathname());
  useEffect(() => {
    const el = ref.current;
    if (!el || route === 'home') return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        markDone(route);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [route]);
  return <span ref={ref} aria-hidden="true" />;
}
