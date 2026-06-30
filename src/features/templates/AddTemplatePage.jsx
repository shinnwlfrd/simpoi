import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Save,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { defaultPageMargin, placeholderFields, defaultSettings } from "@/data/defaults";
import { AppLink, useAppRouter } from "@/lib/router";
import { createTemplate, normalizePageMargin, getSettings } from "@/services/local-storage";

const starterHtml =
  '<h1 style="text-align:center"><strong>JUDUL SURAT</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, menerangkan bahwa:</p><table><tbody><tr><td>Nama</td><td>:</td><td>{{nama_warga}}</td></tr><tr><td>NIK</td><td>:</td><td>{{nik}}</td></tr><tr><td>Alamat</td><td>:</td><td>{{alamat}}</td></tr></tbody></table><p>Surat ini dibuat untuk dipergunakan sebagai {{keperluan}}.</p><p style="text-align:right">{{nama_desa}}, {{tanggal_surat}}<br>Kepala Desa {{nama_desa}}</p><p style="text-align:right"><br><br><strong>{{nama_kepala_desa}}</strong></p>';

function alignedFieldsHtml() {
  return '<table><tbody><tr><td>Nama</td><td>:</td><td>{{nama_warga}}</td></tr><tr><td>NIK</td><td>:</td><td>{{nik}}</td></tr><tr><td>Tempat/Tanggal Lahir</td><td>:</td><td>{{tempat_lahir}}, {{tanggal_lahir}}</td></tr><tr><td>Jenis Kelamin</td><td>:</td><td>{{jenis_kelamin}}</td></tr><tr><td>Agama</td><td>:</td><td>{{agama}}</td></tr><tr><td>Pekerjaan</td><td>:</td><td>{{pekerjaan}}</td></tr><tr><td>Alamat</td><td>:</td><td>{{alamat}}</td></tr></tbody></table>';
}

function ToolbarButton({
  active,
  children,
  onClick,
  title,
}) {
  return (
    <button
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition ${
        active
          ? "border-primary-700 bg-primary-100 text-primary-900"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
      }`}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

function AddTemplateToolbar({ editor }) {
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
      <ToolbarButton onClick={() => editor.chain().focus().insertContent(alignedFieldsHtml()).run()} title="Ratakan titik dua">
        <List className="h-4 w-4" />
        <span className="ml-1">:</span>
      </ToolbarButton>
      <select
        className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-700"
        onChange={(event) => {
          if (event.target.value) {
            editor.chain().focus().insertContent(`{{${event.target.value}}}`).run();
            event.target.value = "";
          }
        }}
        value=""
      >
        <option value="">Insert Placeholder</option>
        {placeholderFields.map((placeholder) => (
          <option key={placeholder.key} value={placeholder.key}>
            {placeholder.label}
          </option>
        ))}
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

export default function AddTemplatePage() {
  const router = useAppRouter();
  const [code, setCode] = useState("");
  const [contentHtml, setContentHtml] = useState(starterHtml);
  const [isActive, setIsActive] = useState(true);
  const [name, setName] = useState("");
  const [pageMargin, setPageMargin] = useState(defaultPageMargin);
  const [saving, setSaving] = useState(false);
  const [sortOrder, setSortOrder] = useState(50);
  const [status, setStatus] = useState("Isi data template baru.");
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    setSettings(getSettings());
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
      isActive,
      name: trimmedName,
      pageMargin: normalizePageMargin(pageMargin),
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    });
    setStatus("Template baru berhasil disimpan di browser.");
    setSaving(false);
    router.navigate("/templates");
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div className="space-y-6">
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

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
          <AddTemplateToolbar editor={editor} />
          <div className="bg-gray-100 p-4 md:p-6">
            <div
              className="sheet-a4 mx-auto bg-white shadow-card"
              style={{
                padding: `${pageMargin.top}cm ${pageMargin.right}cm ${pageMargin.bottom}cm ${pageMargin.left}cm`,
              }}
            >
              <div className="border-b-4 border-black pb-4 text-center mb-6">
                {settings.logoBase64 ? (
                  <img alt="Logo desa" className="letter-logo mx-auto mb-2 h-16 w-16 object-contain" src={settings.logoBase64} />
                ) : null}
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                  Pemerintah Kabupaten {settings.regencyName}
                </p>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                  Kecamatan {settings.districtName}
                </p>
                <h3 className="mt-1 text-2xl font-bold uppercase text-black">{settings.villageName}</h3>
                <p className="mt-1 text-sm text-black">{settings.villageAddress}</p>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

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
