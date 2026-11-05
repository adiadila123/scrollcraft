'use client';
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import CodeFrame from '@/components/ui/CodeFrame';
import { prefersReducedMotion } from '@/lib/motion';
import { subscribe } from '@/lib/ticker';

/** 0.10 → "0.1", the way you would type it in code. */
const short = (n: number) => n.toFixed(2).replace(/0$/, '');

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
  digits = 2,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
  digits?: number;
}) {
  return (
    <label className="ctl">
      <span className="mono">
        {label} <b>{value.toFixed(digits)}</b>
        {unit ? ` ${unit}` : null}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  );
}

/** 01: Lenis lerp. The blue marker eases towards the target by a fraction of the distance each frame. */
export function LerpLab() {
  const [lerp, setLerp] = useState(0.1);
  const lerpRef = useRef(lerp);
  useEffect(() => {
    lerpRef.current = lerp;
  }, [lerp]);
  const [targetPct, setTargetPct] = useState(80);
  const bar = useRef<HTMLDivElement>(null),
    tEl = useRef<HTMLElement>(null),
    vEl = useRef<HTMLElement>(null);
  const target = useRef(0.8),
    cur = useRef(0),
    drag = useRef(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(bar.current!);
    const off = subscribe(() => {
      if (!visible) return;
      cur.current += (target.current - cur.current) * (reduced ? 1 : lerpRef.current);
      const w = bar.current!.clientWidth;
      tEl.current!.style.left = `${target.current * w}px`;
      vEl.current!.style.left = `${cur.current * w}px`;
    });
    return () => {
      off();
      io.disconnect();
    };
  }, []);

  const moveTarget = (t: number) => {
    target.current = Math.min(1, Math.max(0, t));
    setTargetPct(Math.round(target.current * 100));
  };
  const setT = (e: RPointerEvent) => {
    const r = bar.current!.getBoundingClientRect();
    moveTarget((e.clientX - r.left) / r.width);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const d = { ArrowRight: 0.1, ArrowLeft: -0.1, Home: -1, End: 1 }[e.key];
    if (d === undefined) return;
    e.preventDefault();
    moveTarget(target.current + d);
  };

  return (
    <div className="lab rv">
      <div
        className="lerp-bar"
        ref={bar}
        role="slider"
        tabIndex={0}
        aria-label="Scroll target. Use the arrow keys or click to move it."
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={targetPct}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          drag.current = true;
          setT(e);
          bar.current!.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) setT(e);
        }}
        onPointerUp={() => {
          drag.current = false;
        }}
      >
        <i className="t" ref={tEl}></i>
        <i className="v" ref={vEl}></i>
      </div>
      <Slider label="lerp" value={lerp} min={0.02} max={0.5} step={0.01} onChange={setLerp} />
      <CodeFrame lang="Code" code={`new Lenis({ lerp: ${short(lerp)} })`} />
      <p className="muted">Low values feel heavy and slow. High values feel close to normal scrolling. The documented default is 0.1.</p>
    </div>
  );
}

/** 02: parallax speed inside a scrollable box. */
export function ParallaxLab() {
  const [speed, setSpeed] = useState(0.4);
  const box = useRef<HTMLDivElement>(null),
    dots = useRef<HTMLDivElement>(null);
  const apply = (s = speed) => {
    const y = prefersReducedMotion() ? 0 : box.current!.scrollTop * (1 - s);
    dots.current!.style.transform = `translate3d(0,${y}px,0)`;
  };
  useEffect(() => apply(speed));

  return (
    <div className="lab rv">
      <div className="plx-box" ref={box} onScroll={() => apply()} tabIndex={0} aria-label="Scrollable parallax demo" data-lenis-prevent="">
        <div className="plx-inner">
          <div className="plx-dots" ref={dots}></div>
          <div className="plx-text">Scroll this box</div>
        </div>
      </div>
      <Slider label="speed" value={speed} min={0} max={1} step={0.05} onChange={setSpeed} />
      <CodeFrame lang="Code" code={`layer.style.transform = 'translate3d(0,' + (y * (1 - ${short(speed)})) + 'px,0)'`} />
      <p className="muted">
        Speed 1 moves with the page and shows no depth. Speed 0 stays pinned to the page. Values between 0.15 and 0.5 read as depth. Past about 0.6 it tends to
        look like a fault.
      </p>
    </div>
  );
}

