import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const handleExportExcel = (data, judul, tahun) => {
  const wb = XLSX.utils.book_new();
  // Logika buat sheet Excel sesuai data yang difilter
  // ... (gunakan data yang sudah difilter di sini)
  XLSX.writeFile(wb, `Laporan_${judul}_${tahun}.xlsx`);
};

export const handleExportPDF = (data, judul, tahun) => {
  const doc = new jsPDF("landscape");
  // ... (masukkan logika autoTable PDF Anda di sini)
  doc.save(`Laporan_${judul}_${tahun}.pdf`);
};