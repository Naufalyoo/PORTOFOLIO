/* ==========================================================
   Portofolio Astronot - ui.js
   Interaksi tambahan (dimuat setelah main.js):
   1. Pemilih warna tema (tersimpan di browser)
   2. Progres scroll dan tombol kembali ke atas
   3. Filter proyek dan dialog detail
   4. Slider testimoni
   5. Formulir kontak (validasi, kirim lewat endpoint atau email)
   6. Salin email dan astronot yang bisa diklik
   Semua fungsi aman dijalankan di halaman yang tidak memiliki
   elemen terkait (studi-kasus.html, 404.html).
   ========================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ }
    }
  };

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

  /* ---------- 3. Filter proyek & dialog detail ---------- */
  function projects() {
    const grid = $('#projectGrid');
    if (!grid) return;

    const cards = $$('.project', grid);
    const chips = $$('.chip');
    const count = $('#projectCount');

    function filter(category) {
      let shown = 0;
      cards.forEach((card) => {
        const match = category === 'all' || card.dataset.cat.split(' ').includes(category);
        card.hidden = !match;
        card.classList.remove('project--lead');
        if (match) {
          if (shown === 0) card.classList.add('project--lead'); // proyek pertama tampil besar
          shown++;
        }
      });
      chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === category)));
      if (count) count.textContent = 'Menampilkan ' + shown + ' proyek';
    }
    chips.forEach((chip) => chip.addEventListener('click', () => filter(chip.dataset.filter)));

    const dialog = $('#projectDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    grid.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open]');
      if (!trigger) return;
      const card = trigger.closest('.project');

      $('#dlgTitle').textContent = $('h3', card).textContent;
      $('#dlgDesc').textContent = $('p', card).textContent;
      $('#dlgTags').innerHTML = $('.tags', card).innerHTML;

      const slot = $('#dlgThumb');
      slot.innerHTML = '';
      const art = $('.thumb__art', card);
      if (art) slot.appendChild(art.cloneNode(true));

      dialog.showModal();
      document.documentElement.classList.add('modal-open');
    });

    dialog.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- 4. Slider testimoni ---------- */
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

  /* ---------- 5. Formulir kontak ---------- */
  function contactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#formStatus');

    const rules = {
      nama:  (v) => v.trim().length >= 2 || 'Tulis nama kamu, minimal 2 huruf.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Masukkan alamat email yang valid, misalnya nama@domain.com.',
      pesan: (v) => v.trim().length >= 10 || 'Ceritakan proyekmu dalam minimal 10 karakter.'
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
        jenis: form.elements.jenis.value,
        pesan: form.elements.pesan.value.trim()
      };

      // Opsi A: kirim ke layanan formulir (mis. Formspree) jika data-endpoint diisi
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
        say('Email tujuan belum diisi. Ganti [EMAIL KAMU] pada atribut data-email di index.html.', true);
        return;
      }
      const subject = 'Proyek ' + data.jenis + ' dari ' + data.nama;
      const body = data.pesan + '\n\n' + data.nama + '\n' + data.email;
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Aplikasi email kamu akan terbuka dengan pesan yang sudah terisi.');
    });
  }

  /* ---------- 6. Salin email & astronot yang bisa diklik ---------- */
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
  }

  theme();
  scrollUi();
  projects();
  slider();
  contactForm();
  extras();
})();
