import { Menu, X } from "lucide-react";
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
  },
  "/settings": {
    badge: "Pengaturan",
  },
  "/surat": {
    badge: "Form Surat",
  },
  "/templates": {
    badge: "Daftar Template",
  },
  "/templates/editor": {
    badge: "Editor Template",
  },
  "/templates/tambah": {
    badge: "Template Baru",
  },
  "/tentang": {
    badge: "Tentang",
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
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
    }

    if (import.meta.env.DEV && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .then(() => ("caches" in window ? window.caches.keys() : []))
        .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName))))
        .catch(() => undefined);
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
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-white">{settings.villageName}</p>
              <button
                aria-label="Tutup sidebar"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                onClick={() => setSidebarOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
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
          </aside>
        ) : null}

        <main className={`min-w-0 flex-1 ${sidebarOpen ? "lg:pl-[260px]" : ""}`}>
          <header className="no-print border-b border-gray-200 bg-white px-5 py-4 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {!sidebarOpen ? (
                  <button
                    aria-expanded={sidebarOpen}
                    aria-label="Buka sidebar"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
                    onClick={() => setSidebarOpen(true)}
                    type="button"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-primary-700">{settings.villageName}</p>
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
