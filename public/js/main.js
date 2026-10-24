(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mod = (n, m) => ((n % m) + m) % m;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ----------------------------------------------------------
     1. WALLPAPER BERGERAK
     Tiga lapis bintang yang melayang dan berkelip, planet
     bercincin yang bergerak pelan, serta bintang jatuh.
     Mengikuti gerak mouse dan scroll (efek parallax).
     ---------------------------------------------------------- */
  function wallpaper() {
    const canvas = $('#space');
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;

    let accent = '#FF8A3D';
    let visor = '#7FE0FF';
    function readColors() {
      const css = getComputedStyle(document.documentElement);
      accent = css.getPropertyValue('--accent').trim() || accent;
      visor = css.getPropertyValue('--visor').trim() || visor;
    }
    readColors();
    // warna aksen berubah saat pengunjung memilih tema lain (lihat js/ui.js)
    document.addEventListener('themechange', () => {
      readColors();
      if (reduceMotion.matches) frame(0, 0);
    });

    // Atur kerapatan dan kecepatan bintang di sini
    const layers = [
      { count: 110, speed: 6,  depth: 0.15, size: [0.4, 0.9], alpha: 0.5 },
      { count: 55,  speed: 12, depth: 0.4,  size: [0.7, 1.4], alpha: 0.75 },
      { count: 22,  speed: 22, depth: 0.9,  size: [1.1, 2.0], alpha: 1 }
    ];

    let w = 0, h = 0, dpr = 1;
    let stars = [];
    let streaks = [];
    let nextStreak = 2;
    let scrollY = window.scrollY;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    function build() {
      const density = Math.min(Math.max((w * h) / (1440 * 900), 0.45), 1.6);
      stars = [];
      layers.forEach((layer) => {
        const total = Math.round(layer.count * density);
        for (let i = 0; i < total; i++) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: rand(layer.size[0], layer.size[1]),
            a: rand(0.55, 1) * layer.alpha,
            twinkle: rand(0.6, 2.2),
            phase: rand(0, Math.PI * 2),
            layer,
            tint: Math.random() < 0.12
          });
        }
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion.matches) frame(0, 0);
    }

    function drawRing(cx, cy, rx, ry, rot, from, to, color, width) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, rot, from, to);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    function drawPlanet(t) {
      const r = Math.min(Math.max(Math.min(w, h) * 0.11, 46), 130);
      const cx = w * 0.84 + Math.sin(t * 0.05) * 30 - mouse.x * 14;
      const cy = h * 0.28 + Math.cos(t * 0.04) * 20 - scrollY * 0.05 - mouse.y * 10;
      const rot = -0.35;
      const fade = w < 700 ? 0.55 : 1;

      ctx.save();
      ctx.globalAlpha = fade;

      // bagian belakang cincin
      drawRing(cx, cy, r * 2.2, r * 0.58, rot, Math.PI, Math.PI * 2, 'rgba(127,224,255,0.16)', 1.5);
      drawRing(cx, cy, r * 1.85, r * 0.48, rot, Math.PI, Math.PI * 2, hexToRgba(accent, 0.34), 2);

      // badan planet
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#131B45';
      ctx.fill();

      // garis pita awan di permukaan planet
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.lineWidth = r * 0.14;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - r, cy + i * r * 0.36);
        ctx.quadraticCurveTo(cx, cy + i * r * 0.36 + r * 0.14, cx + r, cy + i * r * 0.36);
        ctx.stroke();
      }
      ctx.restore();

      // tepi yang terkena cahaya
      ctx.beginPath();
      ctx.arc(cx, cy, r, -2.7, -0.9);
      ctx.strokeStyle = 'rgba(127,224,255,0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // bagian depan cincin
      drawRing(cx, cy, r * 2.2, r * 0.58, rot, 0, Math.PI, 'rgba(127,224,255,0.2)', 1.5);
      drawRing(cx, cy, r * 1.85, r * 0.48, rot, 0, Math.PI, hexToRgba(accent, 0.5), 2);

      // bulan kecil yang mengorbit
      const mx = cx + Math.cos(t * 0.22) * r * 2.6;
      const my = cy + Math.sin(t * 0.22) * r * 0.9 - r * 0.2;
      ctx.beginPath();
      ctx.arc(mx, my, Math.max(r * 0.12, 5), 0, Math.PI * 2);
      ctx.fillStyle = '#C9D3EA';
      ctx.fill();

      ctx.restore();
    }

    function drawMoon(t) {
      const x = w * 0.09 + Math.sin(t * 0.07) * 18 - mouse.x * 22;
      const y = h * 0.78 + Math.cos(t * 0.06) * 14 - scrollY * 0.08 - mouse.y * 14;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#18204D';
      ctx.fill();
      ctx.strokeStyle = 'rgba(127,224,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - 6, y - 5, 4, 0, Math.PI * 2);
      ctx.arc(x + 7, y + 6, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#222C52';
      ctx.fill();
    }

    function drawStreaks(dt) {
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x -= Math.cos(s.angle) * s.speed * dt;
        s.y += Math.sin(s.angle) * s.speed * dt;
        s.life -= dt;
        if (s.life <= 0 || s.x < -s.len || s.y > h + s.len) {
          streaks.splice(i, 1);
          continue;
        }
        const tailX = s.x + Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;
        const g = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(1, 'rgba(127,224,255,0)');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    function frame(t, dt) {
      ctx.clearRect(0, 0, w, h);

      // gerakan mouse dihaluskan
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      drawPlanet(t);
      drawMoon(t);

      for (const s of stars) {
        const L = s.layer;
        s.x -= L.speed * dt;
        s.y += L.speed * 0.25 * dt;
        const px = mod(s.x - mouse.x * L.depth * 28, w);
        const py = mod(s.y - scrollY * L.depth * 0.15 - mouse.y * L.depth * 18, h);
        const tw = 0.6 + 0.4 * Math.sin(t * s.twinkle + s.phase);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.tint ? visor : '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion.matches) {
        if (t > nextStreak) {
          streaks.push({
            x: rand(w * 0.35, w * 1.05),
            y: rand(-20, h * 0.35),
            angle: rand(0.45, 0.75),
            speed: rand(700, 1100),
            len: rand(120, 220),
            life: rand(1.2, 2)
          });
          nextStreak = t + rand(3.5, 8);
        }
        drawStreaks(dt);
      }
    }

    function hexToRgba(hex, alpha) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!m) return 'rgba(255,138,61,' + alpha + ')';
      return 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',' + alpha + ')';
    }

    let last = performance.now();
    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      frame(now / 1000, dt);
      if (!reduceMotion.matches) requestAnimationFrame(loop);
    }

    // dipanggil dari js/ui.js saat astronot di hero diklik
    document.addEventListener('spawn-streaks', () => {
      if (reduceMotion.matches) return;
      for (let i = 0; i < 4; i++) {
        streaks.push({
          x: rand(w * 0.4, w * 1.05),
          y: rand(-20, h * 0.45),
          angle: rand(0.45, 0.75),
          speed: rand(800, 1200),
          len: rand(140, 240),
          life: rand(1.2, 2) + i * 0.15
        });
      }
    });

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('pointermove', (e) => {
      mouse.tx = (e.clientX / w - 0.5) * 2;
      mouse.ty = (e.clientY / h - 0.5) * 2;
    }, { passive: true });
    reduceMotion.addEventListener('change', () => {
      if (!reduceMotion.matches) { last = performance.now(); requestAnimationFrame(loop); }
      else frame(0, 0);
    });

    resize();
    if (!reduceMotion.matches) requestAnimationFrame(loop);
  }

  /* ----------------------------------------------------------
     2. LAYAR LOADING
     Progres berjalan minimal MIN_TIME ms dan baru selesai
     setelah semua aset (gambar, font) benar-benar termuat.
     ---------------------------------------------------------- */
  function loader() {
    const el = $('#loader');
    if (!el) { document.body.classList.remove('is-loading'); return; }

    const bar = $('#loaderBar');
    const count = $('#loaderCount');
    const status = $('#loaderStatus');

    const MIN_TIME = reduceMotion.matches ? 500 : 2400;  // lama minimal loading (ms)
    const MAX_TIME = 7000;                               // batas paksa jika aset lambat
    const steps = [
      [0,   'Memeriksa sistem...'],
      [25,  'Mengisi bahan bakar...'],
      [55,  'Hitung mundur dimulai...'],
      [85,  'Mesin menyala...'],
      [100, 'Meluncur!']
    ];

    const t0 = performance.now();
    let loaded = document.readyState === 'complete';
    let shown = 0;
    let finished = false;

    window.addEventListener('load', () => { loaded = true; }, { once: true });

    function setStatus(p) {
      let label = steps[0][1];
      steps.forEach(([at, text]) => { if (p >= at) label = text; });
      if (status.textContent !== label) status.textContent = label;
    }

    function finish() {
      if (finished) return;
      finished = true;
      setTimeout(() => {
        el.classList.add('launch');                 // astronot terbang ke atas
        setTimeout(() => {
          el.classList.add('done');                 // layar memudar
          document.body.classList.remove('is-loading');
          document.dispatchEvent(new Event('launched'));
          setTimeout(() => el.remove(), 900);
        }, reduceMotion.matches ? 0 : 650);
      }, reduceMotion.matches ? 0 : 300);
    }

    function tick(now) {
      const elapsed = now - t0;
      let target = Math.min(elapsed / MIN_TIME, 1) * 92;
      if ((loaded && elapsed >= MIN_TIME) || elapsed >= MAX_TIME) target = 100;

      shown += (target - shown) * 0.1;
      if (target - shown < 0.4) shown = target;

      const p = Math.round(shown);
      count.textContent = p;
      bar.style.transform = 'scaleX(' + shown / 100 + ')';
      setStatus(p);

      if (shown >= 100) finish();
      else requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------
     3. NAVIGASI
     ---------------------------------------------------------- */
function nav() {
    const header = $('.nav');
    const button = $('.nav__toggle');
    const menu = $('#menu');
    if (!header || !button || !menu) return;

    const links = [...menu.querySelectorAll('a[href^="#"]')];
    const homeLink = menu.querySelector('a[href="#atas"]');

    // Paksa menu "Home" aktif jika posisi scroll masih di bagian paling atas
    const updateNavAtTop = () => {
      if (window.scrollY < 200) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        if (homeLink) homeLink.setAttribute('aria-current', 'true');
        return true;
      }
      return false;
    };

    const onScroll = () => {
      header.classList.toggle('is-stuck', window.scrollY > 12);
      updateNavAtTop();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const setOpen = (open) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      menu.classList.toggle('is-open', open);
    };
    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    // tandai menu sesuai bagian yang sedang dilihat
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      if (updateNavAtTop()) return; // Abaikan jika masih di area Hero/Home

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.removeAttribute('aria-current'));
        const active = byId.get(entry.target.id);
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-30% 0px -50% 0px' });

    byId.forEach((_, id) => {
      if (id === 'atas') return; // Jangan amati elemen #atas agar tidak bentrok
      const section = document.getElementById(id);
      if (section) io.observe(section);
    });
  }

  /* ----------------------------------------------------------
     4. JAM "WAKTU DI ORBIT"
     Mulai berdetak sejak layar loading selesai.
     ---------------------------------------------------------- */
  function missionClock() {
    const el = $('#clock');
    if (!el) return;
    const pad = (n) => String(n).padStart(2, '0');
    let started = false;

    function start() {
      if (started) return;
      started = true;
      const t0 = Date.now();
      const update = () => {
        const s = Math.floor((Date.now() - t0) / 1000);
        el.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
      };
      update();
      setInterval(update, 1000);
    }

    if ($('#loader')) document.addEventListener('launched', start, { once: true });
    else start();
  }

  /* ---------- Jalankan ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  wallpaper();
  loader();
  nav();
  missionClock();
})();
