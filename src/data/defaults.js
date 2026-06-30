const now = "2026-06-26T00:00:00.000Z";

export const defaultPageMargin = {
  top: 1.6,
  right: 1.6,
  bottom: 1.6,
  left: 1.6,
};

export const defaultSettings = {
  districtName: "Kecamatan Contoh",
  headVillageName: "Nama Kepala Desa",
  headVillageNip: "",
  headVillageRank: "",
  logoBase64: "",
  regencyName: "Kabupaten Contoh",
  superiorName: "",
  superiorNip: "",
  superiorRank: "",
  superiorTitle: "",
  villageAddress: "Jl. Administrasi Desa No. 1",
  villageName: "Desa Contoh",
  villagePlaceName: "",
  letterNumberFormat: "{nomor}/{kode}/{kode_instansi}/{bulan}/{tahun}",
  letterNumberPrefix: "",
  whatsappTemplate:
    "Halo, surat {{nama_template}} atas nama {{nama_warga}} dengan nomor {{nomor_surat}} sudah siap diproses.",
};

export const placeholderFields = [
  { key: "nomor_surat", label: "Nomor Surat", sample: "470/001/SKD/VI/2026", type: "text" },
  { key: "tanggal_surat", label: "Tanggal Surat", sample: "2026-06-26", type: "date" },
  { key: "nama_warga", label: "Nama Warga", sample: "Yohanes Warahuwena", type: "text" },
  { key: "nik", label: "NIK", sample: "9101010101010001", type: "text" },
  { key: "alamat", label: "Alamat", sample: "RT 001/RW 002, Desa Contoh", type: "textarea" },
  { key: "tempat_lahir", label: "Tempat Lahir", sample: "Jayapura", type: "text" },
  { key: "tanggal_lahir", label: "Tanggal Lahir", sample: "2000-01-01", type: "date" },
  { key: "jenis_kelamin", label: "Jenis Kelamin", sample: "Laki-laki", type: "select" },
  { key: "agama", label: "Agama", sample: "Kristen", type: "text" },
  { key: "pekerjaan", label: "Pekerjaan", sample: "Petani", type: "text" },
  { key: "nama_desa", label: "Nama Desa", sample: defaultSettings.villageName, type: "text" },
  { key: "kecamatan", label: "Kecamatan", sample: defaultSettings.districtName, type: "text" },
  { key: "kabupaten", label: "Kabupaten", sample: defaultSettings.regencyName, type: "text" },
  { key: "alamat_desa", label: "Alamat Desa", sample: defaultSettings.villageAddress, type: "textarea" },
  { key: "nama_kepala_desa", label: "Nama Kepala Desa", sample: defaultSettings.headVillageName, type: "text" },
  { key: "nip_kepala_desa", label: "NIP Kepala Desa", sample: "198001012006041001", type: "text" },
  { key: "pangkat_kepala_desa", label: "Pangkat Kepala Desa", sample: "Pembina", type: "text" },
  { key: "nama_usaha", label: "Nama Usaha", sample: "Kios Maju Bersama", type: "text" },
  { key: "jenis_usaha", label: "Jenis Usaha", sample: "Perdagangan sembako", type: "text" },
  { key: "alamat_usaha", label: "Alamat Usaha", sample: "Pasar Desa Contoh", type: "textarea" },
  { key: "keperluan", label: "Keperluan", sample: "Persyaratan administrasi", type: "textarea" },
  { key: "nama_pejabat_atasan", label: "Nama Pejabat Atasan", sample: "Nama Camat", type: "text" },
  { key: "jabatan_pejabat_atasan", label: "Jabatan Pejabat Atasan", sample: "Camat", type: "text" },
  { key: "nip_pejabat_atasan", label: "NIP Pejabat Atasan", sample: "198001012006041002", type: "text" },
  { key: "pangkat_pejabat_atasan", label: "Pangkat Pejabat Atasan", sample: "Pembina", type: "text" },
  { key: "tempat_surat", label: "Tempat Surat", sample: "Desa Contoh", type: "text" },
  { key: "sifat_surat", label: "Sifat Surat", sample: "biasa", type: "select_sifat" },
  { key: "lampiran", label: "Lampiran", sample: "-", type: "text" },
  { key: "perihal", label: "Perihal", sample: "Undangan Rapat", type: "text" },
  { key: "tujuan_surat", label: "Tujuan Surat", sample: "Kepala Desa se-Kecamatan", type: "textarea" },
  { key: "hari_acara", label: "Hari/Tanggal Acara", sample: "2026-06-26", type: "date" },
  { key: "waktu_acara", label: "Waktu Acara", sample: "09.00 WIT - Selesai", type: "text" },
  { key: "tempat_acara", label: "Tempat Acara", sample: "Aula Kantor Kecamatan", type: "text" },
  { key: "tembusan", label: "Tembusan", sample: "1. Bupati\n2. Wakil Bupati", type: "textarea" },
  { key: "isi_undangan", label: "Isi Undangan", sample: "Sehubungan dengan kegiatan...", type: "textarea" },
];

