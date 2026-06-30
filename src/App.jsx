import { lazy, Suspense } from "react";
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
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-5 py-6 text-sm font-semibold text-gray-500 lg:px-8">
            Memuat halaman...
          </div>
        }
      >
        {resolveRoute(pathname)}
      </Suspense>
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
