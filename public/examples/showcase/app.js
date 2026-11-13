/* Atelier Sora: a short film about one vase, played by the scroll. One three.js scene sits behind the page; each
   section names a stage (data-stage) and the scroll position between two sections blends their shots. The clay is
   thrown, trimmed, fired until it glows and dipped in glaze; scrolling back unmakes it. The scene is drawn only when
   something changes, never in a loop. Without WebGL a drawing stands in, and the glaze buttons work either way. */
import * as THREE from 'three';

const html = document.documentElement;
html.classList.add('js');
/* reduced motion is respected, unless the page was opened with ?motion=on: the tutorial adds it when the reader
   has turned animations on although their device asks for less motion */
const motionOn = new URLSearchParams(location.search).get('motion') === 'on';
if (motionOn) html.classList.add('motion-on');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const isStill = () => reduce.matches && !motionOn;

const GLAZES = { celadon: '#9fbfa8', tenmoku: '#4a2d1c' };
const CLAY = { wet: '#6f5040', leather: '#9a7a5f', bisque: '#dccab0' };
let draw = () => {};

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;

/* text arrives once: headings line by line, paragraphs with a short rise */
const arrive = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      arrive.unobserve(e.target);
    }),
  { rootMargin: '0px 0px -12% 0px' },
);
document.querySelectorAll('.reveal, h1, h2:has(.ln)').forEach((el) => arrive.observe(el));

/* where the reader is, as a stage number: each section's middle is its stage, and in between the two blend */
const sections = [...document.querySelectorAll('[data-stage]')];
function stage() {
  const y = scrollY + innerHeight * 0.5;
  const mid = (el) => el.offsetTop + el.offsetHeight * 0.5;
  if (y <= mid(sections[0])) return 0;
  for (let i = 0; i < sections.length - 1; i++) {
    const a = mid(sections[i]);
    const b = mid(sections[i + 1]);
    if (y < b) return mix(+sections[i].dataset.stage, +sections[i + 1].dataset.stage, clamp((y - a) / (b - a)));
  }
  return +sections[sections.length - 1].dataset.stage;
}

/* the chapters rail: the chapter being read is lit; outside the film it steps back */
const steps = [...document.querySelectorAll('.steps a')];
function light(s) {
  const at = Math.round(s) - 1;
  steps.forEach((a, i) => a.toggleAttribute('aria-current', i === at));
  html.toggleAttribute('data-out', s < 0.5 || s > 5.5);
}

/* the shots, one per stage: where the camera is, what it looks at, and where the piece stands. Phones pull the
   camera back and lift the piece so the text below has room */
const SHOTS = [
  { cam: [0, 0.1, 8.6], look: [0, -0.55, 0], at: [1.5, -0.45, 0] }, // 0 hero: wide, the lump below the title
  { cam: [2.6, -0.4, 4.4], look: [0, -0.85, 0], at: [1.1, 0, 0] }, // 1 clay: close and low
  { cam: [-2.8, 0.6, 5.6], look: [0, 0.05, 0], at: [-1.2, 0, 0] }, // 2 thrown: the rising wall, from the other side
  { cam: [2.4, -1.5, 6.9], look: [0, -0.3, 0], at: [1.3, 0, 0] }, // 3 trimmed: from below, to see the foot
  { cam: [0, 0.4, 6.8], look: [0, 0, 0], at: [-1.1, 0, 0] }, // 4 fired: face on, in the kiln's glow
  { cam: [3.6, 1.3, 5.6], look: [0, 0.1, 0], at: [1.1, 0, 0] }, // 5 glazed: three-quarter view
  { cam: [0, 0.5, 9.2], look: [0, 0.2, 0], at: [0, 0.75, 0] }, // 6 glazes: centred, turning
  { cam: [0, 0.4, 8.4], look: [0, 0, 0], at: [1.6, 0, 0] }, // 7 the landing sections: aside, dimmed
];

