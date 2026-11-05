import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { mulberry } from '@/lib/motion';
import { subscribe } from '@/lib/ticker';
import { FACE_SRC } from '@/lib/particles/manager';
import { dustVS, pointFS, pointVS } from './shaders';

export type HeroOptions = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  reduced: boolean;
  /** The formation waits until this returns true, so it plays after the loader leaves. */
  canStart: () => boolean;
  onProgress: (pct: number) => void;
  onReady: () => void;
  onError: (message: string) => void;
};

/* Height of the face surface, so the image-sampled points get depth. Gaussians add brow, nose, cheeks, lips and chin. */
function G(x: number, y: number, cx: number, cy: number, sx: number, sy: number, h: number) {
  const dx = x - cx,
    dy = y - cy;
  return h * Math.exp(-((dx * dx) / (2 * sx * sx) + (dy * dy) / (2 * sy * sy)));
}
const faceR2 = (x: number, y: number) => (x / 0.72) * (x / 0.72) + (y / 1.15) * (y / 1.15);
function H(x: number, y: number) {
  const r2 = faceR2(x, y);
  if (r2 >= 1) return 0;
  let z = 0.7 * Math.sqrt(1 - r2);
  const a = Math.abs(x);
  z += G(a, y, 0, -0.2, 0.06, 0.2, 0.11);
  z += G(a, y, 0, -0.4, 0.11, 0.09, 0.13);
  z -= G(a, y, 0.33, -0.05, 0.13, 0.06, 0.08);
  z += G(a, y, 0.33, 0.06, 0.18, 0.045, 0.05);
  z += G(a, y, 0.45, -0.45, 0.14, 0.14, 0.05);
  z += G(a, y, 0, -0.68, 0.15, 0.035, 0.04);
  z += G(a, y, 0, -0.78, 0.14, 0.045, 0.05);
  z -= G(a, y, 0, -0.72, 0.16, 0.012, 0.035);
  z += G(a, y, 0, -1.05, 0.18, 0.1, 0.06);
  return z;
}

