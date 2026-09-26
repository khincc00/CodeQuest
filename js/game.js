/* =========================================================
   CodeQuest — Studio Kecil
   Logika game: data bab, state, pemeriksa kode, audio, adegan studio

   Bab 1: Warung Kopi Senja  (HTML dan CSS dasar, sedikit JS)
   Bab 2: Toko Bunga Laras   (semantik, flexbox, formulir, array)
   Bab 3: Ruang Nada         (variabel CSS, localStorage, fetch,
                              async/await, try/catch, filter, pencarian)

   Susunan file ini:
     1. Pembantu pemeriksa (T)       6. Audio (tema per bab)
     2. Aset dari klien              7. Adegan studio
     3. Data bab (BAB)               8. Layar & reset
     4. Toko & dekorasi              9. Ruang kerja: chat, editor, pemeriksa
     5. State & penyimpanan         10. Dialog & inisialisasi
   ========================================================= */

const SIMPAN_KEY = 'codequest-studio-v1';

/* ---------- helpers for checks ---------- */
const T = {
  text: el => (el ? el.textContent : '').replace(/\s+/g, ' ').trim().toLowerCase(),
  all: (root, sel) => Array.from(root.querySelectorAll(sel)),
  aturan(doc) {
    const out = [];
    const jalan = list => { for (const r of Array.from(list)) { if (r.selectorText) out.push(r); if (r.cssRules) jalan(r.cssRules); } };
    for (const sheet of Array.from(doc.styleSheets)) { try { jalan(sheet.cssRules); } catch (e) {} }
    return out;
  },
  cssHas(doc, selRe, prop) { return T.aturan(doc).some(r => selRe.test(r.selectorText) && r.style.getPropertyValue(prop)); },
  adaRule(doc, fn) { return T.aturan(doc).some(r => fn(r.selectorText) && r.style.length > 0); },
  kosong: c => c === 'rgba(0, 0, 0, 0)' || c === 'transparent' || c === 'rgb(255, 255, 255)',
  px: v => parseFloat(v) || 0,
  gambarOk: img => img.complete && img.naturalWidth > 0,
  inputNama(d) { const f = d.querySelector('form'); return f && f.querySelector('input:not([type]), input[type="text"]'); },
  punyaLabel(d, inp) {
    if (!inp) return false;
    const lab = (inp.id && d.querySelector(`label[for="${inp.id}"]`)) || inp.closest('label');
    return !!lab && T.text(lab).length > 0;
  },
  kirimForm(d, w) {
    if (w.__hasilKirim !== undefined) return w.__hasilKirim;
    w.__hasilKirim = false;
    const f = d.querySelector('form'), inp = T.inputNama(d);
    if (!f || !inp) return false;
    if (d.body.innerText.toLowerCase().includes('rani')) return false;
    inp.value = 'Rani';
    T.all(f, '[required]').forEach(el => {
      if (el === inp) return;
      if (el.tagName === 'SELECT') { if (!el.value) el.selectedIndex = el.options.length - 1; }
      else if (!el.value) el.value = el.type === 'email' ? 'rani@contoh.id' : el.type === 'number' ? '1' : 'Selamat ulang tahun';
    });
    if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    const t = d.body.innerText.toLowerCase();
    return (w.__hasilKirim = t.includes('terima kasih') && t.includes('rani'));
  },
  skrip: d => T.all(d, 'script:not([data-cq])').map(s => s.textContent).join('\n'),
  /* ---- Bab 3 helpers ---- */
  terang(c) {
    const m = String(c).match(/[\d.]+/g);
    if (!m) return 1;
    const [r, g, b, a] = m.map(Number);
    if (a === 0) return null;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  },
  terangHalaman(d, w) {
    for (const el of [d.body, d.documentElement]) {
      const v = T.terang(w.getComputedStyle(el).backgroundColor);
      if (v !== null) return v;
    }
    return 1;
  },
  terlihat: (el, w) => el.isConnected && el.getClientRects().length > 0 && w.getComputedStyle(el).visibility !== 'hidden',
  acaraTampil: (d, w) => T.all(d, '.acara').filter(el => T.terlihat(el, w)),
  tombol(d, kata) {
    const b = T.all(d, 'button');
    return b.find(x => T.text(x) === kata) || b.find(x => T.text(x).includes(kata));
  },
  tombolMode: d => T.tombol(d, 'mode gelap') || T.tombol(d, 'gelap') || T.tombol(d, 'mode'),
  jumlahVariabel(r) { let n = 0; for (let i = 0; i < r.style.length; i++) if (r.style[i].startsWith('--')) n++; return n; },
  modeGelap(d, w) {
    if (w.__mode) return w.__mode;
    const b = T.tombolMode(d), m = { ada: !!b, awal: T.terangHalaman(d, w) };
    if (b) { b.click(); m.satu = T.terangHalaman(d, w); b.click(); m.dua = T.terangHalaman(d, w); }
    return (w.__mode = m);
  },
  simpanMode(d, w) {
    if (w.__simpan) return w.__simpan;
    const b = T.tombolMode(d), m = { ada: !!b, sebelum: Object.keys(w.__mem || {}).length };
    if (b) { b.click(); m.sesudah = Object.keys(w.__mem || {}).length; m.terang = T.terangHalaman(d, w); w.__snapshot = JSON.parse(JSON.stringify(w.__mem || {})); }
    return (w.__simpan = m);
  },
  cari(d, w, kata) {
    const i = d.querySelector('input[type="search"]');
    if (!i) return null;
    i.value = kata;
    i.dispatchEvent(new w.Event('input', { bubbles: true }));
    return T.acaraTampil(d, w);
  },
  kartuLengkap: k => !!k.querySelector('h3') && T.text(k).includes('rp') && !!k.querySelector('img') && T.all(k, 'img').every(T.gambarOk)
};

/* ---------- client assets (images sent by the client) ---------- */
const petal = (n, cx, cy, rx, ry, dy, fill, extra = '') =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${cy - dy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra} transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`).join('');
const ASET_SVG = {
  'mawar.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#F7DCD6"/><path d="M120 176 V96" stroke="#5E8C5A" stroke-width="6"/><path d="M120 138 q-28 -4 -38 -26 q26 0 38 20z" fill="#6E9C66"/><path d="M120 124 q28 -8 38 -30 q-26 4 -38 24z" fill="#6E9C66"/><circle cx="120" cy="70" r="36" fill="#C8434F"/><path d="M92 68 q28 -34 56 0 q-28 18 -56 0z" fill="#A92F3C"/><path d="M104 72 q16 -20 32 0 q-16 12 -32 0z" fill="#E0616B"/><path d="M112 70 q8 -10 16 0" stroke="#A92F3C" stroke-width="3" fill="none"/></svg>`,
  'tulip.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#FBEBC4"/><path d="M120 176 V100" stroke="#5E8C5A" stroke-width="6"/><path d="M118 170 q-40 -20 -40 -66 q30 22 40 58z" fill="#6E9C66"/><path d="M122 164 q34 -18 38 -56 q-28 18 -38 48z" fill="#7FAE72"/><path d="M88 46 L104 70 L120 38 L136 70 L152 46 L150 90 Q120 118 90 90 Z" fill="#F2B632"/><path d="M104 70 L120 38 L136 70 Q120 100 104 70Z" fill="#E09A1E"/></svg>`,
  'matahari.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#DDEBD4"/><path d="M120 176 V110" stroke="#5E8C5A" stroke-width="7"/><path d="M120 150 q-30 -2 -42 -22 q28 -2 42 16z" fill="#6E9C66"/>${petal(14, 120, 72, 9, 20, 34, '#F4C430')}<circle cx="120" cy="72" r="24" fill="#6B4423"/><circle cx="120" cy="72" r="14" fill="#553418"/></svg>`,
  'lili.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#DCE3EE"/><path d="M120 176 V104" stroke="#5E8C5A" stroke-width="6"/><path d="M120 150 q30 -6 40 -30 q-28 4 -40 24z" fill="#6E9C66"/>${petal(6, 120, 74, 11, 30, 30, '#FFFFFF', 'stroke="#C9D0DE" stroke-width="1.5"')}<g stroke="#8AA27E" stroke-width="2"><line x1="120" y1="74" x2="110" y2="54"/><line x1="120" y1="74" x2="130" y2="54"/><line x1="120" y1="74" x2="120" y2="50"/></g><g fill="#E0A13A"><circle cx="110" cy="53" r="3.5"/><circle cx="130" cy="53" r="3.5"/><circle cx="120" cy="49" r="3.5"/></g></svg>`
};
const JADWAL = [
  { hari: 'Senin', tanggal: '6 Okt', musisi: 'Trio Senja', genre: 'Jazz', jam: '20.00' },
  { hari: 'Selasa', tanggal: '7 Okt', musisi: 'Rara & Gitar Tua', genre: 'Akustik', jam: '19.30' },
  { hari: 'Rabu', tanggal: '8 Okt', musisi: 'Kopi Hitam Band', genre: 'Pop', jam: '20.00' },
  { hari: 'Kamis', tanggal: '9 Okt', musisi: 'Nadia Kirana', genre: 'Jazz', jam: '20.30' },
  { hari: 'Jumat', tanggal: '10 Okt', musisi: 'Dua Pagi', genre: 'Akustik', jam: '19.00' },
  { hari: 'Sabtu', tanggal: '11 Okt', musisi: 'Layang Kota', genre: 'Pop', jam: '21.00' }
];
/* Text files the client sends. The page reads them with fetch(), which the game simulates. */
const ASET_TEKS = { 'jadwal.json': JSON.stringify(JADWAL, null, 2) };
const ASET_URI = {};
for (const k in ASET_SVG) ASET_URI[k] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ASET_SVG[k]);

/* =========================================================
   CHAPTERS
   ========================================================= */
