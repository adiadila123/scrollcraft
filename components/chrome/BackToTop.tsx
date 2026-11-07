'use client';
import { useSmoothScroll } from '@/components/engine/SmoothScroll';

export default function BackToTop({ label }: { label: string }) {
  const { toTop } = useSmoothScroll();
  return (
    <button
      type="button"
      onClick={() => {
        toTop(true);
        document.getElementById('content')?.focus({ preventScroll: true });
      }}
    >
      {label}
    </button>
  );
}
