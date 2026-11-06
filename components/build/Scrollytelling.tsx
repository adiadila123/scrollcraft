'use client';
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import ParticleCanvas from '@/components/particles/ParticleCanvas';
import { useScroll } from '@/lib/useScroll';

export type Stage = { name: string; text: string; art: string; extra?: ReactNode };

/** Technique 9: a sticky scene on one side changes with the text step nearest the reading line. */
export default function Scrollytelling({ stages }: { stages: Stage[] }) {
  const [cur, setCur] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useScroll((_, vh) => {
    const mid = vh * (window.innerWidth <= 900 ? 0.68 : 0.5);
    let best = 0,
      bd = Infinity;
    steps.current.forEach((s, j) => {
      if (!s) return;
      const q = s.getBoundingClientRect();
      const d = Math.abs(q.top + q.height / 2 - mid);
      if (d < bd) {
        bd = d;
        best = j;
      }
    });
    setCur(best);
  });

  return (
    <section className="sec">
      <div className="stick" id="the-loop">
        <h2 className="mono stick-h" tabIndex={-1}>
          01 · The loop
        </h2>
        <span className="mono" aria-live="polite">
          {stages[cur].name}
        </span>
      </div>
      <div className="sec-head">
        <h3 className="sec-h" style={{ maxWidth: '18ch' } as CSSProperties}>
          Every step runs the same four-part loop.
        </h3>
      </div>
      <div className="scrolly">
        <div className="scrolly-vis" aria-hidden="true">
          {stages.map((s, i) => (
            <div className="vpanel" key={s.name} hidden={i !== cur}>
              <div className="vlabel mono">
                Stage {String(i + 1).padStart(2, '0')} · {s.name}
              </div>
              <ParticleCanvas kind={s.art} />
              {s.extra}
            </div>
          ))}
        </div>
        <div className="steps">
          {stages.map((s, i) => (
            <article
              className={i === cur ? 'step on' : 'step'}
              key={s.name}
              ref={(el) => {
                steps.current[i] = el;
              }}
            >
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
