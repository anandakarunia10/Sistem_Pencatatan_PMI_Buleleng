"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, User } from "lucide-react";
import { Poppins, Caveat } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  const [openProfil, setOpenProfil] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [activeSection, setActiveSection] = useState("#beranda");

  const dropdownProfilRef = useRef(null);
  const dropdownAuthRef = useRef(null);

  useEffect(() => {
    if (window.location.hash) {
      setActiveSection(window.location.hash);
    }

    const handleHashChange = () => {
      setActiveSection(window.location.hash || "#beranda");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownProfilRef.current &&
        !dropdownProfilRef.current.contains(event.target)
      ) {
        setOpenProfil(false);
      }
      if (
        dropdownAuthRef.current &&
        !dropdownAuthRef.current.contains(event.target)
      ) {
        setOpenAuth(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProfilActive = [
    "#tentang",
    "#visi-misi",
    "#struktur",
    "#galeri",
  ].includes(activeSection);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 ${poppins.className}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-start">
        {/* LOGO & BRAND */}
        {/* Mengubah gap-4 menjadi gap-2 agar jarak antar elemen utama lebih rapat */}
        <Link
          href="#beranda"
          onClick={() => setActiveSection("#beranda")}
          className={`flex items-center gap-2 group select-none ${poppins.className}`}
        >
          {/* BAGIAN KIRI: LOGO + PALANG MERAH INDONESIA */}
          {/* gap-2.5 membuat teks Palang Merah Indonesia pas jaraknya dengan logo */}
          <div className="flex items-center gap-2.5">
            {/* Emblem Logo */}
            <div className="transition-transform duration-300 group-hover:scale-105 shrink-0">
              <Image
                src="/images/pmilogo.png"
                alt="PMI Logo"
                width={68}
                height={68}
                className="object-contain"
              />
            </div>

            {/* Teks Utama - DIPANGKAS lebarnya (w-[88px] md:w-[100px]) agar mepet ke kanan pas di huruf terakhir */}
            <h1 className="font-bold text-[15px] md:text-[17px] leading-[1.1] tracking-normal text-neutral-800 uppercase w-[88px] md:w-[100px]">
              Palang Merah Indonesia
            </h1>
          </div>

          {/* GARIS PEMBATAS VERTIKAL - Sekarang mepet tanpa jarak dari teks kiri */}
          <div className="h-14 w-[2px] bg-red-500 self-center shrink-0" />

          {/* BAGIAN KANAN: WILAYAH KABUPATEN + SLOGAN */}
          {/* pl-2 memberikan sedikit jarak aman (padding-left) agar teks kanan tidak menempel mati ke garis */}
          <div className="flex flex-col justify-center pl-2">
            {/* Kabupaten Buleleng */}
            <div className="flex flex-col leading-[1.05] uppercase tracking-normal text-black font-black text-[18px] md:text-[21px] w-[120px] md:w-[150px]">
              <span>Kabupaten</span>
              <span>Buleleng</span>
            </div>

            {/* Slogan "Kami Siap Bantu" */}
            <p
              className={`${caveat.className} text-[18px] md:text-[20px] text-gray-600 mt-[-2px] tracking-wide normal-case`}
            >
              Provinsi<span className="text-red-500 font-bold">Bali</span>{" "}
              indonesia
            </p>
          </div>
        </Link>

        {/* MENU UTAMA */}
        <div className="hidden md:flex items-center gap-10 text-lg tracking-wide transition-all font-medium ml-auto mr-10">
          <a
            href="#beranda"
            onClick={() => setActiveSection("#beranda")}
            className={`uppercase transition-all duration-200 ${
              activeSection === "#beranda"
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Beranda
          </a>

          <div
            className="relative py-2"
            ref={dropdownProfilRef}
            onMouseEnter={() => setOpenProfil(true)}
            onMouseLeave={() => setOpenProfil(false)}
          >
            <button
              className={`flex items-center gap-1 uppercase transition-all duration-200 ${
                isProfilActive ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              Profil
              <ChevronDown
                size={18}
                className={isProfilActive ? "text-black" : "text-gray-400"}
              />
            </button>

            {openProfil && (
              <div className="absolute top-10 left-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200/80 overflow-hidden z-50 py-2 font-medium backdrop-blur-md">
                {[
                  { id: "#tentang", label: "Tentang Kami" },
                  { id: "#visi-misi", label: "Visi & Misi" },
                  { id: "#struktur", label: "Struktur Organisasi" },
                  { id: "#galeri", label: "Galeri Kegiatan" },
                ].map((item, index, arr) => (
                  <a
                    key={item.id}
                    href={item.id}
                    onClick={() => {
                      setOpenProfil(false);
                      setActiveSection(item.id);
                    }}
                    className={`block px-6 py-4 text-[16px] transition-all duration-300 ${
                      index !== arr.length - 1 ? "border-b border-gray-100" : ""
                    } ${
                      activeSection === item.id
                        ? `
              text-red-700
              bg-red-50
              font-semibold
              shadow-[0_4px_16px_rgba(220,38,38,0.18)]
            `
                        : `
              text-gray-500
              hover:text-black
              hover:bg-gray-50
              hover:shadow-sm
            `
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#layanan"
            onClick={() => setActiveSection("#layanan")}
            className={`uppercase transition-all duration-200 ${
              activeSection === "#layanan"
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Layanan
          </a>

          <a
            href="#kontak"
            onClick={() => setActiveSection("#kontak")}
            className={`uppercase transition-all duration-200 ${
              activeSection === "#kontak"
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Kontak
          </a>
        </div>

        {/* USER */}
        <div
          className="relative py-2"
          ref={dropdownAuthRef}
          onMouseEnter={() => setOpenAuth(true)}
          onMouseLeave={() => setOpenAuth(false)}
        >
          {/* BASE BUTTON PUTIH (SESUAI IMAGE_9F8E89.PNG) */}
          <button className="flex items-center gap-1.5 p-2.5 rounded-full border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all">
            {/* IKON MENGGUNAKAN ABU-ABU TUA */}
            <User size={24} className="text-gray-600" />
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {openAuth && (
            <div className="absolute top-12 right-0 w-52 bg-white rounded-lg border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50 py-1">
              <Link
                href="/login"
                onClick={() => setOpenAuth(false)}
                className="block px-6 py-3.5 text-gray-500 hover:text-black hover:bg-gray-50 transition-all"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setOpenAuth(false)}
                className="block px-6 py-3.5 text-gray-500 hover:text-black hover:bg-gray-50 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
