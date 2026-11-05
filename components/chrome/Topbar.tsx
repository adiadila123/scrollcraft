'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { chapters, routeOf } from '@/lib/chapters';
import { useScroll } from '@/lib/useScroll';
import { openPalette } from './CommandPalette';

/** Transparent over the hero, solid once scrolled or on any other page. */
export default function Topbar() {
  const route = routeOf(usePathname());
  const [scrolled, setScrolled] = useState(false);
  useScroll((y) => setScrolled(y > 8));
  const solid = route !== 'home' || scrolled;

  return (
    <header className={solid ? 'topbar solid' : 'topbar'} id="topbar">
      <Link className="mark" href="/">
        Scrollcraft
      </Link>
      <nav className="menu" aria-label="Primary">
        {chapters.map((c) => (
          <Link key={c.id} href={`/${c.id}`} aria-current={route === c.id ? 'page' : undefined}>
            {c.nav}
          </Link>
        ))}
      </nav>
      <button type="button" className="kbd-btn mono" onClick={openPalette} aria-keyshortcuts="Meta+K Control+K">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <span className="kbd-label">Search</span>
        <kbd aria-hidden="true">⌘K</kbd>
      </button>
    </header>
  );
}