const BAB = [
{
  id: 'senja', tema: 'hujan',
  langit: [['#E9A97C', '#F3D1A0'], ['#C9738A', '#F0A97C'], ['#6E5C8F', '#C9869A'], ['#3A4570', '#6E6A98'], ['#242C4D', '#3E4677'], ['#1C2340', '#2E3760'], ['#9FB8CF', '#F2CFA6']],
  klien: {
    nama: 'Bu Sari', usaha: 'Warung Kopi Senja', huruf: 'S', warna: '#D08C8C', url: 'warungkopisenja.id',
    kirimTeks: 'Sudah saya perbarui, Bu. Silakan dicek 🙏',
    revisiBuka: 'Sudah saya lihat ya. Tapi ', revisiDaftar: 'masih ada yang kurang:', revisiTutup: 'Tolong dicek lagi ya. Nggak buru-buru kok ☕'
  },
  file: 'warung-kopi-senja.html',
  hadiah: { id: 'bingkai', teks: 'Bu Sari juga mengirim foto warungnya dalam bingkai kecil. Sudah dipajang di mejamu.' },
  penutup: {
    judul: 'Proyek pertama selesai',
    teks: 'Website Warung Kopi Senja sudah kamu bangun sendiri, dari halaman kosong sampai siap dibuka di HP pelanggan.'
  },
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Warung Kopi Senja</title>
</head>
<body>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Papan nama warung', bayar: 50000,
    pesan: [
      'Selamat sore, {nama}! Saya Sari, yang punya Warung Kopi Senja 😊',
      'Anak saya bilang warung sekarang harus punya website. Saya nggak ngerti soal beginian, jadi saya serahkan ke kamu ya.',
      'Untuk awal, cukup nama warungnya ditulis besar: Warung Kopi Senja.\nDi bawahnya tulis jam buka kami, 07.00 sampai 22.00.'
    ],
    reqs: [
      { label: 'Judul besar: Warung Kopi Senja', ask: 'nama warungnya belum ada sebagai judul besar',
        test: d => T.all(d, 'h1').some(h => T.text(h).includes('warung kopi senja')) },
      { label: 'Cukup satu judul besar di halaman', ask: 'judul besarnya kok ada lebih dari satu', kecuali: 0,
        test: d => T.all(d, 'h1').length === 1 },
      { label: 'Paragraf jam buka 07.00 sampai 22.00', ask: 'jam bukanya (07.00 sampai 22.00) belum kelihatan',
        test: d => T.all(d, 'p').some(p => T.text(p).includes('07.00') && T.text(p).includes('22.00')) }
    ],
    catatan: {
      teks: 'Semua yang tampil di halaman ditulis di dalam <code>&lt;body&gt;</code>. Judul utama memakai <code>&lt;h1&gt;</code> dan cukup dipakai sekali per halaman, karena mesin pencari membacanya sebagai judul terpenting. Kalimat biasa ditulis dengan <code>&lt;p&gt;</code> (paragraf). Setiap tag dibuka lalu ditutup dengan garis miring.',
      contoh: '<body>\n  <h1>Toko Roti Pagi</h1>\n  <p>Buka setiap hari.</p>\n</body>',
      petunjuk: ['Taruh kedua baris di antara <body> dan </body>.', '<h1>Warung Kopi Senja</h1>\n<p>Buka setiap hari, 07.00 - 22.00</p>']
    },
    sukses: ['Wah, sudah ada namanya! Saya tunjukkan ke suami, dia senyum-senyum sendiri 😄', 'Saya transfer dulu ya sebagai DP.']
  },
  {
    judul: 'Daftar menu', bayar: 75000,
    pesan: [
      'Sekarang menunya dong. Kasih judul kecil "Menu", terus daftarnya begini:',
      'Kopi Tubruk – Rp8.000\nEs Kopi Susu – Rp15.000\nTeh Tarik – Rp10.000\nPisang Goreng – Rp12.000',
      'Harganya jangan lupa ya, pelanggan saya suka tanya harga dulu 😅'
    ],
    reqs: [
      { label: 'Judul kecil bertuliskan Menu', ask: 'judul kecil "Menu"-nya belum ada',
        test: d => T.all(d, 'h2').some(h => T.text(h).includes('menu')) },
      { label: 'Empat menu dalam bentuk daftar', ask: 'menunya belum tersusun jadi daftar berisi empat item',
        test: d => T.all(d, 'ul > li, ol > li').length >= 4 },
      { label: 'Ada Kopi Tubruk dan Pisang Goreng', ask: 'Kopi Tubruk atau Pisang Goreng-nya belum ada',
        test: d => { const t = T.all(d, 'li').map(T.text); return t.some(x => x.includes('tubruk')) && t.some(x => x.includes('pisang')); } },
      { label: 'Setiap menu ada harganya (Rp)', ask: 'masih ada menu yang belum ada harganya',
        test: d => { const li = T.all(d, 'ul > li, ol > li'); return li.length > 0 && li.every(x => T.text(x).includes('rp')); } }
    ],
    catatan: {
      teks: 'Judul bagian memakai <code>&lt;h2&gt;</code>, satu tingkat di bawah <code>&lt;h1&gt;</code>. Daftar tanpa nomor ditulis dengan <code>&lt;ul&gt;</code> (unordered list), dan setiap barisnya dibungkus <code>&lt;li&gt;</code> (list item). Kalau urutan penting, pakai <code>&lt;ol&gt;</code>.',
      contoh: '<h2>Roti</h2>\n<ul>\n  <li>Roti Tawar – Rp12.000</li>\n  <li>Roti Cokelat – Rp9.000</li>\n</ul>',
      petunjuk: ['Tulis di bawah paragraf jam buka. Satu <li> untuk satu menu.', '<h2>Menu</h2>\n<ul>\n  <li>Kopi Tubruk – Rp8.000</li>\n  <li>Es Kopi Susu – Rp15.000</li>\n  <li>Teh Tarik – Rp10.000</li>\n  <li>Pisang Goreng – Rp12.000</li>\n</ul>']
    },
    sukses: ['Nah, ini rapi sekali. Pisang gorengnya jadi kelihatan mahal, hehe.', 'Ini untuk pekerjaan hari ini ya.']
  },
  {
    judul: 'Tombol WhatsApp', bayar: 60000,
    pesan: [
      'Pelanggan sering tanya, bisa pesan lewat WA nggak?',
      'Bisa dibuatkan tulisan "Pesan lewat WhatsApp" yang kalau dipencet langsung membuka WA saya? Nomornya 0812-3456-7890.',
      'Oh iya, kalau bisa bukanya di tab baru, biar websitenya nggak hilang.'
    ],
    reqs: [
      { label: 'Tautan ke WhatsApp (wa.me)', ask: 'tulisannya belum tersambung ke WhatsApp',
        test: d => T.all(d, 'a[href]').some(a => a.getAttribute('href').includes('wa.me/')) },
      { label: 'Nomor ditulis format internasional: 62, tanpa 0 di depan, tanpa tanda strip', ask: 'waktu saya pencet, nomornya nggak ketemu. Mungkin formatnya belum benar', kecuali: 0,
        test: d => T.all(d, 'a[href]').some(a => /wa\.me\/6281234567890\b/.test(a.getAttribute('href').replace(/\s/g, ''))) },
      { label: 'Teks tautan: Pesan lewat WhatsApp', ask: 'tulisan "Pesan lewat WhatsApp"-nya belum ada',
        test: d => T.all(d, 'a').some(a => T.text(a).includes('whatsapp')) },
      { label: 'Dibuka di tab baru', ask: 'kalau dipencet, websitenya malah tertutup. Maunya di tab baru', kecuali: 0,
        test: d => T.all(d, 'a[href*="wa.me"]').some(a => a.getAttribute('target') === '_blank') }
    ],
    catatan: {
      teks: 'Tautan memakai <code>&lt;a&gt;</code> dengan atribut <code>href</code> berisi alamat tujuan. Untuk WhatsApp alamatnya <code>https://wa.me/</code> diikuti nomor dalam format internasional: kode negara 62, nol di depan dibuang, tanpa spasi atau strip. Jadi 0811-2222-333 menjadi 628112222333. Atribut <code>target="_blank"</code> membuka tautan di tab baru.',
      contoh: '<a href="https://wa.me/628112222333" target="_blank">Chat kami</a>',
      petunjuk: ['0812-3456-7890 → buang 0 di depan, tambah 62, hapus strip.', '<p><a href="https://wa.me/6281234567890" target="_blank">Pesan lewat WhatsApp</a></p>']
    },
    sukses: ['Barusan saya coba pencet, langsung masuk ke WA saya sendiri! Canggih 😆', 'Terima kasih, saya kirim bayarannya ya.']
  },
  {
    judul: 'Warna senja', bayar: 100000,
    pesan: [
      'Kok websitenya putih polos begini ya, kayak kertas fotokopian 😅',
      'Bisa dibuat terasa hangat? Warna-warna senja gitu: cokelat kopi, krem, sedikit oranye. Terserah kamu, saya percaya seleramu.',
      'Hurufnya juga jangan yang kaku begitu.'
    ],
    reqs: [
      { label: 'Latar halaman tidak putih polos', ask: 'latarnya masih putih polos',
        test: (d, w) => !T.kosong(w.getComputedStyle(d.body).backgroundColor) || !T.kosong(w.getComputedStyle(d.documentElement).backgroundColor) },
      { label: 'Judul besar punya warna sendiri', ask: 'judulnya masih hitam biasa',
        test: (d, w) => { const h = d.querySelector('h1'); return !!h && w.getComputedStyle(h).color !== 'rgb(0, 0, 0)'; } },
      { label: 'Jenis huruf diganti (font-family)', ask: 'hurufnya masih yang kaku itu',
        test: d => T.cssHas(d, /(^|[\s,])(body|html|\*)([\s,]|$)/, 'font-family') || !!d.body.style.fontFamily }
    ],
    catatan: {
      teks: 'CSS mengatur tampilan. Cara termudah: tulis tag <code>&lt;style&gt;</code> di dalam <code>&lt;head&gt;</code>. Setiap aturan terdiri dari selector (elemen yang diatur), lalu properti dan nilainya di dalam kurung kurawal. Warna bisa ditulis dengan kode hex seperti <code>#6B4226</code>. Untuk huruf, beri beberapa pilihan: kalau yang pertama tidak ada, browser memakai yang berikutnya.',
      contoh: '<style>\n  body {\n    background-color: #FFF4E0;\n    font-family: Georgia, serif;\n  }\n  h1 {\n    color: #8B4513;\n  }\n</style>',
      petunjuk: ['Taruh <style> sebelum </head>. Atur body untuk latar dan huruf, h1 untuk warna judul.', '<style>\n  body {\n    background-color: #F6E7D0;\n    color: #3B2A20;\n    font-family: Georgia, "Times New Roman", serif;\n  }\n  h1 {\n    color: #B5562B;\n  }\n</style>']
    },
    sukses: ['Nah ini! Rasanya kayak warung saya jam lima sore 🥹', 'Anak saya sampai tanya, "Ini yang bikin siapa, Bu?" Saya bilang: {nama}.']
  },
  {
    judul: 'Tombol pesan', bayar: 125000,
    pesan: [
      'Ada ide dari anak saya: bikin tombol "Pesan Sekarang".',
      'Kalau dipencet, muncul tulisan terima kasih. Biar pelanggan merasa disambut, katanya.',
      'Saya nggak tahu itu susah atau nggak, hehe. Pelan-pelan saja.'
    ],
    reqs: [
      { label: 'Tombol bertuliskan Pesan Sekarang', ask: 'tombol "Pesan Sekarang"-nya belum ada',
        test: d => T.all(d, 'button').some(b => T.text(b).includes('pesan sekarang')) },
      { label: 'Ditulis dengan JavaScript di tag <script>', ask: 'kata anak saya, belum ada JavaScript-nya',
        test: d => T.skrip(d).trim().length > 0 },
      { label: 'Setelah dipencet, muncul "Terima kasih"', ask: 'saya sudah pencet tombolnya, tulisan terima kasihnya nggak muncul', kecuali: 0,
        test: d => {
          const b = T.all(d, 'button').find(x => T.text(x).includes('pesan sekarang'));
          if (!b) return false;
          if (d.body.innerText.toLowerCase().includes('terima kasih')) return false;
          b.click();
          return d.body.innerText.toLowerCase().includes('terima kasih');
        } }
    ],
    catatan: {
      teks: 'JavaScript membuat halaman bisa bereaksi. Pola dasarnya tiga langkah: ambil elemen dengan <code>document.getElementById</code>, pasang "pendengar" dengan <code>addEventListener(\'click\', ...)</code>, lalu ubah isi elemen lain lewat <code>textContent</code>. Tag <code>&lt;script&gt;</code> ditaruh di bagian bawah <code>&lt;body&gt;</code>, supaya elemen yang dicari sudah ada saat kodenya berjalan.',
      contoh: '<button id="sapa">Sapa</button>\n<p id="balasan"></p>\n\n<script>\n  const tombol = document.getElementById("sapa");\n  tombol.addEventListener("click", function () {\n    document.getElementById("balasan").textContent = "Halo juga!";\n  });\n<\/script>',
      petunjuk: ['Butuh tiga bagian: <button> dengan id, <p> kosong dengan id, lalu <script> di paling bawah body.', '<button id="pesan">Pesan Sekarang</button>\n<p id="info"></p>\n\n<script>\n  document.getElementById("pesan").addEventListener("click", function () {\n    document.getElementById("info").textContent = "Terima kasih! Pesananmu kami siapkan.";\n  });\n<\/script>']
    },
    sukses: ['Saya pencet sepuluh kali, dan sepuluh kali juga dia bilang terima kasih 😂 Sopan sekali websitenya.', 'Ini bayaran untuk tombolnya.']
  },
  {
    judul: 'Rapi di HP dan laptop', bayar: 90000,
    pesan: [
      'Satu lagi. Waktu saya buka di HP, hurufnya kecil sekali, harus dicubit-cubit layarnya.',
      'Terus di laptop anak saya, tulisannya melebar sampai ujung layar. Capek bacanya.',
      'Bisa dirapikan? Setelah ini selesai, websitenya mau saya pasang di spanduk depan warung.'
    ],
    reqs: [
      { label: 'Ada meta viewport untuk layar HP', ask: 'di HP hurufnya masih kecil-kecil',
        test: d => T.all(d, 'meta[name="viewport"]').some(m => (m.getAttribute('content') || '').replace(/\s/g, '').includes('width=device-width')) },
      { label: 'Isi halaman dibatasi lebarnya (max-width)', ask: 'di laptop tulisannya masih melebar sampai ujung',
        test: (d, w) => [d.body].concat(T.all(d, 'body *')).some(e => w.getComputedStyle(e).maxWidth !== 'none') }
    ],
    catatan: {
      teks: 'Tanpa tag <code>&lt;meta name="viewport"&gt;</code>, HP menampilkan halaman seolah-olah layarnya selebar laptop lalu mengecilkannya. Tag ini ditaruh di <code>&lt;head&gt;</code>. Untuk layar lebar, batasi lebar isi dengan <code>max-width</code>, lalu ketengahkan dengan <code>margin: 0 auto</code>. Baris teks yang terlalu panjang memang melelahkan mata.',
      contoh: '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n/* di dalam <style> */\nbody {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 16px;\n}',
      petunjuk: ['Meta viewport di <head>, max-width di aturan CSS body yang sudah kamu buat.', '<meta name="viewport" content="width=device-width, initial-scale=1">\n\nbody {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 16px;\n}']
    },
    sukses: ['Sudah saya coba di HP saya dan HP suami. Enak sekali dibacanya!', 'Kata pelanggan tadi, "Bu, warungnya jadi kayak kafe di kota." Terima kasih banyak ya, {nama}. Nanti saya ceritakan ke teman-teman sesama pedagang.']
  }
  ]
},
{
  id: 'laras', tema: 'pagi',
  langit: [['#F6C6A8', '#FBE3C4'], ['#BFD8EA', '#F7E1C0'], ['#9CC8E8', '#E6F0E8'], ['#86BDE6', '#D7ECF3'], ['#7AB6E6', '#CFE6F2'], ['#88B8E0', '#F2D6B0'], ['#F2B98B', '#F8DDB0']],
  klien: {
    nama: 'Laras', usaha: 'Toko Bunga Laras', huruf: 'L', warna: '#9CC291', url: 'tokobungalaras.id',
    kirimTeks: 'Sudah aku perbarui, Kak Laras. Coba dicek ya 🙏',
    revisiBuka: 'Udah aku cek! Tapi ', revisiDaftar: 'masih ada yang belum:', revisiTutup: 'Santai aja, aku tunggu ya 🌷'
  },
  file: 'toko-bunga-laras.html',
  hadiah: { id: 'vas', teks: 'Laras juga mengirim vas bunga kecil. Sudah ditaruh di ambang jendela.' },
  penutup: {
    judul: 'Proyek kedua selesai',
    teks: 'Toko Bunga Laras sekarang punya menu navigasi, katalog berfoto, formulir pesanan, dan kartu produk yang dibuat otomatis dari data. Ini sudah website sungguhan.'
  },
  pembuka: 'Proyek baru: Toko Bunga Laras. File index.html baru sudah disiapkan.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Toko Bunga Laras</title>
  <style>
    body {
      background-color: #FBF3EE;
      color: #3A2E2A;
      font-family: Georgia, serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 16px;
    }
  </style>
</head>
<body>
  <h1>Toko Bunga Laras</h1>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Kerangka halaman', bayar: 120000,
    pesan: [
      'Halo {nama}! Aku Laras, dari Toko Bunga Laras 🌷 Bu Sari cerita banyak soal kamu, katanya kerjamu teliti.',
      'Tokoku kecil, tapi pesanan online makin banyak. Aku butuh website yang lebih lengkap dari punya Bu Sari, hehe.',
      'Mulai dari kerangkanya dulu ya. Di bagian atas ada menu: Katalog, Tentang, Kontak. Kalau diklik, langsung loncat ke bagiannya masing-masing.'
    ],
    reqs: [
      { label: 'Menu di dalam <header> dan <nav>', ask: 'bagian atasnya belum ada menu (header dan nav)',
        test: d => !!d.querySelector('header nav') },
      { label: 'Tautan Katalog, Tentang, dan Kontak', ask: 'menu Katalog, Tentang, sama Kontak-nya belum lengkap',
        test: d => ['#katalog', '#tentang', '#kontak'].every(h => T.all(d, 'nav a').some(a => a.getAttribute('href') === h)) },
      { label: 'Tiap tautan punya <section> tujuan dengan id yang cocok', ask: 'waktu aku klik menunya, nggak loncat ke mana-mana', kecuali: 1,
        test: d => ['katalog', 'tentang', 'kontak'].every(id => { const el = d.getElementById(id); return !!el && el.tagName === 'SECTION'; }) }
    ],
    catatan: {
      teks: 'Website yang lebih besar perlu dibagi menjadi bagian-bagian. <code>&lt;header&gt;</code> adalah kepala halaman, <code>&lt;nav&gt;</code> berisi menu, dan setiap bagian isi dibungkus <code>&lt;section&gt;</code>. Tag-tag ini disebut HTML semantik: tampilannya sama saja dengan <code>&lt;div&gt;</code>, tapi pembaca layar dan mesin pencari jadi paham susunan halamanmu. Untuk tautan yang meloncat di halaman yang sama, isi <code>href</code> dengan tanda pagar dan id tujuan: <code>href="#kontak"</code> meloncat ke elemen yang punya <code>id="kontak"</code>.',
      contoh: '<header>\n  <nav>\n    <a href="#jadwal">Jadwal</a>\n    <a href="#lokasi">Lokasi</a>\n  </nav>\n</header>\n\n<section id="jadwal">\n  <h2>Jadwal</h2>\n</section>\n<section id="lokasi">\n  <h2>Lokasi</h2>\n</section>',
      petunjuk: ['Pindahkan <h1> ke dalam <header>, lalu tambahkan <nav> berisi tiga tautan. Di bawahnya buat tiga <section> dengan id katalog, tentang, dan kontak.', '<header>\n  <h1>Toko Bunga Laras</h1>\n  <nav>\n    <a href="#katalog">Katalog</a>\n    <a href="#tentang">Tentang</a>\n    <a href="#kontak">Kontak</a>\n  </nav>\n</header>\n\n<section id="katalog">\n  <h2>Katalog</h2>\n</section>\n\n<section id="tentang">\n  <h2>Tentang</h2>\n  <p>Toko bunga kecil yang merangkai dengan tangan setiap hari.</p>\n</section>\n\n<section id="kontak">\n  <h2>Kontak</h2>\n</section>']
    },
    sukses: ['Aku klik "Kontak", langsung loncat ke bawah. Rapi banget!', 'Ini DP-nya ya, {nama}.']
  },
  {
    judul: 'Foto produk', bayar: 100000, aset: ['mawar.svg', 'tulip.svg', 'matahari.svg'],
    pesan: [
      'Kerangkanya udah bagus. Sekarang isi bagian Katalog.',
      'Aku kirim foto tiga bunga andalanku. Nama filenya jangan sampai salah ketik ya, komputer itu teliti banget soal huruf.',
      'Oh iya, tiap foto kasih keterangan. Ada pelanggan tetapku yang tunanetra, dia buka website pakai pembaca layar.'
    ],
    reqs: [
      { label: 'Tiga foto di bagian Katalog', ask: 'fotonya belum ada tiga di bagian Katalog',
        test: d => T.all(d, '#katalog img').length >= 3 },
      { label: 'Semua foto tampil (nama file benar)', ask: 'ada foto yang nggak muncul, cuma kotak kosong. Coba cek nama filenya',
        test: d => { const im = T.all(d, 'img'); return im.length > 0 && im.every(T.gambarOk); } },
      { label: 'Setiap foto punya keterangan (alt)', ask: 'masih ada foto tanpa keterangan, jadi pembaca layarnya diam saja',
        test: d => { const im = T.all(d, 'img'); return im.length > 0 && im.every(i => (i.getAttribute('alt') || '').trim().length > 2); } }
    ],
    catatan: {
      teks: 'Gambar ditulis dengan <code>&lt;img&gt;</code>, tag yang tidak punya penutup. Atribut <code>src</code> berisi nama file gambar dan harus sama persis, termasuk huruf besar-kecil dan akhiran <code>.svg</code>. Atribut <code>alt</code> berisi keterangan gambar: dibacakan oleh pembaca layar, dan muncul kalau gambarnya gagal dimuat. Tulis apa yang terlihat, bukan "gambar1". Klik nama file di atas editor untuk menyisipkannya.',
      contoh: '<img src="kue-lapis.svg" alt="Sepotong kue lapis legit berlapis cokelat">',
      petunjuk: ['Taruh tiga <img> di dalam <section id="katalog">, di bawah <h2>. Nama filenya: mawar.svg, tulip.svg, matahari.svg.', '<img src="mawar.svg" alt="Setangkai mawar merah">\n<img src="tulip.svg" alt="Tulip kuning mekar">\n<img src="matahari.svg" alt="Bunga matahari besar">']
    },
    sukses: ['Cantik banget! Barusan temanku coba pakai pembaca layar, dan dia dengar "setangkai mawar merah" 🥹', 'Makasih ya, aku transfer sekarang.']
  },
  {
    judul: 'Kartu produk', bayar: 150000,
    pesan: [
      'Fotonya udah muncul, tapi masih kayak ditaruh sembarangan 😅',
      'Bisa dibuat kartu? Satu bunga satu kartu: foto, nama, sama harganya.\nMawar Merah – Rp25.000\nTulip Kuning – Rp30.000\nBunga Matahari – Rp20.000',
      'Kartunya pakai latar putih, ada jarak di dalamnya, dan sudutnya membulat. Biar lembut.'
    ],
    reqs: [
      { label: 'Tiga kartu dengan class="kartu"', ask: 'kartunya belum ada tiga',
        test: d => T.all(d, '.kartu').length >= 3 },
      { label: 'Tiap kartu: foto, nama (h3), dan harga', ask: 'ada kartu yang belum lengkap foto, nama, atau harganya', kecuali: 0,
        test: d => T.all(d, '.kartu').every(T.kartuLengkap) },
      { label: 'Kartu punya padding dan sudut membulat', ask: 'kartunya masih kaku, belum ada jarak di dalam dan sudutnya masih lancip', kecuali: 0,
        test: (d, w) => { const k = d.querySelector('.kartu'); if (!k) return false; const cs = w.getComputedStyle(k); return T.px(cs.paddingTop) > 0 && T.px(cs.borderTopLeftRadius) > 0; } }
    ],
    catatan: {
      teks: 'Atribut <code>class</code> memberi nama kelompok pada elemen, supaya banyak elemen bisa diatur dengan satu aturan CSS. Bungkus isi satu kartu dengan <code>&lt;div class="kartu"&gt;</code>. Di CSS, selector kelas diawali titik: <code>.kartu</code>. Nama produk memakai <code>&lt;h3&gt;</code>, karena berada di bawah judul bagian <code>&lt;h2&gt;</code>.',
      contoh: '<div class="kartu">\n  <img src="kue-lapis.svg" alt="Kue lapis legit">\n  <h3>Lapis Legit</h3>\n  <p>Rp45.000</p>\n</div>\n\n/* di dalam <style> */\n.kartu {\n  background-color: white;\n  padding: 12px;\n  border-radius: 12px;\n}',
      petunjuk: ['Bungkus setiap <img> bersama <h3> dan <p> harganya dalam satu <div class="kartu">. Lalu tambahkan aturan .kartu di dalam <style>.', '<div class="kartu">\n  <img src="mawar.svg" alt="Setangkai mawar merah">\n  <h3>Mawar Merah</h3>\n  <p>Rp25.000</p>\n</div>\n<!-- ulangi untuk tulip dan matahari -->\n\n.kartu {\n  background-color: white;\n  padding: 12px;\n  border-radius: 12px;\n}']
    },
    sukses: ['Nah, ini baru toko bunga! Rapi kayak etalase.', 'Aku kirim bayarannya ya.']
  },
  {
    judul: 'Kartu berjajar', bayar: 150000,
    pesan: [
      'Kartunya numpuk ke bawah semua, pelanggan harus scroll jauh.',
      'Di laptop aku mau kartunya berjajar ke samping, ada jarak di antaranya. Di HP boleh turun ke bawah kalau nggak muat.',
      'Satu lagi: kartunya bergerak sedikit waktu disorot kursor. Biar terasa hidup.'
    ],
    reqs: [
      { label: 'Kartu berjajar ke samping di laptop', ask: 'kartunya masih numpuk ke bawah',
        test: d => { const tops = T.all(d, '.kartu').map(k => Math.round(k.getBoundingClientRect().top)); return tops.some((t, i) => tops.indexOf(t) !== i); } },
      { label: 'Ada jarak antar kartu (gap)', ask: 'kartunya masih dempet-dempetan',
        test: (d, w) => { const k = d.querySelector('.kartu'); if (!k || !k.parentElement) return false; const cs = w.getComputedStyle(k.parentElement); return T.px(cs.columnGap) > 0 || T.px(cs.rowGap) > 0; } },
      { label: 'Kartu turun ke baris baru kalau tidak muat (flex-wrap atau grid)', ask: 'di HP kartunya kepotong, nggak turun ke bawah',
        test: (d, w) => { const k = d.querySelector('.kartu'); if (!k || !k.parentElement) return false; const cs = w.getComputedStyle(k.parentElement); return cs.display.includes('grid') || (cs.display.includes('flex') && cs.flexWrap === 'wrap'); } },
      { label: 'Kartu bereaksi saat disorot kursor (:hover)', ask: 'kartunya belum bergerak waktu disorot kursor',
        test: d => T.adaRule(d, s => s.includes(':hover')) }
    ],
    catatan: {
      teks: 'Flexbox mengatur susunan anak-anak sebuah elemen. Bungkus semua kartu dengan satu <code>&lt;div&gt;</code>, lalu beri <code>display: flex</code> pada pembungkus itu: anak-anaknya berjajar ke samping. <code>gap</code> memberi jarak, dan <code>flex-wrap: wrap</code> membuat kartu turun ke baris baru kalau layarnya sempit. Untuk efek kursor, tulis aturan dengan <code>:hover</code>, dan tambahkan <code>transition</code> agar gerakannya halus.',
      contoh: '.galeri {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.foto {\n  transition: transform 0.2s;\n}\n.foto:hover {\n  transform: translateY(-4px);\n}',
      petunjuk: ['Bungkus ketiga kartu dengan <div class="daftar-produk">. Atur .daftar-produk dengan flex, lalu .kartu:hover dengan transform.', '<div class="daftar-produk">\n  <!-- tiga kartu di sini -->\n</div>\n\n.daftar-produk {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.kartu {\n  transition: transform 0.2s;\n}\n.kartu:hover {\n  transform: translateY(-4px);\n}']
    },
    sukses: ['Aku sorot-sorot kartunya dari tadi, lucu banget naik-turun 😆', 'Ini bayaranmu. Sekarang bagian yang paling penting.']
  },
  {
    judul: 'Formulir pesanan', bayar: 175000,
    pesan: [
      'Sekarang bagian yang paling penting: formulir pesanan, taruh di bagian Kontak.',
      'Isinya kolom nama pemesan, kolom ucapan untuk kartu bunga, dan tombol kirim.',
      'Kolom namanya wajib diisi ya. Minggu lalu ada buket yang sampai tanpa nama pengirim, penerimanya bingung 😅'
    ],
    reqs: [
      { label: 'Formulir (<form>) di bagian Kontak', ask: 'formulirnya belum ada di bagian Kontak',
        test: d => !!d.querySelector('#kontak form') },
      { label: 'Kolom nama dengan label', ask: 'kolom namanya belum ada label, jadi pelanggan bingung itu kolom apa',
        test: d => T.punyaLabel(d, T.inputNama(d)) },
      { label: 'Kolom nama wajib diisi (required)', ask: 'kolom namanya masih bisa dikosongkan',
        test: d => { const i = T.inputNama(d); return !!i && i.required; } },
      { label: 'Kolom ucapan (textarea)', ask: 'kolom ucapan untuk kartunya belum ada',
        test: d => !!d.querySelector('form textarea') },
      { label: 'Tombol kirim', ask: 'tombol kirimnya belum ada',
        test: d => !!d.querySelector('form button, form input[type="submit"]') }
    ],
    catatan: {
      teks: 'Formulir dibungkus <code>&lt;form&gt;</code>. Kolom satu baris memakai <code>&lt;input&gt;</code>, kolom panjang memakai <code>&lt;textarea&gt;</code>. Setiap kolom perlu <code>&lt;label&gt;</code>: atribut <code>for</code> pada label harus sama dengan <code>id</code> kolomnya. Dengan begitu, mengklik label akan memilih kolomnya, dan pembaca layar tahu kolom itu untuk apa. Atribut <code>required</code> membuat browser menolak formulir yang kolomnya masih kosong.',
      contoh: '<form>\n  <label for="email">Email</label>\n  <input type="text" id="email" required>\n\n  <label for="catatan">Catatan</label>\n  <textarea id="catatan"></textarea>\n\n  <button type="submit">Kirim</button>\n</form>',
      petunjuk: ['Taruh <form> di dalam <section id="kontak">: satu label dan input untuk nama, satu label dan textarea untuk ucapan, lalu tombol.', '<form id="form-pesan">\n  <label for="nama">Nama pemesan</label>\n  <input type="text" id="nama" required>\n\n  <label for="ucapan">Ucapan untuk kartu</label>\n  <textarea id="ucapan"></textarea>\n\n  <button type="submit">Kirim pesanan</button>\n</form>']
    },
    sukses: ['Aku coba kirim tanpa nama, langsung ditolak. Mantap!', 'Bayaranmu sudah aku kirim.']
  },
  {
    judul: 'Konfirmasi pesanan', bayar: 200000,
    pesan: [
      'Aku coba isi formulirnya terus pencet kirim... halamannya malah kedip dan kosong lagi 😵',
      'Maunya: setelah dikirim, halaman tetap di tempat, terus muncul tulisan "Terima kasih, [nama pemesan]!" pakai nama yang tadi diketik.',
      'Biar pelanggan yakin pesanannya sudah masuk.'
    ],
    reqs: [
      { label: 'Setelah dikirim, muncul "Terima kasih" dengan nama pemesan', ask: 'aku kirim pakai nama Rani, ucapan terima kasih untuk Rani nggak muncul',
        test: (d, w) => T.kirimForm(d, w) },
      { label: 'Halaman tidak dimuat ulang (preventDefault)', ask: 'halamannya masih kedip dan kosong setelah dikirim',
        test: (d, w) => { T.kirimForm(d, w); return w.__cegah === true; } }
    ],
    catatan: {
      teks: 'Secara bawaan, browser mengirim formulir dengan memuat ulang halaman. Untuk menanganinya sendiri, dengarkan event <code>submit</code> pada formulir, lalu panggil <code>event.preventDefault()</code> untuk membatalkan perilaku bawaan itu. Isi sebuah kolom dibaca lewat <code>.value</code>. Menggabungkan teks paling rapi dengan template literal: teks diapit backtick (<code>`</code>), dan nilai disisipkan dengan <code>${...}</code>.',
      contoh: '<script>\n  const form = document.getElementById("daftar");\n  form.addEventListener("submit", function (event) {\n    event.preventDefault();\n    const kota = document.getElementById("kota").value;\n    document.getElementById("hasil").textContent = `Sampai jumpa di ${kota}!`;\n  });\n<\/script>',
      petunjuk: ['Siapkan <p id="konfirmasi"></p> di bawah formulir, lalu tulis <script> di akhir <body>.', '<p id="konfirmasi"></p>\n\n<script>\n  const form = document.getElementById("form-pesan");\n  form.addEventListener("submit", function (event) {\n    event.preventDefault();\n    const nama = document.getElementById("nama").value;\n    document.getElementById("konfirmasi").textContent = `Terima kasih, ${nama}! Pesananmu sedang kami rangkai.`;\n  });\n<\/script>']
    },
    sukses: ['Aku coba pakai nama ibuku, dan websitenya bilang terima kasih ke ibuku 😭 Manis banget.', 'Ini bayaranmu. Tinggal satu permintaan terakhir, janji!']
  },
  {
    judul: 'Katalog dari data', bayar: 250000, aset: ['lili.svg'],
    pesan: [
      'Kabar baik: minggu depan aku mulai jual Lili Putih, Rp35.000. Fotonya aku kirim.',
      'Tapi aku bakal sering gonta-ganti produk. Masa tiap kali harus nulis kartu dari awal?',
      'Kata temanku yang programmer, data produknya bisa ditaruh di daftar JavaScript, terus kartunya dibuat otomatis. Bisa, kan? Kartu yang ditulis manual dihapus aja.'
    ],
    reqs: [
      { label: 'Data produk di array JavaScript, diulang dengan forEach atau for', ask: 'kata temanku, datanya belum ditaruh di daftar JavaScript',
        test: d => { const s = T.skrip(d); return /\[\s*\{[\s\S]*\}\s*,?\s*\]/.test(s) && /(forEach|\.map\s*\(|for\s*\()/.test(s); } },
      { label: 'Kartu dibuat oleh JavaScript (hapus kartu manual)', ask: 'kartunya masih ditulis manual di HTML',
        test: (d, w, src) => { const statis = new DOMParser().parseFromString(src, 'text/html'); return statis.querySelectorAll('.kartu').length === 0 && T.all(d, '.kartu').length >= 4; } },
      { label: 'Produk baru: Lili Putih Rp35.000', ask: 'Lili Putih-nya belum muncul',
        test: d => T.all(d, '.kartu').some(k => T.text(k).includes('lili') && T.text(k).includes('35')) },
      { label: 'Semua kartu lengkap dan fotonya tampil', ask: 'ada kartu yang fotonya nggak muncul atau belum lengkap', kecuali: 1,
        test: d => { const k = T.all(d, '.kartu'); return k.length >= 4 && k.every(T.kartuLengkap); } }
    ],
    catatan: {
      teks: 'Array adalah daftar data dalam JavaScript, ditulis di antara kurung siku. Setiap produk ditulis sebagai objek dalam kurung kurawal, berisi pasangan nama dan nilai. <code>forEach</code> menjalankan fungsi untuk setiap isi array. Di dalamnya, kartu dibuat dengan template literal lalu ditambahkan ke pembungkus lewat <code>innerHTML +=</code>. Setelah ini, menambah produk cukup dengan menambah satu baris data.',
      contoh: '<div id="daftar-kue"></div>\n\n<script>\n  const kue = [\n    { nama: "Lapis Legit", harga: "Rp45.000" },\n    { nama: "Bolu Pandan", harga: "Rp30.000" }\n  ];\n  const wadah = document.getElementById("daftar-kue");\n  kue.forEach(function (k) {\n    wadah.innerHTML += `<div class="kartu"><h3>${k.nama}</h3><p>${k.harga}</p></div>`;\n  });\n<\/script>',
      petunjuk: ['Kosongkan pembungkus kartu dan beri id. Buat array produk berisi nama, harga, dan foto (termasuk lili.svg), lalu buat kartunya dengan forEach.', '<div class="daftar-produk" id="daftar-produk"></div>\n\n<script>\n  const produk = [\n    { nama: "Mawar Merah", harga: "Rp25.000", foto: "mawar.svg", alt: "Setangkai mawar merah" },\n    { nama: "Tulip Kuning", harga: "Rp30.000", foto: "tulip.svg", alt: "Tulip kuning mekar" },\n    { nama: "Bunga Matahari", harga: "Rp20.000", foto: "matahari.svg", alt: "Bunga matahari besar" },\n    { nama: "Lili Putih", harga: "Rp35.000", foto: "lili.svg", alt: "Bunga lili putih" }\n  ];\n  const wadah = document.getElementById("daftar-produk");\n  produk.forEach(function (p) {\n    wadah.innerHTML += `\n      <div class="kartu">\n        <img src="${p.foto}" alt="${p.alt}">\n        <h3>${p.nama}</h3>\n        <p>${p.harga}</p>\n      </div>`;\n  });\n<\/script>']
    },
    sukses: ['Aku coba tambah satu baris data sendiri, dan kartunya langsung muncul! Aku merasa jadi programmer 😆', 'Terima kasih banyak, {nama}. Websitenya jauh lebih bagus dari yang aku bayangkan.']
  }
  ]
},
{
  id: 'nada', tema: 'malam',
  langit: [['#3B3F6B', '#8A6C8E'], ['#2B2F57', '#5E5484'], ['#20244A', '#3F3E6E'], ['#181C3C', '#2E3160'], ['#12152F', '#232650'], ['#0E1128', '#1B1E42'], ['#2A2C58', '#E7A07A']],
  klien: {
    nama: 'Bima', usaha: 'Ruang Nada', huruf: 'B', warna: '#9FA8DA', url: 'ruangnada.id',
    kirimTeks: 'Sudah saya perbarui, Mas Bima. Silakan dicek 🙏',
    revisiBuka: 'Sudah kucoba. Tapi ', revisiDaftar: 'masih ada beberapa yang belum jalan:', revisiTutup: 'Santai, kafe baru buka jam tujuh 🎶'
  },
  file: 'ruang-nada.html',
  hadiah: { id: 'gitar', teks: 'Bima juga mengirim gitar tua dari kafenya. Sudah digantung di dinding studio.' },
  penutup: {
    judul: 'Proyek ketiga selesai',
    teks: 'Ruang Nada sekarang punya tema terang dan gelap yang diingat browser, jadwal yang dibaca langsung dari file JSON, pesan saat offline, filter genre, dan pencarian. Ini sudah pekerjaan front-end developer sungguhan.'
  },
  pembuka: 'Proyek baru: Ruang Nada. File index.html dari Bima sudah dibuka.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ruang Nada</title>
  <style>
    body {
      background-color: #F4EFE6;
      color: #22232E;
      font-family: system-ui, sans-serif;
      max-width: 880px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #C0533A;
    }
  </style>
</head>
<body>
  <header>
    <h1>Ruang Nada</h1>
    <p>Kafe kecil, musik langsung setiap malam.</p>
  </header>

  <section id="acara">
    <h2>Jadwal minggu ini</h2>
  </section>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Warna jadi variabel', bayar: 200000,
    pesan: [
      'Selamat malam, {nama}. Aku Bima, yang ngurus Ruang Nada, kafe musik kecil di pojok kota. Laras bilang kamu bisa diandalkan.',
      'Websiteku sudah ada, tapi warnanya ditulis langsung di mana-mana. Nanti aku mau ada mode terang dan gelap.',
      'Jadi rapikan dulu: kumpulkan warna utama jadi variabel CSS di :root. Minimal warna latar, warna teks, dan warna aksen. Terus pakai variabel itu di halaman.'
    ],
    reqs: [
      { label: 'Minimal 3 variabel warna di :root', ask: 'variabel warnanya belum ada di :root',
        test: d => T.aturan(d).some(r => r.selectorText.includes(':root') && T.jumlahVariabel(r) >= 3) },
      { label: 'Latar dan teks body memakai var()', ask: 'warna latar dan teks body masih ditulis langsung, belum pakai var()',
        test: d => T.aturan(d).some(r => /(^|[\s,])body([\s,]|$)/.test(r.selectorText) && /background[^;]*var\(--/.test(r.style.cssText) && /(^|;\s*)color\s*:\s*var\(--/.test(r.style.cssText)) },
      { label: 'Warna aksen dipakai di judul', ask: 'judulnya belum pakai variabel warna aksen',
        test: d => T.aturan(d).some(r => /\bh1\b/.test(r.selectorText) && /var\(--/.test(r.style.cssText)) }
    ],
    catatan: {
      teks: 'Variabel CSS (custom property) adalah nama yang menyimpan sebuah nilai. Namanya diawali dua tanda strip, misalnya <code>--latar</code>, dan biasanya ditulis di <code>:root</code> supaya berlaku di seluruh halaman. Nilainya dipakai dengan <code>var(--latar)</code>. Kalau nanti warnanya diganti, cukup ubah satu baris di <code>:root</code>. Inilah dasar dari fitur mode gelap.',
      contoh: ':root {\n  --utama: #2B6CB0;\n  --kertas: #FFFFFF;\n}\n\n.tombol {\n  background-color: var(--utama);\n  color: var(--kertas);\n}',
      petunjuk: ['Buat aturan :root berisi --latar, --teks, dan --aksen dengan warna yang sekarang ada. Lalu ganti warna di body dan h1 dengan var(...).', ':root {\n  --latar: #F4EFE6;\n  --teks: #22232E;\n  --aksen: #C0533A;\n}\n\nbody {\n  background-color: var(--latar);\n  color: var(--teks);\n  font-family: system-ui, sans-serif;\n  max-width: 880px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\nh1 {\n  color: var(--aksen);\n}']
    },
    sukses: ['Rapi. Aku coba ganti --aksen jadi ungu, satu baris doang, judulnya langsung ikut. Enak kerja sama kamu.', 'DP sudah kukirim ya.']
  },
  {
    judul: 'Tombol mode gelap', bayar: 220000,
    pesan: [
      'Sekarang bagian serunya.',
      'Buatkan tombol "Mode gelap". Kalau dipencet, websitenya jadi gelap. Pencet lagi, kembali terang.',
      'Kata teman developerku, tombolnya cukup menambah atau melepas satu class di body. Terus class itu mengganti nilai variabelnya. Nggak perlu ubah warna satu-satu.'
    ],
    reqs: [
      { label: 'Tombol bertuliskan Mode gelap', ask: 'tombol "Mode gelap"-nya belum ada',
        test: d => !!T.tombolMode(d) },
      { label: 'Dipencet sekali: halaman jadi gelap', ask: 'aku pencet tombolnya, halamannya nggak jadi gelap', kecuali: 0,
        test: (d, w) => { const m = T.modeGelap(d, w); return m.ada && m.awal > 0.5 && m.satu < 0.3; } },
      { label: 'Dipencet lagi: kembali terang', ask: 'setelah gelap, dipencet lagi nggak balik terang', kecuali: 1,
        test: (d, w) => { const m = T.modeGelap(d, w); return m.ada && m.satu < 0.3 && Math.abs(m.dua - m.awal) < 0.02; } },
      { label: 'Memakai classList dan class yang mengganti variabel', ask: 'kata temanku, caranya belum pakai class di body yang mengganti variabel',
        test: d => /classList\s*\.\s*(toggle|add|remove)/.test(T.skrip(d)) && T.aturan(d).some(r => r.selectorText.includes('.') && T.jumlahVariabel(r) > 0) }
    ],
    catatan: {
      teks: 'Karena semua warna sudah memakai variabel, mode gelap cukup berupa satu class yang menimpa nilai variabel itu, misalnya <code>body.gelap { --latar: #16171F; }</code>. Di JavaScript, <code>classList.toggle("gelap")</code> menambahkan class kalau belum ada, dan melepasnya kalau sudah ada. Satu baris itu sudah membuat tombol bolak-balik.',
      contoh: '.kotak.aktif {\n  --warna: #E53E3E;\n}\n\n<script>\n  document.getElementById("saklar").addEventListener("click", function () {\n    document.querySelector(".kotak").classList.toggle("aktif");\n  });\n<\/script>',
      petunjuk: ['Tambahkan aturan body.gelap yang mengisi ulang --latar, --teks, dan --aksen. Lalu buat tombol dan script dengan classList.toggle.', 'body.gelap {\n  --latar: #16171F;\n  --teks: #ECE8DF;\n  --aksen: #F2A65A;\n}\n\n<button id="tombol-mode">Mode gelap</button>\n\n<script>\n  const tombolMode = document.getElementById("tombol-mode");\n  tombolMode.addEventListener("click", function () {\n    document.body.classList.toggle("gelap");\n  });\n<\/script>']
    },
    sukses: ['Aku pencet bolak-balik kayak saklar lampu 😄 Mode gelapnya cocok banget buat suasana kafe malam.', 'Bayarannya sudah masuk ya.']
  },
  {
    judul: 'Ingat pilihan mode', bayar: 220000,
    pesan: [
      'Pelanggan suka mode gelap, apalagi yang buka website malam-malam.',
      'Masalahnya, tiap halaman dibuka ulang, balik terang lagi. Mereka harus pencet ulang terus 😅',
      'Bisa diingat pilihannya? Kata temanku pakai localStorage. Nanti aku tes: pilih gelap, tutup, terus buka lagi.'
    ],
    reqs: [
      { label: 'Pilihan disimpan dengan localStorage.setItem', ask: 'pilihannya belum disimpan ke localStorage',
        test: (d, w) => { const m = T.simpanMode(d, w); return m.ada && m.sesudah > m.sebelum; } },
      { label: 'Dibuka lagi: mode gelap tetap dipakai', ask: 'aku pilih gelap, tutup, buka lagi, eh terang lagi', pass: 'ulang', kecuali: 0,
        test: (d, w) => T.terangHalaman(d, w) < 0.3 },
      { label: 'Setelah dibuka lagi, tombol tetap bisa kembali ke terang', ask: 'setelah dibuka ulang, tombolnya nggak bisa balik ke terang', pass: 'ulang', kecuali: 1,
        test: (d, w) => { const b = T.tombolMode(d); if (!b) return false; b.click(); return T.terangHalaman(d, w) > 0.5; } }
    ],
    catatan: {
      teks: '<code>localStorage</code> adalah tempat penyimpanan kecil di browser yang tidak hilang saat halaman ditutup. <code>localStorage.setItem("kunci", "nilai")</code> menyimpan teks, dan <code>localStorage.getItem("kunci")</code> membacanya lagi (hasilnya <code>null</code> kalau belum pernah disimpan). Jadi ada dua langkah: saat tombol dipencet, simpan mode yang sedang aktif. Saat halaman dibuka, baca mode tersimpan lalu terapkan. <code>classList.contains</code> memberi tahu apakah sebuah class sedang terpasang.',
      contoh: 'localStorage.setItem("bahasa", "id");\n\nif (localStorage.getItem("bahasa") === "id") {\n  document.body.classList.add("indonesia");\n}',
      petunjuk: ['Di awal script, cek localStorage.getItem("mode"). Di dalam klik tombol, simpan "gelap" atau "terang" sesuai classList.contains.', '<script>\n  const tombolMode = document.getElementById("tombol-mode");\n\n  if (localStorage.getItem("mode") === "gelap") {\n    document.body.classList.add("gelap");\n  }\n\n  tombolMode.addEventListener("click", function () {\n    document.body.classList.toggle("gelap");\n    const mode = document.body.classList.contains("gelap") ? "gelap" : "terang";\n    localStorage.setItem("mode", mode);\n  });\n<\/script>']
    },
    sukses: ['Sudah kutes di tiga HP. Pilih gelap, tutup, buka lagi, tetap gelap. Mantap.', 'Ini bayarannya.']
  },
  {
    judul: 'Jadwal dari file JSON', bayar: 260000, aset: ['jadwal.json'],
    pesan: [
      'Sekarang yang paling sering berubah: jadwal musisi. Aku kirim filenya ya, formatnya JSON.',
      'Jadwalnya aku ganti tiap minggu. Jadi websitenya harus membaca file itu langsung, jangan ditulis manual di HTML.',
      'Tampilkan di bagian Jadwal, satu kotak per acara dengan class "acara": hari, musisi, genre, jam. Susun pakai CSS grid biar rapi.'
    ],
    reqs: [
      { label: 'Data diambil dengan fetch("jadwal.json")', ask: 'jadwalnya belum dibaca dari file jadwal.json',
        test: d => /fetch\s*\(\s*["'`](\.\/)?jadwal\.json/.test(T.skrip(d)) },
      { label: 'Enam acara tampil dengan class="acara"', ask: 'kotak acaranya belum muncul enam',
        test: d => T.all(d, '.acara').length >= 6 },
      { label: 'Nama semua musisi dari file tampil', ask: 'ada nama musisi dari file yang nggak muncul', kecuali: 1,
        test: d => { const t = T.all(d, '.acara').map(T.text).join(' '); return JADWAL.every(a => t.includes(a.musisi.toLowerCase())); } },
      { label: 'Kotak acara disusun dengan CSS grid', ask: 'kotak acaranya belum disusun pakai grid', kecuali: 1,
        test: (d, w) => { const a = d.querySelector('.acara'); return !!a && !!a.parentElement && w.getComputedStyle(a.parentElement).display.includes('grid'); } },
      { label: 'Tidak ada kotak acara yang ditulis manual', ask: 'masih ada acara yang ditulis manual di HTML',
        test: (d, w, src) => new DOMParser().parseFromString(src, 'text/html').querySelectorAll('.acara').length === 0 }
    ],
    catatan: {
      teks: 'JSON adalah format teks untuk menyimpan data, bentuknya mirip array dan objek JavaScript. <code>fetch("jadwal.json")</code> meminta file itu. Hasilnya tidak langsung tersedia karena harus menunggu jaringan, jadi fungsinya ditandai <code>async</code> dan setiap langkah yang ditunggu diberi <code>await</code>. <code>await respon.json()</code> mengubah teks JSON menjadi array yang bisa di-<code>forEach</code>. Klik <code>jadwal.json</code> di atas editor untuk melihat isinya.',
      contoh: '<script>\n  async function muatMenu() {\n    const respon = await fetch("menu.json");\n    const menu = await respon.json();\n    menu.forEach(function (m) {\n      console.log(m.nama);\n    });\n  }\n  muatMenu();\n<\/script>',
      petunjuk: ['Buat <div id="jadwal" class="jadwal"></div> di bagian acara, aturan CSS grid untuk .jadwal, lalu fungsi async yang mengisi kotak-kotaknya.', '<div id="jadwal" class="jadwal"></div>\n\n.jadwal {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 16px;\n}\n\n<script>\n  async function muatJadwal() {\n    const respon = await fetch("jadwal.json");\n    const daftar = await respon.json();\n    const wadah = document.getElementById("jadwal");\n    daftar.forEach(function (a) {\n      wadah.innerHTML += `\n        <div class="acara">\n          <strong>${a.hari}, ${a.tanggal}</strong>\n          <h3>${a.musisi}</h3>\n          <p>${a.genre}, ${a.jam}</p>\n        </div>`;\n    });\n  }\n  muatJadwal();\n<\/script>']
    },
    sukses: ['Aku ganti satu nama musisi di file JSON-nya, dan websitenya langsung ikut berubah. Ini yang aku mau!', 'Bayaran sudah kukirim.']
  },
  {
    judul: 'Kalau sinyal jelek', bayar: 200000,
    pesan: [
      'Kemarin sinyal di kafe lagi jelek, dan bagian jadwal kosong melompong. Pelanggan kira nggak ada acara 😟',
      'Kalau jadwalnya gagal dimuat, tolong tampilkan tulisan: "Jadwal belum bisa dimuat. Coba muat ulang halaman."',
      'Nanti aku uji dengan mematikan internet ya.'
    ],
    reqs: [
      { label: 'Saat online, jadwal tetap tampil', ask: 'sekarang malah jadwalnya nggak muncul walaupun internetnya nyala',
        test: d => T.all(d, '.acara').length >= 6 },
      { label: 'Saat offline, muncul "Jadwal belum bisa dimuat"', ask: 'waktu internet kumatikan, tulisan "Jadwal belum bisa dimuat" nggak muncul', pass: 'offline',
        test: d => d.body.innerText.toLowerCase().includes('belum bisa dimuat') },
      { label: 'Error ditangkap dengan try...catch (konsol bersih)', ask: 'waktu offline, konsolnya masih penuh error merah', pass: 'offline',
        test: (d, w) => /\bcatch\b/.test(T.skrip(d)) && (w.__errs || []).length === 0 }
    ],
    catatan: {
      teks: 'Jaringan bisa gagal kapan saja, dan kode yang baik bersiap untuk itu. Bungkus langkah yang bisa gagal dengan <code>try { ... }</code>. Kalau salah satu baris di dalamnya melempar error, JavaScript langsung loncat ke <code>catch (error) { ... }</code>. Di situ kamu bisa menampilkan pesan yang ramah, bukan halaman kosong. Pemeriksa akan menjalankan websitemu dua kali: sekali dengan internet, sekali tanpa internet.',
      contoh: 'try {\n  const respon = await fetch("promo.json");\n  const promo = await respon.json();\n  tampilkan(promo);\n} catch (error) {\n  document.getElementById("promo").textContent = "Promo belum tersedia.";\n}',
      petunjuk: ['Pindahkan isi muatJadwal() ke dalam try, lalu tulis pesan di catch.', 'async function muatJadwal() {\n  const wadah = document.getElementById("jadwal");\n  try {\n    const respon = await fetch("jadwal.json");\n    const daftar = await respon.json();\n    daftar.forEach(function (a) {\n      wadah.innerHTML += `<div class="acara">...</div>`;\n    });\n  } catch (error) {\n    wadah.textContent = "Jadwal belum bisa dimuat. Coba muat ulang halaman.";\n  }\n}']
    },
    sukses: ['Sudah kutes pakai mode pesawat. Pesannya muncul dengan sopan. Pelanggan jadi nggak salah paham.', 'Ini untuk kerjaanmu hari ini.']
  },
  {
    judul: 'Filter genre', bayar: 240000,
    pesan: [
      'Pelanggan setiaku punya selera masing-masing. Ada yang cuma mau nonton jazz.',
      'Tambahkan tombol filter: Semua, Jazz, Akustik, Pop. Kalau pencet Jazz, yang tampil cuma acara jazz.',
      'Datanya jangan diambil ulang tiap kali pencet. Simpan dulu di variabel, terus saring pakai filter().'
    ],
    reqs: [
      { label: 'Tombol Semua, Jazz, Akustik, dan Pop', ask: 'tombol filter genrenya belum lengkap',
        test: d => ['semua', 'jazz', 'akustik', 'pop'].every(k => !!T.tombol(d, k)) },
      { label: 'Pencet Jazz: hanya acara jazz yang tampil', ask: 'aku pencet Jazz, yang tampil bukan cuma jazz', kecuali: 0,
        test: (d, w) => { T.tombol(d, 'jazz').click(); const a = T.acaraTampil(d, w); return a.length === 2 && a.every(x => T.text(x).includes('jazz')); } },
      { label: 'Pencet Semua: keenam acara tampil lagi', ask: 'setelah pencet Semua, acaranya nggak kembali lengkap', kecuali: 0,
        test: (d, w) => { T.tombol(d, 'jazz').click(); T.tombol(d, 'semua').click(); return T.acaraTampil(d, w).length === 6; } },
      { label: 'Data disaring dengan filter()', ask: 'kata temanku, datanya belum disaring pakai filter()',
        test: d => /\.filter\s*\(/.test(T.skrip(d)) }
    ],
    catatan: {
      teks: '<code>filter()</code> membuat array baru yang hanya berisi item yang lolos syarat. Syaratnya ditulis sebagai fungsi yang mengembalikan <code>true</code> atau <code>false</code>, sering dengan arrow function: <code>daftar.filter(a =&gt; a.genre === "Jazz")</code>. Supaya bisa dipakai berulang, pisahkan kode yang menggambar kotak ke fungsi sendiri, misalnya <code>tampilkan(daftar)</code>, yang mengosongkan wadah dulu baru mengisinya. Atribut <code>data-genre</code> pada tombol bisa dibaca lewat <code>tombol.dataset.genre</code>.',
      contoh: 'const angka = [3, 8, 12, 5];\nconst besar = angka.filter(n => n > 6);\n// besar = [8, 12]\n\n<button data-warna="merah">Merah</button>\n// tombol.dataset.warna === "merah"',
      petunjuk: ['Simpan data di let semuaAcara = [] setelah fetch. Buat fungsi tampilkan(daftar). Pasang klik di setiap tombol filter.', '<div class="filter">\n  <button data-genre="Semua">Semua</button>\n  <button data-genre="Jazz">Jazz</button>\n  <button data-genre="Akustik">Akustik</button>\n  <button data-genre="Pop">Pop</button>\n</div>\n\n<script>\n  let semuaAcara = [];\n\n  function tampilkan(daftar) {\n    const wadah = document.getElementById("jadwal");\n    wadah.innerHTML = "";\n    daftar.forEach(function (a) {\n      wadah.innerHTML += `<div class="acara"><h3>${a.musisi}</h3><p>${a.genre}, ${a.jam}</p></div>`;\n    });\n  }\n\n  document.querySelectorAll(".filter button").forEach(function (tombol) {\n    tombol.addEventListener("click", function () {\n      const genre = tombol.dataset.genre;\n      if (genre === "Semua") {\n        tampilkan(semuaAcara);\n      } else {\n        tampilkan(semuaAcara.filter(a => a.genre === genre));\n      }\n    });\n  });\n\n  // di dalam try pada muatJadwal():\n  //   semuaAcara = await respon.json();\n  //   tampilkan(semuaAcara);\n<\/script>']
    },
    sukses: ['Pelanggan jazz-ku langsung ketawa, katanya "akhirnya ada website yang ngerti aku" 😆', 'Bayarannya sudah kukirim.']
  },
  {
    judul: 'Cari musisi', bayar: 280000,
    pesan: [
      'Terakhir, dan ini permintaan dari pelanggan paling bawel 😄',
      'Kolom pencarian nama musisi. Tiap kali ngetik satu huruf, daftarnya langsung tersaring. Huruf besar-kecil nggak masalah: "rara" dan "RARA" hasilnya sama.',
      'Kalau nggak ada yang cocok, tulis "Tidak ada acara yang cocok." Dan kalau kolomnya dikosongkan, semua acara muncul lagi.'
    ],
    reqs: [
      { label: 'Kolom pencarian (input type="search")', ask: 'kolom pencariannya belum ada',
        test: d => !!d.querySelector('input[type="search"]') },
      { label: 'Ketik "RARA": hanya acara Rara yang tampil', ask: 'aku ketik RARA, hasilnya nggak cuma acara Rara', kecuali: 0,
        test: (d, w) => { const a = T.cari(d, w, 'RARA'); return !!a && a.length === 1 && T.text(a[0]).includes('rara'); } },
      { label: 'Tidak ada yang cocok: muncul "Tidak ada acara yang cocok"', ask: 'waktu nggak ada yang cocok, halamannya kosong tanpa keterangan', kecuali: 0,
        test: (d, w) => { const a = T.cari(d, w, 'zzzz'); return !!a && a.length === 0 && d.body.innerText.toLowerCase().includes('tidak ada acara yang cocok'); } },
      { label: 'Kolom dikosongkan: semua acara kembali', ask: 'setelah kolomnya kukosongkan, acaranya nggak kembali semua', kecuali: 0,
        test: (d, w) => { T.cari(d, w, 'zzzz'); const a = T.cari(d, w, ''); return !!a && a.length === 6; } }
    ],
    catatan: {
      teks: 'Event <code>input</code> berjalan setiap kali isi kolom berubah, jadi hasil bisa disaring sambil mengetik. Supaya huruf besar-kecil tidak berpengaruh, ubah kedua sisi dengan <code>toLowerCase()</code> sebelum dibandingkan. <code>includes()</code> memeriksa apakah sebuah teks mengandung teks lain, dan string kosong selalu cocok, sehingga kolom kosong otomatis menampilkan semuanya. Tambahkan pengecekan <code>daftar.length === 0</code> di <code>tampilkan()</code> untuk pesan "tidak ada".',
      contoh: 'const kolom = document.getElementById("cari-buku");\nkolom.addEventListener("input", function () {\n  const kata = kolom.value.toLowerCase();\n  const hasil = buku.filter(b => b.judul.toLowerCase().includes(kata));\n  tampilkan(hasil);\n});',
      petunjuk: ['Tambahkan <input type="search" id="cari">, pasang event input yang memanggil tampilkan() dengan hasil filter, lalu tangani daftar kosong di tampilkan().', '<input type="search" id="cari" placeholder="Cari musisi...">\n\nconst kolomCari = document.getElementById("cari");\nkolomCari.addEventListener("input", function () {\n  const kata = kolomCari.value.toLowerCase();\n  const hasil = semuaAcara.filter(a => a.musisi.toLowerCase().includes(kata));\n  tampilkan(hasil);\n});\n\n// di awal fungsi tampilkan(daftar), setelah wadah.innerHTML = "":\nif (daftar.length === 0) {\n  wadah.textContent = "Tidak ada acara yang cocok.";\n  return;\n}']
    },
    sukses: ['Pelanggan bawelku sudah coba. Katanya, "Nah, gini dong." Dari dia, itu pujian tertinggi 😂', 'Terima kasih banyak, {nama}. Ruang Nada sekarang punya website yang benar-benar hidup. Kapan-kapan mampir, kopi dan musiknya gratis.']
  }
  ]
}
];

const ITEMS = [
  { id: 'tanaman', nama: 'Monstera kecil', ket: 'Sedikit hijau di samping meja.', harga: 50000 },
  { id: 'poster', nama: 'Poster gunung', ket: 'Pengingat untuk kerja pelan-pelan.', harga: 40000 },
  { id: 'lampu', nama: 'Lampu tumbler', ket: 'Digantung di atas jendela.', harga: 75000 },
  { id: 'jam', nama: 'Jam dinding', ket: 'Jarumnya mengikuti jam di perangkatmu.', harga: 90000 },
  { id: 'bintang', nama: 'Proyektor bintang', ket: 'Titik-titik cahaya lembut di dinding.', harga: 110000 },
  { id: 'piringan', nama: 'Pemutar piringan hitam', ket: 'Membuka lagu kedua di pengaturan.', harga: 120000 },
  { id: 'kucing', nama: 'Adopsi Mochi', ket: 'Kucing oren. Tidur di ujung meja, suka dielus.', harga: 150000 }
];
const SEMUA_ITEM = ITEMS.map(i => i.id).concat(['bingkai', 'vas', 'gitar']);

/* Room atmosphere per chapter theme */
const SUASANA = {
  hujan: { nama: 'Sore hujan di warung', dinding: '#2E3A55', lantai: '#28334C', lampu: 1, hujan: true },
  pagi:  { nama: 'Pagi cerah di toko bunga', dinding: '#65738F', lantai: '#56627C', lampu: 0.35, pagi: true },
  malam: { nama: 'Malam berbintang di Ruang Nada', dinding: '#1E2338', lantai: '#191D2F', lampu: 1.2, malam: true }
};

/* =========================================================
   STATE
   ========================================================= */
const VOL_AWAL = { musik: 0.6, hujan: 0.5, efek: 0.7 };
function baru() {
  return { versi: 2, nama: '', bab: 0, tugas: 0, intro: -1, kode: { 0: BAB[0].starter }, log: { 0: [] },
    uang: 0, punya: [], revisi: {}, tamat: [], vol: Object.assign({}, VOL_AWAL), lagu: 1 };
}
function normalisasi(o) {
  if (!o || typeof o !== 'object') return baru();
  if (!o.versi) {
    const tamat = o.selesai ? [0] : [];
    o = {
      versi: 2, nama: o.nama || '', bab: 0, tugas: o.tugas || 0, intro: typeof o.intro === 'number' ? o.intro : -1,
      kode: { 0: typeof o.kode === 'string' ? o.kode : BAB[0].starter }, log: { 0: Array.isArray(o.log) ? o.log : [] },
      uang: o.uang || 0, punya: Array.isArray(o.punya) ? o.punya : [], revisi: { 0: typeof o.revisi === 'number' ? o.revisi : 0 },
      tamat, vol: o.vol || VOL_AWAL, lagu: o.lagu || 1
    };
    if (tamat.includes(0) && !o.punya.includes('bingkai')) o.punya.push('bingkai');
  }
  const s = Object.assign(baru(), o);
  s.vol = Object.assign({}, VOL_AWAL, s.vol);
  s.bab = Math.min(Math.max(0, s.bab | 0), BAB.length - 1);
  s.tugas = Math.min(Math.max(0, s.tugas | 0), BAB[s.bab].tugas.length - 1);
  if (typeof s.kode[s.bab] !== 'string') s.kode[s.bab] = BAB[s.bab].starter;
  if (!Array.isArray(s.log[s.bab])) s.log[s.bab] = [];
  s.punya = s.punya.filter(id => SEMUA_ITEM.includes(id));
  return s;
}
function muat() {
  try { const raw = localStorage.getItem(SIMPAN_KEY); if (raw) return normalisasi(JSON.parse(raw)); } catch (e) {}
  return baru();
}
let S = muat();

let simpanTimer;
function simpan(segera) {
  clearTimeout(simpanTimer);
  const tulis = () => { try { localStorage.setItem(SIMPAN_KEY, JSON.stringify(S)); } catch (e) {} setStatus('tersimpan'); };
  if (segera) tulis(); else { setStatus('menyimpan…'); simpanTimer = setTimeout(tulis, 600); }
}
function setStatus(t) { const el = document.getElementById('simpanStatus'); if (el) el.textContent = t; }

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rupiah = n => 'Rp' + n.toLocaleString('id-ID');
const isi = s => s.replace(/\{nama\}/g, S.nama || 'Kak');
const tunggu = ms => new Promise(r => setTimeout(r, ms));

const bab = () => BAB[S.bab];
const klien = () => bab().klien;
const tugasIni = () => bab().tugas[S.tugas];
const babTamat = () => S.tamat.includes(S.bab);
const adaBabBaru = () => babTamat() && S.bab + 1 < BAB.length;
const semuaTamat = () => babTamat() && S.bab + 1 >= BAB.length;
const kodeIni = () => (typeof S.kode[S.bab] === 'string' ? S.kode[S.bab] : (S.kode[S.bab] = bab().starter));
function asetTersedia() {
  const out = [];
  bab().tugas.forEach((t, i) => { if (t.aset && (i < S.tugas || (i === S.tugas && S.intro >= S.tugas) || babTamat())) out.push(...t.aset); });
  return out;
}

/* Every async client conversation checks this token; a reset bumps it so old conversations stop. */
let sesi = 0;

/* =========================================================
   AUDIO — generated lo-fi, rain, and soft effects
   ========================================================= */
const A = { ctx: null, tema: null };
const midi = n => 440 * Math.pow(2, (n - 69) / 12);

/*
  Each chapter has its own musical theme:
    hujan  (Bab 1)  lo-fi piano, bells, rain and vinyl crackle, 72 bpm
    pagi   (Bab 2)  plucked arpeggios over a soft pad, birdsong and breeze, 92 bpm
    malam  (Bab 3)  electric-piano jazz chords, walking bass, brushes, crickets and city hum, 58 bpm
  The record player (shop item) unlocks "piringan", a slow piano piece that can replace any theme.
*/
const TEMA_MUSIK = {
  hujan: { nama: 'Sore di warung', tempo: 72, akor: [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]] },
  pagi:  { nama: 'Pagi di toko bunga', tempo: 92, akor: [[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,64]] },
  malam: { nama: 'Malam di Ruang Nada', tempo: 58, akor: [[50,53,57,60,64],[43,53,57,59,64],[48,52,55,59,62],[45,49,55,58,61]] },
  piringan: { nama: 'Piringan: hujan larut', tempo: 62, akor: [[57,60,64,67],[50,53,57,60],[55,59,62,65],[48,52,55,59]] }
};
const PENTA = [72, 74, 76, 79, 81, 84];
const temaBab = () => bab().tema || 'hujan';
const temaMusik = () => (S.lagu === 2 && S.punya.includes('piringan') ? 'piringan' : temaBab());

function audioMulai() {
  if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  let c;
  try { c = A.ctx = new AC(); } catch (e) { return; }
  const komp = c.createDynamicsCompressor();
  komp.connect(c.destination);
  A.master = c.createGain(); A.master.gain.value = 0.9; A.master.connect(komp);
  A.musik = c.createGain();
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.Q.value = 0.4;
  A.musik.connect(lp); lp.connect(A.master);
  const verb = c.createConvolver(); verb.buffer = impuls(c, 2.8);
  const kirimV = c.createGain(); kirimV.gain.value = 0.32;
  lp.connect(kirimV); kirimV.connect(verb); verb.connect(A.master);
  A.suasana = c.createGain(); A.suasana.connect(A.master);
  A.efek = c.createGain(); A.efek.connect(A.master);
  A.derau = derauPutih(c, 1);
  A.cokelat = derauCokelat(c, 4);
  // one ambience bus per theme, cross-faded by aturTema()
  A.amb = {};
  ['hujan', 'pagi', 'malam'].forEach(k => { const g = c.createGain(); g.gain.value = 0; g.connect(A.suasana); A.amb[k] = g; });
  buatHujan(A.amb.hujan); buatKresek(A.amb.hujan);
  buatAngin(A.amb.pagi);
  buatDengungKota(A.amb.malam);
  aturVolume();
  A.ketuk = 0; A.beat = 0; A.next = c.currentTime + 0.2;
  aturTema(true);
  A.timer = setInterval(jadwal, 50);
}
function impuls(c, detik) {
  const len = c.sampleRate * detik, b = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  return b;
}
function derauPutih(c, detik) {
  const b = c.createBuffer(1, c.sampleRate * detik, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function derauCokelat(c, detik) {
  const b = c.createBuffer(1, c.sampleRate * detik, c.sampleRate), d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  return b;
}
function sumberLoop(buf) { const s = A.ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s; }
function rantai(...nodes) { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[nodes.length - 1]; }
function filter(type, f, q) { const x = A.ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q) x.Q.value = q; return x; }
function gain(v) { const g = A.ctx.createGain(); g.gain.value = v; return g; }

/* ---- ambience ---- */
function buatHujan(bus) {
  rantai(sumberLoop(A.cokelat), filter('lowpass', 1100), filter('highpass', 140), gain(0.55), bus);
  rantai(sumberLoop(derauPutih(A.ctx, 3)), filter('highpass', 5200), gain(0.035), bus);
}
function buatKresek(bus) {
  const c = A.ctx, len = c.sampleRate * 5, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i += Math.floor(c.sampleRate * (0.05 + Math.random() * 0.3))) {
    const amp = 0.2 + Math.random() * 0.5;
    for (let k = 0; k < 40 && i + k < len; k++) d[i + k] = (Math.random() * 2 - 1) * amp * (1 - k / 40);
  }
  rantai(sumberLoop(b), filter('highpass', 1400), gain(0.05), bus);
}
function buatAngin(bus) {
  const bp = filter('bandpass', 500, 0.7);
  rantai(sumberLoop(A.cokelat), bp, gain(0.22), bus);
  const lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.07;
  const dalam = gain(260); lfo.connect(dalam); dalam.connect(bp.frequency); lfo.start();
}
function buatDengungKota(bus) {
  rantai(sumberLoop(A.cokelat), filter('lowpass', 170), gain(0.3), bus);
}
function kicau(t) {
  const c = A.ctx, n = 2 + Math.floor(Math.random() * 3), f0 = 2600 + Math.random() * 1400;
  for (let i = 0; i < n; i++) {
    const s = t + i * (0.09 + Math.random() * 0.05);
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f0, s); o.frequency.exponentialRampToValueAtTime(f0 * (1.25 + Math.random() * 0.3), s + 0.06);
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.035, s + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, s + 0.08);
    o.connect(g); g.connect(A.amb.pagi); o.start(s); o.stop(s + 0.1);
  }
}
function jangkrik(t) {
  const c = A.ctx, n = 3 + Math.floor(Math.random() * 4), f = 4200 + Math.random() * 500;
  for (let i = 0; i < n; i++) {
    const s = t + i * 0.055;
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.012, s + 0.005); g.gain.linearRampToValueAtTime(0, s + 0.03);
    o.connect(g); g.connect(A.amb.malam); o.start(s); o.stop(s + 0.04);
  }
}

