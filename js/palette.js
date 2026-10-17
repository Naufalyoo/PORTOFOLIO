/* ==========================================================
   Portofolio Astronot - palette.js
   Pintasan cepat. Buka dengan Ctrl+K (Cmd+K di Mac), tombol
   "/" , atau tombol Cari di navigasi. Bisa lompat ke bagian,
   membuka detail proyek, ganti tema, cetak CV, dan lainnya.
   ========================================================== */
(() => {
  'use strict';

  const dialog = document.getElementById('palette');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const D = window.PORTFOLIO || {};
  const $ = (selector) => document.querySelector(selector);
  const input = $('#paletteInput');
  const listEl = $('#paletteList');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function goTo(id) {
    return () => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    };
  }
  const clickSwatch = (name) => () => { const b = $('.swatch[data-theme="' + name + '"]'); if (b) b.click(); };

  /* ---------- Daftar aksi ---------- */
  const actions = [
    { label: 'Ke bagian Tentang',    hint: 'Navigasi', run: goTo('tentang') },
    { label: 'Ke bagian Proyek',     hint: 'Navigasi', run: goTo('proyek') },
    { label: 'Ke bagian Keahlian',   hint: 'Navigasi', run: goTo('keahlian') },
    { label: 'Ke bagian Perjalanan', hint: 'Navigasi', run: goTo('perjalanan') },
    { label: 'Ke bagian Prestasi dan sertifikat', hint: 'Navigasi', run: goTo('prestasi') },
    { label: 'Ke bagian Kontak',     hint: 'Navigasi', run: goTo('kontak') },
    { label: 'Mainkan Misi orbit',   hint: 'Game', run: () => { goTo('game')(); setTimeout(() => { const b = $('#gameStart'); if (b) b.click(); }, reduceMotion.matches ? 50 : 700); } },
    { label: 'Cetak CV',             hint: 'Aksi', run: () => window.print() },
    { label: 'Salin email',          hint: 'Aksi', run: () => { const b = $('#copyEmail'); if (b) b.click(); } },
    { label: 'Tema oranye',          hint: 'Tema', run: clickSwatch('orange') },
    { label: 'Tema tosca',           hint: 'Tema', run: clickSwatch('mint') },
    { label: 'Tema ungu',            hint: 'Tema', run: clickSwatch('violet') },
    { label: 'Tema merah muda',      hint: 'Tema', run: clickSwatch('rose') }
  ].concat((D.proyek || []).map((p, i) => ({
    label: 'Proyek: ' + p.judul,
    hint: 'Proyek',
    run: () => document.dispatchEvent(new CustomEvent('open-project', { detail: i }))
  })));

  let results = actions;
  let active = 0;

  function render() {
    listEl.innerHTML = '';
    if (!results.length) {
      const none = document.createElement('li');
      none.className = 'palette__none';
      none.textContent = 'Tidak ada hasil.';
      none.setAttribute('role', 'presentation');
      listEl.append(none);
      input.removeAttribute('aria-activedescendant');
      return;
    }
    results.forEach((a, i) => {
      const li = document.createElement('li');
      li.id = 'pal-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      const text = document.createElement('span');
      text.textContent = a.label;
      const hint = document.createElement('span');
      hint.className = 'palette__hint';
      hint.textContent = a.hint;
      li.append(text, hint);
      li.addEventListener('click', () => run(i));
      li.addEventListener('mousemove', () => { if (active !== i) select(i, false); });
      listEl.append(li);
    });
    input.setAttribute('aria-activedescendant', 'pal-' + active);
  }

  function select(i, scroll) {
    const items = listEl.querySelectorAll('[role="option"]');
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach((li, idx) => li.setAttribute('aria-selected', String(idx === active)));
    input.setAttribute('aria-activedescendant', 'pal-' + active);
    if (scroll !== false) items[active].scrollIntoView({ block: 'nearest' });
  }

  function filter() {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    results = actions.filter((a) => {
      const hay = (a.label + ' ' + a.hint).toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    active = 0;
    render();
  }

  function run(i) {
    const action = results[i];
    if (!action) return;
    dialog.close();
    setTimeout(action.run, 60);
  }

  function open() {
    if (dialog.open) return;
    input.value = '';
    results = actions;
    active = 0;
    render();
    dialog.showModal();
    input.focus();
  }

  input.addEventListener('input', filter);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { select(active + 1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { select(active - 1); e.preventDefault(); }
    else if (e.key === 'Enter') { run(active); e.preventDefault(); }
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  const isTyping = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    else if (e.key === '/' && !isTyping(document.activeElement) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); open(); }
  });

  const btn = $('#paletteBtn');
  if (btn) btn.addEventListener('click', () => {
    // tutup menu mobile bila sedang terbuka
    const toggle = $('.nav__toggle');
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
    open();
  });
  const footerBtn = $('#footerPalette');
  if (footerBtn) footerBtn.addEventListener('click', open);
})();
