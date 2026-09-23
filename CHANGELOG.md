# Changelog BAQI

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