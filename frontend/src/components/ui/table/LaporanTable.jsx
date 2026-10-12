"use client";

import { useEffect, useState } from "react";

import LaporanFilter from "../../laporan/LaporanFilter";
import LaporanDetailModal from "../../laporan/LaporanDetailModal";

import { exportPDF } from "../../laporan/ExportPDF";
import { exportExcel } from "../../laporan/ExportExcel";

export default function LaporanTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterUnit, setFilterUnit] = useState("SEMUA");

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://127.0.0.1:8000/api/transaksi", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // FILTER UNIT
  let filteredData =
    filterUnit === "SEMUA"
      ? data
      : data.filter((item) => item.unit === filterUnit);

  // FILTER TANGGAL
  if (filterStartDate) {
    filteredData = filteredData.filter(
      (item) => new Date(item.tanggal) >= new Date(filterStartDate)
    );
  }

  if (filterEndDate) {
    filteredData = filteredData.filter(
      (item) => new Date(item.tanggal) <= new Date(filterEndDate)
    );
  }

  // DATA MASUK & KELUAR
  const masuk = filteredData.filter(
    (item) => item.jenis_transaksi === "masuk"
  );

  const keluar = filteredData.filter(
    (item) => item.jenis_transaksi === "keluar"
  );

  const totalMasuk = masuk.reduce(
    (total, item) => total + Number(item.jumlah || 0),
    0
  );

  const totalKeluar = keluar.reduce(
    (total, item) => total + Number(item.jumlah || 0),
    0
  );

  const saldo = totalMasuk - totalKeluar;

  if (loading) {
    return <div className="p-10 text-center">Memuat laporan...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 ml-0 lg:ml-[260px]">

      {/* HEADER */}
<div className="bg-white rounded-xl shadow p-5 mb-4">

  <div className="flex items-center justify-center gap-4">

    {/* LOGO (dibesarkan) */}
    <img
      src="/images/pmilogo.png"
      alt="Logo PMI"
      className="w-28 h-28 object-contain"
    />

    {/* TEXT HEADER */}
    <div className="text-center">

      <h1 className="text-2xl font-bold">
        LAPORAN KEUANGAN (REKAPITULASI KEUANGAN)
      </h1>

      <h2 className="text-red-600 font-bold text-xl mt-1">
        PALANG MERAH INDONESIA KABUPATEN BULELENG
      </h2>

    </div>

  </div>

</div>

      {/* FILTER */}
      <LaporanFilter
        filterUnit={filterUnit}
        setFilterUnit={setFilterUnit}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        onExportPDF={() =>
          exportPDF({
            masuk,
            keluar,
            totalMasuk,
            totalKeluar,
            saldo,
            filterUnit,
          })
        }
        onExportExcel={() =>
          exportExcel({
            masuk,
            keluar,
            totalMasuk,
            totalKeluar,
            saldo,
            filterUnit,
          })
        }
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm border-collapse">

          <thead>
            <tr>
              <th colSpan="4" className="bg-slate-100 p-3 font-semibold">
                PENERIMAAN
              </th>
              <th colSpan="4" className="bg-red-50 text-red-700 p-3 font-semibold">
                PENGELUARAN
              </th>
            </tr>

            <tr>
              <th className="border p-2">NO</th>
              <th className="border p-2">TANGGAL</th>
              <th className="border p-2">URAIAN</th>
              <th className="border p-2">JUMLAH</th>

              <th className="border p-2">NO</th>
              <th className="border p-2">TANGGAL</th>
              <th className="border p-2">URAIAN</th>
              <th className="border p-2">JUMLAH</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({
              length: Math.max(masuk.length, keluar.length),
            }).map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">

                {/* MASUK */}
                <td className="border p-2 text-center">
                  {masuk[i] ? i + 1 : ""}
                </td>

                <td className="border p-2">
                  {masuk[i]?.tanggal ? formatTanggal(masuk[i].tanggal) : ""}
                </td>

                <td className="border p-2 align-top">
                  <div className="font-semibold">
                    {masuk[i]?.akun?.nama || masuk[i]?.akun_kode}
                  </div>

                  {/* DETAIL */}
                  {masuk[i]?.details?.map((d, idx) => (
                    <div key={idx} className="pl-3 text-sm text-gray-600">
                      • {d.uraian}
                    </div>
                  ))}

                  {/* BUTTON DETAIL */}
                  {masuk[i] && (
                    <button
                      onClick={() => setSelected(masuk[i])}
                      className="mt-2 text-blue-600 text-xs hover:underline"
                    >
                      Lihat Detail
                    </button>
                  )}
                </td>

                <td className="border p-2 text-right">
                  {masuk[i]?.details?.map((d, idx) => (
                    <div key={idx} className="text-green-700">
                      Rp {Number(d.subtotal || 0).toLocaleString("id-ID")}
                    </div>
                  ))}
                </td>

                {/* KELUAR */}
                <td className="border p-2 text-center">
                  {keluar[i] ? i + 1 : ""}
                </td>

                <td className="border p-2">
                  {keluar[i]?.tanggal
                    ? formatTanggal(keluar[i].tanggal)
                    : ""}
                </td>

                <td className="border p-2 align-top">
                  <div className="font-semibold">
                    {keluar[i]?.akun?.nama || keluar[i]?.akun_kode}
                  </div>

                  {/* DETAIL */}
                  {keluar[i]?.details?.map((d, idx) => (
                    <div key={idx} className="pl-3 text-sm text-gray-600">
                      • {d.uraian}
                    </div>
                  ))}

                  {/* BUTTON DETAIL */}
                  {keluar[i] && (
                    <button
                      onClick={() => setSelected(keluar[i])}
                      className="mt-2 text-blue-600 text-xs hover:underline"
                    >
                      Lihat Detail
                    </button>
                  )}
                </td>

                <td className="border p-2 text-right">
                  {keluar[i]?.details?.map((d, idx) => (
                    <div key={idx} className="text-red-700">
                      Rp {Number(d.subtotal || 0).toLocaleString("id-ID")}
                    </div>
                  ))}
                </td>

              </tr>
            ))}

            {/* TOTAL */}
            <tr className="font-semibold">
              <td colSpan="4" className="bg-slate-100 p-3 text-center">
                TOTAL PENERIMAAN Rp {totalMasuk.toLocaleString("id-ID")}
              </td>

              <td colSpan="4" className="bg-red-50 text-red-700 p-3 text-center">
                TOTAL PENGELUARAN Rp {totalKeluar.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      {/* MODAL DETAIL */}
      <LaporanDetailModal
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}