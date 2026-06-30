"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { defaultSettings } from "@/data/defaults";
import { getSettings, subscribesimpoiStorage } from "@/services/local-storage";
import type { AppSettings } from "@/types/simpoi";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", key: "dashboard", label: "Dashboard" },
  { href: "/surat", key: "surat", label: "Buat Surat" },
  { href: "/templates", key: "templates", label: "Daftar Template" },
  { href: "/settings", key: "settings", label: "Pengaturan" },
  { href: "/backup", key: "backup", label: "Backup & Restore" },
  { href: "/tentang", key: "tentang", label: "Tentang" },
];

const extraPrefetchPaths = ["/templates/editor", "/templates/tambah"];

const pageMeta: Record<string, { badge: string; title: string }> = {
  "/dashboard": {
    badge: "Dashboard",
    title: "Dashboard simpoi",
  },
  "/backup": {
    badge: "Backup",
    title: "Backup & Restore",
  },
  "/settings": {
    badge: "Pengaturan",
    title: "Pengaturan simpoi",
  },
  "/surat": {
    badge: "Form Surat",
    title: "Form Surat Desa",
  },
  "/templates": {
    badge: "Daftar Template",
    title: "Daftar Template Surat",
  },
  "/templates/editor": {
    badge: "Editor Template",
    title: "Editor Template Surat",
  },
  "/templates/tambah": {
    badge: "Template Baru",
    title: "Tambah Template Surat",
  },
  "/tentang": {
    badge: "Tentang",
    title: "Tentang simpoi",
  },
};

function getActiveKey(pathname: string) {
  if (pathname.startsWith("/dashboard")) {
    return "dashboard";
  }

  if (pathname.startsWith("/templates")) {
    return "templates";
  }

  if (pathname.startsWith("/settings")) {
    return "settings";
  }

  if (pathname.startsWith("/backup")) {
    return "backup";
  }

  if (pathname.startsWith("/tentang")) {
    return "tentang";
  }

  return "surat";
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const active = getActiveKey(pathname);
  const meta = pageMeta[pathname] ?? pageMeta[`/${active}`] ?? pageMeta["/dashboard"];

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const loadSettings = () => setSettings(getSettings());

    loadSettings();
    return subscribesimpoiStorage(loadSettings);
  }, []);

  useEffect(() => {
    const prefetchRoutes = () => {
      [...navItems.map((item) => item.href), ...extraPrefetchPaths].forEach((href) => {
        if (href !== pathname) {
          router.prefetch(href);
        }
      });
    };

    const callback = () => {
      prefetchRoutes();
    };

    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = hasIdleCallback
      ? window.requestIdleCallback(callback, { timeout: 1200 })
      : window.setTimeout(callback, 600);

    return () => {
      if (hasIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [pathname, router]);

  function warmRoute(href: string) {
    router.prefetch(href);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {sidebarOpen ? (
          <aside className="no-print subtle-scrollbar max-h-screen overflow-y-auto overscroll-contain bg-primary-900 px-5 py-6 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-screen lg:w-[260px]">

            <nav className="mt-6 grid gap-2 text-sm font-semibold">
              {navItems.map((item) => (
                <Link
                  className={`rounded-xl px-4 py-3 ${item.key === active
                      ? "bg-primary-700 text-white"
                      : "text-white/80 hover:bg-white/10"
                    }`}
                  href={item.href}
                  key={item.key}
                  onFocus={() => warmRoute(item.href)}
                  onMouseEnter={() => warmRoute(item.href)}
                  prefetch
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl bg-primary-700/50 p-4 text-sm leading-6 text-white/80">
              <strong className="block text-white">Catatan privasi</strong>
              Data warga dan hasil surat tidak disimpan. simpoi hanya menyimpan template,
              pengaturan, logo, dan pesan WhatsApp di browser operator.
            </div>
          </aside>
        ) : null}

        <main className={`min-w-0 flex-1 ${sidebarOpen ? "lg:pl-[260px]" : ""}`}>
          <header className="no-print border-b border-gray-200 bg-white px-5 py-4 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <button
                  aria-expanded={sidebarOpen}
                  aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
                  onClick={() => setSidebarOpen((current) => !current)}
                  type="button"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-primary-700">{settings.villageName}</p>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">{meta.title}</h2>
                </div>
              </div>
              <span className="w-fit rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-900">
                {meta.badge}
              </span>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
