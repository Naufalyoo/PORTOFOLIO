/* Blog / Catatan — carousel horizontal */
(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  function el(tag, props, kids) {
    const node = document.createElement(tag);
    Object.entries(props || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    (Array.isArray(kids) ? kids : [kids]).forEach((child) => {
      if (child === null || child === undefined) return;
      node.append(child.nodeType ? child : document.createTextNode(child));
    });
    return node;
  }

  function svg(markup) {
    const t = document.createElement('template');
    t.innerHTML = markup.trim();
    return t.content.firstChild;
  }

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function article(data) {
    const tags = (data.tag || []).map((t) => el('li', { text: t }));
    const actions = data.tautan ? [
      el('a', { class: 'link', href: data.tautan, target: '_blank', rel: 'noopener', text: 'Baca' }),
      svg('<svg class="blog__ext" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-link"/></svg>')
    ] : [];
    return el('article', { class: 'blog-card' }, [
      el('div', { class: 'blog-card__meta' }, [
        el('time', { text: formatDate(data.tanggal) }),
        data.menit ? el('span', { class: 'blog-card__read' }, [
          svg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'),
          el('span', { text: data.menit + ' menit' })
        ]) : null
      ]),
      el('h3', { text: data.judul }),
      el('p', { class: 'blog-card__summary', text: data.ringkasan }),
      tags.length ? el('ul', { class: 'tags blog-card__tags' }, tags) : null,
      ...(actions.length ? [el('div', { class: 'blog-card__actions' }, actions)] : [])
    ]);
  }

  function render() {
    const track = $('#blogTrack');
    const empty = $('#blogEmpty');
    const prev = $('#blogPrev');
    const next = $('#blogNext');
    if (!track) return;

    const items = (D.blog || []).filter(Boolean);
    if (!items.length) {
      if (empty) empty.hidden = false;
      $('#blog').hidden = true;
      return;
    }

    items.forEach((b) => track.append(article(b)));

    const scroll = (dir) => track.scrollBy({ left: dir * Math.max(track.clientWidth * 0.8, 320), behavior: 'smooth' });
    if (prev) prev.addEventListener('click', () => scroll(-1));
    if (next) next.addEventListener('click', () => scroll(1));
  }

  if ($('#blog')) render();
})();