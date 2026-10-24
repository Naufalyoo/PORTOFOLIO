---
title: "Proyek Arduino Pertamaku: Lampu Otomatis dengan Sensor LDR"
date: 2026-10-10
excerpt: "Lampu rumah yang menyala sendiri saat gelap — kedengarannya simpel, tapi di baliknya ada logika pemrograman dan prinsip sensor cahaya yang keren."
tags: ["arduino", "iot", "tkj"]
---

Papan Arduino Uno yang sudah berbulan-bulan nganggur di meja akhirnya terpakai juga. Proyek pertama: **lampu otomatis berbasis sensor LDR** (Light Dependent Resistor). Intinya: kalau ruangan gelap, lampu LED menyala. Kalau terang, mati sendiri.

## Komponen yang dipakai

- Arduino Uno
- Sensor LDR (Light Dependent Resistor)
- LED 5mm
- Resistor 220Ω
- Kabel jumper
- Breadboard

## Rangkaiannya

Simpel banget. Sensor LDR dipasang sebagai *voltage divider* ke pin `A0` (analog input). LED ke pin `13` (digital output). Prinsip voltage divider:

```
5V ---- resistor 10kΩ ----+---- LDR ---- GND
                          |
                       pin A0
```

Semakin gelap, resistansi LDR naik → tegangan di A0 turun → Arduino baca nilai kecil.

## Kode-nya

```cpp
const int LDR_PIN = A0;
const int LED_PIN = 13;
const int THRESHOLD = 500; // atur sesuai kondisi ruangan

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(LDR_PIN);
  Serial.println(light);

  if (light < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH); // gelap → LED nyala
  } else {
    digitalWrite(LED_PIN, LOW);  // terang → LED mati
  }

  delay(500);
}
```

## Yang saya pelajari

1. **analogRead()** mengembalikan nilai 0–1023, bukan 0/1.
2. Nilai `THRESHOLD` harus disesuaikan — setiap ruangan beda pencahayaan.
3. Bisa pakai `Serial Monitor` (Ctrl+Shift+M di Arduino IDE) untuk debugging nilai LDR secara real-time.

## Upgrade berikutnya

Dari proyek ini, ide yang muncul:
- Pakai relay untuk menyalakan lampu 220V sungguhan
- Tambah **sensor PIR** supaya juga bergerak kalau ada orang lewat
- Hubungkan ke **ESP8266** biar bisa monitoring dari HP

Tahap demi tahap. Mulai dari yang kecil dulu.
