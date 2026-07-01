import { ArrowLeft, Download, Edit3, FilePlus2, Trash2, ToggleLeft, ToggleRight, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/lib/router";
import {
  deleteTemplate,
  duplicateTemplate,
  exportTemplatesJson,
  getTemplates,
  importTemplatesJson,
  subscribesimpoiStorage,
} from "@/services/local-storage";

export default function TemplateListPage() {
  const importInputRef = useRef(null);
  const [templates, setTemplates] = useState([]);
  const [status, setStatus] = useState("");

  function loadTemplates() {
    setTemplates(getTemplates());
  }

  useEffect(() => {
    loadTemplates();
    return subscribesimpoiStorage(loadTemplates);
  }, []);

  function copyTemplate(template) {
    duplicateTemplate(template.id);
    setStatus(`Template "${template.name}" berhasil diduplikasi.`);
  }

  function removeTemplate(template) {
    if (!window.confirm(`Hapus template "${template.name}"?`)) {
      return;
    }

    deleteTemplate(template.id);
    setStatus(`Template "${template.name}" dihapus.`);
  }

  function exportTemplates() {
    const blob = new Blob([exportTemplatesJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `simpoi-templates-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Template berhasil diexport sebagai JSON.");
  }

  function importTemplates(file) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importTemplatesJson(String(reader.result ?? ""));
        setStatus(imported ? "Template berhasil diimport dari JSON." : "File JSON template tidak valid.");
      } catch {
        setStatus("File JSON template tidak bisa dibaca.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-5 py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AppLink
          className="inline-flex items-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </AppLink>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            onClick={exportTemplates}
            type="button"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            onClick={() => importInputRef.current?.click()}
            type="button"
          >
            <Upload className="h-4 w-4" />
            Import JSON
          </button>
          <input
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              importTemplates(event.target.files?.[0]);
              event.target.value = "";
            }}
            ref={importInputRef}
            type="file"
          />
          <AppLink
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
            href="/templates/tambah"
          >
            <FilePlus2 className="h-4 w-4" />
            Tambah Template
          </AppLink>
        </div>
      </div>

      {status ? (
        <div className="rounded-2xl border border-primary-100 bg-primary-100/50 px-4 py-3 text-sm font-semibold text-primary-900">
          {status}
        </div>
      ) : null}

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
            <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
              <AppLink
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                href={`/templates/editor?template=${encodeURIComponent(template.id)}`}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </AppLink>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                onClick={() => removeTemplate(template)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
