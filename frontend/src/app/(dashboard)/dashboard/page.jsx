"use client";

import { useEffect, useState } from "react";
import DashboardTable from "@/components/ui/table/DashboardTable";
import Loading from "@/components/loading/loading";

export default function TransaksiPageContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | PMI Buleleng";

  
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
         DASHBOARD
      </h1>

      {/* FORM */}
      <DashboardTable />
    </div>
  );
}