/* =========================================================
   CodeQuest — Studio Kecil
   Logika game: data bab, state, pemeriksa kode, audio, adegan studio

   Bab 1: Warung Kopi Senja  (HTML dan CSS dasar, sedikit JS)
   Bab 2: Toko Bunga Laras   (semantik, flexbox, formulir, array)
   Bab 3: Ruang Nada         (variabel CSS, localStorage, fetch,
                              async/await, try/catch, filter, pencarian)
   Bab 4-7: Laundry Kilat, 17-an RT 05, Kopi Alif, Sengata.id
                             (logika, tabel data, debugging, fetch POST)
   Bab 8: Timeline Gagal     (refactoring, DRY, fungsi berparameter, komentar)
   Bab 9: Timeline Sukses    (performa web: gambar, lazy, CSS, skrip)
   Bab 10: The Origin        (portofolio bebas, publish, ending, New Game+)

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
    return (w.__hasilKirim = T.ada(t, 'terima kasih', 'thank you') && t.includes('rani'));
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
  /* Finds a button by its text. Several words may be given (Indonesian and English); an exact match wins. */
  tombol(d, ...kata) {
    const b = T.all(d, 'button');
    return b.find(x => kata.includes(T.text(x))) || b.find(x => kata.some(k => T.text(x).includes(k)));
  },
  /* True when the text contains any of the given phrases (the game accepts Indonesian and English) */
  ada: (teks, ...frasa) => frasa.some(f => String(teks || '').includes(f)),
  tombolMode: d => T.tombol(d, 'mode gelap', 'dark mode') || T.tombol(d, 'gelap', 'dark') || T.tombol(d, 'mode'),
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
  /* ---- Bab 4-7 helpers ---- */
  jeda: ms => new Promise(r => setTimeout(r, ms)),
  labelUntuk(d, inp) {
    const l = (inp.id && d.querySelector(`label[for="${inp.id}"]`)) || inp.closest('label');
    return l ? T.text(l) : '';
  },
  /* Reads a rupiah amount from an element: the last "Rp..." or otherwise the largest number. */
  nilaiRupiah(el) {
    if (!el) return null;
    const t = el.innerText || el.textContent || '';
    const rp = [...t.matchAll(/rp\s*([\d.]+(?:,\d+)?)/gi)];
    const angka = s => parseFloat(s.replace(/\./g, '').replace(',', '.'));
    if (rp.length) return angka(rp[rp.length - 1][1]);
    const semua = [...t.matchAll(/\d[\d.]*(?:,\d+)?/g)].map(m => angka(m[0])).filter(n => !isNaN(n));
    return semua.length ? Math.max(...semua) : null;
  },
  laundry(d, w, { kilo, layanan = 'reguler', antar = false }) {
    const inp = d.querySelector('input[type="number"]');
    if (!inp) return { nilai: null, teks: '' };
    inp.value = kilo === '' ? '' : String(kilo);
    inp.dispatchEvent(new w.Event('input', { bubbles: true }));
    const pola = layanan === 'reguler' ? /regul[ae]r/ : new RegExp(layanan);
    const radio = T.all(d, 'input[type="radio"]').find(r => pola.test(T.labelUntuk(d, r) + ' ' + r.value.toLowerCase()));
    if (radio) { radio.checked = true; radio.dispatchEvent(new w.Event('change', { bubbles: true })); }
    const cek = d.querySelector('input[type="checkbox"]');
    if (cek) { cek.checked = !!antar; cek.dispatchEvent(new w.Event('change', { bubbles: true })); }
    const b = T.tombol(d, 'hitung', 'calculate');
    if (b) b.click();
    const out = d.getElementById('total-harga');
    return { nilai: T.nilaiRupiah(out), teks: out ? T.text(out) : '' };
  },
  sama: (a, b) => a !== null && Math.abs(a - b) < 0.5,
  kolomTabel(d) {
    const baris = T.all(d, 'thead tr');
    return baris.length ? T.all(baris[baris.length - 1], 'th').map(T.text) : [];
  },
  barisTabel: d => T.all(d, 'tbody tr'),
  /* Bab 6: a string compare feature with two text areas */
  cekKeaslian(d, w, a, b) {
    const t = T.all(d, 'textarea');
    const tombol = T.tombol(d, 'cek keaslian', 'check authenticity') || T.tombol(d, 'keaslian', 'authenticity') || T.tombol(d, 'cek', 'check');
    if (t.length < 2 || !tombol) return null;
    t[0].value = a; t[1].value = b;
    tombol.click();
    const out = d.getElementById('hasil-cek');
    return out ? T.text(out) : null;
  },
  /* Bab 7: fill and submit the citizen report form, then wait for fetch to settle */
  async lapor(d, w, { nama = 'Rani', ktp = '6472011203950001', laporan = 'Lampu jalan di gang tiga mati sejak minggu lalu.' } = {}) {
    const f = d.getElementById('form-lapor') || d.querySelector('form');
    if (!f) return false;
    const isiKolom = (sel, v) => { const el = f.querySelector(sel); if (el) { el.value = v; el.dispatchEvent(new w.Event('input', { bubbles: true })); } return !!el; };
    isiKolom('#nama', nama); isiKolom('#ktp', ktp); isiKolom('#laporan', laporan);
    if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    await T.jeda(160);
    return true;
  },
  tujuhLaporan(d, w) {
    if (w.__tujuh) return w.__tujuh;
    const hitung = () => T.all(d, '.pengaduan').length;
    return (w.__tujuh = (async () => {
      const awal = hitung();
      for (let i = 1; i <= 7; i++) await T.lapor(d, w, { nama: 'Warga Uji ' + i, laporan: 'Laporan uji ke-' + i + ': ' + T.kata(12) });
      return {
        awal, akhir: hitung(),
        pesan: T.ada(d.body.innerText.toLowerCase(), 'server sedang bermasalah', 'server is having problems'),
        draft: Object.values(w.__mem).some(v => String(v).includes('Laporan uji ke-7')),
        req: (w.__req || []).filter(r => r.url === 'api/lapor')
      };
    })());
  },
  kata: n => Array.from({ length: n }, (_, i) => ['jalan', 'rusak', 'di', 'gang', 'mawar', 'tolong', 'segera', 'diperbaiki', 'warga', 'khawatir'][i % 10]).join(' '),
  pesanTerlihat(d, w, kata) {
    return T.all(d, 'body *').some(el => el.children.length === 0 && T.terlihat(el, w) && T.text(el).includes(kata)) ||
      d.body.innerText.toLowerCase().includes(kata);
  },
  kartuLengkap: k => !!k.querySelector('h3') && T.text(k).includes('rp') && !!k.querySelector('img') && T.all(k, 'img').every(T.gambarOk),
  /* ---- Bab 8-10 helpers ---- */
  /* Reads a global function or constant from the page, including top-level const/let (not on window) */
  global(w, nama) { try { return w.eval(`typeof ${nama} === "undefined" ? undefined : ${nama}`); } catch (e) { return undefined; } },
  fungsi(w, nama) { const f = T.global(w, nama); return typeof f === 'function' ? f : null; },
  panggil(w, nama, ...args) { const f = T.fungsi(w, nama); if (!f) return undefined; try { return f(...args); } catch (e) { return undefined; } },
  /* Script text of the player's source, without <style> blocks (inline handlers included) */
  tanpaGaya: src => src.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, ''),
  hitungPola: (teks, re) => (teks.match(re) || []).length,
  barisMenu: (d, nama) => T.all(d, '.item').find(r => T.text(r).includes(nama.toLowerCase())),
  /* Bab 8: set one row's quantity, press its own button, read #total */
  itemKasir(d, w, nama, qty) {
    const row = T.barisMenu(d, nama);
    if (!row) return null;
    const inp = row.querySelector('input'), b = row.querySelector('button');
    if (!inp || !b) return null;
    inp.value = String(qty); inp.dispatchEvent(new w.Event('input', { bubbles: true }));
    b.click();
    return T.nilaiRupiah(d.getElementById('total'));
  },
  kasirBenar(d, w, faktor) {
    return MENU_B.every(([n, h], i) => { const q = 2 + (i % 3); return T.sama(T.itemKasir(d, w, n, q), Math.round(h * q * faktor)); });
  },
  isiJumlah(d, w, peta) {
    T.all(d, '.item').forEach(row => {
      const inp = row.querySelector('input'); if (!inp) return;
      const m = MENU_B.find(([n]) => T.text(row).includes(n.toLowerCase()));
      inp.value = String(m && peta[m[0]] ? peta[m[0]] : 0);
      inp.dispatchEvent(new w.Event('input', { bubbles: true }));
    });
  },
  /* Bab 9: the player's source parsed without running it */
  dok(src) { if (T.__dokSrc !== src) { T.__dokSrc = src; T.__dok = new DOMParser().parseFromString(src, 'text/html'); } return T.__dok; },
  namaGambar: i => (i.getAttribute('src') || '').trim().replace(/^\.?\//, ''),
  heroSumber(p) { return p.querySelector('.hero img') || p.querySelector('img'); },
  /* a lazy image may not load in the hidden checker frame, so a known asset counts as shown */
  gambarAda: img => T.gambarOk(img) || (img.loading === 'lazy' && /^data:image\//.test(img.src)),
  semuaGambarAda: (d, min = 7) => { const g = T.all(d, 'img'); return g.length >= min && g.every(T.gambarAda); },
  tidakTerpakai(d) {
    return T.aturan(d).filter(r => {
      if (r.parentStyleSheet && r.parentStyleSheet.ownerNode && r.parentStyleSheet.ownerNode.hasAttribute('data-cq')) return false;
      const s = r.selectorText.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '');
      try { return s.split(',').every(x => !d.querySelector(x.trim() || '*')); } catch (e) { return false; }
    });
  },
  /* A simplified, Lighthouse-style score for Bab 9, from the source and the live stylesheet */
  skorPerforma(d, src) {
    const p = T.dok(src), img = Array.from(p.querySelectorAll('img')), hero = T.heroSumber(p);
    const galeri = img.filter(i => i !== hero);
    const kb = img.reduce((a, i) => a + (ASET_UKURAN[T.namaGambar(i)] || 0), 0);
    const tanpaUkuran = img.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length;
    const tanpaLazy = galeri.filter(i => i.getAttribute('loading') !== 'lazy').length;
    const tanpaAlt = img.filter(i => (i.getAttribute('alt') || '').trim().length < 5).length;
    const css = T.tidakTerpakai(d).length;
    const skripKepala = p.head ? p.head.querySelectorAll('script:not([type="module"])').length > 0 : false;
    const tunggu = /while\s*\(\s*Date\.now\(\)/.test(T.tanpaGaya(src));
    const md = p.querySelector('meta[name="description"]');
    const deskripsi = !!md && (md.getAttribute('content') || '').trim().length >= 30;
    let s = 100;
    s -= Math.min(40, Math.max(0, (kb - 600) / 100));
    s -= tanpaLazy * 3;
    if (hero && hero.getAttribute('loading') === 'lazy') s -= 8;
    if (hero && hero.getAttribute('fetchpriority') !== 'high') s -= 3;
    s -= tanpaUkuran * 2 + css * 2 + tanpaAlt * 3;
    if (skripKepala || tunggu) s -= 15;
    if (!deskripsi) s -= 6;
    return { skor: Math.max(1, Math.min(100, Math.round(s))), kb, tanpaLazy, tanpaUkuran, tanpaAlt, css, pemblokir: skripKepala || tunggu, deskripsi };
  },
  /* Bab 10 */
  jumlahKata: el => (el ? T.text(el).split(/\s+/).filter(Boolean).length : 0),
  heroLengkap(d) {
    const h = d.getElementById('hero');
    return !!h && !!h.querySelector('h1') && T.text(h.querySelector('h1')).length >= 3 && T.all(h, 'p').some(p => T.jumlahKata(p) >= 5);
  },
  karyaLengkap(d) {
    const k = T.all(d, '#karya .karya');
    return k.length >= 3 && k.every(x => !!x.querySelector('h3') && T.text(x.querySelector('h3')).length > 1 && T.all(x, 'p').some(p => T.jumlahKata(p) >= 3));
  },
  tautanKontak(d) {
    return T.all(d, '#kontak a[href]').filter(a => {
      const h = a.getAttribute('href').trim();
      return /^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(h) || /^https:\/\/(api\.)?wa\.me\/62\d{8,13}(\?.*)?$/.test(h);
    });
  },
  /* Presses every button (outside forms) until one of them changes the page */
  interaksi(d, w) {
    if (w.__interaksi) return w.__interaksi;
    const calon = T.all(d, 'button, [onclick], [role="button"]').filter(el => !el.closest('form') && !el.closest('a[href]'));
    const potret = () => d.documentElement.outerHTML + '|' + w.getComputedStyle(d.body).backgroundColor + '|' + w.getComputedStyle(d.body).color;
    let berubah = false;
    for (const el of calon) {
      const sebelum = potret();
      try { el.click(); } catch (e) {}
      if (potret() !== sebelum) { berubah = true; break; }
    }
    return (w.__interaksi = { ada: calon.length > 0, berubah, errs: (w.__errs || []).length });
  },
  responsif(d) {
    let ok = false;
    const jalan = list => {
      for (const r of Array.from(list)) {
        if (r.type === 4) ok = true;
        if (r.style) {
          if (/wrap/.test(r.style.getPropertyValue('flex-wrap')) || /auto-(fit|fill)/.test(r.style.getPropertyValue('grid-template-columns'))) ok = true;
        }
        if (r.cssRules) jalan(r.cssRules);
      }
    };
    for (const s of Array.from(d.styleSheets)) { if (s.ownerNode && s.ownerNode.hasAttribute('data-cq')) continue; try { jalan(s.cssRules); } catch (e) {} }
    return ok;
  },
  viewport: d => /width\s*=\s*device-width/.test((d.querySelector('meta[name="viewport"]') || { content: '' }).content || '')
};

/* ---------- client assets (images sent by the client) ---------- */
const petal = (n, cx, cy, rx, ry, dy, fill, extra = '') =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${cy - dy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra} transform="rotate(${(360 / n) * i} ${cx} ${cy})"/>`).join('');
const ASET_SVG = {
  'mawar.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#F7DCD6"/><path d="M120 176 V96" stroke="#5E8C5A" stroke-width="6"/><path d="M120 138 q-28 -4 -38 -26 q26 0 38 20z" fill="#6E9C66"/><path d="M120 124 q28 -8 38 -30 q-26 4 -38 24z" fill="#6E9C66"/><circle cx="120" cy="70" r="36" fill="#C8434F"/><path d="M92 68 q28 -34 56 0 q-28 18 -56 0z" fill="#A92F3C"/><path d="M104 72 q16 -20 32 0 q-16 12 -32 0z" fill="#E0616B"/><path d="M112 70 q8 -10 16 0" stroke="#A92F3C" stroke-width="3" fill="none"/></svg>`,
  'tulip.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#FBEBC4"/><path d="M120 176 V100" stroke="#5E8C5A" stroke-width="6"/><path d="M118 170 q-40 -20 -40 -66 q30 22 40 58z" fill="#6E9C66"/><path d="M122 164 q34 -18 38 -56 q-28 18 -38 48z" fill="#7FAE72"/><path d="M88 46 L104 70 L120 38 L136 70 L152 46 L150 90 Q120 118 90 90 Z" fill="#F2B632"/><path d="M104 70 L120 38 L136 70 Q120 100 104 70Z" fill="#E09A1E"/></svg>`,
  'matahari.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#DDEBD4"/><path d="M120 176 V110" stroke="#5E8C5A" stroke-width="7"/><path d="M120 150 q-30 -2 -42 -22 q28 -2 42 16z" fill="#6E9C66"/>${petal(14, 120, 72, 9, 20, 34, '#F4C430')}<circle cx="120" cy="72" r="24" fill="#6B4423"/><circle cx="120" cy="72" r="14" fill="#553418"/></svg>`,
  'lili.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180"><rect width="240" height="180" fill="#DCE3EE"/><path d="M120 176 V104" stroke="#5E8C5A" stroke-width="6"/><path d="M120 150 q30 -6 40 -30 q-28 4 -40 24z" fill="#6E9C66"/>${petal(6, 120, 74, 11, 30, 30, '#FFFFFF', 'stroke="#C9D0DE" stroke-width="1.5"')}<g stroke="#8AA27E" stroke-width="2"><line x1="120" y1="74" x2="110" y2="54"/><line x1="120" y1="74" x2="130" y2="54"/><line x1="120" y1="74" x2="120" y2="50"/></g><g fill="#E0A13A"><circle cx="110" cy="53" r="3.5"/><circle cx="130" cy="53" r="3.5"/><circle cx="120" cy="49" r="3.5"/></g></svg>`,
  'ikon-baju.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="24" fill="#DDEFF8"/><path d="M56 34 L36 46 L24 72 L44 80 L48 70 L48 128 L112 128 L112 70 L116 80 L136 72 L124 46 L104 34 Q96 48 80 48 Q64 48 56 34 Z" fill="#4F9BD1"/><path d="M66 36 Q80 56 94 36" fill="none" stroke="#2F6F9F" stroke-width="4"/><g fill="#FFFFFF" opacity=".85"><circle cx="100" cy="98" r="8"/><circle cx="112" cy="90" r="5"/><circle cx="90" cy="112" r="4"/></g></svg>`,
  'logo-rt05.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><circle cx="80" cy="80" r="76" fill="#FFFFFF" stroke="#C62828" stroke-width="8"/><path d="M8 80 A72 72 0 0 1 152 80 Z" fill="#C62828"/><text x="80" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#FFFFFF">RT 05</text><text x="80" y="112" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="#C62828">SENGATA</text></svg>`,
  'logo-sengata.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><path d="M80 8 L144 30 L144 82 Q144 130 80 152 Q16 130 16 82 L16 30 Z" fill="#1F6F5C"/><path d="M32 96 Q56 82 80 96 T128 96" fill="none" stroke="#9FD8C6" stroke-width="7" stroke-linecap="round"/><path d="M40 116 Q60 104 80 116 T120 116" fill="none" stroke="#9FD8C6" stroke-width="6" stroke-linecap="round"/><text x="80" y="74" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="46" fill="#F2E6B8">S</text></svg>`,
  'warung-tutup.svg': `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="320" height="220" fill="#6E6E6E"/><rect y="170" width="320" height="50" fill="#555"/><rect x="60" y="60" width="200" height="120" fill="#8A8A8A"/><path d="M50 64 L270 64 L256 36 L64 36 Z" fill="#9C9C9C"/><g stroke="#6A6A6A" stroke-width="3">${Array.from({ length: 11 }, (_, i) => `<line x1="68" y1="${74 + i * 9}" x2="252" y2="${74 + i * 9}"/>`).join('')}</g><rect x="112" y="98" width="96" height="34" fill="#DADADA" transform="rotate(-4 160 115)"/><text x="160" y="122" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="#333" transform="rotate(-4 160 115)">TUTUP</text><text x="160" y="56" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#444">WARUNG KOPI SENJA</text><g stroke="#AAA" stroke-width="1.2" opacity=".6">${Array.from({ length: 40 }, (_, i) => `<line x1="${(i * 37) % 320}" y1="${(i * 53) % 170}" x2="${(i * 37) % 320 - 4}" y2="${(i * 53) % 170 + 14}"/>`).join('')}</g></svg>`
};
/* ---- Bab 8-10 assets ---- */
/* Bab 8: the menu of Warung Kopi Senja in Timeline B */
const MENU_B = [['Kopi Tubruk', 8000], ['Es Kopi Susu', 15000], ['Teh Tarik', 10000], ['Pisang Goreng', 12000], ['Roti Bakar', 14000],
  ['Kopi Susu Gula Aren', 18000], ['Teh Manis', 6000], ['Mie Rebus', 13000], ['Tahu Isi', 5000], ['Wedang Jahe', 9000]];
/* Bab 9: photos of the franchise. Each photo exists as a heavy -hd.jpg and a light .webp. */
const warungFoto = ({ l1, l2, atap, label, malam, lebar = 600, tinggi = 400 }) => {
  const dx = (lebar - 600) / 2, dy = (tinggi - 400) / 2;
  const garis = Array.from({ length: 7 }, (_, i) => `<path d="M${122 + i * 56} 104 L${146 + i * 56} 104 L${136 + i * 56} 156 L${108 + i * 56} 156 Z"/>`).join('');
  const bintang = malam ? Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 97) % lebar}" cy="${(i * 41) % Math.round(tinggi * 0.45)}" r="${1 + (i % 3) * 0.6}"/>`).join('') : '';
  const lampu = malam ? Array.from({ length: 9 }, (_, i) => `<circle cx="${130 + i * 42}" cy="${176 + (i % 2) * 6}" r="6" fill="#F4C979"/><circle cx="${130 + i * 42}" cy="${176 + (i % 2) * 6}" r="16" fill="#F4C979" opacity=".22"/>`).join('') : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lebar}" height="${tinggi}" viewBox="0 0 ${lebar} ${tinggi}"><defs><linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l1}"/><stop offset="1" stop-color="${l2}"/></linearGradient></defs><rect width="${lebar}" height="${tinggi}" fill="url(#l)"/><g fill="#FFF6DA">${bintang}</g><rect y="${dy + 322}" width="${lebar}" height="${tinggi - dy - 322}" fill="${malam ? '#262838' : '#8C7B6B'}"/><g transform="translate(${dx} ${dy})"><rect x="110" y="150" width="380" height="180" fill="#8B5A3C"/><path d="M90 156 L510 156 L480 104 L120 104 Z" fill="${atap}"/><g fill="#F7F1E3" opacity=".9">${garis}</g><rect x="142" y="196" width="316" height="100" fill="${malam ? '#F4C979' : '#F3D9A8'}" opacity=".92"/><rect x="132" y="290" width="336" height="20" fill="#6A4129"/><g fill="#C98A52"><ellipse cx="200" cy="286" rx="22" ry="8"/><ellipse cx="236" cy="284" rx="18" ry="7"/></g><rect x="300" y="262" width="22" height="26" rx="3" fill="#FFFFFF"/><rect x="303" y="267" width="16" height="17" fill="#C66B3D"/><rect x="360" y="258" width="26" height="30" rx="4" fill="#FFFFFF" opacity=".85"/>${lampu}<text x="300" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${malam ? '#F4EBD0' : '#3B2618'}">${label}</text></g></svg>`;
};
const ASET_SVG_B9 = {
  'hero': warungFoto({ l1: '#F2A36B', l2: '#F8D8A6', atap: '#C8434F', label: 'WARUNG KOPI SENJA', lebar: 1200, tinggi: 600 }),
  'cabang-sengata': warungFoto({ l1: '#E9A97C', l2: '#F3D1A0', atap: '#D08C8C', label: 'Cabang Sengata' }),
  'cabang-bontang': warungFoto({ l1: '#9FC5D8', l2: '#E3EFF3', atap: '#4F9BD1', label: 'Cabang Bontang' }),
  'cabang-samarinda': warungFoto({ l1: '#B7A6D6', l2: '#EBDDEF', atap: '#6E5C8F', label: 'Cabang Samarinda' }),
  'gorengan': `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#F3E3C3"/><rect y="250" width="600" height="150" fill="#9A6744"/><ellipse cx="300" cy="270" rx="220" ry="54" fill="#F7F1E3"/><ellipse cx="300" cy="262" rx="190" ry="40" fill="#EDE3CF"/><g fill="#C98A52" stroke="#A86B35" stroke-width="3"><ellipse cx="220" cy="246" rx="60" ry="24" transform="rotate(-10 220 246)"/><ellipse cx="310" cy="236" rx="56" ry="22" transform="rotate(8 310 236)"/><ellipse cx="390" cy="252" rx="54" ry="22" transform="rotate(-6 390 252)"/><ellipse cx="290" cy="266" rx="60" ry="20"/></g><g fill="#6E9C66"><circle cx="460" cy="220" r="10"/><circle cx="476" cy="232" r="8"/></g><path d="M250 160 q-10 -20 0 -40 q10 -20 0 -40 M300 150 q-10 -20 0 -40 q10 -20 0 -40 M350 160 q-10 -20 0 -40 q10 -20 0 -40" fill="none" stroke="#FFFFFF" stroke-width="5" opacity=".7"/><text x="300" y="370" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#F7F1E3">Gorengan hangat</text></svg>`,
  'es-teh-jumbo': `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#DDEFF8"/><rect y="300" width="600" height="100" fill="#9A6744"/><path d="M228 70 L372 70 L352 330 L248 330 Z" fill="#FFFFFF" opacity=".55" stroke="#AEB6C8" stroke-width="4"/><path d="M236 120 L364 120 L352 326 L248 326 Z" fill="#C66B3D" opacity=".85"/><g fill="#FFFFFF" opacity=".8"><rect x="262" y="140" width="34" height="30" rx="6" transform="rotate(12 279 155)"/><rect x="304" y="176" width="34" height="30" rx="6" transform="rotate(-10 321 191)"/><rect x="270" y="214" width="32" height="28" rx="6"/></g><rect x="318" y="30" width="10" height="170" rx="4" fill="#E57373" transform="rotate(14 323 115)"/><text x="300" y="376" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#F7F1E3">Es teh jumbo</text></svg>`,
  'suasana-malam': warungFoto({ l1: '#1C2340', l2: '#3E4677', atap: '#8B3A4A', label: 'Buka sampai larut', malam: true })
};
/* File sizes in kilobytes, shown in the file viewer and used by the performance score */
const ASET_UKURAN = {
  'hero-hd.jpg': 4200, 'cabang-sengata-hd.jpg': 2800, 'cabang-bontang-hd.jpg': 2600, 'cabang-samarinda-hd.jpg': 3000,
  'gorengan-hd.jpg': 2400, 'es-teh-jumbo-hd.jpg': 2500, 'suasana-malam-hd.jpg': 3100,
  'hero.webp': 190, 'cabang-sengata.webp': 160, 'cabang-bontang.webp': 150, 'cabang-samarinda.webp': 170,
  'gorengan.webp': 120, 'es-teh-jumbo.webp': 110, 'suasana-malam.webp': 180
};
const GAMBAR_B9 = Object.keys(ASET_SVG_B9);
GAMBAR_B9.forEach(k => { ASET_SVG[k + '-hd.jpg'] = ASET_SVG_B9[k]; ASET_SVG[k + '.webp'] = ASET_SVG_B9[k]; });
/* Bab 8: the photo in the frame, in colour (it is shown in greyscale until the code is refactored) */
ASET_SVG['warung-buka.svg'] = warungFoto({ l1: '#E9A97C', l2: '#F3D1A0', atap: '#D08C8C', label: 'Warung Kopi Senja' });
const JADWAL = [
  { hari: 'Senin', tanggal: '6 Okt', musisi: 'Trio Senja', genre: 'Jazz', jam: '20.00' },
  { hari: 'Selasa', tanggal: '7 Okt', musisi: 'Rara & Gitar Tua', genre: 'Akustik', jam: '19.30' },
  { hari: 'Rabu', tanggal: '8 Okt', musisi: 'Kopi Hitam Band', genre: 'Pop', jam: '20.00' },
  { hari: 'Kamis', tanggal: '9 Okt', musisi: 'Nadia Kirana', genre: 'Jazz', jam: '20.30' },
  { hari: 'Jumat', tanggal: '10 Okt', musisi: 'Dua Pagi', genre: 'Akustik', jam: '19.00' },
  { hari: 'Sabtu', tanggal: '11 Okt', musisi: 'Layang Kota', genre: 'Pop', jam: '21.00' }
];
const LOMBA = [
  { hari: 'Sabtu, 15 Agu', jam: '08.00', lomba: 'Balap Karung', lokasi: 'Lapangan RT 05', hadiah: 'Kipas angin' },
  { hari: 'Sabtu, 15 Agu', jam: '10.00', lomba: 'Makan Kerupuk', lokasi: 'Depan Pos Ronda', hadiah: 'Paket sembako' },
  { hari: 'Sabtu, 15 Agu', jam: '15.30', lomba: 'Tarik Tambang', lokasi: 'Lapangan RT 05', hadiah: 'Tumpeng dan piala' },
  { hari: 'Minggu, 16 Agu', jam: '07.00', lomba: 'Lomba Kelereng', lokasi: 'Gang Mawar', hadiah: 'Sepeda anak' },
  { hari: 'Minggu, 16 Agu', jam: '09.00', lomba: 'Bakiak Beregu', lokasi: 'Jalan Utama RT 05', hadiah: 'Rice cooker' },
  { hari: 'Senin, 17 Agu', jam: '14.00', lomba: 'Panjat Pinang', lokasi: 'Lapangan RT 05', hadiah: 'Kulkas 2 pintu' }
];
const PENGADUAN = [
  { id: 1, nama: 'Pak Joko', kategori: 'Jalan', isi: 'Jalan di depan SD berlubang besar.', tanggal: '2026-09-02', status: 'Normal' },
  { id: 2, nama: 'Bu Ani', kategori: 'Air', isi: 'Air PDAM mati dua hari di RT 03.', tanggal: '2026-09-14', status: 'Prioritas' },
  { id: 3, nama: 'Mas Yoga', kategori: 'Lampu', isi: 'Lampu jalan gang Melati padam.', tanggal: '2026-09-09', status: 'Normal' },
  { id: 4, nama: 'Ibu Rina', kategori: 'Sampah', isi: 'Sampah menumpuk di dekat pasar.', tanggal: '2026-09-18', status: 'Normal' },
  { id: 5, nama: 'Pak Samsul', kategori: 'Drainase', isi: 'Selokan mampet, banjir setiap hujan deras.', tanggal: '2026-09-21', status: 'Prioritas' },
  { id: 6, nama: 'Dek Nisa', kategori: 'Taman', isi: 'Ayunan di taman RW 02 patah.', tanggal: '2026-08-30', status: 'Normal' },
  { id: 7, nama: 'Pak Hasan', kategori: 'Jalan', isi: 'Jembatan kayu di Sungai Sengata goyang.', tanggal: '2026-09-24', status: 'Prioritas' },
  { id: 8, nama: 'Bu Lestari', kategori: 'Air', isi: 'Air sumur keruh setelah banjir.', tanggal: '2026-09-11', status: 'Normal' }
];
const duaMingguLagi = () => new Date(Date.now() + 14 * 864e5).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
/* Text files the client sends. The page reads them with fetch(), which the game simulates.
   A value may be a function when the content depends on progress or on today's date. */
