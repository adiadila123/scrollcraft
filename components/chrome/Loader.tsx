'use client';
import { useEffect } from 'react';

type Flags = Window & { __loaderDone?: boolean; __heroReady?: boolean; __allScripts?: boolean; THREE?: unknown; Lenis?: unknown };

/**
 * Full-screen loader. The counter follows four real milestones: fonts, the 3D library,
 * Lenis and the hero particles. The hero animation waits for window.__loaderDone.
 */
export default function Loader() {
  useEffect(() => {
    const win = window as Flags;
    const root = document.documentElement;
    const el = document.getElementById('loader')!;
    const num = document.getElementById('ldnum')!;
    const bar = document.getElementById('ldbar')!;
    const lab = document.getElementById('ldlabel')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onHome = !location.hash || location.hash === '#home' || location.hash === '#top';
    const t0 = performance.now();
    let shown = 0;
    let fontsOk = false;
    let closing = false;
    let raf = 0;
    const timers: number[] = [];

    win.__loaderDone = false;
    root.classList.add('loading');
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fontsOk = true; });
    else fontsOk = true;

    const done = () => {
      if (closing) return;
      closing = true;
      num.textContent = '100';
      bar.style.transform = 'scaleX(1)';
      lab.textContent = 'Ready';
      timers.push(window.setTimeout(() => {
        el.classList.add('out');
        win.__loaderDone = true;
        timers.push(window.setTimeout(() => { el.hidden = true; root.classList.remove('loading'); }, reduced ? 250 : 1000));
      }, reduced ? 0 : 280));
    };

    const tick = () => {
      if (closing) return;
      const fb = document.getElementById('fallback');
      const settled = !!win.__allScripts;
      const threeOk = typeof win.THREE !== 'undefined' || settled;
      const lenisOk = typeof win.Lenis !== 'undefined' || settled;
      const heroOk = !onHome || win.__heroReady || (fb && !fb.hidden) || (settled && typeof win.THREE === 'undefined');
      const target = 8 + (fontsOk ? 22 : 0) + (threeOk ? 30 : 0) + (lenisOk ? 10 : 0) + (heroOk ? 30 : 0);
      lab.textContent = !fontsOk ? 'Loading fonts' : !threeOk ? 'Loading the 3D library' : !heroOk ? 'Building particles' : 'Ready';
      shown += (target - shown) * (reduced ? 1 : 0.2);
      if (target - shown < 0.6) shown = target;
      num.textContent = ('00' + Math.round(shown)).slice(-3);
      bar.style.transform = `scaleX(${shown / 100})`;
      const elapsed = performance.now() - t0;
      if ((shown >= 100 && elapsed > 600) || elapsed > 9000) { done(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="loader" id="loader" role="status" aria-live="polite" aria-label="Loading Scrollcraft">
      <div className="ld-top mono"><span>Scrollcraft</span><span>Free tutorial</span></div>
      <div className="ld-mid">
        <div className="ld-num" id="ldnum" aria-hidden="true" suppressHydrationWarning>000</div>
        <div className="ld-label mono" id="ldlabel" suppressHydrationWarning>Loading fonts</div>
      </div>
      <div className="ld-rule" aria-hidden="true">
        <i className="ld-bar" id="ldbar"></i>
        <span className="ld-ticks">
          {Array.from({ length: 11 }, (_, i) => <b key={i}></b>)}
        </span>
      </div>
      <div className="ld-bot mono"><span>Scroll to begin</span><span className="ld-dot" aria-hidden="true"></span></div>
    </div>
  );
}
