# Changelog BAQI

## v0.6.0 — Ujian 3 Sesi (Petrofisika & CEOR)

- **Mekanisme ujian 3 sesi per bab** (khusus Petrofisika & CEOR):
  1. **Sesi 1 — Soal Inisialisasi** (10 soal: option 7, multi 1, drag 1, yesorno 1) — ambang lulus **8/10**
  2. **Sesi 2 — Final Test** (20 soal lama, tidak diubah) — ambang lulus **18/20**
  3. **Sesi 3 — Final Test Advanced** (20 soal baru: option 12, multi 4, drag 2, yesorno 2) — ambang lulus **18/20**
- **Alur lulus/gagal**: lulus → skor disimpan (`skors`, `excerpt` = sesi) → otomatis lanjut sesi berikutnya; gagal → modal **"Perbaiki soal yang salah, sebelum lanjut"** → ulang hanya soal yang salah sampai memenuhi ambang.
- **360 soal baru** (12 bab × 30 soal: 10 Inisialisasi + 20 Advanced) ditambahkan ke tabel `final_exam` (ID `FQT...0600`–`...0959`). Soal lama 20/bab dipakai apa adanya sebagai Sesi 2.
- **DB**: kolom `excerpt` varchar(15) → nama sesi pendek `Inisialisasi` / `Final Advanced`, label tampil penuh via app.
- **Non-Petro/CEOR** (Level 1–5, Grammer Test, Ujian Pelajaran) **tidak berubah** — alur baru hanya aktif dengan parameter `flow: 'petro3'`.

## v0.5.5 — Perbaikan hapus akun, tombol Masuk di Register & spinner Lupa Kata Sandi

- **Hapus akun**: setelah akun berhasil dihapus, data login di perangkat kini ikut dibersihkan (`AsyncStorage.clear()`) sebelum aplikasi kembali ke halaman **Login**. Sebelumnya data lama tetap tersimpan, sehingga saat aplikasi dibuka ulang layar **Splash** langsung masuk ke Beranda dengan akun yang sudah tidak ada (semua menu jadi error).
- **Tombol "Masuk" di halaman Register**: kini membuka halaman **Login**. Sebelumnya hanya memunculkan notifikasi "berhasil" palsu.
- **Lupa Kata Sandi**: loader tidak lagi berhenti tanpa kabar saat server membalas status di luar 200/404/500 — kini muncul pesan kesalahan umum (`err_data`) dan loader selalu berhenti.

## v0.5.4 — Perbaikan login & register Google/Facebook (proyek Firebase + App Facebook baru)

- **Perbaiki login & register Google**: `webClientId` di `App/Containers/Login` dan `App/Containers/Register` diganti ke proyek Firebase baru (`baqi-f0c55`). Sebelumnya masih menunjuk proyek Google lama, sehingga konfigurasi login Google tidak cocok dengan `google-services.json` yang dipakai aplikasi.
- **Perbaiki login & register Facebook**: `facebook_app_id` di `android/app/src/main/res/values/strings.xml` diganti ke **App Facebook baru** (`39671816512431633`), dan `android/app/google-services.json` diganti ke konfigurasi Firebase baru.
- **Perbaiki `uid` hasil registrasi**: kini memakai `result.data.trid` (ID user dari server). Sebelumnya memakai `JSON.stringify(datas[0].id)` sehingga `uid` yang disimpan tidak sesuai — akibatnya akun yang baru mendaftar tidak bisa membaca konten.
- **CI rilis**: keystore rilis kini di-decode dari GitHub Secret `UPLOAD_KEYSTORE_BASE64` (sebelumnya keystore dibuat baru di setiap build, sehingga SHA-1 aplikasi berubah-ubah dan login Google/Facebook gagal).
- **Aset**: tambah 5 gambar banner "Buat Kamu" (`konten_info.jpg`, `konten_pencapaian.jpg`, `konten_pengajian.jpg`, `konten_quote.jpg`, `konten_tips.jpg`).

## v0.5.3 — Perbaikan layar hitam saat membuka detail grup + warna kartu menu Petrofisika/CEOR

- Perbaiki **layar hitam** saat membuka **detail grup yang diikuti** (`App/Containers/Group/GrupDetail`): nilai peringkat (`result.data.value.rank`) sebelumnya dievaluasi **di dalam** fungsi updater `setState`, padahal untuk anggota yang belum punya data peringkat server membalas `status 200` dengan `value` **`null`** — memicu `TypeError` di fase render yang menggulingkan seluruh tampilan (layar hitam + tombol back keluar app). Kini nilai dihitung **lebih dulu** dengan pengaman `null`; bila kosong ditampilkan `-` (kolom peringkat), sama seperti fallback status 404/500.
- Ubah **warna kartu** di halaman pilih materi **Petrofisika / Chemical EOR** (`App/Containers/Petrofisika`): kartu **Petrofisika** kini biru (`#1F618D`), kartu **Chemical EOR** kini hijau/tosca (`#00AF90`).
- Perbaiki **foto anggota** di halaman **Tambah Anggota** (`App/Containers/Group/TambahMember`): avatar kini memakai **foto profil anggota** (`item.value.picture`) bila tersedia, dan otomatis jatuh ke **avatar bawaan** (`icUsertemp`) bila anggota belum punya foto (sebelumnya selalu menampilkan gambar bawaan).
- Paksa **tema terang** (`Theme.AppCompat.Light.NoActionBar`) di `android/app/src/main/res/values/styles.xml` (sebelumnya `DayNight`) agar tampilan tidak otomatis berubah gelap saat perangkat memakai mode gelap.

