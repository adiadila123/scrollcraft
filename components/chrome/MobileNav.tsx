'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { chapters, getChapter, neighbours, routeOf } from '@/lib/chapters';
import { useProgress } from '@/lib/progress';

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === 'left' ? 'M14.5 6l-6 6 6 6' : 'M9.5 6l6 6-6 6'} />
  </svg>
);

/**
 * The phone navigation for a course read in order: previous and next chapter under the thumbs, and in the middle
 * where you are, which opens every chapter with what you have already read.
 */
export default function MobileNav() {
  const route = routeOf(usePathname());
  const { done } = useProgress();
  /* the sheet remembers the route it was opened on, so navigating anywhere closes it */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === route;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = getChapter(route);
  const { prev, next } = neighbours(route);
  const prevHref = prev ? `/${prev.id}` : current ? '/' : null;

  /* dialog behaviour: focus moves in, Tab stays inside, Escape closes, focus returns to the toggle */
  useEffect(() => {
    if (!open) return;
    const card = cardRef.current!;
    const items = () => Array.from(card.querySelectorAll<HTMLElement>('a, button'));
    (card.querySelector<HTMLElement>('[aria-current]') ?? items()[0])?.focus();
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
    const toggle = toggleRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <nav className="tabbar" id="tabbar" aria-label="Course">
        {prevHref ? (
          <Link className="tab tab-step" href={prevHref} aria-label={prev ? `Previous: ${prev.title}` : 'Previous: home'}>
            <Chevron dir="left" />
            <span>{prev ? prev.title : 'Home'}</span>
          </Link>
        ) : (
          <span className="tab tab-step" aria-hidden="true" />
        )}
        <button
          ref={toggleRef}
          className="tab tab-where"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpenOn(open ? null : route)}
        >
          <b>{current ? `${Number(current.n)} · ${current.title}` : 'Chapters'}</b>
          <span className="tab-dots" aria-hidden="true">
            {chapters.map((c) => (
              <i key={c.id} className={c.id === route ? 'now' : done.includes(c.id) ? 'read' : undefined} />
            ))}
          </span>
          <span className="sr-only">
            , {done.length} of {chapters.length} read. Show all chapters
          </span>
        </button>
        {next ? (
          <Link className="tab tab-step" href={`/${next.id}`} aria-label={`Next: ${next.title}`}>
            <span>{next.title}</span>
            <Chevron dir="right" />
          </Link>
        ) : (
          <span className="tab tab-step" aria-hidden="true" />
        )}
      </nav>
      <div className="sheet" hidden={!open}>
        <div className="sheet-bg" onClick={() => setOpenOn(null)}></div>
        <div className="sheet-card" role="dialog" aria-modal="true" aria-label="All chapters" ref={cardRef}>
          <div className="sheet-grab" aria-hidden="true"></div>
          <div className="sheet-h">
            <span>All chapters</span>
            <span>
              {done.length} of {chapters.length} read
            </span>
          </div>
          {chapters.map((c) => (
            <Link key={c.id} href={`/${c.id}`} aria-current={route === c.id ? 'page' : undefined} onClick={() => setOpenOn(null)}>
              <span className="mono">{c.n}</span>
              <b>{c.title}</b>
              <em>{done.includes(c.id) ? 'Read' : c.desc}</em>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