/* ---- instruments ---- */
function piano(n, t, dur, vel) {
  const c = A.ctx, f = midi(n), g = c.createGain();
  const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
  const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f; o2.detune.value = 5;
  const g2 = gain(0.25);
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(A.musik);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vel, t + 0.02);
  g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.7);
  g.gain.linearRampToValueAtTime(0, t + dur);
  o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
}
function lonceng(n, t, vel, bus) {
  const c = A.ctx, f = midi(n), g = c.createGain();
  const o1 = c.createOscillator(); o1.frequency.value = f;
  const o2 = c.createOscillator(); o2.frequency.value = f * 2.01;
  const g2 = gain(0.18);
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus || A.musik);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vel, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 1.8);
  o1.start(t); o2.start(t); o1.stop(t + 1.9); o2.stop(t + 1.9);
}
function petik(n, t, vel) {
  const c = A.ctx, f = midi(n), g = c.createGain();
  const o1 = c.createOscillator(); o1.type = 'triangle'; o1.frequency.value = f;
  const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
  const g2 = gain(0.3);
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(A.musik);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.55);
  o1.start(t); o2.start(t); o1.stop(t + 0.6); o2.stop(t + 0.6);
}
function pad(n, t, dur, vel) {
  const c = A.ctx, g = c.createGain();
  [-6, 6].forEach(dt => { const o = c.createOscillator(); o.frequency.value = midi(n); o.detune.value = dt; o.connect(g); o.start(t); o.stop(t + dur + 0.1); });
  g.connect(A.musik);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + dur * 0.35); g.gain.linearRampToValueAtTime(0, t + dur);
}
function rhodes(n, t, dur, vel) {
  const c = A.ctx, f = midi(n);
  const car = c.createOscillator(); car.frequency.value = f;
  const mod = c.createOscillator(); mod.frequency.value = f;
  const idx = c.createGain();
  idx.gain.setValueAtTime(f * 1.4, t); idx.gain.exponentialRampToValueAtTime(f * 0.08, t + 0.9);
  mod.connect(idx); idx.connect(car.frequency);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.012);
  g.gain.exponentialRampToValueAtTime(vel * 0.3, t + 1.4); g.gain.linearRampToValueAtTime(0, t + dur);
  const trem = c.createOscillator(); trem.frequency.value = 4.2;
  const tg = gain(vel * 0.18); trem.connect(tg); tg.connect(g.gain);
  car.connect(g); g.connect(A.musik);
  [car, mod, trem].forEach(o => { o.start(t); o.stop(t + dur + 0.05); });
}
function bas(n, t, dur, vel) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain(), lp = filter('lowpass', 420);
  o.type = 'triangle'; o.frequency.value = midi(n);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(lp); lp.connect(g); g.connect(A.musik); o.start(t); o.stop(t + dur + 0.05);
}
function sikat(t, vel) {
  const c = A.ctx, s = c.createBufferSource(); s.buffer = A.derau;
  const bp = filter('bandpass', 5500, 0.8), g = c.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.22);
  s.connect(bp); bp.connect(g); g.connect(A.musik); s.start(t, Math.random() * 0.5, 0.25);
}

