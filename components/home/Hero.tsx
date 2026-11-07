'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { boot } from '@/lib/boot';
import { dicts, type Dict } from '@/lib/dict';
import { localeOf } from '@/lib/i18n';
import { clamp, prefersReducedMotion } from '@/lib/motion';
import { useScroll } from '@/lib/useScroll';
import { useLocale } from '@/lib/useLocale';

const label = (t: Dict, pct: number) => (pct >= 100 ? t.home.ready : t.home.assembling(String(pct).padStart(3, '0')));
/* inside effects, read the language straight from the address: it never changes within one document */
const here = () => dicts[localeOf(location.pathname)];

/**
 * The particle head. three.js and the scene load after hydration, so the copy paints first and other pages never
 * download the 3D library. If WebGL is missing, a still version of the face is shown instead.
 */
export default function Hero({ copy, foot }: { copy: ReactNode; foot: ReactNode }) {
  const { t } = useLocale();
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    boot.set({ three: false, hero: false, failed: false });
    import('@/lib/hero/scene')
      .then(({ createHero }) => {
        if (cancelled) return;
        boot.set({ three: true });
        dispose = createHero({
          canvas: canvas.current!,
          host: host.current!,
          reduced: prefersReducedMotion(),
          canStart: () => boot.get().loaderDone,
          onProgress: (pct) => {
            if (stateRef.current) stateRef.current.textContent = label(here(), pct);
          },
          onReady: () => boot.set({ hero: true }),
          onError: (msg) => {
            setError(msg);
            boot.set({ failed: true });
          },
        });
      })
      .catch(() => {
        setError(here().home.sceneError);
        boot.set({ failed: true });
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  /* parallax: the canvas lags behind the scroll and the copy leaves faster */
  useScroll((y, vh) => {
    if (prefersReducedMotion() || y > vh * 1.3) return;
    if (canvas.current) canvas.current.style.transform = `translate3d(0,${(y * 0.3).toFixed(1)}px,0)`;
    const c = copyRef.current;
    /* on phones the copy sits below the face and is still being read while the page scrolls, so it stays put */
    if (c && window.innerWidth > 760) {
      c.style.transform = `translate3d(0,${(-y * 0.12).toFixed(1)}px,0)`;
      c.style.opacity = clamp(1 - y / (vh * 0.75), 0, 1).toFixed(3);
    }
  });

  return (
    <section className="hero" ref={host}>
      <canvas id="stage" ref={canvas} aria-label={t.home.face}></canvas>
      <div className="scrim"></div>
      <div className="inner">
        <div className="copy" ref={copyRef}>
          {copy}
        </div>
        <div className="foot-row">
          {foot}
          <div className="state" ref={stateRef} aria-hidden="true">
            {label(t, 0)}
          </div>
        </div>
      </div>
      {error ? (
        <div id="fallback">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/face.jpg" alt="" className="fallback-face" />
          <span>{error}</span>
        </div>
      ) : null}
    </section>
  );
}
