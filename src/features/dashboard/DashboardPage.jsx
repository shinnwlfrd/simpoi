import { FileText, LayoutDashboard, PenLine, Settings, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AppLink } from "@/lib/router";
import { getDashboardStats, subscribesimpoiStorage } from "@/services/local-storage";

const initialStats = {
  activeTemplates: 0,
  inactiveTemplates: 0,
  totalTemplates: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats);

  function loadStats() {
    setStats(getDashboardStats());
  }

  useEffect(() => {
    loadStats();
    return subscribesimpoiStorage(loadStats);
  }, []);

  const cards = [
    { icon: FileText, label: "Jumlah Template", value: stats.totalTemplates },
    { icon: ToggleRight, label: "Template Aktif", value: stats.activeTemplates },
    { icon: ToggleLeft, label: "Template Nonaktif", value: stats.inactiveTemplates },
    { icon: LayoutDashboard, label: "Mode Aplikasi", value: "Offline" },
  ];

  const shortcuts = [
    { href: "/surat", icon: FileText, label: "Buat Surat", text: "Pilih template, isi data warga, lalu print." },
    { href: "/templates", icon: PenLine, label: "Daftar Template", text: "Kelola template surat yang tersedia." },
    { href: "/settings", icon: Settings, label: "Pengaturan", text: "Ubah identitas desa, logo, dan WhatsApp." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card" key={card.label}>
              <Icon className="h-5 w-5 text-primary-700" />
              <p className="mt-4 text-sm text-gray-500">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item) => {
          const Icon = item.icon;

          return (
            <AppLink
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary-400"
              href={item.href}
              key={item.href}
              prefetch
            >
              <Icon className="h-6 w-6 text-primary-700" />
              <h4 className="mt-4 text-lg font-bold text-gray-900">{item.label}</h4>
              <p className="mt-2 text-sm leading-6 text-gray-500">{item.text}</p>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}