/** 03: stagger timing. Replays when it first scrolls into view and on demand. */
export function StaggerLab() {
  const [ms, setMs] = useState(100);
  const [on, setOn] = useState(false);
  const stag = useRef<HTMLDivElement>(null);

  const play = () => {
    setOn(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
  };
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(stag.current!);
    return () => io.disconnect();
  }, []);

  const delay = (i: number) => (on && !prefersReducedMotion() ? i * ms : 0);
  return (
    <div className="lab rv">
      <div className={on ? 'stag on' : 'stag'} ref={stag}>
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} style={{ transitionDelay: `${delay(i)}ms` }}></i>
        ))}
      </div>
      <div className="ctl-row">
        <Slider label="delay per item" value={ms} min={0} max={300} step={10} onChange={setMs} unit="ms" digits={0} />{' '}
        <button className="btn" type="button" onClick={play}>
          Replay
        </button>
      </div>
      <CodeFrame lang="CSS" code={`.reveal { transition-delay: calc(var(--d) * ${ms}ms); }`} />
      <p className="muted">Short delays read as one movement. Long delays read as a list being counted out. Keep the whole sequence under about a second.</p>
    </div>
  );
}

const PRESETS: [string, number[]][] = [
  ['Reveal curve', [0.2, 0.7, 0.2, 1]],
  ['Standard', [0.4, 0, 0.2, 1]],
  ['Linear', [0, 0, 1, 1]],
];

/** 04: cubic Bezier easing, drawn on a canvas and played on a dot. */
export function EasingLab() {
  const [v, setV] = useState([0.2, 0.7, 0.2, 1]);
  const cv = useRef<HTMLCanvasElement>(null),
    dot = useRef<HTMLElement>(null);

  useEffect(() => {
    const c = cv.current!,
      ctx = c.getContext('2d')!;
    const s = c.width,
      pad = 40,
      a = s - pad * 2;
    const cs = getComputedStyle(document.documentElement);
    const line = cs.getPropertyValue('--line').trim() || '#333',
      acc = cs.getPropertyValue('--accent').trim() || '#7cc4ff';
    const X = (x: number) => pad + x * a,
      Y = (y: number) => s - pad - y * a;
    ctx.clearRect(0, 0, s, s);
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, a, a);
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    ctx.bezierCurveTo(X(v[0]), Y(v[1]), X(v[2]), Y(v[3]), X(1), Y(1));
    ctx.strokeStyle = acc;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    ctx.lineTo(X(v[0]), Y(v[1]));
    ctx.moveTo(X(1), Y(1));
    ctx.lineTo(X(v[2]), Y(v[3]));
    ctx.stroke();
    ctx.fillStyle = acc;
    for (const [px, py] of [
      [v[0], v[1]],
      [v[2], v[3]],
    ]) {
      ctx.beginPath();
      ctx.arc(X(px), Y(py), 5, 0, 7);
      ctx.fill();
    }
  }, [v]);

  const playWith = (vals: number[]) => {
    const d = dot.current!,
      travel = d.parentElement!.clientWidth - 16;
    d.style.transition = 'none';
    d.style.transform = 'translateX(0)';
    void d.offsetWidth;
    d.style.transition = prefersReducedMotion() ? 'none' : `transform 1.1s cubic-bezier(${vals.join(',')})`;
    d.style.transform = `translateX(${travel}px)`;
  };
  const set = (i: number, n: number) => setV((cur) => cur.map((x, j) => (j === i ? n : x)));
  const fmt = (n: number) => n.toFixed(2).replace(/\.?0+$/, '') || '0';

  return (
    <div className="lab rv">
      <canvas id="ezc" ref={cv} width="320" height="320" role="img" aria-label={`Easing curve cubic-bezier(${v.map(fmt).join(', ')})`}></canvas>
      <div className="ez-track">
        <i ref={dot}></i>
      </div>
      <div className="ctl-row">
        {(['x1', 'y1', 'x2', 'y2'] as const).map((l, i) => (
          <Slider key={l} label={l} value={v[i]} min={i % 2 ? -0.5 : 0} max={i % 2 ? 1.5 : 1} step={0.01} onChange={(n) => set(i, n)} />
        ))}
      </div>
      <div className="ctl-row">
        <button className="btn" type="button" onClick={() => playWith(v)}>
          Play
        </button>
        {PRESETS.map(([name, p]) => (
          <button
            key={name}
            className="ghost"
            type="button"
            onClick={() => {
              setV(p);
              playWith(p);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <CodeFrame lang="CSS" code={`transition: transform .9s cubic-bezier(${v.map(fmt).join(', ')});`} />
      <p className="muted">
        The reveal curve starts fast and settles gently, which is why the example site uses it. Linear motion looks mechanical on interface elements.
      </p>
    </div>
  );
}
