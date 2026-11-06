'use client';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import ParticleCanvas from '@/components/particles/ParticleCanvas';
import { chapters, getChapter } from '@/lib/chapters';
import { clamp, prefersReducedMotion } from '@/lib/motion';
import { useProgress } from '@/lib/progress';
import { useScroll } from '@/lib/useScroll';

/** Technique 5: a pinned statement whose words light up one by one as the section scrolls. */
export function Statement({ text, dim }: { text: string; dim: string }) {
  const pin = useRef<HTMLElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);
  const hint = useRef<HTMLSpanElement>(null);
  const all = [...text.split(/\s+/).map((w) => [w, false] as const), ...dim.split(/\s+/).map((w) => [w, true] as const)];

  useScroll((_, vh) => {
    const el = pin.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    if (hint.current) hint.current.style.opacity = clamp(1 - p * 8, 0, 1).toFixed(2);
    const n = words.current.length;
    words.current.forEach((w, i) => {
      w.style.opacity = (0.16 + 0.84 * clamp((p - (0.08 + (0.74 * i) / n)) / 0.05, 0, 1)).toFixed(2);
    });
  });

  return (
    <section className="pin" ref={pin}>
      <div className="wrap pin-in">
        <p className="statement">
          {all.map(([w, isDim], i) => (
            <span key={i}>
              <span
                className={isDim ? 'w dim' : 'w'}
                ref={(el) => {
                  if (el) words.current[i] = el;
                }}
              >
                {w}
              </span>
              {i < all.length - 1 ? ' ' : null}
            </span>
          ))}
        </p>
        <span className="pin-hint" ref={hint} aria-hidden="true">
          Keep scrolling
        </span>
      </div>
    </section>
  );
}

/** Technique 6: the particle face scales up while it crosses the viewport. */
export function ZoomFigure() {
  const fig = useRef<HTMLElement>(null);
  useScroll((_, vh) => {
    const el = fig.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
    const cv = el.querySelector('canvas');
    if (cv) cv.style.transform = `scale(${(1 + 0.6 * p).toFixed(3)})`;
  });
  return (
    <section className="wrap sec zoomsec">
      <figure className="zoom" ref={fig}>
        <ParticleCanvas kind="face" label="A head made of white particles with blue eyes, shown close up" />
        <figcaption>
          <span className="mono">Every image on this site is particles</span>
          <span className="mono">Scroll to zoom</span>
        </figcaption>
      </figure>
    </section>
  );
}

/** Technique 7: three background layers that move at different speeds behind the closing call to action. */
export function ParallaxBand({ children }: { children: ReactNode }) {
  const band = useRef<HTMLElement>(null);
  useScroll((_, vh) => {
    const el = band.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const d = clamp(r.top + r.height / 2 - vh / 2, -vh * 1.2, vh * 1.2);
    el.querySelectorAll<HTMLElement>('[data-px]').forEach((l) => {
      l.style.transform = `translate3d(0,${(-(1 - parseFloat(l.dataset.px!)) * d).toFixed(1)}px,0)`;
    });
  });
  return (
    <section className="plx snap" ref={band}>
      <div className="plx-l plx-a" data-px="0.8" aria-hidden="true"></div>
      <div className="plx-l plx-c" data-px="0.55" aria-hidden="true"></div>
      <div className="plx-l plx-b" data-px="0.3" aria-hidden="true"></div>
      {children}
    </section>
  );
}

/** Shown under the hero once a visitor has opened a chapter: progress so far and a link back to where they were. */
export function Resume() {
  const { done, last, at } = useProgress();
  const c = last ? getChapter(last) : undefined;
  if (!c) return null;
  /* a finished chapter resumes at the next unread one; an unfinished one at the section you were reading */
  const finished = done.includes(c.id);
  const target = finished ? (chapters.find((x) => !done.includes(x.id) && x.n > c.n) ?? chapters.find((x) => !done.includes(x.id))) : c;
  const section = !finished && at?.chapter === c.id ? at : undefined;
  return (
    <div className="resume">
      <span className="mono">
        {done.length} of {chapters.length} chapters read
      </span>
      {target ? (
        <Link className="ghost" href={section ? `/${target.id}#${section.id}` : `/${target.id}`}>
          {finished ? 'Next' : 'Resume'}: {target.n} {target.title}
          {section ? <span className="resume-at"> · {section.label}</span> : null} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}
