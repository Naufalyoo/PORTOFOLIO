window.PORTFOLIO = {

  /* ---------- Profil ---------- */
  profil: {
    nama: 'Muhammad Naufal Athaillah Ghani',
    panggilan: 'Naufal',
    peran: '[PERAN KAMU, mis. Siswa RPL / Web Developer Pemula]',
    lencana: 'sedang magang',
    tagline: 'Siswa TKJ di SMKN 1 Tuban yang suka membangun situs, aplikasi, dan hal-hal kreatif dari nol sampai jadi.',

    // Kata-kata yang diketik bergantian di halaman utama ("Saya seorang ...")
    kataKata: ['SISWA TKJ', 'ROBOTICS ENGINEER', 'NETWORK ENGINEER', 'WEB DEVELOPER'],

    sekolah: 'SMKN 1 TUBAN',
    jurusan: 'Teknik Komputer dan Jaringan',
    kelas: '12 TKJ 2',
    kota: 'TUBAN, JAWA TIMUR',
    status: 'Siswa SMK',

    email: 'naufalghani190@gmail.com',
    cv: '#',                       // tautan file CV (PDF). Tombol "Cetak CV" tetap bisa dipakai.
    formEndpoint: 'https://formspree.io/f/moejrgvn',              // opsional: alamat Formspree dsb. Kosong = formulir membuka aplikasi email.

    // Ikon yang tersedia: 'github', 'tiktok', 'instagram', 'whatsapp', 'linkedin', 'mail', 'link'
    sosial: [
      { nama: 'GitHub',    ikon: 'github',    url: 'https://github.com/Naufalyoo' },
      { nama: 'WhatsApp',  ikon: 'whatsapp',  url: 'https://wa.me/6281234567890?text=Halo%20Naufal%2C%20saya%20lihat%20portofolio%20kamu' },
      { nama: 'TikTok',    ikon: 'tiktok',    url: 'https://tiktok.com/@naufal_yoo' },
      { nama: 'Instagram', ikon: 'instagram', url: 'https://www.instagram.com/naufalorailing' }
    ],

    // Urutan ikon media sosial: diisi lewat data di atas
    ikonSosial: {},

    // Spotify: tempel ID playlist kamu. Kosong = kartu Spotify disembunyikan.
    spotify: {
      playlistId: '6cAPGGOm2HRi5pgq5h5gRW',
      judul: 'Daily Rotation',
      subjudul: 'My Spotify Playlist...',
      lencana: 'SPOTIFY / MY FAVORITE'
    },

    // GitHub: isi username untuk mengaktifkan bagian "Aktivitas di GitHub".
    // Grafik kontribusi memakai layanan publik ghchart.rushland.dev
    github: {
      username: 'Naufalyoo',
      grafik: true
    },

    // Penghitung pengunjung: 'counterapi' (gratis, tanpa daftar), 'countapi-style', atau 'local' (localStorage saja)
    pengunjung: {
      layanan: 'counterapi',
      kunci: 'naufal-portofolio'
    },

    tentang: [
      'Saya Muhammad Naufal Athaillah Ghani, siswa kelas 12 Teknik Komputer dan Jaringan (TKJ) di SMKN 1 Tuban. Saya memiliki ketertarikan mendalam di bidang konfigurasi jaringan komputer, perancangan sistem robotik mikrokontroler, dan pengembangan web.',
      'Saya terbiasa belajar secara hands-on melalui praktikum—mulai dari merakit hardware PC, konfigurasi Cisco, hingga memprogram Arduino. Saat ini saya fokus memperdalam skill teknis dan terbuka untuk kesempatan magang, kolaborasi proyek, maupun peluang kerja di dunia IT.'
    ]
  },

  /* ---------- Angka ringkas di bawah halaman utama ---------- */
  statistik: [
    { nilai: '[X]+', label: 'Proyek selesai' },
    { nilai: '[X]',  label: 'Sertifikat dan kursus' },
    { nilai: '[X]',  label: 'Lomba atau kegiatan diikuti' }
  ],

  /* ---------- Proyek ----------
     kategori : pilih bebas, misalnya 'Situs web', 'Aplikasi', 'Desain', 'Game'.
                Tombol filter dibuat otomatis dari kategori yang kamu pakai.
     unggulan : true = tampil paling besar di urutan "Unggulan dulu".
     gambar   : (opsional) alamat gambar, mis. 'assets/proyek-1.jpg'.
     demo/repo: tautan demo dan kode (GitHub). Kosongkan jika tidak ada.            */
  proyek: [
    {
      judul: '[Nama proyek unggulan]',
      deskripsi: '[Dua atau tiga kalimat tentang masalah yang diselesaikan, peranmu, dan hasilnya. Pilih proyek yang paling mewakili kemampuanmu.]',
      kategori: ['Situs web'],
      teknologi: ['[Teknologi 1]', '[Teknologi 2]'],
      tahun: '[Tahun]',
      peran: '[Peranmu, mis. Programmer utama]',
      demo: '#',
      repo: '#',
      gambar: '',
      unggulan: true
    },
    {
      judul: '[Nama proyek]',
      deskripsi: '[Satu atau dua kalimat tentang masalah, peranmu, dan hasilnya.]',
      kategori: ['Aplikasi'],
      teknologi: ['[Teknologi 1]', '[Teknologi 2]'],
      tahun: '[Tahun]',
      peran: '[Peranmu]',
      demo: '#',
      repo: '#',
      gambar: '',
      unggulan: false
    },
    {
      judul: '[Nama proyek]',
      deskripsi: '[Satu atau dua kalimat tentang masalah, peranmu, dan hasilnya.]',
      kategori: ['Situs web'],
      teknologi: ['[Teknologi 1]', '[Teknologi 2]'],
      tahun: '[Tahun]',
      peran: '[Peranmu]',
      demo: '#',
      repo: '#',
      gambar: '',
      unggulan: false
    },
    {
      judul: '[Nama proyek]',
      deskripsi: '[Satu atau dua kalimat tentang masalah, peranmu, dan hasilnya.]',
      kategori: ['Desain'],
      teknologi: ['[Alat desain]'],
      tahun: '[Tahun]',
      peran: '[Peranmu]',
      demo: '#',
      repo: '',
      gambar: '',
      unggulan: false
    },
    {
      judul: '[Nama proyek]',
      deskripsi: '[Satu atau dua kalimat tentang masalah, peranmu, dan hasilnya.]',
      kategori: ['Aplikasi', 'Desain'],
      teknologi: ['[Teknologi 1]', '[Alat desain]'],
      tahun: '[Tahun]',
      peran: '[Peranmu]',
      demo: '#',
      repo: '#',
      gambar: '',
      unggulan: false
    }
  ],

  /* ---------- Keahlian ----------
     level: angka 0 sampai 100 (perkiraan jujur kemampuanmu saat ini).
     Angka di bawah hanya contoh, ganti dengan yang sebenarnya.            */
  keahlian: [
    {
      kelompok: 'Pemrograman dan web',
      item: [
        { nama: 'Arduino', level: 85 },
        { nama: 'HTML & CSS', level: 70 },
        { nama: '[Keahlian 3]', level: 60 }
      ]
    },
    {
      kelompok: 'Jaringan dan Hardware',
      item: [
        { nama: 'Konfigurasi Jaringan dan Subnetting', level: 85 },
        { nama: 'Perakitan dan Perawatan Komputer', level: 85 },
        { nama: '[Keahlian 3]', level: 45 }
      ]
    },
    {
      kelompok: 'Alat dan Perangkat lunak',
      item: [
        { nama: 'Cisco Packet Tracer', level: 85 },
        { nama: 'VS Code & Tinkercad', level: 85 },
        { nama: '[Alat 3]', level: 50 }
      ]
    }
  ],

  // Hal yang sedang kamu pelajari sekarang
  belajar: ['[Sedang dipelajari 1]', '[Sedang dipelajari 2]', '[Sedang dipelajari 3]'],

  /* ---------- Perjalanan ----------
     jenis: 'Pendidikan', 'PKL', 'Organisasi', atau 'Kegiatan' (bebas).     */
  perjalanan: [
    {
      periode: '[Tahun — Sekarang]',
      jenis: 'Pendidikan',
      judul: 'SMK [NAMA SEKOLAH]',
      tempat: 'Jurusan [JURUSAN]',
      deskripsi: '[Mata pelajaran produktif yang kamu pelajari, proyek sekolah, atau peringkat yang ingin kamu sebut.]'
    },
    {
      periode: '[Bulan Tahun — Bulan Tahun]',
      jenis: 'PKL',
      judul: 'Praktik Kerja Lapangan',
      tempat: '[NAMA INSTANSI atau PERUSAHAAN]',
      deskripsi: '[Apa yang kamu kerjakan selama PKL, alat yang dipakai, dan hasil yang kamu bawa pulang.]'
    },
    {
      periode: '[Tahun — Tahun]',
      jenis: 'Organisasi',
      judul: '[Jabatan, mis. Anggota OSIS / Ekskul]',
      tempat: '[NAMA ORGANISASI]',
      deskripsi: '[Tanggung jawabmu dan hal yang kamu pelajari dari organisasi ini.]'
    }
  ],

  /* ---------- Prestasi dan lomba ---------- */
  prestasi: [
    {
      tahun: '[Tahun]',
      judul: '[Nama prestasi, mis. Juara 2 Lomba Web Design]',
      penyelenggara: '[Penyelenggara]',
      tingkat: '[Tingkat, mis. Kota / Provinsi]',
      deskripsi: '[Satu kalimat tentang lomba ini dan peranmu.]'
    },
    {
      tahun: '[Tahun]',
      judul: '[Nama prestasi atau kegiatan]',
      penyelenggara: '[Penyelenggara]',
      tingkat: '[Tingkat]',
      deskripsi: '[Satu kalimat tentang kegiatan ini dan peranmu.]'
    }
  ],

  /* ---------- Sertifikat ---------- */
  sertifikat: [
    { nama: '[Nama sertifikat]', penerbit: '[Penerbit, mis. BNSP / Dicoding / Google]', tahun: '[Tahun]', url: '#' },
    { nama: '[Nama sertifikat]', penerbit: '[Penerbit]', tahun: '[Tahun]', url: '#' },
    { nama: '[Nama sertifikat]', penerbit: '[Penerbit]', tahun: '[Tahun]', url: '#' }
  ],

  /* ---------- Kata guru, pembimbing, atau teman satu tim ---------- */
  testimoni: [
    {
      kutipan: '[Kutipan dari guru produktif, pembimbing PKL, atau teman satu tim: apa yang kamu kerjakan dan bagaimana sikap kerjamu.]',
      nama: '[Nama]',
      jabatan: '[Jabatan, mis. Guru produktif RPL]'
    },
    {
      kutipan: '[Kutipan dari guru produktif, pembimbing PKL, atau teman satu tim: apa yang kamu kerjakan dan bagaimana sikap kerjamu.]',
      nama: '[Nama]',
      jabatan: '[Jabatan]'
    },
    {
      kutipan: '[Kutipan dari guru produktif, pembimbing PKL, atau teman satu tim: apa yang kamu kerjakan dan bagaimana sikap kerjamu.]',
      nama: '[Nama]',
      jabatan: '[Jabatan]'
    }
  ],

  /* ---------- Tanya jawab ---------- */
  faq: [
    {
      tanya: 'Apakah kamu terbuka untuk PKL atau magang?',
      jawab: '[Jelaskan waktu, durasi, dan bidang yang kamu cari.]'
    },
    {
      tanya: 'Apakah menerima proyek freelance?',
      jawab: '[Jelaskan jenis proyek yang bisa kamu kerjakan dan batasan waktumu sebagai pelajar.]'
    },
    {
      tanya: 'Apa yang sedang kamu pelajari sekarang?',
      jawab: '[Sebutkan bahasa pemrograman, alat, atau topik yang sedang kamu dalami.]'
    },
    {
      tanya: 'Bagaimana cara menghubungimu?',
      jawab: '[Sebutkan cara tercepat: email, WhatsApp, atau media sosial.]'
    }
  ],

  /* ---------- Blog / Catatan ----------
     Tulisan pendek: pengalaman belajar, tutorial singkat, atau catatan proyek.
     tautan: boleh kosong (kartu tetap tampil tanpa tombol baca).           */
  blog: [
    {
      judul: 'Belajar konfigurasi VLAN di Cisco Packet Tracer',
      ringkasan: 'Catatan langkah demi langkah membuat VLAN, trunk antar switch, dan inter-VLAN routing dengan router-on-a-stick.',
      tanggal: '2026-09-12',
      tag: ['Jaringan', 'Cisco'],
      menit: 5,
      tautan: ''
    },
    {
      judul: 'Membuat line follower pertama dengan Arduino',
      ringkasan: 'Dari merangkai sensor sampai mengatur kecepatan motor. Termasuk kesalahan umum yang saya alami di prosesnya.',
      tag: ['Robotik', 'Arduino'],
      tanggal: '2026-08-30',
      menit: 7,
      tautan: ''
    },
    {
      judul: 'Portofolio pertama saya: dari nol sampai online',
      ringkasan: 'Kenapa memakai HTML, CSS, dan JavaScript murni, bagaimana desain dibuat, dan apa yang dipelajari selama membangunnya.',
      tanggal: '2026-08-02',
      tag: ['Web', 'Refleksi'],
      menit: 6,
      tautan: ''
    }
  ]
};
