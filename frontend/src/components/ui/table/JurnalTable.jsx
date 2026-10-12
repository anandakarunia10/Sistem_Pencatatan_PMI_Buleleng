"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function JurnalPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk filter data
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    unit: "",
  });

  // State untuk modal pop-up kustom
  const [modal, setModal] = useState({
    isOpen: false,
    idTransaksi: null,
    type: "confirm", // 'confirm', 'success', 'error'
    message: "",
  });

  const fetchJurnal = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://127.0.0.1:8000/api/transaksi`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();

      if (resData.success && resData.data) {
        let filteredData = resData.data.filter(
          (item) => item.status_jurnal === "sudah"
        );

        if (filters.start_date) {
          filteredData = filteredData.filter(
            (item) => new Date(item.tanggal) >= new Date(filters.start_date)
          );
        }

        if (filters.end_date) {
          filteredData = filteredData.filter(
            (item) => new Date(item.tanggal) <= new Date(filters.end_date)
          );
        }

        if (filters.unit) {
          filteredData = filteredData.filter(
            (item) => item.unit?.toLowerCase() === filters.unit.toLowerCase()
          );
        }

        const doubleEntryRows = [];
        let globalPairCounter = 1;

        filteredData.forEach((item) => {
          const jenis = item.jenis_transaksi?.toLowerCase();
          const noBuktiTampil = item.no_bukti || "-";
          const akunSumberFix = item.sumber || "Kas/Sumber Dana";
          const akunNamaFix = item.akun_nama || item.akun_kode || "Akun Transaksi";

          const itemDetails = item.details && item.details.length > 0
            ? item.details
            : [{ uraian: "", subtotal: Number(item.jumlah || 0) }];

          itemDetails.forEach((detail, detailIdx) => {
            const nominal = Number(detail.subtotal || 0);

            let keteranganGabung = item.keterangan || "";
            if (detail.uraian) {
              keteranganGabung = keteranganGabung
                ? `${keteranganGabung} (${detail.uraian})`
                : detail.uraian;
            }

            const isFirstRowOfTransaction = detailIdx === 0;

            if (jenis === "masuk" || jenis === "pemasukan") {
              doubleEntryRows.push({
                id_transaksi: item.id_transaksi,
                pair_number: globalPairCounter,
                is_first_in_pair: isFirstRowOfTransaction,
                tanggal: item.tanggal,
                no_bukti: noBuktiTampil,
                nama_akun: akunSumberFix,
                keterangan: `[${item.unit}] Pemasukan: ${keteranganGabung}`,
                debit: nominal,
                kredit: 0,
                isCreditRow: false,
              });

              doubleEntryRows.push({
                id_transaksi: item.id_transaksi,
                pair_number: globalPairCounter,
                is_first_in_pair: false,
                tanggal: item.tanggal,
                no_bukti: noBuktiTampil,
                nama_akun: akunNamaFix,
                keterangan: `Penerimaan pendapatan via ${akunSumberFix}`,
                debit: 0,
                kredit: nominal,
                isCreditRow: true,
              });
            } else {
              doubleEntryRows.push({
                id_transaksi: item.id_transaksi,
                pair_number: globalPairCounter,
                is_first_in_pair: isFirstRowOfTransaction,
                tanggal: item.tanggal,
                no_bukti: noBuktiTampil,
                nama_akun: akunNamaFix,
                keterangan: `[${item.unit}] Pengeluaran: ${keteranganGabung}`,
                debit: nominal,
                kredit: 0,
                isCreditRow: false,
              });

              doubleEntryRows.push({
                id_transaksi: item.id_transaksi,
                pair_number: globalPairCounter,
                is_first_in_pair: false,
                tanggal: item.tanggal,
                no_bukti: noBuktiTampil,
                nama_akun: akunSumberFix,
                keterangan: `Dibayar dari dana ${akunSumberFix}`,
                debit: 0,
                kredit: nominal,
                isCreditRow: true,
              });
            }
          });

          globalPairCounter++;
        });

        setTransactions(doubleEntryRows);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const triggerDeleteConfirm = (idTransaksi) => {
    setModal({
      isOpen: true,
      idTransaksi,
      type: "confirm",
      message: "Apakah Anda yakin ingin membatalkan posting jurnal ini? Data akan dikembalikan ke draf.",
    });
  };

  const executeDeleteJurnal = async () => {
    const idTransaksi = modal.idTransaksi;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://127.0.0.1:8000/api/transaksi/${idTransaksi}/unposting`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setModal({
          isOpen: true,
          idTransaksi: null,
          type: "success",
          message: "Jurnal berhasil di-unposting!",
        });
        fetchJurnal();
      } else {
        setModal({
          isOpen: true,
          idTransaksi: null,
          type: "error",
          message: data.message || "Gagal membatalkan posting.",
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        idTransaksi: null,
        type: "error",
        message: "Terjadi kesalahan koneksi server.",
      });
    }
  };

  useEffect(() => {
    fetchJurnal();
    document.title = "Jurnal Umum | PMI Buleleng";
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const totalDebit = transactions.reduce((a, c) => a + Number(c.debit || 0), 0);
  const totalKredit = transactions.reduce((a, c) => a + Number(c.kredit || 0), 0);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 bg-gray-50 min-h-screen pb-10">

      {/* MODAL ELEGANT */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-6 flex flex-col items-center text-center ${modal.type === 'confirm' ? 'border-b border-gray-50' : ''}`}>
              {modal.type === "confirm" && <AlertCircle className="w-14 h-14 text-red-500 mb-4" />}
              {modal.type === "success" && <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-4" />}
              {modal.type === "error" && <XCircle className="w-14 h-14 text-red-600 mb-4" />}

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {modal.type === "confirm" ? "Konfirmasi Pembatalan" : modal.type === "success" ? "Berhasil" : "Terjadi Kesalahan"}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{modal.message}</p>
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-100 transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={executeDeleteJurnal}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition"
                  >
                    Ya, Batalkan
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="w-full px-4 py-2 bg-gray-900 text-white font-semibold text-sm rounded-lg hover:bg-gray-800 transition"
                >
                  Tutup Dialog
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOX FILTER COMPACT */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mt-6">


        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">

          {/* UNIT */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold tracking-wide text-slate-500">
              Filter Unit
            </label>

            <select
              name="unit"
              value={filters.unit}
              onChange={handleFilterChange}
              className="
          h-9 px-3
          rounded-lg
          border border-slate-200
          bg-slate-50
          text-slate-700 text-sm
          focus:bg-white
          focus:border-red-400
          outline-none
          transition
        "
            >
              <option value="">Semua Unit</option>
              <option value="PMI">PMI</option>
              <option value="Ambulance">Ambulance</option>
            </select>
          </div>

          {/* START DATE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold tracking-wide text-slate-500">
              Filter Tanggal
            </label>

            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="
          h-9 px-3
          rounded-lg
          border border-slate-200
          bg-slate-50
          text-slate-700 text-sm
          focus:bg-white
          focus:border-red-400
          outline-none
          transition
        "
            />
          </div>

          {/* END DATE */}
          <div className="flex flex-col gap-1">


            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="
          h-9 px-3
          rounded-lg
          border border-slate-200
          bg-slate-50
          text-slate-700 text-sm
          focus:bg-white
          focus:border-red-400
          outline-none
          transition
        "
            />
          </div>

          {/* BUTTON */}
          <div className="flex">
            <button
              onClick={fetchJurnal}
              className="
          h-9 w-full
          bg-red-600
          text-white
          rounded-lg
          text-sm
          font-medium
          flex items-center justify-center gap-2
          hover:bg-red-700
          transition
        "
            >
              <Search size={15} />
              Tampilkan
            </button>
          </div>

        </div>
      </div>

      {/* TABEL DATA */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-12 border-b p-3 text-center text-slate-700">No</th>
                <th className="w-32 border-b p-3 text-center text-slate-700">Tanggal</th>
                <th className="w-32 border-b p-3 text-center text-slate-700">No Bukti</th>
                <th className="w-48 border-b p-3 text-center text-slate-700">Akun</th>
                <th className="border-b p-3 text-left text-slate-700">Keterangan</th>
                <th className="w-44 border-b p-3 text-right text-slate-700">Debit</th>
                <th className="w-44 border-b p-3 text-right text-slate-700">Kredit</th>
                <th className="w-20 border-b p-3 text-center text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-10 text-center text-gray-500">Memuat data...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={8} className="p-10 text-center text-gray-500">Tidak ada data.</td></tr>
              ) : (
                transactions.map((t, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50/50">
                    <td className="p-3 text-center text-gray-400">{t.is_first_in_pair ? t.pair_number : ""}</td>
                    <td className="p-3 text-center text-gray-700">{t.is_first_in_pair ? new Date(t.tanggal).toLocaleDateString("id-ID") : ""}</td>
                    <td className="p-3 text-center">{t.is_first_in_pair && <span className="bg-gray-100 px-2 py-1 rounded text-xs">{t.no_bukti}</span>}</td>
                    <td className={`p-3 ${t.isCreditRow ? "text-gray-500 pl-8 italic" : "font-semibold text-gray-800"}`}>{t.nama_akun}</td>
                    <td className={`p-3 ${t.isCreditRow ? "italic text-gray-400 text-xs pl-8" : "text-gray-700"}`}>{t.keterangan}</td>
                    <td className="p-3 text-right text-green-700 font-semibold">{t.debit > 0 ? `Rp ${t.debit.toLocaleString("id-ID")}` : "-"}</td>
                    <td className="p-3 text-right text-red-700 font-semibold">{t.kredit > 0 ? `Rp ${t.kredit.toLocaleString("id-ID")}` : "-"}</td>
                    <td className="p-3 text-center">
                      {t.is_first_in_pair && (
                        <button onClick={() => triggerDeleteConfirm(t.id_transaksi)} className="text-gray-400 hover:text-red-600 transition">🗑</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && transactions.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 font-black">
                  <td colSpan={5} className="p-4 text-center text-slate-700">TOTAL KESELURUHAN</td>
                  <td className="p-4 text-right text-green-700">Rp {totalDebit.toLocaleString("id-ID")}</td>
                  <td className="p-4 text-right text-red-700">Rp {totalKredit.toLocaleString("id-ID")}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}