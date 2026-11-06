'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { chapterHref, getChapter, neighbours, routeOf } from '@/lib/chapters';
import { finePointer, prefersReducedMotion } from '@/lib/motion';
import { rememberFlight } from '@/lib/particles/manager';
import { markVisited } from '@/lib/progress';
import { useScroll } from '@/lib/useScroll';
import { useSmoothScroll } from './SmoothScroll';

/** Is the keyboard focus somewhere that types text? Shortcuts stay out of the way there. */
function typing(el: Element | null) {
  return !!el && (el.matches('input, textarea, select, [contenteditable="true"]') || !!el.closest('[role="dialog"]'));
}

/**
 * Everything that happens per route: scroll position and focus after navigation, scroll reveals,
 * the progress hairline, magnetic buttons, and the [ and ] shortcuts for the previous and next chapter.
 */
export default function RouteEffects() {
  const pathname = usePathname();
  const router = useRouter();
  const { lenis } = useSmoothScroll();
  const bar = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const route = routeOf(pathname);

  /* links from the old single-page site (/#build) still work */
  useEffect(() => {
    const old = location.hash.slice(1);
    if (pathname === '/' && getChapter(old)) router.replace(chapterHref(old));
  }, [pathname, router]);

  /* scroll position and focus after a client-side navigation */
  useEffect(() => {
    if (route !== 'home') markVisited(route);
    const l = lenis();
    l?.resize();
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      if (l) l.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo(0, top);
    } else if (!first.current) {
      if (l) l.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    }
    if (!first.current) {
      const h = document.querySelector<HTMLElement>('#content h1');
      if (h) {
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    }
    first.current = false;
  }, [pathname, lenis, route]);

  /* reveal on scroll: transform and opacity only, and content stays visible once shown */
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('#content .rv');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    items.forEach((el, i) => {
      el.style.setProperty('--d', `${Math.min(i % 4, 3) * 0.06}s`);
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  /* magnetic buttons, fine pointers only */
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const offs = els.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px)`;
      };
      const leave = () => (el.style.transform = '');
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        el.style.transform = '';
      };
    });
    return () => offs.forEach((off) => off());
  }, [pathname]);

  /* [ and ] move between chapters */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(document.activeElement)) return;
      if (e.key !== '[' && e.key !== ']') return;
      const { prev, next } = neighbours(route);
      const to = e.key === '[' ? (prev ? prev.id : route === 'home' ? null : 'home') : next?.id;
      if (!to) return;
      /* stepping forward from the end band flies its shape on, as clicking the band's link does */
      const cv = document.querySelector<HTMLCanvasElement>('.nb-art canvas');
      if (e.key === ']' && next && cv && cv.getBoundingClientRect().top < innerHeight) rememberFlight(cv, next.art);
      router.push(chapterHref(to));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, router]);

  useScroll(
    (y, vh) => {
      const max = document.documentElement.scrollHeight - vh;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    },
    [pathname],
  );

  return <div className="progress" ref={bar} aria-hidden="true" />;
}
