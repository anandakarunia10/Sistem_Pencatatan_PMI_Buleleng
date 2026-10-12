"use client";

import { useEffect, useState } from "react";
import TransaksiTable from "@/components/ui/table/TransaksiTable";
import Loading from "@/components/loading/loading";

export default function TransaksiPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = " Data Transaksi | PMI Buleleng";

    // simulasi loading (nanti bisa diganti fetch data real kalau perlu)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 ml-0 lg:ml-[260px] p-4 sm:p-6">
      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold text-black mb-4">
        DATA TRANSAKSI
      </h1>

      {/* CONTENT */}
      <TransaksiTable />
    </div>
  );
}