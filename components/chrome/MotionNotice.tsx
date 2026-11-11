'use client';
import { useState, useSyncExternalStore } from 'react';
import { MOTION_KEY, motionChoice, systemReducedMotion } from '@/lib/motion';
import { useLocale } from '@/lib/useLocale';

const noop = () => () => {};

/* Every animated part reads the choice once when it starts, so a reload is the reliable way to apply it. */
function choose(v: 'on' | 'off', reload: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, v);
  } catch {}
  if (reload) location.reload();
}

/**
 * Shown only when the device asks for less motion (lab and remote-desktop machines often do, by policy) and the
 * reader has not answered yet. The site respects that setting; this lets someone who wants the animations, for
 * example to follow this tutorial, turn them back on.
 */
export default function MotionNotice() {
  const { t } = useLocale();
  const ask = useSyncExternalStore(
    noop,
    () => systemReducedMotion() && motionChoice() === null,
    () => false,
  );
  const [hidden, setHidden] = useState(false);
  if (!ask || hidden) return null;
  return (
    <aside className="motion-notice" aria-label={t.motion.label}>
      <p>{t.motion.notice}</p>
      <div className="mn-actions">
        <button type="button" className="mn-on" onClick={() => choose('on', true)}>
          {t.motion.turnOn}
        </button>
        <button
          type="button"
          className="mn-off"
          onClick={() => {
            choose('off', false);
            setHidden(true);
          }}
        >
          {t.motion.keepOff}
        </button>
      </div>
    </aside>
  );
}

/** In the footer, only on devices that ask for less motion: the current state and a way to change it. */
export function MotionSwitch() {
  const { t } = useLocale();
  const state = useSyncExternalStore(
    noop,
    () => (systemReducedMotion() ? (motionChoice() === 'on' ? 'on' : 'off') : null),
    () => null,
  );
  if (!state) return null;
  return (
    <p className="motion-switch">
      {t.motion.label}: {state === 'on' ? t.motion.on : t.motion.off} ·{' '}
      <button type="button" onClick={() => choose(state === 'on' ? 'off' : 'on', true)}>
        {state === 'on' ? t.motion.switchOff : t.motion.switchOn}
      </button>
    </p>
  );
}
