# Changelog BAQI

## v0.4.5 — Perbaikan drag & drop + urutan soal acak + pilot yesorno

- Perbaiki sisa **bayangan hijau pada drag & drop** (Quran) di `Exam` & `FinalExam`: selain `dragReleasedStyle`, kini `hoverDragReleasedStyle` juga dibuat `opacity: 0` sehingga clone kotak jawaban yang ikut jari langsung hilang saat dilepas (tidak ada lagi lengkungan/sisa kotak yang nyangkut di posisi drop).
- **Urutan soal diacak** setiap kali ujian dimuat di `Exam` & `FinalExam` (Fisher–Yates shuffle), sehingga tipe soal (pilihan ganda, multi, yes/no, drag) tercampur acak dan tidak beruntun menurut urutan database.
- Tambahkan 3 soal tipe **Yes/No** pada materi "Kata Ganti" (Level 1 · Sublevel 1) di kurikulum Quran (7 soal lama + 3 baru = 10 soal), plus penghapusan 10 baris pilot yes/no lama yang teks Arabnya rusak saat import. Import dilakukan dengan `SET NAMES utf8mb4` agar huruf Arab tersimpan benar.

## v0.4.4 — Perbaikan border & drag-and-drop di semua ujian

- Perbaiki tampilan border pada pilihan jawaban **Ujian Akhir Bab / Final Test** (`FinalExam`): `borderRadius` disamakan dengan setengah tinggi elemen + `overflow: hidden` sehingga garis border melengkung sempurna di semua sudut (sebelumnya hanya `Exam` yang diperbaiki).
- Perbaiki bug **drag & drop** di `Exam` dan `FinalExam`: clone kotak jawaban setelah di-drop kini benar-benar hilang (`opacity: 0`) melalui style `dragReleased` terpisah — tidak ada lagi sisa kotak transparan/lengkungan yang nyangkut di layar.

## v0.4.3 — Ikon baru & perbaikan border pilihan jawaban

- Ganti ikon menu "Petrofisika & CEOR" di halaman Beranda dengan versi baru yang lebih proporsional.
- Perbaiki tampilan border pada pilihan jawaban soal (klik jawaban): `borderRadius` disamakan dengan setengah tinggi elemen + `overflow: hidden` sehingga garis border melengkung sempurna di semua sudut (tidak ada lagi garis yang "keluar" di pojok kanan), berlaku untuk semua tipe soal (pilihan ganda, multi, gambar, drag).

## v0.4.2 — Penyesuaian nama file APK

- Nama file APK hasil build rilis diganti menjadi `baqi-vX.Y.Z.apk` (release bertag) dan `baqi-dev.apk` (build otomatis dari branch main).

## v0.4.1 — Menu baru & perbaikan tampilan

- Ikon menu Petrofisika & CEOR di halaman Beranda diganti dengan ikon khusus (`icon-petrofisika-chemical-eor.png`).
- Menu Petrofisika & CEOR dipecah menjadi dua sub-menu: **Petrofisika** (7 bab) dan **Chemical EOR** (5 bab), masing-masing dengan ikonnya sendiri (`icon-petrofisika.png` & `icon-chemical-eor.png`).
- Perbaiki daftar bab di halaman bab (Petrofisika/Chemical EOR): konten kini bisa di-scroll penuh sampai bawah — item terakhir (Petrofisika Bab 7) beserta tombol "Ujian Akhir Bab · TES AKHIR" tidak lagi terpotong.

## v0.4.0 — Rilis APK ber-version

- Perbaiki bug Final Test di menu Petrofisika & CEOR (excerpt literal `'Final Test'` sehingga ujian final bab bisa dimuat dari server).
- Di halaman Materi Petrofisika & CEOR: tombol "Ujian Tata Bahasa" tidak lagi ditampilkan (menu ini hanya milik kurikulum Quran), tombol "Ujian Pelajaran" tampil di tengah footer.
- Konten materi & soal Petrofisika + Chemical EOR lengkap: 12 bab, 36 sub-bab, 72 materi, 960 soal (soal materi, ujian pelajaran, dan final test).