const ASET_TEKS = {
  'jadwal.json': JSON.stringify(JADWAL, null, 2),
  /* Kak Riko adds the "hadiah" field only when Pak RT asks for it (Bab 5, pesanan 5) */
  'lomba.json': () => {
    const pakaiHadiah = S.bab > 4 || (S.bab === 4 && (S.tugas >= 4 || babTamat()));
    return JSON.stringify(LOMBA.map(l => { const x = Object.assign({}, l); if (!pakaiHadiah) delete x.hadiah; return x; }), null, 2);
  },
  'pengaduan.json': JSON.stringify(PENGADUAN, null, 2),
  'timeline_b.json': () => JSON.stringify({
    timeline: 'B',
    tanggal: duaMingguLagi(),
    lokasi: 'Warung Kopi Senja, Sengata',
    status: 'TUTUP PERMANEN',
    catatan: 'Kodenya tidak pernah dirapikan. Pelanggan pergi satu per satu.',
    foto: 'warung-tutup.svg',
    pesan: 'JANGAN BUKA PORTAL SENGATA'
  }, null, 2),
  /* Bab 10: the file on the flashdisk from Timeline Sukses */
  'blueprint-studio.txt': () => (S.bahasa === 'en' ? [
    'STUDIO BLUEPRINT',
    'from: you (success timeline)',
    '',
    '1. Hero        : who you are, in one honest sentence',
    '2. Work        : at least 3 projects, write what you learned',
    '3. Contact     : an email or WhatsApp you actually answer',
    '4. Interaction : one touch of JavaScript, to make it alive',
    '5. Responsive  : most people open it on a phone',
    '6. Story       : why you started, why you kept going',
    '7. Publish     : don\'t wait for perfect',
    '',
    'P.S. Don\'t leave the warung behind.'
  ] : [
    'BLUEPRINT STUDIO',
    'dari: kamu (timeline sukses)',
    '',
    '1. Hero      : siapa kamu, dalam satu kalimat yang jujur',
    '2. Karya     : minimal 3 proyek, tulis apa yang kamu pelajari',
    '3. Kontak    : email atau WhatsApp yang benar-benar kamu balas',
    '4. Interaksi : satu sentuhan JavaScript, biar hidup',
    '5. Responsif : kebanyakan orang membuka dari HP',
    '6. Cerita    : kenapa kamu mulai, kenapa kamu bertahan',
    '7. Publish   : jangan tunggu sempurna',
    '',
    'P.S. Warungnya jangan ditinggal.'
  ]).join('\n')
};
/* Files whose content looks corrupted in the file viewer (they can only be read with code) */
const ASET_RUSAK = ['timeline_b.json'];
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
        test: d => T.all(d, 'button').some(b => T.ada(T.text(b), 'pesan sekarang', 'order now')) },
      { label: 'Ditulis dengan JavaScript di tag <script>', ask: 'kata anak saya, belum ada JavaScript-nya',
        test: d => T.skrip(d).trim().length > 0 },
      { label: 'Setelah dipencet, muncul "Terima kasih"', ask: 'saya sudah pencet tombolnya, tulisan terima kasihnya nggak muncul', kecuali: 0,
        test: d => {
          const b = T.all(d, 'button').find(x => T.ada(T.text(x), 'pesan sekarang', 'order now'));
          if (!b) return false;
          if (T.ada(d.body.innerText.toLowerCase(), 'terima kasih', 'thank you')) return false;
          b.click();
          return T.ada(d.body.innerText.toLowerCase(), 'terima kasih', 'thank you');
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
        test: d => T.ada(d.body.innerText.toLowerCase(), 'belum bisa dimuat', 'could not be loaded', "couldn't be loaded", 'couldn\u2019t be loaded') },
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
        test: d => [['semua', 'all'], ['jazz'], ['akustik', 'acoustic'], ['pop']].every(k => !!T.tombol(d, ...k)) },
      { label: 'Pencet Jazz: hanya acara jazz yang tampil', ask: 'aku pencet Jazz, yang tampil bukan cuma jazz', kecuali: 0,
        test: (d, w) => { T.tombol(d, 'jazz').click(); const a = T.acaraTampil(d, w); return a.length === 2 && a.every(x => T.text(x).includes('jazz')); } },
      { label: 'Pencet Semua: keenam acara tampil lagi', ask: 'setelah pencet Semua, acaranya nggak kembali lengkap', kecuali: 0,
        test: (d, w) => { T.tombol(d, 'jazz').click(); (T.tombol(d, 'semua', 'all') || {}).click?.(); return T.acaraTampil(d, w).length === 6; } },
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
        test: (d, w) => { const a = T.cari(d, w, 'zzzz'); return !!a && a.length === 0 && T.ada(d.body.innerText.toLowerCase(), 'tidak ada acara yang cocok', 'no matching events'); } },
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
},
/* =========================================================
   BAB 4 — Laundry Kilat Pak Dedi
   ========================================================= */
{
  id: 'dedi', tema: 'siang',
  langit: [['#FFF6DA', '#FFE7AE'], ['#FDF1CC', '#FFDFA0'], ['#FBE9BD', '#FCD28E'], ['#F9DDA8', '#F7C27E'], ['#F4CC95', '#F0AE72'], ['#EDB983', '#E89A68'], ['#E9A97C', '#F3D1A0']],
  klien: {
    nama: 'Pak Dedi', usaha: 'Laundry Kilat', huruf: 'D', warna: '#8EC5E8', url: 'laundrykilat.id',
    kirimTeks: 'Sudah saya perbarui, Pak Dedi. Silakan dicoba 🙏',
    revisiBuka: 'Sudah saya coba, Mas. Tapi ', revisiDaftar: 'masih ada yang belum pas:', revisiTutup: 'Pelan-pelan saja, mesin cuci saya juga masih muter 🧺'
  },
  file: 'laundry-kilat.html',
  sewa: 400000,
  reputasi: { plus: 1 },
  unlock: ['Langganan tetap Laundry Kilat', 'Template nota'],
  hadiah: { id: 'nota', teks: 'Pak Dedi menempelkan nota "LUNAS, langganan seumur hidup" di papan gabus studiomu.' },
  penutup: {
    judul: 'Proyek keempat selesai',
    teks: 'Laundry Kilat sekarang punya kalkulator nota yang menangani setengah kilo, berat yang aneh, diskon langganan, dan ongkos antar-jemput. Ini pertama kalinya kodemu menghitung uang orang lain.'
  },
  pembuka: 'Proyek baru: Laundry Kilat. Mulai sekarang, klien melihat bintang reputasimu sebelum menentukan bayaran.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Laundry Kilat Pak Dedi</title>
  <style>
    body {
      background-color: #EEF4F8;
      color: #1F2A36;
      font-family: system-ui, sans-serif;
      max-width: 480px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>Laundry Kilat</h1>
  <p>Cuci, kering, setrika. Selesai dalam sehari.</p>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Formulir nota', bayar: 180000,
    pesan: [
      'Mas {nama}, saya Dedi, yang punya Laundry Kilat di depan kos-kosan. Mas Bima yang kasih nomor Mas.',
      'Selama ini saya catat kiloan di buku tulis. Bukunya sudah kena cipratan pewangi, angkanya luntur semua 😩',
      'Saya mau halaman buat menghitung sendiri. Isinya kolom berat cucian (kg), pilihan layanan Reguler (Rp7.000/kg) atau Express (Rp12.000/kg), tombol HITUNG, dan tempat buat menampilkan totalnya. Kasih id "total-harga" ya, kata keponakan saya itu penting.'
    ],
    reqs: [
      { label: 'Kolom berat cucian (input type="number")', ask: 'kolom buat menulis beratnya belum ada',
        test: d => !!d.querySelector('input[type="number"]') },
      { label: 'Pilihan Reguler dan Express (radio dalam satu grup)', ask: 'pilihan Reguler sama Express-nya belum ada, atau bisa dipilih dua-duanya',
        test: d => { const r = T.all(d, 'input[type="radio"]'); return r.length >= 2 && !!r[0].name && new Set(r.map(x => x.name)).size === 1 && [/regul[ae]r/, /express/].every(k => r.some(x => k.test(T.labelUntuk(d, x)))); } },
      { label: 'Tombol Hitung', ask: 'tombol HITUNG-nya belum ada',
        test: d => !!T.tombol(d, 'hitung', 'calculate') },
      { label: 'Tempat hasil dengan id="total-harga"', ask: 'tempat totalnya belum ada',
        test: d => !!d.getElementById('total-harga') }
    ],
    catatan: {
      teks: 'Kolom angka memakai <code>&lt;input type="number"&gt;</code>, sehingga HP langsung menampilkan keyboard angka. Pilihan yang hanya boleh satu memakai <code>&lt;input type="radio"&gt;</code>. Semua radio dalam satu pilihan harus punya <code>name</code> yang sama, supaya memilih yang satu otomatis melepas yang lain. Simpan harga per kilo di atribut <code>value</code>, dan beri label untuk setiap radio.',
      contoh: '<label for="jumlah">Jumlah porsi</label>\n<input type="number" id="jumlah">\n\n<label><input type="radio" name="ukuran" value="10000" checked> Kecil</label>\n<label><input type="radio" name="ukuran" value="15000"> Besar</label>',
      petunjuk: ['Buat satu input number, dua radio dengan name="layanan", satu tombol, dan satu <p id="total-harga">.', '<label for="kilo">Berat cucian (kg)</label>\n<input type="number" id="kilo">\n\n<label><input type="radio" name="layanan" value="7000" checked> Reguler (Rp7.000/kg)</label>\n<label><input type="radio" name="layanan" value="12000"> Express (Rp12.000/kg)</label>\n\n<button>HITUNG</button>\n<p id="total-harga"></p>']
    },
    sukses: ['Wah, sudah mirip mesin kasir beneran. Pelanggan saya pasti kira ini aplikasi mahal 😄', 'DP dulu ya, Mas.']
  },
  {
    judul: 'Tombol yang menghitung', bayar: 200000,
    pesan: [
      'Tombolnya sudah ada, tapi kalau dipencet belum ngapa-ngapain, hehe.',
      'Coba bikin fungsi hitungTotal(), terus tombolnya memanggil fungsi itu pakai onclick. Keponakan saya bilang cara itu paling gampang dibaca.',
      'Aturannya: berat dikali harga layanan. 3 kg Reguler jadi 21.000, 2 kg Express jadi 24.000.'
    ],
    reqs: [
      { label: 'Ada fungsi hitungTotal()', ask: 'fungsi hitungTotal()-nya belum ada',
        test: (d, w) => typeof w.hitungTotal === 'function' },
      { label: 'Tombol HITUNG memanggil hitungTotal() lewat onclick', ask: 'tombolnya belum memanggil hitungTotal() lewat onclick', kecuali: 0,
        test: d => { const b = T.tombol(d, 'hitung', 'calculate'); return !!b && /hitungTotal\s*\(/.test(b.getAttribute('onclick') || ''); } },
      { label: '3 kg Reguler menghasilkan 21.000', ask: 'saya coba 3 kg Reguler, hasilnya bukan 21.000', kecuali: 0,
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 3, layanan: 'reguler' }).nilai, 21000) },
      { label: '2 kg Express menghasilkan 24.000', ask: 'saya coba 2 kg Express, hasilnya bukan 24.000', kecuali: 0,
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 2, layanan: 'express' }).nilai, 24000) }
    ],
    catatan: {
      teks: 'Atribut <code>onclick</code> menjalankan kode JavaScript saat elemen diklik, misalnya <code>onclick="hitungTotal()"</code>. Di dalam fungsi, isi kolom dibaca dengan <code>.value</code>. Hasilnya selalu teks, jadi ubah dulu menjadi angka dengan <code>Number()</code>. Radio yang sedang dipilih bisa diambil dengan <code>document.querySelector(\'input[name="layanan"]:checked\')</code>. Tampilkan hasilnya dengan <code>innerText</code>.',
      contoh: '<button onclick="hitungOngkir()">Hitung</button>\n\n<script>\n  function hitungOngkir() {\n    const jarak = Number(document.getElementById("jarak").value);\n    document.getElementById("ongkir").innerText = jarak * 2500;\n  }\n<\/script>',
      petunjuk: ['Beri tombol onclick="hitungTotal()". Di dalam fungsi: ambil berat, ambil value radio yang :checked, kalikan, lalu tulis ke #total-harga.', '<button onclick="hitungTotal()">HITUNG</button>\n\n<script>\n  function hitungTotal() {\n    const kilo = Number(document.getElementById("kilo").value);\n    const harga = Number(document.querySelector(\'input[name="layanan"]:checked\').value);\n    document.getElementById("total-harga").innerText = kilo * harga;\n  }\n<\/script>']
    },
    sukses: ['Saya tes pakai cucian anak kos kamar 4, cocok sama hitungan kalkulator saya. Mantap.', 'Transfer ya, Mas.']
  },
  {
    judul: 'Format rupiah', bayar: 200000,
    pesan: [
      'Hasilnya sudah benar, tapi tulisannya cuma "102000". Pelanggan bingung, itu seratus dua ribu atau sepuluh ribu dua ratus?',
      'Tolong tampilkan kayak di nota beneran: "Rp102.000", pakai titik pemisah ribuan.',
      'Contohnya, ada anak kos yang cuciannya 8,5 kg Express. Itu harus tampil Rp102.000.'
    ],
    reqs: [
      { label: 'Total diawali "Rp"', ask: 'totalnya belum ada tulisan Rp-nya',
        test: (d, w) => T.laundry(d, w, { kilo: 3, layanan: 'reguler' }).teks.includes('rp') },
      { label: '8,5 kg Express tampil "Rp102.000"', ask: 'saya coba 8,5 kg Express, tulisannya belum Rp102.000',
        test: (d, w) => /rp\s?102\.000(?!\d)/.test(T.laundry(d, w, { kilo: 8.5, layanan: 'express' }).teks) },
      { label: 'Memakai toLocaleString atau Intl.NumberFormat', ask: 'kata keponakan saya, formatnya belum pakai toLocaleString',
        test: d => /toLocaleString\s*\(|Intl\.NumberFormat/.test(T.skrip(d)) }
    ],
    catatan: {
      teks: 'Angka bisa diformat sesuai kebiasaan Indonesia dengan <code>angka.toLocaleString("id-ID")</code>: 102000 menjadi "102.000". Tinggal tambahkan "Rp" di depannya. Cara lain yang lebih lengkap adalah <code>Intl.NumberFormat</code>. Perhatikan juga koma: di kolom number, 8,5 kg ditulis sebagai 8.5.',
      contoh: 'const harga = 2500000;\nconsole.log("Rp" + harga.toLocaleString("id-ID"));\n// Rp2.500.000',
      petunjuk: ['Simpan hasil kali di variabel total, lalu tulis "Rp" + total.toLocaleString("id-ID").', 'const total = kilo * harga;\ndocument.getElementById("total-harga").innerText = "Rp" + total.toLocaleString("id-ID");']
    },
    sukses: ['Nah, gini baru nota. Anak kos nggak bisa pura-pura salah baca lagi 😂', 'Ini bayarannya.']
  },
  {
    judul: 'Setengah kilo dan angka aneh', bayar: 260000,
    pesan: [
      'Mas, maaf WA tengah malam 🙏 Barusan ada yang tanya: kalau 0,5 kg gimana?',
      'Aturan saya begini: timbangan saya per setengah kilo, jadi 2,5 kg itu sah. Tapi minimal bayar 1 kg. Jadi 0,5 kg tetap dihitung 1 kg.',
      'Terus tadi ada anak kos iseng mengetik -3 kg, hasilnya jadi minus 😅 Kalau beratnya kosong, nol, atau minus, tampilkan saja "Masukkan berat yang benar".'
    ],
    reqs: [
      { label: 'Kolom berat menerima setengah kilo (step="0.5")', ask: 'kolomnya belum bisa diisi setengah kilo',
        test: d => { const i = d.querySelector('input[type="number"]'); return !!i && ['0.5', 'any'].includes(i.getAttribute('step')); } },
      { label: '0,5 kg Reguler dihitung minimal 1 kg: Rp7.000', ask: '0,5 kg Reguler harusnya dihitung 1 kg, jadi Rp7.000',
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 0.5, layanan: 'reguler' }).nilai, 7000) },
      { label: '2,5 kg Reguler: Rp17.500', ask: '2,5 kg Reguler harusnya Rp17.500',
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 2.5, layanan: 'reguler' }).nilai, 17500) },
      { label: 'Berat minus: muncul "Masukkan berat yang benar"', ask: 'waktu saya ketik -3, belum muncul "Masukkan berat yang benar"',
        test: (d, w) => T.ada(T.laundry(d, w, { kilo: -3 }).teks, 'masukkan berat yang benar', 'enter a valid weight') },
      { label: 'Kolom kosong atau nol: muncul pesan yang sama', ask: 'kalau kolomnya kosong atau nol, pesannya belum muncul',
        test: (d, w) => T.ada(T.laundry(d, w, { kilo: '' }).teks, 'masukkan berat yang benar', 'enter a valid weight') && T.ada(T.laundry(d, w, { kilo: 0 }).teks, 'masukkan berat yang benar', 'enter a valid weight') }
    ],
    catatan: {
      teks: 'Pengguna bisa mengetik apa saja, jadi kode yang baik memeriksa dulu sebelum menghitung. Pakai <code>if</code> untuk menangkap kasus yang tidak masuk akal. Kolom kosong menjadi <code>0</code> setelah <code>Number()</code>, jadi cukup periksa apakah beratnya lebih dari nol. <code>return</code> menghentikan fungsi lebih awal. Setelah itu terapkan aturan bisnis: <code>Math.max(kilo, 1)</code> memilih yang lebih besar, sehingga berat di bawah 1 kg tetap dihitung 1 kg. Atribut <code>step="0.5"</code> membuat kolom menerima kelipatan setengah.',
      contoh: 'function hitungTiket(umur) {\n  if (!(umur > 0)) {\n    hasil.innerText = "Umur tidak valid";\n    return;\n  }\n  const dihitung = Math.max(umur, 5);\n  // ...\n}',
      petunjuk: ['Di awal hitungTotal(): kalau berat tidak lebih dari 0, tampilkan pesan lalu return. Setelah itu pakai Math.max(kilo, 1).', '<input type="number" id="kilo" min="0" step="0.5">\n\nfunction hitungTotal() {\n  const kilo = Number(document.getElementById("kilo").value);\n  const hasil = document.getElementById("total-harga");\n  if (!(kilo > 0)) {\n    hasil.innerText = "Masukkan berat yang benar";\n    return;\n  }\n  const harga = Number(document.querySelector(\'input[name="layanan"]:checked\').value);\n  const total = Math.max(kilo, 1) * harga;\n  hasil.innerText = "Rp" + total.toLocaleString("id-ID");\n}']
    },
    sukses: ['Barusan saya coba ketik -3, dia langsung menegur. Anak kos iseng kalah telak 😆', 'Makasih sudah mau dibangunin tengah malam, Mas. Ini bayarannya.']
  },
  {
    judul: 'Antar-jemput dan langganan', bayar: 260000,
    pesan: [
      'Kabar baik: sekarang saya punya motor buat antar-jemput cucian! Ongkosnya Rp5.000 sekali jalan.',
      'Satu lagi. Pelanggan yang cuciannya 10 kg ke atas dapat diskon langganan 10%. Tapi diskonnya cuma untuk harga cucian, ongkos antar-jemput nggak didiskon.',
      'Tambahkan kotak centang "Antar-jemput" ya. Contoh buat mengecek: 3 kg Express pakai antar-jemput jadi Rp41.000. 10 kg Reguler jadi Rp63.000, kalau pakai antar-jemput jadi Rp68.000.'
    ],
    reqs: [
      { label: 'Kotak centang Antar-jemput (checkbox)', ask: 'kotak centang Antar-jemput-nya belum ada',
        test: d => { const c = d.querySelector('input[type="checkbox"]'); return !!c && T.ada(T.labelUntuk(d, c), 'antar', 'delivery', 'pickup', 'pick-up'); } },
      { label: '3 kg Express + antar-jemput: Rp41.000', ask: '3 kg Express pakai antar-jemput harusnya Rp41.000', kecuali: 0,
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 3, layanan: 'express', antar: true }).nilai, 41000) },
      { label: '10 kg Reguler dapat diskon 10%: Rp63.000', ask: '10 kg Reguler harusnya dapat diskon, jadi Rp63.000',
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 10, layanan: 'reguler' }).nilai, 63000) },
      { label: '10 kg Reguler + antar-jemput: Rp68.000', ask: '10 kg Reguler pakai antar-jemput harusnya Rp68.000, ongkosnya jangan ikut didiskon', kecuali: 0,
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 10, layanan: 'reguler', antar: true }).nilai, 68000) },
      { label: '3 kg Reguler tanpa antar-jemput tetap Rp21.000', ask: 'hitungan biasa yang tadinya benar sekarang malah berubah',
        test: (d, w) => T.sama(T.laundry(d, w, { kilo: 3, layanan: 'reguler' }).nilai, 21000) }
    ],
    catatan: {
      teks: 'Kotak centang memakai <code>&lt;input type="checkbox"&gt;</code>, dan statusnya dibaca lewat <code>.checked</code> (true atau false). Urutan hitungan itu penting: hitung harga cucian, terapkan diskon kalau memenuhi syarat, baru tambahkan ongkos. Diskon 10% berarti harga dikali <code>0.9</code>. Operator ternary <code>syarat ? a : b</code> berguna untuk nilai yang tergantung satu syarat. Bulatkan hasil akhir dengan <code>Math.round</code>, karena perkalian desimal di komputer kadang menghasilkan angka seperti 62999.99999.',
      contoh: 'let subtotal = porsi * 20000;\nif (porsi >= 5) {\n  subtotal = subtotal * 0.95;\n}\nconst ongkir = pakaiKurir.checked ? 8000 : 0;\nconst total = Math.round(subtotal + ongkir);',
      petunjuk: ['Tambah <input type="checkbox" id="antar"> dengan label. Di fungsi: hitung cucian, kalau kilo >= 10 kali 0.9, lalu tambah 5000 kalau dicentang.', '<label><input type="checkbox" id="antar"> Antar-jemput (Rp5.000)</label>\n\nlet cucian = Math.max(kilo, 1) * harga;\nif (kilo >= 10) {\n  cucian = cucian * 0.9;\n}\nconst ongkos = document.getElementById("antar").checked ? 5000 : 0;\nconst total = Math.round(cucian + ongkos);']
    },
    sukses: ['Tadi ada langganan 12 kg, dapat diskon, dia senyum lebar. Saya juga senyum, soalnya jadi langganan tetap 😄', 'Bayaran masuk ya, Mas.']
  },
  {
    judul: 'Nota ala struk', bayar: 200000, aset: ['ikon-baju.svg'],
    pesan: [
      'Terakhir, tampilannya. Saya mau kelihatan kayak nota laundry beneran.',
      'Bungkus semuanya dengan class "nota": pinggirannya garis putus-putus, hurufnya huruf mesin ketik kayak struk. Lebarnya jangan lebih dari 420px, kayak kertas struk.',
      'Saya kirim ikon baju buat ditaruh di atas nota. Jangan lupa keterangan gambarnya.'
    ],
    reqs: [
      { label: 'Formulir dan total dibungkus class="nota"', ask: 'notanya belum dibungkus class "nota"',
        test: d => { const n = d.querySelector('.nota'); return !!n && !!n.querySelector('#total-harga'); } },
      { label: 'Pinggiran garis putus-putus (border dashed)', ask: 'pinggiran notanya belum putus-putus', kecuali: 0,
        test: (d, w) => w.getComputedStyle(d.querySelector('.nota')).borderTopStyle === 'dashed' },
      { label: 'Huruf monospace ala struk', ask: 'hurufnya belum kayak huruf struk', kecuali: 0,
        test: (d, w) => /mono|courier|consolas|menlo/i.test(w.getComputedStyle(d.querySelector('.nota')).fontFamily) },
      { label: 'Lebar nota paling besar 420px', ask: 'notanya masih kelebaran', kecuali: 0,
        test: d => d.querySelector('.nota').getBoundingClientRect().width <= 420.5 },
      { label: 'Ikon baju (ikon-baju.svg) tampil dengan alt', ask: 'ikon bajunya belum muncul, atau belum ada keterangannya',
        test: d => T.all(d, 'img').some(i => T.gambarOk(i) && i.src.includes('svg') && (i.getAttribute('alt') || '').trim().length > 2 && /ikon-baju|%3Csvg/.test(i.getAttribute('src') + i.src)) }
    ],
    catatan: {
      teks: 'Nota adalah urusan CSS lagi. <code>border: 2px dashed</code> membuat garis putus-putus, dan <code>font-family: "Courier New", monospace</code> memberi huruf yang lebarnya sama seperti mesin kasir. Batasi lebarnya dengan <code>max-width</code>. Kalau nota dibungkus dalam satu <code>&lt;div class="nota"&gt;</code>, semua gaya cukup ditulis di satu aturan.',
      contoh: '.tiket {\n  border: 2px dashed #555;\n  font-family: "Courier New", monospace;\n  max-width: 360px;\n  padding: 16px;\n}',
      petunjuk: ['Bungkus formulir dan hasil dengan <div class="nota">, taruh <img src="ikon-baju.svg" alt="..."> di atasnya, lalu tambahkan aturan .nota.', '<div class="nota">\n  <img src="ikon-baju.svg" alt="Ikon kaos Laundry Kilat" width="64">\n  <!-- formulir dan #total-harga di sini -->\n</div>\n\n.nota {\n  border: 2px dashed #6B7A89;\n  font-family: "Courier New", monospace;\n  max-width: 380px;\n  padding: 16px;\n  background: white;\n}']
    },
    sukses: ['Keponakan saya bilang ini "estetik". Saya nggak tahu artinya, tapi kedengarannya bagus 😄', 'Terima kasih banyak, Mas {nama}. Mulai bulan depan cucian Mas saya kasih harga langganan, seumur hidup.']
  }
  ]
},
/* =========================================================
   BAB 5 — Karang Taruna RT 05
   ========================================================= */
{
  id: 'riko', tema: 'meriah',
  langit: [['#F7B267', '#F9D29D'], ['#F4845F', '#F7B267'], ['#C8566C', '#F4845F'], ['#6B3F72', '#B5566B'], ['#3C2F5E', '#7A4270'], ['#26244A', '#553B6B'], ['#9AC7E8', '#F4E3C1']],
  waktu: [2026, 7, 10, 9, 0],
  klien: {
    nama: 'Kak Riko', usaha: 'Karang Taruna RT 05', huruf: 'R', warna: '#E57373', url: 'rt05.sengata.id',
    kirimTeks: 'Sudah aku update, Kak Riko. Cek ya 🙏',
    revisiBuka: 'Udah aku cek bareng anak-anak. Tapi ', revisiDaftar: 'masih ada yang kurang:', revisiTutup: 'Semangat, 17-an masih seminggu lagi! 🇮🇩'
  },
  file: 'gebyar-17an-rt05.html',
  sewa: 400000,
  reputasi: { plus: 2 },
  unlock: ['Template tabel', 'Stiker 17-an'],
  hadiah: { id: 'stiker', teks: 'Kak Riko mengirim stiker Gebyar 17-an. Sudah ditempel di papan gabus. Ibu-ibu RT resmi jadi penggemarmu.' },
  penutup: {
    judul: 'Proyek kelima selesai',
    teks: 'Portal 17-an RT 05 sekarang punya tabel yang dibaca dari data, bisa digeser di HP, video yang tidak gepeng, kolom hadiah dadakan, dan hitung mundur yang menghitung sendiri.'
  },
  pembuka: 'Proyek baru: Gebyar 17-an RT 05. Di dunia game, hari ini tanggal 10 Agustus 2026.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gebyar 17-an RT 05</title>
  <style>
    body {
      background-color: #FFF8F0;
      color: #2B2B2B;
      font-family: system-ui, sans-serif;
      max-width: 820px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #C62828;
    }
  </style>
</head>
<body>
  <header>
    <h1>Gebyar 17-an RT 05</h1>
    <p>Merdeka! Ayo ramaikan lomba bareng warga.</p>
  </header>

  <section id="jadwal">
    <h2>Jadwal Lomba</h2>
  </section>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Kerangka tabel', bayar: 200000, aset: ['logo-rt05.svg'],
    pesan: [
      'Halo {nama}! Aku Riko, ketua Karang Taruna RT 05. Tahun ini 17-an harus pecah, tapi websitenya jangan sampai pecah 😂',
      'Aku butuh jadwal lomba dalam bentuk tabel. Baris paling atas judul besar "JADWAL GEBYAR 17-AN RT 05" yang membentang di semua kolom. Di bawahnya kolom: Hari, Jam, Lomba, Lokasi.',
      'Aku kirim logo RT juga, taruh di atas ya.'
    ],
    reqs: [
      { label: 'Logo RT 05 (logo-rt05.svg) tampil dengan alt', ask: 'logo RT-nya belum muncul, atau belum ada keterangannya',
        test: d => T.all(d, 'img').some(i => T.gambarOk(i) && (i.getAttribute('alt') || '').trim().length > 2) },
      { label: 'Tabel punya <thead> dan <tbody>', ask: 'tabelnya belum dibagi jadi bagian kepala dan isi',
        test: d => !!d.querySelector('table thead') && !!d.querySelector('table tbody') },
      { label: 'Kolom Hari, Jam, Lomba, Lokasi', ask: 'kolom Hari, Jam, Lomba, sama Lokasi belum lengkap', kecuali: 1,
        test: d => { const k = T.kolomTabel(d); return [['hari', 'day'], ['jam', 'time'], ['lomba', 'event'], ['lokasi', 'location']].every(x => x.some(y => k.includes(y))); } },
      { label: 'Judul "JADWAL GEBYAR 17-AN RT 05" membentang dengan colspan', ask: 'judul besarnya belum membentang di semua kolom', kecuali: 1,
        test: d => { const th = T.all(d, 'thead th[colspan]').find(x => T.text(x).includes('gebyar 17-an rt 05')); return !!th && +th.getAttribute('colspan') === T.kolomTabel(d).length; } }
    ],
    catatan: {
      teks: 'Tabel dipakai untuk data yang punya baris dan kolom. <code>&lt;thead&gt;</code> berisi baris kepala, <code>&lt;tbody&gt;</code> berisi data. Setiap baris adalah <code>&lt;tr&gt;</code>, sel kepala <code>&lt;th&gt;</code>, dan sel data <code>&lt;td&gt;</code>. Atribut <code>colspan</code> membuat satu sel membentang beberapa kolom, cocok untuk judul tabel. Nilainya harus sama dengan jumlah kolom.',
      contoh: '<table>\n  <thead>\n    <tr><th colspan="3">DAFTAR PIKET</th></tr>\n    <tr><th>Hari</th><th>Nama</th><th>Tugas</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Senin</td><td>Andi</td><td>Sapu</td></tr>\n  </tbody>\n</table>',
      petunjuk: ['Dua baris di <thead>: satu <th colspan="4"> untuk judul, satu baris berisi empat <th>. <tbody> boleh kosong dulu.', '<img src="logo-rt05.svg" alt="Logo RT 05" width="72">\n\n<table>\n  <thead>\n    <tr><th colspan="4">JADWAL GEBYAR 17-AN RT 05</th></tr>\n    <tr><th>Hari</th><th>Jam</th><th>Lomba</th><th>Lokasi</th></tr>\n  </thead>\n  <tbody id="isi-jadwal"></tbody>\n</table>']
    },
    sukses: ['Mantap, judulnya membentang gagah kayak spanduk di gapura 😎', 'Ini DP dari kas Karang Taruna.']
  },
  {
    judul: 'Isi tabel dari data', bayar: 250000, aset: ['lomba.json'],
    pesan: [
      'Datanya aku kirim dalam file lomba.json ya. Isinya enam lomba.',
      'Jadwalnya masih bisa geser-geser tergantung Pak RT, jadi baris tabelnya jangan diketik manual. Ambil dari file, terus buat barisnya pakai JavaScript.',
      'Tiap baris isinya hari, jam, nama lomba, dan lokasi, sesuai kolomnya.'
    ],
    reqs: [
      { label: 'Data diambil dari lomba.json dengan fetch', ask: 'jadwalnya belum dibaca dari file lomba.json',
        test: d => /fetch\s*\(\s*["'`](\.\/)?lomba\.json/.test(T.skrip(d)) },
      { label: 'Enam baris lomba di <tbody>', ask: 'baris lombanya belum muncul enam',
        test: d => T.barisTabel(d).length >= 6 },
      { label: 'Baris dibuat JavaScript, bukan ditulis manual', ask: 'masih ada baris yang diketik manual di HTML',
        test: (d, w, src) => new DOMParser().parseFromString(src, 'text/html').querySelectorAll('tbody tr').length === 0 },
      { label: 'Jumlah sel tiap baris sama dengan jumlah kolom', ask: 'ada baris yang selnya kurang atau kelebihan, kolomnya jadi berantakan', kecuali: 1,
        test: d => { const n = T.kolomTabel(d).length; const b = T.barisTabel(d); return n > 0 && b.length > 0 && b.every(r => r.querySelectorAll('td').length === n); } },
      { label: 'Balap Karung ada di tabel', ask: 'lomba Balap Karung belum ada di tabel', kecuali: 1,
        test: d => T.barisTabel(d).some(r => T.text(r).includes('balap karung')) }
    ],
    catatan: {
      teks: 'Kamu sudah pernah memakai <code>fetch</code> dan <code>forEach</code> di Ruang Nada. Bedanya, sekarang yang dibuat adalah baris tabel. Cara yang rapi: buat baris dengan <code>document.createElement("tr")</code>, isi dengan <code>innerHTML</code> berisi beberapa <code>&lt;td&gt;</code>, lalu tempelkan ke <code>&lt;tbody&gt;</code> dengan <code>appendChild</code>. Klik <code>lomba.json</code> di atas editor untuk melihat nama-nama datanya.',
      contoh: 'const baris = document.createElement("tr");\nbaris.innerHTML = `<td>${s.nama}</td><td>${s.kelas}</td>`;\ndocument.getElementById("isi-tabel").appendChild(baris);',
      petunjuk: ['Beri <tbody> id, buat fungsi async yang mengambil lomba.json, lalu untuk setiap lomba buat <tr> dengan empat <td>.', '<script>\n  async function muatLomba() {\n    const respon = await fetch("lomba.json");\n    const daftar = await respon.json();\n    const isi = document.getElementById("isi-jadwal");\n    daftar.forEach(function (l) {\n      const baris = document.createElement("tr");\n      baris.innerHTML = `<td>${l.hari}</td><td>${l.jam}</td><td>${l.lomba}</td><td>${l.lokasi}</td>`;\n      isi.appendChild(baris);\n    });\n  }\n  muatLomba();\n<\/script>']
    },
    sukses: ['Pak RT barusan geser lomba kelereng ke Minggu. Aku cuma ubah file-nya, tabelnya langsung ikut. Nggak perlu begadang ✨', 'Transfer ya, Kak.']
  },
  {
    judul: 'Enak dibaca di HP', bayar: 220000,
    pesan: [
      'Ibu-ibu RT buka website dari HP, dan tabelnya kepotong di kanan 😅',
      'Bikin tabelnya bisa digeser ke samping di layar kecil, tanpa bikin seluruh halaman ikut goyang. Di laptop, tabelnya selebar wadahnya.',
      'Terus biar nggak pusing: baris selang-seling warnanya, dan kepala tabelnya tetap menempel di atas waktu digulir.'
    ],
    reqs: [
      { label: 'Tabel dibungkus elemen yang bisa digeser (overflow-x: auto)', ask: 'tabelnya belum bisa digeser sendiri, halamannya ikut goyang',
        test: (d, w) => { const t = d.querySelector('table'); return !!t && ['auto', 'scroll'].includes(w.getComputedStyle(t.parentElement).overflowX); } },
      { label: 'Lebar tabel mengisi wadahnya (width: 100%)', ask: 'di laptop tabelnya masih kecil di tengah', kecuali: 0,
        test: d => { const t = d.querySelector('table'); return Math.abs(t.offsetWidth - t.parentElement.clientWidth) < 3; } },
      { label: 'Baris selang-seling warnanya (:nth-child)', ask: 'barisnya belum selang-seling warnanya',
        test: d => T.adaRule(d, s => s.includes('nth-child') && /\btr\b/.test(s)) },
      { label: 'Kepala tabel menempel saat digulir (position: sticky)', ask: 'kepala tabelnya masih ikut hilang waktu digulir',
        test: (d, w) => { const th = d.querySelector('thead th'); return !!th && (w.getComputedStyle(th).position === 'sticky' || w.getComputedStyle(d.querySelector('thead')).position === 'sticky'); } }
    ],
    catatan: {
      teks: 'Tabel yang lebar lebih baik dibungkus <code>&lt;div&gt;</code> dengan <code>overflow-x: auto</code>: hanya tabelnya yang bisa digeser, halamannya tetap diam. Selector <code>tbody tr:nth-child(even)</code> memilih baris genap, cocok untuk warna selang-seling. <code>position: sticky</code> dengan <code>top: 0</code> membuat sel kepala menempel di atas saat wadahnya digulir. Beri sel kepala warna latar, supaya isi di bawahnya tidak tembus.',
      contoh: '.wadah-tabel {\n  overflow-x: auto;\n}\ntbody tr:nth-child(even) {\n  background-color: #F5F5F5;\n}\nth {\n  position: sticky;\n  top: 0;\n  background-color: white;\n}',
      petunjuk: ['Bungkus <table> dengan <div class="wadah-tabel">, lalu tambahkan aturan untuk overflow-x, width 100%, nth-child, dan sticky.', '<div class="wadah-tabel">\n  <table>...</table>\n</div>\n\n.wadah-tabel {\n  overflow-x: auto;\n  max-height: 420px;\n}\ntable {\n  width: 100%;\n  border-collapse: collapse;\n}\ntbody tr:nth-child(even) {\n  background-color: #FDECEC;\n}\nth {\n  position: sticky;\n  top: 0;\n  background-color: #C62828;\n  color: white;\n}']
    },
    sukses: ['Bu RT langsung kirim stiker jempol ke grup. Dari beliau, itu setara piala 🏆', 'Bayarannya ya, Kak.']
  },
  {
    judul: 'Video lomba tahun lalu', bayar: 250000,
    pesan: [
      'Biar rame, aku mau pasang video balap karung tahun lalu. Ini linknya: https://youtu.be/bKarung2025?si=RT05grup',
      'Tapi kata temanku, link begitu nggak bisa langsung dipasang. Harus diubah jadi link "embed" dulu.',
      'Terus videonya jangan gepeng ya. Tahun lalu di website kelurahan, videonya jadi kayak roti tawar kelindes 😂'
    ],
    reqs: [
      { label: 'Video disematkan dengan <iframe> embed YouTube', ask: 'videonya belum dipasang pakai iframe embed',
        test: d => T.all(d, 'iframe').some(f => /youtube(-nocookie)?\.com\/embed\//.test(f.getAttribute('src') || '')) },
      { label: 'ID video benar dan tanpa "?si=..."', ask: 'ID videonya belum pas, atau bagian ?si= masih ikut', kecuali: 0,
        test: d => T.all(d, 'iframe').some(f => { const s = f.getAttribute('src') || ''; return /\/embed\/bKarung2025(\?|$|&)/.test(s) && !/si=/.test(s); }) },
      { label: 'Rasio 16:9, tidak gepeng', ask: 'videonya masih gepeng', kecuali: 0,
        test: d => { const f = d.querySelector('iframe'); const r = f.getBoundingClientRect(); return r.width >= 280 && Math.abs(r.width / r.height - 16 / 9) < 0.06; } },
      { label: 'iframe punya title untuk pembaca layar', ask: 'iframe-nya belum punya title', kecuali: 0,
        test: d => (d.querySelector('iframe').getAttribute('title') || '').trim().length > 3 }
    ],
    catatan: {
      teks: 'Video YouTube dipasang dengan <code>&lt;iframe&gt;</code>, tapi alamatnya harus berbentuk <code>https://www.youtube.com/embed/ID_VIDEO</code>. ID video adalah bagian setelah <code>youtu.be/</code>, sebelum tanda tanya. Bagian <code>?si=...</code> hanya penanda siapa yang membagikan, jadi buang saja. Supaya tidak gepeng, beri <code>width: 100%</code> dan <code>aspect-ratio: 16 / 9</code>, dan jangan pasang atribut height. Atribut <code>title</code> menjelaskan isi iframe kepada pembaca layar. Di dalam game, video diganti tampilan pengganti supaya tetap bisa dimainkan tanpa internet.',
      contoh: '<!-- link bagikan: https://youtu.be/abcDEF12345?si=xyz -->\n<iframe\n  src="https://www.youtube.com/embed/abcDEF12345"\n  title="Video profil sekolah"\n  allowfullscreen></iframe>\n\niframe {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  border: 0;\n}',
      petunjuk: ['ID videonya bKarung2025. Tulis iframe dengan src embed dan title, lalu CSS width 100% dan aspect-ratio.', '<section id="video">\n  <h2>Balap Karung 2025</h2>\n  <iframe src="https://www.youtube.com/embed/bKarung2025" title="Video lomba balap karung RT 05 tahun 2025" allowfullscreen></iframe>\n</section>\n\niframe {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  border: 0;\n  border-radius: 12px;\n}']
    },
    sukses: ['Nggak gepeng! Pak RT yang jatuh di karung kelihatan jelas banget, beliau sampai minta videonya jangan dihapus 😂', 'Ini bayarannya.']
  },
  {
    judul: 'Kolom hadiah dadakan', bayar: 300000,
    pesan: [
      'Kak... Pak RT barusan telepon 😅',
      '"Tambahin kolom Hadiah dong! Panjat pinang hadiahnya kulkas 2 pintu!" Katanya biar warga semangat.',
      'Aku sudah tambahkan data hadiah di lomba.json. Tolong ubah tabelnya tanpa merusak yang sudah ada: kolom baru di kepala, judul besarnya ikut membentang, dan tiap baris dapat sel hadiah.'
    ],
    reqs: [
      { label: 'Kolom Hadiah di kepala tabel', ask: 'kolom Hadiah belum ada di kepala tabel',
        test: d => ['hadiah', 'prize'].some(x => T.kolomTabel(d).includes(x)) },
      { label: 'Judul membentang di semua kolom (colspan="5")', ask: 'judul besarnya belum ikut membentang ke kolom Hadiah', kecuali: 0,
        test: d => { const th = d.querySelector('thead th[colspan]'); return !!th && +th.getAttribute('colspan') === 5 && T.kolomTabel(d).length === 5; } },
      { label: 'Setiap baris punya sel Hadiah', ask: 'baris-barisnya belum punya sel hadiah', kecuali: 0,
        test: d => { const b = T.barisTabel(d); return b.length >= 6 && b.every(r => r.querySelectorAll('td').length === 5); } },
      { label: 'Panjat Pinang berhadiah Kulkas 2 pintu', ask: 'hadiah kulkas 2 pintu buat Panjat Pinang belum muncul', kecuali: 0,
        test: d => T.barisTabel(d).some(r => T.text(r).includes('panjat pinang') && T.text(r).includes('kulkas 2 pintu')) }
    ],
    catatan: {
      teks: 'Permintaan dadakan adalah bagian dari pekerjaan. Karena barisnya dibuat dari data, perubahan cukup di tiga tempat: satu <code>&lt;th&gt;</code> baru di kepala, <code>colspan</code> judul dinaikkan dari 4 menjadi 5, dan satu <code>&lt;td&gt;</code> baru di template baris. Lihat lagi isi <code>lomba.json</code>, karena sekarang ada data <code>hadiah</code>.',
      contoh: '<tr><th colspan="3">NILAI</th></tr>\n<tr><th>Nama</th><th>Tugas</th><th>Nilai</th></tr>\n\n// template baris:\n`<td>${s.nama}</td><td>${s.tugas}</td><td>${s.nilai}</td>`',
      petunjuk: ['Ubah colspan="4" menjadi "5", tambah <th>Hadiah</th>, dan tambah <td>${l.hadiah}</td> di template baris.', '<tr><th colspan="5">JADWAL GEBYAR 17-AN RT 05</th></tr>\n<tr><th>Hari</th><th>Jam</th><th>Lomba</th><th>Lokasi</th><th>Hadiah</th></tr>\n\nbaris.innerHTML = `<td>${l.hari}</td><td>${l.jam}</td><td>${l.lomba}</td><td>${l.lokasi}</td><td>${l.hadiah}</td>`;']
    },
    sukses: ['Pak RT lihat kolom hadiahnya terus bilang, "Kulkasnya kelihatan besar ya di website." Iya Pak, itu karena tabelnya rapi 😂', 'Ada bonus dari kas buat kerja dadakannya.']
  },
  {
    judul: 'Hitung mundur dan juara', bayar: 280000,
    pesan: [
      'Terakhir! Dua hal.',
      'Pertama, hitung mundur ke 17 Agustus di elemen dengan id "hitung-mundur". Tulisannya: "Tinggal 7 hari lagi!" Tapi jangan ditulis manual, harus dihitung dari tanggal hari ini, biar besok otomatis jadi 6 hari.',
      'Kedua, bagian pengumuman juara dengan id "juara". Isi manual dulu dari lomba tahun lalu: Balap Karung, Dimas. Makan Kerupuk, Bu Wati. Tarik Tambang, Tim Gang Mawar.'
    ],
    reqs: [
      { label: 'Bagian #juara berisi minimal 3 juara (daftar <li>)', ask: 'pengumuman juaranya belum ada, atau kurang dari tiga',
        test: d => { const j = d.getElementById('juara'); return !!j && j.querySelectorAll('li').length >= 3; } },
      { label: '#hitung-mundur menampilkan "7 hari"', ask: 'hitung mundurnya belum menampilkan 7 hari',
        test: d => { const h = d.getElementById('hitung-mundur'); return !!h && /\b7 (hari|days)\b/.test(T.text(h)); } },
      { label: 'Dihitung dengan Date, bukan diketik manual', ask: 'angka harinya masih diketik manual', kecuali: 1,
        test: (d, w, src) => { const h = new DOMParser().parseFromString(src, 'text/html').getElementById('hitung-mundur'); return /new\s+Date\s*\(/.test(T.skrip(d)) && !!h && !/\b7 (hari|days)\b/.test(T.text(h)); } }
    ],
    catatan: {
      teks: '<code>new Date()</code> memberi tanggal dan jam saat ini. <code>new Date(2026, 7, 17)</code> membuat tanggal 17 Agustus 2026. Hati-hati: bulan dihitung dari 0, jadi Agustus adalah 7. Dua tanggal bisa dikurangkan, dan hasilnya dalam milidetik. Bagi dengan <code>1000 * 60 * 60 * 24</code> untuk mendapat hari, lalu bulatkan ke atas dengan <code>Math.ceil</code>. Di dunia game, hari ini adalah 10 Agustus 2026 pukul 09.00.',
      contoh: 'const sekarang = new Date();\nconst ulangTahun = new Date(2026, 11, 25);\nconst selisih = ulangTahun - sekarang;\nconst hari = Math.ceil(selisih / (1000 * 60 * 60 * 24));',
      petunjuk: ['Buat <p id="hitung-mundur"></p>, lalu di script hitung selisih hari ke new Date(2026, 7, 17). Untuk juara cukup <section id="juara"> berisi <ol>.', '<p id="hitung-mundur"></p>\n\n<section id="juara">\n  <h2>Juara Tahun Lalu</h2>\n  <ol>\n    <li>Balap Karung: Dimas</li>\n    <li>Makan Kerupuk: Bu Wati</li>\n    <li>Tarik Tambang: Tim Gang Mawar</li>\n  </ol>\n</section>\n\n<script>\n  const hariH = new Date(2026, 7, 17);\n  const sisa = Math.ceil((hariH - new Date()) / (1000 * 60 * 60 * 24));\n  document.getElementById("hitung-mundur").textContent = `Tinggal ${sisa} hari lagi!`;\n<\/script>']
    },
    sukses: ['Anak-anak RT sudah menunggu hitung mundurnya tiap pagi kayak nunggu azan magrib pas puasa 😆', 'Satu RT bangga, Kak {nama}. Ibu-ibu minta kamu jadi juri lomba masak tahun depan.']
  }
  ]
},
/* =========================================================
   BAB 6 — Si Peniru (Mas Alif)
   ========================================================= */
{
  id: 'alif', tema: 'mendung',
  langit: [['#B7BFC0', '#D6DAD5'], ['#A6AFB1', '#C8CEC9'], ['#949EA1', '#B8BFBB'], ['#838D91', '#A8B0AD'], ['#737D82', '#98A09E'], ['#646E73', '#889190'], ['#8A8F9E', '#C9A99A']],
  klien: {
    nama: 'Mas Alif', usaha: 'Kopi Alif', huruf: 'A', warna: '#B0A38F', url: 'kopialif.sengata.id',
    kirimTeks: 'Sudah saya perbaiki, Mas Alif. Coba dicek.',
    revisiBuka: 'Maaf merepotkan, Mas. Tapi ', revisiDaftar: 'masih ada yang aneh:', revisiTutup: 'Saya tunggu. Saya juga lagi belajar, sungguh 🙇'
  },
  file: 'kopi-alif.html',
  sewa: 400000,
  reputasi: { plus: 0 },
  keahlian: 'Debugging Lv 1',
  unlock: ['Keahlian: Debugging Lv 1', 'Konsol rahasia', 'Easter egg kecoa'],
  penutup: {
    judul: 'Proyek keenam selesai',
    teks: 'Kopi Alif sekarang punya konsol yang bersih, data yang tersimpan sebagai JSON, kunci penyimpanan sendiri, dan alat Cek Keaslian. Bayarannya nol rupiah. Tapi kamu pulang membawa keahlian debugging, dan sebuah file yang seharusnya belum ada.'
  },
  pembuka: 'Bu Sari mengirim pesan: "Mas, kok ada warung baru yang websitenya mirip punya saya ya? Pesanan di website saya juga jadi aneh."',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kopi Alif</title>
  <style>
    body {
      background-color: #F6E7D0;
      color: #3B2A20;
      font-family: Georgia, serif;
      max-width: 640px;
      margin: 0 auto;
      padding: 16px;
    }
    h1 {
      color: #B5562B;
    }
    .menu-item {
      display: block;
      margin: 6px 0;
    }
  </style>
</head>
<body>
  <!-- Disalin dari Warung Kopi Senja. Jangan bilang siapa-siapa. -->
  <h1>Kopi Alif</h1>
  <p>Buka setiap hari, 07.00 - 22.00</p>

  <h2>Menu</h2>
  <div id="menu"></div>

  <h2>Pesananmu</h2>
  <ul id="daftar-pesan"></ul>

  <script>
    const KUNCI = "warungkopi_v1";
    const MENU = [
      { nama: "Kopi Tubruk", harga: 8000 },
      { nama: "Es Kopi Susu", harga: 15000 },
      { nama: "Teh Tarik", harga: 10000 },
      { nama: "Pisang Goreng", harga: 12000 }
    ];
    let keranjang = [];

    function tampilkanMenu() {
      const wadah = document.getElementById("menu");
      MENU.forEach(function (m) {
        wadah.innerHTML += \`<button class="menu-item" onclick="tambah('\${m.nama}')">+ \${m.nama}</button>\`;
      });
    }

    function tampilkanKeranjang() {
      const daftar = document.getElementById("daftar-pesanan");
      daftar.innerHTML = "";
      keranjang.forEach(function (nama) {
        daftar.innerHTML += \`<li>\${nama}</li>\`;
      });
    }

    function tambah(nama) {
      keranjang.push(nama);
      simpan();
      tampilkanKeranjang();
    }

    function simpan() {
      localStorage.setItem(KUNCI, keranjang);
    }

    function muat() {
      const data = localStorage.getItem(KUNCI);
      if (data) {
        keranjang = data;
      }
    }

    muat();
    tampilkanMenu();
    tampilkanKeranjang();
  </script>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Cari error di konsol', bayar: 0,
    pesan: [
      'Mas {nama}... saya Alif, yang buka warung kopi baru dekat kos Mas. Saya mau jujur dulu: website saya itu saya salin dari Warung Kopi Senja buatan Mas 🙇',
      'Saya cuma ganti nama. Tapi sekarang rusak: menunya muncul, tapi daftar pesanannya nggak jalan. Anehnya, pesanan di website Bu Sari juga jadi kacau.',
      'Saya belum bisa bayar, Mas. Tapi tolong bantu. Kata orang, error itu kelihatan di konsol.'
    ],
    reqs: [
      { label: 'Konsol bersih saat halaman dibuka', ask: 'konsolnya masih merah waktu halaman dibuka',
        test: (d, w) => (w.__errs || []).length === 0 },
      { label: 'Empat tombol menu tampil', ask: 'tombol menunya nggak lengkap empat',
        test: d => T.all(d, '.menu-item').length === 4 },
      { label: 'Tombol menu menambah pesanan ke daftar', ask: 'saya pencet menunya, daftar pesanannya tetap kosong', kecuali: 1,
        test: d => { T.all(d, '.menu-item')[0].click(); return T.all(d, '#daftar-pesan li').length >= 1; } }
    ],
    catatan: {
      teks: 'Konsol adalah tempat browser melaporkan masalah. Di game, konsol ada di bawah editor. Di browser sungguhan, buka DevTools dengan F12 (atau klik kanan lalu Inspect), lalu pilih tab Console. Baca pesannya pelan-pelan: <code>Cannot set properties of null</code> berarti kode mencoba mengubah elemen yang tidak ditemukan. Biasanya karena id di JavaScript berbeda dengan id di HTML, walaupun hanya beda satu huruf.',
      contoh: '<ul id="daftar-belanja"></ul>\n\n// SALAH: id tidak cocok, hasilnya null\ndocument.getElementById("daftar-belanjaan");\n\n// BENAR\ndocument.getElementById("daftar-belanja");',
      petunjuk: ['Baca error di konsol, cari fungsi yang memanggil getElementById, lalu samakan id-nya dengan yang ada di HTML.', 'function tampilkanKeranjang() {\n  const daftar = document.getElementById("daftar-pesan");\n  // ...\n}']
    },
    sukses: ['Daftar pesanannya muncul! Saya sampai tepuk tangan sendiri di warung 😅', 'Saya belum bisa bayar, Mas. Tapi kopi Mas gratis di tempat saya, kapan pun.']
  },
  {
    judul: 'Simpan sebagai JSON', bayar: 0,
    pesan: [
      'Sekarang ada yang aneh lagi. Pesanan saya memang tersimpan, tapi waktu saya intip di DevTools, tab Application, isinya cuma tulisan "Kopi Tubruk,Teh Tarik". Bukan daftar.',
      'Kata forum, localStorage cuma bisa menyimpan teks. Jadi daftarnya harus diubah dulu jadi teks JSON.'
    ],
    reqs: [
      { label: 'Pesanan disimpan sebagai JSON (JSON.stringify)', ask: 'isi penyimpanannya masih teks biasa, bukan JSON',
        test: (d, w) => { const m = T.all(d, '.menu-item'); if (m.length < 3) return false; m[0].click(); m[2].click(); return Object.values(w.__mem).some(v => { try { const x = JSON.parse(v); return Array.isArray(x) && x.length >= 2; } catch (e) { return false; } }); } },
      { label: 'Konsol tetap bersih', ask: 'konsolnya merah lagi',
        test: (d, w) => (w.__errs || []).length === 0 }
    ],
    catatan: {
      teks: '<code>localStorage</code> hanya menyimpan teks. Kalau kamu memberinya array, JavaScript diam-diam mengubahnya menjadi teks seperti "a,b", dan susunannya hilang. <code>JSON.stringify(data)</code> mengubah array atau objek menjadi teks JSON yang masih bisa dibaca ulang. Di browser sungguhan, isinya bisa dilihat di DevTools, tab Application, bagian Local Storage.',
      contoh: 'const belanja = ["gula", "kopi"];\nlocalStorage.setItem("belanja", JSON.stringify(belanja));\n// tersimpan: ["gula","kopi"]',
      petunjuk: ['Di fungsi simpan(), bungkus keranjang dengan JSON.stringify.', 'function simpan() {\n  localStorage.setItem(KUNCI, JSON.stringify(keranjang));\n}']
    },
    sukses: ['Sekarang isinya kelihatan rapi, pakai kurung siku segala. Rasanya kayak lihat laci yang baru dibereskan.', 'Masih gratis ya, Mas. Maaf 🙇']
  },
  {
    judul: 'Baca lagi saat dibuka', bayar: 0,
    pesan: [
      'Pesanannya sudah tersimpan rapi. Tapi kalau halamannya saya muat ulang, malah error merah lagi 😭',
      'Kayaknya waktu dibaca, bentuknya masih teks, belum jadi daftar lagi.'
    ],
    reqs: [
      { label: 'Pesanan tersimpan sebagai JSON', ask: 'pesanannya belum tersimpan sebagai JSON',
        test: (d, w) => { const m = T.all(d, '.menu-item'); if (m.length < 3) return false; m[0].click(); m[2].click(); return Object.values(w.__mem).some(v => { try { return Array.isArray(JSON.parse(v)); } catch (e) { return false; } }); } },
      { label: 'Dibuka ulang: pesanan tersimpan tampil lagi', ask: 'saya muat ulang, pesanannya hilang dari daftar', pass: 'ulang', kecuali: 0,
        test: d => T.all(d, '#daftar-pesan li').length >= 2 },
      { label: 'Dibuka ulang: konsol bersih', ask: 'saya muat ulang, konsolnya merah', pass: 'ulang', kecuali: 0,
        test: (d, w) => (w.__errs || []).length === 0 }
    ],
    catatan: {
      teks: 'Kebalikan dari <code>JSON.stringify</code> adalah <code>JSON.parse</code>: teks JSON diubah kembali menjadi array atau objek. Saat halaman dibuka, <code>getItem</code> mengembalikan teks, atau <code>null</code> kalau belum ada. Jadi parse hanya kalau datanya ada. Pemeriksa akan menambah dua pesanan, lalu membuka ulang halamannya.',
      contoh: 'const teks = localStorage.getItem("belanja");\nif (teks) {\n  belanja = JSON.parse(teks);\n}',
      petunjuk: ['Di fungsi muat(), ubah keranjang = data menjadi keranjang = JSON.parse(data).', 'function muat() {\n  const data = localStorage.getItem(KUNCI);\n  if (data) {\n    keranjang = JSON.parse(data);\n  }\n}']
    },
    sukses: ['Saya muat ulang sepuluh kali, pesanannya tetap di situ. Setia banget 😅', 'Saya catat utang budi ini, Mas.']
  },
  {
    judul: 'Kunci yang bentrok', bayar: 0,
    seed: { warungkopi_v1: JSON.stringify({ pemilik: 'Warung Kopi Senja', pesananHariIni: 27, catatan: 'Data Bu Sari. Jangan diubah.' }) },
    pesan: [
      'Mas, saya baru sadar kenapa website Bu Sari ikut kacau.',
      'Website saya dan website Bu Sari numpang di hosting gratis yang sama. Kata forum, kalau alamatnya satu domain, localStorage-nya juga satu. Dan kunci saya masih "warungkopi_v1", sama persis dengan punya Bu Sari 😱',
      'Jadi website saya membaca data Bu Sari, dan kadang menimpanya. Tolong ganti kunci saya jadi "kopialif_v2", dan jangan sentuh data Bu Sari sama sekali.'
    ],
    reqs: [
      { label: 'Halaman terbuka tanpa error walau ada data Bu Sari', ask: 'waktu data Bu Sari ada, halaman saya langsung error',
        test: (d, w) => (w.__errs || []).length === 0 },
      { label: 'Pesanan disimpan di kunci "kopialif_v2"', ask: 'pesanannya belum tersimpan di kunci kopialif_v2',
        test: (d, w) => { const m = T.all(d, '.menu-item'); if (m.length < 2) return false; m[0].click(); m[1].click(); try { const x = JSON.parse(w.__mem.kopialif_v2); return Array.isArray(x) && x.length >= 2; } catch (e) { return false; } } },
      { label: 'Data Bu Sari di "warungkopi_v1" tidak berubah', ask: 'data Bu Sari masih ikut berubah', kecuali: 1,
        test: (d, w) => w.__mem.warungkopi_v1 === JSON.stringify({ pemilik: 'Warung Kopi Senja', pesananHariIni: 27, catatan: 'Data Bu Sari. Jangan diubah.' }) },
      { label: 'Kunci lama tidak dipakai lagi di kode', ask: 'di kodenya masih ada kunci warungkopi_v1',
        test: d => !/["'`]warungkopi_v1["'`]/.test(T.skrip(d)) }
    ],
    catatan: {
      teks: 'Semua halaman dari domain yang sama berbagi satu localStorage. Kalau dua website memakai nama kunci yang sama, datanya saling menimpa. Karena itu, kunci sebaiknya unik dan diberi versi, misalnya <code>namaaplikasi_v2</code>. Versi memudahkan saat bentuk data berubah: kunci baru berarti mulai bersih tanpa merusak data lama. Di dunia game, data Bu Sari sudah ada di <code>warungkopi_v1</code> saat halaman dibuka.',
      contoh: '// bentrok: dipakai dua aplikasi\nconst KUNCI = "data";\n\n// aman: unik dan berversi\nconst KUNCI = "kasirdedi_v2";',
      petunjuk: ['Cukup ubah isi konstanta KUNCI. Jangan hapus atau timpa warungkopi_v1.', 'const KUNCI = "kopialif_v2";']
    },
    sukses: ['Bu Sari barusan kabari, pesanannya sudah normal lagi. Saya malu, tapi lega 🙇', 'Beliau titip salam. Katanya, "Bilang ke Mas {nama}, jangan galak-galak sama Alif."']
  },
  {
    judul: 'Cek Keaslian', bayar: 0,
    pesan: [
      'Mas, saya punya ide. Biar saya nggak asal salin lagi, bikinkan saya alat "Cek Keaslian".',
      'Dua kotak teks: kotak pertama untuk kode saya, kotak kedua untuk kode orang lain. Pencet tombol "Cek Keaslian", lalu di elemen id "hasil-cek" muncul "Identik" kalau isinya sama, atau "Berbeda" kalau nggak.',
      'Tapi spasi berlebih dan huruf besar-kecil jangan dihitung beda ya. "Halo  Dunia" dan "halo dunia" itu tetap identik. Nyalin ya nyalin 😅'
    ],
    reqs: [
      { label: 'Dua kotak teks dan tombol Cek Keaslian', ask: 'kotak teks atau tombol Cek Keaslian-nya belum ada',
        test: d => T.all(d, 'textarea').length >= 2 && !!(T.tombol(d, 'cek keaslian', 'check authenticity') || T.tombol(d, 'keaslian', 'authenticity')) },
      { label: 'Teks yang sama persis: "Identik"', ask: 'saya isi dua teks yang sama, hasilnya belum "Identik"', kecuali: 0,
        test: (d, w) => (T.cekKeaslian(d, w, '<h1>Kopi</h1>', '<h1>Kopi</h1>') || '').match(/identi(k|cal)/) },
      { label: 'Beda spasi dan huruf besar-kecil tetap "Identik"', ask: 'beda spasi atau huruf besar-kecil masih dianggap berbeda', kecuali: 0,
        test: (d, w) => (T.cekKeaslian(d, w, 'Halo   Dunia\n', '  halo dunia') || '').match(/identi(k|cal)/) },
      { label: 'Teks yang berbeda: "Berbeda"', ask: 'dua teks yang jelas beda malah dibilang identik', kecuali: 0,
        test: (d, w) => { const h = T.cekKeaslian(d, w, 'Kopi Alif', 'Kopi Senja') || ''; return T.ada(h, 'berbeda', 'different') && !/identi(k|cal)/.test(h); } }
    ],
    catatan: {
      teks: 'Membandingkan teks dengan <code>===</code> sangat ketat: satu spasi atau satu huruf besar sudah dianggap beda. Karena itu, rapikan dulu kedua teks: <code>toLowerCase()</code> untuk huruf, <code>replace(/\\s+/g, " ")</code> untuk mengubah spasi, tab, atau baris baru yang berderet menjadi satu spasi, dan <code>trim()</code> untuk membuang spasi di ujung. Setelah itu baru dibandingkan.',
      contoh: 'function rapikan(teks) {\n  return teks.toLowerCase().replace(/\\s+/g, " ").trim();\n}\nrapikan("  Selamat   Pagi ") === rapikan("selamat pagi"); // true',
      petunjuk: ['Buat fungsi rapikan(teks), lalu bandingkan rapikan(a) === rapikan(b) saat tombol dipencet.', '<textarea id="kode-a"></textarea>\n<textarea id="kode-b"></textarea>\n<button onclick="cekKeaslian()">Cek Keaslian</button>\n<p id="hasil-cek"></p>\n\nfunction rapikan(teks) {\n  return teks.toLowerCase().replace(/\\s+/g, " ").trim();\n}\nfunction cekKeaslian() {\n  const a = rapikan(document.getElementById("kode-a").value);\n  const b = rapikan(document.getElementById("kode-b").value);\n  document.getElementById("hasil-cek").textContent = a === b ? "Identik" : "Berbeda";\n}']
    },
    sukses: ['Saya tes kode saya dengan kode Warung Kopi Senja. Hasilnya... "Identik". Oke, saya janji belajar bikin sendiri mulai besok 😅', 'Terima kasih, Mas. Sungguh.']
  },
  {
    judul: 'File yang muncul sendiri', bayar: 0, aset: ['timeline_b.json'], pilihan: 'timeline_b', setelah: 'fotoTimeline',
    pesan: [
      'Mas... ada yang aneh. Di folder website saya tiba-tiba ada file "timeline_b.json". Saya nggak pernah bikin file itu.',
      'Tanggal filenya dua minggu dari sekarang. Gimana bisa?',
      'Saya takut membukanya. Mas bisa baca isinya lewat kode? Ambil dengan fetch, lalu tampilkan di konsol pakai console.log(JSON.stringify(data, null, 2)), biar rapi dan terbaca semua.'
    ],
    reqs: [
      { label: 'timeline_b.json diambil dengan fetch', ask: 'filenya belum diambil pakai fetch',
        test: d => /fetch\s*\(\s*["'`](\.\/)?timeline_b\.json/.test(T.skrip(d)) },
      { label: 'Isinya tampil di konsol (console.log)', ask: 'isi filenya belum muncul di konsol', kecuali: 0,
        test: (d, w) => (w.__logs || []).some(l => l.teks.includes('JANGAN BUKA PORTAL SENGATA')) },
      { label: 'Ditampilkan rapi dengan JSON.stringify(data, null, 2)', ask: 'isinya masih satu baris panjang, belum rapi', kecuali: 1,
        test: (d, w) => (w.__logs || []).some(l => typeof l.args[0] === 'string' && l.args[0].includes('\n  "')) }
    ],
    catatan: {
      teks: '<code>console.log</code> menulis apa pun ke konsol. Objek bisa dicetak langsung, tapi <code>JSON.stringify(data, null, 2)</code> mengubahnya menjadi teks dengan indentasi dua spasi, sehingga setiap isian tampil di barisnya sendiri. Argumen kedua (<code>null</code>) dipakai untuk menyaring isian, dan di sini tidak diperlukan. Hasilnya akan muncul di konsol di bawah editor.',
      contoh: 'const profil = { nama: "Sari", kota: "Sengata" };\nconsole.log(JSON.stringify(profil, null, 2));\n// {\n//   "nama": "Sari",\n//   "kota": "Sengata"\n// }',
      petunjuk: ['Buat fungsi async kecil: fetch, json(), lalu console.log dengan JSON.stringify(data, null, 2).', '<script>\n  async function bacaFileAneh() {\n    const respon = await fetch("timeline_b.json");\n    const data = await respon.json();\n    console.log(JSON.stringify(data, null, 2));\n  }\n  bacaFileAneh();\n<\/script>']
    },
    sukses: ['Mas... itu foto warung Bu Sari. Tutup. Tanggalnya dua minggu lagi.', '"JANGAN BUKA PORTAL SENGATA." Maksudnya apa, Mas? Saya... pulang dulu ya. Kopi gratisnya tetap berlaku.']
  }
  ]
},
/* =========================================================
   BAB 7 — Portal Sengata.id (Pak Lurah Hendra)
   ========================================================= */
{
  id: 'hendra', tema: 'badai',
  langit: [['#3A4260', '#5E6582'], ['#323955', '#525873'], ['#2A3049', '#454A64'], ['#232840', '#3A3E57'], ['#1C2036', '#30334B'], ['#161A2E', '#282B41'], ['#1B2A3A', '#6B2D5C']],
  api: { 'api/lapor': { metode: 'POST', gagalKe: 7 } },
  klien: {
    nama: 'Pak Lurah Hendra', usaha: 'Kelurahan Sengata', huruf: 'H', warna: '#7FB3A6', url: 'sengata.id',
    kirimTeks: 'Sudah saya perbarui, Pak Lurah. Mohon dicek.',
    revisiBuka: 'Sudah saya lihat, Nak. Tapi ', revisiDaftar: 'masih ada catatan dari staf:', revisiTutup: 'Tidak apa-apa. Pemerintahan juga butuh revisi 😄'
  },
  file: 'sengata-id.html',
  sewa: 400000,
  reputasi: { plus: 3, minus: 2, alasan: 'portal sempat error 500 di depan staf kelurahan' },
  unlock: ['Retakan multiverse: timeline bercabang'],
  hadiah: { id: 'plakat', teks: 'Kelurahan mengirim plakat "Mitra Digital Kelurahan Sengata". Sudah dipasang di papan gabus.' },
  penutup: {
    judul: 'Proyek ketujuh selesai',
    teks: 'Sengata.id sekarang punya daftar pengaduan yang terurut, formulir dengan validasi KTP, status prioritas otomatis, draft yang selamat dari mati listrik, dan pengiriman ke server yang tahan error. Tapi sejak laporan ketujuh itu, ada yang retak.'
  },
  pembuka: 'Proyek baru: Sengata.id. Proyek paling besar sejauh ini. Hujan di luar makin deras.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sengata.id, Portal Warga</title>
  <style>
    :root {
      --hijau: #1F6F5C;
      --latar: #F4F7F6;
      --teks: #1E2B28;
    }
    body {
      background-color: var(--latar);
      color: var(--teks);
      font-family: system-ui, sans-serif;
      max-width: 860px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      border-bottom: 4px solid var(--hijau);
      margin-bottom: 20px;
    }
    h1 {
      color: var(--hijau);
    }
  </style>
</head>
<body>
  <header>
    <h1>Sengata.id</h1>
    <p>Portal resmi warga Kelurahan Sengata.</p>
  </header>

  <section id="daftar">
    <h2>Pengaduan Warga</h2>
    <div id="daftar-pengaduan"></div>
  </section>

  <section id="lapor">
    <h2>Lapor</h2>
  </section>

</body>
</html>
`,
  tugas: [
  {
    judul: 'Daftar pengaduan', bayar: 350000, aset: ['logo-sengata.svg', 'pengaduan.json'],
    pesan: [
      'Selamat malam, Nak {nama}. Saya Hendra, Lurah Sengata. Nama kamu sering disebut warga: Pak Dedi, Kak Riko, bahkan Bu Sari.',
      'Sengata harus go digital. Saya minta portal resmi kelurahan. Pertama, daftar pengaduan warga. Datanya ada di pengaduan.json, logo kelurahan juga saya kirim.',
      'Tampilkan setiap pengaduan dalam kotak dengan class "pengaduan": nama, kategori, isi, dan status. Urutkan dari yang paling baru, supaya staf saya tidak melewatkan laporan terbaru.'
    ],
    reqs: [
      { label: 'Logo Sengata.id (logo-sengata.svg) tampil dengan alt', ask: 'logo kelurahannya belum muncul, atau belum ada keterangannya',
        test: d => T.all(d, 'img').some(i => T.gambarOk(i) && (i.getAttribute('alt') || '').trim().length > 2) },
      { label: 'Data diambil dari pengaduan.json dengan fetch', ask: 'datanya belum dibaca dari pengaduan.json',
        test: d => /fetch\s*\(\s*["'`](\.\/)?pengaduan\.json/.test(T.skrip(d)) },
      { label: 'Delapan pengaduan tampil (class="pengaduan")', ask: 'pengaduannya belum tampil delapan',
        test: d => T.all(d, '.pengaduan').length === 8 },
      { label: 'Urut dari yang paling baru', ask: 'urutannya belum dari yang paling baru', kecuali: 2,
        test: d => { const p = T.all(d, '.pengaduan'); return p.length === 8 && T.text(p[0]).includes('pak hasan') && T.text(p[7]).includes('dek nisa'); } },
      { label: 'Tidak ada pengaduan yang ditulis manual', ask: 'ada pengaduan yang diketik manual di HTML',
        test: (d, w, src) => new DOMParser().parseFromString(src, 'text/html').querySelectorAll('.pengaduan').length === 0 }
    ],
    catatan: {
      teks: 'Untuk mengurutkan array, pakai <code>sort()</code> dengan fungsi pembanding. Fungsi itu menerima dua item, <code>a</code> dan <code>b</code>, lalu mengembalikan angka: negatif berarti <code>a</code> di depan, positif berarti <code>b</code> di depan. Tanggal berformat <code>"2026-09-24"</code> bisa diubah menjadi waktu dengan <code>new Date(teks)</code>, lalu dikurangkan. <code>b - a</code> menghasilkan urutan dari yang terbaru.',
      contoh: 'const nilai = [{ nama: "A", skor: 70 }, { nama: "B", skor: 90 }];\nnilai.sort((a, b) => b.skor - a.skor);\n// B dulu, baru A',
      petunjuk: ['Setelah await respon.json(), urutkan dengan sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)), lalu buat kotak untuk setiap pengaduan.', '<img src="logo-sengata.svg" alt="Logo Sengata.id" width="64">\n\n<script>\n  let semuaPengaduan = [];\n\n  function tampilkan() {\n    const wadah = document.getElementById("daftar-pengaduan");\n    wadah.innerHTML = "";\n    semuaPengaduan.forEach(function (p) {\n      wadah.innerHTML += `\n        <div class="pengaduan">\n          <strong>${p.nama}</strong>, ${p.kategori}\n          <p>${p.isi}</p>\n          <span class="status">${p.status}</span>\n        </div>`;\n    });\n  }\n\n  async function muatPengaduan() {\n    const respon = await fetch("pengaduan.json");\n    semuaPengaduan = await respon.json();\n    semuaPengaduan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));\n    tampilkan();\n  }\n  muatPengaduan();\n<\/script>']
    },
    sukses: ['Staf saya langsung melihat laporan jembatan Pak Hasan di paling atas. Itu memang yang paling mendesak. Bagus, Nak.', 'Dana tahap pertama dari kas kelurahan.']
  },
  {
    judul: 'Formulir lapor warga', bayar: 300000,
    pesan: [
      'Sekarang formulir untuk warga melapor, taruh di bagian Lapor.',
      'Isinya tiga kolom: nama, nomor KTP, dan isi laporan. Pakai id "nama", "ktp", dan "laporan", dan formulirnya id "form-lapor". Setiap kolom harus ada labelnya. Warga kita banyak yang sepuh.',
      'Kolom KTP isinya angka, tapi jangan pakai type number. Nomor KTP bisa diawali nol dan bukan untuk dihitung. Pakai inputmode="numeric" saja supaya keyboard HP langsung angka.'
    ],
    reqs: [
      { label: 'Formulir id="form-lapor" di bagian Lapor', ask: 'formulirnya belum ada di bagian Lapor',
        test: d => !!d.querySelector('#lapor #form-lapor') },
      { label: 'Kolom #nama, #ktp, dan #laporan (textarea)', ask: 'kolom nama, KTP, atau laporannya belum lengkap', kecuali: 0,
        test: d => !!d.querySelector('#form-lapor input#nama') && !!d.querySelector('#form-lapor input#ktp') && !!d.querySelector('#form-lapor textarea#laporan') },
      { label: 'Setiap kolom punya label', ask: 'ada kolom yang belum ada labelnya', kecuali: 1,
        test: d => ['nama', 'ktp', 'laporan'].every(id => T.punyaLabel(d, d.getElementById(id))) },
      { label: 'Kolom KTP memakai inputmode="numeric", bukan type="number"', ask: 'kolom KTP-nya masih type number, atau belum pakai inputmode', kecuali: 1,
        test: d => { const k = d.getElementById('ktp'); return k.getAttribute('inputmode') === 'numeric' && k.type !== 'number'; } },
      { label: 'Tombol kirim', ask: 'tombol kirimnya belum ada', kecuali: 0,
        test: d => !!d.querySelector('#form-lapor button, #form-lapor input[type="submit"]') }
    ],
    catatan: {
      teks: 'Tidak semua angka adalah bilangan. Nomor KTP, nomor HP, dan kode pos tidak pernah dijumlahkan, dan nol di depannya penting. <code>type="number"</code> bisa membuang nol itu dan menampilkan tombol naik-turun yang aneh. Pakai <code>type="text"</code> dengan <code>inputmode="numeric"</code>: tetap teks, tapi HP menampilkan keyboard angka. Atribut <code>maxlength="16"</code> membatasi panjangnya.',
      contoh: '<label for="hp">Nomor HP</label>\n<input type="text" id="hp" inputmode="numeric" maxlength="13">',
      petunjuk: ['Buat <form id="form-lapor"> berisi tiga pasang label dan kolom, lalu tombol.', '<form id="form-lapor">\n  <label for="nama">Nama lengkap</label>\n  <input type="text" id="nama" required>\n\n  <label for="ktp">Nomor KTP (16 angka)</label>\n  <input type="text" id="ktp" inputmode="numeric" maxlength="16" required>\n\n  <label for="laporan">Isi laporan</label>\n  <textarea id="laporan" rows="5" required></textarea>\n\n  <button type="submit">Kirim laporan</button>\n  <p id="pesan-error"></p>\n</form>']
    },
    sukses: ['Ibu saya yang sudah 70 tahun bisa mengisinya sendiri. Beliau bangga sekali, Nak.', 'Dana tahap kedua.']
  },
  {
    judul: 'Validasi KTP', bayar: 400000,
    pesan: [
      'Staf saya menemukan masalah: ada warga iseng mengisi KTP "12345", ada juga yang pakai huruf.',
      'Nomor KTP harus tepat 16 angka. Kalau salah, jangan diterima, dan tampilkan di elemen id "pesan-error": "Nomor KTP harus 16 angka".',
      'Kalau benar, laporannya langsung masuk ke daftar paling atas dengan status "Normal", dan pesan errornya hilang. Halamannya jangan dimuat ulang, ya.'
    ],
    reqs: [
      { label: 'KTP "12345" ditolak dengan pesan "Nomor KTP harus 16 angka"', ask: 'KTP "12345" masih diterima, atau pesannya belum muncul',
        test: async (d, w) => { const n = T.all(d, '.pengaduan').length; await T.lapor(d, w, { ktp: '12345' }); const e = d.getElementById('pesan-error'); return !!e && T.ada(T.text(e), '16 angka', '16 digits') && T.all(d, '.pengaduan').length === n; } },
      { label: 'KTP berisi huruf ditolak', ask: 'KTP yang ada hurufnya masih diterima', kecuali: 0,
        test: async (d, w) => { const n = T.all(d, '.pengaduan').length; await T.lapor(d, w, { ktp: '64720112abcd0001' }); return T.ada(T.text(d.getElementById('pesan-error')), '16 angka', '16 digits') && T.all(d, '.pengaduan').length === n; } },
      { label: 'KTP 16 angka diterima dan masuk paling atas', ask: 'laporan dengan KTP yang benar belum masuk ke daftar paling atas',
        test: async (d, w) => { const n = T.all(d, '.pengaduan').length; await T.lapor(d, w, { nama: 'Rani Wulandari' }); const p = T.all(d, '.pengaduan'); return p.length === n + 1 && T.text(p[0]).includes('rani wulandari'); } },
      { label: 'Pesan error hilang setelah KTP benar', ask: 'pesan error-nya masih nongol walau KTP sudah benar', kecuali: 2,
        test: async (d, w) => { await T.lapor(d, w, { ktp: '123' }); await T.lapor(d, w, { nama: 'Pak Budi' }); return !T.ada(T.text(d.getElementById('pesan-error')), '16 angka', '16 digits'); } },
      { label: 'Halaman tidak dimuat ulang (preventDefault)', ask: 'halamannya kedip dan kosong setelah dikirim',
        test: (d, w) => w.__cegah === true }
    ],
    catatan: {
      teks: 'Ekspresi reguler (regex) adalah pola untuk memeriksa bentuk teks. <code>/^\\d{16}$/</code> berarti: dari awal (<code>^</code>) sampai akhir (<code>$</code>), tepat 16 digit (<code>\\d{16}</code>). <code>pola.test(teks)</code> menghasilkan true atau false. Laporan baru ditambahkan ke depan array dengan <code>unshift()</code>, lalu daftarnya digambar ulang.',
      contoh: 'const kodePos = /^\\d{5}$/;\nkodePos.test("75611"); // true\nkodePos.test("7561a"); // false',
      petunjuk: ['Di event submit: preventDefault, lalu cek /^\\d{16}$/.test(ktp). Kalau gagal, tulis pesan lalu return. Kalau lolos, kosongkan pesan, unshift laporan baru, lalu tampilkan().', 'document.getElementById("form-lapor").addEventListener("submit", function (event) {\n  event.preventDefault();\n  const ktp = document.getElementById("ktp").value.trim();\n  const pesanError = document.getElementById("pesan-error");\n  if (!/^\\d{16}$/.test(ktp)) {\n    pesanError.textContent = "Nomor KTP harus 16 angka";\n    return;\n  }\n  pesanError.textContent = "";\n  semuaPengaduan.unshift({\n    nama: document.getElementById("nama").value,\n    kategori: "Umum",\n    isi: document.getElementById("laporan").value,\n    tanggal: new Date().toISOString().slice(0, 10),\n    status: "Normal"\n  });\n  tampilkan();\n});']
    },
    sukses: ['Warga iseng sekarang kena tegur websitenya sendiri. Saya tidak perlu turun tangan 😄', 'Dana tahap ketiga.']
  },
  {
    judul: 'Laporan prioritas', bayar: 400000,
    pesan: [
      'Ada kebijakan baru dari saya. Laporan yang panjang biasanya masalah serius, warga sampai menulis detail.',
      'Jadi: kalau isi laporan lebih dari 100 kata, statusnya "Prioritas". Kalau 100 kata atau kurang, "Normal".',
      'Staf saya akan mengujinya dengan laporan 101 kata, tepat 100 kata, laporan pendek, dan laporan yang spasinya berantakan.'
    ],
    reqs: [
      { label: 'Laporan 101 kata berstatus Prioritas', ask: 'laporan 101 kata belum jadi Prioritas',
        test: async (d, w) => { await T.lapor(d, w, { laporan: T.kata(101) }); const p = d.querySelector('.pengaduan'); return !!p && T.ada(T.text(p), 'prioritas', 'priority'); } },
      { label: 'Laporan 20 kata berstatus Normal', ask: 'laporan pendek malah jadi Prioritas', kecuali: 0,
        test: async (d, w) => { await T.lapor(d, w, { laporan: T.kata(20) }); const p = d.querySelector('.pengaduan'); return T.text(p).includes('normal') && !T.ada(T.text(p), 'prioritas', 'priority'); } },
      { label: 'Tepat 100 kata masih Normal', ask: 'laporan tepat 100 kata harusnya masih Normal', kecuali: 0,
        test: async (d, w) => { await T.lapor(d, w, { laporan: T.kata(100) }); const p = d.querySelector('.pengaduan'); return T.text(p).includes('normal') && !T.ada(T.text(p), 'prioritas', 'priority'); } },
      { label: 'Spasi ganda dan baris baru tidak ikut dihitung sebagai kata', ask: 'laporan 100 kata yang spasinya berantakan malah dihitung lebih dari 100', kecuali: 0,
        test: async (d, w) => { await T.lapor(d, w, { laporan: '  ' + T.kata(100).split(' ').join('   ') + '\n\n' }); const p = d.querySelector('.pengaduan'); return T.text(p).includes('normal') && !T.ada(T.text(p), 'prioritas', 'priority'); } }
    ],
    catatan: {
      teks: 'Menghitung kata artinya memecah teks di setiap spasi dengan <code>split()</code>. Tapi <code>split(" ")</code> keliru kalau ada spasi ganda atau baris baru, karena potongan kosong ikut terhitung. Pecah dengan regex <code>/\\s+/</code> setelah <code>trim()</code>, atau saring potongan kosong dengan <code>filter(Boolean)</code>. Lalu pakai <code>if/else</code> untuk menentukan status.',
      contoh: 'const kalimat = "  satu   dua\\ntiga ";\nkalimat.trim().split(/\\s+/).length; // 3',
      petunjuk: ['Hitung jumlah kata dari isi laporan, lalu tentukan status: lebih dari 100 berarti "Prioritas", selain itu "Normal".', 'const isi = document.getElementById("laporan").value;\nconst jumlahKata = isi.trim().split(/\\s+/).filter(Boolean).length;\nlet status;\nif (jumlahKata > 100) {\n  status = "Prioritas";\n} else {\n  status = "Normal";\n}']
    },
    sukses: ['Laporan panjang Pak Samsul soal selokan langsung dapat label Prioritas. Beliau sampai menelepon untuk berterima kasih.', 'Dana tahap keempat.']
  },
  {
    judul: 'Simpan draft', bayar: 450000,
    pesan: [
      'Kemarin hujan deras dan listrik se-kelurahan padam. Bu Ani sudah menulis laporan panjang, lalu... hilang semua 😔',
      'Tolong simpan draft laporan otomatis setiap warga mengetik, pakai localStorage. Kalau halaman dibuka lagi, isinya kembali.',
      'Tapi setelah laporan berhasil dikirim, draftnya dihapus, supaya warga berikutnya tidak melihat tulisan orang lain.'
    ],
    reqs: [
      { label: 'Draft tersimpan setiap mengetik (event input)', ask: 'waktu mengetik, draftnya belum tersimpan',
        test: (d, w) => { const t = d.getElementById('laporan'); if (!t) return false; t.value = 'Selokan di gang Kenanga mampet sejak Senin.'; t.dispatchEvent(new w.Event('input', { bubbles: true })); w.__snapshot = JSON.parse(JSON.stringify(w.__mem)); return Object.values(w.__mem).some(v => String(v).includes('Selokan di gang Kenanga')); } },
      { label: 'Dibuka lagi: isi draft kembali', ask: 'halaman saya buka lagi, draftnya hilang', pass: 'ulang', kecuali: 0,
        test: d => { const t = d.getElementById('laporan'); return !!t && t.value.includes('Selokan di gang Kenanga'); } },
      { label: 'Setelah terkirim, draft dihapus', ask: 'setelah laporan terkirim, draftnya masih tersimpan', pass: 'ulang', kecuali: 1,
        test: async (d, w) => { await T.lapor(d, w, { laporan: 'Selokan di gang Kenanga mampet sejak Senin.' }); return !Object.values(w.__mem).some(v => String(v).includes('Selokan di gang Kenanga')); } }
    ],
    catatan: {
      teks: 'Event <code>input</code> berjalan di setiap ketukan, jadi cocok untuk menyimpan draft. Saat halaman dibuka, isi kolom dari <code>localStorage.getItem</code>, dan beri <code>|| ""</code> supaya tidak tertulis "null". Setelah laporan diterima, hapus draft dengan <code>localStorage.removeItem</code>. Kunci penyimpanannya harus unik. Ingat pelajaran dari Mas Alif.',
      contoh: 'const catatan = document.getElementById("catatan");\ncatatan.value = localStorage.getItem("catatan_draft") || "";\ncatatan.addEventListener("input", function () {\n  localStorage.setItem("catatan_draft", catatan.value);\n});',
      petunjuk: ['Pakai kunci unik, misalnya "sengata_draft_v1". Isi textarea saat halaman dibuka, simpan di event input, lalu removeItem setelah laporan diterima.', 'const KUNCI_DRAFT = "sengata_draft_v1";\nconst kolomLaporan = document.getElementById("laporan");\nkolomLaporan.value = localStorage.getItem(KUNCI_DRAFT) || "";\nkolomLaporan.addEventListener("input", function () {\n  localStorage.setItem(KUNCI_DRAFT, kolomLaporan.value);\n});\n\n// di event submit, setelah laporan diterima:\nlocalStorage.removeItem(KUNCI_DRAFT);\nkolomLaporan.value = "";']
    },
    sukses: ['Bu Ani mencoba menulis, lalu saya cabut kabel laptopnya. Tulisannya selamat! Beliau hampir menangis, Nak.', 'Dana tahap kelima.']
  },
  {
    judul: 'Kirim ke server kelurahan', bayar: 600000, glitch: true,
    pesan: [
      'Terakhir, dan ini yang paling penting. Laporan harus benar-benar terkirim ke server kelurahan, bukan hanya tampil di layar.',
      'Kirim datanya dengan fetch ke "api/lapor", method POST, dan isinya JSON.stringify dari laporannya. Laporan baru tampil di daftar hanya kalau jawaban server ok.',
      'Server kami masih sering rewel. Kalau jawabannya tidak ok, tampilkan "Server sedang bermasalah" dan jangan hapus draftnya. Staf saya akan mengirim tujuh laporan berturut-turut untuk mengujinya.'
    ],
    reqs: [
      { label: 'Laporan dikirim dengan fetch POST ke api/lapor (JSON)', ask: 'laporannya belum dikirim ke api/lapor dengan POST',
        test: async (d, w) => { const h = await T.tujuhLaporan(d, w); return h.req.length > 0 && h.req.every(r => { try { JSON.parse(r.body); return r.metode === 'POST'; } catch (e) { return false; } }); } },
      { label: 'Enam laporan pertama masuk ke daftar', ask: 'dari tujuh laporan, enam yang pertama belum masuk semua', kecuali: 0,
        test: async (d, w) => { const h = await T.tujuhLaporan(d, w); return h.akhir === h.awal + 6; } },
      { label: 'Laporan ketujuh: muncul "Server sedang bermasalah"', ask: 'waktu laporan ketujuh gagal, pesan "Server sedang bermasalah" belum muncul', kecuali: 0,
        test: async (d, w) => (await T.tujuhLaporan(d, w)).pesan },
      { label: 'Draft laporan ketujuh tidak dihapus', ask: 'laporan ketujuh gagal, tapi draftnya malah ikut terhapus', kecuali: 0,
        test: async (d, w) => (await T.tujuhLaporan(d, w)).draft },
      { label: 'Konsol bersih selama pengujian', ask: 'konsolnya merah waktu staf saya menguji',
        test: async (d, w) => { await T.tujuhLaporan(d, w); return (w.__errs || []).length === 0; } }
    ],
    catatan: {
      teks: '<code>fetch</code> juga bisa mengirim data. Beri objek kedua berisi <code>method: "POST"</code>, <code>headers</code> yang menyebut isinya JSON, dan <code>body: JSON.stringify(data)</code>. Server yang menjawab dengan error, misalnya 500, tidak membuat fetch gagal. Karena itu, selalu periksa <code>respon.ok</code>. Hanya jaringan putus yang masuk ke <code>catch</code>, jadi keduanya perlu ditangani.',
      contoh: 'const respon = await fetch("api/simpan", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ judul: "Halo" })\n});\nif (!respon.ok) {\n  // server menolak atau error\n}',
      petunjuk: ['Jadikan fungsi submit async. Kirim dengan fetch POST. Kalau !respon.ok atau masuk catch, tampilkan "Server sedang bermasalah" lalu berhenti tanpa menghapus draft.', 'form.addEventListener("submit", async function (event) {\n  event.preventDefault();\n  // ... validasi KTP dan hitung status seperti sebelumnya ...\n  const laporanBaru = { nama, kategori: "Umum", isi, tanggal: new Date().toISOString().slice(0, 10), status };\n  try {\n    const respon = await fetch("api/lapor", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(laporanBaru)\n    });\n    if (!respon.ok) throw new Error("Server " + respon.status);\n    semuaPengaduan.unshift(laporanBaru);\n    tampilkan();\n    localStorage.removeItem(KUNCI_DRAFT);\n    kolomLaporan.value = "";\n    pesanError.textContent = "";\n  } catch (error) {\n    pesanError.textContent = "Server sedang bermasalah. Laporanmu tersimpan sebagai draft.";\n  }\n});']
    },
    sukses: [
      '...Nak? Kamu masih di sana?',
      'Laporan ketujuh tadi dijawab server dengan error 500, persis seperti ujianmu, dan pesannya muncul rapi. Tapi staf saya bilang ada yang aneh.',
      'Di log server ada satu laporan yang tidak pernah kami kirim. Pengirimnya atas nama kamu, {nama}, tertanggal dua minggu lagi. Isinya cuma satu kalimat: "Warung Kopi Senja tutup. Tolong."',
      'Dana desanya tetap saya cairkan. Tapi hati-hati, Nak. Hujan malam ini aneh.'
    ]
  }
  ]
},
{
  /* Bab 8: the failed timeline. The client is the player, two weeks older. */
  id: 'gagal', tema: 'gagal', tanpaKos: true, warnaKembali: true,
  langit: [['#6B6B70', '#8E8E93'], ['#66666B', '#88888D'], ['#606066', '#838388'], ['#5B5B61', '#7E7E83'], ['#56565C', '#79797E'], ['#515157', '#747479'], ['#E9A97C', '#F3D1A0']],
  klien: {
    nama: '{nama} (Timeline B)', usaha: 'Warung Kopi Senja · Timeline B', huruf: '@', warna: '#9A9AA0', url: 'warungkopisenja.id/timeline-b',
    kirimTeks: 'Sudah kurapikan. Coba jalankan.',
    revisiBuka: 'Aku coba jalankan. Tapi ', revisiDaftar: 'masih ada yang belum beres:', revisiTutup: 'Nggak apa-apa. Kita sudah pernah lebih buruk dari ini.'
  },
  pengantar: 'Retakan di kaca jendela berdenyut pelan. Ada pesan masuk di ponselmu, dari nomor yang sangat kamu kenal: nomormu sendiri.',
  bisikan: 'Ponselmu bergetar. Pengirimnya... nomormu sendiri.',
  tanpaBayarTeks: 'Tidak ada bayaran dari timeline ini. Tapi satu warna kembali ke foto warung.',
  file: 'kasir-timeline-b.html',
  keahlian: 'Refactor Lv 1',
  unlock: ['Keahlian Refactor', 'Kacamata Anti-Spaghetti (mendeteksi baris kode kembar di konsol)'],
  hadiah: { id: 'kacamata', teks: 'Kamu (Timeline B) menitipkan Kacamata Anti-Spaghetti. Sekarang kacamata itu ada di meja, di depan laptop. Kalau kodemu punya banyak baris kembar, konsol akan memberi tahu.' },
  penutup: {
    judul: 'Timeline B, dirapikan',
    teks: 'Sepuluh rumus yang disalin kini jadi satu fungsi hitung, satu hitungItem, satu konstanta PAJAK, dan satu formatRupiah, lengkap dengan komentar untuk dirimu tiga bulan lagi. Kodenya lebih pendek dan bisa diubah di satu tempat. Foto warung di bingkai kembali berwarna.'
  },
  pembuka: 'Kamu menyentuh retakan di kaca. Dingin. Lalu semuanya jadi abu-abu. Studionya masih sama, tapi kalender di dinding dua minggu lebih maju, dan warna-warna hilang dari kamar.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Warung Kopi Senja (Timeline B)</title>
  <style>
    body {
      background-color: #E4E4E4;
      color: #333333;
      font-family: Georgia, serif;
      max-width: 640px;
      margin: 0 auto;
      padding: 20px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px dashed #AAAAAA;
    }
    .item span:first-child {
      flex: 1;
    }
    .item input {
      width: 56px;
    }
    #total {
      font-size: 22px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Warung Kopi Senja</h1>
  <p>Kasir darurat. Jangan diubah. Nanti rusak semua.</p>

${MENU_B.map(([n, h], i) => `  <div class="item"><span>${n}</span> <span class="harga">Rp${h.toLocaleString('id-ID')}</span> <input type="number" id="jml${i + 1}" value="0" min="0"> <button onclick="document.getElementById('total').innerText = 'Total: Rp' + (${h} * Number(document.getElementById('jml${i + 1}').value) * 1.1).toLocaleString('id-ID')">Hitung</button></div>`).join('\n')}

  <p id="total">Total: Rp0</p>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Satu fungsi hitung', bayar: 0,
    pesan: [
      'Hai. Iya, ini aku. Kamu. Versi yang dua minggu lebih tua dan jauh lebih capek.',
      'Di timeline-ku, Warung Kopi Senja tutup. Bukan karena sepi. Kasirnya error terus, dan setiap mau diperbaiki aku harus mengubah sepuluh tempat sekaligus. Akhirnya Bu Sari menyerah.',
      'Lihat kodenya. Sepuluh tombol, rumusnya disalin sepuluh kali. Tolong buat satu fungsi hitung(harga, jumlah) yang mengembalikan harga × jumlah plus pajak 10%, lalu semua tombol memakai fungsi itu. Kasirnya harus tetap jalan.'
    ],
    reqs: [
      { label: 'Ada fungsi hitung(harga, jumlah)', ask: 'fungsi hitung(harga, jumlah)-nya belum ada',
        test: (d, w) => !!T.fungsi(w, 'hitung') },
      { label: 'hitung(8000, 3) menghasilkan 26400', ask: 'hitung(8000, 3) hasilnya belum 26400', kecuali: 0,
        test: (d, w) => T.sama(T.panggil(w, 'hitung', 8000, 3), 26400) },
      { label: 'hitung(5000, 0) menghasilkan 0', ask: 'hitung(5000, 0) harusnya 0', kecuali: 0,
        test: (d, w) => T.panggil(w, 'hitung', 5000, 0) === 0 },
      { label: 'Rumus pajak (× 1.1) cuma ditulis sekali', ask: 'rumus × 1.1-nya masih tersebar di banyak tempat',
        test: (d, w, src) => T.hitungPola(T.tanpaGaya(src), /(?<![\d.])1\.1(?![\d])/g) === 1 },
      { label: 'Kesepuluh tombol Hitung masih benar', ask: 'ada tombol Hitung yang sekarang hasilnya salah',
        test: (d, w) => T.kasirBenar(d, w, 1.1) }
    ],
    catatan: {
      teks: 'Kode yang disalin berkali-kali itu seperti resep yang ditulis ulang di sepuluh kertas: kalau takarannya berubah, kamu harus ingat mengganti kesepuluhnya. Prinsip <b>DRY</b> (Don\'t Repeat Yourself) artinya tulis sekali di satu fungsi, lalu panggil di mana pun. Fungsi menerima <b>parameter</b> (bahan), lalu mengembalikan hasil dengan <code>return</code>. Mengubah bentuk kode tanpa mengubah hasilnya disebut <b>refactoring</b>.',
      contoh: 'function luasPersegi(sisi) {\n  return sisi * sisi;\n}\nluasPersegi(4); // 16',
      petunjuk: ['Tulis function hitung(harga, jumlah) { return harga * jumlah * 1.1; } di dalam <script>, lalu ganti rumus di setiap onclick dengan hitung(8000, Number(...)).', '<script>\n  function hitung(harga, jumlah) {\n    return harga * jumlah * 1.1;\n  }\n<\/script>\n\n<!-- contoh satu baris; ulangi untuk sembilan menu lainnya -->\n<button onclick="document.getElementById(\'total\').innerText = \'Total: Rp\' + hitung(8000, Number(document.getElementById(\'jml1\').value)).toLocaleString(\'id-ID\')">Hitung</button>']
    },
    sukses: ['...Kamu lihat itu? Foto warung di bingkai. Ada sedikit oranye di atapnya.', 'Aku nggak bisa bayar. Di sini uangku habis buat nutup utang. Tapi makasih. Serius.']
  },
  {
    judul: 'Satu fungsi untuk semua tombol', bayar: 0,
    pesan: [
      'Rumusnya sudah di satu tempat. Tapi setiap tombol masih membawa kalimat panjang: ambil input ini, ambil total itu.',
      'Buat fungsi hitungItem(tombol) yang bisa dipakai tombol mana pun. Simpan harganya di atribut data-harga di setiap baris .item, supaya fungsinya tinggal membaca dari situ.',
      'Isi onclick setiap tombol maksimal 40 karakter. Misalnya cukup hitungItem(this).'
    ],
    reqs: [
      { label: 'Setiap .item punya data-harga yang sesuai harganya', ask: 'ada baris .item yang belum punya data-harga, atau harganya beda',
        test: d => MENU_B.every(([n, h]) => { const r = T.barisMenu(d, n); return !!r && Number(r.dataset.harga) === h; }) },
      { label: 'Isi onclick setiap tombol paling panjang 40 karakter', ask: 'isi onclick di tombolnya masih panjang-panjang',
        test: d => { const b = T.all(d, '.item button'); return b.length >= 10 && b.every(x => (x.getAttribute('onclick') || '').length <= 40); } },
      { label: 'Kesepuluh tombol Hitung masih benar', ask: 'ada tombol Hitung yang hasilnya salah',
        test: (d, w) => T.kasirBenar(d, w, 1.1) },
      { label: 'Konsol bersih', ask: 'konsolnya merah waktu tombolnya kutekan',
        test: (d, w) => { T.kasirBenar(d, w, 1.1); return (w.__errs || []).length === 0; } }
    ],
    catatan: {
      teks: 'Di dalam <code>onclick</code>, kata <code>this</code> berarti elemen yang diklik. Dari tombol itu, <code>closest(".item")</code> naik ke baris pembungkusnya, lalu <code>querySelector("input")</code> mencari kolom jumlah di baris itu saja. Data seperti harga bisa disimpan di HTML dengan atribut <code>data-*</code>, lalu dibaca lewat <code>dataset</code>. Jadi satu fungsi bisa melayani sepuluh tombol.',
      contoh: '<div class="kartu" data-stok="12">\n  <button onclick="cekStok(this)">Cek</button>\n</div>\n\n<script>\n  function cekStok(tombol) {\n    const kartu = tombol.closest(".kartu");\n    console.log(kartu.dataset.stok); // "12"\n  }\n<\/script>',
      petunjuk: ['Tambahkan data-harga="8000" di <div class="item">, lalu setiap tombol cukup onclick="hitungItem(this)". Di dalam hitungItem, ambil barisnya, harganya, dan jumlahnya.', '<div class="item" data-harga="8000"><span>Kopi Tubruk</span> <span class="harga">Rp8.000</span> <input type="number" value="0" min="0"> <button onclick="hitungItem(this)">Hitung</button></div>\n\n<script>\n  function hitungItem(tombol) {\n    const baris = tombol.closest(".item");\n    const harga = Number(baris.dataset.harga);\n    const jumlah = Number(baris.querySelector("input").value);\n    document.getElementById("total").innerText = "Total: Rp" + hitung(harga, jumlah).toLocaleString("id-ID");\n  }\n<\/script>']
    },
    sukses: ['Tombolnya jadi pendek-pendek. Kodenya bisa dibaca tanpa harus menahan napas.', 'Pohon di depan warung di foto itu sekarang hijau lagi.']
  },
  {
    judul: 'Pajak naik', bayar: 0,
    pesan: [
      'Kabar dari timeline-ku: pajaknya naik jadi 11%. Dulu, di kode lama, aku harus mengganti sepuluh angka. Aku lupa satu. Kasirnya salah hitung seminggu, dan pelanggan protes.',
      'Buat konstanta di bagian atas skrip: const PAJAK = 0.11. Lalu pakai PAJAK di rumusnya. Jangan ada lagi angka pajak yang ditulis langsung.',
      'Angka yang ditulis langsung di tengah rumus itu namanya magic number. Kelihatannya sepele, sampai suatu hari harus diganti.'
    ],
    reqs: [
      { label: 'Ada konstanta PAJAK bernilai 0.11', ask: 'konstanta PAJAK = 0.11-nya belum ada',
        test: (d, w) => T.global(w, 'PAJAK') === 0.11 },
      { label: 'hitung(8000, 3) sekarang 26640', ask: 'hitung(8000, 3) belum 26640, pajaknya belum 11%',
        test: (d, w) => T.sama(T.panggil(w, 'hitung', 8000, 3), 26640) },
      { label: 'Angka pajak hanya ditulis sekali, di PAJAK', ask: 'masih ada angka pajak (1.1, 0.1, atau 0.11) yang ditulis langsung', kecuali: 0,
        test: (d, w, src) => T.hitungPola(T.tanpaGaya(src), /(?<![\w.])(?:1\.11|0\.11|1\.1|0\.1)(?![\d])/g) === 1 },
      { label: 'Kesepuluh tombol Hitung benar dengan pajak 11%', ask: 'ada tombol yang hitungannya belum pakai pajak 11%',
        test: (d, w) => T.kasirBenar(d, w, 1.11) }
    ],
    catatan: {
      teks: 'Angka yang ditulis langsung di tengah rumus disebut <b>magic number</b>. Orang lain, dan kamu sendiri tiga bulan lagi, tidak tahu artinya, dan angkanya susah dicari saat harus diganti. Beri nama dengan <code>const</code> di bagian atas skrip. Nama konstanta yang tidak pernah berubah biasanya ditulis dengan HURUF_BESAR.',
      contoh: 'const ONGKIR_PER_KM = 2500;\n\nfunction ongkir(km) {\n  return km * ONGKIR_PER_KM;\n}',
      petunjuk: ['Tulis const PAJAK = 0.11; di baris pertama skrip, lalu ubah rumusnya menjadi harga * jumlah * (1 + PAJAK).', 'const PAJAK = 0.11;\n\nfunction hitung(harga, jumlah) {\n  return harga * jumlah * (1 + PAJAK);\n}']
    },
    sukses: ['Satu baris diganti, sepuluh menu ikut benar. Andai aku tahu ini dua minggu lalu.', 'Papan nama di foto itu mulai kelihatan warnanya.']
  },
  {
    judul: 'Pisahkan hitung dan tampil', bayar: 0,
    pesan: [
      'Masalah berikutnya yang dulu bikin aku begadang: angka dan tampilan campur aduk dalam satu kalimat.',
      'Buat fungsi formatRupiah(angka) yang mengembalikan teks seperti "Rp26.640", dibulatkan tanpa koma. Fungsi hitung cukup menghitung, jangan menyentuh halaman sama sekali.',
      'Total yang tampil di halaman juga harus lewat formatRupiah, supaya formatnya selalu sama.'
    ],
    reqs: [
      { label: 'formatRupiah(26640) menghasilkan "Rp26.640"', ask: 'formatRupiah(26640) belum menghasilkan "Rp26.640"',
        test: (d, w) => String(T.panggil(w, 'formatRupiah', 26640)).replace(/\s/g, '') === 'Rp26.640' },
      { label: 'formatRupiah(1500000) menghasilkan "Rp1.500.000"', ask: 'formatRupiah(1500000) belum "Rp1.500.000"', kecuali: 0,
        test: (d, w) => String(T.panggil(w, 'formatRupiah', 1500000)).replace(/\s/g, '') === 'Rp1.500.000' },
      { label: 'Angka pecahan dibulatkan: formatRupiah(1234.5) → "Rp1.235"', ask: 'angka pecahannya belum dibulatkan', kecuali: 0,
        test: (d, w) => String(T.panggil(w, 'formatRupiah', 1234.5)).replace(/\s/g, '') === 'Rp1.235' },
      { label: 'Fungsi hitung tidak menyentuh document', ask: 'fungsi hitung masih ikut mengubah halaman',
        test: (d, w) => { const f = T.fungsi(w, 'hitung'); return !!f && !String(f).includes('document'); } },
      { label: 'Total tampil lewat formatRupiah, dan semua tombol benar', ask: 'totalnya belum ditampilkan lewat formatRupiah',
        test: (d, w, src) => { const s = T.tanpaGaya(src); return T.hitungPola(s, /formatRupiah\s*\(/g) >= 2 && T.hitungPola(s, /toLocaleString/g) <= 1 && T.kasirBenar(d, w, 1.11) && !T.text(d.getElementById('total')).includes(','); } }
    ],
    catatan: {
      teks: 'Fungsi yang baik mengerjakan satu hal. <code>hitung</code> cukup menghitung angka, <code>formatRupiah</code> cukup mengubah angka menjadi teks, dan <code>hitungItem</code> yang menaruh hasilnya di halaman. Kalau dipisah begini, masing-masing bisa diuji sendiri dan dipakai ulang. <code>Math.round()</code> membulatkan ke bilangan bulat terdekat.',
      contoh: 'function formatSuhu(angka) {\n  return Math.round(angka) + "°C";\n}\nformatSuhu(27.6); // "28°C"',
      petunjuk: ['formatRupiah mengembalikan "Rp" + Math.round(angka).toLocaleString("id-ID"). Lalu di hitungItem, tulis totalnya lewat formatRupiah(hitung(harga, jumlah)).', 'function formatRupiah(angka) {\n  return "Rp" + Math.round(angka).toLocaleString("id-ID");\n}\n\nfunction hitungItem(tombol) {\n  const baris = tombol.closest(".item");\n  const harga = Number(baris.dataset.harga);\n  const jumlah = Number(baris.querySelector("input").value);\n  document.getElementById("total").innerText = "Total: " + formatRupiah(hitung(harga, jumlah));\n}']
    },
    sukses: ['Sekarang kalau suatu hari Bu Sari minta format "Rp 26.640,-", cukup ganti satu fungsi.', 'Langit di foto itu mulai jingga. Kayak sore waktu kita pertama kali bikin papan namanya.']
  },
  {
    judul: 'Komentar untuk diri sendiri', bayar: 0,
    pesan: [
      'Tiga bulan lalu aku membuka kodeku sendiri dan nggak ngerti apa-apa. Rasanya kayak baca surat dari orang asing.',
      'Tulis komentar JSDoc di atas fungsi hitung: /** ... */ berisi @param untuk harga dan jumlah, dan @returns untuk hasilnya.',
      'Satu lagi: tinggalkan satu komentar // TODO: untuk hal yang belum sempat dikerjakan. Jujur saja. TODO itu bukan aib, itu janji kecil ke dirimu sendiri.'
    ],
    reqs: [
      { label: 'Ada komentar /** */ tepat di atas fungsi hitung', ask: 'komentar /** */ di atas fungsi hitung belum ada',
        test: (d, w, src) => /\/\*\*[\s\S]*?\*\/\s*(?:function\s+hitung\b|(?:const|let|var)\s+hitung\b)/.test(src) },
      { label: 'Komentarnya berisi @param harga, @param jumlah, dan @returns', ask: 'komentarnya belum menjelaskan @param harga, @param jumlah, dan @returns', kecuali: 0,
        test: (d, w, src) => { const m = src.match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?:function\s+hitung\b|(?:const|let|var)\s+hitung\b)/); return !!m && /@param\s+(\{[^}]*\}\s*)?harga\b/.test(m[1]) && /@param\s+(\{[^}]*\}\s*)?jumlah\b/.test(m[1]) && /@returns?\b/.test(m[1]); } },
      { label: 'Ada komentar // TODO: yang ada isinya', ask: 'komentar // TODO:-nya belum ada, atau masih kosong',
        test: (d, w, src) => /\/\/\s*TODO:[ \t]*\S.{2,}/.test(src) },
      { label: 'Semua tombol masih benar dan konsol bersih', ask: 'setelah diberi komentar, ada tombol yang rusak atau konsolnya merah',
        test: (d, w) => T.kasirBenar(d, w, 1.11) && (w.__errs || []).length === 0 }
    ],
    catatan: {
      teks: 'Komentar <b>JSDoc</b> ditulis dengan <code>/** ... */</code> tepat di atas fungsi. <code>@param</code> menjelaskan setiap parameter, dan <code>@returns</code> menjelaskan hasilnya. Banyak editor membaca komentar ini dan menampilkannya saat kamu memanggil fungsinya. Komentar <code>// TODO:</code> menandai pekerjaan yang belum selesai, dan editor bisa mengumpulkan semuanya dalam satu daftar. Komentar yang baik menjelaskan <i>kenapa</i>, karena <i>apa</i>-nya sudah terbaca dari kode.',
      contoh: '/**\n * Menghitung luas persegi panjang.\n * @param {number} panjang Panjang dalam meter\n * @param {number} lebar Lebar dalam meter\n * @returns {number} Luas dalam meter persegi\n */\nfunction luas(panjang, lebar) {\n  return panjang * lebar;\n}',
      petunjuk: ['Tulis blok /** */ tepat di atas function hitung, berisi @param {number} harga, @param {number} jumlah, dan @returns. Lalu tambahkan satu baris // TODO: di mana saja di skrip.', '/**\n * Menghitung harga pesanan termasuk pajak.\n * @param {number} harga Harga satu porsi, dalam rupiah\n * @param {number} jumlah Banyaknya porsi\n * @returns {number} Total harga termasuk pajak\n */\nfunction hitung(harga, jumlah) {\n  return harga * jumlah * (1 + PAJAK);\n}\n\n// TODO: simpan riwayat pesanan harian untuk Bu Sari']
    },
    sukses: ['Aku baca TODO-mu tadi. Lucu. Aku juga pernah mau bikin itu.', 'Fotonya hampir penuh warna. Tinggal satu lagi.']
  },
  {
    judul: 'Hitung semua', bayar: 0,
    pesan: [
      'Terakhir. Yang ini dulu nggak pernah sempat kubuat.',
      'Tambahkan tombol "Hitung semua" yang menjumlahkan semua pesanan, lengkap dengan pajak, lalu menampilkannya di #total. Pakai fungsi yang sudah ada. Jangan salin rumusnya lagi.',
      'Tombol per menu tetap jalan seperti biasa. Staf di timeline-ku akan mencoba: Kopi Tubruk 2, Pisang Goreng 1, Wedang Jahe 3.'
    ],
    reqs: [
      { label: 'Ada tombol "Hitung semua"', ask: 'tombol "Hitung semua"-nya belum ada',
        test: d => { const b = T.tombol(d, 'hitung semua', 'calculate all'); return !!b && !b.closest('.item'); } },
      { label: 'Kopi Tubruk 2, Pisang Goreng 1, Wedang Jahe 3 → Rp61.050', ask: 'untuk Kopi Tubruk 2, Pisang Goreng 1, dan Wedang Jahe 3, totalnya belum Rp61.050', kecuali: 0,
        test: (d, w) => { T.isiJumlah(d, w, { 'Kopi Tubruk': 2, 'Pisang Goreng': 1, 'Wedang Jahe': 3 }); T.tombol(d, 'hitung semua', 'calculate all').click(); return T.sama(T.nilaiRupiah(d.getElementById('total')), 61050); } },
      { label: 'Semua jumlah 0 → Rp0', ask: 'kalau semua jumlahnya 0, totalnya belum Rp0', kecuali: 0,
        test: (d, w) => { T.isiJumlah(d, w, {}); T.tombol(d, 'hitung semua', 'calculate all').click(); return T.nilaiRupiah(d.getElementById('total')) === 0; } },
      { label: 'Tombol per menu masih benar', ask: 'tombol Hitung per menu jadi salah',
        test: (d, w) => T.kasirBenar(d, w, 1.11) },
      { label: 'Konsol bersih', ask: 'konsolnya merah waktu dicoba',
        test: (d, w) => { const b = T.tombol(d, 'hitung semua', 'calculate all'); if (b) b.click(); T.kasirBenar(d, w, 1.11); return (w.__errs || []).length === 0; } }
    ],
    catatan: {
      teks: 'Untuk menjumlahkan semua baris, ambil semuanya dengan <code>querySelectorAll(".item")</code>, lalu jalankan <code>forEach</code> atau <code>reduce</code>. <code>reduce</code> membawa satu nilai, misalnya total sementara, dari satu item ke item berikutnya. Karena <code>hitung</code> dan <code>formatRupiah</code> sudah ada, tombol baru ini tinggal memakainya.',
      contoh: 'const angka = [3, 5, 2];\nconst total = angka.reduce((jumlah, n) => jumlah + n, 0);\n// total = 10',
      petunjuk: ['Buat <button onclick="hitungSemua()">Hitung semua</button> di luar .item. Di hitungSemua, ubah NodeList menjadi array dengan Array.from, lalu jalankan reduce.', '<button onclick="hitungSemua()">Hitung semua</button>\n\n<script>\n  function hitungSemua() {\n    const semua = Array.from(document.querySelectorAll(".item"));\n    const total = semua.reduce(function (jumlah, baris) {\n      const harga = Number(baris.dataset.harga);\n      const porsi = Number(baris.querySelector("input").value);\n      return jumlah + hitung(harga, porsi);\n    }, 0);\n    document.getElementById("total").innerText = "Total: " + formatRupiah(total);\n  }\n<\/script>']
    },
    sukses: [
      'Semua warnanya kembali.',
      'Aku baru sadar sesuatu. Warung ini tutup bukan karena Bu Sari malas, atau karena pelanggannya pergi. Warung ini tutup karena kodenya dibiarkan kusut sampai nggak ada yang berani menyentuhnya. Termasuk aku.',
      'Kamu belum sampai di titik itu. Jangan sampai, ya.',
      'Ini, bawa kacamataku. Katanya sih Kacamata Anti-Spaghetti. Aku beli waktu masih optimis 😅',
      '...Eh. Retakannya bergeser. Kayaknya ada timeline lain yang memanggilmu.'
    ]
  }
  ]
},
{
  /* Bab 9: the successful timeline. Web performance. */
  id: 'sukses', tema: 'sukses', tanpaKos: true, tanpaPengali: true,
  langit: [['#1B1F3F', '#4A3D6E'], ['#1D2042', '#553F70'], ['#202244', '#5F4272'], ['#232447', '#6A4574'], ['#26264A', '#744877'], ['#29284C', '#7E4B79'], ['#2E2A50', '#B0647E']],
  klien: {
    nama: '{nama} (Timeline Sukses)', usaha: 'Warung Kopi Senja · 3 Cabang', huruf: '@', warna: '#E9C46A', url: 'warungkopisenja.id',
    kirimTeks: 'Sudah kuoptimasi. Cek skornya.',
    revisiBuka: 'Aku cek pakai HP kentang. Tapi ', revisiDaftar: 'masih ada yang bikin lemot:', revisiTutup: 'Santai. Aku juga dulu gitu kok, sebelum sukses 😎'
  },
  pengantar: 'Retakan di kaca bergeser dan berkilau keemasan. Ponselmu berbunyi lagi: nomormu sendiri, tapi foto profilnya pakai kacamata hitam.',
  bisikan: 'Ponselmu bergetar. Nomormu sendiri lagi, kali ini pakai emoji 😎.',
  file: 'warung-kopi-senja-franchise.html',
  reputasi: { plus: 5 },
  keahlian: 'Performa Lv 1',
  unlock: ['Keahlian Performa Web', 'Flashdisk berisi blueprint studio'],
  hadiah: { id: 'flashdisk', teks: 'Kamu (Timeline Sukses) menitipkan sebuah flashdisk emas. Isinya satu file: blueprint-studio.txt.' },
  asetAwal: GAMBAR_B9.map(k => k + '-hd.jpg'),
  laporan: (d, w, src) => {
    const s = T.skorPerforma(d, src);
    const kb = s.kb >= 1000 ? (s.kb / 1000).toLocaleString(L('id-ID', 'en-US'), { maximumFractionDigits: 1 }) + ' MB' : s.kb + ' KB';
    return [L(`⚡ Skor performa (simulasi Lighthouse): ${s.skor}/100 · gambar ${kb} · tanpa lazy ${s.tanpaLazy} · tanpa ukuran ${s.tanpaUkuran} · CSS tak terpakai ${s.css} · skrip pemblokir ${s.pemblokir ? 'ada' : 'tidak ada'} · tanpa alt ${s.tanpaAlt} · meta description ${s.deskripsi ? 'ada' : 'belum'}`,
      `⚡ Performance score (simulated Lighthouse): ${s.skor}/100 · images ${kb} · not lazy ${s.tanpaLazy} · no size ${s.tanpaUkuran} · unused CSS ${s.css} · blocking script ${s.pemblokir ? 'yes' : 'no'} · no alt ${s.tanpaAlt} · meta description ${s.deskripsi ? 'yes' : 'missing'}`)];
  },
  penutup: {
    judul: 'Timeline Sukses, makin kencang',
    teks: 'Website franchise Warung Kopi Senja turun dari 20 MB menjadi sekitar 1 MB: gambar WebP, galeri lazy, ukuran gambar yang jelas, CSS yang bersih, skrip yang tidak lagi menahan halaman, dan skor performa di atas 85. Calon mitra dari Balikpapan jadi datang.'
  },
  pembuka: 'Kamu melangkah lewat retakan. Studionya sama, tapi lampu kota lebih terang, dan dari jendela terlihat papan iklan: WARUNG KOPI SENJA · 3 CABANG.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Warung Kopi Senja · 3 Cabang</title>
  <script>
    // skrip analitik lama: menunggu 300 milidetik sebelum halaman boleh tampil
    const mulai = Date.now();
    while (Date.now() - mulai < 300) {}
    console.log("analitik siap");
  <\/script>
  <style>
    body {
      background-color: #1C1B29;
      color: #F4EBD0;
      font-family: system-ui, sans-serif;
      max-width: 960px;
      margin: 0 auto;
      padding: 16px;
    }
    .hero img {
      width: 100%;
      height: auto;
      border-radius: 10px;
    }
    .hero h1 {
      color: #E9C46A;
    }
    .galeri {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .galeri img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
    .banner-ramadan-2024 {
      background: #1F6F5C;
      padding: 20px;
    }
    .promo-lama {
      color: #E57373;
      font-weight: bold;
    }
    #popup-diskon {
      position: fixed;
      inset: 30%;
      background: #FFFFFF;
    }
    .slider-lama {
      overflow: hidden;
      white-space: nowrap;
    }
    .slider-lama img {
      display: inline-block;
      width: 100%;
    }
    .testimoni-2023 {
      font-style: italic;
    }
    .kolom-iklan {
      float: right;
      width: 300px;
    }
  </style>
</head>
<body>
  <section class="hero">
    <img src="hero-hd.jpg" alt="Warung Kopi Senja di sore hari">
    <h1>Warung Kopi Senja</h1>
    <p>Dari satu warung kecil di Sengata, sekarang tiga cabang. Buka peluang kemitraan.</p>
  </section>

  <h2>Galeri</h2>
  <div class="galeri">
    <img src="cabang-sengata-hd.jpg" alt="Cabang Sengata">
    <img src="cabang-bontang-hd.jpg">
    <img src="cabang-samarinda-hd.jpg" alt="Cabang Samarinda">
    <img src="gorengan-hd.jpg" alt="Gorengan hangat">
    <img src="es-teh-jumbo-hd.jpg">
    <img src="suasana-malam-hd.jpg">
  </div>

  <footer>
    <p>Kemitraan: kemitraan@warungkopisenja.id</p>
  </footer>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Kompres gambar', bayar: 160000, aset: GAMBAR_B9.map(k => k + '.webp'),
    pesan: [
      'Yo! Aku kamu, versi yang berhasil. Tiga cabang, dua karyawan, satu mobil boks. Nggak usah kaget gitu.',
      'Tapi ada satu hal memalukan: website franchise-ku lemot banget. Dibuka di HP kentang butuh dua belas detik. Calon mitra pada kabur sebelum halamannya muncul.',
      'Mulai dari gambar. Semuanya file -hd.jpg, ada yang 4 MB. Aku sudah kirim versi .webp yang ukurannya di bawah 200 KB. Ganti semua gambar dengan versi .webp itu, dan pastikan semuanya tetap tampil.'
    ],
    reqs: [
      { label: 'Tidak ada lagi gambar -hd.jpg', ask: 'masih ada gambar -hd.jpg yang dipakai',
        test: (d, w, src) => Array.from(T.dok(src).querySelectorAll('img')).every(i => !/-hd\.jpg$/i.test(T.namaGambar(i))) },
      { label: 'Setiap gambar di bawah 200 KB', ask: 'masih ada gambar yang lebih dari 200 KB', kecuali: 0,
        test: (d, w, src) => { const g = Array.from(T.dok(src).querySelectorAll('img')); return g.length > 0 && g.every(i => (ASET_UKURAN[T.namaGambar(i)] || 9999) <= 200); } },
      { label: 'Ketujuh gambar tampil', ask: 'ada gambar yang tidak muncul, mungkin nama filenya salah ketik',
        test: d => T.semuaGambarAda(d) }
    ],
    catatan: {
      teks: 'Gambar biasanya bagian terberat dari sebuah halaman. Foto <code>-hd.jpg</code> dari kamera bisa berukuran beberapa MB, padahal di layar HP hanya tampil selebar 400 piksel. Format <b>WebP</b> menyimpan gambar yang sama jauh lebih kecil. Patokan yang sering dipakai: satu gambar di bawah 200 KB, dan total satu halaman di bawah 1 MB. Buka file dari klien untuk melihat ukurannya.',
      contoh: '<!-- 3,1 MB -->\n<img src="pantai-hd.jpg" alt="Pantai">\n\n<!-- 150 KB, gambar yang sama -->\n<img src="pantai.webp" alt="Pantai">',
      petunjuk: ['Ganti setiap nama file: hero-hd.jpg menjadi hero.webp, cabang-sengata-hd.jpg menjadi cabang-sengata.webp, dan seterusnya.', '<img src="hero.webp" alt="Warung Kopi Senja di sore hari">\n\n<img src="cabang-sengata.webp" alt="Cabang Sengata">\n<img src="cabang-bontang.webp">\n<img src="cabang-samarinda.webp" alt="Cabang Samarinda">\n<img src="gorengan.webp" alt="Gorengan hangat">\n<img src="es-teh-jumbo.webp">\n<img src="suasana-malam.webp">']
    },
    sukses: ['Dari 20 MB jadi 1 MB. Halamannya langsung terasa enteng. Mantap, versi masa laluku 😎', 'Transfer masuk. Anggap uang saku lintas timeline.']
  },
  {
    judul: 'Lazy loading', bayar: 160000,
    pesan: [
      'Sekarang: jangan muat semua gambar sekaligus. Pengunjung belum tentu scroll sampai galeri.',
      'Gambar di galeri pakai loading="lazy", supaya baru dimuat saat hampir terlihat.',
      'Tapi gambar hero di paling atas jangan lazy. Itu yang pertama dilihat orang. Malah kasih fetchpriority="high", supaya diutamakan.'
    ],
    reqs: [
      { label: 'Keenam gambar galeri memakai loading="lazy"', ask: 'gambar-gambar di galeri belum pakai loading="lazy"',
        test: (d, w, src) => { const g = Array.from(T.dok(src).querySelectorAll('.galeri img')); return g.length >= 6 && g.every(i => i.getAttribute('loading') === 'lazy'); } },
      { label: 'Gambar hero tidak lazy', ask: 'gambar hero-nya malah ikut lazy, jadi telat muncul',
        test: (d, w, src) => { const h = T.dok(src).querySelector('.hero img'); return !!h && h.getAttribute('loading') !== 'lazy'; } },
      { label: 'Gambar hero memakai fetchpriority="high"', ask: 'gambar hero belum pakai fetchpriority="high"',
        test: (d, w, src) => { const h = T.dok(src).querySelector('.hero img'); return !!h && h.getAttribute('fetchpriority') === 'high'; } },
      { label: 'Semua gambar masih tampil', ask: 'ada gambar yang jadi tidak muncul',
        test: d => T.semuaGambarAda(d) }
    ],
    catatan: {
      teks: 'Atribut <code>loading="lazy"</code> membuat browser menunda memuat gambar sampai gambar itu hampir masuk layar. Cocok untuk galeri di bawah. Tapi gambar pertama yang terlihat, biasanya hero, justru harus secepatnya: jangan diberi lazy, dan beri <code>fetchpriority="high"</code> supaya browser mendahulukannya. Waktu sampai gambar terbesar di layar muncul disebut <b>LCP</b> (Largest Contentful Paint).',
      contoh: '<img src="banner.webp" alt="Promo" fetchpriority="high">\n<img src="foto-1.webp" alt="Menu" loading="lazy">',
      petunjuk: ['Tambahkan loading="lazy" di keenam gambar .galeri, dan fetchpriority="high" di gambar .hero.', '<img src="hero.webp" alt="Warung Kopi Senja di sore hari" fetchpriority="high">\n\n<div class="galeri">\n  <img src="cabang-sengata.webp" alt="Cabang Sengata" loading="lazy">\n  <!-- ...dan lima gambar lainnya, masing-masing dengan loading="lazy" -->\n</div>']
    },
    sukses: ['Gambar galeri sekarang nunggu giliran. Hero langsung nongol. Ini yang namanya prioritas, bro.', 'Transfer kedua.']
  },
  {
    judul: 'Ukuran gambar', bayar: 160000,
    pesan: [
      'Kamu sadar nggak, waktu halaman lagi dimuat, tulisannya loncat-loncat ke bawah? Itu karena browser belum tahu ukuran gambarnya.',
      'Kasih atribut width dan height di setiap gambar, sesuai ukuran aslinya: hero 1200×600, galeri 600×400. CSS height: auto tetap dipakai, supaya gambarnya tetap responsif.',
      'Namanya layout shift. Calon mitra nggak suka tombol yang kabur waktu mau diklik 😅'
    ],
    reqs: [
      { label: 'Setiap gambar punya atribut width dan height', ask: 'ada gambar yang belum punya width dan height',
        test: (d, w, src) => { const g = Array.from(T.dok(src).querySelectorAll('img')); return g.length >= 7 && g.every(i => i.getAttribute('width') && i.getAttribute('height')); } },
      { label: 'Ukurannya sesuai: hero 1200×600, galeri 600×400', ask: 'angka width dan height-nya belum sesuai ukuran asli gambarnya', kecuali: 0,
        test: (d, w, src) => { const p = T.dok(src), h = p.querySelector('.hero img'); return !!h && +h.getAttribute('width') === 1200 && +h.getAttribute('height') === 600 && Array.from(p.querySelectorAll('.galeri img')).every(i => +i.getAttribute('width') === 600 && +i.getAttribute('height') === 400); } },
      { label: 'Gambar tetap responsif, tidak lebih lebar dari halaman', ask: 'gambarnya sekarang meluber keluar layar, atau bentuknya jadi gepeng',
        test: d => {
          const lebar = d.documentElement.clientWidth + 1, img = T.all(d, 'img'), kotak = img.map(i => i.getBoundingClientRect());
          const tumpang = kotak.some((r, i) => kotak.some((q, j) => j > i && r.left < q.right - 1 && q.left < r.right - 1 && r.top < q.bottom - 1 && q.top < r.bottom - 1));
          return !tumpang && img.every((i, k) => { const r = kotak[k], a = +i.getAttribute('width'), b = +i.getAttribute('height'); return r.width <= lebar && (!a || !b || Math.abs(r.height / r.width - b / a) < 0.05); });
        } },
      { label: 'Semua gambar masih tampil', ask: 'ada gambar yang jadi tidak muncul',
        test: d => T.semuaGambarAda(d) }
    ],
    catatan: {
      teks: 'Kalau <code>&lt;img&gt;</code> tidak punya <code>width</code> dan <code>height</code>, browser menyiapkan ruang nol piksel, lalu mendorong isi halaman ke bawah begitu gambarnya selesai dimuat. Pergeseran ini disebut <b>CLS</b> (Cumulative Layout Shift). Dengan kedua atribut itu, browser tahu perbandingan sisinya sejak awal. CSS <code>width: 100%; height: auto;</code> tetap membuat gambarnya menyesuaikan layar.',
      contoh: '<img src="foto.webp" alt="Foto" width="800" height="600">\n\n<style>\n  img { width: 100%; height: auto; }\n</style>',
      petunjuk: ['Tambahkan width="1200" height="600" di gambar hero, dan width="600" height="400" di setiap gambar galeri. CSS-nya tidak perlu diubah.', '<img src="hero.webp" alt="Warung Kopi Senja di sore hari" width="1200" height="600" fetchpriority="high">\n<img src="cabang-sengata.webp" alt="Cabang Sengata" width="600" height="400" loading="lazy">']
    },
    sukses: ['Nggak ada yang loncat lagi. Rapi kayak etalase cabang Samarinda.', 'Transfer ketiga.']
  },
  {
    judul: 'CSS yang tidak terpakai', bayar: 160000,
    pesan: [
      'CSS-nya juga penuh sisa promo lama. Banner Ramadan 2024, popup diskon, slider yang sudah lama dibuang... semuanya masih ikut dimuat setiap kali.',
      'Hapus semua aturan CSS yang tidak dipakai elemen mana pun di halaman. Tapi hati-hati, tampilan hero dan galerinya jangan sampai ikut rusak.'
    ],
    reqs: [
      { label: 'Tidak ada aturan CSS yang tidak terpakai', ask: 'masih ada aturan CSS sisa promo lama yang tidak dipakai',
        test: d => T.tidakTerpakai(d).length === 0 },
      { label: 'Gaya .hero dan .galeri masih ada', ask: 'gaya hero atau galerinya ikut terhapus',
        test: (d, w) => T.adaRule(d, s => /\.hero\b/.test(s)) && T.adaRule(d, s => /\.galeri\b/.test(s)) && !!d.querySelector('.galeri') && w.getComputedStyle(d.querySelector('.galeri')).display === 'grid' },
      { label: 'Semua gambar masih tampil', ask: 'ada gambar yang jadi tidak muncul',
        test: d => T.semuaGambarAda(d) }
    ],
    catatan: {
      teks: 'Setiap aturan CSS tetap diunduh dan dibaca browser, walaupun tidak ada elemen yang cocok dengan selektornya. Cara mengeceknya: cari class atau id di selektor itu di HTML. Kalau tidak ada elemen yang memakainya, aturan itu aman dihapus. Di Chrome, panel <b>Coverage</b> di DevTools menandai CSS yang tidak terpakai dengan warna merah.',
      contoh: '/* dipakai: ada <div class="menu"> */\n.menu { display: flex; }\n\n/* tidak dipakai: tidak ada class="promo-2022" di HTML */\n.promo-2022 { color: red; }',
      petunjuk: ['Cari satu per satu: .banner-ramadan-2024, .promo-lama, #popup-diskon, .slider-lama, .slider-lama img, .testimoni-2023, dan .kolom-iklan tidak dipakai di HTML. Hapus ketujuhnya.', '<style>\n  body { /* ...tetap... */ }\n  .hero img { width: 100%; height: auto; border-radius: 10px; }\n  .hero h1 { color: #E9C46A; }\n  .galeri { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }\n  .galeri img { width: 100%; height: auto; border-radius: 8px; }\n</style>']
    },
    sukses: ['Tujuh aturan hilang, tampilannya tetap sama. Kayak bersihin gudang, ternyata isinya kardus kosong semua.', 'Transfer keempat.']
  },
  {
    judul: 'Skrip yang menahan halaman', bayar: 160000,
    pesan: [
      'Tinggal satu biang lemot: skrip analitik di <head>. Skrip itu bikin halaman menunggu 300 milidetik sebelum boleh tampil. Setiap kali dibuka.',
      'Hapus loop while yang cuma menunggu itu, lalu pindahkan skripnya ke akhir <body>, tepat sebelum </body>.',
      'Tapi log "analitik siap" di konsol harus tetap ada. Tim marketing-ku mengeceknya.'
    ],
    reqs: [
      { label: 'Tidak ada <script> di dalam <head>', ask: 'skripnya masih ada di <head>',
        test: (d, w, src) => { const p = T.dok(src); return !!p.head && p.head.querySelectorAll('script:not([type="module"])').length === 0; } },
      { label: 'Loop while yang menunggu sudah dihapus', ask: 'loop while yang cuma menunggu itu masih ada',
        test: d => !/while\s*\(/.test(T.skrip(d)) },
      { label: 'Konsol masih menulis "analitik siap"', ask: 'log "analitik siap" di konsol hilang',
        test: (d, w) => (w.__logs || []).some(l => /analitik siap/i.test(l.teks)) },
      { label: 'Konsol bersih', ask: 'konsolnya merah',
        test: (d, w) => (w.__errs || []).length === 0 }
    ],
    catatan: {
      teks: 'Browser membaca HTML dari atas ke bawah. Begitu bertemu <code>&lt;script&gt;</code> di <code>&lt;head&gt;</code>, browser berhenti dan menjalankannya dulu sebelum menggambar apa pun. Skrip seperti ini disebut <b>render-blocking</b>. Skrip yang tidak dibutuhkan untuk tampilan pertama sebaiknya diletakkan di akhir <code>&lt;body&gt;</code>, atau diberi <code>defer</code> kalau berupa file terpisah. Loop <code>while</code> yang hanya menunggu waktu membuat browser benar-benar diam.',
      contoh: '<body>\n  <h1>Halo</h1>\n  <!-- isi halaman ... -->\n\n  <script>\n    console.log("skrip jalan setelah isi halaman dibaca");\n  <\/script>\n</body>',
      petunjuk: ['Potong seluruh blok <script> dari <head>, tempel sebelum </body>, lalu hapus dua baris: const mulai = ... dan while (...) {}.', '  <footer>\n    <p>Kemitraan: kemitraan@warungkopisenja.id</p>\n  </footer>\n\n  <script>\n    console.log("analitik siap");\n  <\/script>\n</body>']
    },
    sukses: ['Halamannya langsung muncul. Nggak pakai nunggu. Kayak pesan kopi di cabang yang ada mesin espresonya.', 'Transfer kelima.']
  },
  {
    judul: 'Lolos audit', bayar: 200000, setelah: 'flashdisk',
    pesan: [
      'Terakhir. Besok ada calon mitra dari Balikpapan yang mau lihat website-nya. Dia pasti mengeceknya pakai Lighthouse.',
      'Tambahkan <meta name="description"> yang menjelaskan warungnya, dan pastikan setiap gambar punya alt yang jelas. Pembaca layar juga pengunjung.',
      'Target: skor performa di konsol minimal 85. Dulu aku cuma dapat 41, dan mitranya nggak jadi 😬'
    ],
    reqs: [
      { label: 'Ada meta description yang jelas (minimal 30 karakter)', ask: 'meta description-nya belum ada, atau terlalu pendek',
        test: d => { const m = d.querySelector('meta[name="description"]'); return !!m && (m.getAttribute('content') || '').trim().length >= 30; } },
      { label: 'Setiap gambar punya alt yang jelas', ask: 'masih ada gambar yang belum punya alt, atau alt-nya terlalu pendek',
        test: d => { const g = T.all(d, 'img'); return g.length >= 7 && g.every(i => (i.getAttribute('alt') || '').trim().length >= 5); } },
      { label: 'Skor performa minimal 85', ask: 'skor performanya di konsol masih di bawah 85',
        test: (d, w, src) => T.skorPerforma(d, src).skor >= 85 }
    ],
    catatan: {
      teks: '<code>&lt;meta name="description"&gt;</code> adalah ringkasan halaman yang muncul di hasil pencarian Google. Tulis satu atau dua kalimat yang jujur. Atribut <code>alt</code> dibacakan oleh pembaca layar untuk orang yang tidak bisa melihat gambarnya, dan tampil kalau gambarnya gagal dimuat. Tulis apa yang ada di gambar, bukan "gambar1". Skor di konsol meniru cara Lighthouse menilai: ukuran gambar, lazy loading, ukuran yang jelas, CSS dan skrip, serta aksesibilitas dasar.',
      contoh: '<meta name="description" content="Toko roti rumahan di Bontang. Roti sobek, bolu pandan, dan pesanan untuk acara.">\n\n<img src="bolu.webp" alt="Bolu pandan hijau diiris di atas piring putih">',
      petunjuk: ['Tambahkan meta description di <head>, lalu isi alt di cabang-bontang, es-teh-jumbo, dan suasana-malam. Lihat skornya di konsol.', '<meta name="description" content="Warung Kopi Senja, dari Sengata sekarang tiga cabang. Kopi tubruk, gorengan hangat, dan peluang kemitraan.">\n\n<img src="cabang-bontang.webp" alt="Cabang Bontang dengan atap biru" width="600" height="400" loading="lazy">\n<img src="es-teh-jumbo.webp" alt="Segelas es teh jumbo dengan sedotan merah" width="600" height="400" loading="lazy">\n<img src="suasana-malam.webp" alt="Warung di malam hari dengan lampu-lampu kuning" width="600" height="400" loading="lazy">']
    },
    sukses: [
      'Skornya lewat 85! Mitra Balikpapan pasti... tunggu. Aku mau jujur dulu.',
      'Semua ini, tiga cabang, mobil boks, dimulai dari satu keputusan: aku berhenti menerima semua proyek. Aku bikin studio sendiri. Portofolio sendiri. Baru klien yang datang.',
      'Aku titip flashdisk ini. Isinya blueprint studio. Buka nanti, waktu kamu sudah pulang ke timeline-mu sendiri.',
      'Oh, dan sisa bayarannya kutransfer. Anggap investasi ke diri sendiri 😎'
    ]
  }
  ]
},
{
  /* Bab 10: the origin. The client is the player, in the present. A free-form portfolio. */
  id: 'origin', tema: 'origin', akhir: true,
  langit: [['#1E2A4A', '#3B4A74'], ['#26305A', '#4F4F80'], ['#30356A', '#6A5A8C'], ['#3C3A72', '#86628F'], ['#4A4078', '#A66C8E'], ['#5A467C', '#C57A88'], ['#F6B98A', '#FBE3B8']],
  klien: {
    nama: '{nama}', usaha: 'Studio {nama}', huruf: '@', warna: '#F4C979', url: '{slug}.studio',
    kirimTeks: 'Oke, kucoba lihat lagi dengan mata klien.',
    revisiBuka: 'Kubaca lagi pelan-pelan. Ternyata ', revisiDaftar: 'masih ada yang kurang:', revisiTutup: 'Nggak apa-apa. Klien paling rewel memang diri sendiri 😌'
  },
  pengantar: 'Retakan menutup di belakangmu. Kamu pulang ke timeline-mu sendiri, membawa kacamata, flashdisk, dan satu ide. Klien berikutnya: dirimu sendiri.',
  bisikan: 'Flashdisk di meja berkedip pelan. Ada satu file di dalamnya.',
  tanpaBayarTeks: 'Belum ada bayaran. Proyek ini investasi.',
  file: 'studio-saya.html',
  keahlian: 'Studio Sendiri',
  hadiah: { id: 'papanNama', teks: 'Papan nama studiomu dipasang di dinding.' },
  penutup: { judul: 'Studio kecil berdiri', teks: 'Warung tetap buka.' },
  pembuka: 'Kamu kembali ke studiomu. Retakan di kaca sudah tertutup, tinggal bekas tipis. Di meja ada kacamata, flashdisk, dan secangkir teh yang masih hangat. Hujannya tinggal gerimis.',
  starter: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Studio Saya</title>
  <style>
    body {
      background-color: #FBF6EC;
      color: #2B2A33;
      font-family: system-ui, sans-serif;
      margin: 0;
    }
    main {
      max-width: 860px;
      margin: 0 auto;
      padding: 24px;
    }
  </style>
</head>
<body>
  <main>
    <!-- Ini halamanmu sendiri. Tidak ada klien yang mengatur. -->

  </main>
</body>
</html>
`,
  tugas: [
  {
    judul: 'Hero', bayar: 0, aset: ['blueprint-studio.txt'],
    pesan: [
      'Oke. Tarik napas. Nggak ada Bu Sari, nggak ada Pak Lurah. Klien kali ini kamu sendiri.',
      'Blueprint dari flashdisk bilang: mulai dari hero, bagian paling atas. Buat elemen id="hero" berisi <h1> dengan nama studiomu, dan satu paragraf yang menjelaskan apa yang kamu kerjakan, minimal lima kata.',
      'Jujur saja. Nggak perlu kedengaran hebat. Yang penting kedengaran kayak kamu.'
    ],
    reqs: [
      { label: 'Ada elemen id="hero"', ask: 'elemen id="hero"-nya belum ada',
        test: d => !!d.getElementById('hero') },
      { label: 'Di #hero ada <h1> berisi nama studio', ask: 'di hero belum ada <h1> nama studionya', kecuali: 0,
        test: d => { const h = d.querySelector('#hero h1'); return !!h && T.text(h).length >= 3; } },
      { label: 'Di #hero ada paragraf minimal 5 kata', ask: 'paragraf di hero masih kurang dari lima kata', kecuali: 0,
        test: d => T.all(d, '#hero p').some(p => T.jumlahKata(p) >= 5) }
    ],
    catatan: {
      teks: '<b>Hero</b> adalah bagian pertama yang dilihat pengunjung: siapa kamu dan apa yang kamu tawarkan, dalam satu layar. Tidak perlu panjang. Satu judul dan satu kalimat yang jelas lebih kuat daripada tiga paragraf. Kamu sudah membuat bagian seperti ini untuk klien-klienmu. Sekarang untuk dirimu sendiri.',
      contoh: '<section id="hero">\n  <h1>Dapur Rani</h1>\n  <p>Kue rumahan untuk ulang tahun dan arisan.</p>\n</section>',
      petunjuk: ['Di dalam <main>, buat <section id="hero"> berisi <h1> dan <p>. Isinya bebas, asal paragrafnya minimal lima kata.', '<section id="hero">\n  <h1>Studio {nama}</h1>\n  <p>Saya membuat website kecil yang rapi untuk warung, toko, dan komunitas di sekitar saya.</p>\n</section>']
    },
    sukses: ['Kelihatan kayak orang beneran yang buka jasa. Karena memang iya.']
  },
  {
    judul: 'Karya', bayar: 0,
    pesan: [
      'Sekarang bagian karya. Kamu sudah bikin banyak: papan nama warung, toko bunga, kafe musik, kalkulator laundry, jadwal 17-an, portal kelurahan.',
      'Pilih minimal tiga. Buat elemen id="karya" berisi kartu dengan class="karya". Masing-masing punya <h3> judul proyek dan <p> ceritanya.',
      'Tulis apa yang kamu pelajari dari setiap proyek, bukan cuma apa yang kamu buat. Klien suka orang yang belajar.'
    ],
    reqs: [
      { label: 'Ada elemen id="karya"', ask: 'elemen id="karya"-nya belum ada',
        test: d => !!d.getElementById('karya') },
      { label: 'Minimal tiga kartu .karya di dalam #karya', ask: 'kartu karyanya belum sampai tiga', kecuali: 0,
        test: d => T.all(d, '#karya .karya').length >= 3 },
      { label: 'Setiap kartu punya <h3> dan <p> yang terisi', ask: 'ada kartu karya yang belum punya judul <h3> atau cerita <p>', kecuali: 1,
        test: d => T.karyaLengkap(d) }
    ],
    catatan: {
      teks: 'Portofolio yang baik tidak hanya memamerkan hasil, tapi juga cara berpikirmu. Untuk setiap proyek, tulis masalahnya, apa yang kamu buat, dan apa yang kamu pelajari. Kartu-kartu dengan class yang sama bisa ditata sekaligus dengan satu aturan CSS, misalnya grid.',
      contoh: '<section id="karya">\n  <h2>Karya</h2>\n  <article class="karya">\n    <h3>Kalkulator Laundry Kilat</h3>\n    <p>Menghitung nota dengan diskon langganan. Belajar: uang orang lain tidak boleh salah hitung.</p>\n  </article>\n</section>',
      petunjuk: ['Buat <section id="karya"> berisi tiga <article class="karya">, masing-masing dengan <h3> dan <p>.', '<section id="karya">\n  <h2>Karya</h2>\n  <article class="karya">\n    <h3>Warung Kopi Senja</h3>\n    <p>Papan nama dan menu pertama saya. Belajar HTML dan CSS dari nol.</p>\n  </article>\n  <article class="karya">\n    <h3>Laundry Kilat</h3>\n    <p>Kalkulator nota dengan diskon langganan. Belajar menghitung uang dengan teliti.</p>\n  </article>\n  <article class="karya">\n    <h3>Sengata.id</h3>\n    <p>Portal pengaduan warga. Belajar fetch, validasi, dan menangani server yang error.</p>\n  </article>\n</section>']
    },
    sukses: ['Baca lagi deh kartu-kartunya. Kamu sudah sejauh ini, ternyata.']
  },
  {
    judul: 'Kontak', bayar: 0,
    pesan: [
      'Orang yang suka karyamu harus bisa menghubungimu. Buat bagian id="kontak" dengan tautan email (mailto:) atau WhatsApp (https://wa.me/62...).',
      'Nomor WhatsApp pakai format internasional: diawali 62, tanpa nol di depan, tanpa tanda plus, tanpa spasi. Misalnya https://wa.me/6281234567890.',
      'Tautannya harus ada tulisannya ya, jangan cuma ikon. Dan pakai kontak yang benar-benar kamu balas.'
    ],
    reqs: [
      { label: 'Ada elemen id="kontak"', ask: 'elemen id="kontak"-nya belum ada',
        test: d => !!d.getElementById('kontak') },
      { label: 'Tautan email (mailto:) atau WhatsApp (wa.me/62…) yang benar', ask: 'tautan email atau WhatsApp-nya belum ada, atau formatnya belum benar', kecuali: 0,
        test: d => T.tautanKontak(d).length > 0 },
      { label: 'Tautannya punya tulisan yang terlihat', ask: 'tautan kontaknya belum ada tulisannya', kecuali: 1,
        test: d => T.tautanKontak(d).some(a => T.text(a).length >= 3) }
    ],
    catatan: {
      teks: 'Tautan <code>mailto:</code> membuka aplikasi email dengan alamat tujuan yang sudah terisi. Tautan <code>https://wa.me/</code> diikuti nomor berformat internasional membuka chat WhatsApp. Kode negara Indonesia adalah 62, jadi 0812... ditulis 62812..., tanpa tanda plus, spasi, atau tanda hubung.',
      contoh: '<a href="mailto:halo@dapurrani.id">halo@dapurrani.id</a>\n<a href="https://wa.me/6281234567890">Chat WhatsApp</a>',
      petunjuk: ['Buat <section id="kontak"> dengan <a href="mailto:...">. Tulis alamat email atau "Chat WhatsApp" di dalam tautannya.', '<section id="kontak">\n  <h2>Kontak</h2>\n  <p>Punya warung, toko, atau acara yang butuh website?</p>\n  <a href="mailto:halo@studiosaya.id">halo@studiosaya.id</a>\n  <a href="https://wa.me/6281234567890">Chat WhatsApp</a>\n</section>']
    },
    sukses: ['Sekarang orang bisa menemukanmu. Agak menakutkan. Tapi bagus.']
  },
  {
    judul: 'Satu sentuhan JavaScript', bayar: 0,
    pesan: [
      'Blueprint poin empat: satu sentuhan JavaScript, supaya halamannya hidup.',
      'Bebas mau apa. Tombol ganti tema terang-gelap, tombol "lihat detail" yang membuka cerita karya, tombol salam yang berubah... Yang penting ada tombol yang kalau ditekan mengubah sesuatu di halaman.',
      'Dan konsolnya harus bersih. Studio sendiri, standar sendiri.'
    ],
    reqs: [
      { label: 'Ada tombol di halaman', ask: 'belum ada tombol yang bisa ditekan',
        test: (d, w) => T.interaksi(d, w).ada },
      { label: 'Menekan tombol mengubah sesuatu di halaman', ask: 'tombolnya sudah ditekan, tapi belum ada yang berubah di halaman', kecuali: 0,
        test: (d, w) => T.interaksi(d, w).berubah },
      { label: 'Konsol bersih setelah tombol ditekan', ask: 'konsolnya merah setelah tombolnya ditekan', kecuali: 0,
        test: (d, w) => { const x = T.interaksi(d, w); return x.ada && x.errs === 0; } }
    ],
    catatan: {
      teks: 'Interaksi kecil membuat halaman terasa hidup. Pola yang paling sering dipakai: tombol mengubah <code>class</code> sebuah elemen dengan <code>classList.toggle()</code>, lalu CSS yang menentukan tampilannya. Kamu sudah pernah melakukannya di Ruang Nada, waktu membuat mode gelap.',
      contoh: '<button id="tombolDetail">Lihat detail</button>\n<p id="detail" hidden>Dikerjakan dalam dua minggu.</p>\n\n<script>\n  document.getElementById("tombolDetail").addEventListener("click", function () {\n    const d = document.getElementById("detail");\n    d.hidden = !d.hidden;\n  });\n<\/script>',
      petunjuk: ['Buat tombol "Mode gelap" yang menjalankan document.body.classList.toggle("gelap"), lalu buat aturan CSS body.gelap.', '<button id="tombolTema">Mode gelap</button>\n\n<style>\n  body.gelap { background-color: #1C1B29; color: #F4EBD0; }\n</style>\n\n<script>\n  document.getElementById("tombolTema").addEventListener("click", function () {\n    document.body.classList.toggle("gelap");\n  });\n<\/script>']
    },
    sukses: ['Klik. Berubah. Klik lagi. Iya, aku juga main-mainin tombolnya lima kali.']
  },
  {
    judul: 'Rapi di HP, dan ceritamu', bayar: 0,
    pesan: [
      'Kebanyakan orang akan membuka situsmu dari HP. Tambahkan <meta name="viewport"> dan pastikan tata letaknya menyesuaikan layar: pakai @media, atau flex-wrap, atau grid dengan auto-fit.',
      'Lalu satu bagian lagi: id="cerita". Ceritakan perjalananmu, minimal 40 kata. Dari mana kamu mulai, kenapa kamu bertahan.',
      'Ini bagian yang paling susah ditulis. Wajar. Tulis saja dulu, nanti bisa direvisi.'
    ],
    reqs: [
      { label: 'Ada <meta name="viewport"> dengan width=device-width', ask: 'meta viewport-nya belum ada',
        test: d => T.viewport(d) },
      { label: 'Tata letak menyesuaikan layar (@media, flex-wrap, atau grid auto-fit)', ask: 'tata letaknya belum menyesuaikan layar HP',
        test: d => T.responsif(d) },
      { label: 'Bagian #cerita berisi minimal 40 kata', ask: 'bagian cerita belum ada, atau masih kurang dari 40 kata',
        test: d => T.jumlahKata(d.getElementById('cerita')) >= 40 }
    ],
    catatan: {
      teks: 'Tanpa <code>&lt;meta name="viewport"&gt;</code>, HP menampilkan halaman seolah-olah selebar layar laptop, lalu mengecilkannya. Setelah itu, tata letak bisa dibuat menyesuaikan layar: <code>@media (max-width: 600px)</code> untuk aturan khusus layar kecil, <code>flex-wrap: wrap</code> supaya kartu turun ke baris baru, atau <code>grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))</code> supaya jumlah kolom mengikuti lebar layar.',
      contoh: '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n<style>\n  .daftar { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }\n</style>',
      petunjuk: ['Tambahkan meta viewport di <head>, beri #karya grid auto-fit, lalu tulis <section id="cerita"> dengan paragraf minimal 40 kata.', '<meta name="viewport" content="width=device-width, initial-scale=1">\n\n<style>\n  #karya { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }\n</style>\n\n<section id="cerita">\n  <h2>Cerita</h2>\n  <p>Saya mulai dari papan nama sebuah warung kopi di Sengata, di sore yang hujan. Bayarannya kopi gratis. Setelah itu datang toko bunga, kafe musik, laundry, panitia 17-an, sampai kantor kelurahan. Saya bertahan karena setiap proyek membuat seseorang sedikit lebih mudah menjalankan usahanya.</p>\n</section>']
    },
    sukses: ['Aku baca ceritamu. Nggak nangis kok. Cuma kelilipan.']
  },
  {
    judul: 'Publish', bayar: 0, setelah: 'publish', tombol: 'Publish ke internet', kirimTeks: 'Publish.',
    pesan: [
      'Sudah. Semua bagian dari blueprint sudah ada.',
      'Tinggal satu tombol lagi. Kali ini bukan "Kirim ke klien". Tombolnya "Publish ke internet". Sebelum itu, pastikan semuanya masih lengkap dan konsolnya bersih.',
      'Deg-degan? Sama.'
    ],
    reqs: [
      { label: 'Hero, karya, dan kontak lengkap', ask: 'hero, karya, atau kontaknya ada yang belum lengkap',
        test: d => T.heroLengkap(d) && T.karyaLengkap(d) && T.tautanKontak(d).some(a => T.text(a).length >= 3) },
      { label: 'Ada tombol yang mengubah halaman', ask: 'tombol JavaScript-nya belum mengubah apa-apa',
        test: (d, w) => T.interaksi(d, w).berubah },
      { label: 'Rapi di HP, dan ada cerita minimal 40 kata', ask: 'viewport, tata letak HP, atau ceritanya belum lengkap',
        test: d => T.viewport(d) && T.responsif(d) && T.jumlahKata(d.getElementById('cerita')) >= 40 },
      { label: 'Konsol bersih', ask: 'konsolnya masih merah',
        test: (d, w) => { T.interaksi(d, w); return (w.__errs || []).length === 0; } }
    ],
    catatan: {
      teks: '<b>Publish</b> atau <b>deploy</b> artinya memindahkan file websitemu ke server yang bisa dibuka siapa saja. Untuk situs seperti ini, layanan gratis seperti GitHub Pages atau Netlify sudah cukup: unggah <code>index.html</code>, dan situsmu mendapat alamat sendiri. Sebelum publish, cek sekali lagi: tautan benar, konsol bersih, dan tampilannya rapi di HP. Setelah itu, jangan tunggu sempurna.',
      contoh: 'studio-saya/\n├── index.html\n└── (gambar, kalau ada)\n\n→ unggah ke GitHub Pages\n→ https://namamu.github.io/studio-saya/',
      petunjuk: ['Pastikan #hero, #karya (3 kartu), #kontak, tombol interaksi, meta viewport, tata letak responsif, dan #cerita masih ada semua.', 'Tidak ada kode baru di pesanan ini. Kalau ada yang belum centang, buka lagi catatan pesanan sebelumnya.']
    },
    sukses: ['Terkirim.', 'Situsmu sekarang online.']
  }
  ]
}
];

const ITEMS = [
  { id: 'tanaman', nama: 'Monstera kecil', ket: 'Sedikit hijau di samping meja.', harga: 50000,
    en: ['Small monstera', 'A little green next to the desk.'] },
  { id: 'poster', nama: 'Poster gunung', ket: 'Pengingat untuk kerja pelan-pelan.', harga: 40000,
    en: ['Mountain poster', 'A reminder to work slowly.'] },
  { id: 'lampu', nama: 'Lampu tumbler', ket: 'Digantung di atas jendela.', harga: 75000,
    en: ['String lights', 'Hung above the window.'] },
  { id: 'jam', nama: 'Jam dinding', ket: 'Jarumnya mengikuti jam di perangkatmu.', harga: 90000,
    en: ['Wall clock', 'Its hands follow the clock on your device.'] },
  { id: 'bintang', nama: 'Proyektor bintang', ket: 'Titik-titik cahaya lembut di dinding.', harga: 110000,
    en: ['Star projector', 'Soft dots of light on the wall.'] },
  { id: 'piringan', nama: 'Pemutar piringan hitam', ket: 'Membuka lagu kedua di pengaturan.', harga: 120000,
    en: ['Record player', 'Unlocks a second song in Settings.'] },
  { id: 'kucing', nama: 'Adopsi Mochi', ket: 'Kucing oren. Tidur di ujung meja, suka dielus.', harga: 150000,
    en: ['Adopt Mochi', 'An orange cat. Sleeps at the end of the desk and likes being petted.'] },
  { id: 'kipas', nama: 'Kipas angin berdiri', ket: 'Buat siang-siang yang gerah. Baling-balingnya berputar pelan.', harga: 180000,
    en: ['Standing fan', 'For hot afternoons. The blades turn slowly.'] },
  { id: 'laptopBaru', nama: 'Upgrade laptop', ket: 'Laptop perak yang lebih cepat. Bonus: tag penutup HTML ditulis otomatis saat kamu mengetik >.', harga: 1200000,
    en: ['Laptop upgrade', 'A faster silver laptop. Bonus: HTML closing tags are written for you when you type >.'] }
];
const SEMUA_ITEM = ITEMS.map(i => i.id).concat(['bingkai', 'vas', 'gitar', 'nota', 'stiker', 'plakat', 'kacamata', 'flashdisk', 'papanNama']);

/* Room atmosphere per chapter theme */
const SUASANA = {
  hujan: { nama: 'Sore hujan di warung', en: 'A rainy afternoon at the warung', dinding: '#2E3A55', lantai: '#28334C', lampu: 1, hujan: true },
  pagi:  { nama: 'Pagi cerah di toko bunga', en: 'A bright morning at the flower shop', dinding: '#65738F', lantai: '#56627C', lampu: 0.35, pagi: true },
  malam: { nama: 'Malam berbintang di Ruang Nada', en: 'A starry night at Ruang Nada', dinding: '#1E2338', lantai: '#191D2F', lampu: 1.2, malam: true },
  siang: { nama: 'Siang terik di Laundry Kilat', en: 'A scorching noon at Laundry Kilat', dinding: '#7D8B99', lantai: '#6C7986', lampu: 0.2, siang: true },
  meriah: { nama: 'Sore meriah menjelang 17 Agustus', en: 'A festive afternoon before 17 August', dinding: '#4B3F5E', lantai: '#3F3551', lampu: 1, meriah: true },
  mendung: { nama: 'Mendung di Kopi Alif', en: 'Overcast at Kopi Alif', dinding: '#3F4A50', lantai: '#353F45', lampu: 0.8, mendung: true, gerimis: true },
  badai: { nama: 'Badai di atas Sengata', en: 'A storm over Sengata', dinding: '#1B1F2F', lantai: '#161928', lampu: 1.1, badai: true },
  gagal: { nama: 'Timeline B yang abu-abu', en: 'The grey Timeline B', dinding: '#34363C', lantai: '#2C2E33', lampu: 0.55, hujan: true, mendung: true, gagal: true },
  sukses: { nama: 'Malam gemerlap di timeline sukses', en: 'A glittering night in the successful timeline', dinding: '#3B3350', lantai: '#322B45', lampu: 1.25, sukses: true },
  origin: { nama: 'Gerimis terakhir di studio sendiri', en: 'The last drizzle in your own studio', dinding: '#2F3654', lantai: '#29304A', lampu: 1, gerimis: true, origin: true },
  fajar: { nama: 'Fajar di studio sendiri', en: 'Dawn in your own studio', dinding: '#5C5A78', lantai: '#4E4B66', lampu: 0.45, pagi: true, fajar: true }
};

/* =========================================================
   STATE
   ========================================================= */
const VOL_AWAL = { musik: 0.6, hujan: 0.5, efek: 0.7 };
function baru() {
  return { versi: 2, nama: '', bab: 0, tugas: 0, intro: -1, kode: { 0: BAB[0].starter }, log: { 0: [] },
    uang: 0, punya: [], revisi: {}, tamat: [], vol: Object.assign({}, VOL_AWAL), lagu: 1,
    /* from Bab 4 */
    reputasi: 3, utang: 0, dibayar: {}, repBab: {}, keahlian: [], kecoa: 0, telurKecoa: false,
    pilihanB: null, sewaLunas: [], multiverse: false,
    /* from Bab 8 */
    akhir: false, playlist: false, ngplus: 0,
    bahasa: bahasaAwal() };
}
/* First visit: Indonesian for players in Indonesia (by time zone or browser language), English for everyone else */
function bahasaAwal() {
  try {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/^Asia\/(Jakarta|Pontianak|Makassar|Jayapura)$/.test(zona)) return 'id';
  } catch (e) {}
  return /^(id|ms)\b/i.test(navigator.language || '') ? 'id' : 'en';
}
function normalisasi(o) {
  if (!o || typeof o !== 'object') return baru();
  if (!o.bahasa) o.bahasa = 'id';  // saves from before the language option were played in Indonesian
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
  ['keahlian', 'sewaLunas', 'tamat', 'punya'].forEach(k => { if (!Array.isArray(s[k])) s[k] = []; });
  ['dibayar', 'repBab', 'revisi', 'kode', 'log'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
  s.reputasi = Math.min(5, Math.max(1, Math.round(+s.reputasi || 3)));
  s.utang = Math.max(0, +s.utang || 0);
  s.ngplus = Math.max(0, s.ngplus | 0);
  if (![1, 2, 3].includes(s.lagu)) s.lagu = 1;
  if (!['id', 'en'].includes(s.bahasa)) s.bahasa = 'id';
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
  const tulis = () => { try { localStorage.setItem(SIMPAN_KEY, JSON.stringify(S)); } catch (e) {} setStatus(L('tersimpan', 'saved')); };
  if (segera) tulis(); else { setStatus(L('menyimpan…', 'saving…')); simpanTimer = setTimeout(tulis, 600); }
}
function setStatus(t) { const el = document.getElementById('simpanStatus'); if (el) el.textContent = t; }

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rupiah = n => 'Rp' + n.toLocaleString('id-ID');
/* =========================================================
   LANGUAGE (Bahasa Indonesia / English)
   L(id, en) picks the text for the current language. Chapter text lives in BAB (Indonesian)
   and in BAB_EN (js/lang-en.js); switching language copies one set over the other in place,
   so every part of the game that reads BAB shows the new language right away.
   ========================================================= */
const L = (id, en) => (S && S.bahasa === 'en' ? en : id);
const BAB_EN = (typeof window !== 'undefined' && window.CQ_BAB_EN) || [];
/* copy the values found in `sumber` into `tujuan` (arrays of objects are merged by index) */
function tempel(tujuan, sumber) {
  if (!tujuan || !sumber) return;
  for (const k of Object.keys(sumber)) {
    const v = sumber[k];
    if (v === undefined) continue;
    const dalam = Array.isArray(v) ? v.some(x => x && typeof x === 'object') : v && typeof v === 'object';
    if (dalam) { if (tujuan[k] && typeof tujuan[k] === 'object') tempel(tujuan[k], v); }
    else tujuan[k] = Array.isArray(v) ? v.slice() : v;
  }
}
/* the original Indonesian values at the same places, so switching back is exact */
function salinTeks(asal, pola) {
  if (Array.isArray(pola)) return pola.map((p, i) => salinTeks(asal ? asal[i] : undefined, p));
  if (pola && typeof pola === 'object') { const o = {}; for (const k of Object.keys(pola)) o[k] = salinTeks(asal ? asal[k] : undefined, pola[k]); return o; }
  return Array.isArray(asal) ? asal.slice() : asal;
}
const BAB_ID = BAB.map((ch, b) => salinTeks(ch, BAB_EN[b] || {}));
const teksBab = (b, lang) => (lang === 'en' ? BAB_EN[b] : BAB_ID[b]) || {};
const KEAHLIAN_EN = { 'Performa Lv 1': 'Performance Lv 1', 'Studio Sendiri': 'Own Studio' };
const namaKeahlian = k => L(k, KEAHLIAN_EN[k] || k);

const slug = () => (S.nama || 'kamu').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'kamu';
const isi = s => String(s).replace(/\{nama\}/g, S.nama || L('Kak', 'friend')).replace(/\{NAMA\}/g, (S.nama || L('Kamu', 'You')).toUpperCase()).replace(/\{slug\}/g, slug());
const namaKlien = b => isi(BAB[b].klien.nama);
const usahaKlien = b => isi(BAB[b].klien.usaha);
const tunggu = ms => new Promise(r => setTimeout(r, ms));

const bab = () => BAB[S.bab];
const klien = () => bab().klien;
const tugasIni = () => bab().tugas[S.tugas];
const babTamat = () => S.tamat.includes(S.bab);
const adaBabBaru = () => babTamat() && S.bab + 1 < BAB.length;
const semuaTamat = () => babTamat() && S.bab + 1 >= BAB.length;
const kodeIni = () => (typeof S.kode[S.bab] === 'string' ? S.kode[S.bab] : (S.kode[S.bab] = bab().starter));
function asetTersedia() {
  const out = (bab().asetAwal || []).slice();
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
    hujan   (Bab 1)  lo-fi piano, bells, rain and vinyl crackle, 72 bpm
    pagi    (Bab 2)  plucked arpeggios over a soft pad, birdsong and breeze, 92 bpm
    malam   (Bab 3)  electric-piano jazz chords, walking bass, brushes, crickets and city hum, 58 bpm
    siang   (Bab 4)  lazy bossa guitar and shaker, washing machines and a ceiling fan, 100 bpm
    meriah  (Bab 5)  kendang, kentongan and bonang-like bells, a murmuring crowd and cheers, 112 bpm
    mendung (Bab 6)  a minor-key music box over a low drone, drizzle and a ticking clock, 66 bpm
    badai   (Bab 7)  a filtered synth arpeggio and pads, heavy rain and distant thunder, 84 bpm;
                     after the portal glitch the arpeggio stutters and detunes
    gagal   (Bab 8)  reversed-sounding piano swells over a low pad, heavy rain and a slow clock, 56 bpm
    sukses  (Bab 9)  city pop: electric piano, syncopated bass, kick and hi-hat, city hum, 104 bpm
    origin  (Bab 10) a warm reprise of the Bab 1 theme with a bell melody, light rain, 70 bpm
    fajar   (ending) the same melody in daylight with plucked strings, birdsong and a breeze, 76 bpm
  The record player (shop item) unlocks "piringan", a slow piano piece that can replace any theme.
  Finishing the game unlocks the secret playlist, which rotates through every theme.
*/
const TEMA_MUSIK = {
  hujan: { nama: 'Sore di warung', en: 'Afternoon at the warung', tempo: 72, akor: [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]] },
  pagi:  { nama: 'Pagi di toko bunga', en: 'Morning at the flower shop', tempo: 92, akor: [[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,64]] },
  malam: { nama: 'Malam di Ruang Nada', en: 'Night at Ruang Nada', tempo: 58, akor: [[50,53,57,60,64],[43,53,57,59,64],[48,52,55,59,62],[45,49,55,58,61]] },
  siang: { nama: 'Siang di Laundry Kilat', en: 'Noon at Laundry Kilat', tempo: 100, akor: [[50,53,57,60],[43,47,50,53],[48,52,55,59],[45,49,52,55]] },
  meriah: { nama: 'Gebyar 17-an', en: '17-an festival', tempo: 112, akor: [[60,64,67,72],[65,69,72,77],[67,71,74,79],[60,64,67,72]] },
  mendung: { nama: 'Mendung di Kopi Alif', en: 'Overcast at Kopi Alif', tempo: 66, akor: [[57,60,64,69],[53,57,60,65],[55,59,62,67],[52,55,59,64]] },
  badai: { nama: 'Badai di Sengata', en: 'Storm over Sengata', tempo: 84, akor: [[50,57,62,66],[48,55,60,64],[46,53,58,62],[45,52,57,61]] },
  piringan: { nama: 'Piringan: hujan larut', en: 'Record: late-night rain', tempo: 62, akor: [[57,60,64,67],[50,53,57,60],[55,59,62,65],[48,52,55,59]] },
  gagal: { nama: 'Timeline yang abu-abu', en: 'The grey timeline', tempo: 56, akor: [[57,60,64],[53,57,60],[48,52,55],[52,56,59]] },
  sukses: { nama: 'Tiga cabang', en: 'Three branches', tempo: 104, akor: [[53,57,60,64],[52,55,59,62],[50,53,57,60],[55,59,62,65]] },
  origin: { nama: 'Studio sendiri', en: 'A studio of your own', tempo: 70, akor: [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]] },
  fajar: { nama: 'Warung tetap buka', en: 'The warung stays open', tempo: 76, akor: [[48,52,55,59],[53,57,60,64],[57,60,64,67],[55,59,62,65]] }
};
const PENTA = [72, 74, 76, 79, 81, 84];
/* The Bab 10 melody (MIDI notes, null = rest), also played at the ending */
const MOTIF = [76, null, 79, 81, null, 79, 76, 74, 72, null, 74, 76, null, 79, 76, null];
/* The secret playlist, unlocked by finishing the game */
const PLAYLIST = ['hujan', 'pagi', 'malam', 'siang', 'meriah', 'mendung', 'badai', 'piringan', 'gagal', 'sukses', 'origin', 'fajar'];
const temaBab = () => (S.akhir && S.bab === BAB.length - 1 ? 'fajar' : bab().tema || 'hujan');
const temaMusik = () => {
  if (S.lagu === 3 && S.playlist) return PLAYLIST[(A.putar || 0) % PLAYLIST.length];
  return S.lagu === 2 && S.punya.includes('piringan') ? 'piringan' : temaBab();
};

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
  ['hujan', 'pagi', 'malam', 'siang', 'meriah', 'mendung', 'badai', 'gagal', 'sukses', 'origin', 'fajar'].forEach(k => { const g = c.createGain(); g.gain.value = 0; g.connect(A.suasana); A.amb[k] = g; });
  buatHujan(A.amb.hujan); buatKresek(A.amb.hujan);
  buatAngin(A.amb.pagi);
  buatDengungKota(A.amb.malam);
  buatMesinCuci(A.amb.siang);
  buatKeramaian(A.amb.meriah);
  buatHujan(A.amb.mendung, 0.45);
  buatHujan(A.amb.badai, 1.5); buatDengungKota(A.amb.badai);
  buatHujan(A.amb.gagal, 1.1); buatKresek(A.amb.gagal);
  buatDengungKota(A.amb.sukses); buatKeramaian(A.amb.sukses, 0.45);
  buatHujan(A.amb.origin, 0.35); buatKresek(A.amb.origin);
  buatAngin(A.amb.fajar, 0.5);
  A.putar = 0; A.putarSampai = c.currentTime + 45;
  A.tik = c.currentTime + 1;
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
function buatHujan(bus, kuat = 1) {
  rantai(sumberLoop(A.cokelat), filter('lowpass', 1100), filter('highpass', 140), gain(0.55 * kuat), bus);
  rantai(sumberLoop(derauPutih(A.ctx, 3)), filter('highpass', 5200), gain(0.035 * kuat), bus);
}
function buatMesinCuci(bus) {
  /* the slosh of a drum turning: band-passed noise swelling with a slow LFO */
  const g = gain(0.1);
  rantai(sumberLoop(A.cokelat), filter('bandpass', 340, 1.1), g, bus);
  const lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.45;
  const dalam = gain(0.09); lfo.connect(dalam); dalam.connect(g.gain); lfo.start();
  const hum = A.ctx.createOscillator(); hum.frequency.value = 98;
  rantai(hum, gain(0.012), bus); hum.start();
  rantai(sumberLoop(derauPutih(A.ctx, 2)), filter('lowpass', 900), gain(0.03), bus);
}
function buatKeramaian(bus, kuat = 1) {
  const g = gain(0.14 * kuat);
  rantai(sumberLoop(A.cokelat), filter('bandpass', 750, 0.6), g, bus);
  const lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.12;
  const dalam = gain(0.06); lfo.connect(dalam); dalam.connect(g.gain); lfo.start();
}
function sorak(t, bus = A.amb.meriah) {
  const c = A.ctx, s = c.createBufferSource(); s.buffer = A.derau;
  const bp = filter('bandpass', 1300, 0.7), g = c.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.5); g.gain.linearRampToValueAtTime(0, t + 1.8);
  s.loop = true; s.connect(bp); bp.connect(g); g.connect(bus); s.start(t); s.stop(t + 1.9);
}
function tik(t, vel = 0.03, bus = A.amb.mendung) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = 'square'; o.frequency.value = 2400;
  g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.025);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.03);
}
function petir(t) {
  const c = A.ctx, s = c.createBufferSource(); s.buffer = A.cokelat;
  const lp = filter('lowpass', 220), g = c.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.9, t + 0.25); g.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
  s.connect(lp); lp.connect(g); g.connect(A.amb.badai); s.start(t, Math.random() * 2, 3.3);
  const sc = $('scene');
  if (sc && sc.style.display !== 'none') { setTimeout(() => { sc.classList.add('kilat'); setTimeout(() => sc.classList.remove('kilat'), 380); }, Math.max(0, (t - c.currentTime) * 1000 - 400)); }
}
function buatKresek(bus) {
  const c = A.ctx, len = c.sampleRate * 5, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i += Math.floor(c.sampleRate * (0.05 + Math.random() * 0.3))) {
    const amp = 0.2 + Math.random() * 0.5;
    for (let k = 0; k < 40 && i + k < len; k++) d[i + k] = (Math.random() * 2 - 1) * amp * (1 - k / 40);
  }
  rantai(sumberLoop(b), filter('highpass', 1400), gain(0.05), bus);
}
function buatAngin(bus, kuat = 1) {
  const bp = filter('bandpass', 500, 0.7);
  rantai(sumberLoop(A.cokelat), bp, gain(0.22 * kuat), bus);
  const lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.07;
  const dalam = gain(260); lfo.connect(dalam); dalam.connect(bp.frequency); lfo.start();
}
function buatDengungKota(bus) {
  rantai(sumberLoop(A.cokelat), filter('lowpass', 170), gain(0.3), bus);
}
function kicau(t, bus = A.amb.pagi) {
  const c = A.ctx, n = 2 + Math.floor(Math.random() * 3), f0 = 2600 + Math.random() * 1400;
  for (let i = 0; i < n; i++) {
    const s = t + i * (0.09 + Math.random() * 0.05);
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f0, s); o.frequency.exponentialRampToValueAtTime(f0 * (1.25 + Math.random() * 0.3), s + 0.06);
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.035, s + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, s + 0.08);
    o.connect(g); g.connect(bus); o.start(s); o.stop(s + 0.1);
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

function gendang(t, tinggi, vel) {
  /* kendang: a pitched thump for "dung", a short noise slap for "tak" */
  const c = A.ctx;
  if (tinggi) {
    const s = c.createBufferSource(); s.buffer = A.derau;
    const bp = filter('bandpass', 1900, 1.2), g = c.createGain();
    g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.08);
    s.connect(bp); bp.connect(g); g.connect(A.musik); s.start(t, Math.random() * 0.5, 0.1);
  } else {
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(62, t + 0.18);
    g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.3);
    o.connect(g); g.connect(A.musik); o.start(t); o.stop(t + 0.32);
  }
}
function kentongan(t, vel) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.frequency.value = 880;
  g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.09);
  o.connect(g); g.connect(A.musik); o.start(t); o.stop(t + 0.1);
}
function kotakMusik(n, t, vel) {
  const c = A.ctx, f = midi(n), g = c.createGain();
  const o1 = c.createOscillator(); o1.frequency.value = f;
  const o2 = c.createOscillator(); o2.frequency.value = f * 3.01;
  const g2 = gain(0.12);
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(A.musik);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0005, t + 1.3);
  o1.start(t); o2.start(t); o1.stop(t + 1.35); o2.stop(t + 1.35);
}
function arpSynth(n, t, dur, vel, retak) {
  const c = A.ctx, o = c.createOscillator(), lp = filter('lowpass', 1300, 3), g = c.createGain();
  o.type = 'square'; o.frequency.value = midi(n);
  if (retak && Math.random() < 0.25) o.detune.setValueAtTime((Math.random() - 0.5) * 120, t);
  lp.frequency.setValueAtTime(1800, t); lp.frequency.exponentialRampToValueAtTime(500, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  o.connect(lp); lp.connect(g); g.connect(A.musik); o.start(t); o.stop(t + dur + 0.02);
}
function blip(t, vel) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = 'square'; o.frequency.value = 1800 + Math.random() * 2600;
  g.gain.setValueAtTime(vel, t); g.gain.linearRampToValueAtTime(0, t + 0.04);
  o.connect(g); g.connect(A.musik); o.start(t); o.stop(t + 0.05);
}

/* Bab 8: a piano note that swells in and stops, like a tape played backwards */
function pianoMundur(n, t, dur, vel) {
  const c = A.ctx, f = midi(n), g = c.createGain();
  const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
  const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f; o2.detune.value = -7;
  const g2 = gain(0.3);
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(A.musik);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + dur * 0.85); g.gain.linearRampToValueAtTime(0, t + dur * 0.92);
  o1.start(t); o2.start(t); o1.stop(t + dur); o2.stop(t + dur);
}
/* Bab 9: drum machine */
function kick(t, vel) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.26);
  o.connect(g); g.connect(A.musik); o.start(t); o.stop(t + 0.28);
}
function hat(t, vel) {
  const c = A.ctx, s = c.createBufferSource(); s.buffer = A.derau;
  const hp = filter('highpass', 7200), g = c.createGain();
  g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.05);
  s.connect(hp); hp.connect(g); g.connect(A.musik); s.start(t, Math.random() * 0.5, 0.06);
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
  } else if (tema === 'siang') {
    /* bossa: bass on 1 and 3, guitar chords on the syncopated off-beats, shaker on every eighth */
    const strum = (w, v) => akor.forEach((n, i) => petik(n, w + i * 0.018, v));
    if (b % 4 === 0) { bas(akor[0] - 12, t, ketukan * 1.4, 0.08); strum(t, 0.022); }
    if (b % 4 === 1) strum(t + ketukan / 2, 0.02);
    if (b % 4 === 2) bas(akor[0] - 5, t, ketukan * 1.2, 0.07);
    if (b % 4 === 3 && Math.random() < 0.7) strum(t, 0.018);
    sikat(t, 0.006); sikat(t + ketukan / 2, 0.01);
  } else if (tema === 'meriah') {
    gendang(t, b % 2 === 1, b % 2 === 1 ? 0.05 : 0.12);
    if (b % 4 === 3) gendang(t + ketukan / 2, false, 0.07);
    kentongan(t + ketukan / 2, 0.03);
    const nada = akor[(b * 3 + (b >> 2)) % akor.length] + 12;
    if (Math.random() < 0.8) lonceng(nada, t, 0.04);
    if (Math.random() < 0.35) lonceng(akor[(b + 2) % akor.length] + 12, t + ketukan / 2, 0.03);
  } else if (tema === 'mendung') {
    if (awalBar) { pad(akor[0] - 12, t, ketukan * 4, 0.014); pad(akor[2] - 12, t, ketukan * 4, 0.008); }
    const pola = [0, 2, 1, 3, 2, 1, 3, 0];
    kotakMusik(akor[pola[b % 8]] + 12, t, 0.035);
    if (Math.random() < 0.25) kotakMusik(akor[pola[(b + 3) % 8]] + 24, t + ketukan / 2, 0.018);
  } else if (tema === 'badai') {
    const retak = S.multiverse;
    if (awalBar) { akor.forEach(n => pad(n - 12, t, ketukan * 4, 0.01)); bas(akor[0] - 12, t, ketukan * 3.5, 0.08); }
    const pola = [0, 1, 2, 3, 2, 1];
    for (let i = 0; i < 2; i++) arpSynth(akor[pola[(b * 2 + i) % pola.length]] + 12, t + i * ketukan / 2, ketukan * 0.45, 0.018, retak);
    if (retak && Math.random() < 0.15) { blip(t + Math.random() * ketukan, 0.012); if (Math.random() < 0.4) arpSynth(akor[0] + 24, t + ketukan * 0.75, 0.06, 0.02, true); }
  } else if (tema === 'gagal') {
    if (awalBar) { akor.forEach((n, i) => pianoMundur(n + (i === 0 ? -12 : 0), t, ketukan * 4, 0.05)); pad(akor[0] - 12, t, ketukan * 4, 0.012); }
    if ((b % 4 === 1 || b % 4 === 3) && Math.random() < 0.6) piano(akor[(b >> 1) % akor.length] + 12, t + Math.random() * 0.03, ketukan * 2, 0.045);
  } else if (tema === 'sukses') {
    const q = ketukan / 4;
    kick(t, 0.13); if (b % 4 === 3) kick(t + q * 2, 0.08);
    hat(t + q * 2, 0.02); hat(t + q * 3, 0.008); if (b % 2 === 1) hat(t, 0.012);
    if (b % 4 === 0) akor.forEach((n, i) => rhodes(n, t + i * 0.012, ketukan * 1.6, 0.028));
    if (b % 4 === 1) akor.slice(1).forEach(n => rhodes(n + 12, t + q * 2, ketukan * 0.9, 0.018));
    if (b % 4 === 2) akor.forEach(n => rhodes(n, t + q * 2, ketukan * 1.4, 0.022));
    const pola = [[0, 0], [2.5, 7], [0, 12], [2, 10]][b % 4];
    bas(akor[0] - 12 + pola[1], t + q * pola[0] / 2, ketukan * 0.7, 0.1);
    if (Math.random() < 0.22) lonceng(PENTA[(b * 5) % PENTA.length] + 12, t + q * 2, 0.025);
  } else if (tema === 'origin' || tema === 'fajar') {
    if (awalBar) {
      akor.forEach((n, i) => piano(n, t + i * 0.035 + Math.random() * 0.01, ketukan * 3.8, 0.045));
      piano(akor[0] - 12, t, ketukan * 3.8, 0.06); pad(akor[1], t, ketukan * 4, 0.008);
    }
    const nada = MOTIF[b % MOTIF.length];
    if (nada) lonceng(nada, t, tema === 'fajar' ? 0.05 : 0.04);
    if (tema === 'fajar') {
      petik(akor[(b * 2) % akor.length] + 12, t + ketukan / 2, 0.03);
      if (b % 2 === 0) bas(akor[0] - 12, t, ketukan * 1.6, 0.06);
    }
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
  if (amb === 'meriah' && Math.random() < 0.004) sorak(c.currentTime + 0.05);
  if (amb === 'badai' && Math.random() < 0.0035) petir(c.currentTime + 0.6);
  if (amb === 'mendung' && A.tik < c.currentTime + 0.1) { tik(A.tik, A.tikGanjil ? 0.02 : 0.03); A.tikGanjil = !A.tikGanjil; A.tik += 1; }
  if (amb === 'gagal' && A.tik < c.currentTime + 0.1) { tik(A.tik, A.tikGanjil ? 0.012 : 0.02, A.amb.gagal); A.tikGanjil = !A.tikGanjil; A.tik += 1.6; }
  if (amb === 'fajar' && Math.random() < 0.014) kicau(c.currentTime + 0.05, A.amb.fajar);
  if (amb === 'sukses' && Math.random() < 0.002) sorak(c.currentTime + 0.05, A.amb.sukses);
  /* secret playlist: move to the next theme every 45 seconds */
  if (S.lagu === 3 && S.playlist && c.currentTime > A.putarSampai) {
    A.putar = ((A.putar || 0) + 1) % PLAYLIST.length; A.putarSampai = c.currentTime + 45; A.beat = 0;
    if (!document.hidden) toast(L('Playlist rahasia: ', 'Secret playlist: ') + L(TEMA_MUSIK[PLAYLIST[A.putar]].nama, TEMA_MUSIK[PLAYLIST[A.putar]].en), 3500);
  }
  if (A.tik < c.currentTime - 2) A.tik = c.currentTime + 0.2;
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
function sfxKecoa() {
  if (!A.ctx) return;
  const t = A.ctx.currentTime;
  for (let i = 0; i < 7; i++) {
    const s = A.ctx.createBufferSource(); s.buffer = A.derau;
    const bp = filter('bandpass', 4200, 3), g = A.ctx.createGain();
    g.gain.setValueAtTime(0.05, t + i * 0.045); g.gain.exponentialRampToValueAtTime(0.0005, t + i * 0.045 + 0.02);
    s.connect(bp); bp.connect(g); g.connect(A.efek); s.start(t + i * 0.045, Math.random() * 0.5, 0.03);
  }
}
const sfxTangkap = () => tLonceng([[88, 0, 0.08], [84, 0.06, 0.07], [91, 0.12, 0.06]]);
function sfxGlitch(kuat = 1) {
  if (!A.ctx) return;
  const c = A.ctx, t = c.currentTime, dur = 2.6 * kuat;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(55, t);
  const lfo = c.createOscillator(); lfo.frequency.value = 7; const dalam = gain(18); lfo.connect(dalam); dalam.connect(o.frequency);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09 * kuat, t + 0.2); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(filter('lowpass', 600)).connect(g); g.connect(A.efek);
  o.start(t); lfo.start(t); o.stop(t + dur + 0.1); lfo.stop(t + dur + 0.1);
  for (let i = 0; i < 14 * kuat; i++) {
    const w = t + Math.random() * dur, b = c.createOscillator(), bg = c.createGain();
    b.type = 'square'; b.frequency.value = 300 + Math.random() * 3000;
    bg.gain.setValueAtTime(0.04, w); bg.gain.linearRampToValueAtTime(0, w + 0.05);
    b.connect(bg); bg.connect(A.efek); b.start(w); b.stop(w + 0.06);
  }
}
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
  malam: 'Malam cerah, dan jangkrik mulai bernyanyi',
  siang: 'Matahari siang terik, dan mesin cuci tetangga berputar tanpa henti',
  meriah: 'Umbul-umbul merah putih berkibar, dan dari lapangan terdengar sorak anak-anak',
  mendung: 'Langit mendung, gerimis tipis, dan jam dinding terdengar lebih keras dari biasanya',
  badai: 'Hujan badai turun, dan petir sesekali menerangi kota',
  gagal: 'Semuanya abu-abu, dan jam dinding berdetak lebih lambat',
  sukses: 'Lampu kota gemerlap, dan papan iklan warung menyala di kejauhan',
  origin: 'Gerimis tinggal sisa-sisa, dan teh di meja masih hangat',
  fajar: 'Hujan sudah reda, matahari pagi naik pelan-pelan'
};
const SUASANA_JUDUL_EN = {
  hujan: 'Rain is falling and the tea is still warm',
  pagi: 'Morning sun comes through the window, and the birds are already busy',
  malam: 'The night is clear, and the crickets have started singing',
  siang: 'The noon sun is blazing, and the neighbour\'s washing machines never stop',
  meriah: 'Red-and-white flags flutter, and children cheer from the field',
  mendung: 'The sky is grey, a thin drizzle falls, and the wall clock sounds louder than usual',
  badai: 'A storm is raging, and lightning lights up the town now and then',
  gagal: 'Everything is grey, and the wall clock ticks slower',
  sukses: 'The city lights glitter, and the warung\'s billboard glows in the distance',
  origin: 'Only the last of the drizzle is left, and the tea on the desk is still warm',
  fajar: 'The rain has stopped, and the morning sun rises slowly'
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
  const hujan = su.hujan || su.gerimis || su.badai;
  $('rainFall').style.display = hujan ? '' : 'none';
  $('rainFall').setAttribute('opacity', su.badai ? '.75' : su.gerimis ? '.22' : '.45');
  $('lapisPagi').style.display = su.pagi ? '' : 'none';
  $('lapisMalam').style.display = su.malam && idx < 6 ? '' : 'none';
  $('lapisSiang').style.display = su.siang ? '' : 'none';
  $('lapisMeriah').style.display = su.meriah ? '' : 'none';
  $('lapisMendung').style.display = su.mendung ? '' : 'none';
  $('lapisBadai').style.display = su.badai ? '' : 'none';
  $('lapisSukses').style.display = su.sukses ? '' : 'none';
  if (su.gagal) $('rainFall').setAttribute('opacity', '.55');
  const kota = su.gagal ? 0.12 : su.sukses ? 1 : su.origin ? 0.5 : su.fajar ? 0
    : su.hujan ? (idx >= 2 && idx < 6 ? 0.4 + idx * 0.1 : 0) : su.malam ? (idx < 6 ? 0.9 : 0.35)
    : su.meriah ? (idx >= 2 ? 0.85 : 0.3) : su.badai ? 0.55 : su.mendung ? 0.25 : 0;
  $('lampuKota').setAttribute('opacity', kota.toFixed(2));
  $('scene').setAttribute('aria-label', L('Studio kecil: ', 'Small studio: ') + L(su.nama, su.en).toLowerCase());
  SEMUA_ITEM.forEach(id => { const el = $('item-' + id); if (el) el.classList.toggle('on', S.punya.includes(id)); });
  $('item-papan').classList.toggle('on', ['nota', 'stiker', 'plakat'].some(id => S.punya.includes(id)));
  /* the crack stays open from the portal glitch until the player comes home in Bab 10 */
  $('item-retak').classList.toggle('on', !!S.multiverse && S.bab >= 6 && S.bab <= 8);
  $('item-bingkai').classList.toggle('pudar', !!S.multiverse && S.bab === 6);
  /* Bab 8: the world is grey until the code is refactored; colour returns with each order */
  const abu = S.bab === 7 && !babTamat() ? 1 - S.tugas / n : 0;
  $('scene').style.filter = abu ? `grayscale(${abu.toFixed(3)})` : '';
  document.body.style.setProperty('--abu', abu.toFixed(3));
  const teksPapan = 'STUDIO ' + (S.nama || L('KAMU', 'YOU')).toUpperCase();
  $('papanTeks').textContent = teksPapan;
  if (teksPapan.length > 14) $('papanTeks').setAttribute('textLength', '180'); else $('papanTeks').removeAttribute('textLength');
  $('laptopBadan').setAttribute('fill', S.punya.includes('laptopBaru') ? '#A9B3C6' : '#39425C');
  renderReputasi();
  $('piring').classList.toggle('jalan', temaMusik() === 'piringan');
  const adaPesan = adaBabBaru() || (!babTamat() && S.intro < S.tugas);
  $('hpNotif').style.display = adaPesan ? '' : 'none';
  $('hpLayar').setAttribute('fill', adaPesan ? '#CFE0E8' : '#39425C');
  $('uangStudio').textContent = rupiah(S.uang);
  $('uangKerja').textContent = rupiah(S.uang);
  let bisik = '';
  if (semuaTamat() && S.akhir) bisik = L(`Studio ${S.nama || 'kecilmu'} sudah berdiri. Kalau mau mengulang dengan aturan freelancer sungguhan, coba Mode Freelance Beneran di Pengaturan.`, `Studio ${S.nama || ''} is up and running. If you want to replay with real freelancer rules, try Real Freelance Mode in Settings.`);
  else if (semuaTamat()) bisik = L('Situsmu sudah online.', 'Your site is online.');
  else if (adaBabBaru()) bisik = BAB[S.bab + 1].bisikan || L('Ponselmu bergetar. Ada klien baru.', 'Your phone buzzes. A new client.');
  else if (adaPesan) bisik = L(`Ponselmu bergetar. Ada pesan dari ${namaKlien(S.bab)}.`, `Your phone buzzes. A message from ${namaKlien(S.bab)}.`);
  else if (S.punya.length === 0 && S.uang >= 40000) bisik = L('Tabunganmu cukup untuk menghias studio. Cek rak toko.', 'You have enough savings to decorate the studio. Check the shop shelf.');
  $('bisikan').textContent = bisik;
  const suasanaJudul = L(SUASANA_JUDUL[tema], SUASANA_JUDUL_EN[tema]);
  $('teksJudul').textContent = S.akhir && semuaTamat()
    ? L(`Studio ${S.nama} sudah berdiri. ${suasanaJudul}, dan warung di bawah tetap buka.`, `Studio ${S.nama} is up and running. ${suasanaJudul}. The warung downstairs is still open.`)
    : S.tamat.length === 0
    ? L(`Studio kecilmu sudah siap. ${suasanaJudul}, dan klien pertamamu sebentar lagi mengirim pesan.`, `Your small studio is ready. ${suasanaJudul}, and your first client is about to message you.`)
    : L(`Studio kecilmu menunggu. ${suasanaJudul}. Pekerjaan berikutnya ada di laptop.`, `Your small studio is waiting. ${suasanaJudul}. The next job is on the laptop.`);
  aturTema();
}

/* =========================================================
   FREELANCER SYSTEMS (from Bab 4): reputation, rent, cockroaches, lore
   ========================================================= */
/* Reputation stars scale the pay from Bab 4 onward */
const PENGALI = { 1: 0.6, 2: 0.8, 3: 1, 4: 1.15, 5: 1.3 };
/* New Game+ ("Mode Freelance Beneran"): reputation, cockroaches and rent from Bab 1, and pay +25% per round */
const pakaiReputasi = b => b >= 3 || S.ngplus > 0;
function bayaranTugas(b, t) {
  let v = t.bayar;
  if (pakaiReputasi(b) && !BAB[b].tanpaPengali) v *= PENGALI[S.reputasi];
  if (S.ngplus) v *= 1 + 0.25 * S.ngplus;
  return Math.round(v / 1000) * 1000;
}
const sewaBab = b => BAB[b].sewa || (S.ngplus && b > 0 && !BAB[b].tanpaKos ? 250000 : 0);
const bintang = n => '★'.repeat(n) + '☆'.repeat(5 - n);
function renderReputasi() {
  const tampilkan = pakaiReputasi(S.bab) || S.tamat.includes(2);
  ['reputasiStudio', 'reputasiKerja'].forEach(id => {
    const el = $(id); if (!el) return;
    el.style.display = tampilkan ? '' : 'none';
    el.innerHTML = `<span aria-hidden="true">${bintang(S.reputasi)}</span>`;
    el.setAttribute('aria-label', L(`Reputasi ${S.reputasi} dari 5 bintang`, `Reputation ${S.reputasi} of 5 stars`));
    el.title = L(`Reputasi ${S.reputasi} dari 5 bintang. Bayaran ×${PENGALI[S.reputasi]}`, `Reputation ${S.reputasi} of 5 stars. Pay ×${PENGALI[S.reputasi]}`);
  });
}

/* Story dialogs: one or more paragraphs, an optional picture, and one or more buttons.
   Resolves with the value of the button pressed. */
function dialogCerita({ judul, teks = [], gambar = '', tombol = [{ v: 'ok', label: L('Lanjut', 'Continue') }], kelas = '' }) {
  return new Promise(resolve => {
    const d = $('dCerita');
    const daftar = Array.isArray(tombol) ? tombol : [{ v: 'ok', label: tombol }];
    d.className = kelas;
    d.innerHTML = `<form method="dialog" class="dlg"><h2>${esc(judul)}</h2>${gambar ? `<div class="gambar-cerita">${gambar}</div>` : ''}
      ${teks.map(p => `<p>${esc(p)}</p>`).join('')}
      <div class="baris-tombol">${daftar.map((b, i) => `<button class="tombol ${i < daftar.length - 1 ? 'garis' : ''}" value="${esc(b.v)}">${esc(b.label)}</button>`).join('')}</div></form>`;
    d.returnValue = '';
    d.addEventListener('close', () => resolve(d.returnValue || daftar[daftar.length - 1].v), { once: true });
    d.showModal();
  });
}

const WARUNG_IBU_SVG = () => `<svg viewBox="0 0 320 170" role="img" aria-label="${L('Warung Ibu di malam hari', 'Mum\'s warung at night')}"><rect width="320" height="170" fill="#2B2F4A"/><circle cx="270" cy="34" r="14" fill="#F4EBD0"/><rect x="40" y="62" width="240" height="96" fill="#8B5A3C"/><path d="M28 66 L292 66 L276 38 L44 38 Z" fill="#D08C8C"/><g fill="#F7F1E3"><path d="M44 38 L60 38 L52 66 L36 66 Z"/><path d="M92 38 L108 38 L100 66 L84 66 Z"/><path d="M140 38 L156 38 L148 66 L132 66 Z"/><path d="M188 38 L204 38 L196 66 L180 66 Z"/><path d="M236 38 L252 38 L244 66 L228 66 Z"/></g><rect x="56" y="80" width="208" height="46" fill="#F4C979" opacity=".85"/><rect x="50" y="122" width="220" height="14" fill="#6A4129"/><g fill="#C98A52"><ellipse cx="90" cy="118" rx="14" ry="6"/><ellipse cx="112" cy="116" rx="12" ry="5"/><ellipse cx="100" cy="110" rx="12" ry="5"/></g><rect x="170" y="100" width="18" height="22" rx="3" fill="#FFFFFF" opacity=".9"/><rect x="172" y="104" width="14" height="14" fill="#C66B3D"/><path d="M200 104 q6 -8 0 -16 q-6 -8 0 -16" fill="none" stroke="#F7F1E3" stroke-width="2" opacity=".7"/><text x="160" y="152" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#F7F1E3">${L('Warung Ibu', 'Mum\'s Warung')}</text></svg>`;

/* Rent is due when a chapter from Bab 4 onward starts. If savings are not enough,
   Mum covers the gap as a loan that is repaid from half of the next payments. */
async function bayarKos(b) {
  const sewa = sewaBab(b);
  if (!sewa || S.sewaLunas.includes(b)) return;
  if (S.uang >= sewa) {
    await dialogCerita({
      judul: L('Tagihan kos', 'Rent is due'),
      teks: [L(`Bu Kos mengetuk pintu sambil membawa buku catatan. "Kos bulan ini ya, Nak. ${rupiah(sewa)}."`, `Bu Kos, the landlady, knocks with her notebook. "This month's rent, dear. ${rupiah(sewa)}."`),
        L(`Tabunganmu ${rupiah(S.uang)}. Setelah dibayar, tinggal ${rupiah(S.uang - sewa)}.`, `Your savings: ${rupiah(S.uang)}. After paying, ${rupiah(S.uang - sewa)} is left.`)],
      tombol: L(`Bayar ${rupiah(sewa)}`, `Pay ${rupiah(sewa)}`)
    });
    S.uang -= sewa; sfxKoin();
    catat('sistem', { k: 'kosLunas', v: { n: sewa } });
  } else {
    const kurang = sewa - S.uang;
    await dialogCerita({
      judul: L('Tagihan kos', 'Rent is due'),
      teks: [L(`Bu Kos mengetuk pintu. "Kos bulan ini ${rupiah(sewa)}, Nak."`, `Bu Kos, the landlady, knocks. "This month's rent is ${rupiah(sewa)}, dear."`),
        L(`Tabunganmu cuma ${rupiah(S.uang)}. Kurang ${rupiah(kurang)}.`, `You only have ${rupiah(S.uang)}. You're ${rupiah(kurang)} short.`)],
      tombol: L('Pulang dulu ke warung Ibu', 'Go home to Mum\'s warung')
    });
    await dialogCerita({
      judul: L('Pulang ke warung Ibu', 'Home to Mum\'s warung'), gambar: WARUNG_IBU_SVG(), kelas: 'hangat',
      teks: [
        L('Malam itu kamu naik angkot terakhir ke warung Ibu. Gorengan masih hangat, dan teh manis sudah disiapkan tanpa perlu diminta.', 'That night you catch the last minibus to Mum\'s warung. The fritters are still warm, and a sweet tea is waiting before you even ask.'),
        L('"Namanya juga merintis," kata Ibu sambil menyelipkan amplop ke tanganmu. "Bayar kosnya. Nanti kalau sudah ada rezeki, dicicil saja."', '"That\'s what starting out looks like," Mum says, slipping an envelope into your hand. "Pay the rent. When the money comes, pay me back bit by bit."'),
        L(`Ibu menalangi ${rupiah(kurang)}. Setengah dari bayaran berikutnya otomatis dipakai mencicil. Bab ini dimulai dari awal, dengan perut kenyang.`, `Mum covers ${rupiah(kurang)}. Half of your next payments will go to paying her back. The chapter starts from the beginning, on a full stomach.`)
      ],
      tombol: L('Kembali ke studio', 'Back to the studio')
    });
    S.utang += kurang; S.uang = 0;
    catat('sistem', { k: 'kosIbu', v: { n: S.utang } });
  }
  S.sewaLunas.push(b);
  simpan(true); aturScene();
}

/* Toast */
let toastTimer;
function toast(teks, ms = 7000) {
  const el = $('toast');
  el.textContent = teks; el.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), ms);
}

