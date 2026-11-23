# TriageSehat

Aplikasi web skrining awal gejala kesehatan berbasis Next.js dan Gemini API untuk membantu pengguna memahami tingkat urgensi awal sebelum berkonsultasi dengan tenaga medis.

> **Disclaimer:** TriageSehat berfungsi sebagai alat bantu informasi/skrining awal dan **bukan** pengganti diagnosis, pemeriksaan fisik, maupun saran medis profesional. Dalam kondisi darurat, segera hubungi layanan gawat darurat setempat atau kunjungi fasilitas kesehatan terdekat.

## Tautan Proyek
- **Live Demo (Vercel):** https://triagesehat.vercel.app
- **Repository GitHub:** https://github.com/jaza-al/triagesehat

## Fitur Utama
- **Formulir Skrining Gejala:** Input gejala, durasi/tingkat keparahan, serta catatan tambahan untuk analisis awal.
- **Contoh Kasus Cepat:** Pilihan skenario kasus cepat untuk mempermudah pengujian dan demonstrasi alur skrining.
- **Analisis Gemini API & Aturan Darurat:** Mengolah data gejala melalui endpoint `/api/analyze` dengan penanganan *fallback* dan deteksi tanda bahaya/darurat.
- **Riwayat Lokal:** Menyimpan riwayat hasil skrining di browser (`localStorage`) agar mudah ditinjau kembali oleh pengguna.

## Menjalankan Proyek Secara Lokal

1. **Clone repository**
   ```bash
   git clone [https://github.com/jaza-al/triagesehat.git](https://github.com/jaza-al/triagesehat.git)
   cd triagesehat