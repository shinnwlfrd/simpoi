import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  CheckCircle2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Eraser,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Plus,
  Save,
  Table2,
  TableCellsMerge,
  TableCellsSplit,
  Columns3,
  Rows3,
  Trash2,
  UnderlineIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { defaultPageMargin, defaultSettings, defaultTemplates, placeholderFields } from "@/data/defaults";
import { AppLink } from "@/lib/router";
import {
  clearTemplateDraft,
  getTemplateDraft,
  getTemplates,
  normalizePageMargin,
  restoreTemplateHistory,
  saveTemplateDraft,
  subscribesimpoiStorage,
  updateTemplate,
  getSettings,
} from "@/services/local-storage";
import {
  clearSelectedFormatting,
  focusPlaceholder,
  insertBasicTable,
  insertPlaceholder,
  insertTemplateBlock,
  templateBlocks,
  validateTemplateContent,
} from "@/features/templates/template-editor-tools";

function ToolbarButton({
  active,
  children,
  disabled,
  onClick,
  title,
}) {
  return (
    <button
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition ${active
        ? "border-primary-700 bg-primary-100 text-primary-900"
        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

function TemplateToolbar({
  editor,
  isFullscreen,
  onSave,
  onToggleFullscreen,
  onZoomChange,
  placeholders,
  previewZoom,
  saving,
}) {
  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-3">
      <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading">
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Number list">
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => insertBasicTable(editor)} title="Sisipkan tabel">
        <Table2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().addRowAfter()} onClick={() => editor.chain().focus().addRowAfter().run()} title="Tambah baris">
        <Rows3 className="h-4 w-4" />
        <Plus className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().addColumnAfter()} onClick={() => editor.chain().focus().addColumnAfter().run()} title="Tambah kolom">
        <Columns3 className="h-4 w-4" />
        <Plus className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().deleteRow()} onClick={() => editor.chain().focus().deleteRow().run()} title="Hapus baris">
        <Rows3 className="h-4 w-4" />
        <Trash2 className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().deleteColumn()} onClick={() => editor.chain().focus().deleteColumn().run()} title="Hapus kolom">
        <Columns3 className="h-4 w-4" />
        <Trash2 className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().deleteTable()} onClick={() => editor.chain().focus().deleteTable().run()} title="Hapus tabel">
        <Table2 className="h-4 w-4" />
        <Trash2 className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()} title="Gabung cell">
        <TableCellsMerge className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().splitCell()} onClick={() => editor.chain().focus().splitCell().run()} title="Pisah cell">
        <TableCellsSplit className="h-4 w-4" />
      </ToolbarButton>
      <select
        className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-700"
        onChange={(event) => {
          insertTemplateBlock(editor, event.target.value);
          event.target.value = "";
        }}
        value=""
      >
        <option value="">Sisipkan Blok</option>
        {templateBlocks.map((block) => (
          <option key={block.id} value={block.id}>
            {block.label}
          </option>
        ))}
      </select>
      <ToolbarButton onClick={() => clearSelectedFormatting(editor)} title="Bersihkan format pilihan">
        <Eraser className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <select
        className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-700"
        onChange={(event) => {
          insertPlaceholder(editor, event.target.value);
          event.target.value = "";
        }}
        value=""
      >
        <option value="">Sisipkan Placeholder</option>
        {placeholderFields.map((placeholder) => (
          <option key={placeholder.key} value={placeholder.key}>
            {placeholder.label}
          </option>
        ))}
      </select>
      <select
        className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-700"
        disabled={!placeholders.length}
        onChange={(event) => {
          focusPlaceholder(editor, event.target.value);
          event.target.value = "";
        }}
        value=""
      >
        <option value="">Cari Placeholder</option>
        {placeholders.map((key) => (
          <option key={key} value={key}>
            {`{{${key}}}`}
          </option>
        ))}
      </select>
      <ToolbarButton onClick={onToggleFullscreen} title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}>
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </ToolbarButton>
      <select
        className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-700"
        onChange={(event) => onZoomChange(Number(event.target.value))}
        value={previewZoom}
      >
        <option value={0.75}>75%</option>
        <option value={0.9}>90%</option>
        <option value={1}>100%</option>
        <option value={1.1}>110%</option>
        <option value={1.25}>125%</option>
      </select>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary-700 px-3 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={saving}
        onClick={onSave}
        type="button"
      >
        <Save className="h-4 w-4" />
        Save
      </button>
    </div>
  );
}

