(() => {
  'use strict';

  const D = window.PORTFOLIO;
  if (!D) { console.warn('js/data.js tidak ditemukan atau belum dimuat.'); return; }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  const list = (value) => (Array.isArray(value) ? value : []);

  /* Pembuat elemen kecil: el('div', { class: 'x', text: 'halo' }, [anak, anak]) */
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

  function hide(selector) {
    const node = $(selector);
    if (node) node.hidden = true;
  }

  /* ---------- Ilustrasi pengganti gambar proyek ---------- */
  const THUMBS = [
    '<svg aria-hidden="true" viewBox="0 0 200 150" class="thumb__art"><circle cx="100" cy="75" r="40" fill="#18213F" stroke="#3A4A7A" stroke-width="1.5"/><ellipse class="t-acc-s" cx="100" cy="75" rx="78" ry="20" transform="rotate(-18 100 75)" fill="none" stroke-width="2"/></svg>',
    '<svg aria-hidden="true" viewBox="0 0 200 150" class="thumb__art"><circle class="t-acc" cx="100" cy="75" r="14"/><circle cx="100" cy="75" r="36" fill="none" stroke="#3A4A7A" stroke-width="1.5" stroke-dasharray="3 6"/><circle cx="100" cy="75" r="60" fill="none" stroke="#2E3B66" stroke-width="1.5" stroke-dasharray="3 6"/><circle class="t-vis" cx="152" cy="46" r="7"/></svg>',
    '<svg aria-hidden="true" viewBox="0 0 200 150" class="thumb__art"><circle cx="70" cy="80" r="32" fill="#18213F" stroke="#3A4A7A" stroke-width="1.5"/><circle class="t-vis" cx="140" cy="56" r="17"/><path d="M 24 124 Q 100 100 176 120" fill="none" stroke="#3A4A7A" stroke-width="1.5" stroke-dasharray="3 6"/></svg>',
    '<svg aria-hidden="true" viewBox="0 0 200 150" class="thumb__art"><rect x="46" y="30" width="108" height="90" rx="14" fill="#18213F" stroke="#3A4A7A" stroke-width="1.5"/><path d="M46 56h108M78 56v64" stroke="#3A4A7A" stroke-width="1.5" fill="none"/><circle class="t-acc" cx="62" cy="43" r="5"/></svg>',
    '<svg aria-hidden="true" viewBox="0 0 200 150" class="thumb__art"><circle cx="100" cy="75" r="46" fill="none" stroke="#2E3B66" stroke-width="1.5"/><circle cx="100" cy="75" r="28" fill="#18213F" stroke="#3A4A7A" stroke-width="1.5"/><circle class="t-acc" cx="146" cy="75" r="8"/><circle class="t-vis" cx="62" cy="48" r="5"/></svg>'
  ];

  /* ---------- Teks yang ditempel langsung dari data ---------- */
  function bind() {
    $$('[data-bind]').forEach((node) => {
      const value = get(D, node.dataset.bind);
      if (value !== undefined && value !== null) node.textContent = value;
    });
    $$('[data-bind-href]').forEach((node) => {
      const value = get(D, node.dataset.bindHref);
      if (value) node.setAttribute('href', (node.dataset.hrefPrefix || '') + value);
    });

    const p = D.profil || {};
    if (p.panggilan) document.title = p.panggilan + ' | Portofolio';
    const desc = $('meta[name="description"]');
    if (desc && p.panggilan) desc.setAttribute('content', 'Portofolio ' + p.panggilan + ', ' + (p.peran || '') + '. Lihat proyek, keahlian, prestasi, dan cara menghubungi saya.');
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle && p.panggilan) ogTitle.setAttribute('content', p.panggilan + ' | Portofolio');

    const form = $('#contactForm');
    if (form) {
      form.dataset.email = p.email || '';
      form.dataset.endpoint = p.formEndpoint || '';
    }
    const copy = $('#copyEmail');
    if (copy) copy.dataset.email = p.email || '';
  }

  /* ---------- Statistik ---------- */
  function renderStats() {
    const box = $('#stats');
    const items = list(D.statistik);
    if (!box) return;
    if (!items.length) { box.parentElement.hidden = true; return; }
    items.forEach((s) => box.append(el('div', {}, [el('b', { text: s.nilai }), el('span', { text: s.label })])));
  }

  /* ---------- Tentang ---------- */
  function renderAbout() {
    const box = $('#aboutText');
    const p = D.profil || {};
    if (box) list(p.tentang).forEach((text) => box.append(el('p', { text })));

    const dl = $('#briefList');
    if (!dl) return;
    [['Nama panggilan', p.panggilan], ['Sekolah', p.sekolah], ['Jurusan', p.jurusan], ['Kelas', p.kelas], ['Kota', p.kota], ['Status', p.status]]
      .filter(([, value]) => value)
      .forEach(([label, value]) => dl.append(el('div', {}, [el('dt', { text: label }), el('dd', { text: value })])));
  }

  /* ---------- Marquee (diambil dari nama keahlian) ---------- */
  function renderMarquee() {
    const track = $('#marqueeTrack');
    if (!track) return;
    let names = [];
    list(D.keahlian).forEach((g) => list(g.item).forEach((s) => names.push(s.nama)));
    names = [...new Set(names)];
    if (!names.length) { track.parentElement.hidden = true; return; }
    while (names.length < 6) names = names.concat(names);

    function group(hidden) {
      return el('ul', { class: 'marquee__group', 'aria-hidden': hidden ? 'true' : null }, names.map((name) =>
        el('li', {}, [name, svg('<svg class="spark" aria-hidden="true"><use href="#spark"/></svg>')])));
    }
    track.append(group(false), group(true));
  }

  /* ---------- Proyek ---------- */
  function projectCard(p, i) {
    const cats = list(p.kategori);
    const thumbKids = p.gambar
      ? [el('img', { class: 'thumb__img', src: p.gambar, alt: 'Tampilan ' + p.judul, loading: 'lazy' })]
      : [svg(THUMBS[i % THUMBS.length]), el('span', { class: 'thumb__label', text: '[Tempat gambar proyek]' })];

    return el('article', {
      class: 'project',
      'data-index': i,
      'data-cat': cats.join('|'),
      'data-year': parseInt(p.tahun, 10) || 0,
      'data-featured': p.unggulan ? '1' : '0',
      'data-search': [p.judul, p.deskripsi, p.peran].concat(list(p.teknologi), cats).join(' ').toLowerCase()
    }, [
      el('div', { class: 'thumb' }, thumbKids),
      el('div', { class: 'project__body' }, [
        el('h3', { text: p.judul }),
        el('p', { text: p.deskripsi }),
        el('ul', { class: 'tags' }, list(p.teknologi).map((t) => el('li', { text: t }))),
        el('button', { class: 'link', type: 'button', 'data-open': i, text: 'Lihat detail' })
      ])
    ]);
  }

  function renderProjects() {
    const grid = $('#projectGrid');
    const items = list(D.proyek);
    if (!grid) return;
    if (!items.length) { $('#proyek').hidden = true; return; }

    items.forEach((p, i) => grid.append(projectCard(p, i)));

    const chips = $('#projectChips');
    const cats = [...new Set(items.flatMap((p) => list(p.kategori)))];
    chips.append(el('button', { class: 'chip', type: 'button', 'data-filter': 'all', 'aria-pressed': 'true', text: 'Semua' }));
    cats.forEach((c) => chips.append(el('button', { class: 'chip', type: 'button', 'data-filter': c, 'aria-pressed': 'false', text: c })));
  }

  /* ---------- Keahlian ---------- */
  function renderSkills() {
    const wrap = $('#skillGroups');
    const groups = list(D.keahlian);
    if (!wrap) return;
    if (!groups.length) { $('#keahlian').hidden = true; return; }

    groups.forEach((g) => {
      wrap.append(el('div', { class: 'skillgroup' }, [
        el('h3', { text: g.kelompok }),
        el('ul', { class: 'bars' }, list(g.item).map((s) => {
          const level = Math.max(0, Math.min(100, Number(s.level) || 0));
          return el('li', { class: 'bar' }, [
            el('div', { class: 'bar__row' }, [el('span', { text: s.nama }), el('span', { class: 'bar__val', text: level + '%' })]),
            el('div', { class: 'bar__track', role: 'img', 'aria-label': s.nama + ', level ' + level + ' dari 100' },
              [el('i', { style: '--v:' + level / 100 })])
          ]);
        }))
      ]));
    });

    const learn = $('#learning');
    const items = list(D.belajar);
    if (!learn) return;
    if (!items.length) { learn.hidden = true; return; }
    $('#learningList').append(...items.map((t) => el('li', { text: t })));
  }

  /* ---------- Perjalanan ---------- */
  function renderTimeline() {
    const ol = $('#timeline');
    const items = list(D.perjalanan);
    if (!ol) return;
    if (!items.length) { $('#perjalanan').hidden = true; return; }

    items.forEach((t) => {
      const kind = String(t.jenis || 'Kegiatan');
      ol.append(el('li', {}, [
        el('time', { text: t.periode }),
        el('div', {}, [
          el('span', { class: 'kind kind--' + kind.toLowerCase().replace(/[^a-z]/g, ''), text: kind }),
          el('h3', { text: t.judul }),
          t.tempat ? el('p', { class: 'org', text: t.tempat }) : null,
          t.deskripsi ? el('p', { text: t.deskripsi }) : null
        ])
      ]));
    });
  }

  /* ---------- Prestasi & sertifikat ---------- */
  function renderAchievements() {
    const ul = $('#achievements');
    const items = list(D.prestasi);
    if (ul) {
      if (!items.length) hide('#achievementsBlock');
      items.forEach((a) => ul.append(el('li', { class: 'ach' }, [
        el('span', { class: 'ach__year', text: a.tahun }),
        el('div', {}, [
          el('h3', { text: a.judul }),
          el('p', { class: 'ach__meta' }, [a.penyelenggara, a.tingkat ? el('span', { class: 'ach__level', text: a.tingkat }) : null]),
          a.deskripsi ? el('p', { text: a.deskripsi }) : null
        ])
      ])));
    }

    const grid = $('#certs');
    const certs = list(D.sertifikat);
    if (grid) {
      if (!certs.length) hide('#certsBlock');
      certs.forEach((c) => grid.append(el('article', { class: 'cert' }, [
        svg('<svg class="cert__icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="20" r="12"/><path d="M17 30 14 44l10-5 10 5-3-14"/></svg>'),
        el('h3', { text: c.nama }),
        el('p', { class: 'cert__by', text: c.penerbit }),
        el('p', { class: 'cert__year', text: c.tahun }),
        c.url ? el('a', { class: 'link', href: c.url, target: '_blank', rel: 'noopener', text: 'Lihat sertifikat' }) : null
      ])));
    }

    if (!items.length && !certs.length) $('#prestasi').hidden = true;
  }

/* ---------- FAQ ---------- */
  function renderFaq() {
    const box = $('#faqList');
    const items = list(D.faq);
    if (!box) return;
    if (!items.length) { $('#faq').hidden = true; return; }
    items.forEach((f) => box.append(el('details', {}, [el('summary', { text: f.tanya }), el('p', { text: f.jawab })])));
  }

  /* ---------- Tautan sosial ---------- */
  function renderSocials() {
    const links = list((D.profil || {}).sosial);
    $$('[data-socials="list"]').forEach((ul) => links.forEach((s) =>
      ul.append(el('li', {}, [el('a', { href: s.url, target: '_blank', rel: 'noopener', text: s.nama })]))));
    $$('[data-socials="links"]').forEach((nav) => links.forEach((s) =>
      nav.append(el('a', { href: s.url, target: '_blank', rel: 'noopener', text: s.nama }))));
  }

  bind();
  renderStats();
  renderAbout();
  renderMarquee();
  renderProjects();
  renderSkills();
  renderTimeline();
  renderAchievements();
  renderFaq();
  renderSocials();
})();