/* Lore printed to the real browser DevTools console */
const LORE = {
  awal: ['Ada dua salinan dari satu kode. Satu di warung Bu Sari. Satu lagi di tempat yang belum ada.'],
  timeline: [() => `timeline_b.json dibuat oleh: ${S.nama || 'kamu'}. Tanggal: ${duaMingguLagi()}.`, 'Kamu yang menulisnya. Nanti.'],
  glitch: ['MULTIVERSE_UNLOCKED = true', 'Laporan ke-7 tidak berasal dari server ini.', 'Cek tab Application > Local Storage. Ada kunci baru.'],
  kecoa: ['Kecoa kelima tidak lari. Dia menoleh.', '"Refactor dulu sebelum lanjut," katanya. (Bab 8)'],
  retak: ['Retakan masih terbuka. Timeline B menunggu.'],
  akhir: ['Retakan tertutup.', 'Di semua timeline, ada satu hal yang sama: warungnya tetap buka.', 'Terima kasih sudah membuka konsol sampai sejauh ini.']
};
const LORE_EN = {
  awal: ['There are two copies of one piece of code. One at Bu Sari\'s warung. The other somewhere that doesn\'t exist yet.'],
  timeline: [() => `timeline_b.json created by: ${S.nama || 'you'}. Date: ${duaMingguLagi()}.`, 'You wrote it. Later.'],
  glitch: ['MULTIVERSE_UNLOCKED = true', 'Report #7 did not come from this server.', 'Check the Application tab > Local Storage. There is a new key.'],
  kecoa: ['The fifth cockroach does not run. It turns around.', '"Refactor first, then move on," it says. (Chapter 8)'],
  retak: ['The crack is still open. Timeline B is waiting.'],
  akhir: ['The crack has closed.', 'Every timeline shares one thing: the warung stays open.', 'Thanks for opening the console all the way to the end.']
};
function lore(kunci) {
  const baris = L(LORE, LORE_EN)[kunci]; if (!baris) return;
  try {
    console.log('%c CODEQUEST//RETAKAN ', 'background:#6B2D5C;color:#F4EBD0;font-weight:bold;border-radius:3px');
    baris.forEach(b => console.log('%c' + (typeof b === 'function' ? b() : b), 'color:#9FD8C6;font-family:monospace'));
  } catch (e) {}
}

