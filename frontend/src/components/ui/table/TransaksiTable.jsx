"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter Baru
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    unit: ""
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      
      // Membangun Query String agar filter berfungsi
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.unit) params.append("unit", filters.unit);

      const res = await fetch(`http://localhost:8000/api/transaksi?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal fetch transaksi");

      const data = await res.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6 pl-0 sm:pl-[240px] transition-all text-gray-900">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-gray-900 border border-gray-200">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-black">
            Laporan Detail Transaksi
          </h2>
          <Link
            href="/jurnal"
            className="px-4 py-2 text-xs sm:text-sm font-semibold
                       bg-red-600 text-white rounded-lg shadow-sm
                       hover:bg-red-700 transition flex items-center justify-center gap-1"
          >
            📒 Lihat Jurnal
          </Link>
        </div>

        {/* SECTION FILTER - Revisi Pak Agus */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Dari Tanggal</label>
            <input 
              type="date" 
              name="start_date"
              className="w-full p-2 border border-gray-300 rounded text-black font-medium focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Sampai Tanggal</label>
            <input 
              type="date" 
              name="end_date"
              className="w-full p-2 border border-gray-300 rounded text-black font-medium focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Unit Sektor</label>
            <select 
              name="unit"
              className="w-full p-2 border border-gray-300 rounded text-black font-medium focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleFilterChange}
            >
              <option value="">Semua Unit</option>
              <option value="PMI">PMI (Markas)</option>
              <option value="Ambulance">Ambulance</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={fetchTransactions}
              className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-sm"
            >
              🔍 Terapkan Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-xs sm:text-sm text-gray-900">
            <thead className="bg-gray-100 text-black font-bold uppercase text-[11px]">
              <tr className="text-center">
                <th className="px-3 py-3 border">No</th>
                <th className="px-3 py-3 border">Unit</th>
                <th className="px-3 py-3 border text-left">Keterangan</th>
                <th className="px-3 py-3 border">Jenis</th>
                <th className="px-3 py-3 border">Akun</th>
                <th className="px-3 py-3 border text-center">Qty / Satuan</th>
                <th className="px-3 py-3 border">Nominal</th>
                <th className="px-3 py-3 border">Tanggal</th>
                <th className="px-3 py-3 border">File</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="p-10 text-center font-bold">Loading data...</td></tr>
              ) : transactions.length > 0 ? (
                transactions.map((t, i) => (
                  <tr
                    key={t.id_transaksi || i}
                    className="text-center hover:bg-red-50 transition text-black border-b border-gray-100"
                  >
                    <td className="px-2 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-2 py-3 font-bold">
                       <span className={`px-2 py-1 rounded-full text-[10px] shadow-sm ${t.unit === 'Ambulance' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                          {t.unit}
                       </span>
                    </td>
                    <td className="px-2 py-3 text-left whitespace-nowrap font-medium">
                      {t.keterangan || "-"}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                          ${t.jenis_transaksi === "masuk" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                      >
                        {t.jenis_transaksi}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-gray-700">
                      {t.akun?.nama || t.akun_kode}
                    </td>
                    <td className="px-2 py-3 text-center font-bold">
                       {t.qty} <span className="text-gray-400 font-normal text-[11px]">{t.satuan}</span>
                    </td>
                    <td className="px-2 py-3 font-extrabold whitespace-nowrap">
                      Rp {Number(t.jumlah).toLocaleString("id-ID")}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {t.tanggal}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-center">
                      {t.file_path ? (
                        <a
                          href={`http://localhost:8000/storage/${t.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 px-2 py-1 rounded text-indigo-700 hover:bg-indigo-50 font-bold"
                        >
                          👁️ Lihat
                        </a>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-20 text-center font-bold text-gray-400">
                    Belum ada data transaksi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER TOTAL */}
        {!loading && transactions.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
             <span className="text-black font-bold">Total: {transactions.length} Data</span>
             <span className="text-lg font-black text-red-600">
                Total Nominal: Rp {transactions.reduce((acc, curr) => acc + parseFloat(curr.jumlah || 0), 0).toLocaleString('id-ID')}
             </span>
          </div>
        )}

      </div>
    </div>
  );
}