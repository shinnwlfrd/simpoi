# Design System SIPADEL

> **Versi:** 2.0  
> **Terakhir diperbarui:** 2026-06  
> **Referensi implementasi utama:** `src/styles/globals.css`, `src/components/AppShell.jsx`

Dokumen ini adalah sumber kebenaran visual untuk SIPADEL. Setiap komponen, halaman, atau fitur baru harus mengikuti panduan ini sebelum masuk produksi.

## Daftar Isi

1. Karakter Visual
2. Warna
3. Tipografi
4. Spacing & Sizing
5. Elevasi & Shadow
6. Border & Radius
7. Ikon
8. Animasi & Transisi
9. Layout & Grid
10. Breakpoint
11. Komponen
12. Editor Template & Surat
13. Aksesibilitas
14. Anti-Pattern
15. Referensi Implementasi

## 1. Karakter Visual

- Tampilan formal, bersih, dan utilitarian.
- Dominan putih dan abu-abu lembut dengan aksen biru tua.
- Elemen interaktif memakai radius sedang, bayangan ringan, dan border tipis.
- Tidak ada dekorasi yang tidak berfungsi.

## 2. Warna

### 2.1 Palet Primer

| Token | Hex | Contoh Penggunaan |
|---|---|---|
| `primary-100` | `#a3d8ff` | Badge, highlight, hover latar ringan |
| `primary-400` | `#085aa2` | Hover state tombol utama |
| `primary-700` | `#004279` | Aksi utama, state aktif, sidebar item aktif |
| `primary-900` | `#232379` | Latar sidebar |

### 2.2 Warna Netral

| Token | Hex | Contoh Penggunaan |
|---|---|---|
| `gray-50` | `#fafafa` | Background aplikasi |
| `gray-100` | `#f5f5f5` | Background disabled, hover tabel |
| `gray-200` | `#e5e7eb` | Border ringan |
| `gray-300` | `#d1d5db` | Border default input |
| `gray-500` | `#6b7280` | Teks sekunder |
| `gray-700` | `#374151` | Teks label, heading sekunder |
| `gray-900` | `#111827` | Teks utama |
| `white` | `#ffffff` | Permukaan kartu, form, header |

### 2.3 Warna Semantik

Gunakan warna semantik untuk feedback status. Jangan memakai warna primer sebagai pengganti error atau success.

| Intent | Background | Border | Teks | Ikon |
|---|---|---|---|---|
| Success | `#dcfce7` | `#86efac` | `#15803d` | `#16a34a` |
| Warning | `#fef9c3` | `#fde047` | `#a16207` | `#ca8a04` |
| Error | `#fee2e2` | `#fca5a5` | `#b91c1c` | `#dc2626` |
| Info | `#e0f2fe` | `#7dd3fc` | `#0369a1` | `#0284c7` |
| Disabled | `#f3f4f6` | `#e5e7eb` | `#9ca3af` | `#d1d5db` |

### 2.4 Aturan Kontras

- Teks utama di atas putih harus tetap terbaca jelas.
- `primary-700` di atas putih aman untuk teks utama dan badge.
- `primary-100` hanya dipakai sebagai latar, bukan teks utama.
- `gray-400` hanya untuk placeholder dan hint.

## 3. Tipografi

Font aplikasi: `Plus Jakarta Sans`, fallback `Poppins`, `Inter`, `system-ui`, `sans-serif`.  
Font surat dan cetak: `Times New Roman`, fallback `Georgia`, `serif`.

### 3.1 Skala Tipografi

| Token | Size | Weight | Line Height | Dipakai untuk |
|---|---|---|---|---|
| `heading-2xl` | `1.75rem` / 28px | 700 | 1.2 | Judul halaman utama |
| `heading-xl` | `1.5rem` / 24px | 700 | 1.25 | Judul section besar |
| `heading-lg` | `1.25rem` / 20px | 600 | 1.3 | Judul kartu, heading level 2 |
| `heading-md` | `1rem` / 16px | 600 | 1.4 | Heading level 3, nama field grup |
| `body-lg` | `1rem` / 16px | 400 | 1.6 | Teks panjang, deskripsi |
| `body-base` | `0.875rem` / 14px | 400 | 1.5 | Default isi form dan tabel |
| `body-sm` | `0.8125rem` / 13px | 400 | 1.5 | Keterangan sekunder |
| `label` | `0.875rem` / 14px | 500 | 1.4 | Label input |
| `caption` | `0.75rem` / 12px | 400 | 1.4 | Hint text |
| `badge` | `0.6875rem` / 11px | 600 | 1 | Pill status |

