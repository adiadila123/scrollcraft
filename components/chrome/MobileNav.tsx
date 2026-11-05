'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useSmoothScroll } from '@/components/engine/SmoothScroll';
import { chapters, routeOf, tabIds } from '@/lib/chapters';
import { useProgress } from '@/lib/progress';

const icons: Record<string, ReactNode> = {
  start: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5z" />
    </>
  ),
  skills: <path d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z" />,
  build: <path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />,
  motion: <path d="M3 12c3-6 6-6 9 0s6 6 9 0" />,
};

const TABS = [...tabIds, 'more'];

/** iOS-style floating tab bar for phones, and the bottom sheet behind its More tab. */
export default function MobileNav() {
  const route = routeOf(usePathname());
  const { toTop } = useSmoothScroll();
  const { done } = useProgress();
  /* the sheet remembers the route it was opened on, so navigating anywhere closes it */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === route;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenOn((typeof v === 'function' ? v(open) : v) ? route : null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const active = tabIds.includes(route) ? route : route === 'home' ? '' : 'more';
  const idx = TABS.indexOf(active);

  /* dialog behaviour: focus moves in, Tab stays inside, Escape closes, focus returns to More */
  useEffect(() => {
    if (!open) return;
    const card = cardRef.current!;
    const items = () => Array.from(card.querySelectorAll<HTMLElement>('a, button'));
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenOn(null);
      if (e.key !== 'Tab') return;
      const list = items();
      const firstEl = list[0],
        lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const more = moreRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      more?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <nav className="tabbar" id="tabbar" aria-label="Chapters">
        <span className="tab-ind" style={{ '--i': Math.max(idx, 0), opacity: idx >= 0 ? 1 : 0 } as CSSProperties}></span>
        {tabIds.map((id) => {
          const c = chapters.find((x) => x.id === id)!;
          return (
            <Link
              key={id}
              className="tab"
              href={`/${id}`}
              aria-current={active === id ? 'page' : undefined}
              onClick={(e) => {
                if (route === id) {
                  e.preventDefault();
                  toTop(true);
                }
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {icons[id]}
              </svg>
              {c.title}
            </Link>
          );
        })}
        <button
          ref={moreRef}
          className="tab"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-current={active === 'more' ? 'page' : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="5.5" cy="12" r="1.4" />
            <circle cx="12" cy="12" r="1.4" />
            <circle cx="18.5" cy="12" r="1.4" />
          </svg>
          More
        </button>
      </nav>
      <div className="sheet" hidden={!open}>
        <div className="sheet-bg" onClick={() => setOpen(false)}></div>
        <div className="sheet-card" role="dialog" aria-modal="true" aria-label="All chapters" ref={cardRef}>
          <div className="sheet-grab" aria-hidden="true"></div>
          <div className="mono sheet-h">All chapters</div>
          {chapters.map((c) => (
            <Link key={c.id} href={`/${c.id}`} aria-current={route === c.id ? 'page' : undefined} onClick={() => setOpen(false)}>
              <span className="mono">{c.n}</span>
              <b>{c.title}</b>
              <em>{done.includes(c.id) ? 'Done' : c.desc}</em>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
