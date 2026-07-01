import { placeholderFields } from "@/data/defaults";
import { extractPlaceholders } from "@/utils/placeholders";

export const importantTemplatePlaceholders = ["nomor_surat", "tanggal_surat"];

export const templateBlocks = [
  {
    id: "letterhead",
    label: "Kop Surat",
    html: '<table style="width:100%;border-bottom:4px solid #000;margin-bottom:1.5em"><tbody><tr><td style="width:3.2cm;text-align:center;vertical-align:middle">LOGO</td><td style="text-align:center;vertical-align:middle"><p><strong>PEMERINTAH KABUPATEN {{kabupaten}}</strong><br><strong>KECAMATAN {{kecamatan}}</strong></p><h2><strong>DESA {{nama_desa}}</strong></h2><p>{{alamat_desa}} {{kode_pos}}<br>{{email_desa}} {{media_sosial_desa}}</p></td></tr></tbody></table>',
  },
  {
    id: "resident-fields",
    label: "Data Warga",
    html: fieldTable([
      ["Nama", "{{nama_warga}}"],
      ["NIK", "{{nik}}"],
      ["Tempat/Tanggal Lahir", "{{tempat_lahir}}, {{tanggal_lahir}}"],
      ["Jenis Kelamin", "{{jenis_kelamin}}"],
      ["Agama", "{{agama}}"],
      ["Pekerjaan", "{{pekerjaan}}"],
      ["Alamat", "{{alamat}}"],
    ]),
  },
  {
    id: "short-resident-fields",
    label: "Data Warga Ringkas",
    html: fieldTable([
      ["Nama", "{{nama_warga}}"],
      ["NIK", "{{nik}}"],
      ["Alamat", "{{alamat}}"],
    ]),
  },
  {
    id: "business-fields",
    label: "Data Usaha",
    html: fieldTable([
      ["Nama Usaha", "{{nama_usaha}}"],
      ["Jenis Usaha", "{{jenis_usaha}}"],
      ["Alamat Usaha", "{{alamat_usaha}}"],
    ]),
  },
  {
    id: "letter-title",
    label: "Judul Surat",
    html: '<h1 style="text-align:center"><strong>NAMA SURAT</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p>',
  },
  {
    id: "closing",
    label: "Penutup",
    html: "<p>Demikian surat ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>",
  },
  {
    id: "signature",
    label: "Tanda Tangan",
    html: '<p style="text-align:right">{{tempat_surat}}, {{tanggal_surat}}<br>{{jabatan_kepala_desa}} {{nama_desa}}</p><p style="text-align:right"><br><br><strong><u>{{nama_kepala_desa}}</u></strong><br>{{pangkat_kepala_desa}}<br>NIP. {{nip_kepala_desa}}</p>',
  },
  {
    id: "dual-signature",
    label: "Dua Tanda Tangan",
    html: '<table style="width:100%;margin-top:2em"><tbody><tr><td style="text-align:center;vertical-align:top;width:50%"><p>Mengetahui<br>{{jabatan_pejabat_atasan}}</p><p><br><br><strong><u>{{nama_pejabat_atasan}}</u></strong><br>{{pangkat_pejabat_atasan}}<br>NIP. {{nip_pejabat_atasan}}</p></td><td style="text-align:center;vertical-align:top;width:50%"><p>{{jabatan_kepala_desa}} {{nama_desa}}</p><p><br><br><strong><u>{{nama_kepala_desa}}</u></strong></p></td></tr></tbody></table>',
  },
  {
    id: "copy",
    label: "Tembusan",
    html: "<p><strong>Tembusan:</strong><br>{{tembusan}}</p>",
  },
];

function fieldTable(rows) {
  return `<table><tbody>${rows.map(([label, value]) => `<tr><td>${label}</td><td>:</td><td>${value}</td></tr>`).join("")}</tbody></table>`;
}

function countTableColumns(tableHtml) {
  const firstRow = tableHtml.match(/<tr\b[^>]*>([\s\S]*?)<\/tr>/i)?.[1] ?? "";
  const cells = firstRow.match(/<t[dh]\b/gi) ?? [];

  return cells.length;
}

function getTextLength(contentHtml) {
  return (contentHtml ?? "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

export function insertPlaceholder(editor, key) {
  if (!editor || !key) {
    return;
  }

  editor.chain().focus().insertContent(`{{${key}}}`).run();
}

export function insertTemplateBlock(editor, id) {
  const block = templateBlocks.find((item) => item.id === id);

  if (!editor || !block) {
    return;
  }

  editor.chain().focus().insertContent(block.html).run();
}

export function clearSelectedFormatting(editor) {
  if (!editor) {
    return;
  }

  editor.chain().focus().unsetAllMarks().clearNodes().run();
}

export function insertBasicTable(editor) {
  if (!editor) {
    return;
  }

  editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: false }).run();
}

export function focusPlaceholder(editor, key) {
  if (!editor || !key) {
    return false;
  }

  const needle = `{{${key}}}`;
  let matchRange = null;

  editor.state.doc.descendants((node, pos) => {
    if (matchRange || !node.isText) {
      return;
    }

    const index = node.text.indexOf(needle);

    if (index !== -1) {
      matchRange = {
        from: pos + index,
        to: pos + index + needle.length,
      };
    }
  });

  if (!matchRange) {
    return false;
  }

  editor.chain().focus().setTextSelection(matchRange).scrollIntoView().run();
  return true;
}

export function validateTemplateContent(contentHtml) {
  const placeholders = extractPlaceholders(contentHtml ?? "");
  const knownKeys = new Set(placeholderFields.map((field) => field.key));
  const unknownPlaceholders = placeholders.filter((key) => !knownKeys.has(key));
  const missingImportantPlaceholders = importantTemplatePlaceholders.filter((key) => !placeholders.includes(key));
  const tableWarnings = [...(contentHtml ?? "").matchAll(/<table\b[\s\S]*?<\/table>/gi)]
    .map((match, index) => ({
      columnCount: countTableColumns(match[0]),
      index: index + 1,
    }))
    .filter((table) => table.columnCount > 4);
  const textLength = getTextLength(contentHtml);
  const likelyLongForPrint = textLength > 2800 || ((contentHtml ?? "").match(/<(p|tr|li)\b/gi) ?? []).length > 42;

  return {
    likelyLongForPrint,
    missingImportantPlaceholders,
    placeholders,
    tableWarnings,
    textLength,
    unknownPlaceholders,
  };
}
