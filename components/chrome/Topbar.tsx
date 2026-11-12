'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { chapterHref, chaptersFor, getChapter, routeOf } from '@/lib/chapters';
import { stripLocale, withLocale } from '@/lib/i18n';
import { useProgress } from '@/lib/progress';
import { useLocale } from '@/lib/useLocale';
import { useScroll } from '@/lib/useScroll';
import { openPalette } from './CommandPalette';

const LEVELS = [1, 2, 3, 4] as const;

/* hover opens a panel only for a real mouse; touch and pen open it with a tap */
const mouse = (e: ReactPointerEvent) => e.pointerType === 'mouse';

/**
 * Transparent over the hero, solid once scrolled or on any other page. The chapters are grouped by level: each level
 * is a button that opens a panel with its chapters, what you have read and where you are. The appendix has a single
 * chapter, so it is a plain link. Hovering opens a panel too, after a short delay so crossing the bar does not.
 */
export default function Topbar() {
  const pathname = usePathname();
  const route = routeOf(pathname);
  const { locale, t } = useLocale();
  const n = t.nav;
  /* the same page in the other language; a full load, because each language has its own document */
  const other = withLocale(locale === 'en' ? 'ro' : 'en', stripLocale(pathname));
  const [scrolled, setScrolled] = useState(false);
  useScroll((y) => setScrolled(y > 8));
  const solid = route !== 'home' || scrolled;

  const chapters = chaptersFor(locale);
  const current = getChapter(route, locale);
  const { done } = useProgress();

  /* the open panel remembers the route it was opened on, so following any link closes it */
  const [openAt, setOpenAt] = useState<{ level: number; route: string } | null>(null);
  const open = openAt?.route === route ? openAt.level : 0;
  const bar = useRef<HTMLElement>(null);
  const timer = useRef(0);
  const later = (level: number, ms: number) => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenAt(level ? { level, route } : null), ms);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  /* Escape closes and hands focus back to the level's button; a press outside the bar closes */
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenAt(null);
      bar.current?.querySelector<HTMLElement>(`[aria-controls="tb-level-${open}"]`)?.focus();
    };
    const press = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setOpenAt(null);
    };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', press);
    return () => {
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', press);
    };
  }, [open]);

  return (
    <header className={solid || open ? 'topbar solid' : 'topbar'} id="topbar" ref={bar} onPointerLeave={(e) => mouse(e) && later(0, 220)}>
      <Link className="mark" href={chapterHref('home', locale)}>
        Scrollcraft
      </Link>
      <nav className="tb-nav" aria-label={n.primary}>
        <ul className="tb-levels">
          {LEVELS.map((level) => {
            const list = chapters.filter((c) => c.level === level);
            if (list.length === 1) {
              const c = list[0];
              return (
                <li key={level}>
                  <Link
                    className="tb-level"
                    href={chapterHref(c.id, locale)}
                    aria-current={route === c.id ? 'page' : undefined}
                    onPointerEnter={(e) => mouse(e) && later(0, 120)}
                  >
                    {c.nav}
                  </Link>
                </li>
              );
            }
            const read = list.filter((c) => done.includes(c.id)).length;
            return (
              <li key={level}>
                <button
                  type="button"
                  className="tb-level"
                  aria-expanded={open === level}
                  aria-controls={`tb-level-${level}`}
                  data-here={current?.level === level ? '' : undefined}
                  onClick={() => {
                    clearTimeout(timer.current);
                    setOpenAt(open === level ? null : { level, route });
                  }}
                  onPointerEnter={(e) => mouse(e) && later(level, open ? 60 : 140)}
                >
                  {n.levelNames[level - 1]}
                  <span className="tb-range mono" aria-hidden="true">
                    {list[0].n}–{list[list.length - 1].n}
                  </span>
                  <svg className="tb-caret" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2 3.5l3 3 3-3" />
                  </svg>
                </button>
                <div className="tb-panel" id={`tb-level-${level}`} hidden={open !== level}>
                  <div className="tb-panel-in">
                    <div className="tb-intro">
                      <p className="tb-kicker mono">{n.levels[level - 1]}</p>
                      <p className="tb-line">{n.levelLines[level - 1]}</p>
                      <p className="tb-read mono">
                        <span className="tb-meter" aria-hidden="true">
                          <i style={{ transform: `scaleX(${read / list.length})` }} />
                        </span>
                        {n.readOf(read, list.length)}
                      </p>
                    </div>
                    <ul className="tb-list">
                      {list.map((c) => (
                        <li key={c.id}>
                          <Link href={chapterHref(c.id, locale)} aria-current={route === c.id ? 'page' : undefined}>
                            <span className="tb-n mono">{c.n}</span>
                            <span className="tb-t">{c.title}</span>
                            <span className="tb-d">
                              {done.includes(c.id) ? (
                                <>
                                  <span className="tb-done">{n.read}</span> · {c.desc}
                                </>
                              ) : (
                                c.desc
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="top-tools">
        {current ? (
          <span className="tb-where mono">
            <span aria-hidden="true">
              {current.n}
              <span className="tb-of"> / {chapters.length}</span>
            </span>
            <span className="sr-only">{n.where(current.n, chapters.length)}</span>
          </span>
        ) : null}
        <button type="button" className="kbd-btn mono" onClick={openPalette} aria-keyshortcuts="Meta+K Control+K">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <span className="kbd-label">{n.search}</span>
          <kbd aria-hidden="true">⌘K</kbd>
        </button>
        <a
          className="lang"
          href={other}
          hrefLang={locale === 'en' ? 'ro' : 'en'}
          lang={locale === 'en' ? 'ro' : 'en'}
          aria-label={`${locale === 'en' ? 'RO' : 'EN'} · ${t.lang.switchLabel}`}
        >
          {locale === 'en' ? 'RO' : 'EN'}
        </a>
      </div>
    </header>
  );
}
