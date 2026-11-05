// @ts-nocheck
/* Scroll, particle and hero engine. Plain DOM code kept as written so the behaviour is identical. */
export default function initSite() {

(function () {
  document.documentElement.classList.add('js');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAGES = ['home', 'start', 'skills', 'prompting', 'build', 'motion', 'playground', 'advanced', 'launch'];
  var TABS = ['start', 'skills', 'build', 'motion', 'more'];
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var topbar = document.getElementById('topbar');
  var tabInd = document.getElementById('tabind');
  var route = 'home';

  /* ---------- cinematic scroll: inertial smooth scrolling (Lenis) ---------- */
  var lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.2, easing: function (x) { return Math.min(1, 1.001 - Math.pow(2, -10 * x)); }, smoothWheel: true });
    requestAnimationFrame(function lenisFrame(time) { lenis.raf(time); requestAnimationFrame(lenisFrame); });
  }
  function toTop(smooth) {
    if (lenis) lenis.scrollTo(0, { immediate: !smooth, force: true });
    else window.scrollTo({ top: 0, behavior: smooth && !reduced ? 'smooth' : 'auto' });
  }

  /* ---------- scroll reveal (transform only, content stays visible) ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;

  function armReveals(page) {
    var items = page.querySelectorAll('.rv');
    Array.prototype.forEach.call(items, function (el, i) {
      el.classList.remove('in');
      el.style.setProperty('--d', (Math.min(i % 4, 3) * 0.06) + 's');
      if (io) io.observe(el); else el.classList.add('in');
    });
  }

  /* ---------- router ---------- */
  function currentRoute() {
    var h = (location.hash || '').replace('#', '');
    if (h === 'top' || h === '') return 'home';
    return PAGES.indexOf(h) >= 0 ? h : 'home';
  }
  function setActive(r) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      if (a.dataset.nav === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var tk = TABS.indexOf(r) >= 0 ? r : (r === 'home' ? '' : 'more'); var idx = TABS.indexOf(tk);
    Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (a) {
      if (a.dataset.tab === tk) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (tabInd) {
      if (idx >= 0) { tabInd.style.setProperty('--i', idx); tabInd.style.opacity = '1'; }
      else { tabInd.style.opacity = '0'; }
    }
  }
  function render(first) {
    var r = currentRoute();
    var same = (r === route) && !first;
    route = r;
    pages.forEach(function (p) {
      var on = p.dataset.route === r;
      p.hidden = !on;
      if (on) { p.classList.remove('enter'); void p.offsetWidth; if (!reduced) p.classList.add('enter'); armReveals(p); }
    });
    setActive(r);
    if (!same || first) toTop(false);
    if (r === 'motion') requestAnimationFrame(function () { measure(); fx(window.scrollY || 0); });
    updateBar();
    window.dispatchEvent(new CustomEvent('vessel:route', { detail: r }));
  }
  window.addEventListener('hashchange', function () { render(false); });

  /* tapping the active tab scrolls to top, like iOS */
  Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (a) {
    a.addEventListener('click', function (e) {
      if (a.dataset.tab === route) { e.preventDefault(); toTop(true); }
    });
  });
  document.getElementById('totop').addEventListener('click', function () { toTop(true); });

  /* ---------- top bar state and scroll progress ---------- */
  var progressEl = document.getElementById('progress');
  var ticking = false;
  function updateBar() {
    var y = window.scrollY || 0;
    topbar.classList.toggle('solid', route !== 'home' || y > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressEl.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    fx(y);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(updateBar); } }, { passive: true });
  window.addEventListener('resize', updateBar);

  /* ---------- scrollytelling steps ---------- */
  var vpanels = Array.prototype.slice.call(document.querySelectorAll('.vpanel'));
  var stepEls = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var stepNow = document.getElementById('stepnow');
  var curStep = -1;
  function pick(i) {
    if (i === curStep) return;
    curStep = i;
    vpanels.forEach(function (p, j) { p.hidden = j !== i; });
    stepEls.forEach(function (s, j) { s.classList.toggle('on', j === i); });
    if (stepNow && stepEls[i]) stepNow.textContent = stepEls[i].dataset.name;
  }
  pick(0);
  var bars = document.getElementById('bars');
  if (bars) {
    for (var i = 0; i < 38; i++) {
      var s = document.createElement('span');
      var env = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.42) * Math.cos(i * 0.17));
      s.style.setProperty('--h', env.toFixed(2));
      s.style.setProperty('--t', (0.7 + ((i * 37) % 11) / 10).toFixed(2) + 's');
      s.style.setProperty('--dl', (-((i * 53) % 13) / 10).toFixed(2) + 's');
      bars.appendChild(s);
    }
  }

  /* ---------- skip link ---------- */
  var skip = document.getElementById('skiplink');
  if (skip) skip.addEventListener('click', function (e) {
    e.preventDefault();
    var h = document.querySelector('.page:not([hidden]) h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
  });

  /* ---------- copy buttons ---------- */
  function copyText(text, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = o; }, 1400); };
    var fallback = function () {
      try {
        var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done();
      } catch (e) { btn.textContent = 'Select and copy'; }
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.cpy') : null;
    if (!b) return;
    if (b.hasAttribute('data-copy-code')) copyText(b.closest('.code').querySelector('pre').textContent, b);
    else if (b.hasAttribute('data-copy-prev')) copyText(b.previousElementSibling.textContent, b);
  });

  /* ---------- platform tabs (kept in sync everywhere) ---------- */
  function setPlatform(p) {
    Array.prototype.forEach.call(document.querySelectorAll('.ptabs button'), function (b) { b.setAttribute('aria-selected', b.dataset.p === p ? 'true' : 'false'); });
    Array.prototype.forEach.call(document.querySelectorAll('.ppanel'), function (el) { el.hidden = el.dataset.p !== p; });
    try { localStorage.setItem('sc-platform', p); } catch (e) {}
  }
  Array.prototype.forEach.call(document.querySelectorAll('.ptabs button'), function (b) { b.addEventListener('click', function () { setPlatform(b.dataset.p); }); });
  try { var savedP = localStorage.getItem('sc-platform'); if (savedP) setPlatform(savedP); } catch (e) {}

  /* ---------- launch checklist ---------- */
  var checks = Array.prototype.slice.call(document.querySelectorAll('[data-check]'));
  var checkCount = document.getElementById('checkcount');
  function updateChecks(save) {
    var n = checks.filter(function (c) { return c.checked; }).length;
    if (checkCount) checkCount.textContent = n + ' of ' + checks.length + ' done';
    if (save) { try { localStorage.setItem('sc-checks', JSON.stringify(checks.map(function (c) { return c.checked ? 1 : 0; }))); } catch (e) {} }
  }
  try { var sv = JSON.parse(localStorage.getItem('sc-checks') || '[]'); checks.forEach(function (c, i) { c.checked = !!sv[i]; }); } catch (e) {}
  checks.forEach(function (c) { c.addEventListener('change', function () { updateChecks(true); }); });
  updateChecks(false);

  /* ---------- magnetic buttons (fine pointers only) ---------- */
  if (!reduced && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic], .cta-sm'), function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- scroll behaviours ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var faceImg = document.querySelector('img[data-face]');
  if (faceImg && window.VESSEL_FACE) faceImg.src = window.VESSEL_FACE;

  var copyEl = document.getElementById('copy');
  var stageEl = document.getElementById('stage');
  var pinEl = document.getElementById('words');
  var zoomEl = document.getElementById('zoom');
  var zoomImg = zoomEl ? zoomEl.querySelector('canvas') : null;
  var plxEl = document.getElementById('plx');
  var plxLayers = plxEl ? Array.prototype.slice.call(plxEl.querySelectorAll('[data-px]')) : [];
  var scrolly = document.getElementById('scrolly');
  var hs = document.getElementById('hs');
  var hsTrack = document.getElementById('hstrack');
  var hsBar = document.getElementById('hsbar');
  var hsMax = 0, hsPinH = 0;

  /* 5. split the statement into words so each can follow the scroll */
  var stmt = document.getElementById('stmt');
  var words = [];
  if (stmt) {
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(stmt.childNodes).forEach(function (n) {
      var dim = n.nodeType === 1;
      n.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = 'w' + (dim ? ' dim' : '');
        s.textContent = part;
        frag.appendChild(s);
        words.push(s);
      });
    });
    stmt.textContent = '';
    stmt.appendChild(frag);
    if (reduced) words.forEach(function (w) { w.style.opacity = 1; });
  }

  /* 8. size the tall wrapper so vertical scroll distance equals the track overflow */
  function measure() {
    if (!hs || reduced) return;
    var pin = hs.querySelector('.hs-pin');
    hsPinH = pin.offsetHeight;
    if (!hsPinH) return;
    hsTrack.style.transform = '';
    hsMax = Math.max(0, hsTrack.scrollWidth - pin.clientWidth);
    hs.style.height = hsMax ? (hsMax + hsPinH) + 'px' : '';
  }
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  function fx(y) {
    var vh = window.innerHeight, r, p, i;
    if (route === 'home' && !reduced) {
      /* 7. parallax: hero canvas lags, copy leaves faster */
      if (y < vh * 1.3 && stageEl && copyEl) {
        stageEl.style.transform = 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)';
        copyEl.style.transform = 'translate3d(0,' + (-y * 0.12).toFixed(1) + 'px,0)';
        copyEl.style.opacity = clamp(1 - y / (vh * 0.75), 0, 1).toFixed(3);
      }
      /* 5. scroll-driven words */
      if (pinEl && words.length) {
        r = pinEl.getBoundingClientRect();
        p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        for (i = 0; i < words.length; i++) {
          words[i].style.opacity = (0.16 + 0.84 * clamp((p - (0.08 + 0.74 * i / words.length)) / 0.05, 0, 1)).toFixed(2);
        }
      }
      /* 6. zoom on scroll */
      if (zoomEl && zoomImg) {
        r = zoomEl.getBoundingClientRect();
        p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        zoomImg.style.transform = 'scale(' + (1 + 0.6 * p).toFixed(3) + ')';
      }
      /* 7. parallax layers */
      if (plxEl) {
        r = plxEl.getBoundingClientRect();
        var d = clamp(r.top + r.height / 2 - vh / 2, -vh * 1.2, vh * 1.2);
        plxLayers.forEach(function (l) {
          l.style.transform = 'translate3d(0,' + (-(1 - parseFloat(l.dataset.px)) * d).toFixed(1) + 'px,0)';
        });
      }
    }
    if (route === 'build' && scrolly && stepEls.length) {
      /* 9. scrollytelling: pick the step nearest the reading line */
      var mid = vh * (window.innerWidth <= 900 ? 0.68 : 0.5), best = 0, bd = 1e9;
      stepEls.forEach(function (s, j) {
        var q = s.getBoundingClientRect();
        var dd = Math.abs(q.top + q.height / 2 - mid);
        if (dd < bd) { bd = dd; best = j; }
      });
      pick(best);
    }
    if (route === 'motion' && !reduced && hs && hsMax > 0) {
      /* 8. horizontal scroll */
      r = hs.getBoundingClientRect();
      p = clamp((topbar.offsetHeight - r.top) / hsMax, 0, 1);
      hsTrack.style.transform = 'translate3d(' + (-p * hsMax).toFixed(1) + 'px,0,0)';
      hsBar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    }
  }

  /* 4. infinite feed: a sentinel at the bottom asks for the next batch */
  var FEED = [
    ["Brief", "I want a minimalist cinematic scroll site about [subject] for [audience]. The visitor should finish by [one action]. List the sections you propose, one line each, and wait for my approval before writing code."],
    ["Brief", "Ask me up to five questions that would change the design. Skip anything you can decide sensibly yourself."],
    ["Structure", "Create index.html, style.css and app.js using plain HTML, CSS and JavaScript, no framework. Include a hero, three content sections, one call to action and a short footer."],
    ["Structure", "Use a black background, one accent colour and one pair of Google Fonts. Define every colour as a CSS custom property."],
    ["Smooth scroll", "Add Lenis smooth scrolling from the jsDelivr CDN, driven by requestAnimationFrame. Do not start it when prefers-reduced-motion is set."],
    ["Smooth scroll", "The page feels heavy under the mouse wheel. Reduce the Lenis duration and tell me which values you changed."],
    ["Reveals", "Reveal each section once when it enters the viewport: opacity and a 24 px rise, staggered by 80 ms among siblings. Never hide content again on scroll up."],
    ["Reveals", "Some elements stay invisible. Find every .reveal that never receives the visible class and explain why."],
    ["Parallax", "Give the hero three background layers with data-speed values 0.2, 0.35 and 0.5. Stop updating after 1.3 viewport heights."],
    ["Parallax", "On a 375 px wide screen the parallax pushes the hero copy off screen. Reduce the offset under 768 px instead of removing the effect."],
    ["Pinned section", "Turn the six feature cards into one pinned horizontal scroll section. Set the wrapper height from the track width, after fonts load and on resize."],
    ["Scrollytelling", "Build a scrollytelling section with a sticky visual on the left that changes with the active step, and four text steps on the right. Stack them under 900 px with the visual sticky at the top."],
    ["Scroll driven", "Light up the words of the headline one by one as the section scrolls, using a pinned section 240vh tall."],
    ["Zoom", "Scale the image from 1 to 1.5 while it crosses the viewport. Use transform only."],
    ["3D", "Add a Three.js particle hero from the cdnjs build pinned to an exact version. Sample the points from an image drawn to a canvas. Pause rendering when the hero is off screen."],
    ["3D", "Cap the pixel ratio at 2 and halve the particle count under 768 px. Report the frame rate you measured, or say you could not measure it."],
    ["Mobile", "Add an iOS-style bottom tab bar under 760 px with safe-area padding and a sliding highlight. Hide the top menu there."],
    ["Accessibility", "Add a skip link, visible focus styles and aria-current on the active menu item. Check that every control works with the keyboard."],
    ["Accessibility", "Make prefers-reduced-motion switch off parallax, reveal movement and smooth scrolling together, not just one of them."],
    ["Performance", "List the three heaviest things on the page by transfer size and by main-thread time. Fix the heaviest one and measure again."],
    ["Review", "Act as a strict art director. Score the page 1 to 10 for hierarchy, pacing and mobile readability, list the three worst problems, fix them, and score again."],
    ["Review", "Take screenshots at 375, 768 and 1440 px and describe anything overlapping, clipped or unreadable."],
    ["Content", "Replace placeholder copy with concrete sentences. Do not invent statistics, customers or quotes. Mark anything illustrative as an example."],
    ["Publish", "Check that every asset path is relative, then give me the exact steps to publish this folder as a static site."]
  ];
  var feedEl = document.getElementById('feed');
  var feedEnd = document.getElementById('feedend');
  var feedMsg = document.getElementById('feedmsg');
  var feedCount = document.getElementById('feedcount');
  var fed = 0, loading = false, feedIO = null;
  function loadBatch() {
    if (loading || fed >= FEED.length) return;
    loading = true;
    feedEnd.classList.add('busy');
    setTimeout(function () {
      var n = Math.min(6, FEED.length - fed);
      for (var k = 0; k < n; k++) {
        var it = FEED[fed++];
        var li = document.createElement('li');
        li.className = 'fi';
        li.innerHTML = '<span class="mono">P' + ('0' + fed).slice(-2) + '</span><div><div class="mono ft"></div><p></p><button type="button" class="cpy" data-copy-prev>Copy prompt</button></div>';
        li.querySelector('.ft').textContent = it[0];
        li.querySelector('p').textContent = it[1];
        feedEl.appendChild(li);
        (function (l) { requestAnimationFrame(function () { requestAnimationFrame(function () { l.classList.add('in'); }); }); })(li);
      }
      feedCount.textContent = fed + ' of ' + FEED.length + ' loaded';
      loading = false;
      if (fed >= FEED.length) {
        feedEnd.classList.remove('busy');
        feedMsg.textContent = 'End of the sample list';
        if (feedIO) feedIO.disconnect();
      } else if (feedIO) {
        feedIO.unobserve(feedEnd);
        feedIO.observe(feedEnd);
      }
    }, reduced ? 0 : 500);
  }
  if (feedEnd) {
    if ('IntersectionObserver' in window) {
      feedIO = new IntersectionObserver(function (es) { if (es[0].isIntersecting) loadBatch(); }, { rootMargin: '0px 0px 320px 0px' });
      feedIO.observe(feedEnd);
    } else {
      while (fed < FEED.length) loadBatch();
    }
  }

  /* ---------- particle images ---------- */
  var PCs = [];
  var faceData = null, faceLoading = false;
  function mulberry(seed) {
    var a = seed | 0;
    return function () {
      a = a + 0x6D2B79F5 | 0;
      var q = Math.imul(a ^ a >>> 15, 1 | a);
      q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q;
      return ((q ^ q >>> 14) >>> 0) / 4294967296;
    };
  }
  function fract(v) { return v - Math.floor(v); }

  function makeShape(kind) {
    var R = mulberry(11), i, j, k;
    var s = { n: 0, P: null, W: null, S: null, A: null, vy: 0, ay0: 0, ax: 0, ax0: 0, mx: 0, my: 0, ptr: false, wide: false, fill: 0.9, update: null };
    function alloc(n) {
      s.n = n; s.P = new Float32Array(n * 3); s.W = new Uint8Array(n); s.S = new Float32Array(n);
      for (i = 0; i < n; i++) { s.W[i] = R() < 0.1 ? 1 : 0; s.S[i] = 0.8 + R() * 0.9; }
    }
    function alphaArr() { s.A = new Float32Array(s.n); for (i = 0; i < s.n; i++) s.A[i] = 1; }
    if (kind === 'globe') {
      alloc(2600);
      var ga = Math.PI * (3 - Math.sqrt(5));
      for (i = 0; i < s.n; i++) {
        var gy = 1 - 2 * (i + 0.5) / s.n, gr = Math.sqrt(1 - gy * gy), th = ga * i;
        s.P[i * 3] = Math.cos(th) * gr; s.P[i * 3 + 1] = gy; s.P[i * 3 + 2] = Math.sin(th) * gr;
      }
      s.vy = 0.14; s.ax = 0.4;
    } else if (kind === 'torus') {
      alloc(3400);
      for (i = 0; i < s.n; i++) {
        var u = R() * 6.2832, v = R() * 6.2832, rr = 0.3 + (R() - 0.5) * 0.03;
        s.P[i * 3] = (0.68 + rr * Math.cos(v)) * Math.cos(u);
        s.P[i * 3 + 1] = rr * Math.sin(v);
        s.P[i * 3 + 2] = (0.68 + rr * Math.cos(v)) * Math.sin(u);
      }
      s.vy = 0.16; s.ax = 0.95;
    } else if (kind === 'lattice') {
      alloc(729);
      for (k = 0, i = 0; i < 9; i++) for (j = 0; j < 9; j++) for (var l = 0; l < 9; l++, k++) {
        s.P[k * 3] = (i / 8 * 2 - 1) * 0.7; s.P[k * 3 + 1] = (j / 8 * 2 - 1) * 0.7; s.P[k * 3 + 2] = (l / 8 * 2 - 1) * 0.7;
        s.S[k] += 0.5;
      }
      s.vy = 0.22; s.ax = 0.5; s.ay0 = 0.4; s.fill = 0.8;
    } else if (kind === 'terrain') {
      var g = 58; alloc(g * g); s.ax = 1.0; s.fill = 1.0;
      s.update = function (t) {
        for (var n = 0, a = 0; a < g; a++) for (var b = 0; b < g; b++, n++) {
          var x = a / (g - 1) * 2 - 1, z = b / (g - 1) * 2 - 1;
          s.P[n * 3] = x; s.P[n * 3 + 2] = z;
          s.P[n * 3 + 1] = 0.2 * Math.sin(3 * x + t) + 0.14 * Math.cos(4 * z - 1.3 * t) + 0.1 * Math.sin(5 * (x + z) + 0.7 * t);
        }
      };
    } else if (kind === 'wave') {
      alloc(61 * 12); s.wide = true; s.fill = 0.92;
      for (i = 0; i < 61; i++) for (j = 0; j < 12; j++) if (j === 5 || j === 6) s.W[i * 12 + j] = 1;
      s.update = function (t) {
        for (var a = 0; a < 61; a++) {
          var x = a / 60 * 2 - 1;
          var env = (0.12 + 0.88 * Math.abs(Math.sin(x * 3.1 + t * 1.3) * Math.cos(x * 1.7 - t * 0.9))) * (0.35 + 0.65 * Math.exp(-x * x * 1.1));
          for (var b = 0; b < 12; b++) {
            var n = a * 12 + b;
            s.P[n * 3] = x; s.P[n * 3 + 1] = (b / 11 * 2 - 1) * env * 0.85; s.P[n * 3 + 2] = 0;
          }
        }
      };
    } else if (kind === 'net') {
      var N = [[-0.85, 0], [-0.35, 0.55], [-0.35, -0.55], [0.2, 0], [0.85, 0]];
      var E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [1, 2]];
      var per = 55, cl = 45, ne = E.length * per;
      alloc(ne + N.length * cl); s.wide = true; s.fill = 0.9;
      var off = [], jit = [], cx = [], cy = [];
      for (i = 0; i < ne; i++) { off.push(R()); jit.push((R() - 0.5) * 0.03); }
      for (i = 0; i < N.length * cl; i++) { var an = R() * 6.2832, rd = Math.sqrt(R()) * 0.09; cx.push(Math.cos(an) * rd); cy.push(Math.sin(an) * rd * 1.4); s.W[ne + i] = R() < 0.3 ? 1 : 0; }
      s.update = function (t) {
        for (var n = 0; n < ne; n++) {
          var e = E[Math.floor(n / per)], f = fract(off[n] + t * 0.22), A = N[e[0]], B = N[e[1]];
          s.P[n * 3] = A[0] + (B[0] - A[0]) * f; s.P[n * 3 + 1] = A[1] + (B[1] - A[1]) * f + jit[n]; s.P[n * 3 + 2] = 0;
        }
        for (var m = 0; m < N.length * cl; m++) {
          var nd = N[Math.floor(m / cl)], br = 1 + 0.15 * Math.sin(t * 2 + Math.floor(m / cl));
          s.P[(ne + m) * 3] = nd[0] + cx[m] * br; s.P[(ne + m) * 3 + 1] = nd[1] + cy[m] * br; s.P[(ne + m) * 3 + 2] = 0;
        }
      };
    } else if (kind === 'stream') {
      var L = 9, pl = 90; alloc(L * pl); alphaArr(); s.wide = true; s.fill = 0.94;
      var so = [], sp = [];
      for (i = 0; i < s.n; i++) { so.push(R()); sp.push(0.07 + 0.1 * R() + 0.015 * Math.floor(i / pl)); }
      s.update = function (t) {
        for (var n = 0; n < s.n; n++) {
          var lane = Math.floor(n / pl), f = fract(so[n] + t * sp[n]);
          s.P[n * 3] = f * 2 - 1;
          s.P[n * 3 + 1] = -0.62 + lane * 0.1 + 0.04 * Math.sin(f * 9 + so[n] * 20 + t);
          s.P[n * 3 + 2] = 0;
          s.A[n] = Math.pow(Math.sin(Math.PI * f), 0.7);
        }
      };
    } else if (kind === 'rings') {
      var rp = 150, cn = 120; alloc(3 * rp + cn); alphaArr(); s.ax = 1.05; s.fill = 0.95;
      var th2 = [], cr = [];
      for (i = 0; i < 3 * rp; i++) th2.push(R() * 6.2832);
      for (i = 0; i < cn; i++) { cr.push([R() * 6.2832, Math.sqrt(R()) * 0.07]); s.W[3 * rp + i] = 1; }
      s.update = function (t) {
        var n;
        for (n = 0; n < 3 * rp; n++) {
          var ring = Math.floor(n / rp), rr = fract(t * 0.2 + ring / 3), rad = rr * 0.95;
          s.P[n * 3] = Math.cos(th2[n]) * rad; s.P[n * 3 + 1] = 0; s.P[n * 3 + 2] = Math.sin(th2[n]) * rad;
          s.A[n] = (1 - rr) * Math.min(rr * 6, 1);
        }
        for (var m = 0; m < cn; m++) {
          n = 3 * rp + m;
          var pul = 1 + 0.25 * Math.sin(t * 2.4);
          s.P[n * 3] = Math.cos(cr[m][0] + t * 0.6) * cr[m][1] * pul; s.P[n * 3 + 1] = 0; s.P[n * 3 + 2] = Math.sin(cr[m][0] + t * 0.6) * cr[m][1] * pul;
          s.A[n] = 1;
        }
      };

    } else if (kind === 'tree') {
      var tp_ = [];
      (function grow(x, y, z, ax, az, len, depth, b0) {
        var steps = Math.max(5, Math.round(len * 100)), dx = Math.sin(ax) * Math.cos(az), dy = Math.cos(ax), dz = Math.sin(ax) * Math.sin(az), m, db = 0.12, u;
        for (m = 0; m <= steps; m++) { u = m / steps; tp_.push([x + dx * len * u, y + dy * len * u, z + dz * len * u, b0 + u * db, 0]); }
        var ex = x + dx * len, ey = y + dy * len, ez = z + dz * len;
        if (depth === 0) { for (var q = 0; q < 6; q++) tp_.push([ex + (R() - 0.5) * 0.07, ey + (R() - 0.5) * 0.07, ez + (R() - 0.5) * 0.07, b0 + db + R() * 0.05, 1]); return; }
        var nb = depth > 2 ? 2 : 3;
        for (var c = 0; c < nb; c++) grow(ex, ey, ez, ax + (R() - 0.5) * 1.1 + (c - (nb - 1) / 2) * 0.85, az + c * 2.1 + R(), len * 0.76, depth - 1, b0 + db);
      })(0, -0.95, 0, 0, 0, 0.45, 5, 0);
      alloc(tp_.length); alphaArr();
      var tB = new Float32Array(s.n), tx0 = new Float32Array(s.n), ty0 = new Float32Array(s.n);
      for (i = 0; i < s.n; i++) { s.P[i * 3] = tp_[i][0]; s.P[i * 3 + 1] = tp_[i][1]; s.P[i * 3 + 2] = tp_[i][2]; tB[i] = tp_[i][3]; s.W[i] = tp_[i][4]; tx0[i] = tp_[i][0]; ty0[i] = tp_[i][1]; }
      s.vy = 0.12; s.ax0 = 0.12; s.ax = 0.12; s.ptr = true; s.fill = 0.82;
      s.update = function (t) {
        var ph = (t * 0.11) % 1.7, out = Math.min(1, Math.max(0, (1.7 - ph) * 3)), n, a;
        for (n = 0; n < s.n; n++) {
          a = Math.min(1, Math.max(0, (ph - tB[n]) * 9));
          s.A[n] = a * out;
          s.P[n * 3] = tx0[n] + Math.sin(t * 0.9 + ty0[n] * 2.2) * 0.02 * (ty0[n] + 1);
        }
      };
    } else if (kind === 'blocks') {
      var bE = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
      var bL = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      var bPer = bL.length * 6, bN = 27, bHome = [], bDir = [], bDly = [], bA, bB, bu, bq, bj, bc = 0.3, bg = 0.5, bx, by, bz, bv;
      alloc(bN * bPer); alphaArr(); s.fill = 0.74; s.ax0 = 0.5; s.ax = 0.5; s.vy = 0.2; s.ptr = true;
      var bBase = new Float32Array(s.n * 3), bCube = new Uint8Array(s.n);
      for (bj = 0; bj < bN; bj++) {
        bx = bj % 3 - 1; by = Math.floor(bj / 3) % 3 - 1; bz = Math.floor(bj / 9) - 1;
        bHome.push([bx * bg, by * bg, bz * bg]);
        bv = [R() - 0.5, R() - 0.5, R() - 0.5]; var bl = Math.hypot(bv[0], bv[1], bv[2]) || 1; bDir.push([bv[0] / bl * 1.4, bv[1] / bl * 1.4, bv[2] / bl * 1.4]);
        bDly.push(bj === 13 ? 0.78 : ((bx + 1) + (by + 1) + (bz + 1)) / 6 * 0.55 + R() * 0.1);
        for (bq = 0; bq < bL.length; bq++) for (bu = 0; bu < 6; bu++) {
          bA = bE[bL[bq][0]]; bB = bE[bL[bq][1]]; var bn = bj * bPer + bq * 6 + bu, f = bu / 6;
          bBase[bn * 3] = (bA[0] + (bB[0] - bA[0]) * f - 0.5) * bc; bBase[bn * 3 + 1] = (bA[1] + (bB[1] - bA[1]) * f - 0.5) * bc; bBase[bn * 3 + 2] = (bA[2] + (bB[2] - bA[2]) * f - 0.5) * bc;
          bCube[bn] = bj; s.W[bn] = bj === 13 ? 1 : 0;
        }
      }
      s.update = function (t) {
        var ph = (t * 0.12) % 1.75, out = Math.min(1, Math.max(0, (1.75 - ph) * 4)), n, j2, p, e, h, d, pul;
        for (n = 0; n < s.n; n++) {
          j2 = bCube[n]; h = bHome[j2]; d = bDir[j2];
          p = Math.min(1, Math.max(0, (ph - bDly[j2]) * 2.2)); e = 1 - Math.pow(1 - p, 3);
          pul = j2 === 13 && p >= 1 ? 1 + 0.1 * Math.sin(t * 3) : 1;
          s.P[n * 3] = h[0] + d[0] * (1 - e) + bBase[n * 3] * pul; s.P[n * 3 + 1] = h[1] + d[1] * (1 - e) + bBase[n * 3 + 1] * pul; s.P[n * 3 + 2] = h[2] + d[2] * (1 - e) + bBase[n * 3 + 2] * pul;
          s.A[n] = p * out;
        }
      };
    } else if (kind === 'text') {
      s.wide = true; s.fill = 0.92;
      var xRows = 9, xr, xx, xlist, xmax, xw, xs = [];
      for (xr = 0; xr < xRows; xr++) {
        xx = -0.9; xmax = xr % 4 === 3 ? 0.1 + R() * 0.5 : 0.85 - R() * 0.15; xlist = [];
        while (xx < xmax - 0.06) { xw = Math.min(0.1 + R() * 0.3, xmax - xx); xlist.push([xx, xx + xw, R() < 0.13 ? 1 : 0]); xx += xw + 0.05; }
        for (var xi = 0; xi < xlist.length; xi++) {
          var cnt = Math.round((xlist[xi][1] - xlist[xi][0]) * 80);
          for (var xq = 0; xq < cnt; xq++) for (var xk = 0; xk < 2; xk++) xs.push([xlist[xi][0] + (xlist[xi][1] - xlist[xi][0]) * xq / cnt, 0.72 - xr * 0.18 + xk * 0.022, xr, (xlist[xi][0] + 0.9) / (xmax + 0.9) + (xq / cnt) * ((xlist[xi][1] - xlist[xi][0]) / (xmax + 0.9)), xlist[xi][2]]);
        }
      }
      var xBody = xs.length, xCar = 10;
      alloc(xBody + xCar); alphaArr();
      var xRow = new Uint8Array(s.n), xU = new Float32Array(s.n), xBX = new Float32Array(s.n), xBY = new Float32Array(s.n), xMax = [];
      for (i = 0; i < xBody; i++) { s.P[i * 3] = xs[i][0]; s.P[i * 3 + 1] = xs[i][1]; xBX[i] = xs[i][0]; xBY[i] = xs[i][1]; xRow[i] = xs[i][2]; xU[i] = xs[i][3]; s.W[i] = xs[i][4]; }
      for (i = xBody; i < s.n; i++) s.W[i] = 1;
      s.update = function (t) {
        var cyc = (t * 0.11) % 1.3, tpg = cyc * xRows * 0.95, out = Math.min(1, Math.max(0, (1.3 - cyc) * 6)), n, fr, lift, dx, dy, cr = Math.min(xRows - 1, Math.floor(tpg)), cf = Math.min(1, Math.max(0, tpg - cr)), lx = -0.9 + cf * 1.75, bl = Math.sin(t * 9) > 0 ? 1 : 0.3;
        for (n = 0; n < xBody; n++) {
          fr = Math.min(1, Math.max(0, tpg - xRow[n]));
          dx = xBX[n] - s.mx; dy = xBY[n] - s.my; lift = 0.07 * Math.exp(-(dx * dx + dy * dy) * 9);
          s.P[n * 3 + 1] = xBY[n] + lift;
          s.A[n] = (xU[n] <= fr ? 1 : 0) * out;
        }
        for (n = xBody; n < s.n; n++) { s.P[n * 3] = lx; s.P[n * 3 + 1] = 0.72 - cr * 0.18 + ((n - xBody) / (xCar - 1) - 0.3) * 0.09; s.A[n] = tpg < xRows ? bl * out : 0; }
      };
    } else if (kind === 'scaffold') {
      var sL = 6, sH = 0.3, sa = 0.55, sd = 0.4, sy0 = -0.9, sPts = [], sk, sline;
      function sAdd(k2, ax2, ay2, az2, bx2, by2, bz2) { for (var q = 0; q < 28; q++) { var f = q / 28; sPts.push([ax2 + (bx2 - ax2) * f, ay2 + (by2 - ay2) * f, az2 + (bz2 - az2) * f, k2]); } }
      for (sk = 0; sk < sL; sk++) {
        var yb = sy0 + sk * sH, yt = yb + sH;
        if (sk === 0) { sAdd(0, -sa, yb, -sd, sa, yb, -sd); sAdd(0, sa, yb, -sd, sa, yb, sd); sAdd(0, sa, yb, sd, -sa, yb, sd); sAdd(0, -sa, yb, sd, -sa, yb, -sd); }
        sAdd(sk, -sa, yt, -sd, sa, yt, -sd); sAdd(sk, sa, yt, -sd, sa, yt, sd); sAdd(sk, sa, yt, sd, -sa, yt, sd); sAdd(sk, -sa, yt, sd, -sa, yt, -sd);
        sAdd(sk, -sa, yb, -sd, -sa, yt, -sd); sAdd(sk, sa, yb, -sd, sa, yt, -sd); sAdd(sk, sa, yb, sd, sa, yt, sd); sAdd(sk, -sa, yb, sd, -sa, yt, sd);
        sAdd(sk, -sa, yb, sd, sa, yt, sd); sAdd(sk, sa, yb, -sd, -sa, yt, -sd);
      }
      var sg = 11, sn0 = sPts.length;
      for (i = 0; i < sg; i++) for (j = 0; j < sg; j++) sPts.push([(i / (sg - 1) * 2 - 1) * 0.95, sy0, (j / (sg - 1) * 2 - 1) * 0.8, -1]);
      alloc(sPts.length); alphaArr(); s.fill = 0.8; s.ax0 = 0.38; s.ax = 0.38; s.vy = 0.22; s.ptr = true;
      var sLev = new Int8Array(s.n), sY = new Float32Array(s.n);
      for (i = 0; i < s.n; i++) { s.P[i * 3] = sPts[i][0]; s.P[i * 3 + 1] = sPts[i][1]; s.P[i * 3 + 2] = sPts[i][2]; sLev[i] = sPts[i][3]; sY[i] = sPts[i][1]; s.W[i] = 0; }
      s.update = function (t) {
        var p = (t * 0.075) % 1.35, out = Math.min(1, Math.max(0, (1.35 - p) * 7)), n, a, lv;
        for (n = 0; n < s.n; n++) {
          lv = sLev[n];
          if (lv < 0) { s.A[n] = 0.35 * out; continue; }
          a = Math.min(1, Math.max(0, p * sL - lv));
          s.A[n] = a * out; s.W[n] = a > 0 && a < 1 ? 1 : 0;
          s.P[n * 3 + 1] = sY[n] - (1 - a) * 0.12;
        }
      };
    } else if (kind === 'tunnel') {
      var tR = 34, tM = 56, tOff0 = 0;
      alloc(tR * tM); alphaArr(); s.wide = true; s.fill = 1;
      for (i = 0; i < s.n; i++) s.W[i] = (i % tM) % 7 === 0 ? 1 : 0;
      s.update = function (t) {
        var off = t * 0.07 + (window.scrollY || 0) * 0.0007, jr, m, dd, z, sc, th, r, n = 0, ang;
        for (jr = 0; jr < tR; jr++) {
          dd = ((jr / tR - off) % 1 + 1) % 1; z = 0.35 + dd * 3; sc = 0.5 / z;
          for (m = 0; m < tM; m++, n++) {
            th = m / tM * 6.2832; ang = th + dd * 2.2; r = 0.55 + 0.1 * Math.sin(3 * th + dd * 9 + t * 0.4);
            s.P[n * 3] = Math.cos(ang) * r * sc * 1.5 + s.mx * 0.3 * dd; s.P[n * 3 + 1] = Math.sin(ang) * r * sc * 1.5 + s.my * 0.3 * dd;
            s.A[n] = Math.pow(1 - dd, 0.8) * Math.min(dd * 10, 1);
            s.S[n] = 0.6 + (1 - dd) * 1.6;
          }
        }
      };
    } else if (kind === 'field') {
      var fG = 52;
      alloc(fG * fG); alphaArr(); s.fill = 0.86; s.ax0 = 0.95; s.ax = 0.95; s.vy = 0.07; s.ptr = true;
      var fR = new Float32Array(s.n);
      for (i = 0; i < fG; i++) for (j = 0; j < fG; j++) { k = i * fG + j; s.P[k * 3] = (i / (fG - 1) * 2 - 1); s.P[k * 3 + 2] = (j / (fG - 1) * 2 - 1); fR[k] = Math.hypot(s.P[k * 3], s.P[k * 3 + 2]) / 1.05; }
      s.update = function (t) {
        var n, x, z, r1, r2, y, k1 = 10, k2 = 10 + s.mx * 4, sx = s.mx * 0.5, sz = -s.my * 0.5;
        for (n = 0; n < s.n; n++) {
          x = s.P[n * 3]; z = s.P[n * 3 + 2];
          r1 = Math.hypot(x + 0.45, z); r2 = Math.hypot(x - 0.45 - sx, z - sz);
          y = 0.22 * (Math.sin(k1 * r1 - t * 2.2) / (1 + 3 * r1) + Math.sin(k2 * r2 - t * 2.2) / (1 + 3 * r2));
          s.P[n * 3 + 1] = y; s.W[n] = y > 0.1 ? 1 : 0;
          s.A[n] = Math.max(0, 1 - Math.pow(fR[n], 4));
        }
      };
    } else if (kind === 'graph') {
      var gN = 44, gp = [], ge = [], gseen = {}, ga2, gb2, gd, gbest, gq;
      while (gp.length < gN) { var cx_ = R() * 2 - 1, cy_ = R() * 2 - 1, cz_ = R() * 2 - 1; if (cx_ * cx_ + cy_ * cy_ + cz_ * cz_ < 1) gp.push([cx_ * 0.82, cy_ * 0.82, cz_ * 0.82]); }
      for (ga2 = 0; ga2 < gN; ga2++) {
        gbest = [];
        for (gb2 = 0; gb2 < gN; gb2++) if (gb2 !== ga2) gbest.push([Math.hypot(gp[ga2][0] - gp[gb2][0], gp[ga2][1] - gp[gb2][1], gp[ga2][2] - gp[gb2][2]), gb2]);
        gbest.sort(function (a, b) { return a[0] - b[0]; });
        for (gq = 0; gq < 3; gq++) { var gk = Math.min(ga2, gbest[gq][1]) * 100 + Math.max(ga2, gbest[gq][1]); if (!gseen[gk]) { gseen[gk] = 1; ge.push([ga2, gbest[gq][1]]); } }
      }
      var gPer = 16, gNodeP = 10;
      alloc(ge.length * gPer + gN * gNodeP); alphaArr(); s.fill = 0.8; s.vy = 0.16; s.ax0 = 0.25; s.ax = 0.25; s.ptr = true;
      var gEdge = new Int16Array(s.n).fill(-1), gU = new Float32Array(s.n), gSp = [], gOf = [];
      for (i = 0; i < ge.length; i++) {
        gSp.push(0.12 + R() * 0.2); gOf.push(R());
        for (j = 0; j < gPer; j++) {
          k = i * gPer + j; var gf = j / (gPer - 1), A_ = gp[ge[i][0]], B_ = gp[ge[i][1]];
          s.P[k * 3] = A_[0] + (B_[0] - A_[0]) * gf; s.P[k * 3 + 1] = A_[1] + (B_[1] - A_[1]) * gf; s.P[k * 3 + 2] = A_[2] + (B_[2] - A_[2]) * gf;
          gEdge[k] = i; gU[k] = gf; s.W[k] = 0;
        }
      }
      for (i = 0; i < gN; i++) for (j = 0; j < gNodeP; j++) {
        k = ge.length * gPer + i * gNodeP + j;
        s.P[k * 3] = gp[i][0] + (R() - 0.5) * 0.045; s.P[k * 3 + 1] = gp[i][1] + (R() - 0.5) * 0.045; s.P[k * 3 + 2] = gp[i][2] + (R() - 0.5) * 0.045;
        s.W[k] = 1; s.A[k] = 1; s.S[k] = 1.3;
      }
      var gEdgeN = ge.length * gPer;
      s.update = function (t) {
        var n, e, d;
        for (n = 0; n < gEdgeN; n++) { e = gEdge[n]; d = (((t * gSp[e] + gOf[e] - gU[n]) % 1) + 1) % 1; s.A[n] = 0.18 + 0.82 * Math.exp(-d * 10); s.W[n] = d < 0.08 ? 1 : 0; }
      };
    } else if (kind === 'plume') {
      var lN = 1750, lS = 260;
      s.wide = true; s.fill = 0.95; alloc(lN + lS); alphaArr();
      var lAge = new Float32Array(s.n), lG1 = new Float32Array(s.n), lG2 = new Float32Array(s.n);
      function gauss() { return (R() + R() + R() - 1.5) * 0.8; }
      for (i = 0; i < lN; i++) { lAge[i] = Math.pow(R(), 1.3) * 0.5; lG1[i] = gauss(); lG2[i] = gauss(); s.W[i] = lAge[i] < 0.03 ? 1 : 0; }
      for (i = lN; i < s.n; i++) { s.P[i * 3] = R() * 2 - 1; s.P[i * 3 + 1] = R() * 2 - 1; lAge[i] = R() * 6.28; s.S[i] = 0.5 + R() * 0.9; s.W[i] = 0; }
      s.update = function (t) {
        var tau = (t * 0.085) % 1, out = tau > 0.9 ? Math.max(0, (1 - tau) * 10) : 1, n, a, tt, sp, px2, py2, ox = s.mx * 0.18;
        for (n = 0; n < lN; n++) {
          a = lAge[n]; tt = tau - a;
          if (tt < 0) { s.A[n] = 0; continue; }
          sp = 0.012 + a * 0.2;
          px2 = -0.62 + 1.25 * Math.pow(tt, 1.5) + ox * tt; py2 = -0.88 + 1.78 * tt - a * 0.1;
          s.P[n * 3] = px2 + lG1[n] * sp; s.P[n * 3 + 1] = py2 + lG2[n] * sp;
          s.A[n] = Math.pow(1 - a / 0.5, 1.4) * out;
        }
        for (n = lN; n < s.n; n++) s.A[n] = (0.25 + 0.55 * Math.abs(Math.sin(t * 1.3 + lAge[n]))) * 0.7;
      };
    }
    if (s.update) s.update(0);
    return s;
  }

  function drawShape(inst, t) {
    var cv = inst.cv, c = inst.ctx, w = cv.width, h = cv.height, d = inst.dpr, s = inst.shape;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, w, h);
    s.mx += ((inst.mx || 0) - s.mx) * 0.07; s.my += ((inst.my || 0) - s.my) * 0.07;
    if (s.ptr) { s.ay0 = s.mx * 0.7; s.ax = s.ax0 + s.my * 0.25; }
    if (s.update) s.update(t);
    var ay = s.ay0 + s.vy * t, ca = Math.cos(ay), sa = Math.sin(ay), cxx = Math.cos(s.ax), sxx = Math.sin(s.ax);
    var sc = Math.min(w, h) / 2 * s.fill, P = s.P, pass, i, x, y, z, x1, z1, y1, z2, k, al, sz, px, py;
    c.globalCompositeOperation = 'lighter';
    for (pass = 0; pass < 2; pass++) {
      c.fillStyle = pass ? 'rgb(92,200,255)' : 'rgb(234,240,244)';
      for (i = 0; i < s.n; i++) {
        if (s.W[i] !== pass) continue;
        x = P[i * 3]; y = P[i * 3 + 1]; z = P[i * 3 + 2];
        if (s.wide) {
          px = w / 2 + x * (w / 2) * s.fill; py = h / 2 - y * (h / 2) * s.fill; k = 1; al = 0.85;
        } else {
          x1 = x * ca + z * sa; z1 = -x * sa + z * ca;
          y1 = y * cxx - z1 * sxx; z2 = y * sxx + z1 * cxx;
          k = 1 / (1 - z2 * 0.22);
          px = w / 2 + x1 * sc * k; py = h / 2 - y1 * sc * k;
          al = 0.25 + 0.75 * (z2 * 0.5 + 0.5);
        }
        if (s.A) al *= s.A[i];
        if (al <= 0.02) continue;
        sz = s.S[i] * d * k;
        c.globalAlpha = al > 1 ? 1 : al;
        c.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
    }
    c.globalAlpha = 1;
  }

  function paintFace(inst) {
    inst.painted = true;
    var cv = inst.cv, c = inst.ctx, w = cv.width, h = cv.height, D = faceData;
    if (!D) return;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    var sc = h * 1.02 / D.h, ox = (w - D.w * sc) / 2, oy = (h - D.h * sc) / 2, st = 2, R = mulberry(5), x, y, i, r, g, b, v;
    c.globalCompositeOperation = 'lighter';
    for (y = 0; y < D.h; y += st) for (x = 0; x < D.w; x += st) {
      i = (y * D.w + x) * 4; r = D.d[i]; g = D.d[i + 1]; b = D.d[i + 2];
      v = Math.max(r, g, b) / 255;
      if (v < 0.22) continue;
      c.fillStyle = 'rgb(' + Math.min(255, r * 1.4 | 0) + ',' + Math.min(255, g * 1.4 | 0) + ',' + Math.min(255, b * 1.4 | 0) + ')';
      c.beginPath();
      c.arc(ox + (x + R() * st) * sc, oy + (y + R() * st) * sc, sc * st * (0.26 + 0.6 * v), 0, 6.2832);
      c.fill();
    }
  }
  function ensureFace() {
    if (faceData || faceLoading || !window.VESSEL_FACE) return;
    faceLoading = true;
    var im = new Image();
    im.onload = function () {
      var cc = document.createElement('canvas'); cc.width = im.width; cc.height = im.height;
      var cx2 = cc.getContext('2d', { willReadFrequently: true });
      cx2.drawImage(im, 0, 0);
      faceData = { w: im.width, h: im.height, d: cx2.getImageData(0, 0, im.width, im.height).data };
      PCs.forEach(function (p) { if (p.kind === 'face' && p.ready && p.vis) paintFace(p); });
    };
    im.src = window.VESSEL_FACE;
  }

  function sizeInst(inst) {
    var cv = inst.cv, w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    var d = Math.min(window.devicePixelRatio || 1, 2) * (inst.kind === 'face' ? 1.5 : 1);
    var bw = Math.min(Math.round(w * d), 3200);
    cv.width = bw; cv.height = Math.round(h * bw / w);
    inst.dpr = bw / w; inst.ready = true;
    inst.painted = false;
    if (inst.kind === 'face') { if (inst.vis) { if (faceData) paintFace(inst); else ensureFace(); } }
    else if (reduced) drawShape(inst, 3);
  }
  var pcRO = ('ResizeObserver' in window) ? new ResizeObserver(function (es) { es.forEach(function (e) { sizeInst(e.target._pc); }); }) : null;
  var pcIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) { es.forEach(function (e) { var q = e.target._pc; q.vis = e.isIntersecting; if (q.vis && q.kind === 'face' && q.ready && !q.painted) { if (faceData) paintFace(q); else ensureFace(); } }); }, { rootMargin: '120px' }) : null;
  Array.prototype.forEach.call(document.querySelectorAll('canvas[data-pc]'), function (cv) {
    var inst = { cv: cv, kind: cv.dataset.pc, ctx: cv.getContext('2d'), vis: !pcIO, ready: false, dpr: 1, shape: null };
    if (inst.kind !== 'face') inst.shape = makeShape(inst.kind);
    cv._pc = inst; PCs.push(inst);
    if (pcRO) pcRO.observe(cv); else sizeInst(inst);
    if (pcIO) pcIO.observe(cv);
  });
  window.addEventListener('pointermove', function (e) {
    for (var q = 0; q < PCs.length; q++) {
      var p = PCs[q]; if (!p.vis || p.kind === 'face') continue;
      var r = p.cv.getBoundingClientRect(); if (!r.width) continue;
      p.mx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      p.my = Math.max(-1, Math.min(1, -((e.clientY - r.top) / r.height * 2 - 1)));
    }
  }, { passive: true });
  var pcT0 = performance.now();
  function pcLoop(now) {
    if (!reduced) {
      var t = (now - pcT0) / 1000;
      for (var q = 0; q < PCs.length; q++) {
        var p = PCs[q];
        if (p.kind !== 'face' && p.ready && p.vis) drawShape(p, t);
      }
    }
    requestAnimationFrame(pcLoop);
  }
  requestAnimationFrame(pcLoop);

  render(true);
})();

}