function fieldTable(rows) {
  return `<table><tbody>${rows
    .map(([label, value]) => `<tr><td>${label}</td><td>:</td><td>${value}</td></tr>`)
    .join("")}</tbody></table>`;
}

function signature() {
  return `<p style="text-align:right">{{tempat_surat}}, {{tanggal_surat}}<br>Kepala Desa {{nama_desa}}</p><p style="text-align:right"><br><br><strong><u>{{nama_kepala_desa}}</u></strong><br>${"{{nip_kepala_desa}}"}</p>`;
}

function dualSignature() {
  return `<table style="width:100%;margin-top:2em"><tbody><tr><td style="text-align:center;vertical-align:top;width:50%"><p>Mengetahui<br>{{jabatan_pejabat_atasan}}</p><p><br><br><strong><u>{{nama_pejabat_atasan}}</u></strong><br>{{pangkat_pejabat_atasan}}<br>NIP. {{nip_pejabat_atasan}}</p></td><td style="text-align:center;vertical-align:top;width:50%"><p>Kepala Desa {{nama_desa}}</p><p><br><br><strong><u>{{nama_kepala_desa}}</u></strong></p></td></tr></tbody></table>`;
}

function signatureWithRank() {
  return `<p style="text-align:right">{{tempat_surat}}, {{tanggal_surat}}<br>Kepala Desa {{nama_desa}}</p><p style="text-align:right"><br><br><strong><u>{{nama_kepala_desa}}</u></strong><br>{{pangkat_kepala_desa}}<br>NIP. {{nip_kepala_desa}}</p>`;
}

const residentFields = fieldTable([
  ["Nama", "{{nama_warga}}"],
  ["NIK", "{{nik}}"],
  ["Tempat/Tanggal Lahir", "{{tempat_lahir}}, {{tanggal_lahir}}"],
  ["Jenis Kelamin", "{{jenis_kelamin}}"],
  ["Agama", "{{agama}}"],
  ["Pekerjaan", "{{pekerjaan}}"],
  ["Alamat", "{{alamat}}"],
]);

const shortResidentFields = fieldTable([
  ["Nama", "{{nama_warga}}"],
  ["NIK", "{{nik}}"],
  ["Tempat/Tanggal Lahir", "{{tempat_lahir}}, {{tanggal_lahir}}"],
  ["Jenis Kelamin", "{{jenis_kelamin}}"],
  ["Alamat", "{{alamat}}"],
]);

const businessFields = fieldTable([
  ["Nama Usaha", "{{nama_usaha}}"],
  ["Jenis Usaha", "{{jenis_usaha}}"],
  ["Alamat Usaha", "{{alamat_usaha}}"],
]);

const signerFields = fieldTable([
  ["Nama", "<strong>{{nama_kepala_desa}}</strong>"],
  ["Jabatan", "Kepala Desa {{nama_desa}}"],
  ["Alamat", "{{alamat_desa}}"],
]);

const invitationMeta = fieldTable([
  ["Hari/Tanggal", "{{hari_acara}}"],
  ["Waktu", "{{waktu_acara}}"],
  ["Tempat", "{{tempat_acara}}"],
]);