/* ---- sequencer ---- */
function mainkan(tema, t, b, ketukan) {
  const L = TEMA_MUSIK[tema], akor = L.akor[Math.floor(b / 4) % L.akor.length], awalBar = b % 4 === 0;
  if (tema === 'hujan' || tema === 'piringan') {
    if (awalBar) {
      akor.forEach((n, i) => piano(n, t + i * 0.035 + Math.random() * 0.01, ketukan * 3.8, 0.055));
      piano(akor[0] - 12, t, ketukan * 3.8, 0.07);
    }
    if (!awalBar && Math.random() < (tema === 'hujan' ? 0.28 : 0.18)) lonceng(PENTA[Math.floor(Math.random() * PENTA.length)], t + (Math.random() < 0.5 ? 0 : ketukan / 2), 0.045);
  } else if (tema === 'pagi') {
    if (awalBar) { akor.forEach(n => pad(n, t, ketukan * 4, 0.012)); bas(akor[0] - 12, t, ketukan * 1.8, 0.07); }
    if (b % 4 === 2) bas(akor[0] - 12, t, ketukan * 1.2, 0.05);
    const pola = [0, 1, 2, 3, 2, 1, 3, 2], i = (b % 4) * 2;
    petik(akor[pola[i]] + 12, t, 0.05);
    if (Math.random() < 0.85) petik(akor[pola[i + 1]] + 12, t + ketukan / 2, 0.04);
  } else if (tema === 'malam') {
    if (awalBar) akor.slice(1).forEach((n, i) => rhodes(n, t + i * 0.02, ketukan * 3.6, 0.03));
    if (b % 4 === 2 && Math.random() < 0.5) akor.slice(2).forEach(n => rhodes(n, t + ketukan / 2, ketukan * 1.2, 0.018));
    const langkah = [0, 7, 12, 10][b % 4];
    bas(akor[0] - 12 + langkah, t, ketukan * 0.9, 0.09);
    if (b % 2 === 1) sikat(t, 0.02); else sikat(t, 0.008);
  }
}
function jadwal() {
  const c = A.ctx, tema = temaMusik(), ketukan = 60 / TEMA_MUSIK[tema].tempo;
  if (A.next < c.currentTime - 1) A.next = c.currentTime + 0.05;
  while (A.next < c.currentTime + 0.25) {
    mainkan(tema, A.next, A.beat, ketukan);
    A.next += ketukan; A.beat++;
  }
  const amb = temaBab();
  if (amb === 'pagi' && Math.random() < 0.018) kicau(c.currentTime + 0.05);
  if (amb === 'malam' && Math.random() < 0.03) jangkrik(c.currentTime + 0.05);
}
/* Cross-fade the ambience to the current chapter's theme */
function aturTema(segera) {
  if (!A.ctx) return;
  const tema = temaBab(), t = A.ctx.currentTime;
  if (A.tema !== tema) A.beat = 0;
  A.tema = tema;
  for (const k in A.amb) A.amb[k].gain.setTargetAtTime(k === tema ? 1 : 0, t, segera ? 0.05 : 1.2);
}
function aturVolume() {
  if (!A.ctx) return;
  const t = A.ctx.currentTime;
  A.musik.gain.setTargetAtTime(S.vol.musik * 0.9, t, 0.1);
  A.suasana.gain.setTargetAtTime(S.vol.hujan * 0.8, t, 0.1);
  A.efek.gain.setTargetAtTime(S.vol.efek, t, 0.05);
}
function sfxKetik() {
  if (!A.ctx) return;
  const c = A.ctx, now = c.currentTime;
  if (now - A.ketuk < 0.035) return;
  A.ketuk = now;
  const s = c.createBufferSource(); s.buffer = A.derau;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200 + Math.random() * 1800; bp.Q.value = 2.5;
  const g = c.createGain();
  g.gain.setValueAtTime(0.09 + Math.random() * 0.04, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
  s.connect(bp); bp.connect(g); g.connect(A.efek);
  s.start(now, Math.random() * 0.5, 0.05);
}
const tLonceng = (list) => { if (!A.ctx) return; const t = A.ctx.currentTime; list.forEach(([n, d, v]) => lonceng(n, t + d, v, A.efek)); };
const sfxPesan = () => tLonceng([[81, 0, 0.12], [88, 0.12, 0.1]]);
const sfxKirim = () => tLonceng([[76, 0, 0.08], [72, 0.08, 0.06]]);
const sfxSukses = () => tLonceng([[72, 0, 0.11], [76, 0.11, 0.11], [79, 0.22, 0.11], [84, 0.33, 0.11]]);
const sfxKoin = () => tLonceng([[93, 0, 0.08], [100, 0.07, 0.07]]);
const sfxRevisi = () => tLonceng([[76, 0, 0.08], [74, 0.16, 0.07]]);
const sfxFile = () => tLonceng([[84, 0, 0.07], [88, 0.06, 0.06], [91, 0.12, 0.05]]);
function sfxDengkur() {
  if (!A.ctx) return;
  const c = A.ctx, t = c.currentTime;
  const s = c.createBufferSource(); s.buffer = derauCokelat(c, 2);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
  const g = c.createGain(); g.gain.value = 0;
  const lfo = c.createOscillator(); lfo.frequency.value = 24;
  const dalam = c.createGain(); dalam.gain.value = 0.5;
  lfo.connect(dalam); dalam.connect(g.gain);
  const env = c.createGain();
  env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(1.2, t + 0.3); env.gain.linearRampToValueAtTime(0, t + 1.9);
  s.connect(lp); lp.connect(g); g.connect(env); env.connect(A.efek);
  s.start(t); lfo.start(t); s.stop(t + 2); lfo.stop(t + 2);
}

/* =========================================================
   SCENE
   ========================================================= */
function buatHujanVisual() {
  const g = $('rainFall'); let html = '';
  for (let copy = 0; copy < 2; copy++) {
    for (let i = 0; i < 46; i++) {
      const x = 128 + Math.random() * 350, y = 78 - 250 + Math.random() * 250 + copy * 250;
      html += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x - 3).toFixed(1)}" y2="${(y + 13).toFixed(1)}"/>`;
    }
  }
  g.innerHTML = html;
}
function aturJam() {
  const d = new Date(), m = d.getMinutes(), h = d.getHours() % 12 + m / 60;
  $('jarumMenit').setAttribute('transform', `rotate(${m * 6} 890 76)`);
  $('jarumJam').setAttribute('transform', `rotate(${h * 30} 890 76)`);
}
const ANGKA = ['Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima'];
const SUASANA_JUDUL = {
  hujan: 'Hujan turun, teh masih hangat',
  pagi: 'Matahari pagi masuk lewat jendela, dan burung-burung sudah ramai',
  malam: 'Malam cerah, dan jangkrik mulai bernyanyi'
};
function aturScene() {
  const n = bab().tugas.length, tema = temaBab(), su = SUASANA[tema], langit = bab().langit;
  const idx = babTamat() ? 6 : Math.min(5, Math.round(S.tugas * 5 / Math.max(1, n - 1)));
  $('langit1').setAttribute('stop-color', langit[idx][0]);
  $('langit2').setAttribute('stop-color', langit[idx][1]);
  $('bayangBulan').setAttribute('fill', langit[idx][0]);
  $('dinding').setAttribute('fill', su.dinding);
  $('lantai').setAttribute('fill', su.lantai);
  $('cahayaLampu').setAttribute('opacity', su.lampu);
  $('rainFall').style.display = su.hujan ? '' : 'none';
  $('lapisPagi').style.display = su.pagi ? '' : 'none';
  $('lapisMalam').style.display = su.malam && idx < 6 ? '' : 'none';
  const kota = su.hujan ? (idx >= 2 && idx < 6 ? 0.4 + idx * 0.1 : 0) : su.malam ? (idx < 6 ? 0.9 : 0.35) : 0;
  $('lampuKota').setAttribute('opacity', kota.toFixed(2));
  $('scene').setAttribute('aria-label', 'Studio kecil: ' + su.nama.toLowerCase());
  SEMUA_ITEM.forEach(id => { const el = $('item-' + id); if (el) el.classList.toggle('on', S.punya.includes(id)); });
  $('piring').classList.toggle('jalan', temaMusik() === 'piringan');
  const adaPesan = adaBabBaru() || (!babTamat() && S.intro < S.tugas);
  $('hpNotif').style.display = adaPesan ? '' : 'none';
  $('hpLayar').setAttribute('fill', adaPesan ? '#CFE0E8' : '#39425C');
  $('uangStudio').textContent = rupiah(S.uang);
  $('uangKerja').textContent = rupiah(S.uang);
  let bisik = '';
  if (semuaTamat()) bisik = `${ANGKA[S.tamat.length] || S.tamat.length} proyek selesai. Klien berikutnya sedang dalam perjalanan.`;
  else if (adaBabBaru()) bisik = 'Ponselmu bergetar. Ada klien baru.';
  else if (adaPesan) bisik = `Ponselmu bergetar. Ada pesan dari ${klien().nama}.`;
  else if (S.punya.length === 0 && S.uang >= 40000) bisik = 'Tabunganmu cukup untuk menghias studio. Cek rak toko.';
  $('bisikan').textContent = bisik;
  $('teksJudul').textContent = S.tamat.length === 0
    ? `Studio kecilmu sudah siap. ${SUASANA_JUDUL[tema]}, dan klien pertamamu sebentar lagi mengirim pesan.`
    : `Studio kecilmu menunggu. ${SUASANA_JUDUL[tema]}. Pekerjaan berikutnya ada di laptop.`;
  aturTema();
}

