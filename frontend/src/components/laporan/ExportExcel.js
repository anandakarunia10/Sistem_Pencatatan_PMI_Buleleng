import * as XLSX from "xlsx-js-style";

export const exportExcel = ({
  masuk,
  keluar,
  totalMasuk,
  totalKeluar,
  saldo,
  filterUnit,
}) => {
  const wb = XLSX.utils.book_new();
  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "");

  // 1. Persiapan Data
  const rekapData = [
    ["PALANG MERAH INDONESIA"],
    ["LAPORAN REKAPITULASI KEUANGAN"],
    [`UNIT: ${filterUnit.toUpperCase()}`],
    [`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`],
    [],
    ["NO", "TANGGAL", "URAIAN", "PENERIMAAN", "NO", "TANGGAL", "URAIAN", "PENGELUARAN"],
  ];

  const maxRows = Math.max(masuk.length, keluar.length);
  for (let i = 0; i < maxRows; i++) {
    const m = masuk[i];
    const k = keluar[i];

    // Baris Akun
    rekapData.push([
      m ? i + 1 : "",
      formatDate(m?.tanggal),
      m ? (m.akun?.nama || m.akun_kode) : "",
      "",
      k ? i + 1 : "",
      formatDate(k?.tanggal),
      k ? (k.akun?.nama || k.akun_kode) : "",
      ""
    ]);

    // Baris Detail
    const mDetails = m?.details || [];
    const kDetails = k?.details || [];
    const maxDetail = Math.max(mDetails.length, kDetails.length);

    for (let j = 0; j < maxDetail; j++) {
      rekapData.push([
        "", "", mDetails[j] ? `  • ${mDetails[j].uraian}` : "", mDetails[j] ? mDetails[j].subtotal : "",
        "", "", kDetails[j] ? `  • ${kDetails[j].uraian}` : "", kDetails[j] ? kDetails[j].subtotal : ""
      ]);
    }
  }

  rekapData.push([], 
    ["", "", "TOTAL PENERIMAAN", totalMasuk, "", "", "TOTAL PENGELUARAN", totalKeluar],
    ["", "", "SALDO AKHIR", saldo]
  );

  const ws = XLSX.utils.aoa_to_sheet(rekapData);

  // 2. Styling (Border, Merah PMI, Alignment)
  const range = XLSX.utils.decode_range(ws['!ref'] || "A1:H20");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        alignment: { vertical: "center", horizontal: "left", wrapText: true },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
      };

      // Styling Judul (Baris 0-3)
      if (R < 4) {
        ws[cellAddress].s.font = { bold: true };
        ws[cellAddress].s.alignment.horizontal = "center";
      } 
      // Styling Header Tabel (Baris 5 - MERAH PMI)
      else if (R === 5) {
        ws[cellAddress].s.fill = { patternType: "solid", fgColor: { rgb: "C00000" } };
        ws[cellAddress].s.font = { bold: true, color: { rgb: "FFFFFF" } };
        ws[cellAddress].s.alignment.horizontal = "center";
      }
    }
  }

  // 3. Layout (Merges & Columns)
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } }
  ];

  ws["!cols"] = [
    { wch: 6 }, { wch: 15 }, { wch: 45 }, { wch: 20 },
    { wch: 6 }, { wch: 15 }, { wch: 45 }, { wch: 20 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Rekapitulasi");
  XLSX.writeFile(wb, `Laporan_${filterUnit}.xlsx`);
};