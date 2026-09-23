# 📖 BAQI — Bahasa Qur'an Interaktif

**BAQI** adalah aplikasi pembelajaran mobile berbasis **React Native** yang menyajikan kurikulum interaktif untuk belajar **Bahasa Qur'an** serta **Petrofisika & Chemical Enhanced Oil Recovery (CEOR)**. Setiap materi dilengkapi video (tonton), dokumen (baca & unduh), dan ujian berjenjang — dari kuis per materi, ujian per pelajaran, hingga ujian akhir bab — lengkap dengan peringkat dan grup belajar.

> Rilis Android terbaru (APK): <https://github.com/yuwanch3/baqi/releases>

---

## ✨ Fitur Unggulan

- **📚 Dua Kurikulum dalam Satu Aplikasi**
  - **Memahami Qur'an** — belajar Bahasa Qur'an dengan materi, latihan, dan ujian per pelajaran.
  - **Petrofisika & Chemical EOR** — kurikulum teknik perminyakan lengkap: 12 bab, 36 sub-bab, 72 materi, dan **960 soal** (kuis materi, ujian pelajaran, dan final test per bab).
- **🎬 Belajar Multi-Modal** — setiap materi memiliki menu **Tonton** (video), **Baca**, dan **Unduh** (PDF/dokumen).
- **📝 Ujian Berjenjang**
  - Kuis per materi (5 soal)
  - Ujian Pelajaran per sub-bab (10 soal)
  - Final Test per bab (20 soal)
  - Mendukung soal pilihan ganda (`option`) dan jawaban banyak (`multi`), dengan posisi kunci jawaban diacak merata agar tidak bisa ditebak.
- **🏆 Peringkat (Ranking)** — pantau progres belajar dan posisi kamu.
- **👥 Grup Belajar** — buat grup, undang anggota, dan belajar bersama.
- **🌐 Multi-Bahasa** — antarmuka Bahasa Indonesia & English (React i18next).
- **👤 Akun & Autentikasi** — login/register, Google & Facebook sign-in, dan profil pengguna.

---

## 🧰 Teknologi yang Digunakan

| Lapisan | Teknologi |
|---|---|
| Framework | **React Native 0.65.1** (Android + iOS) |
| Navigasi | React Navigation (stack) |
| Bahasa Utama | JavaScript (ES6+) |
| State/Storage | React Hooks + AsyncStorage |
| HTTP Client | Axios |
| Internasionalisasi | react-i18next (id / en) |
| Auth | Firebase Authentication, Google Sign-In, Facebook SDK |
| Komponen UI | react-native-paper, react-native-vector-icons, react-native-linear-gradient |
| Backend/API | REST API PHP + MySQL (server `baqi.jannahku.com`) |
| CI/CD | GitHub Actions (build otomatis APK release per commit/tag) |

---

## 📂 Struktur Folder Project

```
baqi/
├─ App/                        # Kode utama aplikasi React Native
│  ├─ Assets/                  # Logo, ikon menu (termasuk ikon Petrofisika & CEOR)
│  ├─ Components/              # Komponen UI kecil yang dipakai ulang
│  ├─ Configs/                 # Konfigurasi koneksi server/API (apikey)
│  ├─ Containers/              # Layar (screen) aplikasi
│  │  ├─ Home/                 # Menu utama (Beranda) & progres
│  │  ├─ UnderstandQuran/      # Kurikulum Memahami Qur'an
│  │  ├─ Petrofisika/          # Pemilih materi Petrofisika & CEOR
│  │  ├─ PetroLevel/           # Daftar bab per materi (7 bab Petro / 5 bab CEOR)
│  │  ├─ SubLevel/             # Sub-bab dari sebuah bab
│  │  ├─ Materi/               # Detail materi (Tonton, Baca, Unduh, Ujian)
│  │  ├─ Exam/                 # Ujian kuis materi
│  │  ├─ FinalExam/            # Ujian Pelajaran & Final Test bab
│  │  ├─ Rangking/             # Peringkat belajar
│  │  ├─ Group/                # Grup belajar
│  │  └─ ...                   # Login, Register, Watch, Read, Download, dll.
│  ├─ Helper/                  # Fungsi bantu
│  ├─ Navigations/             # Registrasi navigasi layar (AppNavigator)
│  └─ Translate/               # File terjemahan id/ & en/ (react-i18next)
├─ android/                    # Proyek Android (Gradle)
│  └─ app/build.gradle         # Versi aplikasi (versionMajor/Minor/Patch)
├─ ios/                        # Proyek iOS
├─ .github/workflows/          # GitHub Actions (build-apk.yml → build APK release)
├─ CHANGELOG.md                # Daftar perubahan versi
└─ package.json                # Dependensi & skrip npm
```

---

## 🚀 Cara Menjalankan (Development)

> Prasyarat: Node.js, npm, React Native CLI environment, Android SDK / Xcode.

```bash
# 1. Install dependensi
npm install --legacy-peer-deps   # atau: npm ci --legacy-peer-deps

# 2. Jalankan Metro bundler
npm start

# 3. Jalankan aplikasi (terminal lain)
npm run android   # atau: npm run ios
```

### Build APK Release Lokal

```bash
cd android
./gradlew assembleRelease
# Hasil: android/app/build/outputs/apk/release/app-release.apk
```

> ⚠️ Proyek dikonfigurasi untuk React Native 0.65; beberapa skrip penting di CI menggunakan `NODE_OPTIONS=--openssl-legacy-provider` untuk kompatibilitas OpenSSL 3.

---

## 📦 Versi & Rilis

Versi aplikasi diatur di `android/app/build.gradle` (`ext.versionMajor/Minor/Patch`, misal `0.4.1`).

Proses rilis otomatis via **GitHub Actions** (`.github/workflows/build-apk.yml`):

- **Push ke `main`** → build APK dan diunggah ke release `dev` (build otomatis terbaru).
- **Push tag `v*`** (misal `v0.4.1`) → build APK dan dibuatkan **release ber-version baru** yang tidak menimpa rilis sebelumnya.

```bash
git tag v0.4.1 && git push origin v0.4.1
```

Lihat riwayat lengkap di [CHANGELOG.md](./CHANGELOG.md).

---

## 📜 Changelog

### v0.4.1 — Menu baru & perbaikan tampilan
- Ikon menu Petrofisika & CEOR di halaman Beranda diganti dengan ikon khusus.
- Menu Petrofisika & CEOR dipecah menjadi dua sub-menu: **Petrofisika** (7 bab) dan **Chemical EOR** (5 bab), masing-masing dengan ikonnya sendiri.
- Perbaiki daftar bab: konten bisa di-scroll penuh sampai bawah — item terakhir (Petrofisika Bab 7) beserta tombol "Ujian Akhir Bab · TES AKHIR" tidak lagi terpotong.

### v0.4.0 — Rilis APK ber-version
- Perbaiki bug Final Test di menu Petrofisika & CEOR.
- Tombol "Ujian Tata Bahasa" tidak lagi ditampilkan pada materi Petrofisika & CEOR.
- Konten lengkap: 12 bab, 36 sub-bab, 72 materi, 960 soal.

---

## 🤝 Kontribusi

Terbuka untuk kontribusi! Silakan buat *issue* untuk melaporkan bug atau *pull request* untuk perbaikan/fitur baru. Pastikan perubahan tetap konsisten dengan struktur dan gaya kode yang ada.

## 📄 Lisensi

Hak cipta © BAQI — GMJ Global Energy. Seluruh materi pembelajaran (materi, soal, kurikulum) adalah konten eksklusif aplikasi BAQI.