---
title: "Belajar Subnetting ala TKJ dengan Cisco Packet Tracer"
date: 2026-10-20
excerpt: "Subnetting terdengar menakutkan, tapi ternyata seru kalau langsung dipraktikkan di Packet Tracer. Ini catatan caraku memahaminya."
tags: ["jaringan", "cisco", "tkj"]
---

Saat pertama kali belajar subnetting, jujur saya sempat pusing. Angka 192.168.1.0/24, subnet mask, host address... semuanya berputar. Sampai akhirnya saya duduk di depan **Cisco Packet Tracer** dan mencoba sendiri.

## Kenapa /24 itu penting?

Slash 24 (`/24`) artinya 24 bit pertama dari 32 bit alamat IP dipakai untuk *network part*. Sisa 8 bit untuk host. Rumus singkatnya:

```text
Jumlah host per subnet = 2^(32 - prefix) - 2
```

Untuk `/24`: `2^8 - 2 = 254` host yang bisa dipakai. Dua dikurangi karena **network address** dan **broadcast address** tidak bisa diberikan ke perangkat.

## Praktik langsung di Packet Tracer

1. Taruh **3 PC** dan **1 Router** di area kerja.
2. Sambungkan dengan kabel **Copper Straight-Through**.
3. Atur IP PC 1 = `192.168.1.2`, PC 2 = `192.168.1.3`, PC 3 = `192.168.1.4`, semuanya dengan subnet mask `255.255.255.0`.
4. Set gateway masing-masing ke `192.168.1.1` (IP interface router).
5. Aktifkan interface router dengan perintah `no shutdown`.
6. Tes koneksi antar PC dengan `ping`.

Kalau semua hijau, berarti konfigurasi kalian benar.

## Supaya cepat hafal

- **Belajar dari tabel cepat**: `/24 = 254 host`, `/25 = 126`, `/26 = 62`, `/27 = 30`, `/28 = 14`.
- **Cek dengan calculator subnetting** sekali-sekali untuk memverifikasi hitungan manualmu.
- **Buat jaringan dua subnet** antara dua router — di situ letak tantangan sekaligus keseruannya.

Subnetting bukan hafalan, tapi keterampilan. Makin sering dipraktikkan, makin masuk akal. Ayo coba!