### 3.2 Font Cetak

- Gunakan `Times New Roman` hanya untuk area editor surat, preview surat, dan output print.
- Jangan pakai `Times New Roman` untuk UI aplikasi.
- Ukuran isi surat tetap formal dan rapat.

## 4. Spacing & Sizing

### 4.1 Token Spacing yang Dipakai

| Token Tailwind | Nilai | Dipakai untuk |
|---|---|---|
| `1` | 4px | Jarak sangat rapat |
| `2` | 8px | Gap ikon dalam tombol, padding badge |
| `3` | 12px | Padding tombol kecil |
| `4` | 16px | Gap default dalam form |
| `5` | 20px | Gap antar baris form |
| `6` | 24px | Padding kartu, gap antar section |
| `8` | 32px | Gap antar grup section besar |
| `10` | 40px | Padding vertical header |
| `12` | 48px | Jarak antar blok besar |

### 4.2 Padding Komponen

| Komponen | Padding |
|---|---|
| Kartu | `p-6` |
| Input default | `px-3 py-2` |
| Input large | `px-4 py-2.5` |
| Tombol default | `px-4 py-2` |
| Tombol large | `px-6 py-3` |
| Tombol ikon | `p-2` |
| Badge / pill | `px-2.5 py-0.5` |
| Sel tabel | `px-4 py-3` |
| Header halaman | `px-6 py-4` atau `px-8 py-5` |

## 5. Elevasi & Shadow

### 5.1 Token Shadow

| Token | Nilai CSS | Dipakai untuk |
|---|---|---|
| `shadow-card` | `0 1px 3px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.04)` | Kartu, panel default |
| `shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.05)` | Input focus, tombol kecil |
| `shadow-md` | `0 4px 6px rgb(0 0 0 / 0.07), 0 2px 4px rgb(0 0 0 / 0.06)` | Dropdown, popover |
| `shadow-lg` | `0 10px 15px rgb(0 0 0 / 0.08), 0 4px 6px rgb(0 0 0 / 0.05)` | Modal, sidebar overlay mobile |
| `shadow-none` | `none` | Print state |

### 5.2 Z-Index Stack

| Layer | z-index | Elemen |
|---|---|---|
| Base | `0` | Konten halaman |
| Sticky | `10` | Header halaman, toolbar editor |
| Dropdown | `20` | Dropdown menu |
| Sidebar desktop | `30` | Sidebar tetap |
| Sidebar mobile | `40` | Sidebar overlay |
| Modal backdrop | `50` | Overlay gelap |
| Modal | `60` | Dialog |
| Toast | `70` | Notifikasi |
| Tooltip | `80` | Tooltip |

## 6. Border & Radius

| Elemen | Radius Token |
|---|---|
| Kartu, panel utama | `rounded-2xl` |
| Input, select, textarea | `rounded-xl` |
| Tombol default | `rounded-xl` |
| Tombol kecil | `rounded-lg` |
| Badge / pill | `rounded-full` |
| Dropdown / popover | `rounded-xl` |
| Modal | `rounded-2xl` |

Border yang umum:

- Kartu: `border border-gray-200`
- Input default: `border border-gray-300`
- Input focus: `border-primary-400 ring-2 ring-primary-100`
- Divider horizontal: `border-t border-gray-200`
- Header bawah: `border-b border-gray-200`

## 7. Ikon

- Gunakan Lucide Icons.
- Jangan campur library ikon lain dalam satu halaman.

### Ukuran Ikon

| Konteks | Ukuran |
|---|---|
| Inline dalam teks | 14px |
| Tombol kecil | 16px |
| Tombol default | 18px |
| Navigasi sidebar | 20px |
| Empty state | 40-48px |

### Aturan

- Tombol ikon tanpa label harus punya `aria-label` atau `title`.
- Ikon dekoratif harus `aria-hidden="true"`.

## 8. Animasi & Transisi

Prinsipnya cepat dan fungsional.

### Durasi

| Token | Durasi | Dipakai untuk |
|---|---|---|
| `duration-75` | 75ms | Hover warna |
| `duration-150` | 150ms | Default perubahan state |
| `duration-200` | 200ms | Dropdown, fade |
| `duration-250` | 250ms | Sidebar mobile |
| `duration-300` | 300ms | Toast masuk/keluar |

### Easing

- `ease-out` untuk elemen yang masuk
- `ease-in` untuk elemen yang keluar
- `ease-in-out` untuk pergerakan dua arah

