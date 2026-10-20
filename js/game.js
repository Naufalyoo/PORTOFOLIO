(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const $ = (selector) => document.querySelector(selector);
  const startBtn = $('#gameStart');
  const pauseBtn = $('#gamePause');
  const scoreEl = $('#gameScore');
  const levelEl = $('#gameLevel');
  const livesEl = $('#gameLives');
  const bestEl = $('#gameBest');
  const statusEl = $('#gameStatus');
  const leftBtn = $('#gameLeft');
  const rightBtn = $('#gameRight');

  const rand = (a, b) => a + Math.random() * (b - a);
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ } }
  };

  const PLAYER_R = 24;
  const MAX_LIVES = 3;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let rafId = 0;
  let last = 0;
  let bgStars = [];
  let colors = { accent: '#FF8A3D', visor: '#7FE0FF', text: '#EEF1FA', muted: '#A5B0CE' };

  const state = {
    mode: 'idle',               // idle | play | pause | over
    score: 0,
    level: 1,
    lives: MAX_LIVES,
    best: Number(store.get('astro-best')) || 0,
    items: [],
    sparks: [],
    spawnIn: 0.6,
    flash: 0,
    px: 0,
    target: 0,
    dir: 0
  };

  function say(text) { if (statusEl) statusEl.textContent = text; }

  function readColors() {
    const css = getComputedStyle(document.documentElement);
    colors = {
      accent: css.getPropertyValue('--accent').trim() || colors.accent,
      visor: css.getPropertyValue('--visor').trim() || colors.visor,
      text: css.getPropertyValue('--text').trim() || colors.text,
      muted: css.getPropertyValue('--muted').trim() || colors.muted
    };
  }

  function updateHud() {
    scoreEl.textContent = state.score;
    levelEl.textContent = state.level;
    livesEl.textContent = state.lives;
    bestEl.textContent = state.best;
  }

  /* ---------- Ukuran kanvas ---------- */
  function resize() {
    const box = canvas.parentElement;
    const cssW = Math.max(box.clientWidth, 240);
    const cssH = Math.round(Math.min(Math.max(cssW * 0.62, 300), 460));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cssW;
    H = cssH;
    canvas.style.height = cssH + 'px';
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    bgStars = Array.from({ length: Math.round((W * H) / 5200) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: rand(0.4, 1.4),
      s: rand(8, 26)
    }));
    state.px = Math.min(Math.max(state.px || W / 2, PLAYER_R), W - PLAYER_R);
    state.target = state.px;
    draw();
  }

  /* ---------- Alur permainan ---------- */
  function reset() {
    state.score = 0;
    state.level = 1;
    state.lives = MAX_LIVES;
    state.items = [];
    state.sparks = [];
    state.spawnIn = 0.6;
    state.flash = 0;
    state.px = W / 2;
    state.target = W / 2;
    updateHud();
  }

  function start() {
    readColors();
    reset();
    state.mode = 'play';
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Jeda';
    startBtn.textContent = 'Mulai ulang';
    canvas.focus({ preventScroll: true });
    say('Permainan dimulai.');
    run();
  }

  function pause() {
    if (state.mode === 'play') {
      state.mode = 'pause';
      pauseBtn.textContent = 'Lanjut';
      say('Permainan dijeda.');
      draw();
    } else if (state.mode === 'pause') {
      state.mode = 'play';
      pauseBtn.textContent = 'Jeda';
      say('Permainan dilanjutkan.');
      run();
    }
  }

  function gameOver() {
    state.mode = 'over';
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Jeda';
    startBtn.textContent = 'Main lagi';
    if (state.score > state.best) {
      state.best = state.score;
      store.set('astro-best', String(state.best));
      say('Permainan selesai. Rekor baru: ' + state.score + ' poin.');
    } else {
      say('Permainan selesai. Skor kamu ' + state.score + ' poin.');
    }
    updateHud();
    draw();
  }

  function run() {
    cancelAnimationFrame(rafId);
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function loop(now) {
    if (state.mode !== 'play') return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    draw();
    if (state.mode === 'play') rafId = requestAnimationFrame(loop);
  }

  /* ---------- Logika ---------- */
  function spawn() {
    const starChance = Math.max(0.45, 0.76 - state.level * 0.04);
    const isStar = Math.random() < starChance;
    const r = isStar ? 12 : rand(16, 27);
    const verts = isStar ? null : Array.from({ length: 9 }, () => rand(0.72, 1));
    state.items.push({
      type: isStar ? 'star' : 'rock',
      x: rand(r + 6, W - r - 6),
      y: -r - 4,
      r,
      vy: 130 + state.level * 22 + rand(0, 55),
      rot: rand(0, Math.PI * 2),
      spin: rand(-2, 2),
      verts
    });
  }

  function burst(x, y, color) {
    for (let i = 0; i < 9; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(60, 170);
      state.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.3, 0.6), color });
    }
  }

  function update(dt) {
    // gerak astronot
    state.target += state.dir * 560 * dt;
    state.target = Math.min(Math.max(state.target, PLAYER_R), W - PLAYER_R);
    state.px += (state.target - state.px) * Math.min(1, dt * 14);

    // munculkan benda
    state.spawnIn -= dt;
    if (state.spawnIn <= 0) {
      spawn();
      state.spawnIn = Math.max(0.34, 0.95 - state.level * 0.06) * rand(0.8, 1.2);
    }

    const py = H - 58;
    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i];
      it.y += it.vy * dt;
      it.rot += it.spin * dt;

      const dx = it.x - state.px;
      const dy = it.y - py;
      const hit = Math.hypot(dx, dy) < PLAYER_R + it.r * 0.82;

      if (hit) {
        state.items.splice(i, 1);
        if (it.type === 'star') {
          state.score += 10;
          burst(it.x, it.y, colors.visor);
          const level = 1 + Math.floor(state.score / 100);
          if (level !== state.level) { state.level = level; say('Level ' + level + '.'); }
        } else {
          state.lives -= 1;
          state.flash = 0.35;
          burst(it.x, it.y, colors.accent);
          if (state.lives <= 0) { updateHud(); gameOver(); return; }
        }
        updateHud();
      } else if (it.y > H + it.r + 6) {
        state.items.splice(i, 1);
      }
    }

    for (let i = state.sparks.length - 1; i >= 0; i--) {
      const s = state.sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
      if (s.life <= 0) state.sparks.splice(i, 1);
    }
    if (state.flash > 0) state.flash -= dt;
  }

  /* ---------- Gambar ---------- */
  function drawStar(x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 === 0 ? r * 1.25 : r * 0.42;
      const a = (Math.PI / 4) * i;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fillStyle = colors.visor;
    ctx.fill();
    ctx.restore();
  }

  function drawRock(it) {
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.rotate(it.rot);
    ctx.beginPath();
    it.verts.forEach((v, i) => {
      const a = (Math.PI * 2 / it.verts.length) * i;
      ctx.lineTo(Math.cos(a) * it.r * v, Math.sin(a) * it.r * v);
    });
    ctx.closePath();
    ctx.fillStyle = '#323B63';
    ctx.fill();
    ctx.strokeStyle = '#5B6A9A';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawPlayer() {
    const x = state.px;
    const y = H - 58;
    // tubuh
    ctx.fillStyle = '#EEF2FA';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x - 15, y + 8, 30, 30, 10) : ctx.rect(x - 15, y + 8, 30, 30);
    ctx.fill();
    // sarung tangan
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(x - 20, y + 20, 6, 0, Math.PI * 2);
    ctx.arc(x + 20, y + 20, 6, 0, Math.PI * 2);
    ctx.fill();
    // helm
    ctx.fillStyle = '#F4F7FC';
    ctx.beginPath();
    ctx.arc(x, y, PLAYER_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#141B34';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x - 15, y - 9, 30, 18, 9) : ctx.rect(x - 15, y - 9, 30, 18);
    ctx.fill();
    ctx.fillStyle = colors.visor;
    ctx.beginPath();
    ctx.arc(x + 6, y - 1, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function overlay(title, sub) {
    ctx.fillStyle = 'rgba(6, 9, 24, 0.72)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.text;
    ctx.font = '700 ' + Math.round(Math.min(W / 14, 30)) + 'px Unbounded, system-ui, sans-serif';
    ctx.fillText(title, W / 2, H / 2 - 8);
    ctx.fillStyle = colors.muted;
    ctx.font = '500 ' + Math.round(Math.min(W / 30, 16)) + 'px "Albert Sans", system-ui, sans-serif';
    ctx.fillText(sub, W / 2, H / 2 + 24);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#FFFFFF';
    bgStars.forEach((s) => {
      ctx.globalAlpha = 0.35 + s.r * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (state.mode === 'play') {
        s.y += s.s * 0.016;
        if (s.y > H) s.y = 0;
      }
    });
    ctx.globalAlpha = 1;

    state.items.forEach((it) => (it.type === 'star' ? drawStar(it.x, it.y, it.r, it.rot) : drawRock(it)));

    state.sparks.forEach((s) => {
      ctx.globalAlpha = Math.max(s.life * 2, 0);
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;

    drawPlayer();

    if (state.flash > 0) {
      ctx.fillStyle = 'rgba(255, 90, 90, ' + Math.min(state.flash, 0.3) + ')';
      ctx.fillRect(0, 0, W, H);
    }

    if (state.mode === 'idle') overlay('Misi orbit', 'Tekan Mulai untuk meluncur');
    else if (state.mode === 'pause') overlay('Dijeda', 'Tekan Lanjut atau P');
    else if (state.mode === 'over') overlay('Misi selesai', 'Skor ' + state.score + ' | tekan Main lagi');
  }

  /* ---------- Kontrol ---------- */
  function setDir(d) { state.dir = d; }

  canvas.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') { setDir(-1); e.preventDefault(); }
    else if (k === 'arrowright' || k === 'd') { setDir(1); e.preventDefault(); }
    else if (k === 'p') { pause(); e.preventDefault(); }
    else if ((k === 'enter' || k === ' ') && (state.mode === 'idle' || state.mode === 'over')) { start(); e.preventDefault(); }
  });
  canvas.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if ((k === 'arrowleft' || k === 'a') && state.dir === -1) setDir(0);
    if ((k === 'arrowright' || k === 'd') && state.dir === 1) setDir(0);
  });
  canvas.addEventListener('blur', () => setDir(0));

  function pointerTo(e) {
    const rect = canvas.getBoundingClientRect();
    state.target = Math.min(Math.max(e.clientX - rect.left, PLAYER_R), W - PLAYER_R);
  }
  canvas.addEventListener('pointerdown', (e) => { canvas.focus({ preventScroll: true }); pointerTo(e); });
  canvas.addEventListener('pointermove', (e) => { if (state.mode === 'play' && (e.pointerType !== 'mouse' || e.buttons === 0 || e.buttons === 1)) pointerTo(e); });

  function holdButton(btn, d) {
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); setDir(d); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, () => { if (state.dir === d) setDir(0); }));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') setDir(d); });
    btn.addEventListener('keyup', () => { if (state.dir === d) setDir(0); });
  }
  holdButton(leftBtn, -1);
  holdButton(rightBtn, 1);

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);

  // Jeda otomatis saat tab disembunyikan atau game keluar dari layar
  document.addEventListener('visibilitychange', () => { if (document.hidden && state.mode === 'play') pause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting && state.mode === 'play') pause();
    }, { threshold: 0.1 }).observe(canvas);
  }

  document.addEventListener('themechange', () => { readColors(); draw(); });
  window.addEventListener('resize', resize);

  readColors();
  updateHud();
  resize();
})();