const canvas = document.querySelector('.stage');
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch {
  /* no WebGL: the drawing in index.html takes over, and the page reads in full */
  html.classList.add('no-webgl');
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); /* past 2x the cost grows and the gain does not */
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  /* four profiles of the same piece, as (radius, height) pairs with the same number of points, so any two can be
     blended: a lump of clay, the first pull, the thrown vase, and the trimmed vase with a foot */
  const N = 64;
  const sample = (pts) => new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y))).getSpacedPoints(N - 1);
  const lump = sample([
    [0, -1.25],
    [0.7, -1.25],
    [0.86, -1.05],
    [0.8, -0.72],
    [0.52, -0.5],
    [0.001, -0.42],
  ]);
  const pull = sample([
    [0, -1.25],
    [0.62, -1.25],
    [0.6, -0.8],
    [0.52, -0.1],
    [0.46, 0.5],
    [0.42, 0.8],
    [0.001, 0.78],
  ]);
  const vase = sample([
    [0, -1.25],
    [0.5, -1.25],
    [0.62, -1.12],
    [0.82, -0.6],
    [0.84, -0.1],
    [0.66, 0.45],
    [0.36, 0.9],
    [0.33, 1.08],
    [0.42, 1.22],
    [0.36, 1.2],
  ]);
  const foot = sample([
    [0, -1.18],
    [0.34, -1.18],
    [0.4, -1.25],
    [0.5, -1.25],
    [0.6, -1.1],
    [0.82, -0.6],
    [0.84, -0.1],
    [0.66, 0.45],
    [0.36, 0.9],
    [0.33, 1.08],
    [0.42, 1.22],
    [0.36, 1.2],
  ]);

  const SEG = 128;
  const geometry = new THREE.LatheGeometry(vase, SEG);
  const pos = geometry.attributes.position;
  const profile = vase.map((p) => p.clone());
  /* LatheGeometry lays its vertices out segment by segment, point by point, so they can be rewritten in place */
  function shape(throwT, trimT, ridges) {
    for (let j = 0; j < N; j++) {
      const a = throwT < 0.5 ? lump[j].clone().lerp(pull[j], throwT * 2) : pull[j].clone().lerp(vase[j], throwT * 2 - 1);
      a.lerp(foot[j], trimT);
      /* the rings a potter's fingers leave, fading as the walls are smoothed and trimmed */
      a.x = Math.max(0.001, a.x + Math.sin(a.y * 30) * 0.007 * ridges);
      profile[j].copy(a);
    }
    let k = 0;
    for (let i = 0; i <= SEG; i++) {
      const phi = (i / SEG) * Math.PI * 2;
      const sin = Math.sin(phi);
      const cos = Math.cos(phi);
      for (let j = 0; j < N; j++) pos.setXYZ(k++, profile[j].x * sin, profile[j].y, profile[j].x * cos);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    /* the first and last segments meet at the same place; give them one shared normal so no seam shows */
    const nrm = geometry.attributes.normal;
    const last = SEG * N;
    for (let j = 0; j < N; j++) {
      const x = nrm.getX(j) + nrm.getX(last + j);
      const y = nrm.getY(j) + nrm.getY(last + j);
      const z = nrm.getZ(j) + nrm.getZ(last + j);
      const l = Math.hypot(x, y, z) || 1;
      nrm.setXYZ(j, x / l, y / l, z / l);
      nrm.setXYZ(last + j, x / l, y / l, z / l);
    }
  }

  /* one material for clay and glaze: below the glaze line it is clay, above it glaze, with a wavering edge and
     iron speckles; in the kiln the whole piece glows from inside */
  const uniforms = {
    uClay: { value: new THREE.Color(CLAY.wet) },
    uGlaze: { value: new THREE.Color(GLAZES.celadon) },
    uLine: { value: 2 },
    uClayRough: { value: 0.45 },
    uHeat: { value: 0 },
  };
  const material = new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLocal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLocal = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vLocal;
        uniform vec3 uClay; uniform vec3 uGlaze; uniform float uLine; uniform float uClayRough; uniform float uHeat;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float glazeMask() {
          float a = atan(vLocal.x, vLocal.z);
          float edge = uLine + sin(a * 7.0) * 0.035 + sin(a * 13.0 + 1.7) * 0.02;
          return smoothstep(edge - 0.025, edge + 0.025, vLocal.y);
        }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float g = glazeMask();
        float a = atan(vLocal.x, vLocal.z);
        float speck = step(0.985, hash(floor(vec2(a * 60.0, vLocal.y * 70.0))));
        vec3 glaze = mix(uGlaze, uGlaze * 0.35, speck);
        glaze *= 0.85 + 0.15 * smoothstep(-1.0, 1.0, vLocal.y);
        diffuseColor.rgb = mix(uClay, glaze, g);`,
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(uClayRough, 0.18, glazeMask());')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        /* kiln heat: orange to yellow-white, hottest low down where the flame reaches */
        float hot = uHeat * (0.75 + 0.25 * smoothstep(1.2, -1.2, vLocal.y));
        totalEmissiveRadiance += mix(vec3(0.75, 0.16, 0.02), vec3(1.0, 0.48, 0.14), hot) * hot * 0.75;`,
      );
  };

  const piece = new THREE.Mesh(geometry, material);
  /* the wheel head, which drops away once the piece is off it */
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.4, 0.12, 96),
    new THREE.MeshStandardMaterial({ color: '#2b2622', roughness: 0.35, metalness: 0.6 }),
  );
  wheel.position.y = -1.32;
  /* a soft contact shadow, painted once on a small canvas */
  const sc = document.createElement('canvas');
  sc.width = sc.height = 128;
  const g2 = sc.getContext('2d');
  const grad = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.6)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g2.fillStyle = grad;
  g2.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 3.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.26;

  /* embers for the kiln: points that rise with the scroll, not with time, so they stop when the reader does */
  const EMBERS = 260;
  const seeds = new Float32Array(EMBERS * 3);
  for (let i = 0; i < EMBERS; i++) {
    const r = 1.1 + Math.random() * 2.2;
    const t = Math.random() * Math.PI * 2;
    seeds.set([Math.cos(t) * r, Math.random(), Math.sin(t) * r], i * 3);
  }
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(EMBERS * 3);
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  const embers = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({ color: '#ffb36b', size: 0.045, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  function rise(s) {
    for (let i = 0; i < EMBERS; i++) {
      const y = (seeds[i * 3 + 1] + s * 0.9) % 1;
      emberPos[i * 3] = seeds[i * 3] * (1 + y * 0.3);
      emberPos[i * 3 + 1] = -1.3 + y * 3.6;
      emberPos[i * 3 + 2] = seeds[i * 3 + 2] * (1 + y * 0.3);
    }
    emberGeo.attributes.position.needsUpdate = true;
  }

  const group = new THREE.Group();
  group.add(piece, wheel, shadow, embers);
  scene.add(group);

  scene.add(new THREE.HemisphereLight('#fff3e6', '#140f0b', 1.1));
  const key = new THREE.DirectionalLight('#ffe9d2', 2.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#b9d3ff', 1.8);
  rim.position.set(-4, 2.5, -3);
  scene.add(rim);
  const KEY = new THREE.Color('#ffe9d2');
  const FIRE = new THREE.Color('#ff7a2e');
  const RIM = new THREE.Color('#b9d3ff');
  const LEATHER = new THREE.Color(CLAY.leather);
  const BISQUE = new THREE.Color(CLAY.bisque);

  const glazeTarget = new THREE.Color(GLAZES.celadon);
  const tmp = new THREE.Color();
  let queued = false;
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  };

  let wide = true;
  function size() {
    wide = innerWidth >= 900;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }

  /* the shot at a stage between two keyframes, eased so each hold settles before the next move */
  const cam = new THREE.Vector3();
  const look = new THREE.Vector3();
  const at = new THREE.Vector3();
  const tv = new THREE.Vector3();
  function shot(s) {
    const i = Math.min(SHOTS.length - 2, Math.floor(s));
    const t = smooth(0.15, 0.85, s - i);
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    cam.fromArray(a.cam).lerp(tv.fromArray(b.cam), t);
    look.fromArray(a.look).lerp(tv.fromArray(b.look), t);
    at.fromArray(a.at).lerp(tv.fromArray(b.at), t);
    if (!wide) {
      /* phones: further back, the piece centred and lifted into the top half */
      cam.multiplyScalar(1.38);
      /* in the hero the clay sits low, under the title; from the first chapter on, in the top half */
      at.set(0, mix(-1.7, 0.9, smooth(0.2, 1, s)), 0);
      look.y += 0.55;
    }
  }

  /* the camera has weight: the shown stage eases towards the scrolled one, like a dolly on rails */
  let shown = isStill() ? Math.round(stage()) : stage();
  /* the lights come up as the page opens, once */
  const born = performance.now();
  /* a fine pointer leans the camera a little; touch and reduced motion leave it still */
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let px = 0;
  let py = 0;
  let lx = 0;
  let ly = 0;
  addEventListener(
    'pointermove',
    (e) => {
      if (!fine.matches || isStill()) return;
      px = (e.clientX / innerWidth) * 2 - 1;
      py = (e.clientY / innerHeight) * 2 - 1;
      queue();
    },
    { passive: true },
  );
  const chapters = [...document.querySelectorAll('.chapter')];

  let lastShape = '';
  function render() {
    queued = false;
    const still = isStill();
    /* with reduced motion the story is still told, without movement: each section shows its own state at once
       (the lump, the thrown vase, the trimmed one, the piece in the kiln, the glazed vase), cut rather than moved */
    const target = still ? Math.round(stage()) : stage();
    shown = still ? target : shown + (target - shown) * 0.09;
    const moving = Math.abs(target - shown) > 0.0005;
    const s = shown;
    light(target);
    const intro = still ? 1 : smooth(0, 1800, performance.now() - born);
    lx += (px - lx) * 0.08;
    ly += (py - ly) * 0.08;
    const leaning = Math.abs(px - lx) + Math.abs(py - ly) > 0.001;
    /* letterbox and chapter depth, written as CSS variables */
    html.style.setProperty('--bars', still ? '0' : (smooth(0.55, 1, target) * (1 - smooth(5.35, 5.9, target))).toFixed(3));
    if (!still)
      chapters.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
        c.style.setProperty('--shift', ((r.top + r.height / 2 - innerHeight / 2) / innerHeight).toFixed(3));
      });
    const throwT = smooth(1.2, 2, s);
    const trimT = smooth(2.2, 3, s);
    const ridges = (1 - trimT) * smooth(0.5, 1, throwT);
    const shapeKey = `${throwT.toFixed(3)}|${trimT.toFixed(3)}`;
    if (shapeKey !== lastShape) {
      lastShape = shapeKey;
      shape(throwT, trimT, ridges);
    }
    /* the kiln: heat rises into chapter 4 and cools on the way out */
    const heat = smooth(3.35, 4, s) * (1 - smooth(4.2, 4.8, s));
    uniforms.uHeat.value = heat;
    html.style.setProperty('--heat', heat.toFixed(3));
    key.color.copy(KEY).lerp(FIRE, heat);
    key.intensity = (2.6 + heat * 1.6) * intro;
    rim.intensity = 1.8 * (0.3 + 0.7 * intro);
    rim.color.copy(RIM).lerp(FIRE, heat * 0.6);
    embers.material.opacity = heat * 0.9;
    embers.visible = heat > 0.01;
    if (embers.visible) rise(s);
    /* clay: wet while thrown, leather-hard when trimmed, pale bisque after the first firing */
    tmp
      .set(CLAY.wet)
      .lerp(LEATHER, trimT)
      .lerp(BISQUE, smooth(3.6, 4.4, s));
    uniforms.uClay.value.copy(tmp);
    uniforms.uClayRough.value = mix(0.4, 0.92, smooth(2.2, 4, s));
    /* the glaze line falls from above the lip to just over the foot, as if the piece were dipped */
    uniforms.uLine.value = mix(1.5, -1.02, smooth(4.3, 5, s));
    uniforms.uGlaze.value.lerp(glazeTarget, isStill() ? 1 : 0.2);

    /* the wheel turns with the scroll, fastest while the clay is pulled up; then it drops out of frame */
    piece.rotation.y = s * Math.PI * 0.9 + throwT * Math.PI * 5;
    wheel.rotation.y = piece.rotation.y;
    const off = smooth(2.6, 3.3, s);
    wheel.position.y = -1.32 - off * 3;
    wheel.visible = off < 1;

    shot(s);
    cam.x += lx * 0.35;
    cam.y -= ly * 0.2;
    camera.position.copy(cam);
    camera.lookAt(look);
    group.position.copy(at);
    /* after the film the scene steps back behind the landing sections */
    canvas.style.opacity = (1 - smooth(6.3, 7, s) * 0.65).toFixed(3);

    renderer.render(scene, camera);
    /* keep drawing only while something is still settling: the camera, the lean, the lights or the glaze */
    const glazing = Math.abs(uniforms.uGlaze.value.r - glazeTarget.r) + Math.abs(uniforms.uGlaze.value.g - glazeTarget.g) > 0.002;
    if (moving || leaning || intro < 1 || glazing) queue();
  }

  draw = (glaze) => {
    if (glaze) glazeTarget.set(GLAZES[glaze]);
    queue();
  };
  size();
  render();
  addEventListener('resize', () => {
    size();
    queue();
  });
  addEventListener('scroll', queue, { passive: true });
  /* a live change of the motion setting is honoured at once */
  reduce.addEventListener('change', queue);
} else {
  addEventListener('scroll', () => light(stage()), { passive: true });
  light(stage());
}

