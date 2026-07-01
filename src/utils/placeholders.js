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
  "email_desa",
  "jabatan_kepala_desa",
  "nama_kepala_desa",
  "nip_kepala_desa",
  "pangkat_kepala_desa",
  "nama_pejabat_atasan",
  "jabatan_pejabat_atasan",
  "nip_pejabat_atasan",
  "pangkat_pejabat_atasan",
  "tempat_surat",
  "kode_pos",
  "media_sosial_desa",
];

export function getFieldsForTemplate(contentHtml) {
  return extractPlaceholders(contentHtml)
    .filter((key) => !autoFilledKeys.includes(key))
    .map(getPlaceholderField);
}

export function buildTemplateValues(formValues, settings, signatory) {
  const chosenTitle = signatory || settings.headVillageTitle || "Kepala Ohoi";

  let headVillageName = settings.headVillageName;
  let headVillageNip = settings.headVillageNip;

  if (chosenTitle === "Pj. Kepala Desa") {
    headVillageName = settings.headVillageName_pjDesa || settings.headVillageName || "";
    headVillageNip = settings.headVillageNip_pjDesa || settings.headVillageNip || "";
  } else {
    headVillageName = settings.headVillageName_kepalaOhoi || settings.headVillageName || "";
    headVillageNip = settings.headVillageNip_kepalaOhoi || settings.headVillageNip || "";
  }

  return {
    ...formValues,
    alamat_desa: settings.villageAddress,
    email_desa: settings.villageEmail || "",
    jabatan_kepala_desa: chosenTitle,
    kabupaten: settings.regencyName,
    kode_pos: settings.villagePostalCode || "",
    kecamatan: settings.districtName,
    media_sosial_desa: settings.villageSocialMedia || "",
    nama_desa: settings.villageName,
    nama_kepala_desa: headVillageName,
    nip_kepala_desa: headVillageNip,
    pangkat_kepala_desa: "",
    nama_pejabat_atasan: settings.superiorName || "",
    jabatan_pejabat_atasan: settings.superiorTitle || "",
    nip_pejabat_atasan: settings.superiorNip || "",
    pangkat_pejabat_atasan: settings.superiorRank || "",
    tempat_surat: settings.villagePlaceName || settings.villageName,
    nomor_surat: formValues.nomor_surat || "",
    tanggal_surat: formValues.tanggal_surat || formatIndonesianDate(new Date()),
  };
}

export function replacePlaceholders(content, values) {
  return content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = values[key];
    return value?.trim() ? value : `{{${key}}}`;
  });
}