/* Cockroach bugs: from Bab 4 a cockroach sometimes crosses the workspace.
   Catching it usually leaves a hint; sometimes it only startles you. */
const KECOA_SVG = '<svg viewBox="0 0 48 30" width="48" height="30" aria-hidden="true"><g stroke="#3B2618" stroke-width="1.6" stroke-linecap="round" fill="none"><path d="M16 9 l-6 -5 M16 21 l-6 5 M24 8 l-2 -6 M24 22 l-2 6 M31 9 l4 -6 M31 21 l4 6"/><path d="M40 13 q6 -6 8 -12 M40 17 q6 6 8 12"/></g><ellipse cx="24" cy="15" rx="15" ry="8" fill="#7A4A2A"/><ellipse cx="38" cy="15" rx="5" ry="5" fill="#5A361E"/><path d="M12 15 L36 15" stroke="#5A361E" stroke-width="1.2"/></svg>';
let kecoaTimer = null;
function jadwalKecoa(cepat) {
  clearTimeout(kecoaTimer);
  if (!pakaiReputasi(S.bab)) return;
  kecoaTimer = setTimeout(munculKecoa, (cepat ? 25 : 70 + Math.random() * 110) * 1000);
}
function munculKecoa() {
  if (!$('screen-work').classList.contains('active') || document.querySelector('dialog[open]') || babTamat() || document.hidden) return jadwalKecoa();
  const k = document.createElement('button');
  k.className = 'kecoa' + (Math.random() < 0.5 ? ' balik' : '');
  k.setAttribute('aria-label', L('Kecoa lewat. Tekan untuk menangkap.', 'A cockroach runs past. Press to catch it.'));
  k.innerHTML = KECOA_SVG;
  k.style.top = (18 + Math.random() * 60) + '%';
  k.onclick = () => tangkapKecoa(k);
  document.body.appendChild(k);
  sfxKecoa();
  setTimeout(() => { if (k.isConnected) { k.remove(); jadwalKecoa(); } }, 8000);
}
function tangkapKecoa(k) {
  k.remove(); S.kecoa++; simpan();
  sfxTangkap();
  if (Math.random() < 0.75 && !babTamat()) {
    const i = hasilTerakhir.findIndex(x => !x);
    const req = i >= 0 ? tugasIni().reqs[i] : null;
    toast(L(`Kecoanya meninggalkan catatan kecil. ${req ? `Yang belum: "${req.label}". ` : ''}`, `The cockroach left a little note. ${req ? `Still missing: "${req.label}". ` : ''}`) + isi(tugasIni().catatan.petunjuk[0]), 10000);
  } else {
    toast(L('Kecoanya kabur ke bawah keyboard. Nggak ada apa-apa, cuma bikin kaget.', 'The cockroach escapes under the keyboard. Nothing there, it just gave you a fright.'));
    const k2 = $('konsol'), lama = k2.innerHTML;
    k2.innerHTML = `<div class="log-warn">${L(`⚠ Warning: ada kecoa di baris ${3 + Math.floor(Math.random() * 30)}. (Bercanda.)`, `⚠ Warning: cockroach on line ${3 + Math.floor(Math.random() * 30)}. (Just kidding.)`)}</div>`;
    setTimeout(() => { k2.innerHTML = lama; renderKonsol(); }, 3500);
  }
  if (S.kecoa >= 5 && !S.telurKecoa && (S.bab >= 5 || S.keahlian.includes('Debugging Lv 1'))) {
    S.telurKecoa = true; simpan(true); lore('kecoa');
    setTimeout(() => toast(L('Kecoa kelima berhenti sebentar dan menoleh ke arahmu. Coba buka konsol DevTools browsermu (F12).', 'The fifth cockroach stops and turns to look at you. Try opening your browser\'s DevTools console (F12).'), 10000), 1200);
  }
  jadwalKecoa();
}

