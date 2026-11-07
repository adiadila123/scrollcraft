'use client';
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import ParticleCanvas from '@/components/particles/ParticleCanvas';
import { landFlight, setLevel } from '@/lib/particles/manager';
import { clamp, prefersReducedMotion } from '@/lib/motion';
import { useProgress } from '@/lib/progress';
import { useLocale } from '@/lib/useLocale';
import { useScroll } from '@/lib/useScroll';

const noop = () => () => {};

/**
 * The opening of every chapter, built like the home hero. The chapter's particle shape is a fixed layer behind the
 * whole chapter: bright behind the title, it sinks back to a dim backdrop for the sections as you scroll, and gives
 * way to the next chapter's shape at the end band.
 */
export default function ChapterHead({
  id,
  n,
  total,
  art,
  mins,
  title,
  lede,
}: {
  id: string;
  n: string;
  total: number;
  art: string;
  mins?: number;
  title: ReactNode;
  lede: ReactNode;
}) {
  const head = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const { done } = useProgress();
  const { t } = useLocale();
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  /* arriving from the previous chapter's end band: its shape flies into place behind this title */
  useEffect(() => {
    if (hydrated) landFlight(artRef.current?.querySelector('canvas'), art);
  }, [hydrated, art]);

  useScroll((y, vh) => {
    if (!head.current) return;
    const still = prefersReducedMotion();
    const h = head.current.offsetHeight || vh;
    const p = still ? 1 : clamp(y / h, 0, 1);
    if (artRef.current) {
      const end = document.querySelector('.next-band')?.getBoundingClientRect().top ?? Infinity;
      const leave = clamp((end - vh * 0.15) / (vh * 0.6), 0, 1);
      /* behind the sections it is a backdrop: dimmer on phones, where the text column sits right over it */
      const o = (1 - p * (innerWidth <= 760 ? 0.9 : 0.82)) * leave;
      artRef.current.style.opacity = o.toFixed(3);
      setLevel(artRef.current.querySelector('canvas'), o);
      if (!still) artRef.current.style.transform = `scale(${(1 + p * 0.25).toFixed(3)})`;
    }
    if (still) return;
    if (copy.current) {
      copy.current.style.transform = `translate3d(0,${(-y * 0.1).toFixed(1)}px,0)`;
      copy.current.style.opacity = clamp(1 - (p - 0.35) * 1.6, 0, 1).toFixed(3);
    }
  });

  return (
    <header className="pg-head" ref={head}>
      {/* portalled to <body>: the page wrapper keeps a transform from its entry animation, which would break `fixed` */}
      {hydrated
        ? createPortal(
            <div className="pg-bg" ref={artRef} aria-hidden="true">
              <ParticleCanvas kind={art} />
            </div>,
            document.body,
          )
        : null}
      <div className="pg-copy" ref={copy}>
        <h1 className="pg-title">{title}</h1>
        <p className="lede">{lede}</p>
        <p className="pg-meta">
          <span>{t.chapter.of(Number(n), total)}</span>
          {mins ? <span>{t.chapter.minutes(mins)}</span> : null}
          {done.includes(id) ? <span className="pg-done">{t.chapter.read}</span> : null}
        </p>
      </div>
    </header>
  );
}
