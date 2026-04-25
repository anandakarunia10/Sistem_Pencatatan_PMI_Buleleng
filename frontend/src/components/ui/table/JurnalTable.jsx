"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function JurnalPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJurnal = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken"); // <-- pastikan token admin
      const res = await fetch("http://localhost:8000/api/transaksi", {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setTransactions(data.data || []);
      else setTransactions([]);
    } catch (error) {
      console.error("Gagal mengambil data jurnal:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJurnal();
  }, []);

  return (
    <div className="ml-0 md:ml-[180px] p-6 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jurnal Umum</h1>

        <Link
          href="/laporan"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          📊 Lihat Laporan
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-3">Tanggal</th>
              <th className="border px-3 py-3 text-left">Keterangan</th>
              <th className="border px-3 py-3">Akun</th>
              <th className="border px-3 py-3 text-center">Ref (No Bukti)</th>
              <th className="border px-3 py-3 text-right">Debit</th>
              <th className="border px-3 py-3 text-right">Kredit</th>
              <th className="border px-3 py-3 text-center">Bukti</th>
            </tr>
          </thead>

          <tbody className="text-gray-600">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">Memuat data jurnal...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Belum ada data jurnal di database.
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={t.id || i} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2 text-center">
                    {new Date(t.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border px-3 py-2">{t.keterangan}</td>
                  <td className="border px-3 py-2 text-center">
                    {t.akun ? t.akun.nama : t.akun_kode}
                  </td>
                  <td className="border px-3 py-2 text-center">{t.no_bukti || "-"}</td>
                  <td className="border px-3 py-2 text-right font-medium text-green-600">
                    {t.jenis_transaksi === "masuk" ? `Rp ${Number(t.jumlah).toLocaleString("id-ID")}` : "-"}
                  </td>
                  <td className="border px-3 py-2 text-right font-medium text-red-600">
                    {t.jenis_transaksi === "keluar" ? `Rp ${Number(t.jumlah).toLocaleString("id-ID")}` : "-"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {t.file_path ? (
                      <a 
                        href={`http://localhost:8000/storage/${t.file_path}`} 
                        target="_blank" 
                        className="text-blue-500 hover:underline text-[10px] font-bold"
                      >
                        VIEW
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
