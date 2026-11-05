// @ts-nocheck
/* Scroll, particle and hero engine. Plain DOM code kept as written so the behaviour is identical. */
export default function initLab() {

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- More sheet ---- */
  var sheet = $('sheet'), more = $('moretab');
  function openSheet() { sheet.hidden = false; more.setAttribute('aria-expanded', 'true'); }
  function closeSheet() { sheet.hidden = true; more.setAttribute('aria-expanded', 'false'); }
  if (sheet && more) {
    more.addEventListener('click', function () { sheet.hidden ? openSheet() : closeSheet(); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]') || e.target.closest('[data-sheet-link]')) closeSheet(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
    window.addEventListener('hashchange', closeSheet);
  }

  var pg = document.querySelector('[data-route="playground"]');
  function visible() { return pg && !pg.hidden; }

  /* ---- 1. lerp ---- */
  var bar = $('lerpbar'), tEl = $('lerpT'), vEl = $('lerpV'), lerp = 0.1, target = 0.8, cur = 0;
  function setT(e) { var r = bar.getBoundingClientRect(); target = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); }
  var drag = false;
  bar.addEventListener('pointerdown', function (e) { drag = true; setT(e); bar.setPointerCapture(e.pointerId); });
  bar.addEventListener('pointermove', function (e) { if (drag) setT(e); });
  bar.addEventListener('pointerup', function () { drag = false; });
  $('lerpIn').addEventListener('input', function (e) {
    lerp = parseFloat(e.target.value); $('lerpOut').textContent = lerp.toFixed(2);
    $('lerpCode').textContent = 'new Lenis({ lerp: ' + lerp.toFixed(2).replace(/0$/, '') + ' })';
  });
  (function loop() {
    if (visible()) {
      cur += (target - cur) * (reduced ? 1 : lerp);
      var w = bar.clientWidth;
      tEl.style.left = (target * w) + 'px'; vEl.style.left = (cur * w) + 'px';
    }
    requestAnimationFrame(loop);
  })();

  /* ---- 2. parallax ---- */
  var box = $('plxbox'), dots = $('plxdots'), speed = 0.4;
  function plx() { dots.style.transform = 'translate3d(0,' + (reduced ? 0 : box.scrollTop * (1 - speed)) + 'px,0)'; }
  box.addEventListener('scroll', plx, { passive: true });
  $('plxIn').addEventListener('input', function (e) {
    speed = parseFloat(e.target.value); $('plxOut').textContent = speed.toFixed(2);
    $('plxCode').textContent = "layer.style.transform = 'translate3d(0,' + (y * (1 - " + speed.toFixed(2).replace(/0$/, '') + ")) + 'px,0)'";
    plx();
  });
  plx();

  /* ---- 3. stagger ---- */
  var stag = $('stag'), items = stag.children;
  function setDelay(ms) { for (var i = 0; i < items.length; i++) items[i].style.transitionDelay = (reduced ? 0 : i * ms) + 'ms'; }
  function play() {
    stag.classList.remove('on'); setDelay(0); void stag.offsetWidth;
    setDelay(parseInt($('stIn').value, 10)); requestAnimationFrame(function () { stag.classList.add('on'); });
  }
  $('stIn').addEventListener('input', function (e) {
    $('stOut').textContent = e.target.value;
    $('stCode').textContent = '.reveal { transition-delay: calc(var(--d) * ' + e.target.value + 'ms); }';
    setDelay(parseInt(e.target.value, 10));
  });
  $('stPlay').addEventListener('click', play);
  var seen = false;
  new IntersectionObserver(function (l) { if (l[0].isIntersecting && !seen) { seen = true; play(); } }, { threshold: 0.5 }).observe(stag);

  /* ---- 4. easing ---- */
  var cv = $('ezc'), ctx = cv.getContext('2d'), dot = $('ezdot');
  var ids = ['e1', 'e2', 'e3', 'e4'];
  function vals() { return ids.map(function (i) { return parseFloat($(i).value); }); }
  function draw() {
    var v = vals(), s = cv.width, pad = 40, a = s - pad * 2;
    ctx.clearRect(0, 0, s, s);
    var cs = getComputedStyle(document.documentElement);
    var line = cs.getPropertyValue('--line').trim() || '#333', acc = cs.getPropertyValue('--accent').trim() || '#7cc4ff';
    ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.strokeRect(pad, pad, a, a);
    function X(x) { return pad + x * a; } function Y(y) { return s - pad - y * a; }
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.bezierCurveTo(X(v[0]), Y(v[1]), X(v[2]), Y(v[3]), X(1), Y(1));
    ctx.strokeStyle = acc; ctx.lineWidth = 3; ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(v[0]), Y(v[1])); ctx.moveTo(X(1), Y(1)); ctx.lineTo(X(v[2]), Y(v[3])); ctx.stroke();
    ctx.fillStyle = acc; [[v[0], v[1]], [v[2], v[3]]].forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, 7); ctx.fill(); });
    ids.forEach(function (id, i) { $('e' + (i + 1) + 'o').textContent = v[i].toFixed(2); });
    $('ezCode').textContent = 'transition: transform .9s cubic-bezier(' + v.map(function (n) { return n.toFixed(2).replace(/\.?0+$/, ''); }).join(', ') + ');';
  }
  ids.forEach(function (id) { $(id).addEventListener('input', draw); });
  function ezPlay() {
    var v = vals(), travel = dot.parentNode.clientWidth - 16;
    dot.style.transition = 'none'; dot.style.transform = 'translateX(0)'; void dot.offsetWidth;
    dot.style.transition = reduced ? 'none' : 'transform 1.1s cubic-bezier(' + v.join(',') + ')';
    dot.style.transform = 'translateX(' + travel + 'px)';
  }
  $('ezPlay').addEventListener('click', ezPlay);
  Array.prototype.forEach.call(document.querySelectorAll('[data-ez]'), function (b) {
    b.addEventListener('click', function () { b.dataset.ez.split(',').forEach(function (n, i) { $(ids[i]).value = n; }); draw(); ezPlay(); });
  });
  draw();
})();

}
