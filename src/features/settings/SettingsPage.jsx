import { ImageIcon, Save, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { defaultSettings, placeholderFields } from "@/data/defaults";
import { getSettings, saveSettings, subscribesimpoiStorage } from "@/services/local-storage";

const whatsappPlaceholders = [
  { key: "nama_template", label: "Nama Template" },
  ...placeholderFields,
];

export default function SettingsPage() {
  const whatsappTextareaRef = useRef(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [status, setStatus] = useState("Memuat pengaturan lokal...");

  function loadSettings() {
    setSettings(getSettings());
    setStatus("Pengaturan dimuat dari browser.");
  }

  useEffect(() => {
    loadSettings();
    return subscribesimpoiStorage(loadSettings);
  }, []);

  function updateField(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function uploadLogo(file) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("logoBase64", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function persistSettings() {
    saveSettings(settings);
    setStatus("Pengaturan berhasil disimpan di browser.");
  }

  function insertWhatsappPlaceholder(key) {
    if (!key) {
      return;
    }

    const placeholder = `{{${key}}}`;
    const textarea = whatsappTextareaRef.current;
    const currentMessage = settings.whatsappTemplate ?? "";
    const selectionStart = textarea?.selectionStart ?? currentMessage.length;
    const selectionEnd = textarea?.selectionEnd ?? selectionStart;
    const nextMessage = `${currentMessage.slice(0, selectionStart)}${placeholder}${currentMessage.slice(selectionEnd)}`;
    const nextCursorPosition = selectionStart + placeholder.length;

    updateField("whatsappTemplate", nextMessage);

    requestAnimationFrame(() => {
      whatsappTextareaRef.current?.focus();
      whatsappTextareaRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  }

  const identityFields = [
    ["villageName", "Nama Desa / Ohoi"],
    ["districtName", "Kecamatan"],
    ["regencyName", "Kabupaten"],
    ["villageAddress", "Alamat Desa", true],
    ["villagePlaceName", "Tempat Surat (untuk 'Dikeluarkan di...')"],
    ["headVillageName", "Nama Kepala Desa / Ohoi"],
    ["headVillageNip", "NIP Kepala Desa"],
    ["headVillageRank", "Pangkat Kepala Desa"],
  ];

  const superiorFields = [
    ["superiorName", "Nama Pejabat Atasan (Camat)"],
    ["superiorTitle", "Jabatan Pejabat Atasan"],
    ["superiorNip", "NIP Pejabat Atasan"],
    ["superiorRank", "Pangkat Pejabat Atasan"],
  ];

  const letterNumberFields = [
    ["letterNumberPrefix", "Kode Instansi (prefix nomor surat)"],
    ["letterNumberFormat", "Format Nomor Surat"],
  ];

  function renderSettingsField([key, label, fullWidth]) {
    return (
      <label
        className={`block text-sm font-medium text-gray-700${fullWidth ? " md:col-span-2" : ""}`}
        htmlFor={key}
        key={key}
      >
        {label}
        <input
          className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
          id={key}
          onChange={(event) => updateField(key, event.target.value)}
          value={settings[key] ?? ""}
        />
      </label>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-5 py-6 lg:px-8">
      {/* Identitas Desa */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <p className="text-sm font-semibold text-primary-700">Pengaturan</p>
        <h3 className="mt-1 text-2xl font-bold text-gray-900">Identitas Desa</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">{status}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {identityFields.map(renderSettingsField)}

          <label className="block text-sm font-medium text-gray-700 md:col-span-2" htmlFor="logoBase64">
            Logo Desa
            <div className="mt-2 grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[112px_minmax(0,1fr)]">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-gray-300 bg-white">
                {settings.logoBase64 ? (
                  <img alt="Logo desa" className="h-20 w-20 object-contain" src={settings.logoBase64} />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 space-y-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                  <input
                    accept="image/*"
                    className="sr-only"
                    id="logoBase64"
                    onChange={(event) => uploadLogo(event.target.files?.[0])}
                    type="file"
                  />
                </label>
                <button
                  className="ml-0 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:ml-3"
                  onClick={() => updateField("logoBase64", "")}
                  type="button"
                >
                  Hapus Logo
                </button>
                <p className="text-sm leading-6 text-gray-500">
                  Logo disimpan sebagai data lokal browser agar tetap tersedia saat offline.
                </p>
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* Pejabat Atasan (Mengetahui) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <h3 className="text-xl font-bold text-gray-900">Pejabat Atasan (Mengetahui)</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Data pejabat atasan yang menandatangani kolom &quot;Mengetahui&quot; pada surat tertentu (misal: Camat).
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {superiorFields.map(renderSettingsField)}
        </div>
      </section>

      {/* Nomor Surat Otomatis */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <h3 className="text-xl font-bold text-gray-900">Nomor Surat Otomatis</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Konfigurasi format auto-numbering. Gunakan token: <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">{"{nomor}"}</code> (urutan),{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">{"{kode}"}</code> (kode surat),{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">{"{kode_instansi}"}</code> (prefix),{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">{"{bulan}"}</code> (Romawi),{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">{"{tahun}"}</code>.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {letterNumberFields.map(renderSettingsField)}
        </div>
      </section>

      {/* WhatsApp Template */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <h3 className="text-xl font-bold text-gray-900">Template Pesan WhatsApp</h3>
        <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="whatsappPlaceholder">
          Tambah Placeholder
          <select
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
            id="whatsappPlaceholder"
            onChange={(event) => {
              insertWhatsappPlaceholder(event.target.value);
              event.target.value = "";
            }}
            value=""
          >
            <option value="">Pilih placeholder</option>
            {whatsappPlaceholders.map((placeholder) => (
              <option key={placeholder.key} value={placeholder.key}>
                {placeholder.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="whatsappTemplate">
          Pesan
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
            id="whatsappTemplate"
            onChange={(event) => updateField("whatsappTemplate", event.target.value)}
            ref={whatsappTextareaRef}
            value={settings.whatsappTemplate}
          />
        </label>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Bisa memakai placeholder seperti {"{{nama_template}}"}, {"{{nama_warga}}"}, dan {"{{nomor_surat}}"}.
        </p>
      </section>

      <button
        className="inline-flex items-center gap-2 rounded-2xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
        onClick={persistSettings}
        type="button"
      >
        <Save className="h-4 w-4" />
        Simpan Pengaturan
      </button>
    </section>
  );
}
