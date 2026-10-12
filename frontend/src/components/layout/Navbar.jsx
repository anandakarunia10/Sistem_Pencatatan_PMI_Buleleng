"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      router.push("/");
    }, 1500);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-red-800 via-red-700 to-red-800 border-b border-red-900/20 shadow-sm">
        <div className="h-full flex items-center justify-between px-4 sm:px-6">
          {/* LEFT */}
          <div className="flex items-center gap-3 ml-12 md:ml-[230px] min-w-0">
            <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <Image
                src="/images/pmilogo.png"
                alt="Logo PMI Kabupaten Buleleng"
                fill
                sizes="40px"
                priority
                className="object-contain p-1"
              />
            </div>

            <div className="leading-tight min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-white truncate">
                Sistem Pencatatan Keuangan
              </h1>
              <p className="text-[10px] tracking-[2.5px] uppercase text-white/90 font-semibold truncate">
                PMI Kabupaten Buleleng
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="mr-1 md:mr-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-300 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v7m5.657-3.657a7 7 0 11-11.314 0"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ✅ TOAST ELEGAN PMI */}
      {showToast && (
        <div className="fixed top-20 right-5 z-[9999] animate-fade-in">
          <div className="flex items-center gap-3 bg-white border-l-4 border-green-600 shadow-lg rounded-xl px-4 py-3 w-[260px]">
            {/* ICON */}
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* TEXT */}
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Logout Berhasil
              </p>
              <p className="text-xs text-gray-500">
                Anda telah keluar dari sistem
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}