/* glaze buttons: they work with or without WebGL (the drawing reads data-glaze through CSS) */
const buttons = document.querySelectorAll('[data-glaze]');
buttons.forEach((b) =>
  b.addEventListener('click', () => {
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    html.dataset.glaze = b.dataset.glaze;
    draw(b.dataset.glaze);
  }),
);

/* ---- the scroll kit, the same in all five projects: navigation that follows the reader, reveals, a zoom that
   follows the scroll, a snapping carousel with buttons, and a list that loads more as you reach it ---- */
(() => {
  const root = document.documentElement;
  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !root.classList.contains('motion-on');

  /* scroll-linked navigation: the link to the section in view is marked as the current location */
  const links = [...document.querySelectorAll('header nav a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = `#${e.target.id}`;
        links.forEach((a) => (a.getAttribute('href') === id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
      }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  targets.forEach((t) => spy.observe(t));

  /* reveal on scroll: pieces marked .kit-reveal fade and rise once, as they enter */
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('kit-in');
        reveal.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.kit-reveal').forEach((el) => reveal.observe(el));

  /* zoom on scroll: the picture inside .kit-zoom starts larger and settles to its frame as the frame crosses the screen */
  const zooms = [...document.querySelectorAll('.kit-zoom')];
  let queued = false;
  function zoom() {
    queued = false;
    zooms.forEach((z) => {
      const r = z.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      z.style.setProperty('--zoom', calm() ? '1' : (1.28 - p * 0.28).toFixed(3));
    });
  }
  if (zooms.length) {
    addEventListener(
      'scroll',
      () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(zoom);
        }
      },
      { passive: true },
    );
    zoom();
  }

  /* snapping carousel: the track snaps by itself; the buttons move it one card at a time */
  document.querySelectorAll('.kit-carousel').forEach((c) => {
    const track = c.querySelector('.kit-track');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width ?? 300) + 16;
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: calm() ? 'auto' : 'smooth' });
    c.querySelector('[data-dir="-1"]')?.addEventListener('click', () => go(-1));
    c.querySelector('[data-dir="1"]')?.addEventListener('click', () => go(1));
  });

  /* infinite scroll: when the end of a .kit-feed comes near, the next items are copied in from its template;
     the button does the same for keyboards, and the status line says when there is nothing more */
  document.querySelectorAll('.kit-feed').forEach((feed) => {
    const list = feed.querySelector('.kit-list');
    const pool = [...feed.querySelector('template').content.children];
    const more = feed.querySelector('.kit-more');
    const status = feed.querySelector('.kit-status');
    const load = () => {
      const next = pool.splice(0, 3);
      next.forEach((el) => list.append(el.cloneNode(true)));
      status.textContent = pool.length ? `${list.children.length} shown` : 'That is everything.';
      if (!pool.length) {
        more.hidden = true;
        watch.disconnect();
        return;
      }
      /* observe again: if the end is still in reach after the new items, this loads the next ones too */
      watch.unobserve(end);
      watch.observe(end);
    };
    const watch = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && load(), { rootMargin: '0px 0px 200px 0px' });
    const end = feed.querySelector('.kit-end');
    watch.observe(end);
    more.addEventListener('click', load);
  });
})();

/* reading progress, along the top edge, in its own scheduled frame */
{
  const progress = document.querySelector('.progress');
  let pending = false;
  const paint = () => {
    pending = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? (scrollY / max).toFixed(4) : 0})`;
  };
  addEventListener(
    'scroll',
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(paint);
      }
    },
    { passive: true },
  );
  paint();
}
