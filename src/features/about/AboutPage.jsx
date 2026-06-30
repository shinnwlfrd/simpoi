import { FileText, MessageCircle, PenLine, Printer, Settings } from "lucide-react";
import { AppLink } from "@/lib/router";

const guideSteps = [
  {
    icon: Settings,
    title: "Atur identitas desa",
    text: "Buka Pengaturan, isi nama desa, kecamatan, kabupaten, alamat, kepala desa, logo, dan template pesan WhatsApp.",
  },
  {
    icon: PenLine,
    title: "Kelola template surat",
    text: "Buka Daftar Template untuk memilih template yang ingin diedit, lalu sesuaikan isi surat dan placeholder sesuai kebutuhan desa.",
  },
  {
    icon: FileText,
    title: "Buat surat",
    text: "Buka Buat Surat, pilih template aktif, isi nomor surat dan data warga, lalu periksa preview A4 sebelum dicetak.",
  },
  {
    icon: Printer,
    title: "Cetak atau simpan PDF",
    text: "Gunakan tombol Print / Download PDF. Pilih printer fisik atau Save as PDF dari dialog print browser.",
  },
  {
    icon: MessageCircle,
    title: "Kirim lewat WhatsApp",
    text: "Isi nomor tujuan WhatsApp, pastikan pesan otomatis sudah sesuai, lalu kirim melalui tab WhatsApp yang terbuka.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 px-5 py-6 lg:px-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <p className="text-sm font-semibold text-primary-700">Panduan Penggunaan</p>
        <h3 className="mt-1 text-2xl font-bold text-gray-900">Cara memakai simpoi</h3>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Ikuti alur ini dari pengaturan awal sampai surat siap dicetak atau dikirim ke warga.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {guideSteps.map((item, index) => {
          const Icon = item.icon;

          return (
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card" key={item.title}>
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-sm font-bold text-primary-900">
                  {index + 1}
                </span>
                <div>
                  <Icon className="h-5 w-5 text-primary-700" />
                  <h4 className="mt-3 text-lg font-bold text-gray-900">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.text}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="rounded-2xl border border-primary-100 bg-primary-100/50 p-5 text-sm leading-6 text-primary-900">
        <h4 className="text-lg font-bold">Catatan penyimpanan</h4>
        <p className="mt-2">
          simpoi menyimpan template, pengaturan, logo, dan pesan WhatsApp di browser operator.
          Data warga yang diisi saat membuat surat tidak disimpan sebagai riwayat.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <AppLink
            className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
            href="/settings"
          >
            Buka Pengaturan
          </AppLink>
          <AppLink
            className="rounded-xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
            href="/surat"
          >
            Buat Surat
          </AppLink>
        </div>
      </section>
    </section>
  );
}
