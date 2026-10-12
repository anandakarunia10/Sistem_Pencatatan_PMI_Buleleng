// src/app/laporan/page.jsx
"use client";

import { useState, useEffect } from "react";
import LaporanTable from "@/components/ui/table/LaporanTable";
import Loading from "@/components/loading/loading";

export default function LaporanPage() {
  const [loading, setLoading] = useState(true); // state loading
  const [laporan, setLaporan] = useState([]);   // data laporan

  // Set title dinamis
  useEffect(() => {
    document.title = "Laporan | PMI Buleleng";
  }, []);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/transaksi", {
          headers: { "Accept": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setLaporan(data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil laporan:", error);
      } finally {
        setLoading(false); // selesai loading
      }
    };

    fetchLaporan();
  }, []);

  // tampilkan animasi loading saat data belum siap
  if (loading) return <Loading />;

  return (
    <main className="p-6">
       <div className="pl-0 sm:pl-[240px]">

        <h1 className="text-xl sm:text-2xl font-bold text-black mb-1">
          LAPORAN TRANSKASI
        </h1>
      </div>

      {/* kirim data ke LaporanTable */}
      <LaporanTable laporan={laporan} />
    </main>
  );
}
