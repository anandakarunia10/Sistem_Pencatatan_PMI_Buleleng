import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = ({
  masuk,
  keluar,
  totalMasuk,
  totalKeluar,
  filterUnit,
}) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  const pageWidth = doc.internal.pageSize.width;

  // =========================
  // LOGO
  // =========================
  try {
    const logo = new Image();
    logo.src = "/images/pmilogo.png";
    doc.addImage(logo, "PNG", 12, 8, 22, 22);
  } catch (e) {}

  // =========================
  // HEADER
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PALANG MERAH INDONESIA", pageWidth / 2, 15, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.text("LAPORAN REKAPITULASI KEUANGAN", pageWidth / 2, 22, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`UNIT: ${filterUnit.toUpperCase()}`, pageWidth / 2, 29, {
    align: "center",
  });

  doc.text(
    `Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`,
    pageWidth / 2,
    34,
    { align: "center" }
  );

  // =========================
  // FORMAT DATA
  // =========================
  const formatRows = (data) => {
    const rows = [];

    data.forEach((trx, index) => {
      const tgl = trx.tanggal
        ? new Date(trx.tanggal).toLocaleDateString("id-ID")
        : "";

      rows.push({
        no: index + 1,
        tanggal: tgl,
        uraian: trx.akun?.nama || trx.akun_kode,
        jumlah: "",
        akun: true,
      });

      (trx.details || []).forEach((d) => {
        rows.push({
          no: "",
          tanggal: "",
          uraian: `  • ${d.uraian}`,
          jumlah: `Rp ${Number(d.subtotal || 0).toLocaleString("id-ID")}`,
          akun: false,
        });
      });
    });

    return rows;
  };

  const masukRows = formatRows(masuk);
  const keluarRows = formatRows(keluar);
  const maxRows = Math.max(masukRows.length, keluarRows.length);

  const body = [];

  for (let i = 0; i < maxRows; i++) {
    body.push([
      masukRows[i]?.no || "",
      masukRows[i]?.tanggal || "",
      masukRows[i]?.uraian || "",
      masukRows[i]?.jumlah || "",
      keluarRows[i]?.no || "",
      keluarRows[i]?.tanggal || "",
      keluarRows[i]?.uraian || "",
      keluarRows[i]?.jumlah || "",
    ]);
  }

  body.push([
    "",
    "",
    "TOTAL PENERIMAAN",
    `Rp ${totalMasuk.toLocaleString("id-ID")}`,
    "",
    "",
    "TOTAL PENGELUARAN",
    `Rp ${totalKeluar.toLocaleString("id-ID")}`,
  ]);

  // =========================
  // TABLE
  // =========================
  autoTable(doc, {
    startY: 40,
    margin: { left: 10, right: 10 },
    tableWidth: "auto",
    head: [
      [
        "NO",
        "TANGGAL",
        "URAIAN",
        "PENERIMAAN",
        "NO",
        "TANGGAL",
        "URAIAN",
        "PENGELUARAN",
      ],
    ],
    body,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [200, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 28, halign: "center" },
      2: { cellWidth: "auto" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 10, halign: "center" },
      5: { cellWidth: 28, halign: "center" },
      6: { cellWidth: "auto" },
      7: { cellWidth: 30, halign: "right" },
    },
  });

  // =========================
  // TANDA TANGAN (FIX PER UNIT LAYOUT)
  // =========================
  const finalY = doc.lastAutoTable.finalY + 15;

  const unit = (filterUnit || "").toLowerCase();

  doc.setFontSize(10);

  // tanggal selalu center
  doc.text(
    `Singaraja, ${new Date().toLocaleDateString("id-ID")}`,
    pageWidth / 2,
    finalY,
    { align: "center" }
  );

  // =========================
  // PMI LAYOUT
  // =========================
  if (unit === "pmi") {
    doc.text("Ketua PMI Kabupaten Buleleng", 70, finalY + 10, {
      align: "center",
    });
    doc.text("Bendahara PMI Kabupaten Buleleng", 240, finalY + 10, {
      align: "center",
    });
    doc.text("Pengurus PMI Kabupaten Buleleng", pageWidth / 2, finalY + 10, {
      align: "center",
    });

    doc.text("(___________________)", 70, finalY + 40, { align: "center" });
    doc.text("(___________________)", 240, finalY + 40, { align: "center" });
    doc.text("(___________________)", pageWidth / 2, finalY + 40, {
      align: "center",
    });
  }

  // =========================
  // AMBULANCE LAYOUT
  // =========================
  else if (unit === "ambulance") {
    doc.text("Koordinator Ambulance", 70, finalY + 10, {
      align: "center",
    });

    doc.text("Penanggung Jawab Ambulance", 240, finalY + 10, {
      align: "center",
    });

    doc.text("Bendahara Ambulance", pageWidth / 2, finalY + 10, {
      align: "center",
    });

    doc.text("(___________________)", 70, finalY + 40, { align: "center" });
    doc.text("(___________________)", 240, finalY + 40, { align: "center" });
    doc.text("(___________________)", pageWidth / 2, finalY + 40, {
      align: "center",
    });
  }

  // fallback kalau unit lain
  else {
    doc.text("Ketua Unit", 70, finalY + 10, { align: "center" });
    doc.text("Bendahara Unit", 240, finalY + 10, { align: "center" });

    doc.text("(___________________)", 70, finalY + 40, { align: "center" });
    doc.text("(___________________)", 240, finalY + 40, { align: "center" });
  }

  doc.save(`Laporan_${filterUnit}.pdf`);
};