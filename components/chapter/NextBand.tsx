'use client';
import Link from 'next/link';
import { useRef } from 'react';
import ParticleCanvas from '@/components/particles/ParticleCanvas';
import ChapterDone from '@/components/ui/ChapterDone';
import { rememberFlight, setLevel } from '@/lib/particles/manager';
import { chapterHref, chaptersFor, neighbours } from '@/lib/chapters';
import { useLocale } from '@/lib/useLocale';
import { clamp, prefersReducedMotion } from '@/lib/motion';
import { useScroll } from '@/lib/useScroll';

/**
 * The end of a chapter is the start of the next one: its particle shape rises into view as you arrive,
 * with its title and summary. The last chapter leads back to the beginning, and every chapter after the first also offers
 * a way back to the one before. Reaching it marks the chapter as read.
 */
export default function NextBand({ from }: { from: string }) {
  const band = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const { locale, t: d } = useLocale();
  const t = d.chapter;
  const { prev, next } = neighbours(from, locale);

  useScroll((_, vh) => {
    const el = band.current;
    if (!el || !art.current || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const p = clamp((vh - r.top) / (vh + r.height * 0.5), 0, 1);
    art.current.style.transform = `translate3d(0,${((1 - p) * 120).toFixed(1)}px,0) scale(${(0.7 + p * 0.3).toFixed(3)})`;
    art.current.style.opacity = p.toFixed(3);
    setLevel(art.current.querySelector('canvas'), p);
  });

  const href = chapterHref(next ? next.id : 'home', locale);
  return (
    <section className="next-band" ref={band} aria-labelledby="next-band-title">
      <ChapterDone />
      <div className="nb-art" ref={art} aria-hidden="true">
        <ParticleCanvas kind={next ? next.art : 'globe'} />
      </div>
      <div className="nb-copy">
        <h2 id="next-band-title">
          {next ? (
            <>
              <span className="nb-next">{t.next}</span> {next.title}
            </>
          ) : (
            t.backToStart
          )}
        </h2>
        {next ? <p className="lede">{next.summary}</p> : null}
        {/* previous on the left, next on the right; each says which way it goes and which chapter it opens */}
        <nav className="pager" aria-label={t.pager}>
          {prev ? (
            <Link className="pager-link pager-prev" href={chapterHref(prev.id, locale)}>
              <span className="pager-dir">
                <span aria-hidden="true">←</span> {t.previous}
              </span>
              <span className="pager-title">
                {prev.n} {prev.title}
              </span>
            </Link>
          ) : null}
          <Link
            className="pager-link pager-next"
            href={href}
            data-magnetic=""
            onClick={() => rememberFlight(art.current?.querySelector('canvas'), next ? next.art : 'globe')}
          >
            <span className="pager-dir">
              {next ? t.next : t.backToStart} <span aria-hidden="true">→</span>
            </span>
            <span className="pager-title">{next ? `${next.n} ${next.title}` : `01 ${chaptersFor(locale)[0].title}`}</span>
          </Link>
        </nav>
        {prev || next ? (
          <p className="nb-key">
            {t.keys}{' '}
            {prev ? (
              <>
                <kbd>[</kbd> {t.previousShort}
              </>
            ) : null}
            {prev && next ? ' · ' : null}
            {next ? (
              <>
                <kbd>]</kbd> {t.nextShort}
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}
