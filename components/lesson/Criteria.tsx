'use client';
import { useEffect } from 'react';
import { markDone } from '@/lib/progress';
import { persistentStore } from '@/lib/store';
import { useLocale } from '@/lib/useLocale';

/** Ticks per chapter, saved in the browser as 1s and 0s. */
const ticks = persistentStore<Record<string, number[]>>('sc-criteria', {});

/** A chapter's acceptance criteria. When every one is ticked, the chapter counts as complete. */
export default function Criteria({ chapter, items }: { chapter: string; items: string[] }) {
  const all = ticks.use();
  const t = useLocale().t.lesson;
  const checked = items.map((_, i) => !!all[chapter]?.[i]);
  const n = checked.filter(Boolean).length;
  const complete = n === items.length;
  const toggle = (i: number) => ticks.set({ ...all, [chapter]: checked.map((v, j) => ((j === i ? !v : v) ? 1 : 0)) });

  useEffect(() => {
    if (complete) markDone(chapter);
  }, [complete, chapter]);

  return (
    <>
      <ul className="checklist rv">
        {items.map((text, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
              <span>{text}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className={complete ? 'criteria-state mono on' : 'criteria-state mono'} aria-live="polite">
        {complete ? t.complete : t.met(n, items.length)}
      </p>
    </>
  );
}
