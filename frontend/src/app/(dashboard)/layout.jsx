"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import '@/styles/globals.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* KONTEN KANAN */}
      <div className="flex flex-col flex-1">
        
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 mt-14">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
}