export const defaultTemplates = [
  {
    category: "Kependudukan",
    code: "SKD",
    contentHtml: `<h1 style="text-align:center"><strong>SURAT KETERANGAN DOMISILI</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>${residentFields}<p>Benar yang bersangkutan berdomisili di wilayah Desa {{nama_desa}}.</p><p>Surat keterangan ini dibuat untuk dipergunakan sebagai {{keperluan}}.</p>${signature()}`,
    createdAt: now,
    id: "tpl-domisili",
    isActive: true,
    name: "Surat Keterangan Domisili",
    sortOrder: 10,
    updatedAt: now,
  },
  {
    category: "Sosial",
    code: "SKTM",
    contentHtml: `<h1 style="text-align:center"><strong>SURAT KETERANGAN TIDAK MAMPU</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini:</p>${signerFields}<p>Menerangkan dengan sesungguhnya bahwa:</p>${residentFields}<p>Adalah benar penduduk dan berdomisili di Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, yang bersangkutan benar-benar <strong>Tergolong Sebagai Keluarga Tidak Mampu/Ekonomi Rendah</strong>.</p><p>Demikian Surat Keterangan Tidak Mampu ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p><table style="width:100%;margin-top:1em"><tbody><tr><td style="width:50%"><p>Dikeluarkan di : {{tempat_surat}}<br>Pada Tanggal &nbsp;&nbsp;&nbsp;: {{tanggal_surat}}</p></td></tr></tbody></table>${dualSignature()}`,
    createdAt: now,
    id: "tpl-tidak-mampu",
    isActive: true,
    name: "Surat Keterangan Tidak Mampu",
    sortOrder: 20,
    updatedAt: now,
  },
  {
    category: "Ekonomi",
    code: "SKU",
    contentHtml: `<h1 style="text-align:center"><strong>SURAT KETERANGAN USAHA</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>${residentFields}<p>Benar memiliki usaha dengan keterangan sebagai berikut:</p>${businessFields}<p>Surat ini dibuat untuk dipergunakan sebagai {{keperluan}}.</p>${signature()}`,
    createdAt: now,
    id: "tpl-usaha",
    isActive: true,
    name: "Surat Keterangan Usaha",
    sortOrder: 30,
    updatedAt: now,
  },
  {
    category: "Umum",
    code: "PENGANTAR",
    contentHtml: `<h1 style="text-align:center"><strong>SURAT PENGANTAR</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, memberikan pengantar kepada:</p>${shortResidentFields}<p>Untuk keperluan: {{keperluan}}.</p><p>Demikian surat pengantar ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>${signature()}`,
    createdAt: now,
    id: "tpl-pengantar",
    isActive: true,
    name: "Surat Pengantar",
    sortOrder: 40,
    updatedAt: now,
  },
  {
    category: "Kependudukan",
    code: "SKBM",
    contentHtml: `<h1 style="text-align:center"><strong>SURAT KETERANGAN BELUM MENIKAH</strong></h1><p style="text-align:center">Nomor: {{nomor_surat}}</p><p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, menerangkan bahwa:</p>${residentFields}<p>Berdasarkan data administrasi desa dan keterangan yang bersangkutan, nama tersebut di atas belum pernah menikah.</p><p>Surat ini dibuat untuk dipergunakan sebagai {{keperluan}}.</p>${signature()}`,
    createdAt: now,
    id: "tpl-belum-menikah",
    isActive: true,
    name: "Surat Keterangan Belum Menikah",
    sortOrder: 50,
    updatedAt: now,
  },
  {
    category: "Umum",
    code: "UNDANGAN",
    contentHtml: `<table style="width:100%"><tbody><tr><td style="width:50%">${fieldTable([
      ["Nomor", "{{nomor_surat}}"],
      ["Sifat", "{{sifat_surat}}"],
      ["Lamp.", "{{lampiran}}"],
      ["Perihal", "<strong>{{perihal}}</strong>"],
    ])}</td><td style="width:50%;text-align:right"><p>{{tempat_surat}}, {{tanggal_surat}}</p></td></tr></tbody></table><p>Kepada Yth:<br>{{tujuan_surat}}<br>Di-<br>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Tempat</strong></p><p>Dengan hormat,</p><p>{{isi_undangan}}</p>${invitationMeta}<p>Demikian undangan ini disampaikan. Atas kehadiran dan kerja sama yang baik, kami ucapkan terima kasih.</p>${signatureWithRank()}<p><strong>Tembusan:</strong> disampaikan kepada Yth:<br>{{tembusan}}</p>`,
    createdAt: now,
    id: "tpl-undangan-rapat",
    isActive: true,
    name: "Surat Undangan Rapat",
    sortOrder: 60,
    updatedAt: now,
  },
];
