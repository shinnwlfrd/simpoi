# simpoi

simpoi adalah aplikasi React untuk membuat surat desa berbasis template. Aplikasi berjalan di browser, menyimpan data di localStorage, dan tidak membutuhkan backend, database online, login, atau biaya layanan bulanan.

## Fitur

- Dashboard jumlah template.
- Buat surat dari template aktif.
- Form surat otomatis mengikuti placeholder template.
- Preview A4 realtime dengan font Times New Roman.
- Print dan Download PDF melalui fitur browser.
- WhatsApp semi-otomatis melalui `wa.me`.
- Daftar template dan editor template visual dengan Tiptap.
- Pengaturan identitas desa, logo, dan template pesan WhatsApp.
- PWA dengan service worker dan fallback offline.

## Halaman

- `/dashboard`
- `/surat`
- `/templates`
- `/templates/editor`
- `/templates/tambah`
- `/settings`
- `/panduan`
- `/tentang`

## Menjalankan

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Hasil build ada di folder `dist`. Untuk XAMPP/Apache, salin isi `dist` ke folder web root yang diinginkan.
