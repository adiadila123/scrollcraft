'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocale } from '@/lib/useLocale';

/**
 * A working preview beside its code. Wide: the preview stays on the left and the tabs switch the file on the right.
 * Narrow: one pane, and the first tab switches back to the preview. The page only loads when it comes near the screen.
 */
export default function DemoView({
  id,
  name,
  doc,
  src,
  full,
  fullHref,
  files,
}: {
  id?: string;
  name: string;
  doc?: string;
  src?: string;
  /** label and address of a link that shows the site on its own screen */
  full?: string;
  fullHref?: string;
  files: { label: string; node: ReactNode }[];
}) {
  const { t } = useLocale();
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [run, setRun] = useState(0);
  const [file, setFile] = useState(0);
  const [code, setCode] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setLive(true);
        io.disconnect();
      }
    }, { rootMargin: '400px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure id={id} className={src ? 'dm dm-site' : 'dm'} ref={root} data-view={code ? 'code' : 'preview'}>
      <div className="dm-bar">
        <div className="dm-tabs" role="group" aria-label={t.demo.files}>
          <button type="button" className="dm-tab dm-ptab" aria-pressed={!code} onClick={() => setCode(false)}>
            {t.demo.preview}
          </button>
          {files.map((f, i) => (
            <button
              key={f.label}
              type="button"
              className="dm-tab"
              aria-pressed={code && i === file}
              data-cur={i === file ? '' : undefined}
              onClick={() => {
                setFile(i);
                setCode(true);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="dm-actions">
          {full && fullHref ? (
            <Link className="dm-replay dm-full" href={fullHref}>
              {full} <span aria-hidden="true">→</span>
            </Link>
          ) : null}
          <button type="button" className="dm-replay" onClick={() => setRun((n) => n + 1)}>
            {t.demo.replay} <span aria-hidden="true">↻</span>
          </button>
        </div>
      </div>
      <div className="dm-body">
        <div className="dm-stage">
          {live ? <iframe key={run} title={t.demo.title(name)} src={src} srcDoc={doc} sandbox="allow-scripts" /> : null}
        </div>
        <div className="dm-code" data-lenis-prevent="">{files[file].node}</div>
      </div>
    </figure>
  );
}
