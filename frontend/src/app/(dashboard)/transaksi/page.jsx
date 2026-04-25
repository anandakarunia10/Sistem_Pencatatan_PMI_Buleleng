"use client";

import { useEffect } from "react";
import TransaksiForm from "@/components/ui/form/TransaksiForm";

export default function TransaksiPageContent() {
  useEffect(() => {   
    document.title = "Transaksi | PMI Buleleng";
  }, []);

  return (
    <div className="p-4 sm:p-6">
      {/* Wrapper konten agar tidak ketutup sidebar */}
      <div className="pl-0 sm:pl-[240px]">
        <h1 className="text-xl sm:text-2xl font-bold text-black mb-1">
          Dashboard Transaksi
        </h1>
      </div>

      {/* Form tetap ikut layout */}
      <div className="pl-0 sm:pl-[240px]">
        <TransaksiForm />
      </div>
    </div>
  );
}
