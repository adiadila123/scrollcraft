'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { chapterHref, chaptersFor, routeOf } from '@/lib/chapters';
import { stripLocale, withLocale } from '@/lib/i18n';
import { useLocale } from '@/lib/useLocale';
import { useScroll } from '@/lib/useScroll';
import { openPalette } from './CommandPalette';

/** Transparent over the hero, solid once scrolled or on any other page. */
export default function Topbar() {
  const pathname = usePathname();
  const route = routeOf(pathname);
  const { locale, t } = useLocale();
  /* the same page in the other language; a full load, because each language has its own document */
  const other = withLocale(locale === 'en' ? 'ro' : 'en', stripLocale(pathname));
  const [scrolled, setScrolled] = useState(false);
  useScroll((y) => setScrolled(y > 8));
  const solid = route !== 'home' || scrolled;
  /* the menu scrolls sideways when it does not fit: bring the current chapter into view */
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = menu.current;
    const cur = nav?.querySelector<HTMLElement>('[aria-current]');
    if (nav && cur) nav.scrollLeft = cur.offsetLeft - nav.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
  }, [route]);
  /* fade an edge only when there is more menu beyond it */
  useEffect(() => {
    const nav = menu.current;
    if (!nav) return;
    const fade = () => {
      const max = nav.scrollWidth - nav.clientWidth;
      nav.dataset.fade = `${nav.scrollLeft > 1 ? 'l' : ''}${nav.scrollLeft < max - 1 ? 'r' : ''}`;
    };
    fade();
    nav.addEventListener('scroll', fade, { passive: true });
    const ro = new ResizeObserver(fade);
    ro.observe(nav);
    return () => {
      nav.removeEventListener('scroll', fade);
      ro.disconnect();
    };
  }, []);

  return (
    <header className={solid ? 'topbar solid' : 'topbar'} id="topbar">
      <Link className="mark" href={chapterHref('home', locale)}>
        Scrollcraft
      </Link>
      <nav className="menu" ref={menu} aria-label={t.nav.primary}>
        {chaptersFor(locale).map((c, i, all) => (
          <Fragment key={c.id}>
            {i > 0 && c.level !== all[i - 1].level ? <span className="menu-sep" aria-hidden="true" /> : null}
            <Link href={chapterHref(c.id, locale)} aria-current={route === c.id ? 'page' : undefined}>
              {c.nav}
            </Link>
          </Fragment>
        ))}
      </nav>
      <div className="top-tools">
        <button type="button" className="kbd-btn mono" onClick={openPalette} aria-keyshortcuts="Meta+K Control+K">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <span className="kbd-label">{t.nav.search}</span>
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
