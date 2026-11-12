import type { DemoSource } from './demos';

/**
 * Previews for the WebGL chapter. Each loads three.js as an ES module through an import map pointing at jsDelivr,
 * which is what a reader pastes into their own page; inside the tutorial demoDocument() swaps it for the copy in
 * public/vendor. Every scene checks for WebGL first and falls back to a plain message.
 */
const IMPORT_MAP = `<script type="importmap">
  { "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js" } }
</script>`;

/* shared by the four scenes: a fixed canvas behind the page, and the message shown without WebGL */
const GL_CSS = `canvas.gl { position: fixed; inset: 0; width: 100%; height: 100%; display: block; }
.nogl { position: fixed; inset: 0; display: none; place-items: center; padding: 24px; text-align: center; color: #9aa7b0; }
.no-webgl .nogl { display: grid; }`;

export const webglDemos: Record<string, DemoSource> = {
  'three-scene': {
    html: `${IMPORT_MAP}
<canvas class="gl" aria-hidden="true"></canvas>
<p class="nogl">This device has no WebGL. The page still reads in full.</p>
<main>
  <section><h2>A scene behind the page</h2></section>
  <section><h2>Scroll turns it</h2></section>
  <section><h2>and moves the camera in</h2></section>
</main>`,
    css: `${GL_CSS}
main { position: relative; }
section { height: 100vh; display: grid; align-content: end; padding: 24px 24px 40px; }
h2 { margin: 0; font-size: 34px; font-weight: 300; letter-spacing: -.03em; }`,
    module: true,
    js: `import * as THREE from 'three';

const canvas = document.querySelector('canvas.gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch {
  document.documentElement.classList.add('no-webgl');
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));       /* sharper than 2x costs a lot and shows little */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.26, 200, 24),
    new THREE.MeshStandardMaterial({ color: 0xeaf0f4, roughness: 0.35, metalness: 0.6 }),
  );
  scene.add(knot, new THREE.HemisphereLight(0x5cc8ff, 0x101418, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(3, 4, 5);
  scene.add(key);

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  /* render only when something changed: on scroll and on resize, never in an idle loop */
  function render() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = still ? 0 : scrollY / (max || 1);
    knot.rotation.set(p * 2.2, p * Math.PI * 2, 0);
    camera.position.set(0, 0, 9 - p * 3);
    renderer.render(scene, camera);
  }
  addEventListener('resize', () => { size(); render(); });
  addEventListener('scroll', () => requestAnimationFrame(render), { passive: true });
  size();
  render();
}`,
  },

  'three-points': {
    html: `${IMPORT_MAP}
<canvas class="gl" aria-hidden="true"></canvas>
<p class="nogl">This device has no WebGL. The page still reads in full.</p>
<main>
  <section><h2>Twelve thousand points</h2></section>
  <section><h2>leave a sphere</h2></section>
  <section><h2>and settle into a wave.</h2></section>
</main>`,
    css: `${GL_CSS}
main { position: relative; }
section { height: 100vh; display: grid; align-content: end; padding: 24px 24px 40px; }
h2 { margin: 0; font-size: 34px; font-weight: 300; letter-spacing: -.03em; }`,
    module: true,
    js: `import * as THREE from 'three';

const canvas = document.querySelector('canvas.gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch {
  document.documentElement.classList.add('no-webgl');
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 6;

  /* every point has two homes: a place on a sphere (position) and a place on a wave (target) */
  const N = 12000;
  const pos = new Float32Array(N * 3);
  const target = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const t = Math.acos(1 - (2 * (i + 0.5)) / N), f = Math.PI * (1 + Math.sqrt(5)) * i;
    pos.set([Math.sin(t) * Math.cos(f) * 1.6, Math.cos(t) * 1.6, Math.sin(t) * Math.sin(f) * 1.6], i * 3);
    const x = (i % 120) / 120 * 8 - 4, z = Math.floor(i / 120) / 100 * 4 - 2;
    target.set([x, Math.sin(x * 1.4 + z * 2) * 0.35 - 0.4, z], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));

  /* the move happens on the GPU: the shader mixes the two homes by uProgress, so no point is updated in JavaScript */
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uProgress: { value: 0 }, uSize: { value: 2.2 * renderer.getPixelRatio() } },
    vertexShader: \`
      attribute vec3 aTarget;
      uniform float uProgress;
      uniform float uSize;
      void main() {
        vec3 p = mix(position, aTarget, smoothstep(0.0, 1.0, uProgress));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uSize * (4.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader: \`
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;                       /* round points */
        gl_FragColor = vec4(0.36, 0.78, 1.0, 1.0 - d * 1.6);
      }\`,
  });
  const points = new THREE.Points(geo, material);
  scene.add(points);

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  function render() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = still ? 1 : scrollY / (max || 1);
    material.uniforms.uProgress.value = p;
    points.rotation.y = p * 0.8;
    renderer.render(scene, camera);
  }
  addEventListener('resize', () => { size(); render(); });
  addEventListener('scroll', () => requestAnimationFrame(render), { passive: true });
  size();
  render();
}`,
  },

  'three-shader': {
    html: `${IMPORT_MAP}
<canvas class="gl" aria-hidden="true"></canvas>
<p class="nogl">This device has no WebGL. The page still reads in full.</p>
<main>
  <section><h2>One shader, full screen</h2></section>
  <section><h2>Time moves it slowly.</h2></section>
  <section><h2>Scroll changes the light.</h2></section>
</main>`,
    css: `${GL_CSS}
main { position: relative; }
section { height: 100vh; display: grid; align-content: end; padding: 24px 24px 40px; }
h2 { margin: 0; font-size: 34px; font-weight: 300; letter-spacing: -.03em; mix-blend-mode: difference; }`,
    module: true,
    js: `import * as THREE from 'three';

const canvas = document.querySelector('canvas.gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas });
} catch {
  document.documentElement.classList.add('no-webgl');
}

if (renderer) {
  /* a full-screen backdrop is cheap at 1x; noise hides the lower resolution */
  renderer.setPixelRatio(1);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = { uTime: { value: 0 }, uScroll: { value: 0 }, uAspect: { value: 1 } };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }',
    fragmentShader: \`
      varying vec2 vUv;
      uniform float uTime, uScroll, uAspect;
      /* value noise: cheap, smooth, good enough for light */
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
      }
      void main() {
        vec2 p = vec2(vUv.x * uAspect, vUv.y) * 2.5;
        float n = noise(p + uTime * 0.05) * 0.6 + noise(p * 2.0 - uTime * 0.03) * 0.4;
        vec3 night = vec3(0.02, 0.03, 0.05), sea = vec3(0.05, 0.25, 0.35), dawn = vec3(0.95, 0.62, 0.35);
        vec3 lit = mix(sea, dawn, uScroll);
        vec3 col = mix(night, lit, smoothstep(0.35, 0.9, n + vUv.y * 0.3 * uScroll));
        gl_FragColor = vec4(col, 1.0);
      }\`,
  })));

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    renderer.setSize(innerWidth, innerHeight, false);
    uniforms.uAspect.value = innerWidth / innerHeight;
  }
  addEventListener('resize', size);
  size();
  /* this one animates with time, so it does run a loop; with reduced motion it draws one frame per scroll */
  function frame(t) {
    const max = document.documentElement.scrollHeight - innerHeight;
    uniforms.uScroll.value = scrollY / (max || 1);
    uniforms.uTime.value = still ? 0 : t / 1000;
    renderer.render(scene, camera);
  }
  if (still) {
    addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
    frame(0);
  } else {
    renderer.setAnimationLoop(frame);
  }
}`,
  },

  'three-transition': {
    html: `${IMPORT_MAP}
<canvas class="gl" aria-hidden="true"></canvas>
<p class="nogl">This device has no WebGL. The page still reads in full.</p>
<main>
  <section><h2>From one scene</h2></section>
  <section><h2>to the next,</h2></section>
  <section><h2>with a dissolve driven by scroll.</h2></section>
</main>`,
    css: `${GL_CSS}
main { position: relative; }
section { height: 100vh; display: grid; align-content: end; padding: 24px 24px 40px; }
h2 { margin: 0; font-size: 34px; font-weight: 300; letter-spacing: -.03em; }`,
    module: true,
    js: `import * as THREE from 'three';

const canvas = document.querySelector('canvas.gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas });
} catch {
  document.documentElement.classList.add('no-webgl');
}

/* stand-ins for two photographs, drawn on a 2D canvas so the preview needs no files */
function plate(from, to, word) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, from); grad.addColorStop(1, to);
  g.fillStyle = grad; g.fillRect(0, 0, 1024, 1024);
  g.fillStyle = 'rgba(234,240,244,.9)'; g.font = '300 150px system-ui'; g.fillText(word, 70, 560);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uA: { value: plate('#0b2a3a', '#000', 'Harbour') },
    uB: { value: plate('#3a1d0b', '#000', 'Lighthouse') },
    uProgress: { value: 0 },
    uAspect: { value: 1 },
  };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }',
    fragmentShader: \`
      varying vec2 vUv;
      uniform sampler2D uA, uB;
      uniform float uProgress, uAspect;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        /* cover-fit the square plates to the screen */
        vec2 uv = vUv - 0.5;
        uv.x *= max(uAspect, 1.0); uv.y /= min(uAspect, 1.0);
        uv = uv * 0.9 + 0.5;
        /* a ragged edge sweeps up the screen; each pixel switches when the edge passes it */
        float edge = uProgress * 1.4 - 0.2 + (hash(floor(vUv * 60.0)) - 0.5) * 0.12;
        float t = smoothstep(edge - 0.06, edge + 0.06, 1.0 - vUv.y);
        /* both images slide a little against the switch, which reads as a camera move */
        vec4 a = texture2D(uA, uv + vec2(0.0, -uProgress * 0.08));
        vec4 b = texture2D(uB, uv + vec2(0.0, (1.0 - uProgress) * 0.08));
        gl_FragColor = mix(b, a, t);
      }\`,
  })));

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    renderer.setSize(innerWidth, innerHeight, false);
    uniforms.uAspect.value = innerWidth / innerHeight;
  }
  function render() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = scrollY / (max || 1);
    /* with reduced motion it cuts at the halfway point instead of dissolving */
    uniforms.uProgress.value = still ? (p < 0.5 ? 0 : 1) : p;
    renderer.render(scene, camera);
  }
  addEventListener('resize', () => { size(); render(); });
  addEventListener('scroll', () => requestAnimationFrame(render), { passive: true });
  size();
  render();
}`,
  },
};
