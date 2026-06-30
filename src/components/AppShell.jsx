import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultSettings } from "@/data/defaults";
import { AppLink, useAppRouter, usePathname } from "@/lib/router";
import { getSettings, subscribesimpoiStorage } from "@/services/local-storage";

const navItems = [
  { href: "/dashboard", key: "dashboard", label: "Dashboard" },
  { href: "/surat", key: "surat", label: "Buat Surat" },
  { href: "/templates", key: "templates", label: "Daftar Template" },
  { href: "/settings", key: "settings", label: "Pengaturan" },
  { href: "/tentang", key: "tentang", label: "Tentang" },
];

const extraPrefetchPaths = ["/templates/editor", "/templates/tambah"];

const pageMeta = {
  "/dashboard": {
    badge: "Dashboard",
    title: "Dashboard simpoi",
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

function getActiveKey(pathname) {
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return "dashboard";
  }

  if (pathname.startsWith("/surat")) {
    return "surat";
  }

  if (pathname.startsWith("/templates")) {
    return "templates";
  }

  if (pathname.startsWith("/settings")) {
    return "settings";
  }

  if (pathname.startsWith("/tentang")) {
    return "tentang";
  }

  return "dashboard";
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useAppRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const active = getActiveKey(pathname);
  const meta = pageMeta[pathname] ?? pageMeta[`/${active}`] ?? pageMeta["/dashboard"];

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const loadSettings = () => setSettings(getSettings());

    loadSettings();
    return subscribesimpoiStorage(loadSettings);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncSidebar = (event) => setSidebarOpen(event.matches);

    syncSidebar(mediaQuery);
    mediaQuery.addEventListener("change", syncSidebar);

    return () => mediaQuery.removeEventListener("change", syncSidebar);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

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

  function warmRoute(href) {
    router.prefetch(href);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {sidebarOpen ? (
          <button
            aria-label="Tutup sidebar"
            className="fixed inset-0 z-40 bg-gray-950/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
          />
        ) : null}

        {sidebarOpen ? (
          <aside className="no-print subtle-scrollbar fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] overflow-y-auto overscroll-contain bg-primary-900 px-5 py-6 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-screen lg:w-[260px] lg:max-w-none">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
                  simpoi
                </p>
                <button
                  aria-label="Tutup sidebar"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                  type="button"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
              <h1 className="mt-3 text-2xl font-bold leading-tight">Sistem Surat Desa</h1>
              <p className="mt-3 text-sm leading-6 text-white/75">
                MVP local-first untuk membuat, mencetak, dan membagikan surat via WhatsApp.
              </p>
            </div>

            <nav className="mt-6 grid gap-2 text-sm font-semibold">
              {navItems.map((item) => (
                <AppLink
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
                </AppLink>
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
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary-700">{settings.villageName}</p>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{meta.title}</h2>
                </div>
              </div>
              <span className="w-fit max-w-full rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-900">
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
