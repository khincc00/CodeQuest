# ☕ CodeQuest — Studio Kecil

Game santai berbahasa Indonesia tentang menjadi web developer freelance. Kamu duduk di studio kecil, menerima pesanan dari klien lewat chat, lalu menulis HTML, CSS, dan JavaScript sungguhan untuk membangun website mereka. Tidak ada kuis pilihan ganda: yang dinilai adalah website yang benar-benar kamu buat.

**Main sekarang:** https://khincc00.github.io/Code_Quest/

Tersedia dalam **Bahasa Indonesia** dan **English**. Available in Indonesian and English: pick **ID / EN** on the title screen or in Settings.

Dibuat oleh **Taufiq Sholikhin ([@khincc](https://github.com/khincc00))**.

---

## Daftar isi

- [Cara bermain](#cara-bermain)
- [Bahasa (Indonesia / English)](#bahasa-indonesia--english)
- [Isi game](#isi-game)
- [Hidup sebagai freelancer (mulai Bab 4)](#hidup-sebagai-freelancer-mulai-bab-4)
- [Tamat, New Game+, dan playlist rahasia](#tamat-new-game-dan-playlist-rahasia)
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

## Bahasa (Indonesia / English)

Game ini bisa dimainkan dalam Bahasa Indonesia atau Inggris. Pilih **ID / EN** di layar judul, atau **Pengaturan → Bahasa**.

- **Pertama kali dibuka**, bahasa dipilih otomatis: Indonesia untuk pemain di zona waktu Indonesia atau browser berbahasa Indonesia, Inggris untuk yang lain. Simpanan lama tetap berbahasa Indonesia.
- **Ganti bahasa kapan saja**, tanpa memuat ulang. Semua teks langsung berubah: studio, chat klien (termasuk riwayat chat yang sudah ada), checklist, buku catatan, dialog cerita, toko, pengaturan, ringkasan bab, dan ending.
- **Kode awal** di editor ikut berganti bahasa selama belum kamu ubah. Kode yang sudah kamu tulis tidak pernah diubah.
- **Pemeriksa kode menerima kedua bahasa.** Contohnya, tombol "Pesan Sekarang" atau "Order now" sama-sama lolos, begitu juga "Terima kasih" atau "Thank you".
- Dalam versi Inggris, id, class, nama fungsi, dan data klien (misalnya `jadwal.json`) tetap berbahasa Indonesia, karena klien-kliennya usaha di Indonesia. Klien menjelaskan artinya saat pertama kali menyebutnya.

Teks Inggris untuk bab-bab ada di `js/lang-en.js`, dengan bentuk yang sama seperti data `BAB` di `js/game.js`. Teks antarmuka memakai fungsi `L('teks Indonesia', 'English text')` di `js/game.js`.

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

### Bab 4: Laundry Kilat — logika perhitungan dan validasi input

Klien: **Pak Dedi**, pemilik laundry di depan kos-kosan yang capek mencatat kiloan di buku tulis.

| Pesanan | Yang dipelajari |
|---|---|
| Formulir nota | `<input type="number">`, radio dalam satu grup, `value` |
| Tombol yang menghitung | `onclick`, `function`, `Number()`, `:checked`, `innerText` |
| Format rupiah | `toLocaleString("id-ID")` / `Intl.NumberFormat` |
| Setengah kilo dan angka aneh | validasi input, `return` lebih awal, `Math.max`, `step="0.5"` |
| Antar-jemput dan langganan | checkbox `.checked`, urutan diskon dan ongkos, ternary, `Math.round` |
| Nota ala struk | `border: dashed`, font monospace, `max-width`, gambar dari klien |

### Bab 5: Karang Taruna RT 05 — tabel data, embed, dan tanggal

Klien: **Kak Riko**, ketua Karang Taruna yang menyiapkan Gebyar 17-an. Di dunia game, hari ini tanggal 10 Agustus 2026.

| Pesanan | Yang dipelajari |
|---|---|
| Kerangka tabel | `<table>`, `<thead>`, `<tbody>`, `colspan` |
| Isi tabel dari data | `fetch` + `createElement("tr")` + `appendChild` |
| Enak dibaca di HP | `overflow-x: auto`, `:nth-child(even)`, `position: sticky` |
| Video lomba tahun lalu | `<iframe>` embed YouTube, `aspect-ratio: 16 / 9`, `title` |
| Kolom hadiah dadakan | refactor tabel saat data berubah (`colspan` 4 → 5) |
| Hitung mundur dan juara | `new Date()`, bulan mulai dari 0, selisih hari, `Math.ceil` |

### Bab 6: Si Peniru — debugging dan penyimpanan

Klien: **Mas Alif**, pemilik warung kopi baru yang menyalin website Warung Kopi Senja. Dia tidak bisa membayar, tapi kamu pulang dengan keahlian debugging dan sebuah file misterius.

| Pesanan | Yang dipelajari |
|---|---|
| Cari error di konsol | membaca pesan error, id yang tidak cocok, DevTools Console |
| Simpan sebagai JSON | `JSON.stringify`, tab Application di DevTools |
| Baca lagi saat dibuka | `JSON.parse`, `getItem` yang bisa `null` |
| Kunci yang bentrok | localStorage dibagi per domain, kunci unik berversi |
| Cek Keaslian | normalisasi teks: `toLowerCase`, `replace(/\s+/g, " ")`, `trim` |
| File yang muncul sendiri | `console.log(JSON.stringify(data, null, 2))` |

### Bab 7: Portal Sengata.id — portal warga yang tahan banting

Klien: **Pak Lurah Hendra**. Proyek paling besar sejauh ini, dan pemicu retakan multiverse.

| Pesanan | Yang dipelajari |
|---|---|
| Daftar pengaduan | `sort()` dengan fungsi pembanding, tanggal ISO |
| Formulir lapor warga | label, `inputmode="numeric"` untuk nomor yang bukan bilangan |
| Validasi KTP | regex `/^\d{16}$/`, `unshift`, `preventDefault` |
| Laporan prioritas | menghitung kata dengan `split(/\s+/)`, `if/else` |
| Simpan draft | event `input`, `setItem` / `getItem` / `removeItem` |
| Kirim ke server kelurahan | `fetch` POST dengan `JSON.stringify`, `response.ok` vs `catch` |

### Bab 8: Timeline Gagal — refactoring

Klien: **kamu sendiri, dari Timeline B**, dua minggu lebih tua. Di timeline itu Warung Kopi Senja tutup karena kodenya dibiarkan kusut. Seluruh dunia berwarna abu-abu, dan warnanya kembali sedikit demi sedikit setiap kali kodenya dirapikan. Tidak ada bayaran di timeline ini.

| Pesanan | Yang dipelajari |
|---|---|
| Satu fungsi hitung | DRY, fungsi dengan parameter, `return` |
| Satu fungsi untuk semua tombol | `this`, `closest()`, atribut `data-*`, `dataset` |
| Pajak naik | konstanta `const PAJAK`, menghindari *magic number* |
| Pisahkan hitung dan tampil | satu fungsi satu tugas, `Math.round`, fungsi `formatRupiah` |
| Komentar untuk diri sendiri | JSDoc `/** @param @returns */`, komentar `// TODO:` |
| Hitung semua | `querySelectorAll`, `Array.from`, `reduce` |

### Bab 9: Timeline Sukses — performa web

Klien: **kamu sendiri, dari Timeline Sukses**, pemilik tiga cabang Warung Kopi Senja yang website franchise-nya lemot. Konsol menampilkan skor performa tiruan Lighthouse yang naik setiap pesanan selesai.

| Pesanan | Yang dipelajari |
|---|---|
| Kompres gambar | ukuran file, format WebP, batas 200 KB per gambar |
| Lazy loading | `loading="lazy"`, `fetchpriority="high"` untuk gambar hero (LCP) |
| Ukuran gambar | atribut `width` / `height`, layout shift (CLS), `height: auto` |
| CSS yang tidak terpakai | mencari selektor yang tidak dipakai, panel Coverage |
| Skrip yang menahan halaman | skrip render-blocking di `<head>`, memindahkan skrip ke akhir `<body>` |
| Lolos audit | `<meta name="description">`, `alt` yang jelas, skor minimal 85 |

### Bab 10: The Origin — studio sendiri

Klien: **dirimu sendiri**, di timeline-mu sendiri. Berbekal blueprint dari flashdisk, kamu membangun portofolio bebas dengan isi dan gayamu sendiri, lalu mempublikasikannya.

| Pesanan | Yang dipelajari |
|---|---|
| Hero | bagian pembuka yang jelas: `<h1>` dan satu kalimat |
| Karya | kartu proyek dengan `class`, menulis apa yang dipelajari |
| Kontak | tautan `mailto:` dan `https://wa.me/62…` |
| Satu sentuhan JavaScript | interaksi bebas, misalnya `classList.toggle` |
| Rapi di HP, dan ceritamu | `meta viewport`, `@media` / `flex-wrap` / grid `auto-fit`, cerita pribadi |
| Publish | cek akhir sebelum deploy, lalu tombol **Publish ke internet** |

Setiap bab yang selesai memberi hadiah dari klien: foto warung berbingkai, vas bunga, gitar tua, nota "LUNAS", stiker 17-an, plakat kelurahan, Kacamata Anti-Spaghetti, flashdisk emas, dan akhirnya papan nama studiomu sendiri.

---

## Hidup sebagai freelancer (mulai Bab 4)

- **Reputasi bintang (1–5).** Mulai dari 3 bintang. Bayaran setiap pesanan dikali sesuai reputasi: ×0,6, ×0,8, ×1, ×1,15, atau ×1,3. Reputasi berubah di akhir bab, dan turun satu bintang tambahan kalau jumlah revisi lebih banyak dari jumlah pesanan.
- **Tagihan kos.** Rp400.000 ditagih di awal setiap bab mulai Bab 4. Kalau tabungan tidak cukup, kamu pulang sebentar ke warung Ibu. Ibu menalangi kekurangannya, dan setengah dari bayaran berikutnya otomatis dipakai mencicil sampai lunas. Progres tidak pernah hilang.
- **Kecoa bug.** Sesekali seekor kecoa lewat di ruang kerja. Tangkap untuk mendapat petunjuk, walaupun kadang dia cuma bikin kaget. Ada kejutan setelah kecoa kelima.
- **Lore di konsol.** Mulai Bab 6, buka DevTools browsermu (F12). Ada pesan yang tidak ditulis untuk klien.
- **Upgrade laptop** (item toko): tag penutup HTML ditulis otomatis saat kamu mengetik `>`.
- **Kacamata Anti-Spaghetti** (hadiah Bab 8): konsol memberi tahu kalau kodemu punya banyak baris yang hampir kembar.
- Status freelancer (reputasi, utang, kecoa, keahlian) bisa dilihat di **Pengaturan**.

---

## Tamat, New Game+, dan playlist rahasia

Setelah situs di Bab 10 dipublikasikan, situsmu tampil online dengan kolom testimoni dari semua klien, dari Bu Sari sampai dirimu sendiri di dua timeline lain. Hujan reda, studio disinari matahari pagi, dan papan nama studiomu terpasang di dinding: **Studio Kecil Berdiri · Warung Tetap Buka**.

Setelah tamat, dua hal terbuka:

- **Mode Freelance Beneran (New Game+)**, dari layar judul atau Pengaturan. Semua bab diulang dari Bab 1 dengan reputasi dan kecoa sejak awal, kos Rp250.000 di setiap bab yang sebelumnya tanpa kos, dan bayaran naik 25% per putaran. Nama, tabungan, dekorasi, reputasi, dan keahlian ikut terbawa.
- **Playlist lofi rahasia**, di Pengaturan → Lagu. Semua tema musik diputar bergantian setiap 45 detik, termasuk lagu penutup "Warung tetap buka".

Situs portofolio dari Bab 10 bisa diunduh dari Portofolio, lengkap dengan testimoni klien.

---

## Suasana dan musik tiap bab

Setiap bab punya suasana dan tema musik sendiri. Semua suara dibuat langsung di browser dengan Web Audio API, tanpa file audio.

| Bab | Suasana studio | Musik | Suara sekitar |
|---|---|---|---|
| 1. Warung Kopi Senja | Sore hujan yang pelan-pelan menjadi malam | Piano lo-fi dan lonceng pentatonik, 72 bpm | Hujan dan derau piringan hitam |
| 2. Toko Bunga Laras | Pagi cerah: matahari, awan, burung lewat | Arpeggio petik di atas pad lembut, 92 bpm | Kicau burung dan angin |
| 3. Ruang Nada | Malam berbintang dengan bulan dan lampu kota, berakhir fajar | Akor jazz electric piano, bass berjalan, sapuan brush, 58 bpm | Jangkrik dan dengung kota |
| 4. Laundry Kilat | Siang terik dengan jemuran di luar jendela | Gitar bossa santai dan shaker, 100 bpm | Mesin cuci berputar dan kipas angin |
| 5. Karang Taruna RT 05 | Sore meriah dengan bendera merah putih dan kembang api kecil | Kendang, kentongan, dan bonang, 112 bpm | Keramaian warga dan sorakan |
| 6. Si Peniru | Mendung kelabu dengan kabut dan gerimis | Kotak musik bernada minor di atas dengung rendah, 66 bpm | Gerimis dan detak jam dinding |
| 7. Portal Sengata.id | Badai dengan awan gelap dan kilat | Arpeggio synth dan pad, 84 bpm; setelah glitch, nadanya tersendat dan sumbang | Hujan deras dan guntur jauh |
| 8. Timeline Gagal | Semua abu-abu, lalu warnanya kembali setiap pesanan selesai | Piano yang terdengar diputar mundur di atas pad rendah, 56 bpm | Hujan deras dan jam yang berdetak lambat |
| 9. Timeline Sukses | Malam gemerlap, papan iklan "Warung Kopi Senja · 3 Cabang" | City pop: electric piano, bass sinkopasi, kick dan hi-hat, 104 bpm | Dengung kota dan keramaian |
| 10. The Origin | Gerimis terakhir, lalu fajar setelah publish | Reprise tema Bab 1 dengan melodi lonceng, 70 bpm; setelah tamat menjadi "Warung tetap buka", 76 bpm | Gerimis; setelah tamat, angin pagi dan kicau burung |

Langit di jendela berubah seiring pesanan yang selesai. Saat bab berganti, suara sekitar memudar perlahan ke tema baru. Pemutar piringan hitam (item toko) membuka lagu alternatif yang bisa dipilih di Pengaturan. Volume musik, suasana, dan efek bisa diatur terpisah.

---

## Fitur

- **Kode pemain benar-benar dijalankan.** Pemeriksaan membaca hasil halamannya (DOM, style yang dihitung browser, simulasi klik, pengisian formulir, pengetikan), bukan mencocokkan teks.
- **Pemeriksaan bertahap.** Beberapa kebutuhan diuji dalam kondisi berbeda: halaman dibuka ulang (untuk `localStorage`) dan halaman tanpa internet (untuk `try/catch`). Tes juga bisa menunggu `fetch` selesai, mengirim formulir berkali-kali, dan membaca konsol.
- **Konsol yang hidup.** Error dan `console.log` dari halaman pemain tampil di konsol di bawah editor.
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
│   ├── lang-en.js   # Teks bahasa Inggris untuk semua bab (dimuat sebelum game.js)
│   └── game.js      # Logika game: data bab, state, pemeriksa kode, audio, adegan studio
├── README.md        # Dokumentasi ini
├── LICENSE          # Lisensi MIT
└── .gitignore
```

File dipisah mengikuti praktik standar proyek web (separation of concerns): `index.html` untuk struktur, `css/style.css` untuk tampilan, `js/game.js` untuk logika, dan `js/lang-en.js` untuk terjemahan Inggris.

**`index.html`** berisi adegan studio dalam SVG (jendela, meja, laptop, dekorasi, lapisan hujan/pagi/malam), layar judul, studio, ruang kerja (chat, editor, pratinjau), dan semua dialog.

**`css/style.css`** berisi token warna dan font di `:root`, layout ruang kerja tiga kolom yang berubah menjadi tab di layar kecil, gaya dialog, serta animasi adegan (hujan, uap teh, awan, burung, bintang berkelip).

**`js/game.js`** tersusun dalam bagian-bagian berikut:

| Bagian | Isi |
|---|---|
| Pembantu pemeriksa (`T`) | Fungsi untuk menguji halaman pemain: teks, CSS, gambar, formulir, mode gelap, pencarian, kalkulator laundry, tabel, formulir laporan, kasir Timeline B, skor performa, portofolio |
| Aset dari klien | Gambar SVG (`ASET_SVG`), ukuran file (`ASET_UKURAN`), dan file data (`ASET_TEKS`, misalnya `jadwal.json`) |
| Data bab (`BAB`) | Klien, kode awal, tema, langit, hadiah, dan daftar pesanan tiap bab |
| Toko & suasana | Item dekorasi (`ITEMS`) dan warna ruangan per tema (`SUASANA`) |
| Sistem freelancer | Reputasi dan pengali bayaran, tagihan kos, adegan warung Ibu, kecoa, lore konsol, glitch portal |
| Tamat & New Game+ | Flashdisk, publish, testimoni, kredit, Mode Freelance Beneran |
| State & penyimpanan | Struktur simpanan, migrasi versi lama, simpan ke `localStorage` |
| Audio | Tema musik (`TEMA_MUSIK`), instrumen sintetis, suara sekitar, sequencer |
| Adegan studio | Langit, lapisan suasana, dekorasi, jam dinding |
| Layar & reset | Perpindahan layar, dialog konfirmasi, mulai dari awal |
| Ruang kerja | Chat klien, checklist, editor, pratinjau, pemeriksa bertahap |
| Dialog & inisialisasi | Buku catatan, toko, pengaturan, portofolio, unduhan, pergantian bahasa |
| Bahasa | `L(id, en)`, penggabungan teks `BAB_EN`, chat yang disimpan sebagai referensi agar bisa ditampilkan ulang dalam bahasa lain |

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
git commit -m "CodeQuest: pilihan bahasa Inggris (ID / EN)"
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
- mengganti `localStorage` dengan penyimpanan di memori. Di pratinjau, isinya dipertahankan saat kode diedit, seperti tab browser sungguhan. Sebuah pesanan bisa mengisi penyimpanan awal (misalnya data Bu Sari di Bab 6),
- menyediakan API palsu per bab untuk permintaan POST (misalnya `api/lapor`, yang sengaja menjawab error 500 pada permintaan ketujuh),
- merekam `console.log`, `warn`, dan `error` untuk ditampilkan di konsol game,
- membekukan tanggal "hari ini" sesuai cerita (Bab 5: 10 Agustus 2026),
- mengganti video YouTube dengan tampilan pengganti, supaya tidak ada permintaan jaringan saat bermain.

Gambar dari klien (`mawar.svg`, `hero.webp`, dan lainnya) disisipkan sebagai data URI saat halaman dimuat, sehingga nama file harus ditulis persis sama. Di Bab 9, ukuran file setiap gambar diambil dari `ASET_UKURAN` untuk menghitung skor performa.

### Unduhan website

Website yang diunduh dari Portofolio sudah menyertakan gambar dan data dari klien di dalam file, jadi bisa langsung dibuka tanpa server.

### Penyimpanan

Progres disimpan di `localStorage` dengan kunci `codequest-studio-v1`. Isinya: nama pemain, bab dan pesanan aktif, kode tiap bab, riwayat chat, tabungan, dekorasi, jumlah revisi, bab yang sudah tamat, volume, dan pilihan lagu. Mulai Bab 4 juga: reputasi, utang ke Ibu, rincian bayaran, kos yang sudah dibayar, keahlian, jumlah kecoa, pilihan soal `timeline_b.json`, dan status retakan multiverse.

Setelah Bab 7, game juga menulis kunci `MULTIVERSE_UNLOCKED = true` yang bisa kamu temukan sendiri di DevTools, tab Application. **Mulai dari awal** dan **Mode Freelance Beneran** menghapusnya.

---

## Menambah bab atau pesanan

Semua konten ada di array `BAB` di `js/game.js`. Kerangka satu bab:

```js
{
  id: 'contoh', tema: 'malam',               // tema: kunci di SUASANA dan TEMA_MUSIK, misalnya 'hujan', 'pagi', 'malam'
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
  // opsional, mulai Bab 4:
  sewa: 400000,                              // tagihan kos di awal bab
  reputasi: { plus: 1, minus: 0, alasan: '' }, // perubahan bintang di akhir bab
  keahlian: 'Debugging Lv 1',                // keahlian yang didapat
  unlock: ['Yang terbuka setelah bab ini'],
  waktu: [2026, 7, 10, 9, 0],                // tanggal "hari ini" di halaman pemain
  api: { 'api/lapor': { metode: 'POST', gagalKe: 7 } }, // API palsu
  pengantar: 'Teks di akhir bab sebelumnya yang memperkenalkan bab ini.',
  bisikan: 'Teks di studio saat bab ini siap dimulai.',
  tanpaKos: true, tanpaPengali: true,        // tanpa kos di New Game+, bayaran tanpa pengali reputasi
  asetAwal: ['foto-hd.jpg'],                 // file yang sudah dipakai kode awal (tidak tampil di daftar file)
  laporan: (document, window, kodeSumber) => ['baris info di konsol'],
  akhir: true,                               // bab terakhir: memutar ending, bukan ringkasan bab
  starter: `<!DOCTYPE html> ...`,             // kode awal di editor
  tugas: [ /* daftar pesanan */ ]
}
```

Kerangka satu pesanan:

```js
{
  judul: 'Judul pesanan', bayar: 150000,
  aset: ['jadwal.json'],                     // opsional: file yang dikirim klien
  seed: { kunci: 'nilai' },                  // opsional: isi localStorage saat halaman dibuka
  pilihan: 'timeline_b', setelah: 'fotoTimeline', glitch: true, // opsional: momen cerita khusus
  tombol: 'Publish ke internet', kirimTeks: 'Publish.',          // opsional: label tombol kirim dan teks chat
  pesan: ['Baris chat pertama klien', 'Baris kedua', '...'],   // {nama} diganti nama pemain
  reqs: [
    {
      label: 'Teks di checklist',
      ask: 'kalimat klien saat kebutuhan ini belum terpenuhi',
      pass: 'normal',                        // opsional: 'normal' | 'ulang' | 'offline'
      // test boleh async (mengembalikan Promise), batas waktunya 5 detik
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
- Untuk membaca fungsi atau `const` milik pemain, pakai `T.global(window, 'nama')` atau `T.fungsi(window, 'nama')`.
- Pembantu yang tersedia antara lain `T.text`, `T.all`, `T.aturan` (semua aturan CSS), `T.gambarOk`, `T.tombol`, `T.terangHalaman`, `T.acaraTampil`, `T.cari`, `T.skrip`, `T.laundry`, `T.nilaiRupiah`, `T.kolomTabel`, `T.kasirBenar`, `T.tidakTerpakai`, `T.skorPerforma`, `T.interaksi`, `T.responsif`, `T.lapor`, dan `T.tujuhLaporan`.
- Log konsol halaman pemain ada di `window.__logs`, permintaan `fetch` di `window.__req`, dan isi localStorage di `window.__mem`.
- Pakai `kodeSumber` hanya untuk hal yang memang tentang cara menulis kode, misalnya "kartu tidak ditulis manual".

Gambar aset baru ditambahkan di `ASET_SVG`, dan file data di `ASET_TEKS`.

Untuk versi Inggris, tambahkan teks bab baru di `js/lang-en.js` sebagai `CQ_BAB_EN[<indeks>] = { ... }`, dengan kunci yang sama dan jumlah baris `pesan`, `reqs`, `petunjuk`, dan `sukses` yang sama seperti versi Indonesianya. Kalau sebuah `test()` memeriksa teks yang ditulis pemain, terima kedua bahasa dengan `T.ada(teks, 'frasa indonesia', 'english phrase')` atau `T.tombol(d, 'kata', 'word')`.

---

## Kompatibilitas

Diuji di Chromium versi terbaru, baik desktop maupun ukuran layar HP. Game memakai fitur browser modern: `<dialog>`, Web Audio API, `ResizeObserver`, `requestSubmit`, dan iframe `srcdoc`. Chrome, Edge, Firefox, dan Safari versi terbaru semuanya mendukung fitur-fitur ini.

Font dimuat dari Google Fonts (Atkinson Hyperlegible, JetBrains Mono, Patrick Hand). Tanpa koneksi internet, game tetap berjalan dengan font cadangan sistem.

---

## Lisensi

Dilisensikan di bawah [MIT License](LICENSE). Bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan belajar maupun mengajar. Silakan sesuaikan materinya untuk kelas atau komunitasmu.

