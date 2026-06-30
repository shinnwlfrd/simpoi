import { Hash, MessageCircle, Printer, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { defaultPageMargin, defaultSettings, defaultTemplates } from "@/data/defaults";
import { getSettings, getTemplates, normalizePageMargin, subscribesimpoiStorage } from "@/services/local-storage";
import { formatIndonesianDate } from "@/utils/date";
import { generateLetterNumber } from "@/utils/letter-number";
import { buildTemplateValues, getFieldsForTemplate, replacePlaceholders } from "@/utils/placeholders";
import { createWhatsappUrl, normalizeWhatsappPhone } from "@/utils/whatsapp";

function normalizeFormValues(fields, values) {
  return fields.reduce((current, field) => {
    const value = values[field.key] ?? "";
    current[field.key] = field.type === "date" && value ? formatIndonesianDate(value) : value;
    return current;
  }, {});
}

export default function CreateLetterPage() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [settings, setSettings] = useState(defaultSettings);
  const [selectedId, setSelectedId] = useState(defaultTemplates[0].id);
  const [formValues, setFormValues] = useState({});
  const [waPhone, setWaPhone] = useState("");
  const [status, setStatus] = useState("Pilih template dan isi data surat.");

  function loadLocalData() {
    const activeTemplates = getTemplates({ activeOnly: true });
    const availableTemplates = activeTemplates.length ? activeTemplates : defaultTemplates;

    setTemplates(availableTemplates);
    setSettings(getSettings());
    setSelectedId((current) => availableTemplates.find((template) => template.id === current)?.id ?? availableTemplates[0].id);
    setStatus("Data dimuat dari penyimpanan lokal browser.");
  }

  useEffect(() => {
    loadLocalData();
    return subscribesimpoiStorage(loadLocalData);
  }, []);

  const selectedTemplate = templates.find((template) => template.id === selectedId) ?? templates[0];
  const pageMargin = selectedTemplate?.pageMargin
    ? normalizePageMargin(selectedTemplate.pageMargin)
    : defaultPageMargin;
  const fields = useMemo(
    () => getFieldsForTemplate(selectedTemplate?.contentHtml ?? ""),
    [selectedTemplate?.contentHtml],
  );
  const templateValues = selectedTemplate
    ? buildTemplateValues(normalizeFormValues(fields, formValues), settings, formValues.nomor_surat ?? "")
    : {};
  const previewHtml = selectedTemplate
    ? replacePlaceholders(selectedTemplate.contentHtml, templateValues)
    : "";
  const whatsappMessage = selectedTemplate
    ? replacePlaceholders(settings.whatsappTemplate, {
      ...templateValues,
      nama_template: selectedTemplate.name,
    })
    : "";
  const whatsappUrl = createWhatsappUrl(waPhone, whatsappMessage);

  function updateField(key, value) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setFormValues({});
    setWaPhone("");
    setStatus("Form dikosongkan. Data warga tidak disimpan.");
  }

  function handleAutoNumber() {
    if (!selectedTemplate) {
      return;
    }

    const format = settings.letterNumberFormat || "{nomor}/{kode}/{kode_instansi}/{bulan}/{tahun}";
    const generatedNumber = generateLetterNumber({
      format,
      templateCode: selectedTemplate.code,
      institutionCode: settings.letterNumberPrefix || "",
      autoIncrement: true,
    });

    updateField("nomor_surat", generatedNumber);
    setStatus(`Nomor surat otomatis: ${generatedNumber}`);
  }

  function downloadPdf() {
    window.print();
  }

  function renderField(field) {
    const value = formValues[field.key] ?? "";

    if (field.type === "textarea") {
      return (
        <label
          className="block text-sm font-medium text-gray-700 md:col-span-2"
          htmlFor={field.key}
          key={field.key}
        >
          {field.label}
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
            id={field.key}
            onChange={(event) => updateField(field.key, event.target.value)}
            placeholder={field.sample}
            value={value}
          />
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <label className="block text-sm font-medium text-gray-700" htmlFor={field.key} key={field.key}>
          {field.label}
          <select
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
            id={field.key}
            onChange={(event) => updateField(field.key, event.target.value)}
            value={value}
          >
            <option value="">Pilih</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </label>
      );
    }

    if (field.type === "select_sifat") {
      return (
        <label className="block text-sm font-medium text-gray-700" htmlFor={field.key} key={field.key}>
          {field.label}
          <select
            className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
            id={field.key}
            onChange={(event) => updateField(field.key, event.target.value)}
            value={value}
          >
            <option value="">Pilih</option>
            <option value="biasa">Biasa</option>
            <option value="penting">Penting</option>
            <option value="rahasia">Rahasia</option>
          </select>
        </label>
      );
    }

    // Special handling for nomor_surat: add auto-number button
    if (field.key === "nomor_surat") {
      return (
        <label className="block text-sm font-medium text-gray-700" htmlFor={field.key} key={field.key}>
          {field.label}
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
              id={field.key}
              onChange={(event) => updateField(field.key, event.target.value)}
              placeholder={field.sample}
              type="text"
              value={value}
            />
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-primary-400 bg-white px-3 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
              onClick={handleAutoNumber}
              title="Generate nomor surat otomatis"
              type="button"
            >
              <Hash className="h-4 w-4" />
              Auto
            </button>
          </div>
        </label>
      );
    }

    return (
      <label className="block text-sm font-medium text-gray-700" htmlFor={field.key} key={field.key}>
        {field.label}
        <input
          className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
          id={field.key}
          onChange={(event) => updateField(field.key, event.target.value)}
          placeholder={field.sample}
          type={field.type}
          value={value}
        />
      </label>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-5 lg:px-8">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="no-print space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
          <p className="text-sm font-semibold text-primary-700">Buat Surat</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">Pilih template</h3>
          <p className="mt-2 text-sm leading-6 text-gray-500">{status}</p>

          <label className="mt-5 block text-sm font-medium text-gray-700" htmlFor="template">
            Template Surat
            <select
              className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
              id="template"
              onChange={(event) => {
                setSelectedId(event.target.value);
                setFormValues({});
              }}
              value={selectedTemplate?.id ?? ""}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
          <h3 className="text-xl font-bold text-gray-900">Data Surat</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {fields.map((field) => renderField(field))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-auto"
              onClick={resetForm}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Kosongkan Form
            </button>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-400 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 sm:w-auto"
              onClick={downloadPdf}
              type="button"
            >
              <Printer className="h-4 w-4" />
              Download PDF
            </button>
          </div>

          <label className="mt-5 block text-sm font-medium text-gray-700" htmlFor="waPhone">
            Nomor WhatsApp Tujuan
            <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
                id="waPhone"
                onChange={(event) => setWaPhone(event.target.value)}
                placeholder="081234567890"
                value={waPhone}
              />
              <a
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold ${whatsappUrl ? "bg-primary-700 text-white" : "pointer-events-none bg-gray-200 text-gray-500"
                  }`}
                href={whatsappUrl || "#"}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-4 w-4" />
                Buka WhatsApp
              </a>
            </div>
            {normalizeWhatsappPhone(waPhone) ? (
              <span className="mt-1 block text-xs text-gray-500">Format: {normalizeWhatsappPhone(waPhone)}</span>
            ) : null}
          </label>
        </section>
        </div>

        <div className="overflow-x-auto pb-2">
          <aside
            className="print-area sheet-a4 mx-auto w-[210mm] min-w-[210mm] bg-white text-black shadow-card max-sm:mx-0 max-sm:shadow-none"
            style={{
              padding: `${pageMargin.top}cm ${pageMargin.right}cm ${pageMargin.bottom}cm ${pageMargin.left}cm`,
            }}
          >
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
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
                <p className="mt-1 text-sm text-black">{settings.villageAddress}</p>
              </div>
            </div>
            <article
              className="letter-content mt-8 font-serif text-[12pt] leading-7 text-black"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
