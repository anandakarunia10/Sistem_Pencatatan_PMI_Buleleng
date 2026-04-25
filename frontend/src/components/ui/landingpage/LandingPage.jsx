"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingPage() {
  /* ================= TITLE ================= */
  const titleText = "PMI Buleleng";
  const [displayTitle, setDisplayTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    if (titleIndex < titleText.length) {
      const timeout = setTimeout(() => {
        setDisplayTitle((prev) => prev + titleText[titleIndex]);
        setTitleIndex(titleIndex + 1);
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [titleIndex]);

  /* ================= SUBTITLE ================= */
  const subtitle = [
    "Sistem Pencatatan Keuangan",
    "Palang Merah Indonesia Kabupaten Buleleng",
  ];

  const [subText, setSubText] = useState(["", ""]);
  const [subLine, setSubLine] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  useEffect(() => {
    if (subLine < subtitle.length) {
      if (subIndex < subtitle[subLine].length) {
        const timeout = setTimeout(() => {
          setSubText((prev) => {
            const newText = [...prev];
            newText[subLine] += subtitle[subLine][subIndex];
            return newText;
          });
          setSubIndex(subIndex + 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setSubLine(subLine + 1);
        setSubIndex(0);
      }
    }
  }, [subIndex, subLine]);

  return (
    <main
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('/images/buleleng.jpg')" }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/60 to-black/80" />

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="
          relative z-10
          backdrop-blur-md bg-white/15
          border border-white/20
          rounded-2xl
          shadow-2xl
          px-6 sm:px-10 py-10 sm:py-12
          w-full max-w-md
          text-center
          text-white
        "
      >
        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide min-h-[48px]">
          {displayTitle}
          <span className="animate-pulse">|</span>
        </h1>

        {/* SUBTITLE */}
        <div className="mt-4 space-y-1 text-gray-200">
          <p className="text-xs sm:text-sm leading-relaxed min-h-[20px]">
            {subText[0]}
            <span className="animate-pulse">|</span>
          </p>
          <p className="text-xs sm:text-sm leading-relaxed min-h-[20px]">
            {subText[1]}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="w-24 h-[2px] bg-red-500 mx-auto mt-6 rounded-full" />

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-1">
          <Link href="/login" className="w-full sm:w-1/2 flex justify-center">
            <button
              className="
                w-[95%] sm:w-[90%]
                py-2 text-xs font-medium
                bg-red-600 hover:bg-red-700
                text-white
                rounded-md
                shadow-sm hover:shadow-md
                transition-all duration-300
              "
            >
              Login
            </button>
          </Link>

          <Link href="/register" className="w-full sm:w-1/2 flex justify-center">
            <button
              className="
                w-[95%] sm:w-[90%]
                py-2 text-xs font-medium
                bg-white text-red-600
                border border-white
                rounded-md
                shadow-sm hover:shadow-md
                hover:bg-gray-100
                transition-all duration-300
              "
            >
              Register
            </button>
          </Link>
        </div>

        {/* FOOTER */}
        <p className="mt-12 text-xs text-gray-300">
          © 2025 PMI Kabupaten Buleleng
        </p>
      </motion.div>
    </main>
  );
}
