# ☕ CodeQuest — Studio Kecil

Game santai berbahasa Indonesia tentang menjadi web developer freelance. Kamu duduk di studio kecil, menerima pesanan dari klien lewat chat, lalu menulis HTML, CSS, dan JavaScript sungguhan untuk membangun website mereka. Tidak ada kuis pilihan ganda: yang dinilai adalah website yang benar-benar kamu buat.

**Main sekarang:** https://khincc00.github.io/Code_Quest/

Dibuat oleh **Taufiq Sholikhin ([@khincc](https://github.com/khincc00))**.

---

## Daftar isi

- [Cara bermain](#cara-bermain)
- [Isi game](#isi-game)
- [Suasana dan musik tiap bab](#suasana-dan-musik-tiap-bab)
- [Fitur](#fitur)
- [Struktur proyek](#struktur-proyek)
- [Menjalankan secara lokal](#menjalankan-secara-lokal)
- [Deploy ke GitHub Pages](#deploy-ke-github-pages)
- [Cara kerja di balik layar](#cara-kerja-di-balik-layar)
- [Menambah bab atau pesanan](#menambah-bab-atau-pesanan)
- [Kompatibilitas](#kompatibilitas)
- [Lisensi](#lisensi)

---

## Cara bermain

1. **Buka laptop** di studio. Klien mengirim pesan berisi kebutuhannya.
2. **Tulis kode** di editor. Pratinjau website berubah langsung, dan catatan "Yang diminta …" tercentang sendiri saat kebutuhannya terpenuhi.
3. **Kirim ke klien.** Kalau masih ada yang kurang, klien meminta revisi dengan bahasanya sendiri, sama seperti klien sungguhan.
4. **Terima bayaran.** Pakai tabunganmu di rak **Toko** untuk menghias studio: tanaman, lampu, poster, jam dinding, proyektor bintang, pemutar piringan hitam, bahkan kucing.
5. **Buntu?** Buka **Buku catatan** untuk penjelasan konsep, contoh, dan petunjuk bertahap (arah dulu, kode lengkap belakangan).

Klien kadang mengirim file, misalnya foto produk atau data JSON. File itu muncul di atas editor. Klik untuk melihat isinya dan menyisipkan namanya ke kode.

Semua website yang sudah selesai bisa diunduh kapan saja dari **Pengaturan → Portofolio**.

---

## Isi game

### Bab 1: Warung Kopi Senja — dasar HTML dan CSS

Klien: **Bu Sari**, pemilik warung kopi yang baru pertama kali punya website.

| Pesanan | Yang dipelajari |
|---|---|
| Papan nama warung | `<h1>`, `<p>`, struktur `<body>` |
| Daftar menu | `<h2>`, `<ul>`, `<li>` |
| Tombol WhatsApp | `<a href>`, format nomor `wa.me`, `target="_blank"` |
| Warna senja | CSS: `<style>`, warna, `font-family` |
| Tombol pesan | JavaScript: `getElementById`, `addEventListener`, `textContent` |
| Rapi di HP dan laptop | `meta viewport`, `max-width`, `margin: 0 auto` |

### Bab 2: Toko Bunga Laras — tata letak, formulir, dan data

Klien: **Laras**, pemilik toko bunga yang butuh website lebih lengkap. Dia mengirim file foto produk yang harus dipakai dengan nama file yang tepat.

| Pesanan | Yang dipelajari |
|---|---|
| Kerangka halaman | `<header>`, `<nav>`, `<section>`, tautan ke `#id` |
| Foto produk | `<img>`, nama file yang tepat, `alt` untuk pembaca layar |
| Kartu produk | atribut `class`, selector `.kartu`, `padding`, `border-radius` |
| Kartu berjajar | Flexbox: `display: flex`, `gap`, `flex-wrap`, `:hover`, `transition` |
| Formulir pesanan | `<form>`, `<label for>`, `<input required>`, `<textarea>` |
| Konfirmasi pesanan | event `submit`, `preventDefault()`, `.value`, template literal |
| Katalog dari data | array objek, `forEach`, `innerHTML +=` |

### Bab 3: Ruang Nada — JavaScript tingkat lanjut

Klien: **Bima**, pengelola kafe musik kecil. Websitenya sudah ada, tapi perlu tema terang/gelap, jadwal yang dibaca dari file JSON, dan pencarian.

| Pesanan | Yang dipelajari |
|---|---|
| Warna jadi variabel | CSS custom property di `:root`, `var()` |
| Tombol mode gelap | `classList.toggle`, class yang menimpa variabel |
| Ingat pilihan mode | `localStorage.setItem` / `getItem`, `classList.contains` |
| Jadwal dari file JSON | `fetch()`, `async` / `await`, `response.json()`, CSS Grid |
| Kalau sinyal jelek | `try` / `catch`, pesan ramah saat offline |
| Filter genre | `Array.filter()`, arrow function, `dataset`, fungsi render ulang |
| Cari musisi | event `input`, `toLowerCase()`, `includes()`, keadaan kosong |

Setiap bab yang selesai memberi hadiah dekorasi dari klien: foto warung berbingkai, vas bunga, dan gitar tua.

---

## Suasana dan musik tiap bab

Setiap bab punya suasana dan tema musik sendiri. Semua suara dibuat langsung di browser dengan Web Audio API, tanpa file audio.

| Bab | Suasana studio | Musik | Suara sekitar |
|---|---|---|---|
| 1. Warung Kopi Senja | Sore hujan yang pelan-pelan menjadi malam | Piano lo-fi dan lonceng pentatonik, 72 bpm | Hujan dan derau piringan hitam |
| 2. Toko Bunga Laras | Pagi cerah: matahari, awan, burung lewat | Arpeggio petik di atas pad lembut, 92 bpm | Kicau burung dan angin |
| 3. Ruang Nada | Malam berbintang dengan bulan dan lampu kota, berakhir fajar | Akor jazz electric piano, bass berjalan, sapuan brush, 58 bpm | Jangkrik dan dengung kota |

Langit di jendela berubah seiring pesanan yang selesai. Saat bab berganti, suara sekitar memudar perlahan ke tema baru. Pemutar piringan hitam (item toko) membuka lagu alternatif yang bisa dipilih di Pengaturan. Volume musik, suasana, dan efek bisa diatur terpisah.

---

## Fitur

- **Kode pemain benar-benar dijalankan.** Pemeriksaan membaca hasil halamannya (DOM, style yang dihitung browser, simulasi klik, pengisian formulir, pengetikan), bukan mencocokkan teks.
- **Pemeriksaan bertahap.** Beberapa kebutuhan diuji dalam kondisi berbeda: halaman dibuka ulang (untuk `localStorage`) dan halaman tanpa internet (untuk `try/catch`).
- **Klien yang terasa nyata.** Revisi ditulis dengan gaya bicara tiap klien, file dikirim lewat chat, dan setiap pesanan punya alasan dunia nyata.
- **Editor dengan pewarnaan sintaks**, indentasi otomatis, konsol error, dan pratinjau Laptop/HP. Mode Laptop menampilkan halaman selebar 1024px yang diperkecil agar muat.
- **Progres tersimpan otomatis** di browser, termasuk kode tiap proyek, tabungan, dan dekorasi. Simpanan dari versi lama dipindahkan otomatis.
- **Mulai dari awal** memakai dialog konfirmasi di dalam halaman, sehingga tetap berfungsi di pratinjau yang memblokir `confirm()`.
- **Responsif.** Di HP, panel Pesan, Kode, dan Pratinjau menjadi tab.
- **Aksesibel.** Navigasi keyboard untuk objek di studio, fokus yang terlihat, dan animasi yang menghormati `prefers-reduced-motion`.
- **Tanpa build, tanpa library.** Cukup HTML, CSS, dan JavaScript biasa.

---

## Struktur proyek

```
.
├── index.html       # Struktur halaman (markup) — file utama yang dibuka browser
├── css/
│   └── style.css    # Semua styling: tema, layout, animasi CSS
├── js/
│   └── game.js      # Logika game: data bab, state, pemeriksa kode, audio, adegan studio
├── README.md        # Dokumentasi ini
├── LICENSE          # Lisensi MIT
└── .gitignore
```

File dipisah mengikuti praktik standar proyek web (separation of concerns): `index.html` untuk struktur, `css/style.css` untuk tampilan, dan `js/game.js` untuk logika.

**`index.html`** berisi adegan studio dalam SVG (jendela, meja, laptop, dekorasi, lapisan hujan/pagi/malam), layar judul, studio, ruang kerja (chat, editor, pratinjau), dan semua dialog.

**`css/style.css`** berisi token warna dan font di `:root`, layout ruang kerja tiga kolom yang berubah menjadi tab di layar kecil, gaya dialog, serta animasi adegan (hujan, uap teh, awan, burung, bintang berkelip).

**`js/game.js`** tersusun dalam bagian-bagian berikut:

| Bagian | Isi |
|---|---|
| Pembantu pemeriksa (`T`) | Fungsi untuk menguji halaman pemain: teks, CSS, gambar, formulir, mode gelap, pencarian |
| Aset dari klien | Gambar SVG (`ASET_SVG`) dan file data (`ASET_TEKS`, misalnya `jadwal.json`) |
| Data bab (`BAB`) | Klien, kode awal, tema, langit, hadiah, dan daftar pesanan tiap bab |
| Toko & suasana | Item dekorasi (`ITEMS`) dan warna ruangan per tema (`SUASANA`) |
| State & penyimpanan | Struktur simpanan, migrasi versi lama, simpan ke `localStorage` |
| Audio | Tema musik (`TEMA_MUSIK`), instrumen sintetis, suara sekitar, sequencer |
| Adegan studio | Langit, lapisan suasana, dekorasi, jam dinding |
| Layar & reset | Perpindahan layar, dialog konfirmasi, mulai dari awal |
| Ruang kerja | Chat klien, checklist, editor, pratinjau, pemeriksa bertahap |
| Dialog & inisialisasi | Buku catatan, toko, pengaturan, portofolio, unduhan |

---

## Menjalankan secara lokal

Karena file dipisah (`css/`, `js/`), cara paling aman adalah lewat server lokal:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser. Alternatif lain: extension **Live Server** di VS Code.

Membuka `index.html` langsung dengan klik dua kali biasanya juga berjalan, tapi beberapa browser membatasi akses file lokal.

---

## Deploy ke GitHub Pages

1. Upload semua isi folder ini ke repository GitHub. Pastikan folder `css/` dan `js/` ikut terupload, bukan hanya `index.html`.
2. Buka **Settings → Pages** di repository.
3. Pada **Source**, pilih branch `main` dan folder `/ (root)`.
4. Klik **Save**. Tunggu 1–2 menit, lalu game bisa diakses di `https://<username>.github.io/<nama-repo>/`.

Lewat Git CLI:

```bash
git add .
git commit -m "CodeQuest: Bab 3 dan tema musik per bab"
git push origin main
```

Jika memperbarui dari versi satu file sebelumnya, ganti `index.html` dengan versi baru lalu tambahkan folder `css/` dan `js/`. Progres pemain lama tetap aman karena kunci penyimpanannya sama.

---

## Cara kerja di balik layar

### Pemeriksa kode

Setiap kali kode berubah (dan saat tombol **Kirim** ditekan), game membuat iframe tersembunyi yang baru, memuat kode pemain di dalamnya, menunggu sebentar agar `fetch()` selesai, lalu menjalankan fungsi `test()` setiap kebutuhan. Setiap pemeriksaan memakai iframe sendiri, jadi pemeriksaan yang tumpang tindih tidak saling mengganggu.

Kebutuhan bisa berjalan dalam tiga putaran (`pass`):

| Pass | Kondisi | Contoh |
|---|---|---|
| `normal` | Halaman seperti dilihat pengunjung | Tombol, formulir, filter |
| `ulang` | Halaman dibuka ulang, `localStorage` berisi apa yang disimpan di putaran normal | "Mode gelap tetap dipakai" |
| `offline` | Semua `fetch()` gagal seperti internet mati | "Muncul pesan Jadwal belum bisa dimuat" |

Selama pemeriksaan, transisi dan animasi CSS dimatikan agar warna yang diukur adalah warna akhir.

### Lingkungan simulasi

Di awal halaman pemain, game menyisipkan skrip kecil yang:

- menangkap error dan promise yang gagal untuk ditampilkan di konsol,
- menonaktifkan `alert`, `confirm`, dan `prompt` agar tidak memblokir,
- mengganti `fetch()` sehingga file yang dikirim klien (misalnya `jadwal.json`) bisa dibaca tanpa server,
- mengganti `localStorage` dengan penyimpanan di memori. Di pratinjau, isinya dipertahankan saat kode diedit, seperti tab browser sungguhan.

Gambar dari klien (`mawar.svg` dan lainnya) disisipkan sebagai data URI saat halaman dimuat, sehingga nama file harus ditulis persis sama.

### Unduhan website

Website yang diunduh dari Portofolio sudah menyertakan gambar dan data dari klien di dalam file, jadi bisa langsung dibuka tanpa server.

### Penyimpanan

Progres disimpan di `localStorage` dengan kunci `codequest-studio-v1`. Isinya: nama pemain, bab dan pesanan aktif, kode tiap bab, riwayat chat, tabungan, dekorasi, jumlah revisi, bab yang sudah tamat, volume, dan pilihan lagu.

---

## Menambah bab atau pesanan

Semua konten ada di array `BAB` di `js/game.js`. Kerangka satu bab:

```js
{
  id: 'contoh', tema: 'malam',               // tema: 'hujan' | 'pagi' | 'malam'
  langit: [[atas, bawah], ...],              // 7 pasang warna langit: 6 untuk progres, 1 saat tamat
  klien: {
    nama: 'Nama', usaha: 'Nama Usaha', huruf: 'N', warna: '#9FA8DA', url: 'contoh.id',
    kirimTeks: 'Sudah saya perbarui. Silakan dicek 🙏',
    revisiBuka: 'Sudah kucek. Tapi ', revisiDaftar: 'masih ada yang kurang:', revisiTutup: 'Aku tunggu ya.'
  },
  file: 'nama-unduhan.html',
  hadiah: { id: 'gitar', teks: 'Kalimat saat hadiah diberikan.' },
  penutup: { judul: 'Proyek selesai', teks: 'Ringkasan di akhir bab.' },
  pembuka: 'Pesan sistem saat bab dimulai.',
  starter: `<!DOCTYPE html> ...`,             // kode awal di editor
  tugas: [ /* daftar pesanan */ ]
}
```

Kerangka satu pesanan:

```js
{
  judul: 'Judul pesanan', bayar: 150000,
  aset: ['jadwal.json'],                     // opsional: file yang dikirim klien
  pesan: ['Baris chat pertama klien', 'Baris kedua', '...'],   // {nama} diganti nama pemain
  reqs: [
    {
      label: 'Teks di checklist',
      ask: 'kalimat klien saat kebutuhan ini belum terpenuhi',
      pass: 'normal',                        // opsional: 'normal' | 'ulang' | 'offline'
      kecuali: 0,                            // opsional: sembunyikan dari revisi jika kebutuhan ke-0 gagal
      test: (document, window, kodeSumber) => true
    }
  ],
  catatan: { teks: 'Penjelasan konsep (boleh HTML)', contoh: 'kode contoh', petunjuk: ['arah', 'kode lengkap'] },
  sukses: ['Balasan klien saat berhasil', '...']
}
```

Tips menulis `test()`:

- Uji **hasil**, bukan teks kode. Contoh: `T.all(d, '.kartu').length >= 3` lebih baik daripada mencari `class="kartu"` di kode.
- Pembantu yang tersedia antara lain `T.text`, `T.all`, `T.aturan` (semua aturan CSS), `T.gambarOk`, `T.tombol`, `T.terangHalaman`, `T.acaraTampil`, `T.cari`, dan `T.skrip`.
- Pakai `kodeSumber` hanya untuk hal yang memang tentang cara menulis kode, misalnya "kartu tidak ditulis manual".

Gambar aset baru ditambahkan di `ASET_SVG`, dan file data di `ASET_TEKS`.

---

## Kompatibilitas

Diuji di Chromium versi terbaru, baik desktop maupun ukuran layar HP. Game memakai fitur browser modern: `<dialog>`, Web Audio API, `ResizeObserver`, `requestSubmit`, dan iframe `srcdoc`. Chrome, Edge, Firefox, dan Safari versi terbaru semuanya mendukung fitur-fitur ini.

Font dimuat dari Google Fonts (Atkinson Hyperlegible, JetBrains Mono, Patrick Hand). Tanpa koneksi internet, game tetap berjalan dengan font cadangan sistem.

---

## Lisensi

Dilisensikan di bawah [MIT License](LICENSE). Bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan belajar maupun mengajar. Silakan sesuaikan materinya untuk kelas atau komunitasmu.