/** Builds the particle head and starts rendering. Returns a function that stops everything and frees the GPU memory. */
export function createHero(o: HeroOptions): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas: o.canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    o.onError('WebGL is not available in this browser, so the animation cannot run.');
    return () => {};
  }
  renderer.setClearColor(0x000000, 1);
  const rand = mulberry(20261103);
  const offs: (() => void)[] = [];
  const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void) => {
    window.addEventListener(t, fn);
    offs.push(() => window.removeEventListener(t, fn));
  };

  const U = {
    uP: { value: 0 },
    uTime: { value: 0 },
    uScale: { value: 1000 },
    uFade: { value: 1 },
    uMouse: { value: new Vector3() },
    uMouseAmt: { value: 0 },
    uMouseVel: { value: new Vector3() },
  };
  const mat = (vs: string) =>
    new ShaderMaterial({
      uniforms: U,
      vertexShader: vs,
      fragmentShader: pointFS,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });
  const attr = (arr: number[], n: number) => new BufferAttribute(new Float32Array(arr), n);

  const scene = new Scene();
  const group = new Group();
  scene.add(group);
  const disposables: { dispose: () => void }[] = [];
  let disposed = false;

  const img = new Image();
  img.onload = () => {
    if (disposed) return;
    const W = img.width,
      Hh = img.height;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = Hh;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(0, 0, W, Hh).data;
    const S = 0.00326 * (977 / Hh),
      CX = W * 0.4986,
      CY = Hh * 0.4626;

    const pos: number[] = [],
      seed: number[] = [],
      col: number[] = [],
      size: number[] = [];
    for (let py = 0; py < Hh; py++) {
      for (let pxl = 0; pxl < W; pxl++) {
        const i = (py * W + pxl) * 4;
        const r = px[i] / 255,
          g = px[i + 1] / 255,
          b = px[i + 2] / 255;
        const v = Math.max(r, g, b);
        const x = (pxl - CX) * S,
          y = (CY - py) * S;
        const inside = faceR2(x, y) < 1.12;
        if (v < (inside ? 0.08 : 0.3)) continue;
        const copies = v > 0.45 ? 3 : v > 0.2 ? 2 : 1;
        for (let k = 0; k < copies; k++) {
          const jx = x + (rand() - 0.5) * S,
            jy = y + (rand() - 0.5) * S;
          const z = inside ? H(jx, jy) + (rand() - 0.5) * 0.012 : (rand() - 0.5) * 0.08;
          pos.push(jx, jy, z);
          seed.push(rand(), rand(), rand());
          col.push(r * 1.5, g * 1.5, b * 1.5);
          size.push(S * (1.15 + 1.5 * v));
        }
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', attr(pos, 3));
    geo.setAttribute('aSeed', attr(seed, 3));
    geo.setAttribute('aCol', attr(col, 3));
    geo.setAttribute('aSize', attr(size, 1));
    const faceMat = mat(pointVS);
    const face = new Points(geo, faceMat);

    const dpos: number[] = [],
      dseed: number[] = [];
    for (let q = 0; q < 1800; q++) {
      dpos.push((rand() * 2 - 1) * 1.0, -1.2 + rand() * 2.1, (rand() - 0.5) * 0.8 + 0.1);
      dseed.push(rand(), rand(), rand());
    }
    const dgeo = new BufferGeometry();
    dgeo.setAttribute('position', attr(dpos, 3));
    dgeo.setAttribute('aSeed', attr(dseed, 3));
    const smokeMat = mat(dustVS);
    const smoke = new Points(dgeo, smokeMat);

    for (const p of [face, smoke]) {
      p.frustumCulled = false;
      group.add(p);
    }
    disposables.push(geo, dgeo, faceMat, smokeMat);
    o.onReady();
  };
  img.onerror = () => o.onError('The face image could not be loaded.');
  img.src = FACE_SRC;

  const camera = new PerspectiveCamera(35, 1, 0.1, 60);
  const resize = () => {
    const w = o.host.clientWidth,
      h = o.host.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const asp = w / h;
    camera.aspect = asp;
    const dist = Math.max(4.4, 3.2 / asp);
    camera.position.set(0, -0.05, dist);
    camera.lookAt(0, -0.05, 0);
    camera.updateProjectionMatrix();
    U.uScale.value = renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360));
    const off = Math.min(Math.max((asp - 1.05) * 1.1, 0), 0.9);
    const portrait = Math.min(Math.max((0.95 - asp) / 0.4, 0), 1);
    group.position.x = off;
    group.position.y = portrait * 0.34 * dist * 0.3153;
  };
  on('resize', resize);
  resize();

  /* formation: wait for the loader, then ease the particles home over FORM seconds */
  const FORM = 3.2;
  const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
  let phase = o.reduced ? 2 : 0,
    ptime = 0,
    progress = o.reduced ? 1 : 0,
    shown = -1;
  const stepTimeline = (dt: number) => {
    ptime += dt;
    if (phase === 0) {
      progress = 0;
      if (ptime > 0.1 && o.canStart()) {
        phase = 1;
        ptime = 0;
      }
    } else if (phase === 1) {
      const x = Math.min(ptime / FORM, 1);
      progress = ease(x);
      if (x >= 1) {
        phase = 2;
        progress = 1;
      }
    }
  };
  const showProgress = () => {
    const pct = Math.round(progress * 100);
    if (pct !== shown) o.onProgress((shown = pct));
  };
  showProgress();
  if (o.reduced) U.uFade.value = 0;

  /* the pointer pushes particles aside */
  const ndc = new Vector2(),
    raycaster = new Raycaster(),
    plane = new Plane(new Vector3(0, 0, 1), -0.3);
  const hit = new Vector3(),
    prevMouse = new Vector3(),
    vtmp = new Vector3(),
    mouseTarget = new Vector3();
  let amtTarget = 0,
    mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  const setPointer = (ev: PointerEvent) => {
    const r = o.host.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    return true;
  };
  on('pointermove', (ev) => {
    if (!setPointer(ev)) return;
    mx = ndc.x;
    my = -ndc.y;
    amtTarget = 1;
  });
  on('pointerdown', (ev) => {
    if (setPointer(ev)) amtTarget = 1;
  });
  const release = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') amtTarget = 0;
  };
  on('pointerup', release);
  on('pointercancel', release);
  on('blur', () => {
    amtTarget = 0;
  });
  const leave = () => {
    amtTarget = 0;
  };
  document.documentElement.addEventListener('pointerleave', leave);
  offs.push(() => document.documentElement.removeEventListener('pointerleave', leave));

  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  });
  io.observe(o.host);

  const stop = subscribe((_, dt) => {
    if (!visible) return;
    U.uTime.value += o.reduced && phase === 2 ? dt * 0.5 : dt;
    stepTimeline(dt);
    U.uP.value = progress;
    showProgress();

    const swayY = o.reduced ? 0 : mx * 0.2 + Math.sin(U.uTime.value * 0.25) * 0.05;
    const swayX = o.reduced ? 0 : my * 0.08;
    ry += (swayY - ry) * 0.05;
    rx += (swayX - rx) * 0.05;
    group.rotation.y = ry;
    group.rotation.x = rx;
    group.updateMatrixWorld(true);

    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      mouseTarget.copy(hit);
      group.worldToLocal(mouseTarget);
      prevMouse.copy(U.uMouse.value);
      U.uMouse.value.lerp(mouseTarget, 0.18);
      vtmp.copy(U.uMouse.value).sub(prevMouse).multiplyScalar(6.0);
      if (vtmp.length() > 0.35) vtmp.setLength(0.35);
      U.uMouseVel.value.lerp(vtmp, 0.12);
    }
    U.uMouseAmt.value += (amtTarget - U.uMouseAmt.value) * 0.08;
    renderer.render(scene, camera);
  });

  return () => {
    disposed = true;
    stop();
    io.disconnect();
    offs.forEach((off) => off());
    img.onload = img.onerror = null;
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  };
}
