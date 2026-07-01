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
  Save,
  Table2,
  TableCellsMerge,
  TableCellsSplit,
  Columns3,
  Rows3,
  Trash2,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { defaultPageMargin, placeholderFields, defaultSettings } from "@/data/defaults";
import { AppLink, useAppRouter } from "@/lib/router";
import {
  clearTemplateDraft,
  createTemplate,
  getTemplateDraft,
  normalizePageMargin,
  saveTemplateDraft,
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

const newTemplateDraftId = "new-template";

const starterHtml =
  '<h1 style="text-align:center"><strong>JUDUL SURAT</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, menerangkan bahwa:</p><table><tbody><tr><td>Nama</td><td>:</td><td>{{nama_warga}}</td></tr><tr><td>NIK</td><td>:</td><td>{{nik}}</td></tr><tr><td>Alamat</td><td>:</td><td>{{alamat}}</td></tr></tbody></table><p>Surat ini dibuat untuk dipergunakan sebagai {{keperluan}}.</p><p style="text-align:right">{{nama_desa}}, {{tanggal_surat}}<br>Kepala Desa {{nama_desa}}</p><p style="text-align:right"><br><br><strong>{{nama_kepala_desa}}</strong></p>';

function ToolbarButton({
  active,
  children,
  disabled,
  onClick,
  title,
}) {
  return (
    <button
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition ${
        active
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

function AddTemplateToolbar({ editor, isFullscreen, onToggleFullscreen, onZoomChange, placeholders, previewZoom }) {
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
        <span className="ml-1">+</span>
      </ToolbarButton>
      <ToolbarButton disabled={!editor.can().addColumnAfter()} onClick={() => editor.chain().focus().addColumnAfter().run()} title="Tambah kolom">
        <Columns3 className="h-4 w-4" />
        <span className="ml-1">+</span>
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
      // Keep rendering the page if the editor cannot parse the provided HTML.
    }
    return false;
  }
}

export default function AddTemplatePage() {
  const router = useAppRouter();
  const successTimerRef = useRef(null);
  const navigateTimerRef = useRef(null);
  const [code, setCode] = useState("");
  const [contentHtml, setContentHtml] = useState(starterHtml);
  const [isActive, setIsActive] = useState(true);
  const [name, setName] = useState("");
  const [pageMargin, setPageMargin] = useState(defaultPageMargin);
  const [saving, setSaving] = useState(false);
  const [sortOrder, setSortOrder] = useState(50);
  const [status, setStatus] = useState("Isi data template baru.");
  const [savedNotice, setSavedNotice] = useState("");
  const [settings, setSettings] = useState(defaultSettings);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [previewZoom, setPreviewZoom] = useState(1);
  const templateValidation = validateTemplateContent(contentHtml);

  useEffect(() => {
    setSettings(getSettings());
    const draft = getTemplateDraft(newTemplateDraftId);

    if (draft) {
      setCode(draft.code ?? "");
      setContentHtml(draft.contentHtml ?? starterHtml);
      setInternalNotes(draft.internalNotes ?? "");
      setIsActive(Boolean(draft.isActive ?? true));
      setName(draft.name ?? "");
      setPageMargin(normalizePageMargin(draft.pageMargin));
      setSortOrder(draft.sortOrder ?? 50);
      setStatus("Draft autosave template baru dimuat.");
    }
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(successTimerRef.current);
      window.clearTimeout(navigateTimerRef.current);
    };
  }, []);

  const editor = useEditor({
    content: contentHtml,
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[760px] outline-none",
      },
    },
    extensions: [
      StarterKit,
      Table.configure({ resizable: false }),
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
    applyEditorContent(editor, contentHtml);
  }, [editor]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      saveTemplateDraft(newTemplateDraftId, {
        code,
        contentHtml,
        internalNotes,
        isActive,
        name,
        pageMargin: normalizePageMargin(pageMargin),
        sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 50,
      });
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [code, contentHtml, internalNotes, isActive, name, pageMargin, sortOrder]);

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

  function saveTemplate() {
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedName || !trimmedCode) {
      setStatus("Nama template dan kode wajib diisi.");
      return;
    }

    setSaving(true);
    createTemplate({
      category: "Umum",
      code: trimmedCode,
      contentHtml: editor?.getHTML() ?? contentHtml,
      internalNotes,
      isActive,
      name: trimmedName,
      pageMargin: normalizePageMargin(pageMargin),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    });
    clearTemplateDraft(newTemplateDraftId);
    setStatus("Template baru berhasil disimpan di browser.");
    setSavedNotice("Template berhasil disimpan.");
    window.clearTimeout(successTimerRef.current);
    successTimerRef.current = window.setTimeout(() => setSavedNotice(""), 2200);
    window.clearTimeout(navigateTimerRef.current);
    navigateTimerRef.current = window.setTimeout(() => {
      setSaving(false);
      router.navigate("/templates");
    }, 900);
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

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary-700">Tambah Template</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">Template surat baru</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{status}</p>
            </div>
            <AppLink
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
              href="/templates"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </AppLink>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="templateName">
              Nama Template
              <input
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                id="templateName"
                onChange={(event) => setName(event.target.value)}
                placeholder="Surat Keterangan ..."
                value={name}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700" htmlFor="templateCode">
              Kode Surat
              <input
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm uppercase outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                id="templateCode"
                onChange={(event) => setCode(event.target.value)}
                placeholder="SKD"
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
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="active">
              <input
                checked={isActive}
                className="h-4 w-4 accent-primary-700"
                id="active"
                onChange={(event) => setIsActive(event.target.checked)}
                type="checkbox"
              />
              Aktif
            </label>
            <label className="block text-sm font-medium text-gray-700 md:col-span-2" htmlFor="internalNotes">
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
        </section>

        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-[80] overflow-auto bg-gray-100"
              : "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card"
          }
        >
          <div className="overflow-x-auto">
            <AddTemplateToolbar
              editor={editor}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((current) => !current)}
              onZoomChange={setPreviewZoom}
              placeholders={templateValidation.placeholders}
              previewZoom={previewZoom}
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
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-6 text-gray-700 shadow-card">
          <h4 className="text-lg font-bold text-gray-900">Pemeriksaan Template</h4>
          {templateValidation.unknownPlaceholders.length ? (
            <p className="mt-2 text-red-700">
              Placeholder tidak dikenal: {templateValidation.unknownPlaceholders.map((key) => `{{${key}}}`).join(", ")}
            </p>
          ) : (
            <p className="mt-2 text-green-700">Tidak ada placeholder salah ketik.</p>
          )}
          {templateValidation.missingImportantPlaceholders.length ? (
            <p className="mt-2 text-amber-700">
              Belum ada placeholder penting: {templateValidation.missingImportantPlaceholders.map((key) => `{{${key}}}`).join(", ")}
            </p>
          ) : (
            <p className="mt-2 text-green-700">Nomor dan tanggal surat sudah tersedia.</p>
          )}
          {templateValidation.tableWarnings.length ? (
            <p className="mt-2 text-amber-700">
              Ada tabel dengan lebih dari 4 kolom: tabel {templateValidation.tableWarnings.map((table) => table.index).join(", ")}. Periksa agar tidak melebar saat print A4.
            </p>
          ) : (
            <p className="mt-2 text-green-700">Lebar tabel masih aman untuk A4.</p>
          )}
          {templateValidation.likelyLongForPrint ? (
            <p className="mt-2 text-amber-700">
              Konten template cukup panjang. Lakukan uji print karena kemungkinan melewati satu halaman A4.
            </p>
          ) : (
            <p className="mt-2 text-green-700">Panjang konten masih wajar untuk satu halaman.</p>
          )}
        </section>

        <button
          className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={saving}
          onClick={saveTemplate}
          type="button"
        >
          <Save className="h-4 w-4" />
          Simpan Template Baru
        </button>
      </div>
    </section>
  );
}
