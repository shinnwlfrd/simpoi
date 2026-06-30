import { AppLink } from "@/lib/router";

const workflowSteps = [
  "Buka Dashboard untuk melihat jumlah template.",
  "Pilih template di halaman Buat Surat.",
  "Isi nomor surat sesuai nomor yang diberikan desa.",
  "Isi semua field wajib sampai data pemohon lengkap.",
  "Periksa preview A4 di bagian bawah halaman.",
  "Klik Cetak / Save PDF dari browser.",
  "Isi nomor WhatsApp warga dan klik Kirim WhatsApp jika perlu.",
];

const productionSteps = [
  "Buka Pengaturan dan isi identitas desa.",
  "Upload logo desa jika tersedia.",
  "Cek semua template default di Daftar Template.",
  "Uji cetak A4 di perangkat operator sebelum serah terima.",
];

export default function GuidePage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,760px)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
            <p className="text-sm font-semibold text-primary-700">Panduan Operator</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">Alur membuat surat</h3>
            <ol className="mt-5 grid gap-3 text-sm leading-6 text-gray-600">
              {workflowSteps.map((step, index) => (
                <li className="rounded-xl bg-gray-50 p-4" key={step}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
            <p className="text-sm font-semibold text-primary-700">Produksi</p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">Setup sebelum dipakai desa</h3>
            <ol className="mt-5 grid gap-3 text-sm leading-6 text-gray-600">
              {productionSteps.map((step, index) => (
                <li className="rounded-xl bg-gray-50 p-4" key={step}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-primary-100 bg-primary-100/50 p-5 text-sm leading-6 text-primary-900">
            <h3 className="text-lg font-bold">Prinsip Privasi</h3>
            <p className="mt-2">
              Data warga dan hasil surat tidak disimpan. simpoi hanya menyimpan template,
              pengaturan, logo, dan template WhatsApp di browser operator.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
            <h3 className="text-lg font-bold text-gray-900">Akses Cepat</h3>
            <div className="mt-4 grid gap-3">
              <AppLink
                className="rounded-xl bg-primary-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-400"
                href="/dashboard"
                prefetch
              >
                Buka Dashboard
              </AppLink>
              <AppLink
                className="rounded-xl border border-primary-400 bg-white px-4 py-2.5 text-center text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                href="/templates"
                prefetch
              >
                Buka Daftar Template
              </AppLink>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
