'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import { register } from '@/lib/particles/manager';

/** A canvas that draws one of the particle shapes from lib/particles/shapes.ts, or the particle face. */
export default function ParticleCanvas({ kind, className, label, style }: { kind: string; className?: string; label?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => register(ref.current!, kind), [kind]);
  return <canvas ref={ref} className={className} style={style} data-pc={kind} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} />;
}