/* =========================================================
   SCREENS
   ========================================================= */
function tampil(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
  $('scene').style.display = id === 'work' ? 'none' : '';
  if (id === 'work') { $('kode').focus({ preventScroll: true }); segarkan(0); }
  aturScene();
}

function tombolJudul() {
  const box = $('titleButtons');
  box.innerHTML = '';
  const ada = !!S.nama;
  const b1 = document.createElement('button');
  b1.className = 'tombol'; b1.textContent = ada ? 'Lanjutkan' : 'Mulai';
  b1.onclick = () => { audioMulai(); if (ada) tampil('studio'); else { $('inNama').value = ''; $('dNama').showModal(); } };
  box.appendChild(b1);
  if (ada) {
    const b2 = document.createElement('button');
    b2.className = 'tombol garis'; b2.textContent = 'Mulai dari awal';
    b2.onclick = ulangDariAwal;
    box.appendChild(b2);
  }
}

/* In-page confirmation (window.confirm is blocked in sandboxed previews) */
function tanya(judul, teks, labelYa) {
  return new Promise(resolve => {
    const d = $('dTanya');
    $('tanyaJudul').textContent = judul;
    $('tanyaTeks').textContent = teks;
    $('tanyaYa').textContent = labelYa;
    d.returnValue = '';
    d.addEventListener('close', () => resolve(d.returnValue === 'ya'), { once: true });
    d.showModal();
  });
}

