'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useSmoothScroll } from '@/components/engine/SmoothScroll';
import { clamp } from '@/lib/motion';
import { usePathname } from 'next/navigation';
import { routeOf } from '@/lib/chapters';
import { markSection } from '@/lib/progress';
import { useScroll } from '@/lib/useScroll';
import { useLocale } from '@/lib/useLocale';

type Section = { id: string; label: string; el: HTMLElement; box: HTMLElement };

/**
 * A minimap of the chapter, built from its section headings. Each mark fills while you read that section, so the
 * page shows where you are and how much is left. A vertical rail on wide screens, a segmented bar on narrow ones.
 */
export default function ChapterRail() {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(false);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const segs = useRef<(HTMLElement | null)[]>([]);
  const { lenis } = useSmoothScroll();
  const route = routeOf(usePathname());
  const { t } = useLocale();

  /* remember the section being read, so the home page can resume there */
  useEffect(() => {
    const s = sections[active];
    if (s && route !== 'home') markSection(route, s.id, s.label);
  }, [active, sections, route]);

  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLElement>('#content .stick[id]')).map((el) => ({
      id: el.id,
      label: (el.querySelector('.stick-h')?.textContent ?? el.id).replace(/^\s*\d+\s*·\s*/, ''),
      el,
      box: el.closest('section') ?? el.parentElement ?? el,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the sections only exist in the DOM after the page renders
    setSections(found);
  }, []);

  useScroll(
    (_, vh) => {
      if (!sections.length) return;
      const line = vh * 0.35;
      let cur = -1;
      sections.forEach((s, i) => {
        const r = s.box.getBoundingClientRect();
        const p = clamp((line - r.top) / Math.max(1, r.height), 0, 1);
        if (r.top <= line) cur = i;
        const scale = p.toFixed(3);
        fills.current[i]?.style.setProperty('--p', scale);
        segs.current[i]?.style.setProperty('--p', scale);
      });
      setActive(cur);
      const first = sections[0].el.getBoundingClientRect().top;
      const end = document.querySelector('.next-band')?.getBoundingClientRect().top ?? Infinity;
      setShown(first < vh * 0.9 && end > vh * 0.6);
    },
    [sections],
  );

  if (sections.length < 2) return null;

  const go = (e: React.MouseEvent, s: Section) => {
    e.preventDefault();
    const bar = document.getElementById('topbar')?.offsetHeight ?? 0;
    const top = s.el.getBoundingClientRect().top + window.scrollY - bar;
    const l = lenis();
    if (l) l.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${s.id}`);
    s.el.querySelector<HTMLElement>('.stick-h')?.focus({ preventScroll: true });
  };

  // Portalled to <body>: the page wrapper is transformed during route transitions, which would turn `fixed` into `absolute`.
  return createPortal(
    <>
      <nav className={shown ? 'rail on' : 'rail'} aria-label={t.chapter.rail}>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={(e) => go(e, s)} aria-current={i === active ? 'location' : undefined}>
                <i aria-hidden="true">
                  <b
                    ref={(el) => {
                      fills.current[i] = el;
                    }}
                  />
                </i>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={shown ? 'rail-bar on' : 'rail-bar'} aria-hidden="true" style={{ '--n': sections.length } as CSSProperties}>
        {sections.map((s, i) => (
          <i
            key={s.id}
            ref={(el) => {
              segs.current[i] = el;
            }}
          />
        ))}
      </div>
    </>,
    document.body,
  );
}