/* Bab 6: the file that appears by itself */
async function pilihTimelineB() {
  if (S.pilihanB) return;
  lore('awal');
  const v = await dialogCerita({
    judul: 'timeline_b.json',
    teks: [L(`File ini muncul sendiri di folder Mas Alif. Tanggal dibuat: ${duaMingguLagi()}.`, `This file appeared by itself in Mas Alif's folder. Date created: ${duaMingguLagi()}.`),
      L('Ukurannya kecil. Ikonnya sedikit bergetar, atau mungkin cuma matamu yang lelah.', 'It\'s small. The icon trembles a little, or maybe your eyes are just tired.')],
    tombol: [{ v: 'hapus', label: L('Hapus file', 'Delete the file') }, { v: 'buka', label: L('Biarkan dan baca nanti', 'Leave it and read it later') }]
  });
  S.pilihanB = v; simpan(true);
  if (v === 'hapus') {
    catat('sistem', { k: 'hapusB' });
    await tunggu(1500);
    document.body.classList.add('glitch', 'glitch-kecil'); sfxGlitch(0.4);
    await tunggu(700);
    document.body.classList.remove('glitch', 'glitch-kecil');
    catat('sistem', { k: 'munculB' });
  } else {
    catat('sistem', { k: 'biarB' });
  }
  lore('timeline');
}
async function tampilFotoTimeline() {
  await dialogCerita({
    judul: L('Isi timeline_b.json', 'Inside timeline_b.json'), kelas: 'kelabu',
    gambar: `<img src="${ASET_URI['warung-tutup.svg']}" alt="${L('Foto Warung Kopi Senja dengan rolling door tertutup dan tulisan TUTUP', 'Photo of Warung Kopi Senja with the shutter down and a CLOSED sign')}">`,
    teks: [L(`Tanggal: ${duaMingguLagi()}. Status: TUTUP PERMANEN.`, `Date: ${duaMingguLagi()}. Status: PERMANENTLY CLOSED.`),
      L('Di pojok foto ada tulisan tangan yang kamu kenal. Tulisanmu sendiri.', 'In the corner of the photo there is handwriting you recognise. Your own.'),
      L('"JANGAN BUKA PORTAL SENGATA."', '"JANGAN BUKA PORTAL SENGATA." (Don\'t open the Sengata portal.)')],
    tombol: L('Tutup file', 'Close the file')
  });
}

