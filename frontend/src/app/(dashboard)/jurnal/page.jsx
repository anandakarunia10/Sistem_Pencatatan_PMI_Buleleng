"use client";

import { useState, useEffect } from "react";
import JurnalPage from "@/components/ui/table/JurnalTable";
import Loading from "@/components/loading/loading";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    document.title = "Jurnal | PMI Buleleng";
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch("http://127.0.0.1:8000/api/transaksi", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
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

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 ml-0 lg:ml-[260px] p-4 sm:p-6">
      
      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold text-black mb-4">
       JURNAL TRANSKASI
      </h1>

      {/* CONTENT */}
      <JurnalPage transactions={transactions} />
    </div>
  );
}