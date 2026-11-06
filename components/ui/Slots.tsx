'use client';
import { project } from '@/lib/project';
import { SLOT_RE, SLOTS } from '@/lib/slots';

/** Prompt text with the reader's project filled into its [slots]. Unfilled slots keep their brackets. */
export default function Slots({ text }: { text: string }) {
  const p = project.use();
  return text.split(SLOT_RE).map((part, i) => {
    const key = SLOTS[part as keyof typeof SLOTS];
    if (!key) return part;
    const v = p[key].trim();
    return (
      <span key={i} className={v ? 'slot' : 'slot empty'}>
        {v || part}
      </span>
    );
  });
}