/* Bab 7: the portal glitch */
async function efekGlitch() {
  document.body.classList.add('glitch');
  sfxGlitch(1);
  await tunggu(2800);
  document.body.classList.remove('glitch');
  try { localStorage.setItem('MULTIVERSE_UNLOCKED', 'true'); } catch (e) {}
  S.multiverse = true; simpan(true);
  lore('glitch');
  catat('sistem', { k: 'err500' });
  catat('sistem', 'localStorage: MULTIVERSE_UNLOCKED = true');
  aturScene();
}


/* Bab 9: the golden flashdisk */
const FLASHDISK_SVG = () => `<svg viewBox="0 0 320 150" role="img" aria-label="${L('Flashdisk emas dengan stiker BUKA DI RUMAH', 'A gold flash drive with an OPEN AT HOME sticker')}"><rect width="320" height="150" fill="#2E2A50"/><g transform="rotate(-8 160 75)"><rect x="70" y="52" width="150" height="50" rx="10" fill="#E9C46A"/><rect x="220" y="62" width="34" height="30" rx="3" fill="#AEB6C8"/><rect x="228" y="70" width="8" height="6" fill="#6B7390"/><rect x="240" y="70" width="8" height="6" fill="#6B7390"/><rect x="88" y="62" width="92" height="30" rx="3" fill="#F7F1E3"/><text x="134" y="82" text-anchor="middle" font-family="Patrick Hand, cursive" font-size="14" fill="#3B2618">${L('BUKA DI RUMAH', 'OPEN AT HOME')}</text><circle cx="202" cy="77" r="4" fill="#C8434F"/></g></svg>`;
async function tampilFlashdisk() {
  await dialogCerita({
    judul: L('Flashdisk emas', 'The gold flash drive'), gambar: FLASHDISK_SVG(),
    teks: [L('Flashdisknya kecil dan hangat, seperti baru dicabut dari laptop. Ada stiker tulisan tangan: "BUKA DI RUMAH".', 'The flash drive is small and warm, as if it was just pulled out of a laptop. A handwritten sticker says "OPEN AT HOME".'),
      L('Di dalamnya cuma ada satu file, blueprint-studio.txt. Kamu memutuskan membacanya nanti, setelah pulang.', 'There is only one file inside, blueprint-studio.txt. You decide to read it later, once you are home.')],
    tombol: L('Simpan di saku', 'Put it in your pocket')
  });
}

