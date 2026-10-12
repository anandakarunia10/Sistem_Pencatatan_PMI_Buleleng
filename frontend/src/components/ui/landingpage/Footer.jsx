"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-red-700 mt-16 py-14 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          
          
          {/* KOLOM 1: Tentang & Sosmed */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Palang Merah Indonesia
            </h3>
            <p className="text-sm text-red-100 leading-relaxed text-justify">
              PMI Kabupaten Buleleng adalah organisasi kemanusiaan yang
              bergerak di bidang sosial, kesehatan, dan penanggulangan bencana
              dengan prinsip kemanusiaan untuk masyarakat.
            </p>

            {/* SOCIAL - Background Putih */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.instagram.com/pmi.buleleng?igsh=MXQ2ZHJpazR3Ymc5cA=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white hover:bg-gray-100 transition shadow-md flex items-center justify-center"
              >
                <FaInstagram className="text-xl text-pink-600" />
              </a>

              <a
                href="https://www.tiktok.com/@pmi.buleleng?_r=1&_t=ZS-97krtlcHeLY"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white hover:bg-gray-100 transition shadow-md flex items-center justify-center"
              >
                <FaTiktok className="text-xl text-black" />
              </a>

              <a
                href="https://www.facebook.com/share/1BejtA1B79/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white hover:bg-gray-100 transition shadow-md flex items-center justify-center"
              >
                <FaFacebook className="text-xl text-blue-700" />
              </a>
            </div>
          </div>

          {/* KOLOM 2: Layanan */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6">
              Layanan Kami
            </h3>
            <ul className="space-y-3 text-sm text-red-100 text-center">
              <li>Unit Transfusi Darah (UTD)</li>
              <li>Pelayanan Ambulans</li>
              <li>Penanggulangan Bencana</li>
              <li>Pelatihan Pertolongan Pertama</li>
              <li>Pembinaan Relawan</li>
            </ul>
          </div>

          {/* KOLOM 3: Kontak */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Kontak Kami
            </h3>
            <ul className="space-y-4 text-sm text-red-100">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0" />
                <span>Jalan Wijaya Kusuma No. 3A, Singaraja - Bali</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>(0362) 22348</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>buleleng@pmibali.or.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>kab_buleleng@pmi.or.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={18} className="shrink-0" />
                <a
                  href="https://pmibuleleng.or.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  pmibuleleng.or.id
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* FOOTER BOTTOM */}
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-red-100">
          © {new Date().getFullYear()} PMI Kabupaten Buleleng
        </div>
      </div>
    </footer>
  );
}