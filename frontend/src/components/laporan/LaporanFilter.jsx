"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Check, Download, Search } from "lucide-react";

export default function LaporanFilter({
  filterUnit,
  setFilterUnit,
  onExportPDF,
  onExportExcel,

  // TAMBAHAN FILTER DATE
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  onTampilkan,
}) {
  const [openUnit, setOpenUnit] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  const unitRef = useRef(null);
  const exportRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (unitRef.current && !unitRef.current.contains(event.target)) {
        setOpenUnit(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const units = ["SEMUA", "PMI", "Ambulance"];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-end gap-4">

      {/* ================= FILTER UNIT ================= */}
      <div ref={unitRef} className="relative w-full md:w-64">

         <label className="text-xs font-extrabold tracking-wide text-slate-500">
          Filter Unit
        </label>

        <button
          onClick={() => setOpenUnit(!openUnit)}
          className="
            mt-2 w-full h-11 px-4
            flex items-center justify-between
            rounded-xl
            bg-slate-50
            border border-slate-200
            text-sm font-medium text-slate-700
            hover:bg-white hover:border-red-300
            hover:shadow-sm
            transition
          "
        >
          <span>
            {filterUnit === "SEMUA" ? "Semua Unit" : filterUnit}
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              openUnit ? "rotate-180" : ""
            }`}
          />
        </button>

        {openUnit && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            {units.map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  setFilterUnit(unit);
                  setOpenUnit(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition ${
                  filterUnit === unit
                    ? "bg-red-50 text-red-600 font-semibold"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span>
                  {unit === "SEMUA" ? "Semua Unit" : unit}
                </span>

                {filterUnit === unit && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= FILTER DATE + TOMBOL TAMPILKAN ================= */}
      <div className="flex flex-col gap-2 w-full md:w-auto">

        <label className="text-xs font-extrabold tracking-wide text-slate-500">
  Filter Tanggal
</label>

        <div className="flex gap-2">

          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:bg-white focus:border-red-300 outline-none transition"
          />

          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:bg-white focus:border-red-300 outline-none transition"
          />

          

        </div>
      </div>

      {/* SPACER */}
      <div className="hidden md:block flex-1" />

      {/* ================= EXPORT ================= */}
      <div ref={exportRef} className="relative">

        <button
          onClick={() => setOpenExport(!openExport)}
          className="
            h-11 px-4
            rounded-xl
            bg-red-600
            text-white
            flex items-center gap-2
            hover:bg-red-700
            shadow-sm
            transition
          "
          title="Export Laporan"
        >
          <Download size={18} />
          <span className="text-sm font-medium">Unduh</span>
        </button>

        {openExport && (
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-50">

            <div className="px-4 py-3 border-b bg-slate-50">
              <p className="text-sm font-semibold text-slate-800">
                Export Laporan
              </p>
              <p className="text-xs text-slate-500">
                Pilih format file yang ingin diunduh
              </p>
            </div>

            <button
              onClick={() => {
                onExportExcel();
                setOpenExport(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-emerald-50 transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg border bg-white">
                <Image src="/icons/excel.png" alt="Excel" width={24} height={24} />
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">
                  Export Excel
                </p>
                <p className="text-xs text-slate-500">
                  Format spreadsheet (.xlsx)
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                onExportPDF();
                setOpenExport(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-4 border-t hover:bg-red-50 transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg border bg-white">
                <Image src="/icons/pdf.png" alt="PDF" width={24} height={24} />
              </div>

              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">
                  Export PDF
                </p>
                <p className="text-xs text-slate-500">
                  Format document (.pdf)
                </p>
              </div>
            </button>

          </div>
        )}
      </div>

    </div>
  );
}