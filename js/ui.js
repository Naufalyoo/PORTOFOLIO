/* ==========================================================
   Portofolio Astronot - ui.js
   Interaksi halaman (dimuat setelah render.js dan main.js):
   1. Pemilih warna tema (tersimpan di browser)
   2. Progres scroll dan tombol kembali ke atas
   3. Teks yang diketik bergantian di hero
   4. Proyek: pencarian, filter, urutan, dialog detail
   5. Animasi bar keahlian saat terlihat
   6. Slider testimoni
   7. Formulir kontak
   8. Salin email, astronot yang bisa diklik, cetak CV
   ========================================================== */
(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ } }
  };

  // Jalankan fungsi setelah layar loading selesai (atau langsung jika tidak ada loader)
  function afterLaunch(fn) {
    if ($('#loader')) document.addEventListener('launched', fn, { once: true });
    else fn();
  }

  /* ---------- 1. Tema warna ---------- */
  function theme() {
    const root = document.documentElement;
    const buttons = $$('.swatch');
    if (!buttons.length) return;

    function apply(name, save) {
      if (name === 'orange') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', name);
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === name)));
      if (save) store.set('astro-theme', name);
      document.dispatchEvent(new Event('themechange'));
    }

    const saved = store.get('astro-theme') || 'orange';
    apply(buttons.some((b) => b.dataset.theme === saved) ? saved : 'orange', false);
    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.theme, true)));
  }

  /* ---------- 2. Progres scroll & kembali ke atas ---------- */
  function scrollUi() {
    const bar = $('#progress span');
    const top = $('#toTop');

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar) bar.style.transform = 'scaleX(' + ratio + ')';
      if (top) top.hidden = window.scrollY < 700;
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    if (top) {
      top.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      });
    }
  }

  /* ---------- 3. Teks diketik ---------- */
  function typed() {
    const out = $('#typed');
    const words = ((D.profil || {}).kataKata || []).filter(Boolean);
    if (!out || !words.length) return;
    if (reduceMotion.matches) { out.textContent = words[0]; return; }

    let w = 0;
    let c = 0;
    let deleting = false;
    function step() {
      const word = words[w];
      if (!deleting) {
        c++;
        out.textContent = word.slice(0, c);
        if (c === word.length) { deleting = true; setTimeout(step, 1700); return; }
        setTimeout(step, 70);
      } else {
        c--;
        out.textContent = word.slice(0, c);
        if (c === 0) { deleting = false; w = (w + 1) % words.length; setTimeout(step, 350); return; }
        setTimeout(step, 35);
      }
    }
    afterLaunch(() => setTimeout(step, 700));
  }

  /* ---------- 4. Proyek ---------- */
  function projects() {
    const grid = $('#projectGrid');
    if (!grid) return;

    const cards = $$('.project', grid);
    const chipsBox = $('#projectChips');
    const search = $('#projectSearch');
    const sort = $('#projectSort');
    const count = $('#projectCount');
    const empty = $('#projectEmpty');
    let category = 'all';

    function apply() {
      const q = (search.value || '').trim().toLowerCase();
      const mode = sort.value;
      const title = (card) => $('h3', card).textContent;

      const ordered = [...cards].sort((a, b) => {
        const byIndex = Number(a.dataset.index) - Number(b.dataset.index);
        if (mode === 'az') return title(a).localeCompare(title(b), 'id');
        if (mode === 'new') return (Number(b.dataset.year) - Number(a.dataset.year)) || byIndex;
        return (Number(b.dataset.featured) - Number(a.dataset.featured)) || byIndex;
      });

      let shown = 0;
      ordered.forEach((card) => {
        grid.append(card);
        const catOk = category === 'all' || card.dataset.cat.split('|').includes(category);
        const textOk = !q || card.dataset.search.includes(q);
        const show = catOk && textOk;
        card.hidden = !show;
        card.classList.remove('project--lead');
        if (show) {
          if (shown === 0) card.classList.add('project--lead'); // proyek pertama tampil besar
          shown++;
        }
      });
      count.textContent = 'Menampilkan ' + shown + ' dari ' + cards.length + ' proyek';
      empty.hidden = shown > 0;
    }

    chipsBox.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      category = chip.dataset.filter;
      $$('.chip', chipsBox).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      apply();
    });
    search.addEventListener('input', apply);
    sort.addEventListener('change', apply);
    apply();

    /* Dialog detail */
    const dialog = $('#projectDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const items = D.proyek || [];

    function setLink(node, url) {
      node.hidden = !url;
      if (url) node.setAttribute('href', url);
    }

    function openProject(index) {
      const p = items[index];
      if (!p) return;
      $('#dlgTitle').textContent = p.judul;
      $('#dlgDesc').textContent = p.deskripsi;
      $('#dlgMeta').textContent = [p.peran, p.tahun].filter(Boolean).join('  |  ');
      const tags = $('#dlgTags');
      tags.innerHTML = '';
      (p.teknologi || []).forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        tags.append(li);
      });
      setLink($('#dlgDemo'), p.demo);
      setLink($('#dlgRepo'), p.repo);

      const slot = $('#dlgThumb');
      slot.innerHTML = '';
      const source = $('.project[data-index="' + index + '"] .thumb', grid);
      if (source) Array.from(source.children).forEach((child) => {
        if (!child.classList.contains('thumb__label')) slot.append(child.cloneNode(true));
      });

      if (!dialog.open) dialog.showModal();
      document.documentElement.classList.add('modal-open');
    }

    grid.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open]');
      if (trigger) openProject(Number(trigger.dataset.open));
    });
    document.addEventListener('open-project', (e) => openProject(e.detail));
    dialog.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- 5. Bar keahlian ---------- */
  function skillBars() {
    const bars = $$('.bar__track');
    if (!bars.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      bars.forEach((b) => b.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => io.observe(b));
  }

  /* ---------- 6. Slider testimoni ---------- */
  function slider() {
    const track = $('#quotes');
    if (!track) return;
    const go = (dir) => track.scrollBy({
      left: dir * Math.max(track.clientWidth * 0.8, 280),
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
    const prev = $('#quotePrev');
    const next = $('#quoteNext');
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
  }

  /* ---------- 7. Formulir kontak ---------- */
  function contactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#formStatus');

    const rules = {
      nama:  (v) => v.trim().length >= 2 || 'Tulis nama kamu, minimal 2 huruf.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Masukkan alamat email yang valid, misalnya nama@domain.com.',
      pesan: (v) => v.trim().length >= 10 || 'Tulis pesanmu dalam minimal 10 karakter.'
    };

    function check(name) {
      const input = form.elements[name];
      const error = $('#e-' + name);
      const result = rules[name](input.value);
      const ok = result === true;
      input.setAttribute('aria-invalid', String(!ok));
      error.hidden = ok;
      error.textContent = ok ? '' : result;
      return ok;
    }

    function say(text, isError) {
      status.textContent = text;
      status.classList.toggle('is-error', Boolean(isError));
    }

    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('blur', () => check(name));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') check(name);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      say('');
      if (form.elements.website.value) return; // kolom jebakan untuk bot

      const valid = Object.keys(rules).map(check);
      if (valid.includes(false)) {
        const firstBad = Object.keys(rules).find((n) => form.elements[n].getAttribute('aria-invalid') === 'true');
        form.elements[firstBad].focus();
        say('Periksa kembali isian yang ditandai.', true);
        return;
      }

      const data = {
        nama: form.elements.nama.value.trim(),
        email: form.elements.email.value.trim(),
        keperluan: form.elements.jenis.value,
        pesan: form.elements.pesan.value.trim()
      };

      // Opsi A: kirim ke layanan formulir jika profil.formEndpoint diisi di data.js
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        say('Mengirim pesan...');
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error('gagal');
          form.reset();
          say('Pesan terkirim. Terima kasih, saya akan membalas secepatnya.');
        } catch (err) {
          say('Pesan belum terkirim. Coba lagi, atau kirim langsung lewat email.', true);
        }
        return;
      }

      // Opsi B: buka aplikasi email dengan pesan yang sudah terisi
      const to = form.dataset.email;
      if (!to || to.includes('[')) {
        say('Email tujuan belum diisi. Ganti profil.email di js/data.js.', true);
        return;
      }
      const subject = data.keperluan + ' dari ' + data.nama;
      const body = data.pesan + '\n\n' + data.nama + '\n' + data.email;
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Aplikasi email kamu akan terbuka dengan pesan yang sudah terisi.');
    });
  }

  /* ---------- 8. Salin email, astronot, cetak ---------- */
  function extras() {
    const copy = $('#copyEmail');
    const note = $('#copyNote');
    if (copy && note) {
      copy.addEventListener('click', async () => {
        const email = copy.dataset.email;
        try {
          await navigator.clipboard.writeText(email);
          note.textContent = 'Email disalin.';
        } catch (err) {
          note.textContent = 'Salin manual: ' + email;
        }
        setTimeout(() => { note.textContent = ''; }, 2600);
      });
    }

    const astro = $('#astroBtn');
    if (astro) {
      astro.addEventListener('click', () => {
        document.dispatchEvent(new Event('spawn-streaks'));
        astro.classList.remove('wave');
        void astro.offsetWidth; // mulai ulang animasi
        astro.classList.add('wave');
      });
    }

    $$('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));
  }

  theme();
  scrollUi();
  typed();
  projects();
  skillBars();
  slider();
  contactForm();
  extras();
})();
