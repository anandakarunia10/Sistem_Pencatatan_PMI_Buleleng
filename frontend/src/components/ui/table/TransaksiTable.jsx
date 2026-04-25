"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:8000/api/transaksi", {
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

  /* LOADING */
  if (loading) {
    return (
      <div className="p-4 sm:p-6 pl-0 sm:pl-[240px] text-center mt-10 text-gray-900">
        <p className="text-gray-700">Loading transaksi...</p>
      </div>
    );
  }

  /* EMPTY STATE */
  if (transactions.length === 0) {
    return (
      <div className="p-4 sm:p-6 pl-0 sm:pl-[240px] text-center mt-10 text-gray-900">
        <p className="text-gray-700 mb-4">Belum ada transaksi di database.</p>
        <Link href="/transaksi/input" className="text-indigo-700 underline">
          Tambah Transaksi Baru
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pl-0 sm:pl-[240px] transition-all text-gray-900">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-gray-900">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Daftar Transaksi
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

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-xs sm:text-sm text-gray-900">
            <thead className="bg-gray-100 text-gray-800">
              <tr className="text-center">
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border text-left">Keterangan</th>
                <th className="px-3 py-2 border">Jenis</th>
                <th className="px-3 py-2 border">Akun</th>
                <th className="px-3 py-2 border">Nominal</th>
                <th className="px-3 py-2 border">Tanggal</th>
                <th className="px-3 py-2 border">No Bukti</th>
                <th className="px-3 py-2 border">File</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => (
                <tr
                  key={t.id || i}
                  className="text-center hover:bg-gray-50 transition text-gray-900"
                >
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1 text-left whitespace-nowrap">
                    {t.keterangan}
                  </td>
                  <td className="border px-2 py-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold
                        ${
                          t.jenis_transaksi === "masuk"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {t.jenis_transaksi}
                    </span>
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    {t.akun ? t.akun.nama : t.akun_kode}
                  </td>
                  <td className="border px-2 py-1 font-semibold whitespace-nowrap">
                    Rp {Number(t.jumlah).toLocaleString("id-ID")}
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    {t.tanggal}
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    {t.no_bukti || "-"}
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    {t.file_path ? (
                      <a
                        href={`http://localhost:8000/storage/${t.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-700 hover:text-indigo-900 font-medium"
                      >
                        Lihat Bukti
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}