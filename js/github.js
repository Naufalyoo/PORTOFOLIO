/* GitHub activity — stats card dan grafik kontribusi SVG */
(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const $ = (selector) => document.querySelector(selector);

  function addStyles() {
    if (document.getElementById('gh-styles')) return;
    const s = document.createElement('style');
    s.id = 'gh-styles';
    s.textContent = [
      '.github-stat { display: flex; flex-direction: column; gap: 4px; min-width: 150px; padding: 24px 28px; border: 1px solid var(--line); border-radius: 20px; background: var(--panel); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); transition: border-color .2s; }',
      '.github-stat:hover { border-color: var(--visor); }',
      '.github-stat__value { font-family: var(--display); font-weight: 700; font-size: 30px; color: var(--visor); }',
      '.github-stat__label { color: var(--muted); font-size: 14px; }',
      '.github-stat a { color: var(--accent); font-weight: 700; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1.5px; }',
      '.github__graph { padding: 24px; border: 1px solid var(--line); border-radius: 20px; background: var(--panel); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); overflow-x: auto; }',
      '.github__graph h3 { font-size: 16px; font-weight: 500; margin-bottom: 16px; color: var(--muted); }',
      '.github__graph img { display: block; max-width: 100%; height: auto; border-radius: 8px; }',
      '.github__note { color: var(--muted); font-size: 14px; }',
      '.github__note a { color: var(--accent); }'
    ].join('');
    document.head.appendChild(s);
  }

  function buildGraph(container) {
    container.innerHTML = '';
    const h3 = document.createElement('h3');
    h3.textContent = 'Grafik kontribusi 1 tahun';
    container.appendChild(h3);
    const canvas = document.createElement('canvas');
    canvas.id = 'gh-canvas';
    canvas.style.cssText = 'width:100%;height:auto;border-radius:8px';
    container.appendChild(canvas);
    drawGraph(canvas);
  }

  function drawGraph(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // jsdom atau konteks tidak tersedia
    canvas.width = 800;
    canvas.height = 130;
    const W = canvas.width, H = canvas.height;
    const cols = 53, rows = 7, cell = 11, gap = 3;
    const offsetX = Math.round((W - cols * (cell + gap)) / 2);
    const offsetY = Math.round((H - rows * (cell + gap)) / 2);
    const total = cols * rows;
    const now = new Date();
    const startDay = new Date(now);
    startDay.setDate(startDay.getDate() - (total - 1) + now.getDay());

    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue('--accent').trim() || '#FF8A3D';

    function hexToRgb(hex) {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : [255,138,61];
    }
    const [ar, ag, ab] = hexToRgb(accent);

    for (let i = 0; i < total; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      if (date > now) continue;
      const x = offsetX + Math.floor(i / rows) * (cell + gap);
      const y = offsetY + (i % rows) * (cell + gap);
      const key = date.toISOString().split('T')[0];
      let lvl = 0;
      try { lvl = parseInt(localStorage.getItem('gh-' + key) || '0', 10); } catch (e) { /* */ }
      lvl = Math.min(Math.max(lvl, 0), 4);
      const alpha = lvl === 0 ? 0.15 : [0.28, 0.5, 0.75, 1][lvl - 1];
      ctx.fillStyle = 'rgba(' + ar + ',' + ag + ',' + ab + ',' + alpha + ')';
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, cell, cell, 2); ctx.fill(); }
      else { ctx.fillRect(x, y, cell, cell); }
    }
  }

  function fetchContribs(username) {
    const url = 'https://github-contributions-api.jogruber.de/v4/' + username;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!data.contributions) return;
        data.contributions.forEach((c) => {
          try { localStorage.setItem('gh-' + c.date, String(c.level || 0)); } catch (e) { /* */ }
        });
        const canvas = document.getElementById('gh-canvas');
        if (canvas) drawGraph(canvas);
      })
      .catch(() => {});
  }

  async function render() {
    const section = $('#github');
    const cards = $('#githubCards');
    const graph = $('#githubGraph');
    const note = $('#githubNote');
    if (!section || !cards) return;

    const cfg = (D.profil || {}).github || {};
    const username = cfg.username;
    if (!username || username.includes('[')) { section.hidden = true; return; }

    section.hidden = false;
    addStyles();

    try {
      const res = await fetch('https://api.github.com/users/' + username, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
      if (res.ok) {
        const stats = await res.json();
        [
          { label: 'Repositori', value: stats.public_repos, href: 'https://github.com/' + username + '?tab=repositories' },
          { label: 'Pengikut', value: stats.followers, href: 'https://github.com/' + stats.login + '?tab=followers' },
          { label: 'Mengikuti', value: stats.following, href: 'https://github.com/' + stats.login + '?tab=following' }
        ].forEach((s) => {
          const div = document.createElement('div');
          div.className = 'github-stat';
          const val = document.createElement('div');
          val.className = 'github-stat__value';
          if (s.href) { val.innerHTML = '<a href="' + s.href + '" target="_blank" rel="noopener">' + s.value + '</a>'; }
          else { val.textContent = s.value; }
          const lbl = document.createElement('div');
          lbl.className = 'github-stat__label';
          lbl.textContent = s.label;
          div.appendChild(val);
          div.appendChild(lbl);
          cards.appendChild(div);
        });
      }
    } catch (e) { /* offline */ }

    if (cfg.grafik && graph) {
      buildGraph(graph);
      fetchContribs(username);
    }

    if (note) note.innerHTML = 'Profil di <a href="https://github.com/' + username + '" target="_blank" rel="noopener">github.com/' + username + '</a>';
  }

  if ($('#github')) render();
})();