async function ulangDariAwal() {
  const ok = await tanya('Mulai dari awal?', 'Semua progres, tabungan, dekorasi studio, dan kode di semua proyek akan dihapus. Ini tidak bisa dibatalkan.', 'Hapus dan mulai lagi');
  if (!ok) return;
  sesi++;
  sibuk = false;
  clearTimeout(simpanTimer); clearTimeout(segarTimer);
  const vol = S.vol;
  S = baru(); S.vol = vol;
  try { localStorage.removeItem(SIMPAN_KEY); } catch (e) {}
  simpan(true);
  document.querySelectorAll('dialog[open]').forEach(d => d.close());
  $('mengetik').classList.remove('on');
  $('pratinjau').srcdoc = '';
  memPratinjau = {};
  if (A.ctx) A.beat = 0;
  muatUlangUI();
  tampil('title');
}

$('formNama').addEventListener('submit', e => {
  const v = $('inNama').value.trim();
  if (!v) { e.preventDefault(); return; }
  S.nama = v; simpan(true); tombolJudul(); tampil('studio');
});

/* =========================================================
   WORK: chat, checklist, editor, preview
   ========================================================= */
function bubble(from, text) {
  const el = document.createElement('div');
  el.className = 'bubble ' + from;
  el.textContent = text;
  const chat = $('chat');
  chat.insertBefore(el, $('mengetik'));
  chat.scrollTop = chat.scrollHeight;
}
function renderChat() {
  $('chat').querySelectorAll('.bubble').forEach(b => b.remove());
  (S.log[S.bab] || []).forEach(m => bubble(m.dari, m.teks));
}
function catat(dari, teks) {
  const log = S.log[S.bab] || (S.log[S.bab] = []);
  log.push({ dari, teks });
  if (log.length > 150) S.log[S.bab] = log.slice(-150);
  simpan(); bubble(dari, teks);
}

