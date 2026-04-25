"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function LaporanKeuanganPage() {
  const [masuk, setMasuk] = useState([]);
  const [keluar, setKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:8000/api/transaksi", {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          const allData = result.data;
          setMasuk(allData.filter((t) => t.jenis_transaksi === "masuk"));
          setKeluar(allData.filter((t) => t.jenis_transaksi === "keluar"));
        }
      } catch (error) {
        console.error("Gagal ambil data laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalMasuk = masuk.reduce((a, b) => a + Number(b.jumlah || 0), 0);
  const totalKeluar = keluar.reduce((a, b) => a + Number(b.jumlah || 0), 0);

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["LAPORAN KEUANGAN PMI KABUPATEN BULELENG"],
      ["Rekapitulasi Keuangan Tahun 2025"],
      [],
      ["NO","TANGGAL","URAIAN","PENERIMAAN","","NO","TANGGAL","URAIAN","PENGELUARAN"]
    ];

    const max = Math.max(masuk.length, keluar.length);
    for(let i=0; i<max; i++){
      ws_data.push([
        i+1, masuk[i]?.tanggal||"", masuk[i]?.keterangan||"", masuk[i]?.jumlah||"",
        i+1, keluar[i]?.tanggal||"", keluar[i]?.keterangan||"", keluar[i]?.jumlah||""
      ]);
    }
    ws_data.push(["","","TOTAL", totalMasuk, "", "", "", "TOTAL", totalKeluar]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, "Laporan_Keuangan_PMI_Buleleng.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PALANG MERAH INDONESIA", 148, 15, { align: "center" });
    doc.setFontSize(14);
    doc.text("Laporan Rekapitulasi Keuangan Tahun 2025", 148, 25, { align: "center" });
    doc.setFontSize(11);
    doc.text("PMI Kabupaten Buleleng", 148, 32, { align: "center" });

    const body = [];
    const max = Math.max(masuk.length, keluar.length);
    for (let i = 0; i < max; i++) {
      body.push([
        i+1,
        masuk[i]?.tanggal || "",
        masuk[i]?.keterangan || "",
        masuk[i]?.jumlah ? `Rp ${masuk[i].jumlah.toLocaleString("id-ID")}` : "",
        i+1,
        keluar[i]?.tanggal || "",
        keluar[i]?.keterangan || "",
        keluar[i]?.jumlah ? `Rp ${keluar[i].jumlah.toLocaleString("id-ID")}` : "",
      ]);
    }

    body.push([
      "", "TOTAL", "", `Rp ${totalMasuk.toLocaleString("id-ID")}`,
      "", "TOTAL", "", `Rp ${totalKeluar.toLocaleString("id-ID")}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["NO", "TANGGAL", "URAIAN", "PENERIMAAN", "NO", "TANGGAL", "URAIAN", "PENGELUARAN"]],
      body: body,
      theme: "grid",
      headStyles: { fillColor: [200, 230, 201], textColor: [0, 100, 0], fontStyle: "bold" },
      bodyStyles: { fontSize: 10 },
      footStyles: { fillColor: [220, 220, 220], fontStyle: "bold" },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Halaman ${i} dari ${pageCount}`, 280, 195, { align: "right" });
      doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 10, 195);
    }

    doc.save("Laporan_Keuangan_PMI_Buleleng.pdf");
  };

  if (loading) return (
    <div className="ml-[180px] p-10 text-center text-gray-900">
      <span className="text-gray-700">Menyusun Laporan...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 ml-0 md:ml-[180px] transition-all text-gray-900">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 text-gray-900">
        
        <div className="relative mb-8 py-4 text-center">
          <h2 className="font-bold text-2xl uppercase tracking-widest text-gray-900">
            Rekapitulasi Keuangan Tahun 2025
          </h2>
          <p className="text-gray-600 text-sm mt-1">PMI KABUPATEN BULELENG</p>
          <div className="h-1 w-24 bg-red-600 mx-auto mt-2 rounded-full"></div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-2 text-xs font-semibold">
                📥 Export
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl z-30 overflow-hidden">
                  <button onClick={() => { exportExcel(); setOpen(false); }} className="w-full text-left px-4 py-3 text-xs text-gray-800 hover:bg-red-50 flex items-center gap-2">📗 Excel</button>
                  <button onClick={() => { exportPDF(); setOpen(false); }} className="w-full text-left px-4 py-3 text-xs text-gray-800 hover:bg-red-50 flex items-center gap-2">📕 PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-gray-900">
            <thead className="bg-gray-100 border-b text-gray-800">
              <tr>
                <th colSpan="4" className="border-r py-3 text-green-800 bg-green-50 uppercase">Penerimaan (Masuk)</th>
                <th colSpan="4" className="py-3 text-red-800 bg-red-50 uppercase">Pengeluaran (Keluar)</th>
              </tr>
              <tr className="bg-gray-100 text-[11px] text-gray-800">
                <th className="border p-2">NO</th><th className="border p-2">TANGGAL</th><th className="border p-2">URAIAN</th><th className="border p-2 text-right">JUMLAH</th>
                <th className="border p-2">NO</th><th className="border p-2">TANGGAL</th><th className="border p-2">URAIAN</th><th className="border p-2 text-right">JUMLAH</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(masuk.length, keluar.length) }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50 border-b text-gray-900">
                  <td className="border p-2 text-center">{masuk[i] ? i + 1 : ""}</td>
                  <td className="border p-2">{masuk[i]?.tanggal || ""}</td>
                  <td className="border p-2">{masuk[i]?.keterangan || ""}</td>
                  <td className="border p-2 text-right text-green-700">{masuk[i]?.jumlah?.toLocaleString("id-ID") || ""}</td>
                  
                  <td className="border p-2 text-center">{keluar[i] ? i + 1 : ""}</td>
                  <td className="border p-2">{keluar[i]?.tanggal || ""}</td>
                  <td className="border p-2">{keluar[i]?.keterangan || ""}</td>
                  <td className="border p-2 text-right text-red-700">{keluar[i]?.jumlah?.toLocaleString("id-ID") || ""}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold text-gray-900">
                <td colSpan="3" className="border p-3 text-center uppercase">Total Penerimaan</td>
                <td className="border p-3 text-right text-green-800 bg-green-50">Rp {totalMasuk.toLocaleString("id-ID")}</td>
                <td colSpan="3" className="border p-3 text-center uppercase">Total Pengeluaran</td>
                <td className="border p-3 text-right text-red-800 bg-red-50">Rp {totalKeluar.toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center text-gray-900">
          <span className="font-bold text-blue-900 uppercase">Saldo Akhir (Cash On Hand):</span>
          <span className="text-2xl font-black text-blue-900">
            Rp {(totalMasuk - totalKeluar).toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}