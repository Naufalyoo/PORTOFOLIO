/* Visitor counter — menghitung kunjungan portofolio
   Layanan:
   - 'counterapi' : https://counterapi.dev (gratis, tanpa daftar)
   - 'local'      : hanya localStorage (pengunjung perangkat ini saja)   */
(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const $ = (selector) => document.querySelector(selector);
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* */ } }
  };

  function addStyles() {
    if (document.getElementById('visitor-styles')) return;
    const s = document.createElement('style');
    s.id = 'visitor-styles';
    s.textContent = [
      '#pengunjung { padding-top: 40px; }',
      '.visitor-strip { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px 24px; padding: 20px 28px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }',
      '.visitor-strip__item { display: inline-flex; align-items: center; gap: 10px; }',
      '.visitor-strip__icon { width: 22px; height: 22px; flex: none; stroke: var(--visor); fill: none; stroke-width: 2; }',
      '.visitor-strip__label { color: var(--muted); }',
      '.visitor-strip__value { font-family: var(--display); font-weight: 700; font-size: 24px; color: var(--accent); font-variant-numeric: tabular-nums; }',
      '.visitor-strip__note { color: #8793AF; font-size: 14px; }'
    ].join('');
    document.head.appendChild(s);
  }

  function formatCount(n) {
    n = Number(n) || 0;
    return n.toLocaleString('id-ID');
  }

  function localCounter(key) {
    const k = 'pf-visits-' + key;
    let count = parseInt(store.get(k) || '0', 10);
    // hitung 1x per sesi browser (sessionStorage hilang saat tab ditutup)
    let session;
    try { session = sessionStorage.getItem(k); } catch (e) { session = '1'; }
    if (!session) {
      count++;
      store.set(k, String(count));
      try { sessionStorage.setItem(k, '1'); } catch (e) { /* */ }
    }
    return count;
  }

  async function counterapi(namespace, key) {
    const url = 'https://api.counterapi.dev/v1/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key) + '/up';
    const res = await fetch(url);
    if (!res.ok) throw new Error('counterapi-fail');
    const data = await res.json();
    if (typeof data.count !== 'number') throw new Error('counterapi-bad');
    return data.count;
  }

  function showCount(n, fallbackText) {
    const el = $('#visitorCount');
    if (el) {
      el.textContent = formatCount(n);
      el.removeAttribute('aria-hidden');
    }
    const note = $('#visitorNote');
    if (note && fallbackText) note.textContent = fallbackText;
  }

  async function render() {
    const strip = $('#visitorStrip');
    const section = $('#pengunjung');
    if (!strip || !section) return;

    const cfg = ((D.profil || {}).pengunjung || {});
    if (cfg.layanan === 'off' || !cfg.kunci || cfg.kunci.includes('[')) {
      section.hidden = true;
      return;
    }

    addStyles();
    showCount(localCounter(cfg.kunci)); // tampilan awal instan

    if (cfg.layanan === 'counterapi') {
      try {
        const n = await counterapi(cfg.kunci, 'visits');
        showCount(n);
        store.set('pf-visits-' + cfg.kunci, String(n));
      } catch {
        const note = $('#visitorNote');
        if (note) note.textContent = 'Mode offline: pengunjung perangkat ini saja';
      }
    }
  }

  render();
})();