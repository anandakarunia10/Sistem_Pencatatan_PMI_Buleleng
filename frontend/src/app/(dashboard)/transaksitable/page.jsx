"use client";

import { useEffect, useState } from "react";
import TransaksiTable from "@/components/ui/table/TransaksiTable";
import Loading from "@/components/loading/loading";

export default function DaftarTransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set title halaman
  useEffect(() => {
    document.title = "Daftar Transaksi | PMI Buleleng";
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/transaksi", {
          headers: { "Accept": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setTransactions(data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6 ml-4 md:ml-[200px]">
        Detail Transaksi
      </h1>
      <TransaksiTable transactions={transactions} />
    </div>
  );
}
