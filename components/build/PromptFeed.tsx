'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { prefersReducedMotion } from '@/lib/motion';
import { prompts } from '@/lib/prompts';

const BATCH = 6;

/** Technique 4: an infinite list. A sentinel below the last item asks for the next batch as it comes into range. */
export default function PromptFeed() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const done = count >= prompts.length;

  useEffect(() => () => clearTimeout(timer.current), []);

  /* re-armed after every batch: if the sentinel is still in range, the next batch follows straight away */
  useEffect(() => {
    if (done || loading) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setLoading(true);
        timer.current = window.setTimeout(
          () => {
            setCount((c) => Math.min(c + BATCH, prompts.length));
            setLoading(false);
          },
          prefersReducedMotion() ? 0 : 500,
        );
      },
      { rootMargin: '0px 0px 320px 0px' },
    );
    io.observe(end.current!);
    return () => io.disconnect();
  }, [count, done, loading]);

  return (
    <section className="sec">
      <div className="stick" id="prompt-library">
        <h2 className="mono stick-h" tabIndex={-1}>
          03 · Prompt library
        </h2>
        <span className="mono">{count ? `${count} of ${prompts.length} loaded` : '0 loaded'}</span>
      </div>
      <div className="sec-head">
        <h3 className="sec-h" style={{ maxWidth: '20ch' } as CSSProperties}>
          Twenty-four prompts to copy.
        </h3>
        <p className="muted" style={{ maxWidth: '46ch' } as CSSProperties}>
          Replace anything in square brackets. More load as you scroll.
        </p>
      </div>
      <ol className="feed">
        {prompts.slice(0, count).map((p, i) => (
          <FeedItem key={i} n={i + 1} topic={p.topic} text={p.text} />
        ))}
      </ol>
      <div className={done ? 'feed-end mono' : 'feed-end mono busy'} ref={end} aria-live="polite">
        <span className="spin"></span>
        <span>{done ? 'End of the sample list' : 'Loading more'}</span>
      </div>
    </section>
  );
}

function FeedItem({ n, topic, text }: { n: number; topic: string; text: string }) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => ref.current?.classList.add('in'));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <li className="fi" ref={ref}>
      <span className="mono">P{String(n).padStart(2, '0')}</span>
      <div>
        <div className="mono ft">{topic}</div>
        <p>{text}</p>
        <CopyButton label="Copy prompt" from="prev" />
      </div>
    </li>
  );
}