/* Bab 10: publish, testimonials, and the ending */
const TESTIMONI = [
  { nama: 'Bu Sari', usaha: 'Warung Kopi Senja', teks: 'Papan nama warung saya masih yang kamu bikin. Pelanggan baru selalu bilang, "Websitenya lucu, Bu." Kopinya tetap gratis buat kamu.', en: 'My warung still uses the sign you made. New customers always say, "What a cute website, Bu." Your coffee is still on the house.' },
  { nama: 'Laras', usaha: 'Toko Bunga Laras', usahaEn: 'Laras Flower Shop', teks: 'Pesanan buket naik dua kali lipat, dan formulirnya nggak pernah salah nama lagi 🌷', en: 'Bouquet orders have doubled, and the form never gets a name wrong anymore 🌷' },
  { nama: 'Bima', usaha: 'Ruang Nada', teks: 'Mode gelapnya masih jadi favorit anak-anak band. Jadwal manggung nggak pernah telat tampil.', en: 'The bands still love the dark mode. The gig schedule never shows up late.' },
  { nama: 'Pak Dedi', usaha: 'Laundry Kilat', teks: 'Langganan cucian Mas seumur hidup! Notanya sudah nggak pernah salah hitung.', en: 'Free laundry for life, Mas! The receipts never add up wrong anymore.' },
  { nama: 'Kak Riko', usaha: 'Karang Taruna RT 05', usahaEn: 'RT 05 Youth Group', teks: 'Kata Bu RT: 17-an tahun depan kamu lagi ya! Panjat pinangnya sudah dipesan.', en: 'Bu RT says: you\'re doing next year\'s 17-an too! The greased pole is already booked.' },
  { nama: 'Mas Alif', usaha: 'Kopi Alif', teks: 'Makasih sudah ngajarin saya baca konsol. Sekarang saya bisa benerin error sendiri. Kadang-kadang.', en: 'Thanks for teaching me to read the console. Now I can fix errors myself. Sometimes.' },
  { nama: 'Pak Lurah Hendra', usaha: 'Kelurahan Sengata', usahaEn: 'Sengata Village Office', teks: 'Laporan warga masuk rapi setiap hari. Server kami masih rewel, tapi websitenya tidak pernah panik.', en: 'Citizen reports arrive neatly every day. Our server is still fussy, but the website never panics.' },
  { nama: '{nama} (Timeline B)', usaha: 'Warung Kopi Senja · Timeline B', teks: 'Warung di timeline-ku buka lagi. Kodenya kurawat pakai kacamatamu.', en: 'The warung in my timeline is open again. I look after the code with your glasses.' },
  { nama: '{nama} (Timeline Sukses)', usaha: 'Warung Kopi Senja · 3 Cabang', teks: 'Skor 100. Nggak usah pamer. Oke, pamer dikit 😎', namaEn: '{nama} (Success Timeline)', usahaEn: 'Warung Kopi Senja · 3 Branches', en: 'Score 100. No need to show off. Okay, a little 😎' }
];
/* testimonial i comes from the client of chapter i, so names match the chapter text in both languages */
const tNama = (t, i) => namaKlien(i), tUsaha = (t, i) => usahaKlien(i), tTeks = t => isi(L(t.teks, t.en));
/* Adds the testimonial footer to the player's portfolio (in the ending and in the download) */
function pasangTestimoni(kode, gulir) {
  const kartu = TESTIMONI.map((t, i) => `      <blockquote class="cq-testimoni-kartu"><p>${esc(tTeks(t))}</p><cite>${esc(tNama(t, i))}, ${esc(tUsaha(t, i))}</cite></blockquote>`).join('\n');
  const blok = `
  <!-- ${L('Testimoni klien, ditambahkan setelah situs ini dipublikasikan', 'Client testimonials, added after this site was published')} -->
  <style>
    .cq-testimoni { max-width: 860px; margin: 40px auto 0; padding: 24px; border-top: 2px dashed rgba(127,127,127,.4); font-family: system-ui, sans-serif; }
    .cq-testimoni h2 { margin: 0 0 12px; }
    .cq-testimoni-daftar { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .cq-testimoni-kartu { margin: 0; padding: 14px 16px; border-radius: 10px; background: rgba(233,196,106,.16); }
    .cq-testimoni-kartu p { margin: 0 0 8px; }
    .cq-testimoni-kartu cite { font-size: 14px; opacity: .75; font-style: normal; }
  </style>
  <footer class="cq-testimoni">
    <h2>${L('Kata mereka', 'What they say')}</h2>
    <div class="cq-testimoni-daftar">
${kartu}
    </div>
  </footer>${gulir ? '\n  <script>setTimeout(function () { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }, 1600);<\/script>' : ''}
`;
  return /<\/body>/i.test(kode) ? kode.replace(/<\/body>/i, blok + '</body>') : kode + blok;
}
async function dialogPublish() {
  const d = $('dCerita');
  d.className = 'deploy';
  const domain = isi('{slug}.studio');
  const baris = L(['$ publish studio-saya/', '▸ Memeriksa index.html ... ok', '▸ Memeriksa tautan kontak ... ok', '▸ Mengompres berkas ... ok', `▸ Menyambungkan domain ${domain} ... ok`, '▸ Menyebarkan ke server ... ok', `✓ Online: https://${domain}`],
    ['$ publish my-studio/', '▸ Checking index.html ... ok', '▸ Checking contact links ... ok', '▸ Compressing files ... ok', `▸ Connecting domain ${domain} ... ok`, '▸ Deploying to the server ... ok', `✓ Online: https://${domain}`]);
  d.innerHTML = `<form method="dialog" class="dlg"><h2>${L('Publish ke internet', 'Publish to the internet')}</h2><pre class="log-deploy" aria-live="polite"></pre><div class="baris-tombol"><button class="tombol" value="ok" disabled>${L('Lihat situsku', 'See my site')}</button></div></form>`;
  d.returnValue = '';
  const tutup = new Promise(r => d.addEventListener('close', r, { once: true }));
  d.showModal();
  const pre = d.querySelector('pre'), btn = d.querySelector('button');
  for (const b of baris) { await tunggu(480); if (!d.open) break; pre.textContent += b + '\n'; sfxKetik(); }
  if (d.open) { sfxSukses(); btn.disabled = false; btn.focus(); }
  await tutup;
}
function dialogSitus() {
  return new Promise(resolve => {
    const d = $('dCerita'), domain = isi('{slug}.studio');
    d.className = 'lebar';
    d.innerHTML = `<form method="dialog" class="dlg"><h2>${esc(domain)} ${L('sudah online', 'is online')}</h2>
      <p>${L('Situsmu bisa dibuka siapa saja sekarang. Tidak lama kemudian, pesan-pesan mulai masuk ke kolom testimoni di bagian bawahnya.', 'Anyone can open your site now. Soon, messages start arriving in the testimonials at the bottom.')}</p>
      <div class="situs-akhir"><div class="url">https://${esc(domain)}</div><iframe title="${L('Situsmu yang sudah online', 'Your site, now online')}" sandbox="allow-scripts"></iframe></div>
      <p class="kecil-akhir">${L(`${TESTIMONI.length} testimoni masuk: dari Bu Sari sampai dirimu sendiri di dua timeline lain.`, `${TESTIMONI.length} testimonials came in: from Bu Sari all the way to yourself in two other timelines.`)}</p>
      <div class="baris-tombol"><button class="tombol" value="ok">${L('Lanjut', 'Continue')}</button></div></form>`;
    d.querySelector('iframe').srcdoc = suntik(pasangTestimoni(kodeIni(), true), {});
    d.returnValue = '';
    d.addEventListener('close', () => resolve(), { once: true });
    d.showModal();
    [1.8, 2.5, 3.2].forEach(t => setTimeout(() => { if (d.open) sfxPesan(); }, t * 1000));
  });
}
const STUDIO_AKHIR_SVG = () => `<svg viewBox="0 0 320 190" role="img" aria-label="${L('Pagi di Sengata: studio dengan papan nama di atas Warung Kopi Senja yang buka', 'Morning in Sengata: the studio with its name sign above Warung Kopi Senja, open for business')}"><defs><linearGradient id="fajarAkhir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6B98A"/><stop offset="1" stop-color="#FBE3B8"/></linearGradient></defs><rect width="320" height="190" fill="url(#fajarAkhir)"/><circle cx="252" cy="70" r="22" fill="#FFF1C9"/><circle cx="252" cy="70" r="36" fill="#FFF1C9" opacity=".35"/><path d="M0 140 L24 140 L24 118 L50 118 L50 132 L70 132 L70 110 L96 110 L96 140 L320 140 L320 190 L0 190 Z" fill="#C9869A" opacity=".45"/><rect x="100" y="40" width="120" height="70" fill="#5C5A78"/><rect x="112" y="58" width="42" height="36" fill="#FBE3B8"/><line x1="133" y1="58" x2="133" y2="94" stroke="#7A4E33" stroke-width="3"/><rect x="166" y="58" width="42" height="36" fill="#FBE3B8"/><rect x="104" y="24" width="112" height="20" rx="4" fill="#2B2A33" stroke="#C99A55" stroke-width="2"/><text x="160" y="38" text-anchor="middle" font-family="Patrick Hand, cursive" font-size="12" fill="#F4C979" ${(S.nama || '').length > 8 ? 'textLength="104" lengthAdjust="spacingAndGlyphs"' : ''}>STUDIO ${esc((S.nama || L('KAMU', 'YOU')).toUpperCase())}</text><rect x="90" y="110" width="140" height="52" fill="#8B5A3C"/><path d="M80 114 L240 114 L230 96 L90 96 Z" fill="#D08C8C"/><g fill="#F7F1E3"><path d="M96 96 L106 96 L102 114 L92 114 Z"/><path d="M126 96 L136 96 L132 114 L122 114 Z"/><path d="M156 96 L166 96 L162 114 L152 114 Z"/><path d="M186 96 L196 96 L192 114 L182 114 Z"/><path d="M216 96 L226 96 L222 114 L212 114 Z"/></g><rect x="102" y="124" width="116" height="28" fill="#F4C979"/><text x="160" y="142" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="#3B2618">WARUNG KOPI SENJA · ${L('BUKA', 'OPEN')}</text><rect y="162" width="320" height="28" fill="#9A8A78"/><g fill="none" stroke="#3A4466" stroke-width="1.6" stroke-linecap="round"><path d="M40 60 q5 -5 10 0 q5 -5 10 0"/><path d="M66 48 q4 -4 8 0 q4 -4 8 0"/></g></svg>`;
async function akhirCerita() {
  const my = sesi;
  await dialogSitus();
  if (my !== sesi) return;
  S.akhir = true; S.playlist = true;
  if (!S.punya.includes('papanNama')) S.punya.push('papanNama');
  simpan(true); aturScene();
  await dialogCerita({
    judul: L('Studio Kecil Berdiri', 'A Small Studio Stands'), kelas: 'hangat', gambar: STUDIO_AKHIR_SVG(),
    teks: L([
      'Hujan di Sengata akhirnya reda. Dari jendela studio, kamu bisa melihat atap Warung Kopi Senja. Bu Sari sedang menyapu teras, dan lampu papan namanya masih menyala dari semalam.',
      'Sepuluh proyek: papan nama warung, toko bunga, kafe musik, kalkulator laundry, jadwal 17-an, konsol yang bersih, portal kelurahan, dua timeline, dan akhirnya satu situs dengan namamu sendiri.',
      'Studio Kecil Berdiri · Warung Tetap Buka',
      'CodeQuest, sebuah game oleh Taufiq Sholikhin (khincc). Terima kasih sudah bermain sampai habis.'
    ], [
      'The rain over Sengata has finally stopped. From the studio window you can see the roof of Warung Kopi Senja. Bu Sari is sweeping the terrace, and her sign is still lit from last night.',
      'Ten projects: a warung sign, a flower shop, a music café, a laundry calculator, a 17-an schedule, a clean console, a village portal, two timelines, and finally one site with your own name on it.',
      'A Small Studio Stands · The Warung Stays Open',
      'CodeQuest, a game by Taufiq Sholikhin (khincc). Thank you for playing all the way to the end.'
    ]),
    tombol: L('Lanjut', 'Continue')
  });
  if (my !== sesi) return;
  await dialogCerita({
    judul: L('Terbuka', 'Unlocked'),
    teks: L([
      `Mode Freelance Beneran (New Game+): ulangi semua bab dengan reputasi dan kecoa sejak Bab 1, kos ${rupiah(250000)} di setiap bab, dan bayaran naik 25%. Tabungan, dekorasi, dan keahlianmu ikut. Ada di layar judul dan di Pengaturan.`,
      'Playlist lofi rahasia: semua tema musik diputar bergantian, termasuk "Warung tetap buka". Pilih di Pengaturan, bagian Lagu.',
      'Situsmu bisa diunduh dari Pengaturan, lengkap dengan testimoni klien-klienmu.'
    ], [
      `Real Freelance Mode (New Game+): replay every chapter with reputation and cockroaches from Chapter 1, ${rupiah(250000)} rent in every chapter, and 25% higher pay. Your savings, decorations and skills come with you. Find it on the title screen and in Settings.`,
      'Secret lo-fi playlist: every music theme plays in turn, including "The warung stays open". Pick it in Settings, under Song.',
      'You can download your site from Settings, complete with your clients\' testimonials.'
    ]),
    tombol: L('Kembali ke studio', 'Back to the studio')
  });
  if (my !== sesi) return;
  lore('akhir');
  tombolJudul(); tampil('studio');
}

