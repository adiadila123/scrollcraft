'use client';
import { dicts } from '@/lib/dict';
import { localeOf } from '@/lib/i18n';
import { useLocale } from '@/lib/useLocale';
import { useEffect, useRef } from 'react';
import { boot } from '@/lib/boot';
import { prefersReducedMotion } from '@/lib/motion';

/* inside effects, read the language straight from the address: it never changes within one document */
const here = () => dicts[localeOf(location.pathname)];

/** Longest the loader may hold the page, however slow the network. */
const MAX_MS = 2500;
/** Session key that skips the loader once it has played; the BOOT script in Shell.tsx reads the same key. */
const LOADER_SEEN = 'sc-loaded';

/**
 * Intro counter shown once per session, on the home page only. The counter follows real milestones (fonts, the 3D library,
 * the particles) and gives up after MAX_MS. A script in the document head hides it before first paint on later visits.
 */
export default function Loader() {
  const t = useLocale().t.home.loader;
  const el = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const lab = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('ld-skip')) return;
    const reduced = prefersReducedMotion();
    const t0 = performance.now();
    const timers: number[] = [];
    let shown = 0,
      fontsOk = false,
      closing = false,
      raf = 0;

    boot.set({ loaderDone: false });
    root.classList.add('loading');
    document.fonts.ready.then(() => {
      fontsOk = true;
    });

    const done = () => {
      closing = true;
      num.current!.textContent = '100';
      bar.current!.style.transform = 'scaleX(1)';
      lab.current!.textContent = here().home.loader.ready;
      try {
        sessionStorage.setItem(LOADER_SEEN, '1');
      } catch {}
      timers.push(
        window.setTimeout(
          () => {
            el.current!.classList.add('out');
            boot.set({ loaderDone: true });
            timers.push(
              window.setTimeout(
                () => {
                  root.classList.remove('loading');
                  root.classList.add('ld-skip');
                },
                reduced ? 250 : 1000,
              ),
            );
          },
          reduced ? 0 : 200,
        ),
      );
    };

    const tick = () => {
      if (closing) return;
      const b = boot.get();
      const threeOk = b.three || b.failed;
      const heroOk = b.hero || b.failed;
      const target = 10 + (fontsOk ? 25 : 0) + (threeOk ? 30 : 0) + (heroOk ? 35 : 0);
      const L = here().home.loader;
      lab.current!.textContent = !fontsOk ? L.fonts : !threeOk ? L.three : !heroOk ? L.particles : L.ready;
      shown += (target - shown) * (reduced ? 1 : 0.2);
      if (target - shown < 0.6) shown = target;
      num.current!.textContent = String(Math.round(shown)).padStart(3, '0');
      bar.current!.style.transform = `scaleX(${shown / 100})`;
      const elapsed = performance.now() - t0;
      if ((shown >= 100 && elapsed > 600) || elapsed > MAX_MS) return done();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      root.classList.remove('loading');
      boot.set({ loaderDone: true });
    };
  }, []);

  return (
    <div className="loader" ref={el} role="status" aria-live="polite" aria-label={t.label}>
      <div className="ld-top mono">
        <span>Scrollcraft</span>
        <span>{t.tag}</span>
      </div>
      <div className="ld-mid">
        <div className="ld-num" ref={num} aria-hidden="true">
          000
        </div>
        <div className="ld-label mono" ref={lab}>
          {t.fonts}
        </div>
      </div>
      <div className="ld-rule" aria-hidden="true">
        <i className="ld-bar" ref={bar}></i>
        <span className="ld-ticks">
          {Array.from({ length: 11 }, (_, i) => (
            <b key={i}></b>
          ))}
        </span>
      </div>
      <div className="ld-bot mono">
        <span>{t.scroll}</span>
        <span className="ld-dot" aria-hidden="true"></span>
      </div>
    </div>
  );
}
