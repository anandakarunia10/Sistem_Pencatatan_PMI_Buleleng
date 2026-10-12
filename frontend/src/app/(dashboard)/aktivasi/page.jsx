"use client";

import { useEffect, useState } from "react";
import AktivasiTable from "@/components/ui/table/AktivasiTable";
import Loading from "@/components/loading/loading";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Aktivasi Akun | PMI Buleleng";

    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 ml-0 lg:ml-[260px] p-4 sm:p-6">

      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold text-black mb-4">
        AKTIVASI AKUN
      </h1>

      {/* CONTENT */}
      <AktivasiTable />

    </div>
  );
}