/* Shared cleanup for a full reset and for New Game+ */
function bersihkanSesi() {
  sesi++;
  sibuk = false;
  clearTimeout(simpanTimer); clearTimeout(segarTimer);
  document.querySelectorAll('dialog[open]').forEach(d => d.close());
  $('mengetik').classList.remove('on');
  $('pratinjau').srcdoc = '';
  memPratinjau = {}; logPratinjau = []; infoPemeriksa = []; errPemeriksa = [];
  clearTimeout(kecoaTimer); document.querySelectorAll('.kecoa').forEach(k => k.remove());
  document.body.classList.remove('glitch', 'glitch-kecil');
  try { localStorage.removeItem('MULTIVERSE_UNLOCKED'); } catch (e) {}
  if (A.ctx) A.beat = 0;
}
async function mulaiNgPlus() {
  const ok = await tanya(L('Mode Freelance Beneran?', 'Real Freelance Mode?'),
    L(`Kamu mengulang dari Bab 1 sebagai freelancer sungguhan: reputasi dan kecoa sejak awal, kos ${rupiah(250000)} di setiap bab, dan bayaran naik 25%. Nama, tabungan, dekorasi, reputasi, dan keahlianmu tetap. Kode dan chat lama dihapus.`,
      `You replay from Chapter 1 as a real freelancer: reputation and cockroaches from the start, ${rupiah(250000)} rent every chapter, and 25% higher pay. Your name, savings, decorations, reputation and skills stay. Old code and chats are deleted.`),
    L('Mulai Mode Freelance', 'Start Freelance Mode'));
  if (!ok) return;
  const lama = S;
  bersihkanSesi();
  S = baru();
  ['nama', 'uang', 'utang', 'punya', 'reputasi', 'keahlian', 'kecoa', 'telurKecoa', 'vol', 'lagu', 'playlist', 'bahasa'].forEach(k => { S[k] = lama[k]; });
  S.ngplus = (lama.ngplus || 0) + 1;
  simpan(true);
  muatUlangUI(); tampil('studio');
  toast(L('Mode Freelance Beneran dimulai. Bu Sari mengirim pesan lagi, dan Bu Kos sudah menunggu di depan pintu.', 'Real Freelance Mode has started. Bu Sari is messaging again, and the landlady is already waiting at the door.'), 8000);
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
  b1.className = 'tombol'; b1.textContent = ada ? L('Lanjutkan', 'Continue') : L('Mulai', 'Start');
  b1.onclick = () => { audioMulai(); if (ada) tampil('studio'); else { $('inNama').value = ''; $('dNama').showModal(); } };
  box.appendChild(b1);
  if (ada && S.akhir) {
    const b3 = document.createElement('button');
    b3.className = 'tombol garis'; b3.textContent = L('Mode Freelance Beneran', 'Real Freelance Mode');
    b3.onclick = () => { audioMulai(); mulaiNgPlus(); };
    box.appendChild(b3);
  }
  if (ada) {
    const b2 = document.createElement('button');
    b2.className = 'tombol garis'; b2.textContent = L('Mulai dari awal', 'Start over');
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
  const ok = await tanya(L('Mulai dari awal?', 'Start over?'), L('Semua progres, tabungan, dekorasi studio, dan kode di semua proyek akan dihapus. Ini tidak bisa dibatalkan.', 'All progress, savings, studio decorations and the code of every project will be deleted. This cannot be undone.'), L('Hapus dan mulai lagi', 'Delete and start again'));
  if (!ok) return;
  bersihkanSesi();
  const vol = S.vol, bahasa = S.bahasa;
  S = baru(); S.vol = vol; S.bahasa = bahasa;
  try { localStorage.removeItem(SIMPAN_KEY); } catch (e) {}
  simpan(true);
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
/*
  Chat lines are saved as references ({ k, v }) instead of finished text, so the whole chat
  can be shown again in the other language. 'bab' points into the chapter data; the others
  are system messages. Plain strings (older saves, technical lines) are shown as they are.
*/
const ambil = (o, jalur) => jalur.reduce((x, k) => (x == null ? x : x[k]), o);
const PESAN = {
  bab: v => isi(ambil(BAB[v.b], v.j)),
  revisi: v => {
    const k = BAB[v.b].klien, reqs = BAB[v.b].tugas[v.t].reqs, a = v.i.map(i => reqs[i].ask);
    return k.revisiBuka + (a.length > 1 ? k.revisiDaftar + '\n' + a.map(x => '• ' + x).join('\n') : a[0] + '.');
  },
  kirimFile: v => L(`${namaKlien(v.b)} mengirim ${v.f.length} file: ${v.f.join(', ')}`, `${namaKlien(v.b)} sent ${v.f.length} file${v.f.length > 1 ? 's' : ''}: ${v.f.join(', ')}`),
  bayar: v => L(`${rupiah(v.n)} masuk ke tabungan`, `${rupiah(v.n)} added to your savings`) + (v.c ? L(`. ${rupiah(v.c)} dipakai mencicil utang ke Ibu${v.u ? ` (sisa ${rupiah(v.u)})` : ', dan utangnya lunas'}.`, `. ${rupiah(v.c)} went to paying Mum back${v.u ? ` (${rupiah(v.u)} left)` : ', and the debt is paid off'}.`) : ''),
  tanpaBayar: v => (BAB[v.b].tanpaBayarTeks ? isi(BAB[v.b].tanpaBayarTeks) : L(`${namaKlien(v.b)} belum bisa membayar. Tercatat: kopi gratis.`, `${namaKlien(v.b)} can't pay yet. Noted: free coffee.`)),
  warna: v => (v.k >= v.n ? L('Foto warung di bingkai kembali berwarna penuh.', 'The photo of the warung in the frame is in full colour again.') : L(`Foto warung di bingkai: warnanya kembali ${v.k} dari ${v.n}.`, `The photo of the warung in the frame: colour is back, ${v.k} of ${v.n}.`)),
  pesananBaru: v => L('Pesanan baru: ', 'New order: ') + BAB[v.b].tugas[v.t].judul,
  kosLunas: v => L(`Kos bulan ini dibayar: ${rupiah(v.n)}`, `Rent paid for this month: ${rupiah(v.n)}`),
  kosIbu: v => L(`Kos dibayar dengan talangan Ibu. Utang ke Ibu: ${rupiah(v.n)}`, `Rent paid with Mum's help. You owe Mum: ${rupiah(v.n)}`),
  hapusB: () => L('Kamu menghapus timeline_b.json.', 'You deleted timeline_b.json.'),
  munculB: () => L('Tiga detik kemudian, timeline_b.json muncul lagi di tempat yang sama. Tanggalnya tidak berubah.', 'Three seconds later, timeline_b.json is back in the same place. The date hasn\'t changed.'),
  biarB: () => L('File dibiarkan. Penampil file tidak bisa membacanya dengan benar. Coba baca lewat kode.', 'You left the file alone. The file viewer can\'t read it properly. Try reading it with code.'),
  err500: () => L('ERROR 500. Laporan ke-7 ditolak server kelurahan.', 'ERROR 500. The village server rejected report #7.')
};
function teksPesan(m) {
  if (m.ref && PESAN[m.ref.k]) { try { const t = PESAN[m.ref.k](m.ref.v || {}); if (typeof t === 'string') return t; } catch (e) {} }
  return m.teks || '';
}
const refBab = (b, ...j) => ({ k: 'bab', v: { b, j } });
/* Older saves stored plain Indonesian text: match it to the chapter data so it can be translated too */
function cariRef(b, teks) {
  const id = BAB_ID[b]; if (!id || typeof teks !== 'string') return null;
  const cocok = (x, ...j) => (typeof x === 'string' && isi(x) === teks ? refBab(b, ...j) : null);
  let r = cocok(id.pembuka, 'pembuka') || cocok(id.klien && id.klien.kirimTeks, 'klien', 'kirimTeks') || cocok(id.klien && id.klien.revisiTutup, 'klien', 'revisiTutup');
  (id.tugas || []).forEach((t, i) => {
    if (r) return;
    (t.pesan || []).forEach((x, n) => { r = r || cocok(x, 'tugas', i, 'pesan', n); });
    (t.sukses || []).forEach((x, n) => { r = r || cocok(x, 'tugas', i, 'sukses', n); });
    r = r || cocok(t.kirimTeks, 'tugas', i, 'kirimTeks');
  });
  return r;
}
function renderChat() {
  $('chat').querySelectorAll('.bubble').forEach(b => b.remove());
  (S.log[S.bab] || []).forEach(m => {
    if (!m.ref && m.teks) { const r = cariRef(S.bab, m.teks); if (r) m.ref = r; }
    bubble(m.dari, teksPesan(m));
  });
}
function catat(dari, isiPesan) {
  const log = S.log[S.bab] || (S.log[S.bab] = []);
  const m = typeof isiPesan === 'string' ? { dari, teks: isiPesan } : { dari, ref: isiPesan };
  m.teks = teksPesan(m);
  log.push(m);
  if (log.length > 150) S.log[S.bab] = log.slice(-150);
  simpan(); bubble(dari, m.teks);
}

let sibuk = false;
/* refs: chat references (see PESAN), shown one by one with a typing indicator */
async function klienBicara(refs) {
  const my = sesi;
  sibuk = true; $('btnKirim').disabled = true;
  for (const r of refs) {
    $('mengetik').classList.add('on'); $('chat').scrollTop = $('chat').scrollHeight;
    await tunggu(Math.min(2600, 700 + teksPesan({ ref: r }).length * 18));
    if (my !== sesi) return false;
    $('mengetik').classList.remove('on');
    catat('klien', r); sfxPesan();
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
  if (!(await klienBicara(t.pesan.map((_, i) => refBab(S.bab, 'tugas', S.tugas, 'pesan', i))))) return;
  if (t.aset && my === sesi) {
    catat('sistem', { k: 'kirimFile', v: { b: S.bab, f: t.aset } });
    sfxFile(); renderAset();
  }
  if (t.pilihan === 'timeline_b' && my === sesi) { await tunggu(600); if (my === sesi) await pilihTimelineB(); }
}

function renderHeader() {
  const k = klien(), n = bab().tugas.length, nama = namaKlien(S.bab), usaha = usahaKlien(S.bab);
  const ng = S.ngplus ? `NG+${S.ngplus > 1 ? S.ngplus : ''} · ` : '';
  $('judulTugas').textContent = babTamat() ? L('Proyek selesai', 'Project complete') : tugasIni().judul;
  $('infoTugas').textContent = babTamat() ? `${ng}${usaha} · ${L(`${n} pesanan selesai`, `${n} orders done`)}` : `${ng}${L(`Bab ${S.bab + 1} · Pesanan ${S.tugas + 1} dari ${n}`, `Chapter ${S.bab + 1} · Order ${S.tugas + 1} of ${n}`)} · ${usaha}`;
  $('chatAvatar').textContent = k.huruf === '@' ? (S.nama || 'K').charAt(0).toUpperCase() : k.huruf;
  $('chatAvatar').style.background = k.warna;
  $('chatNama').textContent = nama;
  $('chatUsaha').textContent = usaha;
  $('stickyJudul').textContent = k.huruf === '@' && S.bab === BAB.length - 1 ? L('Blueprint studio', 'Studio blueprint') : L('Yang diminta ', 'What ') + nama + L('', ' asked for');
  $('btnKirim').textContent = (!babTamat() && tugasIni().tombol) || L('Kirim ke ', 'Send to ') + nama;
  $('urlBar').textContent = isi(k.url);
  /* Bab 8: the photo of the warung in the chat header regains its colour */
  const foto = $('fotoWarung');
  foto.hidden = !bab().warnaKembali;
  if (bab().warnaKembali) { foto.src = ASET_URI['warung-buka.svg']; foto.style.filter = `grayscale(${babTamat() ? 0 : (1 - S.tugas / n).toFixed(3)})`; }
  $('btnKirim').disabled = babTamat() || sibuk;
}

function renderAset() {
  const box = $('aset'), list = asetTersedia().filter(f => !(bab().asetAwal || []).includes(f));
  box.innerHTML = list.map(f => `<button class="chip" data-f="${esc(f)}" title="${L('Buka', 'Open')} ${esc(f)}">${ASET_URI[f] ? `<img src="${ASET_URI[f]}" alt="">` : '<span class="ikon-file">{ }</span>'}${esc(f)}</button>`).join('');
  box.querySelectorAll('.chip').forEach(b => b.onclick = () => bukaFile(b.dataset.f));
}
function bukaFile(f) {
  const box = $('isiFile');
  const rusak = ASET_RUSAK.includes(f);
  const teks = rusak ? asetTeks(f).replace(/[A-Za-z0-9]/g, (c, i) => ((i * 7) % 3 === 0 ? '▓' : (i * 5) % 7 === 0 ? '░' : c)) : asetTeks(f) || '';
  const isiFile = ASET_URI[f] ? `<img src="${ASET_URI[f]}" alt="${L('Pratinjau', 'Preview of')} ${esc(f)}">` : `<pre class="${rusak ? 'rusak' : ''}">${esc(teks)}</pre>`;
  const kb = ASET_UKURAN[f], ukuran = kb ? ` ${L('Ukuran', 'Size')}: <b>${kb >= 1000 ? (kb / 1000).toLocaleString(L('id-ID', 'en-US'), { maximumFractionDigits: 1 }) + ' MB' : kb + ' KB'}</b>.` : '';
  box.innerHTML = `<h2>${esc(f)}</h2><p>${rusak ? L('Penampil file tidak bisa membaca isinya dengan benar. Coba baca lewat kode.', 'The file viewer can\'t read this properly. Try reading it with code.') : L(`File dari ${esc(namaKlien(S.bab))}. Pakai nama file ini persis seperti tertulis.`, `A file from ${esc(namaKlien(S.bab))}. Use this file name exactly as written.`) + ukuran}</p>
    <div class="pratinjau-file">${isiFile}</div>
    <div class="baris-tombol"><button class="tombol garis" id="btnTutupFile">${L('Tutup', 'Close')}</button><button class="tombol" id="btnSisipFile">${L('Sisipkan nama file', 'Insert file name')}</button></div>`;
  box.querySelector('#btnTutupFile').onclick = () => $('dFile').close();
  box.querySelector('#btnSisipFile').onclick = () => { $('dFile').close(); pilihTab('p-kode'); ta.focus(); sisip(f); };
  $('dFile').showModal();
}

let hasilTerakhir = [];
function renderCeklis(hasil) {
  const ul = $('ceklis');
  if (babTamat()) { ul.innerHTML = `<li class="ok"><span class="cek">✓</span><span>${L('Semua pesanan selesai. Terima kasih!', 'All orders done. Thank you!')}</span></li>`; return; }
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
  if (e.key === '>' && S.punya.includes('laptopBaru') && ta.selectionStart === ta.selectionEnd) {
    const sebelum = ta.value.slice(0, ta.selectionStart);
    const m = sebelum.match(/<([a-zA-Z][\w-]*)(\s[^<>]*)?$/);
    if (m && !/^(br|img|meta|link|input|hr|source|area|col|wbr|base|embed|track)$/i.test(m[1]) && !/\/$/.test(m[2] || '')) {
      e.preventDefault();
      const pos = ta.selectionStart;
      ta.setRangeText('></' + m[1] + '>', pos, pos, 'start');
      ta.selectionStart = ta.selectionEnd = pos + 1;
      ta.dispatchEvent(new Event('input'));
      return;
    }
  }
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
  It captures errors and console output, silences blocking dialogs, and simulates
  the browser services a real site would use:
    - fetch():        serves the files the client sent (for example jadwal.json).
                      POST requests go to small fake APIs defined per chapter (see BAB[].api).
                      In the "offline" pass every request fails, like a dead connection.
    - localStorage:   an in-memory store. The checker's "ulang" (reopen) pass starts
                      with whatever the normal pass saved, so "remember my choice" can be tested.
    - console:        log/warn/error are recorded so the game console can show them.
    - Date:           a chapter can freeze "now" to a story date (for countdowns).
    - YouTube:        embedded players are replaced by an offline placeholder, so no
                      network request or tracking happens while playing.
*/
const SHIM = function (cfg) {
  var w = window, has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  w.__errs = []; w.__logs = []; w.__req = []; w.__pass = cfg.pass;
  var kirimInduk = function (pesan) { if (cfg.preview) try { parent.postMessage(pesan, '*'); } catch (e) {} };
  w.onerror = function (m) { w.__errs.push(String(m)); kirimInduk({ __cq: 'log', jenis: 'error', teks: String(m) }); };
  w.addEventListener('unhandledrejection', function (e) {
    var r = e.reason, t = 'Uncaught (in promise) ' + (r && r.message ? r.message : r);
    w.__errs.push(t); kirimInduk({ __cq: 'log', jenis: 'error', teks: t });
  });
  w.alert = function () {}; w.confirm = function () { return true; }; w.prompt = function () { return ''; };
  w.addEventListener('submit', function (e) { w.__cegah = e.defaultPrevented; });

  /* console */
  var jadiTeks = function (v) {
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  };
  ['log', 'info', 'warn', 'error'].forEach(function (jenis) {
    var asli = console[jenis] ? console[jenis].bind(console) : function () {};
    console[jenis] = function () {
      var args = Array.prototype.slice.call(arguments);
      var teks = args.map(jadiTeks).join(' ');
      w.__logs.push({ jenis: jenis, teks: teks, args: args });
      kirimInduk({ __cq: 'log', jenis: jenis, teks: teks });
      asli.apply(null, args);
    };
  });

  /* localStorage */
  var mem = {}; for (var k in cfg.seed) mem[k] = String(cfg.seed[k]);
  w.__mem = mem;
  var lapor = function () { kirimInduk({ __cq: 'mem', mem: mem }); };
  var store = {
    getItem: function (k) { return has(mem, k) ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); lapor(); },
    removeItem: function (k) { delete mem[k]; lapor(); },
    clear: function () { for (var k in mem) delete mem[k]; lapor(); },
    key: function (i) { var ks = Object.keys(mem); return i < ks.length ? ks[i] : null; }
  };
  Object.defineProperty(store, 'length', { get: function () { return Object.keys(mem).length; } });
  try { Object.defineProperty(w, 'localStorage', { value: store, configurable: true }); } catch (e) {}

  /* Date frozen to the story's "now" */
  if (cfg.waktu) {
    var D = Date, t0 = new D(cfg.waktu[0], cfg.waktu[1], cfg.waktu[2], cfg.waktu[3] || 0, cfg.waktu[4] || 0).getTime(), mulai = D.now();
    var sekarang = function () { return t0 + (D.now() - mulai); };
    var Palsu = function () {
      var a = Array.prototype.slice.call(arguments);
      if (!(this instanceof Palsu)) return new D(sekarang()).toString();
      return a.length ? new (Function.prototype.bind.apply(D, [null].concat(a)))() : new D(sekarang());
    };
    Palsu.prototype = D.prototype; Palsu.now = sekarang; Palsu.parse = D.parse; Palsu.UTC = D.UTC;
    w.Date = Palsu;
  }

  /* fetch */
  var hitungApi = {};
  var balas = function (isi, status, tipe) {
    return new Response(isi, { status: status, statusText: status === 200 ? 'OK' : status === 404 ? 'Not Found' : 'Internal Server Error', headers: { 'Content-Type': tipe || 'application/json' } });
  };
  w.fetch = function (url, opsi) {
    var nama = String(url && url.url || url).split('?')[0].replace(/^\.?\//, '');
    var metode = String((opsi && opsi.method) || 'GET').toUpperCase();
    w.__req.push({ url: nama, metode: metode, body: opsi && opsi.body });
    return new Promise(function (ok, gagal) {
      setTimeout(function () {
        if (cfg.pass === 'offline') return gagal(new TypeError('Failed to fetch'));
        if (has(cfg.api, nama)) {
          var api = cfg.api[nama];
          if (api.metode && api.metode !== metode) return ok(balas('{"error":"Method Not Allowed"}', 405));
          hitungApi[nama] = (hitungApi[nama] || 0) + 1;
          if (api.gagalKe && hitungApi[nama] === api.gagalKe) return ok(balas('{"error":"Internal Server Error"}', 500));
          return ok(balas(JSON.stringify({ ok: true, id: 100 + hitungApi[nama] }), 200));
        }
        if (has(cfg.files, nama)) ok(balas(cfg.files[nama], 200));
        else ok(balas('Not found', 404, 'text/plain'));
      }, 30);
    });
  };

  /* YouTube placeholder */
  var ganti = function (f) {
    if (!f || f.tagName !== 'IFRAME' || f.hasAttribute('srcdoc')) return;
    var src = f.getAttribute('src') || '';
    if (!/youtu/.test(src)) return;
    f.setAttribute('srcdoc', '<body style="margin:0;display:grid;place-items:center;height:100vh;background:#111;color:#eee;font:14px system-ui;text-align:center">' +
      '<div><div style="font-size:44px">&#9654;</div>Video YouTube<br><small style="opacity:.6">' + src.replace(/[<>"&]/g, '') + '</small></div></body>');
  };
  new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === 'attributes') ganti(m.target);
      m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        ganti(n);
        n.querySelectorAll && Array.prototype.forEach.call(n.querySelectorAll('iframe'), ganti);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
}.toString();

function penangkap(opsi) {
  const files = {};
  asetTersedia().forEach(f => { if (ASET_TEKS[f]) files[f] = asetTeks(f); });
  const cfg = JSON.stringify({ pass: opsi.pass || 'normal', seed: opsi.seed || {}, files, api: bab().api || {}, waktu: bab().waktu || null, preview: !!opsi.preview }).replace(/</g, '\\u003c');
  return '<script data-cq>(' + SHIM + ')(' + cfg + ');<\/script>' +
    (opsi.checker ? '<style data-cq>*,*::before,*::after{transition:none!important;animation:none!important}</style>' : '');
}
/* Text assets may be functions (content that depends on the current date). */
const asetTeks = f => (typeof ASET_TEKS[f] === 'function' ? ASET_TEKS[f]() : ASET_TEKS[f]);
function suntikAset(code, semua) {
  const ada = semua ? Object.keys(ASET_URI) : asetTersedia();
  return code.replace(/(["'(`])\s*(?:\.\/)?([a-z0-9-]+\.(?:svg|jpg|webp|png))\s*(["')`])/g, (m, a, f, b) => (ada.includes(f) && ASET_URI[f] ? a + ASET_URI[f] + b : m));
}
function sisipKepala(code, tambahan) {
  if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, m => m + tambahan);
  if (/<!doctype[^>]*>/i.test(code)) return code.replace(/<!doctype[^>]*>/i, m => m + tambahan);
  return tambahan + code;
}
function suntik(code, opsi = {}) { return sisipKepala(suntikAset(code), penangkap(opsi)); }

/* The preview keeps its own localStorage between edits, like a real browser tab would,
   and streams its console output to the game console. */
let memPratinjau = {};
let logPratinjau = [];
window.addEventListener('message', e => {
  if (e.source !== $('pratinjau').contentWindow || !e.data) return;
  if (e.data.__cq === 'mem') memPratinjau = Object.assign({}, e.data.mem);
  if (e.data.__cq === 'log') { logPratinjau.push({ jenis: e.data.jenis, teks: String(e.data.teks).slice(0, 4000) }); if (logPratinjau.length > 60) logPratinjau.shift(); renderKonsol(); }
});
const seedTugas = () => (babTamat() ? {} : Object.assign({}, tugasIni().seed || {}));

let segarTimer;
function segarkan(jeda = 500) {
  clearTimeout(segarTimer);
  segarTimer = setTimeout(() => {
    logPratinjau = []; renderKonsol();
    $('pratinjau').srcdoc = suntik(kodeIni(), { preview: true, seed: Object.assign(seedTugas(), memPratinjau) });
    periksa();
  }, jeda);
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

/* Game console: errors found by the checker first, then live output from the preview. */
let errPemeriksa = [], infoPemeriksa = [];
function renderKonsol() {
  const k = $('konsol');
  const baris = infoPemeriksa.map(t => ({ jenis: 'info', teks: t })).concat(errPemeriksa.map(t => ({ jenis: 'error', teks: t })))
    .concat(logPratinjau.filter(l => !(l.jenis === 'error' && errPemeriksa.includes(l.teks))));
  if (!baris.length) { k.textContent = L('Konsol: tidak ada error.', 'Console: no errors.'); k.classList.remove('err'); return; }
  k.innerHTML = baris.slice(-8).map(l => `<div class="log-${l.jenis}">${l.jenis === 'error' ? '✖ ' : l.jenis === 'warn' ? '⚠ ' : '› '}${esc(l.teks)}</div>`).join('');
  k.classList.toggle('err', errPemeriksa.length > 0);
  k.scrollTop = k.scrollHeight;
}
function tampilKonsol(errs, info = []) { errPemeriksa = errs.slice(0, 3); infoPemeriksa = info; renderKonsol(); }
/* Kacamata Anti-Spaghetti (Bab 8 gift): points out near-identical lines */
function kacamata(src) {
  const hit = {};
  src.split('\n').map(x => x.trim()).filter(x => x.length >= 30)
    .forEach(x => { const k = x.replace(/>[^<]*</g, '><').replace(/\d+/g, '#'); hit[k] = (hit[k] || 0) + 1; });
  const n = Object.values(hit).filter(v => v >= 3).reduce((a, v) => a + v, 0);
  return n ? L(`👓 Kacamata Anti-Spaghetti: ada ${n} baris yang hampir kembar. Mungkin bisa dijadikan satu fungsi.`, `👓 Anti-Spaghetti Glasses: ${n} lines are nearly identical. Maybe they could become one function.`) : '';
}

/*
  Requirements can run in up to three passes:
    normal   the page as a visitor sees it (with the task's seed storage, if any)
    ulang    the page reopened, with the storage saved during the normal pass
    offline  the page with every fetch() failing
  A test may return a Promise (for pages that wait on fetch or timers).
*/
const BATAS_TES = 5000;
const jalankanTes = (fn, args) => Promise.race([
  Promise.resolve().then(() => fn(...args)).then(v => !!v, () => false),
  tunggu(BATAS_TES).then(() => false)
]);
let jalan = 0, janjiTerakhir = null;
function periksa() {
  const my = ++jalan;
  const p = (async () => {
    const src = kodeIni();
    const reqs = babTamat() ? [] : tugasIni().reqs;
    const hasil = reqs.map(() => false);
    let seed = seedTugas(), errsNormal = [], info = [];
    for (const pass of ['normal', 'ulang', 'offline']) {
      const idx = reqs.map((r, i) => ((r.pass || 'normal') === pass ? i : -1)).filter(i => i >= 0);
      if (pass !== 'normal' && idx.length === 0) continue;
      const fr = await muatPemeriksa(suntik(src, { checker: true, pass, seed: pass === 'offline' ? seedTugas() : seed }));
      if (my !== jalan) { fr.remove(); return janjiTerakhir; }
      const w = fr.contentWindow, d = fr.contentDocument;
      if (w && d) {
        if (pass === 'normal') {
          errsNormal = (w.__errs || []).slice();
          if (bab().laporan) { try { info = bab().laporan(d, w, src); } catch (e) { info = []; } }
          if (S.punya.includes('kacamata')) { const kc = kacamata(src); if (kc) info.push(kc); }
        }
        for (const i of idx) {
          hasil[i] = await jalankanTes(reqs[i].test, [d, w, src]);
          if (my !== jalan) { fr.remove(); return janjiTerakhir; }
        }
        if (pass === 'normal') seed = w.__snapshot || Object.assign({}, w.__mem || {});
      }
      fr.remove();
    }
    if (my !== jalan) return janjiTerakhir;
    tampilKonsol(errsNormal, info);
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
  const t = tugasIni();
  catat('saya', t.kirimTeks ? refBab(S.bab, 'tugas', S.tugas, 'kirimTeks') : refBab(S.bab, 'klien', 'kirimTeks')); sfxKirim();
  const hasil = await periksa();
  if (my !== sesi) return;
  const kurang = t.reqs.filter((r, i) => !hasil[i] && !(r.kecuali !== undefined && !hasil[r.kecuali]));
  await tunggu(600);
  if (my !== sesi) return;
  sibuk = false;
  if (kurang.length) {
    S.revisi[S.bab] = (S.revisi[S.bab] || 0) + 1;
    const idx = kurang.map(r => t.reqs.indexOf(r));
    if (await klienBicara([{ k: 'revisi', v: { b: S.bab, t: S.tugas, i: idx } }, refBab(S.bab, 'klien', 'revisiTutup')])) sfxRevisi();
    return;
  }
  if (t.glitch) { await efekGlitch(); if (my !== sesi) return; }
  else sfxSukses();
  if (!(await klienBicara(t.sukses.map((_, i) => refBab(S.bab, 'tugas', S.tugas, 'sukses', i))))) return;
  sibuk = true; $('btnKirim').disabled = true;
  if (t.setelah === 'fotoTimeline') { await tampilFotoTimeline(); if (my !== sesi) return; }
  if (t.setelah === 'flashdisk') { await tampilFlashdisk(); if (my !== sesi) return; }
  if (t.setelah === 'publish') { await dialogPublish(); if (my !== sesi) return; }
  const bayar = bayaranTugas(S.bab, t);
  (S.dibayar[S.bab] = S.dibayar[S.bab] || [])[S.tugas] = bayar;
  if (bayar > 0) {
    let cicil = 0;
    if (S.utang > 0) { cicil = Math.min(S.utang, Math.round(bayar * 0.5 / 1000) * 1000); S.utang -= cicil; }
    S.uang += bayar - cicil;
    catat('sistem', { k: 'bayar', v: { n: bayar, c: cicil, u: S.utang } });
    sfxKoin();
  } else {
    catat('sistem', { k: 'tanpaBayar', v: { b: S.bab } });
  }
  if (bab().warnaKembali) {
    const n = bab().tugas.length, k = S.tugas + 1;
    catat('sistem', { k: 'warna', v: { k, n } });
  }
  if (S.tugas + 1 >= bab().tugas.length) {
    S.tamat.push(S.bab); sibuk = false;
    const h = bab().hadiah;
    if (h && !S.punya.includes(h.id)) S.punya.push(h.id);
    const r = bab().reputasi;
    if (r) {
      const sebelum = S.reputasi, banyakRevisi = (S.revisi[S.bab] || 0) > bab().tugas.length;
      S.reputasi = Math.min(5, Math.max(1, sebelum + (r.plus || 0) - (r.minus || 0) - (banyakRevisi ? 1 : 0)));
      S.repBab[S.bab] = { sebelum, sesudah: S.reputasi, banyakRevisi };
    }
    if (bab().keahlian && !S.keahlian.includes(bab().keahlian)) S.keahlian.push(bab().keahlian);
    simpan(true); renderHeader(); aturScene(); renderCeklis([]);
    await tunggu(900);
    if (my !== sesi) return;
    if (bab().akhir) { await akhirCerita(); return; }
    tampilSelesai(S.bab);
    return;
  }
  S.tugas++;
  simpan(true); renderHeader(); aturScene(); renderCeklis([]);
  await tunggu(1400);
  if (my !== sesi) return;
  catat('sistem', { k: 'pesananBaru', v: { b: S.bab, t: S.tugas } });
  segarkan(0);
  perkenalanTugas();
}

function mulaiBab(b) {
  S.bab = b; S.tugas = 0; S.intro = -1; memPratinjau = {}; logPratinjau = [];
  if (typeof S.kode[b] !== 'string') S.kode[b] = BAB[b].starter;
  if (!Array.isArray(S.log[b])) S.log[b] = [];
  simpan(true);
  muatUlangUI();
  if (BAB[b].pembuka && S.log[b].length === 0) catat('sistem', refBab(b, 'pembuka'));
}

function muatUlangUI() {
  ta.value = kodeIni(); sorot();
  renderChat(); renderHeader(); renderCeklis([]); renderAset();
  tombolJudul(); aturScene(); renderReputasi(); renderKonsol();
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
  if (BAB[b].akhir && S.tamat.includes(b)) kode = pasangTestimoni(kode);
  const dataBab = BAB[b].tugas.flatMap(t => t.aset || []).filter(f => ASET_TEKS[f]);
  if (dataBab.length && /fetch\s*\(/.test(kode)) kode = sisipKepala(kode, '\n  <!-- ' + L('Data dari klien disertakan di sini supaya halaman bisa dibuka tanpa server.', 'Client data is included here so the page opens without a server.') + ' -->\n  <script>(' + SHIM_UNDUH + ')(' + JSON.stringify(Object.fromEntries(dataBab.map(f => [f, asetTeks(f)]))).replace(/</g, '\\u003c') + ');<\/script>');
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
    <h3>${L('Contoh', 'Example')}</h3><pre>${esc(isi(c.contoh))}</pre>
    <h3>${L('Petunjuk', 'Hints')}</h3>
    <div id="petunjukBox"></div>
    <div class="baris-tombol"><button class="tombol garis" id="btnPetunjuk">${L('Lihat petunjuk', 'Show a hint')}</button><button class="tombol" id="btnTutupCatatan">${L('Kembali ke kode', 'Back to the code')}</button></div>`;
  let lvl = 0;
  const pb = box.querySelector('#petunjukBox'), bp = box.querySelector('#btnPetunjuk');
  pb.innerHTML = `<p style="color:#5b5e70">${L('Coba dulu sendiri. Kalau buntu, buka petunjuk satu per satu.', 'Try it yourself first. If you get stuck, open the hints one at a time.')}</p>`;
  bp.onclick = () => {
    if (lvl === 0) { pb.innerHTML = `<p class="petunjuk">${esc(isi(c.petunjuk[0]))}</p>`; bp.textContent = L('Tunjukkan kodenya', 'Show the code'); }
    else { pb.innerHTML = `<p class="petunjuk">${esc(isi(c.petunjuk[0]))}</p><pre>${esc(isi(c.petunjuk[1]))}</pre>`; bp.remove(); }
    lvl++;
  };
  box.querySelector('#btnTutupCatatan').onclick = () => $('dCatatan').close();
  if (!$('dCatatan').open) $('dCatatan').showModal();
}

function bukaToko() {
  const box = $('isiToko');
  box.innerHTML = `<h2>${L('Toko kecil', 'Little shop')}</h2><p>${L('Tabungan', 'Savings')}: <b>${rupiah(S.uang)}</b></p>
    <ul class="toko">${ITEMS.map(it => {
      const punya = S.punya.includes(it.id);
      return `<li><div><div class="nama">${esc(L(it.nama, it.en[0]))}</div><div class="ket">${esc(L(it.ket, it.en[1]))}</div></div>
        <div class="harga">${punya ? '' : rupiah(it.harga)}</div>
        <button class="tombol ${punya ? 'garis' : ''}" data-beli="${it.id}" ${punya || S.uang < it.harga ? 'disabled' : ''}>${punya ? L('Sudah ada', 'Owned') : L('Beli', 'Buy')}</button></li>`;
    }).join('')}</ul>
    <div class="baris-tombol"><button class="tombol garis" id="btnTutupToko">${L('Tutup', 'Close')}</button></div>`;
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
  const porto = S.tamat.slice().sort((a, b) => a - b).map(b => `<li><span>${esc(usahaKlien(b))}</span><button class="tombol garis" data-unduh="${b}">${L('Unduh', 'Download')}</button></li>`).join('');
  box.innerHTML = `<h2>${L('Pengaturan', 'Settings')}</h2>
    <label>${L('Bahasa', 'Language')} <select id="pilihBahasa">
      <option value="id" ${S.bahasa === 'id' ? 'selected' : ''}>Bahasa Indonesia</option>
      <option value="en" ${S.bahasa === 'en' ? 'selected' : ''}>English</option>
    </select></label>
    <label>${L('Musik', 'Music')} <input type="range" min="0" max="1" step="0.05" data-v="musik" value="${S.vol.musik}"></label>
    <label>${L('Suasana', 'Ambience')} <input type="range" min="0" max="1" step="0.05" data-v="hujan" value="${S.vol.hujan}"></label>
    <label>${L('Efek', 'Effects')} <input type="range" min="0" max="1" step="0.05" data-v="efek" value="${S.vol.efek}"></label>
    <label>${L('Lagu', 'Song')} <select id="pilihLagu" ${punyaPiringan || S.playlist ? '' : 'disabled'}>
      <option value="1" ${S.lagu === 1 ? 'selected' : ''}>${L('Tema bab', 'Chapter theme')}: ${L(TEMA_MUSIK[temaBab()].nama, TEMA_MUSIK[temaBab()].en)}</option>
      <option value="2" ${S.lagu === 2 ? 'selected' : ''} ${punyaPiringan ? '' : 'disabled'}>${punyaPiringan ? L('Piringan: hujan larut', 'Record: late-night rain') : L('Butuh pemutar piringan', 'Needs the record player')}</option>
      ${S.playlist ? `<option value="3" ${S.lagu === 3 ? 'selected' : ''}>${L('Playlist lofi rahasia (semua tema bergantian)', 'Secret lo-fi playlist (every theme in turn)')}</option>` : ''}
    </select></label>
    ${pakaiReputasi(S.bab) || S.tamat.includes(2) ? `<h3>${L('Status freelancer', 'Freelancer status')}</h3>
    <ul class="porto">
      <li><span>${L('Reputasi', 'Reputation')}</span><span class="bintang" aria-label="${L(`${S.reputasi} dari 5 bintang`, `${S.reputasi} of 5 stars`)}">${bintang(S.reputasi)}</span></li>
      <li><span>${L('Pengali bayaran', 'Pay multiplier')}</span><span>×${PENGALI[S.reputasi]}</span></li>
      <li><span>${L('Utang ke Ibu', 'Owed to Mum')}</span><span>${S.utang ? rupiah(S.utang) : L('Tidak ada', 'Nothing')}</span></li>
      <li><span>${L('Kecoa tertangkap', 'Cockroaches caught')}</span><span>${S.kecoa}</span></li>
      ${S.ngplus ? `<li><span>${L('Mode', 'Mode')}</span><span>${L('Freelance Beneran', 'Real Freelance')} (NG+${S.ngplus > 1 ? S.ngplus : ''})</span></li>` : ''}
      ${S.keahlian.length ? `<li><span>${L('Keahlian', 'Skills')}</span><span>${S.keahlian.map(k => esc(namaKeahlian(k))).join(', ')}</span></li>` : ''}
    </ul>` : ''}
    <h3>${L('Portofolio', 'Portfolio')}</h3>
    ${porto ? `<ul class="porto">${porto}</ul>` : `<p style="color:#5b5e70">${L('Website yang sudah selesai akan muncul di sini dan bisa diunduh.', 'Finished websites appear here and can be downloaded.')}</p>`}
    <div class="baris-tombol"><button class="tombol garis" id="btnUlang">${L('Mulai dari awal', 'Start over')}</button>${S.akhir ? `<button class="tombol garis" id="btnNg">${L('Mode Freelance Beneran', 'Real Freelance Mode')}</button>` : ''}<button class="tombol" id="btnTutupAtur">${L('Selesai', 'Done')}</button></div>`;
  box.querySelectorAll('[data-v]').forEach(r => r.oninput = () => { S.vol[r.dataset.v] = +r.value; aturVolume(); simpan(); });
  box.querySelectorAll('[data-unduh]').forEach(b => b.onclick = () => unduh(+b.dataset.unduh));
  box.querySelector('#pilihLagu').onchange = e => { S.lagu = +e.target.value; if (A.ctx) { A.beat = 0; A.putarSampai = A.ctx.currentTime + 45; } aturScene(); simpan(); };
  box.querySelector('#btnUlang').onclick = () => { $('dAtur').close(); ulangDariAwal(); };
  if (S.akhir) box.querySelector('#btnNg').onclick = () => { $('dAtur').close(); mulaiNgPlus(); };
  box.querySelector('#btnTutupAtur').onclick = () => $('dAtur').close();
  box.querySelector('#pilihBahasa').onchange = e => aturBahasa(e.target.value);
  if (!$('dAtur').open) $('dAtur').showModal();
}

let selesaiTerbuka = -1;
function tampilSelesai(b) {
  const ch = BAB[b], box = $('isiSelesai');
  const dibayar = ch.tugas.map((t, i) => ((S.dibayar[b] || [])[i] ?? t.bayar));
  const total = dibayar.reduce((a, n) => a + n, 0);
  const lanjut = b + 1 < BAB.length
    ? isi(BAB[b + 1].pengantar || L(`Ada pesan baru di ponselmu: ${namaKlien(b + 1)} dari ${usahaKlien(b + 1)} ingin bekerja sama.`, `A new message on your phone: ${namaKlien(b + 1)} from ${usahaKlien(b + 1)} wants to work with you.`))
    : L('Semua website yang sudah selesai bisa diunduh lagi dari Pengaturan.', 'Every finished website can be downloaded again from Settings.');
  const rb = S.repBab[b], r = ch.reputasi;
  const teksRep = rb ? `${L('Reputasi', 'Reputation')}: ${bintang(rb.sebelum)} → ${bintang(rb.sesudah)}.` +
    (r.minus ? L(` Naik ${r.plus}, tapi turun ${r.minus} karena ${r.alasan}.`, ` Up ${r.plus}, but down ${r.minus} because ${r.alasan}.`) : r.plus ? L(` Naik ${r.plus}.`, ` Up ${r.plus}.`) : L(' Tidak berubah.', ' Unchanged.')) +
    (rb.banyakRevisi ? L(' Turun 1 lagi karena revisinya banyak.', ' Down 1 more because of the many revisions.') : '') + (rb.sesudah === 5 && rb.sebelum + (r.plus || 0) - (r.minus || 0) > 5 ? L(' (Sudah maksimal.)', ' (Already at the maximum.)') : '') : '';
  box.innerHTML = `<h2>${esc(isi(ch.penutup.judul))}</h2>
    <p>${esc(isi(ch.penutup.teks))}</p>
    <div class="invoice">${ch.tugas.map((t, i) => `<div><span>${esc(t.judul)}</span><span>${rupiah(dibayar[i])}</span></div>`).join('')}
      <div class="total"><span>${L('Total dibayar', 'Total paid')}</span><span>${rupiah(total)}</span></div></div>
    <p>${L(`Revisi selama proyek: ${S.revisi[b] || 0}. Klien sungguhan juga minta revisi, dan itu bagian normal dari pekerjaan.`, `Revisions during the project: ${S.revisi[b] || 0}. Real clients ask for revisions too, and that's a normal part of the job.`)}</p>
    ${teksRep ? `<p>${esc(teksRep)}</p>` : ''}
    ${ch.hadiah ? `<p>${esc(isi(ch.hadiah.teks))}</p>` : ''}
    ${ch.unlock ? `<p><b>${L('Terbuka', 'Unlocked')}:</b> ${ch.unlock.map(esc).join(', ')}.</p>` : ''}
    <p>${esc(lanjut)}</p>
    <div class="baris-tombol"><button class="tombol garis" id="btnUnduh">${L('Unduh website', 'Download website')}</button><button class="tombol" id="btnKeStudio">${L('Kembali ke studio', 'Back to the studio')}</button></div>`;
  box.querySelector('#btnUnduh').onclick = () => unduh(b);
  box.querySelector('#btnKeStudio').onclick = () => { $('dSelesai').close(); tampil('studio'); };
  selesaiTerbuka = b;
  if (!$('dSelesai').open) $('dSelesai').showModal();
}

/* ---- wiring ---- */
function aktifkan(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
}
async function bukaKerja() {
  audioMulai();
  if (adaBabBaru()) mulaiBab(S.bab + 1);
  tampil('work'); renderHeader(); renderAset(); pilihTab('p-pesan');
  if (sewaBab(S.bab) && !S.sewaLunas.includes(S.bab) && !babTamat()) await bayarKos(S.bab);
  perkenalanTugas();
  jadwalKecoa(true);
}
aktifkan($('hs-laptop'), bukaKerja);
aktifkan($('hs-hp'), bukaKerja);
aktifkan($('hs-rak'), bukaToko);
aktifkan($('hs-kucing'), () => { audioMulai(); sfxDengkur(); $('bisikan').textContent = L('Mochi mendengkur pelan.', 'Mochi purrs softly.'); });
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

/* ---- language switch ---- */
/* Static text in index.html carries its English version in data-en (and data-en-<attribute>) */
const ATRIBUT_TERJEMAH = ['aria-label', 'placeholder', 'title', 'alt'];
function terapkanStatis() {
  const en = S.bahasa === 'en';
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.hasAttribute('data-id')) el.setAttribute('data-id', el.innerHTML);
    el.innerHTML = en ? el.getAttribute('data-en') : el.getAttribute('data-id');
  });
  ATRIBUT_TERJEMAH.forEach(a => document.querySelectorAll(`[data-en-${a}]`).forEach(el => {
    if (!el.hasAttribute(`data-id-${a}`)) el.setAttribute(`data-id-${a}`, el.getAttribute(a) || '');
    el.setAttribute(a, el.getAttribute(en ? `data-en-${a}` : `data-id-${a}`));
  }));
  document.querySelectorAll('.pilih-bahasa [data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === S.bahasa)));
  document.documentElement.lang = S.bahasa;
  document.title = L('CodeQuest — Studio Kecil', 'CodeQuest — Small Studio');
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', L('Game santai berbahasa Indonesia: jadi web developer freelance, kerjakan pesanan klien sungguhan, dan belajar HTML, CSS, dan JavaScript sambil menata studio kecilmu.',
    'A cozy game about being a freelance web developer: take real client orders and learn HTML, CSS and JavaScript while you decorate your small studio.'));
}
/* Switches every part of the game to `lang` ('id' or 'en') without reloading. */
function aturBahasa(lang, awal) {
  if (!['id', 'en'].includes(lang)) return;
  S.bahasa = lang;
  BAB.forEach((ch, b) => tempel(ch, teksBab(b, lang)));
  /* starter code nobody has edited yet follows the language */
  const lain = lang === 'en' ? 'id' : 'en';
  BAB.forEach((ch, b) => { const s0 = teksBab(b, lain).starter; if (s0 && S.kode[b] === s0) S.kode[b] = ch.starter; });
  terapkanStatis();
  if (awal) return;
  simpan(true);
  muatUlangUI(); segarkan(0);
  if ($('dAtur').open) bukaAtur();
  if ($('dToko').open) bukaToko();
  if ($('dCatatan').open) bukaCatatan();
  if ($('dSelesai').open && selesaiTerbuka >= 0) tampilSelesai(selesaiTerbuka);
  if ($('dFile').open) $('dFile').close();
}
document.querySelectorAll('.pilih-bahasa [data-lang]').forEach(b => b.onclick = () => aturBahasa(b.dataset.lang));

/* ---- init ---- */
aturBahasa(S.bahasa, true);
buatHujanVisual();
aturJam(); setInterval(aturJam, 30000);
if (S.akhir) lore('akhir'); else if (S.multiverse && S.bab <= 8) lore('retak');
if (window.innerWidth < 600) modePratinjau(true);
muatUlangUI();
