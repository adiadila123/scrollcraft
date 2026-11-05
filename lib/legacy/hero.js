// @ts-nocheck
/* Scroll, particle and hero engine. Plain DOM code kept as written so the behaviour is identical. */
export default function initHero() {

(function () {
  var FACE = '/face.jpg';
  window.VESSEL_FACE = FACE;
  /* ---------- hero: particle head ---------- */
  var heroEl = document.querySelector('.hero');
  var canvas = document.getElementById('stage');
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.getElementById('fallback').hidden = false;
    return;
  }
  renderer.setClearColor(0x000000, 1);

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onHome = (location.hash.replace('#', '') || 'home') === 'home' || ['top'].indexOf(location.hash.replace('#', '')) >= 0;
  var heroVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(heroEl);
  }
  window.addEventListener('vessel:route', function (e) {
    onHome = e.detail === 'home';
    if (onHome) requestAnimationFrame(resize);
  });

  var rand = (function (a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  })(20261103);

  function G(x, y, cx, cy, sx, sy, h) {
    var dx = x - cx, dy = y - cy;
    return h * Math.exp(-(dx * dx / (2 * sx * sx) + dy * dy / (2 * sy * sy)));
  }
  function faceR2(x, y) { return (x / 0.72) * (x / 0.72) + (y / 1.15) * (y / 1.15); }
  function H(x, y) {
    var r2 = faceR2(x, y);
    if (r2 >= 1) return 0;
    var z = 0.7 * Math.sqrt(1 - r2);
    var a = Math.abs(x);
    z += G(a, y, 0, -0.20, 0.06, 0.20, 0.11);
    z += G(a, y, 0, -0.40, 0.11, 0.09, 0.13);
    z -= G(a, y, 0.33, -0.05, 0.13, 0.06, 0.08);
    z += G(a, y, 0.33, 0.06, 0.18, 0.045, 0.05);
    z += G(a, y, 0.45, -0.45, 0.14, 0.14, 0.05);
    z += G(a, y, 0, -0.68, 0.15, 0.035, 0.04);
    z += G(a, y, 0, -0.78, 0.14, 0.045, 0.05);
    z -= G(a, y, 0, -0.72, 0.16, 0.012, 0.035);
    z += G(a, y, 0, -1.05, 0.18, 0.10, 0.06);
    return z;
  }

  var U = {
    uP: { value: 0 }, uTime: { value: 0 }, uScale: { value: 1000 }, uFade: { value: 1 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) }, uMouseAmt: { value: 0 }, uMouseVel: { value: new THREE.Vector3(0, 0, 0) }
  };

  var pointVS = [
    'uniform float uP; uniform float uTime; uniform float uScale; uniform float uFade;',
    'uniform vec3 uMouse; uniform vec3 uMouseVel; uniform float uMouseAmt;',
    'attribute vec3 aSeed; attribute vec3 aCol; attribute float aSize;',
    'varying vec3 vCol; varying float vA;',
    'void main() {',
    '  vec3 s = aSeed;',
    '  vec3 home = position;',
    '  vec3 origin = vec3((s.x - 0.5) * 5.0 + home.x * 0.8, (s.y - 0.5) * 4.5 + home.y * 0.6, -1.2 - s.z * 4.5);',
    '  float delay = 0.30 * s.y + 0.28 * clamp(length(home.xy) / 1.3, 0.0, 1.0);',
    '  float a = clamp((uP - delay) / 0.42, 0.0, 1.0);',
    '  float m = 1.0 - pow(1.0 - a, 3.0);',
    '  vec3 p = mix(origin, home, m);',
    '  float w = (1.0 - m) * m * 4.0;',
    '  float ph = uTime * 1.2 + s.z * 6.2831;',
    '  p += vec3(sin(ph + s.x * 9.0), cos(ph * 0.9 + s.y * 9.0), sin(ph * 0.7 + s.z * 9.0)) * 0.35 * w;',
    '  p += vec3(sin(uTime * 0.9 + s.x * 40.0), cos(uTime * 0.8 + s.y * 40.0), sin(uTime * 0.7 + s.z * 40.0)) * 0.004 * m;',
    '  vec2 dm = p.xy - uMouse.xy;',
    '  float dd = length(dm);',
    '  float f = exp(-dd * dd / (2.0 * 0.22 * 0.22)) * uMouseAmt * m;',
    '  vec2 jit = vec2(sin(uTime * 3.0 + s.x * 50.0), cos(uTime * 2.6 + s.y * 50.0));',
    '  p.xy += uMouseVel.xy * f * (0.8 + s.x * 0.8);',
    '  p.xy += jit * f * 0.035;',
    '  p.z += f * (0.12 + s.z * 0.25);',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float v = clamp(max(aCol.r, max(aCol.g, aCol.b)) / 1.5, 0.0, 1.0);',
    '  float osc = 0.5 + 0.5 * sin(uTime * (0.7 + s.x * 1.8) + s.y * 40.0);',
    '  float breathe = mix(1.0, 0.3 + 0.7 * osc * osc, uFade);',
    '  float arrive = a * (1.0 - a) * 4.0;',
    '  vec3 col = mix(aCol, vec3(0.35, 0.8, 1.0) * (0.6 + v), (1.0 - m) * 0.75);',
    '  col += vec3(0.4, 0.8, 1.0) * arrive * 0.7;',
    '  col += vec3(0.25, 0.55, 0.9) * f * 0.8;',
    '  float appear = 0.1 + 0.9 * smoothstep(0.0, 0.5, a);',
    '  vCol = col;',
    '  vA = (0.3 + 0.7 * v) * appear * breathe;',
    '  float sz = aSize * (1.0 + arrive * 0.8) * (1.0 + f * 0.6);',
    '  gl_PointSize = max(1.5, sz * uScale / (-mv.z));',
    '}'
  ].join('\n');

  var pointFS = [
    'varying vec3 vCol; varying float vA;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5);',
    '  if (d > 0.5) discard;',
    '  float g = smoothstep(0.5, 0.0, d);',
    '  gl_FragColor = vec4(vCol, vA * g * g * 1.6);',
    '}'
  ].join('\n');

  var dustVS = [
    'uniform float uP; uniform float uTime; uniform float uScale;',
    'attribute vec3 aSeed;',
    'varying vec3 vCol; varying float vA;',
    'void main() {',
    '  float open = smoothstep(0.0, 0.4, uP);',
    '  float life = fract(uTime * (0.05 + aSeed.y * 0.07) + aSeed.z);',
    '  vec3 p = position;',
    '  p.y += life * (1.2 + aSeed.x * 2.2);',
    '  p.x += sin(uTime * 0.8 + aSeed.z * 20.0 + life * 5.0) * 0.12 * life + life * 0.3 * (aSeed.y - 0.3);',
    '  p.z += (aSeed.x - 0.4) * life * 0.8;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  vCol = mix(vec3(0.2, 0.55, 1.0), vec3(0.6, 0.9, 1.0), aSeed.y);',
    '  vA = open * sin(3.14159 * life) * (0.15 + 0.4 * aSeed.y);',
    '  gl_PointSize = max(1.2, (0.02 + aSeed.x * 0.03) * uScale / (-mv.z));',
    '}'
  ].join('\n');

  function mat(vs, fs) {
    return new THREE.ShaderMaterial({
      uniforms: U, vertexShader: vs, fragmentShader: fs,
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending
    });
  }
  function attr(arr, n) { return new THREE.BufferAttribute(new Float32Array(arr), n); }

  var scene = new THREE.Scene();
  var group = new THREE.Group();
  scene.add(group);

  var img = new Image();
  img.onload = function () {
    var W = img.width, Hh = img.height;
    var c = document.createElement('canvas');
    c.width = W; c.height = Hh;
    var ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    var px = ctx.getImageData(0, 0, W, Hh).data;

    var S = 0.00326 * (977 / Hh);
    var CX = W * 0.4986, CY = Hh * 0.4626;

    var pos = [], seed = [], col = [], size = [];
    for (var py = 0; py < Hh; py++) {
      for (var pxl = 0; pxl < W; pxl++) {
        var i = (py * W + pxl) * 4;
        var r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255;
        var v = Math.max(r, g, b);
        var x = (pxl - CX) * S, y = (CY - py) * S;
        var inside = faceR2(x, y) < 1.12;
        if (v < (inside ? 0.08 : 0.3)) continue;
        var copies = v > 0.45 ? 3 : (v > 0.2 ? 2 : 1);
        for (var k = 0; k < copies; k++) {
          var jx = x + (rand() - 0.5) * S, jy = y + (rand() - 0.5) * S;
          var z = inside ? H(jx, jy) + (rand() - 0.5) * 0.012 : (rand() - 0.5) * 0.08;
          pos.push(jx, jy, z);
          seed.push(rand(), rand(), rand());
          col.push(r * 1.5, g * 1.5, b * 1.5);
          size.push(S * (1.15 + 1.5 * v));
        }
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', attr(pos, 3));
    geo.setAttribute('aSeed', attr(seed, 3));
    geo.setAttribute('aCol', attr(col, 3));
    geo.setAttribute('aSize', attr(size, 1));
    var face = new THREE.Points(geo, mat(pointVS, pointFS));

    var dpos = [], dseed = [];
    for (var q = 0; q < 1800; q++) {
      dpos.push((rand() * 2 - 1) * 1.0, -1.2 + rand() * 2.1, (rand() - 0.5) * 0.8 + 0.1);
      dseed.push(rand(), rand(), rand());
    }
    var dgeo = new THREE.BufferGeometry();
    dgeo.setAttribute('position', attr(dpos, 3));
    dgeo.setAttribute('aSeed', attr(dseed, 3));
    var smoke = new THREE.Points(dgeo, mat(dustVS, pointFS));

    [face, smoke].forEach(function (o) { o.frustumCulled = false; group.add(o); });
    window.__heroReady = true;
  };
  img.onerror = function () {
    document.getElementById('fallback').textContent = 'The face image could not be loaded.';
    document.getElementById('fallback').hidden = false;
  };
  img.src = FACE;

  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);

  function resize() {
    var w = heroEl.clientWidth, h = heroEl.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    var asp = w / h;
    camera.aspect = asp;
    var dist = Math.max(4.4, 3.2 / asp);
    camera.position.set(0, -0.05, dist);
    camera.lookAt(0, -0.05, 0);
    camera.updateProjectionMatrix();
    U.uScale.value = renderer.domElement.height / (2 * Math.tan(camera.fov * Math.PI / 360));
    var off = Math.min(Math.max((asp - 1.05) * 1.1, 0), 0.9);
    var portrait = Math.min(Math.max((0.95 - asp) / 0.4, 0), 1);
    group.position.x = off;
    group.position.y = portrait * 0.34 * dist * 0.3153;
  }
  window.addEventListener('resize', resize);
  resize();

  var FORM = 3.2;
  function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }
  var phase = reduced ? 2 : 0;
  var ptime = 0;
  var progress = reduced ? 1 : 0;
  var stateEl = document.getElementById('state');
  var shown = -1;

  function stepTimeline(dt) {
    ptime += dt;
    if (phase === 0) {
      progress = 0;
      if (ptime > 0.1 && window.__loaderDone !== false) { phase = 1; ptime = 0; }
    } else if (phase === 1) {
      var x = Math.min(ptime / FORM, 1);
      progress = ease(x);
      if (x >= 1) { phase = 2; progress = 1; }
    }
  }
  function showProgress() {
    var pct = Math.round(progress * 100);
    if (pct !== shown) {
      shown = pct;
      stateEl.textContent = pct >= 100 ? 'Presence ready' : 'Assembling ' + ('00' + pct).slice(-3) + '%';
    }
  }
  showProgress();
  if (reduced) U.uFade.value = 0;

  var ndc = new THREE.Vector2(0, 0);
  var raycaster = new THREE.Raycaster();
  var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.3);
  var hit = new THREE.Vector3();
  var prevMouse = new THREE.Vector3(), vtmp = new THREE.Vector3();
  var mouseTarget = new THREE.Vector3(0, 0, 0);
  var amtTarget = 0;
  var mx = 0, my = 0, rx = 0, ry = 0;

  function setPointer(ev) {
    var r = heroEl.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    return true;
  }
  window.addEventListener('pointermove', function (ev) {
    if (!setPointer(ev)) return;
    mx = ndc.x; my = -ndc.y;
    amtTarget = 1;
  });
  window.addEventListener('pointerdown', function (ev) { if (setPointer(ev)) amtTarget = 1; });
  function release(ev) { if (!ev || ev.pointerType === 'touch') amtTarget = 0; }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  document.documentElement.addEventListener('pointerleave', function () { amtTarget = 0; });
  window.addEventListener('blur', function () { amtTarget = 0; });

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!onHome || !heroVisible) { requestAnimationFrame(frame); return; }
    U.uTime.value += reduced && phase === 2 ? dt * 0.5 : dt;
    stepTimeline(dt);
    U.uP.value = progress;
    showProgress();

    var swayY = reduced ? 0 : mx * 0.2 + Math.sin(U.uTime.value * 0.25) * 0.05;
    var swayX = reduced ? 0 : my * 0.08;
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
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

}
