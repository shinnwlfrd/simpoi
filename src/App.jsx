import { Component, lazy, Suspense } from "react";
import AppShell from "@/components/AppShell";
import { RouterProvider, usePathname } from "@/lib/router";

const AddTemplatePage = lazy(() => import("@/features/templates/AddTemplatePage"));
const CreateLetterPage = lazy(() => import("@/features/letters/CreateLetterPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const GuidePage = lazy(() => import("@/features/guide/GuidePage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));
const TemplateEditorPage = lazy(() => import("@/features/templates/TemplateEditorPage"));
const TemplateListPage = lazy(() => import("@/features/templates/TemplateListPage"));
const AboutPage = lazy(() => import("@/features/about/AboutPage"));

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-red-700">Terjadi kesalahan saat membuka halaman</p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">Editor template gagal dimuat</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Periksa template yang dipilih atau muat ulang halaman. Jika masalah hanya terjadi pada
              template tertentu, kemungkinan HTML template itu perlu dibersihkan.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function resolveRoute(pathname) {
  if (pathname === "/" || pathname === "/dashboard") {
    return <DashboardPage />;
  }

  if (pathname === "/surat") {
    return <CreateLetterPage />;
  }

  if (pathname === "/templates/editor") {
    return <TemplateEditorPage />;
  }

  if (pathname === "/templates/tambah") {
    return <AddTemplatePage />;
  }

  if (pathname === "/templates") {
    return <TemplateListPage />;
  }

  if (pathname === "/settings") {
    return <SettingsPage />;
  }

  if (pathname === "/panduan") {
    return <GuidePage />;
  }

  if (pathname === "/tentang") {
    return <AboutPage />;
  }

  return <DashboardPage />;
}

function AppRoutes() {
  const pathname = usePathname();

  return (
    <AppShell>
      <RouteErrorBoundary>
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-5 py-6 text-sm font-semibold text-gray-500 lg:px-8">
              Memuat halaman...
            </div>
          }
        >
          {resolveRoute(pathname)}
        </Suspense>
      </RouteErrorBoundary>
    </AppShell>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}
