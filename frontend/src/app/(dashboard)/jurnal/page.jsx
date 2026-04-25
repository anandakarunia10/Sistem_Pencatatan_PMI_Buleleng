"use client";

import { useState, useEffect } from "react";
import JurnalPage from "@/components/ui/table/JurnalTable";
import Loading from "@/components/loading/loading";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Set title halaman
  useEffect(() => {
    document.title = "Jurnal | PMI Buleleng";
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
        console.error("Gagal mengambil data jurnal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // tampilkan loading saat data belum siap
  if (loading) return <Loading />;

  return <JurnalPage transactions={transactions} />;
}
