/* Atelier Sora: one three.js scene behind the page, and the scroll makes the vase. A lump of wet clay is thrown into
   shape on the wheel, trimmed and dried, then dipped in glaze. Every change is mapped to the scroll, so scrolling back
   unmakes it; the scene is drawn only when something changes, never in a loop. Without WebGL a drawing stands in,
   and the glaze buttons work either way. */
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
const CLAY = { wet: '#6f5040', leather: '#9a7a5f', bisque: '#d6c2a6' };
let draw = () => {};

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;

/* where the reader is, in panels: 0 on the first, 1 on the second and so on, measured from the real sections */
const panels = [...document.querySelectorAll('.panel')];
function stage() {
  const y = scrollY + innerHeight * 0.5;
  for (let i = 0; i < panels.length - 1; i++) {
    const a = panels[i].offsetTop + panels[i].offsetHeight * 0.5;
    const b = panels[i + 1].offsetTop + panels[i + 1].offsetHeight * 0.5;
    if (y < b) return i + clamp((y - a) / (b - a));
  }
  return panels.length - 1;
}

/* the steps rail: the step being read is lit */
const steps = [...document.querySelectorAll('.steps a')];
function light(s) {
  const at = Math.round(s);
  steps.forEach((a, i) => a.toggleAttribute('aria-current', i === at));
}

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
     blended: a lump of clay, the first pull, the thrown vase with its ridges, and the trimmed vase with a foot */
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
     iron speckles; the shader reads each point's height and angle on the piece */
  const uniforms = {
    uClay: { value: new THREE.Color(CLAY.wet) },
    uGlaze: { value: new THREE.Color(GLAZES.celadon) },
    uLine: { value: 2 },
    uClayRough: { value: 0.45 },
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
        uniform vec3 uClay; uniform vec3 uGlaze; uniform float uLine; uniform float uClayRough;
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
        /* glaze pools darker where the wall turns in */
        glaze *= 0.85 + 0.15 * smoothstep(-1.0, 1.0, vLocal.y);
        diffuseColor.rgb = mix(uClay, glaze, g);`,
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(uClayRough, 0.18, glazeMask());');
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
  const g = sc.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.55)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 3.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.26;
  const group = new THREE.Group();
  group.add(piece, wheel, shadow);
  scene.add(group);

  scene.add(new THREE.HemisphereLight('#fff3e6', '#140f0b', 1.1));
  const key = new THREE.DirectionalLight('#ffe9d2', 2.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#b9d3ff', 1.8);
  rim.position.set(-4, 2.5, -3);
  scene.add(rim);

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

  let lastShape = '';
  function render() {
    queued = false;
    /* with reduced motion: the finished, glazed vase, off the wheel, seen from the front */
    const s = isStill() ? panels.length - 1 : stage();
    light(s);
    const throwT = smooth(0.25, 1, s);
    const trimT = smooth(1.25, 2, s);
    const ridges = (1 - trimT) * smooth(0.5, 1, throwT);
    const key = `${throwT.toFixed(3)}|${trimT.toFixed(3)}`;
    if (key !== lastShape) {
      lastShape = key;
      shape(throwT, trimT, ridges);
    }
    /* clay: wet while it is thrown, leather-hard when trimmed, bisque before the glaze */
    tmp
      .set(CLAY.wet)
      .lerp(new THREE.Color(CLAY.leather), trimT)
      .lerp(new THREE.Color(CLAY.bisque), smooth(2, 2.4, s));
    uniforms.uClay.value.copy(tmp);
    uniforms.uClayRough.value = mix(0.4, 0.92, smooth(1.2, 2.4, s));
    /* the glaze line falls from above the lip to just over the foot, as if the piece were dipped */
    uniforms.uLine.value = mix(1.5, -1.02, smooth(2.25, 3, s));
    uniforms.uGlaze.value.lerp(glazeTarget, isStill() ? 1 : 0.2);

    /* the scroll turns the wheel; once trimmed, the piece leaves it and the wheel drops out of frame */
    piece.rotation.y = s * Math.PI * 1.5;
    wheel.rotation.y = piece.rotation.y;
    const off = smooth(1.6, 2.4, s);
    wheel.position.y = -1.32 - off * 3;
    wheel.visible = off < 1;
    /* the closing shot comes round to a three-quarter view from slightly above */
    const orbit = smooth(3.2, 4, s);
    const r = (wide ? 7.8 : 10.6) - orbit * 0.4;
    const ang = mix(0, 0.55, orbit);
    camera.position.set(Math.sin(ang) * r, mix(0.5, 1.6, orbit), Math.cos(ang) * r);
    camera.lookAt(0, -0.05, 0);
    /* wide screens: the piece stands right of the text; phones: in the top half, above the card */
    group.position.set(wide ? 1.25 : 0, wide ? -0.05 : 1.05, 0);
    group.scale.setScalar(wide ? 0.92 : 0.78);

    renderer.render(scene, camera);
    if (Math.abs(uniforms.uGlaze.value.r - glazeTarget.r) + Math.abs(uniforms.uGlaze.value.g - glazeTarget.g) > 0.002) queue();
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
