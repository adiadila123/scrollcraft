'use client';
import { persistentStore } from '@/lib/store';

/** Ticks are saved in the browser as 1s and 0s, so the list survives a reload. */
const ticks = persistentStore<number[]>('sc-checks', []);

/** The launch checklist. */
export default function Checklist({ items }: { items: string[] }) {
  const saved = ticks.use();
  const checked = items.map((_, i) => !!saved[i]);
  const toggle = (i: number) => ticks.set(checked.map((v, j) => ((j === i ? !v : v) ? 1 : 0)));
  const n = checked.filter(Boolean).length;

  return (
    <>
      <div className="stick" id="checklist">
        <h2 className="mono stick-h" tabIndex={-1}>
          01 · Checklist
        </h2>
        <span className="mono" aria-live="polite">
          {n} of {items.length} done
        </span>
      </div>
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
    </>
  );
}
