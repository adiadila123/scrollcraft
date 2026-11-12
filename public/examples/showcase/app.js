/* Atelier Sora: one three.js scene behind the page. The scroll turns the vase and moves the camera; the scene is
   drawn only when something changes, never in a loop. Without WebGL a drawing stands in, and the glaze buttons
   work either way. */
import * as THREE from 'three';

const html = document.documentElement;
html.classList.add('js');
/* reduced motion is respected, unless the page was opened with ?motion=on: the tutorial adds it when the reader
   has turned animations on although their device asks for less motion */
const motionOn = new URLSearchParams(location.search).get('motion') === 'on';
if (motionOn) html.classList.add('motion-on');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches && !motionOn;

const GLAZES = { celadon: '#9fbfa8', tenmoku: '#5a3a26' };
let draw = () => {};

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
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);

  /* the vase: a profile curve (radius, height) turned around the vertical axis, like clay on a wheel */
  const profile = [
    [0, -1.25],
    [0.5, -1.25],
    [0.6, -1.15],
    [0.8, -0.6],
    [0.84, -0.1],
    [0.66, 0.45],
    [0.36, 0.9],
    [0.33, 1.08],
    [0.42, 1.22],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const geometry = new THREE.LatheGeometry(new THREE.SplineCurve(profile).getPoints(80), 120);
  const material = new THREE.MeshStandardMaterial({ color: GLAZES.celadon, roughness: 0.32, side: THREE.DoubleSide });
  const vase = new THREE.Mesh(geometry, material);
  scene.add(vase);
  scene.add(new THREE.HemisphereLight('#fff6ec', '#1a1410', 1.3));
  const key = new THREE.DirectionalLight('#fff1e0', 2.4);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#bcd6ff', 1.4);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  let target = new THREE.Color(GLAZES.celadon);
  let queued = false;
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  };

  function size() {
    const wide = innerWidth >= 900;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    /* wide screens: the vase stands right of the text; phones: in the top half, above the card */
    vase.position.set(wide ? 1.15 : 0, wide ? 0 : 0.75, 0);
  }

  function render() {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = still ? 0.2 : Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
    vase.rotation.y = p * Math.PI * 2.4;
    vase.rotation.z = Math.sin(p * Math.PI) * 0.08;
    camera.position.set(0, 0.3 - p * 0.4, 7.4 - p * 1.4);
    camera.lookAt(0, 0, 0);
    /* the glaze eases towards the chosen colour over a few frames; with reduced motion it switches at once */
    material.color.lerp(target, still ? 1 : 0.18);
    renderer.render(scene, camera);
    if (material.color.getHex() !== target.getHex()) queue();
  }

  draw = (glaze) => {
    if (glaze) target = new THREE.Color(GLAZES[glaze]);
    queue();
  };
  size();
  render();
  addEventListener('resize', () => {
    size();
    queue();
  });
  if (!still) addEventListener('scroll', queue, { passive: true });
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
