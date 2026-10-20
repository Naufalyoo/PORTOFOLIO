/* Mode terang/gelap — disimpan di localStorage, berpadu dengan tema warna aksen */
(() => {
  'use strict';

  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* */ } }
  };

  function applyMode(mode) {
    root.setAttribute('data-mode', mode);
    if (btn) {
      btn.setAttribute('aria-pressed', String(mode === 'light'));
      btn.setAttribute('aria-label', mode === 'light' ? 'Ganti ke mode gelap' : 'Ganti ke mode terang');
    }
    // warna latar untuk bar browser (meta theme-color)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'light' ? '#FFFFFF' : '#080C1E');
    document.dispatchEvent(new Event('themechange'));
  }

  const saved = store.get('astro-mode');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyMode(saved === 'light' || saved === 'dark' ? saved : (prefersLight ? 'light' : 'dark'));

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
      store.set('astro-mode', next);
      applyMode(next);
    });
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (store.get('astro-mode')) return; // sudah punya pilihan manual
    applyMode(e.matches ? 'light' : 'dark');
  });
})();