let sibuk = false;
async function klienBicara(baris) {
  const my = sesi;
  sibuk = true; $('btnKirim').disabled = true;
  for (const b of baris) {
    $('mengetik').classList.add('on'); $('chat').scrollTop = $('chat').scrollHeight;
    await tunggu(Math.min(2600, 700 + b.length * 18));
    if (my !== sesi) return false;
    $('mengetik').classList.remove('on');
    catat('klien', isi(b)); sfxPesan();
    await tunggu(350);
    if (my !== sesi) return false;
  }
  sibuk = false; $('btnKirim').disabled = babTamat();
  return true;
}

async function perkenalanTugas() {
  if (babTamat() || S.intro >= S.tugas) return;
  const my = sesi, t = tugasIni();
  S.intro = S.tugas; simpan(true); aturScene();
  if (!(await klienBicara(t.pesan))) return;
  if (t.aset && my === sesi) {
    catat('sistem', `${klien().nama} mengirim ${t.aset.length} file: ${t.aset.join(', ')}`);
    sfxFile(); renderAset();
  }
}

function renderHeader() {
  const k = klien(), n = bab().tugas.length;
  $('judulTugas').textContent = babTamat() ? 'Proyek selesai' : tugasIni().judul;
  $('infoTugas').textContent = babTamat() ? `${k.usaha} · ${n} pesanan selesai` : `Bab ${S.bab + 1} · Pesanan ${S.tugas + 1} dari ${n} · ${k.usaha}`;
  $('chatAvatar').textContent = k.huruf;
  $('chatAvatar').style.background = k.warna;
  $('chatNama').textContent = k.nama;
  $('chatUsaha').textContent = k.usaha;
  $('stickyJudul').textContent = 'Yang diminta ' + k.nama;
  $('btnKirim').textContent = 'Kirim ke ' + k.nama;
  $('urlBar').textContent = k.url;
  $('btnKirim').disabled = babTamat() || sibuk;
}

function renderAset() {
  const box = $('aset'), list = asetTersedia();
  box.innerHTML = list.map(f => `<button class="chip" data-f="${esc(f)}" title="Buka ${esc(f)}">${ASET_URI[f] ? `<img src="${ASET_URI[f]}" alt="">` : '<span class="ikon-file">{ }</span>'}${esc(f)}</button>`).join('');
  box.querySelectorAll('.chip').forEach(b => b.onclick = () => bukaFile(b.dataset.f));
}
function bukaFile(f) {
  const box = $('isiFile');
  const isiFile = ASET_URI[f] ? `<img src="${ASET_URI[f]}" alt="Pratinjau ${esc(f)}">` : `<pre>${esc(ASET_TEKS[f] || '')}</pre>`;
  box.innerHTML = `<h2>${esc(f)}</h2><p>File dari ${esc(klien().nama)}. Pakai nama file ini persis seperti tertulis.</p>
    <div class="pratinjau-file">${isiFile}</div>
    <div class="baris-tombol"><button class="tombol garis" id="btnTutupFile">Tutup</button><button class="tombol" id="btnSisipFile">Sisipkan nama file</button></div>`;
  box.querySelector('#btnTutupFile').onclick = () => $('dFile').close();
  box.querySelector('#btnSisipFile').onclick = () => { $('dFile').close(); pilihTab('p-kode'); ta.focus(); sisip(f); };
  $('dFile').showModal();
}

let hasilTerakhir = [];
function renderCeklis(hasil) {
  const ul = $('ceklis');
  if (babTamat()) { ul.innerHTML = '<li class="ok"><span class="cek">✓</span><span>Semua pesanan selesai. Terima kasih!</span></li>'; return; }
  ul.innerHTML = tugasIni().reqs.map((r, i) =>
    `<li class="${hasil[i] ? 'ok' : ''}"><span class="cek">${hasil[i] ? '✓' : ''}</span><span>${esc(r.label)}</span></li>`).join('');
}

/* ---- syntax highlight overlay ---- */
const POLA = /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/)|(<\/?[a-zA-Z!][\w-]*)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|(\b[a-zA-Z-]+(?==))|(\b(?:const|let|var|function|return|if|else|document|addEventListener|getElementById|textContent|forEach|innerHTML|preventDefault|value)\b)|([{}>;])/g;
function warnai(src) {
  let out = '', last = 0, m;
  POLA.lastIndex = 0;
  while ((m = POLA.exec(src))) {
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? 't-kom' : m[2] ? 't-tag' : m[3] ? 't-str' : m[4] ? 't-attr' : m[5] ? 't-kw' : 't-p';
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last)) + '\n';
}
function sorot() { $('sorot').innerHTML = warnai($('kode').value); sinkronGulir(); }
function sinkronGulir() { const t = $('kode'), pre = $('sorot'); pre.scrollTop = t.scrollTop; pre.scrollLeft = t.scrollLeft; }