## v0.5.2 — Halaman Ujian terpusat: pilih materi (Qur'an / Petrofisika / CEOR)

- Halaman **Ujian** (menu "Ayo Uji Kemampuanmu" di Beranda) kini menampilkan **pilihan materi**: **Memahami Qur'an**, **Petrofisika**, dan **Chemical EOR** (`App/Containers/ExamMenu`).
- **Memahami Qur'an** → tetap sama seperti sebelumnya: daftar **Level 1–5**, lalu pilih **Grammer Test / Final Test** (halaman `HomeExam` tidak diubah, hanya disambung dari menu materi baru).
- **Petrofisika** & **Chemical EOR** → daftar bab (**Petrofisika Bab 1–7** / **CEOR Bab 1–5**); setiap bab berupa kartu berisi **nama bab** (keterangan) + label **"Ujian Akhir Bab · TES AKHIR"**, ditekan langsung masuk ujian (`App/Containers/ExamPetro`).
- Tombol **"Ujian Akhir Bab · TES AKHIR"** **dipindahkan** dari halaman bab (`PetroLevel`) ke halaman Ujian — halaman bab kini fokus untuk belajar. **Isi soal tidak diubah.**

## v0.5.1 — Drag & drop opsi panjang rapi + logo halaman pilihan materi Petrofisika & CEOR

- Perbaiki tata letak **drag & drop** di `Exam` & `FinalExam`: keping jawaban berteks panjang (mis. terjemahan ayat) kini otomatis disusun **satu kolom** (`numColumns` 1 bila ada opsi > 15 karakter), keping jawaban (`draggable`) dan kotak jawaban (`receiver`) memakai **`minHeight` + padding vertikal** sehingga teks panjang tidak terpotong/bertabrakan, dan area drag disusun vertikal (`width: 100%`, `alignItems: center`).
- Tambahkan **logo BAQI** di halaman pilihan materi **Petrofisika & CEOR** (`App/Containers/Petrofisika`): pola posisi & ukuran sama persis dengan halaman lain (`viewCenterAbsolute`, logo `256×270` `resizeMode: contain`), latar tetap putih.

## v0.5.0 — Konten lengkap Level 6 Qur'an (Al-Baqarah 142–176)

- **Isi kurikulum Level 6** (Memahami Qur'an) secara penuh: 5 sublevel baru (37–41), 40 materi, dan **280 soal** — tafsir & tata bahasa **Al-Baqarah ayat 142–176**, mengikuti pola understandquran.com Course 6.
- Susunan ujian per materi konsisten dengan Level 1–5: materi **Qur'an** 6 soal (5 pilihan ganda + 1 yes/no), materi **Tata Bahasa** 8 soal (7 pilihan ganda + 1 yes/no, sebagian dengan tipe jawaban banyak/`multi`).
- Impor konten via `quran-yesorno/l6/output/l6/*.sql` (`00_sublevels.sql` + `01–05_sublevelN.sql`): teks Arab di-encode **HEX** (`CONVERT(0x… USING utf8mb4)`), file 100% ASCII — aman terhadap charset koneksi import apa pun.
- Level 6 kini utuh di server: **5 sublevel · 40 materi · 280 soal**; diverifikasi `Masalah: 0` melalui pengecekan API read-only.

## v0.4.7 — Perbaikan opsi dobel & hardening render soal di semua ujian

- Perbaiki **opsi jawaban yang teksnya dobel** di 25 soal kurikulum Quran (Level 1–5): entri ganda dibuang sehingga tersisa opsi unik (jawaban benar tidak diubah) — menghilangkan tampilan jawaban dobel yang salah satu opsi atasnya tampak hijau/terkunci sejak awal, termasuk soal **drag** dengan keping dobel. Impor via `output/sql_fix_opsi_dobel_v1.sql` (teks Arab di-encode **HEX** `CONVERT(0x… USING utf8mb4)`, file 100% ASCII).
- Bonus: betulkan `correct_option` soal `QST…612` (`تُنۢبِتُ الْاَرْضُ`) dari "Kami tidak akan pernah bertahan" → **"bumi tumbuh"** (sesuai `correct_en` "the earth grows"; nilai persis ada di opsi).
- **Hardening render soal** di `Exam` & `FinalExam`: `key={option}` diganti `key={index}` dan `keyExtractor` list multi-select memakai index — bila ke depan ada opsi berteks sama, state highlight & handler sentuh tidak lagi kacau (tidak ada opsi yang tampak sudah-terjawab/seleksi ganda).

## v0.4.6 — Hilangkan artefak drag & drop tersisa + impor yes/no anti-corrupt

- Hilangkan **artefak/ghost drag & drop yang masih tersisa** di `Exam` & `FinalExam`: seluruh `<DraxProvider>` kini diberi `key` unik per soal (`drax-id-${index}` / `drax-en-${index}`) sehingga instance Drax di-**remount total** setiap kali ganti soal — state clone/bayangan yang bocor ke soal berikutnya (termasuk ke tipe soal lain) hilang sepenuhnya.
- Sertakan file impor SQL versi 3 (`sql_pilot_yesorno_mtr5_v3.sql`) untuk 3 soal Yes/No materi "Kata Ganti": teks Arab di-encode **HEX** (`CONVERT(0x… USING utf8mb4)`) sehingga file 100% ASCII — pengaturan charset koneksi import apa pun (latin1/cp1252) tidak bisa lagi mengubah huruf Arab menjadi `?`.

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