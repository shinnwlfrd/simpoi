import { ArrowLeft, CheckCircle2, ImageIcon, PenLine, Save, Stamp, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { defaultSettings, placeholderFields } from "@/data/defaults";
import { AppLink } from "@/lib/router";
import { getSettings, saveSettings, subscribesimpoiStorage } from "@/services/local-storage";

const whatsappPlaceholders = [
  { key: "nama_template", label: "Nama Template" },
  ...placeholderFields,
];

export default function SettingsPage() {
  const whatsappTextareaRef = useRef(null);
  const savedNoticeTimerRef = useRef(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [status, setStatus] = useState("Memuat pengaturan lokal...");
  const [savedNotice, setSavedNotice] = useState("");

  function loadSettings() {
    setSettings(getSettings());
    setStatus("Pengaturan dimuat dari browser.");
  }

  useEffect(() => {
    loadSettings();
    return subscribesimpoiStorage(loadSettings);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(savedNoticeTimerRef.current);
  }, []);

  function updateField(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function uploadImage(file, fieldKey) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField(fieldKey, reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function persistSettings() {
    saveSettings(settings);
    setStatus("Pengaturan berhasil disimpan di browser.");
    setSavedNotice("Pengaturan berhasil disimpan.");
    window.clearTimeout(savedNoticeTimerRef.current);
    savedNoticeTimerRef.current = window.setTimeout(() => setSavedNotice(""), 2200);
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

  const headVillageTitle = settings.headVillageTitle ?? "Kepala Ohoi";
  const nameKey = headVillageTitle === "Pj. Kepala Desa" ? "headVillageName_pjDesa" : "headVillageName_kepalaOhoi";
  const nipKey = headVillageTitle === "Pj. Kepala Desa" ? "headVillageNip_pjDesa" : "headVillageNip_kepalaOhoi";

  const identityFields = [
    ["villageName", "Nama Desa / Ohoi"],
    ["districtName", "Kecamatan"],
    ["regencyName", "Kabupaten"],
    ["villageAddress", "Alamat Desa", true],
    ["villagePostalCode", "Kode Pos"],
    ["villageEmail", "Email Desa"],
    ["villageSocialMedia", "Media Sosial Desa", true],
    ["villagePlaceName", "Tempat Surat (untuk 'Dikeluarkan di...')"],
    ["headVillageTitle", "Jabatan Pemimpin Desa"],
    [nameKey, headVillageTitle === "Pj. Kepala Desa" ? "Nama Pj. Kepala Desa" : "Nama Kepala Ohoi"],
    [nipKey, headVillageTitle === "Pj. Kepala Desa" ? "NIP Pj. Kepala Desa" : "NIP Kepala Ohoi"],
  ];

  const superiorFields = [
    ["superiorName", "Nama Pejabat Atasan (Camat)"],
    ["superiorTitle", "Jabatan Pejabat Atasan"],
    ["superiorNip", "NIP Pejabat Atasan"],
    ["superiorRank", "Pangkat Pejabat Atasan"],
  ];

  function renderSettingsField([key, label, fullWidth]) {
    if (key === "headVillageTitle") {
      return (
        <label className="block text-sm font-medium text-gray-700" htmlFor={key} key={key}>
          {label}
          <select
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
            id={key}
            onChange={(event) => updateField(key, event.target.value)}
            value={settings[key] ?? "Kepala Ohoi"}
          >
            <option value="Kepala Ohoi">Kepala Ohoi</option>
            <option value="Pj. Kepala Desa">Pj. Kepala Desa</option>
          </select>
        </label>
      );
    }

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
      {savedNotice ? (
        <div className="save-notice rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-card">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-semibold">{savedNotice}</p>
          </div>
        </div>
      ) : null}

      {/* Identitas Desa */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary-700">Pengaturan</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">Identitas Desa</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">{status}</p>
          </div>
          <AppLink
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
            href="/dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </AppLink>
        </div>

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
                    onChange={(event) => uploadImage(event.target.files?.[0], "logoBase64")}
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

      {/* Cap & Tanda Tangan */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
        <h3 className="text-xl font-bold text-gray-900">Cap & Tanda Tangan</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Upload gambar cap dinas dan tanda tangan pejabat desa. Gambar akan muncul otomatis di area tanda tangan surat saat preview dan cetak.
          Gunakan gambar dengan latar belakang transparan (PNG) untuk hasil terbaik.
        </p>

        {/* Kepala Ohoi */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-primary-700">Kepala Ohoi</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {/* Cap Kepala Ohoi */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">Cap Dinas</p>
              <div className="checkerboard-bg flex h-28 w-28 items-center justify-center rounded-2xl border border-gray-300">
                {settings.stampBase64_kepalaOhoi ? (
                  <img alt="Cap dinas Kepala Ohoi" className="h-24 w-24 object-contain" src={settings.stampBase64_kepalaOhoi} />
                ) : (
                  <Stamp className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                  <Upload className="h-4 w-4" />
                  Upload Cap
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => uploadImage(event.target.files?.[0], "stampBase64_kepalaOhoi")}
                    type="file"
                  />
                </label>
                <button
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  onClick={() => updateField("stampBase64_kepalaOhoi", "")}
                  type="button"
                >
                  Hapus
                </button>
              </div>
            </div>

            {/* Tanda Tangan Kepala Ohoi */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">Tanda Tangan</p>
              <div className="checkerboard-bg flex h-28 w-28 items-center justify-center rounded-2xl border border-gray-300">
                {settings.signatureBase64_kepalaOhoi ? (
                  <img alt="Tanda tangan Kepala Ohoi" className="h-20 w-24 object-contain" src={settings.signatureBase64_kepalaOhoi} />
                ) : (
                  <PenLine className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                  <Upload className="h-4 w-4" />
                  Upload TTD
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => uploadImage(event.target.files?.[0], "signatureBase64_kepalaOhoi")}
                    type="file"
                  />
                </label>
                <button
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  onClick={() => updateField("signatureBase64_kepalaOhoi", "")}
                  type="button"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pj. Kepala Desa */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-primary-700">Pj. Kepala Desa</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {/* Cap Pj. Kepala Desa */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">Cap Dinas</p>
              <div className="checkerboard-bg flex h-28 w-28 items-center justify-center rounded-2xl border border-gray-300">
                {settings.stampBase64_pjDesa ? (
                  <img alt="Cap dinas Pj. Kepala Desa" className="h-24 w-24 object-contain" src={settings.stampBase64_pjDesa} />
                ) : (
                  <Stamp className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                  <Upload className="h-4 w-4" />
                  Upload Cap
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => uploadImage(event.target.files?.[0], "stampBase64_pjDesa")}
                    type="file"
                  />
                </label>
                <button
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  onClick={() => updateField("stampBase64_pjDesa", "")}
                  type="button"
                >
                  Hapus
                </button>
              </div>
            </div>

            {/* Tanda Tangan Pj. Kepala Desa */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">Tanda Tangan</p>
              <div className="checkerboard-bg flex h-28 w-28 items-center justify-center rounded-2xl border border-gray-300">
                {settings.signatureBase64_pjDesa ? (
                  <img alt="Tanda tangan Pj. Kepala Desa" className="h-20 w-24 object-contain" src={settings.signatureBase64_pjDesa} />
                ) : (
                  <PenLine className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                  <Upload className="h-4 w-4" />
                  Upload TTD
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => uploadImage(event.target.files?.[0], "signatureBase64_pjDesa")}
                    type="file"
                  />
                </label>
                <button
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  onClick={() => updateField("signatureBase64_pjDesa", "")}
                  type="button"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-500">
          Gambar disimpan sebagai data lokal browser agar tetap tersedia saat offline.
        </p>
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

      {savedNotice ? (
        <div className="save-notice rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-card">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-semibold">{savedNotice}</p>
          </div>
        </div>
      ) : null}

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