const ta = $('kode');
ta.addEventListener('input', () => { S.kode[S.bab] = ta.value; sorot(); simpan(); segarkan(); });
ta.addEventListener('scroll', sinkronGulir);
ta.addEventListener('keydown', e => {
  if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') sfxKetik();
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault(); sisip('  ');
  } else if (e.key === 'Enter') {
    const v = ta.value, awal = v.lastIndexOf('\n', ta.selectionStart - 1) + 1;
    const indent = (v.slice(awal).match(/^[ \t]*/) || [''])[0];
    const sebelum = v.slice(0, ta.selectionStart).trimEnd();
    const tambah = /(<(?!\/)[a-zA-Z][^>]*[^\/]>|\{|\[)$/.test(sebelum) && !/<(br|img|meta|link|input|hr)\b[^>]*>$/i.test(sebelum) ? '  ' : '';
    e.preventDefault(); sisip('\n' + indent + tambah);
  }
});
function sisip(teks) {
  const s = ta.selectionStart, e = ta.selectionEnd;
  ta.setRangeText(teks, s, e, 'end');
  ta.dispatchEvent(new Event('input'));
}

/* ---- preview + checking ---- */
/*
  Runtime injected at the top of the player's page (preview and checker).
  It captures errors, silences blocking dialogs, and simulates the browser
  services a real site would use:
    - fetch():        serves the files the client sent (for example jadwal.json).
                      In the "offline" pass every request fails, like a dead connection.
    - localStorage:   an in-memory store. The checker's "ulang" (reopen) pass starts
                      with whatever the normal pass saved, so "remember my choice" can be tested.
*/
const SHIM = function (cfg) {
  var w = window, has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  w.__errs = []; w.__pass = cfg.pass;
  w.onerror = function (m) { w.__errs.push(String(m)); };
  w.addEventListener('unhandledrejection', function (e) { var r = e.reason; w.__errs.push('Uncaught (in promise) ' + (r && r.message ? r.message : r)); });
  w.alert = function () {}; w.confirm = function () { return true; }; w.prompt = function () { return ''; };
  w.addEventListener('submit', function (e) { w.__cegah = e.defaultPrevented; });
  var mem = {}; for (var k in cfg.seed) mem[k] = String(cfg.seed[k]);
  w.__mem = mem;
  var lapor = function () { if (cfg.preview) try { parent.postMessage({ __cq: 'mem', mem: mem }, '*'); } catch (e) {} };
  var store = {
    getItem: function (k) { return has(mem, k) ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); lapor(); },
    removeItem: function (k) { delete mem[k]; lapor(); },
    clear: function () { for (var k in mem) delete mem[k]; lapor(); },
    key: function (i) { var ks = Object.keys(mem); return i < ks.length ? ks[i] : null; }
  };
  Object.defineProperty(store, 'length', { get: function () { return Object.keys(mem).length; } });
  try { Object.defineProperty(w, 'localStorage', { value: store, configurable: true }); } catch (e) {}
  w.fetch = function (url) {
    var nama = String(url && url.url || url).split('?')[0].replace(/^\.?\//, '');
    return new Promise(function (ok, gagal) {
      setTimeout(function () {
        if (cfg.pass === 'offline') return gagal(new TypeError('Failed to fetch'));
        if (has(cfg.files, nama)) ok(new Response(cfg.files[nama], { status: 200, headers: { 'Content-Type': 'application/json' } }));
        else ok(new Response('Not found', { status: 404, statusText: 'Not Found' }));
      }, 30);
    });
  };
}.toString();

function penangkap(opsi) {
  const files = {};
  asetTersedia().forEach(f => { if (ASET_TEKS[f]) files[f] = ASET_TEKS[f]; });
  const cfg = JSON.stringify({ pass: opsi.pass || 'normal', seed: opsi.seed || {}, files, preview: !!opsi.preview }).replace(/</g, '\\u003c');
  return '<script data-cq>(' + SHIM + ')(' + cfg + ');<\/script>' +
    (opsi.checker ? '<style data-cq>*,*::before,*::after{transition:none!important;animation:none!important}</style>' : '');
}
function suntikAset(code, semua) {
  const ada = semua ? Object.keys(ASET_URI) : asetTersedia();
  return code.replace(/(["'(`])\s*(?:\.\/)?([a-z]+\.svg)\s*(["')`])/g, (m, a, f, b) => (ada.includes(f) ? a + ASET_URI[f] + b : m));
}
function sisipKepala(code, tambahan) {
  if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, m => m + tambahan);
  if (/<!doctype[^>]*>/i.test(code)) return code.replace(/<!doctype[^>]*>/i, m => m + tambahan);
  return tambahan + code;
}
function suntik(code, opsi = {}) { return sisipKepala(suntikAset(code), penangkap(opsi)); }

/* The preview keeps its own localStorage between edits, like a real browser tab would. */
let memPratinjau = {};
window.addEventListener('message', e => {
  if (e.source === $('pratinjau').contentWindow && e.data && e.data.__cq === 'mem') memPratinjau = Object.assign({}, e.data.mem);
});

let segarTimer;
function segarkan(jeda = 500) {
  clearTimeout(segarTimer);
  segarTimer = setTimeout(() => { $('pratinjau').srcdoc = suntik(kodeIni(), { preview: true, seed: memPratinjau }); periksa(); }, jeda);
}

/* Each check runs in a fresh hidden iframe, so overlapping checks never disturb each other. */
function muatPemeriksa(html) {
  return new Promise(resolve => {
    const fr = document.createElement('iframe');
    fr.className = 'checker';
    fr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    fr.setAttribute('aria-hidden', 'true');
    fr.tabIndex = -1;
    let beres = false;
    const lanjut = () => { if (beres) return; beres = true; setTimeout(() => resolve(fr), 180); };
    fr.onload = () => { fr.onload = null; lanjut(); };
    setTimeout(lanjut, 4000);
    fr.srcdoc = html;
    document.body.appendChild(fr);
  });
}
function tampilKonsol(errs) {
  const k = $('konsol');
  k.textContent = errs.length ? 'Konsol: ' + errs[0] : 'Konsol: tidak ada error.';
  k.classList.toggle('err', errs.length > 0);
}
/*
  Requirements can run in up to three passes:
    normal   the page as a visitor sees it
    ulang    the page reopened, with the storage saved during the normal pass
    offline  the page with every fetch() failing
*/
let jalan = 0, janjiTerakhir = null;
function periksa() {
  const my = ++jalan;
  const p = (async () => {
    const src = kodeIni();
    const reqs = babTamat() ? [] : tugasIni().reqs;
    const hasil = reqs.map(() => false);
    let seed = {}, errsNormal = [];
    for (const pass of ['normal', 'ulang', 'offline']) {
      const idx = reqs.map((r, i) => ((r.pass || 'normal') === pass ? i : -1)).filter(i => i >= 0);
      if (pass !== 'normal' && idx.length === 0) continue;
      const fr = await muatPemeriksa(suntik(src, { checker: true, pass, seed: pass === 'ulang' ? seed : {} }));
      if (my !== jalan) { fr.remove(); return janjiTerakhir; }
      const w = fr.contentWindow, d = fr.contentDocument;
      if (w && d) {
        idx.forEach(i => { try { hasil[i] = !!reqs[i].test(d, w, src); } catch (e) { hasil[i] = false; } });
        if (pass === 'normal') { errsNormal = (w.__errs || []).slice(); seed = w.__snapshot || Object.assign({}, w.__mem || {}); }
      }
      fr.remove();
    }
    if (my !== jalan) return janjiTerakhir;
    tampilKonsol(errsNormal);
    hasilTerakhir = hasil;
    renderCeklis(hasil);
    return hasil;
  })();
  janjiTerakhir = p;
  return p;
}

async function kirim() {
  if (sibuk || babTamat()) return;
  const my = sesi;
  sibuk = true; $('btnKirim').disabled = true;
  catat('saya', klien().kirimTeks); sfxKirim();
  const hasil = await periksa();
  if (my !== sesi) return;
  const t = tugasIni();
  const kurang = t.reqs.filter((r, i) => !hasil[i] && !(r.kecuali !== undefined && !hasil[r.kecuali]));
  await tunggu(600);
  if (my !== sesi) return;
  sibuk = false;
  if (kurang.length) {
    S.revisi[S.bab] = (S.revisi[S.bab] || 0) + 1;
    const k = klien(), daftar = kurang.map(r => '• ' + r.ask).join('\n');
    if (await klienBicara([k.revisiBuka + (kurang.length > 1 ? k.revisiDaftar + '\n' + daftar : kurang[0].ask + '.'), k.revisiTutup])) sfxRevisi();
    return;
  }
  sfxSukses();
  if (!(await klienBicara(t.sukses))) return;
  sibuk = true; $('btnKirim').disabled = true;
  S.uang += t.bayar;
  catat('sistem', `${rupiah(t.bayar)} masuk ke tabungan`); sfxKoin();
  if (S.tugas + 1 >= bab().tugas.length) {
    S.tamat.push(S.bab); sibuk = false;
    const h = bab().hadiah;
    if (h && !S.punya.includes(h.id)) S.punya.push(h.id);
    simpan(true); renderHeader(); aturScene(); renderCeklis([]);
    await tunggu(900);
    if (my !== sesi) return;
    tampilSelesai(S.bab);
    return;
  }
  S.tugas++;
  simpan(true); renderHeader(); aturScene(); renderCeklis([]);
  await tunggu(1400);
  if (my !== sesi) return;
  catat('sistem', 'Pesanan baru: ' + tugasIni().judul);
  segarkan(0);
  perkenalanTugas();
}

function mulaiBab(b) {
  S.bab = b; S.tugas = 0; S.intro = -1; memPratinjau = {};
  if (typeof S.kode[b] !== 'string') S.kode[b] = BAB[b].starter;
  if (!Array.isArray(S.log[b])) S.log[b] = [];
  simpan(true);
  muatUlangUI();
  if (BAB[b].pembuka && S.log[b].length === 0) catat('sistem', BAB[b].pembuka);
}

function muatUlangUI() {
  ta.value = kodeIni(); sorot();
  renderChat(); renderHeader(); renderCeklis([]); renderAset();
  tombolJudul(); aturScene();
}

/* ---- download ---- */
/* Downloaded sites embed the client's images and data files so they open without a server. */
const SHIM_UNDUH = function (files) {
  var asli = window.fetch;
  window.fetch = function (url) {
    var n = String(url && url.url || url).split('?')[0].replace(/^\.?\//, '');
    if (Object.prototype.hasOwnProperty.call(files, n)) return Promise.resolve(new Response(files[n], { headers: { 'Content-Type': 'application/json' } }));
    return asli.apply(this, arguments);
  };
}.toString();
function unduh(b) {
  let kode = suntikAset(typeof S.kode[b] === 'string' ? S.kode[b] : BAB[b].starter, true);
  if (/fetch\s*\(/.test(kode)) kode = sisipKepala(kode, '\n  <!-- Data dari klien disertakan di sini supaya halaman bisa dibuka tanpa server. -->\n  <script>(' + SHIM_UNDUH + ')(' + JSON.stringify(ASET_TEKS).replace(/</g, '\\u003c') + ');<\/script>');
  const url = URL.createObjectURL(new Blob([kode], { type: 'text/html' }));
  const a = document.createElement('a'); a.href = url; a.download = BAB[b].file;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---- dialogs ---- */
function bukaCatatan() {
  const t = tugasIni(), c = t.catatan;
  const box = $('isiCatatan');
  box.innerHTML = `<h2>${esc(t.judul)}</h2>
    <p>${c.teks}</p>
    <h3>Contoh</h3><pre>${esc(c.contoh)}</pre>
    <h3>Petunjuk</h3>
    <div id="petunjukBox"></div>
    <div class="baris-tombol"><button class="tombol garis" id="btnPetunjuk">Lihat petunjuk</button><button class="tombol" id="btnTutupCatatan">Kembali ke kode</button></div>`;
  let lvl = 0;
  const pb = box.querySelector('#petunjukBox'), bp = box.querySelector('#btnPetunjuk');
  pb.innerHTML = '<p style="color:#5b5e70">Coba dulu sendiri. Kalau buntu, buka petunjuk satu per satu.</p>';
  bp.onclick = () => {
    if (lvl === 0) { pb.innerHTML = `<p class="petunjuk">${esc(c.petunjuk[0])}</p>`; bp.textContent = 'Tunjukkan kodenya'; }
    else { pb.innerHTML = `<p class="petunjuk">${esc(c.petunjuk[0])}</p><pre>${esc(c.petunjuk[1])}</pre>`; bp.remove(); }
    lvl++;
  };
  box.querySelector('#btnTutupCatatan').onclick = () => $('dCatatan').close();
  $('dCatatan').showModal();
}

function bukaToko() {
  const box = $('isiToko');
  box.innerHTML = `<h2>Toko kecil</h2><p>Tabungan: <b>${rupiah(S.uang)}</b></p>
    <ul class="toko">${ITEMS.map(it => {
      const punya = S.punya.includes(it.id);
      return `<li><div><div class="nama">${esc(it.nama)}</div><div class="ket">${esc(it.ket)}</div></div>
        <div class="harga">${punya ? '' : rupiah(it.harga)}</div>
        <button class="tombol ${punya ? 'garis' : ''}" data-beli="${it.id}" ${punya || S.uang < it.harga ? 'disabled' : ''}>${punya ? 'Sudah ada' : 'Beli'}</button></li>`;
    }).join('')}</ul>
    <div class="baris-tombol"><button class="tombol garis" id="btnTutupToko">Tutup</button></div>`;
  box.querySelectorAll('[data-beli]').forEach(b => b.onclick = () => {
    const it = ITEMS.find(x => x.id === b.dataset.beli);
    if (S.uang < it.harga || S.punya.includes(it.id)) return;
    S.uang -= it.harga; S.punya.push(it.id);
    if (it.id === 'piringan') S.lagu = 2;
    simpan(true); sfxKoin(); aturScene(); bukaToko();
  });
  box.querySelector('#btnTutupToko').onclick = () => $('dToko').close();
  if (!$('dToko').open) $('dToko').showModal();
}

function bukaAtur() {
  const box = $('isiAtur');
  const punyaPiringan = S.punya.includes('piringan');
  const porto = S.tamat.slice().sort().map(b => `<li><span>${esc(BAB[b].klien.usaha)}</span><button class="tombol garis" data-unduh="${b}">Unduh</button></li>`).join('');
  box.innerHTML = `<h2>Pengaturan</h2>
    <label>Musik <input type="range" min="0" max="1" step="0.05" data-v="musik" value="${S.vol.musik}"></label>
    <label>Suasana <input type="range" min="0" max="1" step="0.05" data-v="hujan" value="${S.vol.hujan}"></label>
    <label>Efek <input type="range" min="0" max="1" step="0.05" data-v="efek" value="${S.vol.efek}"></label>
    <label>Lagu <select id="pilihLagu" ${punyaPiringan ? '' : 'disabled'}>
      <option value="1" ${S.lagu === 1 ? 'selected' : ''}>Tema bab: ${TEMA_MUSIK[temaBab()].nama}</option>
      <option value="2" ${S.lagu === 2 ? 'selected' : ''}>${punyaPiringan ? 'Piringan: hujan larut' : 'Butuh pemutar piringan'}</option>
    </select></label>
    <h3>Portofolio</h3>
    ${porto ? `<ul class="porto">${porto}</ul>` : '<p style="color:#5b5e70">Website yang sudah selesai akan muncul di sini dan bisa diunduh.</p>'}
    <div class="baris-tombol"><button class="tombol garis" id="btnUlang">Mulai dari awal</button><button class="tombol" id="btnTutupAtur">Selesai</button></div>`;
  box.querySelectorAll('[data-v]').forEach(r => r.oninput = () => { S.vol[r.dataset.v] = +r.value; aturVolume(); simpan(); });
  box.querySelectorAll('[data-unduh]').forEach(b => b.onclick = () => unduh(+b.dataset.unduh));
  box.querySelector('#pilihLagu').onchange = e => { S.lagu = +e.target.value; if (A.ctx) A.beat = 0; aturScene(); simpan(); };
  box.querySelector('#btnUlang').onclick = () => { $('dAtur').close(); ulangDariAwal(); };
  box.querySelector('#btnTutupAtur').onclick = () => $('dAtur').close();
  $('dAtur').showModal();
}

function tampilSelesai(b) {
  const ch = BAB[b], box = $('isiSelesai');
  const total = ch.tugas.reduce((a, t) => a + t.bayar, 0);
  const lanjut = b + 1 < BAB.length
    ? `Ada pesan baru di ponselmu: ${BAB[b + 1].klien.nama} dari ${BAB[b + 1].klien.usaha} ingin bekerja sama.`
    : 'Bab 3 menyusul. Sementara itu, studio ini milikmu. Semua website yang sudah selesai bisa diunduh lagi dari Pengaturan.';
  box.innerHTML = `<h2>${esc(ch.penutup.judul)}</h2>
    <p>${esc(ch.penutup.teks)}</p>
    <div class="invoice">${ch.tugas.map(t => `<div><span>${esc(t.judul)}</span><span>${rupiah(t.bayar)}</span></div>`).join('')}
      <div class="total"><span>Total dibayar</span><span>${rupiah(total)}</span></div></div>
    <p>Revisi selama proyek: ${S.revisi[b] || 0}. Klien sungguhan juga minta revisi, dan itu bagian normal dari pekerjaan.</p>
    ${ch.hadiah ? `<p>${esc(ch.hadiah.teks)}</p>` : ''}
    <p>${esc(lanjut)}</p>
    <div class="baris-tombol"><button class="tombol garis" id="btnUnduh">Unduh website</button><button class="tombol" id="btnKeStudio">Kembali ke studio</button></div>`;
  box.querySelector('#btnUnduh').onclick = () => unduh(b);
  box.querySelector('#btnKeStudio').onclick = () => { $('dSelesai').close(); tampil('studio'); };
  $('dSelesai').showModal();
}

/* ---- wiring ---- */
function aktifkan(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
}
function bukaKerja() {
  audioMulai();
  if (adaBabBaru()) mulaiBab(S.bab + 1);
  tampil('work'); renderHeader(); renderAset(); pilihTab('p-pesan'); perkenalanTugas();
}
aktifkan($('hs-laptop'), bukaKerja);
aktifkan($('hs-hp'), bukaKerja);
aktifkan($('hs-rak'), bukaToko);
aktifkan($('hs-kucing'), () => { audioMulai(); sfxDengkur(); $('bisikan').textContent = 'Mochi mendengkur pelan.'; });
$('btnKerja').onclick = bukaKerja;
$('btnToko').onclick = bukaToko;
$('btnAtur').onclick = bukaAtur;
$('btnMeja').onclick = () => tampil('studio');
$('btnKirim').onclick = kirim;
$('btnCatatan').onclick = bukaCatatan;
/* Laptop mode renders the site at a real laptop width (1024px) and scales it down to fit the panel */
function skalaPratinjau() {
  const st = $('stage'), fr = $('pratinjau');
  const hp = st.classList.contains('hp');
  const w = st.clientWidth - 28, h = st.clientHeight - 28;
  if (hp || w <= 0 || w >= 1024) { st.classList.remove('skala'); fr.style.transform = ''; fr.style.height = ''; return; }
  const k = w / 1024;
  st.classList.add('skala');
  fr.style.transform = `scale(${k})`;
  fr.style.height = (h / k) + 'px';
}
function modePratinjau(hp) {
  $('stage').classList.toggle('hp', hp);
  $('vHp').setAttribute('aria-pressed', String(hp)); $('vLaptop').setAttribute('aria-pressed', String(!hp));
  skalaPratinjau();
}
$('vLaptop').onclick = () => modePratinjau(false);
$('vHp').onclick = () => modePratinjau(true);
if (window.ResizeObserver) new ResizeObserver(skalaPratinjau).observe($('stage'));
window.addEventListener('resize', skalaPratinjau);
function pilihTab(id) {
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.p === id ? 'true' : 'false'));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === id));
  skalaPratinjau();
}
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => pilihTab(b.dataset.p));

/* ---- init ---- */
buatHujanVisual();
aturJam(); setInterval(aturJam, 30000);
if (window.innerWidth < 600) modePratinjau(true);
muatUlangUI();
