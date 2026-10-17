/* ==========================================================
   DATA PORTOFOLIO
   Ini satu-satunya file yang perlu kamu edit untuk mengisi
   website. Semua bagian (proyek, keahlian, sertifikat, dll)
   dibuat otomatis oleh js/render.js dari data di bawah.

   Cara pakai:
   - Ganti semua teks dalam kurung siku [ ... ] dengan datamu.
   - Mau menambah item? Salin satu blok { ... } lalu tempel
     di bawahnya (jangan lupa tanda koma).
   - Mau menghapus item? Hapus satu blok { ... } saja.
   - Kalau satu daftar dikosongkan ( [] ), bagiannya otomatis
     disembunyikan.
   ========================================================== */

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
    formEndpoint: '',              // opsional: alamat Formspree dsb. Kosong = formulir membuka aplikasi email.

    tentang: [
      '[Ceritakan singkat siapa kamu, apa jurusanmu, dan apa yang membuatmu tertarik pada bidang ini. Dua sampai tiga kalimat sudah cukup.]',
      '[Tambahkan satu paragraf tentang cara belajarmu: proyek apa yang sedang kamu kerjakan, apa yang ingin kamu kuasai, dan apa yang kamu cari (PKL, magang, kolaborasi, atau pekerjaan pertama).]'
    ],

    sosial: [
      { nama: 'GitHub',    url: '#' },
      { nama: 'TikTok',  url: '#' },
      { nama: 'Instagram', url: '#' }
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
  ]
};
