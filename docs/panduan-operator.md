# Panduan Operator simpoi

## Alur Harian

1. Buka `/dashboard` untuk melihat ringkasan.
2. Buka `/surat`.
3. Pilih template surat.
4. Isi data warga.
5. Klik `Buat Nomor Surat` untuk mengambil nomor dari Supabase.
6. Periksa preview A4.
7. Klik `Print / Download PDF`.
8. Jika perlu, isi nomor WhatsApp dan klik `Kirim WhatsApp`.

## Edit Template

1. Buka `/templates`.
2. Pilih template.
3. Edit isi surat memakai toolbar Tiptap seperti aplikasi Word.
4. Sisipkan placeholder dari dropdown toolbar.
5. Klik `Save` untuk menyimpan perubahan ke Supabase.

## Pengaturan

Isi data berikut di `/settings`:

- Nama Desa
- Alamat Desa
- Nama Kepala Desa
- NIP
- Logo URL
- Nomor Telepon

## Setup Produksi

1. Jalankan `supabase/schema.sql`.
2. Jalankan `supabase/seed.sql`.
3. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di environment hosting.
4. Deploy ke Vercel.

## Privasi

Isi surat yang sudah dibuat tidak disimpan ke database. simpoi hanya menyimpan template, pengaturan desa, dan counter nomor surat.
