import { Edit3, FilePlus2, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AppLink } from "@/lib/router";
import { getTemplates, resetDefaultTemplates, subscribesimpoiStorage } from "@/services/local-storage";

export default function TemplateListPage() {
  const [templates, setTemplates] = useState([]);

  function loadTemplates() {
    setTemplates(getTemplates());
  }

  useEffect(() => {
    loadTemplates();
    return subscribesimpoiStorage(loadTemplates);
  }, []);

  function resetTemplates() {
    if (!window.confirm("Reset semua template ke bawaan simpoi? Perubahan template lokal akan hilang.")) {
      return;
    }

    resetDefaultTemplates();
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-5 py-6 lg:px-8">
      <div className="flex justify-end">
        <AppLink
          className="inline-flex items-center gap-2 rounded-2xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
          href="/templates/tambah"
        >
          <FilePlus2 className="h-4 w-4" />
          Tambah Template
        </AppLink>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-card" key={template.id}>
            <div className="flex flex-1 items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{template.name}</h4>
                <p className="mt-2 text-sm text-gray-500">Kode: {template.code}</p>
              </div>
              {template.isActive ? (
                <ToggleRight className="h-5 w-5 text-primary-700" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="mt-auto pt-5">
              <AppLink
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                href={`/templates/editor?template=${encodeURIComponent(template.id)}`}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </AppLink>
            </div>
          </article>
        ))}
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        onClick={resetTemplates}
        type="button"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Template Default
      </button>
    </section>
  );
}
