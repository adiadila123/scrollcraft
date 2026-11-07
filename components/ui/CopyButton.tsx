'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/useLocale';

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) throw new Error('copy failed');
  }
}

/**
 * Copies the text of the code block it sits in, or of the element just before it (prompt cards).
 * Reading the DOM at click time keeps it correct when the playground rewrites the code.
 */
export default function CopyButton({ prompt = false, from = 'block' }: { prompt?: boolean; from?: 'block' | 'prev' }) {
  const t = useLocale().t.copy;
  const ref = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const b = ref.current!;
    const src = from === 'prev' ? b.previousElementSibling : b.closest('.code')?.querySelector('pre');
    try {
      await copy(src?.textContent ?? '');
      setState('done');
    } catch {
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1400);
  };

  return (
    <button ref={ref} className="cpy" type="button" onClick={onClick} aria-live="polite">
      {state === 'done' ? t.copied : state === 'failed' ? t.failed : prompt ? t.prompt : t.copy}
    </button>
  );
}
