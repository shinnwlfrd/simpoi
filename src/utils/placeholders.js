import { placeholderFields } from "@/data/defaults";
import { formatIndonesianDate } from "@/utils/date";

export function extractPlaceholders(content) {
  return [...content.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)]
    .map((match) => match[1])
    .filter((value, index, values) => values.indexOf(value) === index);
}

export function getPlaceholderField(key) {
  return (
    placeholderFields.find((field) => field.key === key) ?? {
      key,
      label: key.replaceAll("_", " "),
      sample: key.replaceAll("_", " "),
      type: "text",
    }
  );
}

/**
 * Placeholder keys that are automatically filled from Settings and should NOT
 * appear as manual input fields in the "Buat Surat" form.
 */
const autoFilledKeys = [
  "nama_desa",
  "kecamatan",
  "kabupaten",
  "alamat_desa",
  "nama_kepala_desa",
  "nip_kepala_desa",
  "pangkat_kepala_desa",
  "nama_pejabat_atasan",
  "jabatan_pejabat_atasan",
  "nip_pejabat_atasan",
  "pangkat_pejabat_atasan",
  "tempat_surat",
];

export function getFieldsForTemplate(contentHtml) {
  return extractPlaceholders(contentHtml)
    .filter((key) => !autoFilledKeys.includes(key))
    .map(getPlaceholderField);
}

export function buildTemplateValues(formValues, settings, letterNumber) {
  return {
    ...formValues,
    alamat_desa: settings.villageAddress,
    kabupaten: settings.regencyName,
    kecamatan: settings.districtName,
    nama_desa: settings.villageName,
    nama_kepala_desa: settings.headVillageName,
    nip_kepala_desa: settings.headVillageNip,
    pangkat_kepala_desa: settings.headVillageRank || "",
    nama_pejabat_atasan: settings.superiorName || "",
    jabatan_pejabat_atasan: settings.superiorTitle || "",
    nip_pejabat_atasan: settings.superiorNip || "",
    pangkat_pejabat_atasan: settings.superiorRank || "",
    tempat_surat: settings.villagePlaceName || settings.villageName,
    nomor_surat: formValues.nomor_surat || letterNumber,
    tanggal_surat: formValues.tanggal_surat || formatIndonesianDate(new Date()),
  };
}

export function replacePlaceholders(content, values) {
  return content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = values[key];
    return value?.trim() ? value : `{{${key}}}`;
  });
}
