'use client';
import Link from 'next/link';
import { useRef } from 'react';
import ParticleCanvas from '@/components/particles/ParticleCanvas';
import ChapterDone from '@/components/ui/ChapterDone';
import { rememberFlight, setLevel } from '@/lib/particles/manager';
import { chapterHref, neighbours } from '@/lib/chapters';
import { useLocale } from '@/lib/useLocale';
import { clamp, prefersReducedMotion } from '@/lib/motion';
import { useScroll } from '@/lib/useScroll';

/**
 * The end of a chapter is the start of the next one: its particle shape rises into view as you arrive,
 * with its title and summary. The last chapter leads back to the beginning. Reaching it marks the chapter as read.
 */
export default function NextBand({ from }: { from: string }) {
  const band = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const { locale, t: d } = useLocale();
  const t = d.chapter;
  const next = neighbours(from, locale).next;

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
        <div className="ctas">
          <Link className="btn" href={href} data-magnetic="" onClick={() => rememberFlight(art.current?.querySelector('canvas'), next ? next.art : 'globe')}>
            {next ? t.link(Number(next.n), next.title) : t.backToStart} <span aria-hidden="true">→</span>
          </Link>
          {next ? (
            <span className="nb-key">
              {t.orPress} <kbd>]</kbd>
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
