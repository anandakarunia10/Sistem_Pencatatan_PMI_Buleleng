import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportDetailPDF = async (data) => {
  if (!data) return;

  const header = data.header || data;
  const details = data.details || [];

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.width;

  // =========================
  // LOGO
  // =========================
  let logo = null;
  try {
    logo = await toBase64("/images/pmilogo.png");
  } catch (e) {}

  // =========================
  // KOP SURAT (PERFECT ALIGN)
  // =========================

  const logoSize = 28;
  const logoX = 15;

  // ini kunci penting: CENTER VERTIKAL
  const headerTopY = 18; // posisi teks PALING ATAS
  const logoY = headerTopY - logoSize / 2 + 2; // FIX ALIGN VISUAL

  const centerX = pageWidth / 2;

  if (logo) {
    doc.addImage(logo, "PNG", logoX, logoY, logoSize, logoSize);
  }

  // =========================
  // TEXT HEADER
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PALANG MERAH INDONESIA", centerX, headerTopY, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("KABUPATEN BULELENG", centerX, headerTopY + 7, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("LAPORAN RINCI TRANSAKSI KEUANGAN", centerX, headerTopY + 14, {
    align: "center",
  });

  // garis kop
  doc.setLineWidth(0.5);
  doc.line(15, headerTopY + 18, pageWidth - 15, headerTopY + 18);

  // =========================
  // INFO SECTION
  // =========================
  let y = headerTopY + 28;

  const akunNama = header.akun?.nama || "-";

  const info = [
    ["Nomor Transaksi", header.nomor_transaksi || "-"],
    ["Unit Kerja", header.unit || "-"],
    ["Jenis Transaksi", header.jenis_transaksi || "-"],
    ["Keterangan", header.keterangan || "-"],
    ["Sumber Dana", header.sumber || "-"],
    ["Kode Akun-Nama Akun", `${header.akun_kode || "-"} - ${akunNama}`],
    [
      "Tanggal",
      header.tanggal
        ? new Date(header.tanggal).toLocaleDateString("id-ID")
        : "-",
    ],
    ["Nomor Bukti", header.no_bukti || "-"],
  ];

  doc.setFontSize(10);

  info.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 15, y);

    doc.setFont("helvetica", "normal");
    doc.text(`: ${value}`, 65, y);

    y += 6;
  });

  y += 5;

  // =========================
  // TOTAL
  // =========================
  const total = details.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  );

  // =========================
  // TABLE
  // =========================
 autoTable(doc, {
  startY: y,
  head: [["Uraian", "Qty", "Satuan", "Harga", "Subtotal"]],

  body: [
    ...details.map((item) => [
      item.uraian || "-",
      item.qty || 0,
      item.satuan || "-",
      `Rp ${(Number(item.harga) || 0).toLocaleString("id-ID")}`,
      `Rp ${(Number(item.subtotal) || 0).toLocaleString("id-ID")}`,
    ]),

    // =========================
    // TOTAL ROW (DITAMBAHKAN DI BODY)
    // =========================
    [
      {
        content: "TOTAL",
        colSpan: 4,
        styles: {
          halign: "right",
          fontStyle: "bold",
        },
      },
      {
        content: `Rp ${total.toLocaleString("id-ID")}`,
        styles: {
          halign: "right",
          fontStyle: "bold",
        },
      },
    ],
  ],

  foot: [], // dikosongkan biar tidak double total

  theme: "grid",
  styles: { fontSize: 9, cellPadding: 2 },
  headStyles: { fillColor: 240, textColor: 20, fontStyle: "bold" },
});
  // =========================
  // FOOTER
  // =========================
  const pageHeight = doc.internal.pageSize.height;

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Dicetak otomatis: ${new Date().toLocaleString("id-ID")}`,
    15,
    pageHeight - 10
  );

  doc.save(`Laporan-${header.nomor_transaksi || "transaksi"}.pdf`);
};

// =========================
function toBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
    img.src = url;
  });
}