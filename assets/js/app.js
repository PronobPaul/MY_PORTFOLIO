/* =========================================================
   Portfolio effects
   1) Zero-gravity floating programming-language logos
   2) Scroll progress, navbar state, scroll-spy, back-to-top
   3) Reveal-on-scroll, animated skill bars, hero mouse glow
   ========================================================= */
(function () {
  'use strict';

    // Always start from the top (hero) when the page is reloaded
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function goTop() {
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  goTop();
  window.addEventListener('load', goTop);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     2) UI behaviour
  --------------------------------------------------------- */
  const nav = $('#mainNav');
  const progress = $('.scroll-progress span');
  const toTop = $('#toTop');
  const navLinks = $$('.nav-link[href^="#"]');
  const spySections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (toTop) toTop.classList.toggle('show', y > 600);

    let current = null;
    const pos = y + window.innerHeight * 0.35;
    spySections.forEach(s => { if (s.offsetTop <= pos) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Close the mobile menu after clicking a link
  const collapseEl = $('#navbarToggler');
  navLinks.forEach(a => a.addEventListener('click', () => {
    if (collapseEl && collapseEl.classList.contains('show') && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
    }
  }));

  // Hero: glow follows the mouse
  const hero = $('#hero-section');
  if (hero) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  // Hero: 3D tilt for the photo
  const stage = $('#hero3d');
  if (hero && stage && !reduceMotion) {
    const MAX = 14;                                   // max tilt in degrees
    hero.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      stage.classList.remove('idle');
      stage.style.setProperty('--ry', clamp(px, -1, 1) * MAX + 'deg');
      stage.style.setProperty('--rx', clamp(-py, -1, 1) * MAX + 'deg');
    });
    hero.addEventListener('pointerleave', () => {
      stage.classList.add('idle');
      stage.style.setProperty('--rx', '0deg');
      stage.style.setProperty('--ry', '0deg');
    });
  }

  // Reveal on scroll
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Skill bars + percentage count-up (fills when scrolled into view)
  const skills = $$('.skills-div');
  skills.forEach(div => {
    const bar = $('.progress-bar', div);
    const label = $('.skill-percent', div);
    if (!bar) return;
    div._pct = parseInt(bar.style.width, 10) || 0;
    div._done = false;
    if (!reduceMotion) {
      bar.style.width = '0%';
      if (label) label.textContent = '0%';
    }
  });

  function fillSkills() {
    skills.forEach(div => {
      if (div._done) return;
      const r = div.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        div._done = true;
        const bar = $('.progress-bar', div);
        const label = $('.skill-percent', div);
        requestAnimationFrame(() => {
          bar.style.width = div._pct + '%';
          if (label && !reduceMotion) {
            const start = performance.now(), dur = 1500;
            (function tick(now) {
              const p = clamp((now - start) / dur, 0, 1);
              label.textContent = Math.round(div._pct * (1 - Math.pow(1 - p, 3))) + '%';
              if (p < 1) requestAnimationFrame(tick);
            })(start);
          } else if (label) {
            label.textContent = div._pct + '%';
          }
        });
      }
    });
  }
  window.addEventListener('scroll', fillSkills, { passive: true });
  window.addEventListener('load', fillSkills);
  fillSkills();

  /* ---------------------------------------------------------
     1) Zero-gravity floating logos
  --------------------------------------------------------- */
  const ICONS = [
    'devicon-csharp-plain colored',
    'devicon-dotnetcore-plain colored',
    'devicon-java-plain colored',
    'devicon-python-plain colored',
    'devicon-javascript-plain colored',
    'devicon-html5-plain colored',
    'devicon-css3-plain colored',
    'devicon-bootstrap-plain colored',
    'devicon-microsoftsqlserver-plain colored',
    'devicon-mysql-plain colored',
    'devicon-git-plain colored',
    'devicon-github-original colored',
    'devicon-php-plain colored',
    'devicon-cplusplus-plain colored',
    'devicon-c-plain colored',
    'devicon-azure-plain colored',
    'devicon-visualstudio-plain colored',
    'devicon-arduino-plain colored',
    'devicon-androidstudio-plain colored',
    'devicon-postman-plain colored',
    'devicon-figma-plain colored',
    'devicon-nodejs-plain colored',
    'devicon-typescript-plain colored',
    'devicon-docker-plain colored',
    'devicon-react-original colored',
    'devicon-linux-plain colored'
  ];

  const footer = $('#footer');
  if (!footer) return;

  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.prepend(layer);

  let W = 0, H = 0, heroBottom = 0;
  const orbs = [];
  const mouse = { on: false, cx: 0, cy: 0 };
  let lastSY = window.scrollY;
  let lastT = performance.now();
  let raf = 0;

  function measure() {
    const oldW = W, oldH = H;
    W = document.documentElement.clientWidth;
    H = footer.offsetTop;            // floating area ends where the footer starts
    layer.style.height = H + 'px';
    heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
    if (oldW && oldH) {
      orbs.forEach(o => {
        o.x = clamp(o.x * (W / oldW), 0, Math.max(0, W - o.s));
        o.y = clamp(o.y * (H / oldH), 0, Math.max(0, H - o.s));
      });
    }
  }

  function targetCount() {
    return clamp(Math.round((W * H) / 280000), 14, 44);
  }

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let pool = shuffled(ICONS);
  let poolIdx = 0;

  function makeOrb() {
    if (poolIdx >= pool.length) { pool = shuffled(ICONS); poolIdx = 0; }
    const cls = pool[poolIdx++];
    const small = W < 600;
    const z = rand(0.35, 1);                       // depth: 1 = near, 0.35 = far
    const s = Math.round((small ? 30 : 36) + z * (small ? 26 : 42));
    const el = document.createElement('div');
    el.className = 'fx-orb';
    el.style.setProperty('--s', s + 'px');
    el.style.width = el.style.height = s + 'px';
    el.style.opacity = (0.5 + 0.5 * z).toFixed(2);
    if (z < 0.6) el.style.filter = 'blur(' + ((0.6 - z) * 4).toFixed(1) + 'px)';
    const ic = document.createElement('i');
    ic.className = cls;
    el.appendChild(ic);
    layer.appendChild(el);

    const speed = rand(10, 26) * (0.6 + z);
    const a = rand(0, Math.PI * 2);
    const vx = Math.cos(a) * speed, vy = Math.sin(a) * speed;
    return {
      el, ic, s, r: s / 2, m: s * s, z, speed,
      x: rand(0, Math.max(1, W - s)), y: rand(0, Math.max(1, H - s)),
      vx, vy, bx: vx, by: vy,
      rot: rand(0, 360), spin: rand(-14, 14),
      dark: null
    };
  }

  function syncCount() {
    const n = targetCount();
    while (orbs.length < n) orbs.push(makeOrb());
    while (orbs.length > n + 4) { const o = orbs.pop(); o.el.remove(); }
  }

  function step(dt) {
    const sy = window.scrollY;
    const dS = clamp(sy - lastSY, -60, 60);
    lastSY = sy;
    const mx = mouse.cx + window.scrollX, my = mouse.cy + sy;
    const relax = Math.min(1, dt * 1.6);

    for (const o of orbs) {
      // scrolling gives a little inertia kick (near orbs react more)
      if (dS) o.vy += dS * o.z * 0.25;

      // the cursor gently pushes orbs away
      if (mouse.on) {
        const dx = o.x + o.r - mx, dy = o.y + o.r - my;
        const R = o.r + 150, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = 1 - d / R;
          o.vx += (dx / d) * f * f * 1400 * dt;
          o.vy += (dy / d) * f * f * 1400 * dt;
        }
      }

      // slowly drift back to the lazy cruising velocity
      o.vx += (o.bx - o.vx) * relax;
      o.vy += (o.by - o.vy) * relax;

      const sp = Math.hypot(o.vx, o.vy);
      if (sp > 700) { o.vx *= 700 / sp; o.vy *= 700 / sp; }

      o.x += o.vx * dt;
      o.y += o.vy * dt;
      o.rot += o.spin * dt;

      // bounce softly off the walls
      if (o.x < 0) { o.x = 0; o.vx = Math.abs(o.vx); o.bx = Math.abs(o.bx); }
      else if (o.x > W - o.s) { o.x = W - o.s; o.vx = -Math.abs(o.vx); o.bx = -Math.abs(o.bx); }
      if (o.y < 0) { o.y = 0; o.vy = Math.abs(o.vy); o.by = Math.abs(o.by); }
      else if (o.y > H - o.s) { o.y = H - o.s; o.vy = -Math.abs(o.vy); o.by = -Math.abs(o.by); }
    }

    // orb <-> orb elastic collisions
    for (let i = 0; i < orbs.length; i++) {
      const a = orbs[i];
      for (let j = i + 1; j < orbs.length; j++) {
        const b = orbs[j];
        const dx = (b.x + b.r) - (a.x + a.r), dy = (b.y + b.r) - (a.y + a.r);
        const min = a.r + b.r;
        if (Math.abs(dx) > min || Math.abs(dy) > min) continue;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
        const overlap = min - d;
        const tm = a.m + b.m;
        a.x -= nx * overlap * (b.m / tm); a.y -= ny * overlap * (b.m / tm);
        b.x += nx * overlap * (a.m / tm); b.y += ny * overlap * (a.m / tm);
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rv < 0) {
          const imp = (2 * rv) / tm;
          a.vx += imp * b.m * nx; a.vy += imp * b.m * ny;
          b.vx -= imp * a.m * nx; b.vy -= imp * a.m * ny;
          // new cruising direction, same lazy speed
          let s1 = Math.hypot(a.vx, a.vy) || 1, s2 = Math.hypot(b.vx, b.vy) || 1;
          a.bx = a.vx / s1 * a.speed; a.by = a.vy / s1 * a.speed;
          b.bx = b.vx / s2 * b.speed; b.by = b.vy / s2 * b.speed;
        }
      }
    }
  }

    function render() {
    const top = window.scrollY - 200, bottom = window.scrollY + window.innerHeight + 200;
    for (const o of orbs) {
      // already placed and far off-screen -> skip. A new orb is always placed once.
      if (o.placed && (o.y + o.s < top || o.y > bottom)) continue;
      o.placed = true;
      o.el.style.transform = 'translate3d(' + o.x.toFixed(1) + 'px,' + o.y.toFixed(1) + 'px,0)';
      o.ic.style.transform = 'rotate(' + o.rot.toFixed(1) + 'deg)';
      const dark = o.y + o.r < heroBottom;
      if (dark !== o.dark) { o.dark = dark; o.el.classList.toggle('on-dark', dark); }
    }
  }

  function frame(t) {
    const dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;
    step(dt);
    render();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    lastT = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function init() {
    measure();
    syncCount();
    render();
    if (!reduceMotion) start();
  }

  // pointer interaction
  window.addEventListener('pointermove', e => { mouse.on = true; mouse.cx = e.clientX; mouse.cy = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.on = false; });
  window.addEventListener('pointerup', e => { if (e.pointerType === 'touch') mouse.on = false; });

  // click / tap = little shockwave
  window.addEventListener('pointerdown', e => {
    if (reduceMotion) return;
    const px = e.clientX + window.scrollX, py = e.clientY + window.scrollY;
    orbs.forEach(o => {
      const dx = o.x + o.r - px, dy = o.y + o.r - py, d = Math.hypot(dx, dy) || 1, R = 280;
      if (d < R) {
        const f = 1 - d / R;
        o.vx += (dx / d) * f * 520;
        o.vy += (dy / d) * f * 520;
      }
    });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduceMotion) start();
  });

  // page height changes when images load / window resizes
  if ('ResizeObserver' in window) {
    let t;
    new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => { measure(); syncCount(); if (reduceMotion) render(); onScroll(); }, 150);
    }).observe(document.body);
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();