## 9. Layout & Grid

### Struktur Halaman

- Sidebar navigasi
- Header halaman
- Konten utama

### Lebar Konten

| Konteks | Max Width |
|---|---|
| Layout aplikasi umum | `max-w-7xl` |
| Form tunggal | `max-w-2xl` |
| Form dua kolom | `max-w-4xl` |
| Panel settings | `max-w-3xl` |
| Editor surat dan preview | area A4 penuh |

### Grid Form

- Form satu kolom: `grid grid-cols-1 gap-4`
- Form dua kolom: `grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6`
- Selalu satu kolom di mobile kecuali field sangat pendek

## 10. Breakpoint

| Nama | Min Width | Perilaku |
|---|---|---|
| default | 0px | Mobile: sidebar overlay, satu kolom |
| `sm` | 640px | Beberapa elemen mulai dua kolom |
| `md` | 768px | Form boleh dua kolom |
| `lg` | 1024px | Sidebar permanen |
| `xl` | 1280px | `max-w-7xl` efektif |
| `2xl` | 1536px | Tidak ada perubahan baru |

Sidebar collapse threshold adalah `lg`:

- Di bawah `lg`: sidebar overlay
- `lg` ke atas: sidebar selalu terlihat

## 11. Komponen

### 11.1 Tombol

- Primary: background `primary-700`, teks putih, hover `primary-400`
- Secondary: background putih, border abu-abu, hover `gray-100`
- Accent: background putih, border `primary-700`, teks `primary-700`
- Danger: gunakan merah semantik

### 11.2 Input & Form

- Input memakai border tipis, background putih, focus ring biru muda
- Label selalu di atas field
- Error message memakai warna semantik error

### 11.3 Sidebar

- Latar: `primary-900`
- Item aktif: `primary-700`
- Item tidak aktif: teks putih transparan dengan hover tipis

### 11.4 Header Halaman

- Latar putih
- Border bawah abu-abu tipis
- Badge status memakai `primary-100`

### 11.5 Badge

| Tipe | Background | Teks |
|---|---|---|
| Netral | `gray-100` | `gray-700` |
| Primary | `primary-100` | `primary-700` |
| Success | `#dcfce7` | `#15803d` |
| Warning | `#fef9c3` | `#a16207` |
| Error | `#fee2e2` | `#b91c1c` |

### 11.6 Empty State

- Ikon 48px
- Judul ringkas
- Deskripsi singkat
- Tombol aksi bila perlu

### 11.7 Loading

- Skeleton memakai `animate-pulse`
- Loading inline memakai spinner kecil

## 12. Editor Template & Surat

- Toolbar editor sticky di atas
- Kanvas editor mengikuti ukuran A4
- Area surat memakai `Times New Roman`
- Margin cetak mengikuti pengaturan per template
- Di layar kecil, area A4 boleh scroll horizontal

## 13. Aksesibilitas

- Semua elemen interaktif harus bisa diakses via keyboard
- `focus-visible` wajib ada
- Tombol ikon wajib punya label aksesibel
- Modal harus trap focus
- Target sentuh minimal 44 x 44px

## 14. Anti-Pattern

| Jangan | Gantinya |
|---|---|
| Gradien dekoratif | Solid color sesuai palet |
| Card di dalam card | Section datar dengan border |
| Warna status improvisasi | Warna semantik |
| `Times New Roman` untuk UI | `Plus Jakarta Sans` |
| Tombol ikon tanpa label | Tambah `aria-label` |
| `outline: none` tanpa pengganti | `ring` fokus |
| Library ikon selain Lucide | Lucide |

## 15. Referensi Implementasi

| Komponen / Halaman | File |
|---|---|
| Sidebar, header, dan layout aplikasi | `src/components/AppShell.jsx` |
| Variabel warna, spacing cetak, dan aturan tipografi | `src/styles/globals.css` |
| Halaman surat | `src/features/letters/CreateLetterPage.jsx` |
| Editor template | `src/features/templates/TemplateEditorPage.jsx` |
| Form template baru | `src/features/templates/AddTemplatePage.jsx` |
| Daftar template | `src/features/templates/TemplateListPage.jsx` |

> **Changelog**
>
> | Versi | Tanggal | Perubahan |
> |---|---|---|
> | 2.0 | 2026-06 | Revisi penuh design system, perluasan warna, tipografi, spacing, komponen, aksesibilitas, dan aturan print |
> | 1.0 | - | Versi awal |
