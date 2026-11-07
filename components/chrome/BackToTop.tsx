'use client';
import { useSmoothScroll } from '@/components/engine/SmoothScroll';

/** Scrolls smoothly back to the top and moves focus to the main content, so keyboard users land there too. */
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