function MarginField({ id, label, value, onChange }) {
  return (
    <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
      {label}
      <div className="mt-2 flex items-center gap-2">
        <input
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
          id={id}
          min="0"
          onChange={(event) => onChange(Number(event.target.value))}
          step="0.1"
          type="number"
          value={value}
        />
        <span className="text-sm font-semibold text-gray-500">cm</span>
      </div>
    </label>
  );
}

function applyEditorContent(editor, html) {
  if (!editor) {
    return false;
  }

  try {
    editor.commands.setContent(html ?? "", { emitUpdate: false });
    return true;
  } catch {
    try {
      editor.commands.setContent("", { emitUpdate: false });
    } catch {
      // If even the empty document fails, keep the page alive and let the
      // surrounding UI render instead of crashing the route.
    }
    return false;
  }
}

export default function TemplateEditorPage() {
  const successTimerRef = useRef(null);
  const [initialTemplateId] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("template")) {
      return searchParams.get("template");
    }
    const hash = window.location.hash;
    const questionMarkIndex = hash.indexOf("?");
    if (questionMarkIndex !== -1) {
      return new URLSearchParams(hash.slice(questionMarkIndex)).get("template");
    }
    return null;
  });
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedId, setSelectedId] = useState(initialTemplateId ?? defaultTemplates[0].id);
  const [contentHtml, setContentHtml] = useState(defaultTemplates[0].contentHtml);
  const [isActive, setIsActive] = useState(Boolean(defaultTemplates[0].isActive));
  const [pageMargin, setPageMargin] = useState(defaultPageMargin);
  const [status, setStatus] = useState("Memuat template lokal...");
  const [saving, setSaving] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [savedNotice, setSavedNotice] = useState("");
  const [settings, setSettings] = useState(defaultSettings);
  const [name, setName] = useState(defaultTemplates[0].name);
  const [code, setCode] = useState(defaultTemplates[0].code);
  const [sortOrder, setSortOrder] = useState(defaultTemplates[0].sortOrder);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalNotes, setInternalNotes] = useState(defaultTemplates[0].internalNotes ?? "");
  const [previewZoom, setPreviewZoom] = useState(1);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedId) ?? templates[0],
    [selectedId, templates],
  );
  const defaultTemplate = defaultTemplates.find((template) => template.code === selectedTemplate?.code);
  const templateValidation = useMemo(() => validateTemplateContent(contentHtml), [contentHtml]);

  const editor = useEditor({
    content: contentHtml,
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[760px] outline-none",
      },
    },
    extensions: [
      StarterKit,
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      setContentHtml(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    const loadTemplates = () => {
      const storedTemplates = getTemplates();
      const usableTemplates = storedTemplates.length ? storedTemplates : defaultTemplates;

      setTemplates(usableTemplates);
      setSelectedId((current) => usableTemplates.find((template) => template.id === current)?.id ?? usableTemplates[0].id);
      setSettings(getSettings());
      setStatus("Template dimuat dari penyimpanan lokal browser.");
    };

    loadTemplates();
    return subscribesimpoiStorage(loadTemplates);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(successTimerRef.current);
  }, []);

  useEffect(() => {
    if (!editor || !selectedTemplate) {
      return;
    }

    const draft = getTemplateDraft(selectedTemplate.id);
    const nextHtml = draft?.contentHtml ?? selectedTemplate.contentHtml ?? defaultTemplate?.contentHtml ?? "";
    const timeoutId = window.setTimeout(() => {
      setName(draft?.name ?? selectedTemplate.name ?? "");
      setCode(draft?.code ?? selectedTemplate.code ?? "");
      setSortOrder(draft?.sortOrder ?? selectedTemplate.sortOrder ?? 50);
      setInternalNotes(draft?.internalNotes ?? selectedTemplate.internalNotes ?? "");
      setIsActive(Boolean(draft?.isActive ?? selectedTemplate.isActive));
      setPageMargin(normalizePageMargin(draft?.pageMargin ?? selectedTemplate.pageMargin));
      setContentHtml(nextHtml);
      const applied = applyEditorContent(editor, nextHtml);

      if (!applied) {
        setEditorError(
          "Konten template ini gagal dimuat ke editor. Gunakan Reset untuk kembali ke template bawaan.",
        );
      } else {
        setEditorError("");
        if (draft) {
          setStatus("Draft autosave dimuat. Klik Save untuk menyimpan permanen.");
        }
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [editor, selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate || !editor) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveTemplateDraft(selectedTemplate.id, {
        code,
        contentHtml: editor.getHTML(),
        internalNotes,
        isActive: Boolean(isActive),
        name,
        pageMargin: normalizePageMargin(pageMargin),
        sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 50,
      });
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [code, contentHtml, editor, internalNotes, isActive, name, pageMargin, selectedTemplate, sortOrder]);

  useEffect(() => {
    function handleShortcut(event) {
      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveTemplate();
      }

      if (event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setIsFullscreen((current) => !current);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  function restoreHistory(index) {
    if (!selectedTemplate) {
      return;
    }

    const restored = restoreTemplateHistory(selectedTemplate.id, Number(index));

    if (!restored) {
      setStatus("Riwayat versi gagal dipulihkan.");
      return;
    }

    setTemplates((current) => current.map((template) => (template.id === restored.id ? restored : template)));
    setStatus("Riwayat versi dipulihkan. Klik Save jika ingin membuat titik riwayat baru.");
  }

  function saveTemplate() {
    if (!selectedTemplate) {
      return;
    }

    setSaving(true);

    const updated = updateTemplate(selectedTemplate.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 50,
      category: selectedTemplate.category ?? "Umum",
      contentHtml: editor?.getHTML() ?? contentHtml,
      internalNotes,
      isActive: Boolean(isActive),
      pageMargin: normalizePageMargin(pageMargin),
    });

    if (updated) {
      clearTemplateDraft(selectedTemplate.id);
      setTemplates((current) => current.map((template) => (template.id === updated.id ? updated : template)));
      setStatus("Template berhasil disimpan di browser.");
      setSavedNotice("Template berhasil disimpan.");
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => setSavedNotice(""), 2200);
    } else {
      setStatus("Template gagal disimpan.");
    }

    setSaving(false);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div className="space-y-6">
        {savedNotice ? (
          <div className="save-notice rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-card">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-semibold">{savedNotice}</p>
            </div>
          </div>
        ) : null}

        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-[80] overflow-auto bg-gray-100"
              : "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card"
          }
        >
          <div className="border-b border-gray-200 p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-700">Edit Template</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">Editor surat seperti Microsoft Word</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <AppLink
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                  href="/templates"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </AppLink>
                <AppLink
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
                  href="/templates/tambah"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Template
                </AppLink>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">{status}</p>

            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
              <label className="block text-sm font-medium text-gray-700" htmlFor="template">
                Pilih Template Yang Mau Diedit
                <select
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                  id="template"
                  onChange={(event) => setSelectedId(event.target.value)}
                  value={selectedId}
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-end gap-2 text-sm font-semibold text-gray-700" htmlFor="active">
                <input
                  checked={Boolean(isActive)}
                  className="mb-3 h-4 w-4 accent-primary-700"
                  id="active"
                  onChange={(event) => setIsActive(event.target.checked)}
                  type="checkbox"
                />
                Aktif
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="templateName">
                Nama Template
                <input
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                  id="templateName"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </label>

              <label className="block text-sm font-medium text-gray-700" htmlFor="templateCode">
                Kode Surat
                <input
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm uppercase outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                  id="templateCode"
                  onChange={(event) => setCode(event.target.value)}
                  value={code}
                />
              </label>

              <label className="block text-sm font-medium text-gray-700" htmlFor="sortOrder">
                Urutan
                <input
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                  id="sortOrder"
                  onChange={(event) => setSortOrder(Number(event.target.value))}
                  type="number"
                  value={sortOrder}
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 lg:col-span-4" htmlFor="internalNotes">
                Catatan Internal
                <textarea
                  className="mt-2 min-h-24 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                  id="internalNotes"
                  onChange={(event) => setInternalNotes(event.target.value)}
                  placeholder="Catatan ini hanya untuk admin dan tidak ikut tercetak."
                  value={internalNotes}
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MarginField
                id="marginTop"
                label="Margin Atas"
                onChange={(value) => setPageMargin((current) => ({ ...current, top: value }))}
                value={pageMargin.top}
              />
              <MarginField
                id="marginRight"
                label="Margin Kanan"
                onChange={(value) => setPageMargin((current) => ({ ...current, right: value }))}
                value={pageMargin.right}
              />
              <MarginField
                id="marginBottom"
                label="Margin Bawah"
                onChange={(value) => setPageMargin((current) => ({ ...current, bottom: value }))}
                value={pageMargin.bottom}
              />
              <MarginField
                id="marginLeft"
                label="Margin Kiri"
                onChange={(value) => setPageMargin((current) => ({ ...current, left: value }))}
                value={pageMargin.left}
              />
            </div>
          </div>

          {editorError ? (
            <div className="border-t border-gray-200 bg-red-50 px-5 py-4 md:px-6">
              <p className="text-sm font-semibold text-red-700">Editor template tidak bisa dimuat</p>
              <p className="mt-1 text-sm leading-6 text-red-700/90">{editorError}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <TemplateToolbar
                  editor={editor}
                  isFullscreen={isFullscreen}
                  onSave={saveTemplate}
                  onToggleFullscreen={() => setIsFullscreen((current) => !current)}
                  onZoomChange={setPreviewZoom}
                  placeholders={templateValidation.placeholders}
                  previewZoom={previewZoom}
                  saving={saving}
                />
              </div>

              <div className="overflow-x-auto bg-gray-100 p-4 md:p-6">
                <div style={{ height: `${297 * previewZoom}mm` }}>
                  <div
                    className="sheet-a4 mx-auto w-[210mm] min-w-[210mm] origin-top bg-white shadow-card"
                    style={{
                      padding: `${pageMargin.top}cm ${pageMargin.right}cm ${pageMargin.bottom}cm ${pageMargin.left}cm`,
                      transform: `scale(${previewZoom})`,
                    }}
                  >
                    <div className="mb-6 flex items-center gap-4 border-b-4 border-black pb-4">
                      {settings.logoBase64 ? (
                        <img
                          alt="Logo desa"
                          className="letter-logo letter-logo-letterhead flex-none object-contain"
                          src={settings.logoBase64}
                        />
                      ) : null}
                      <div className="min-w-0 flex-1 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                          Pemerintah Kabupaten {settings.regencyName}
                        </p>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                          Kecamatan {settings.districtName}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold uppercase text-black">{settings.villageName}</h3>
                        <p className="mt-1 text-sm text-black">
                          {settings.villageAddress}
                          {settings.villagePostalCode ? `, ${settings.villagePostalCode}` : ""}
                        </p>
                        {settings.villageEmail || settings.villageSocialMedia ? (
                          <p className="mt-1 text-sm text-black">
                            {[settings.villageEmail, settings.villageSocialMedia].filter(Boolean).join(" | ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
