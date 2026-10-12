"use client";

import { useState } from "react"; // Tambahan: Import useState
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";
import SejarahPopup from "./SejarahPopup";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function TentangSection() {
  // Tambahan: State untuk popup
  const [selectedImage, setSelectedImage] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);

  const dokumentasi = [
    { img: "/images/tentang1.jpeg" },
    { img: "/images/tentang2.jpeg" },
    { img: "/images/tentang3.jpeg" },
    { img: "/images/tentang4.jpeg" },
    { img: "/images/beranda1.jpeg" },
  ];

  return (
    <section
      id="tentang"
      className="min-h-screen flex items-center bg-gray-50 px-6 py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-10 md:gap-16 items-stretch w-full">
        {/* KIRI - TEKS (Animasi masuk dari Kiri) */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Tentang <span className="text-red-600">Kami</span>
          </h2>

          <div className="mt-8 space-y-6 text-gray-600 leading-8 text-[15px] text-justify">
            <p>
              Palang Merah Indonesia (PMI) Kabupaten Buleleng adalah organisasi
              kemanusiaan tepercaya yang berkomitmen penuh dalam memberikan
              pelayanan terbaik bagi masyarakat. Berdiri sejak dibentuknya Unit
              Donor Darah (UDD) pada 1 September 1981, PMI Buleleng terus
              bertransformasi menjadi lembaga yang responsif dan profesional.
            </p>
            <p>
              Memasuki babak baru di bawah kepengurusan masa bakti 2025–2030,
              kami kini melayani masyarakat melalui Kantor Markas baru yang
              lebih representatif di Jalan Wijaya Kusuma, Kelurahan Banyuasri
              demi mengoptimalkan penanggulangan bencana dan layanan sosial.
            </p>
            <p>
              Dengan dukungan masyarakat melalui Bulan Dana serta sinergi aktif
              dari para relawan, PMI Buleleng berfokus penuh pada penguatan
              kesiapsiagaan wilayah rawan bencana, pembinaan generasi muda
              Palang Merah Remaja (PMR), serta pemenuhan target kebutuhan darah
              bagi puluhan rumah sakit di kawasan Buleleng dan sekitarnya.
            </p>
          </div>
          <div className="mt-10">
            <button
              onClick={() => setOpenHistory(true)}
              className="
    inline-flex
    items-center
    gap-2
    px-6
    py-3
    rounded-full
    border
    border-red-600
    text-red-600
    font-semibold
    text-sm
    hover:bg-red-600
    hover:text-white
    transition-all
    duration-300
    group
  "
            >
              Lihat Detail Sejarah
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* KANAN - SLIDER FOTO (Animasi masuk dari Kanan) */}
        <motion.div
          className="md:col-span-3 relative h-[350px] md:h-auto custom-tentang-swiper"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="absolute inset-0 w-full h-full">
            {/* Tombol Navigasi */}
            <button className="tentang-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md border border-gray-100 text-gray-700 hover:text-white hover:bg-red-600 transition-all duration-300 z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <button className="tentang-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md border border-gray-100 text-gray-700 hover:text-white hover:bg-red-600 transition-all duration-300 z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Pagination di Tengah Bawah */}
            <div className="tentang-pagination absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20" />

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              loop
              navigation={{
                nextEl: ".tentang-next",
                prevEl: ".tentang-prev",
              }}
              pagination={{
                clickable: true,
                el: ".tentang-pagination",
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="w-full h-full rounded-3xl overflow-hidden shadow-md border border-gray-100"
            >
              {dokumentasi.map((item, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <div
                    className="relative w-full h-full bg-gray-200 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(item.img)} // Tambahan: Klik untuk buka popup
                  >
                    <img
                      src={item.img}
                      alt={`Dokumentasi PMI ${index + 1}`}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Style Custom Bullet */}
          <style jsx global>{`
            .custom-tentang-swiper .swiper-pagination-bullet {
              width: 8px;
              height: 8px;
              background: rgba(255, 255, 255, 0.6);
              opacity: 1;
              transition: all 0.3s ease;
              cursor: pointer;
            }

            .custom-tentang-swiper .swiper-pagination-bullet-active {
              width: 8px;
              background: #ffffff !important;
              transform: scale(1.3);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </motion.div>
      </div>

      {/* Tambahan: Modal Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
      <SejarahPopup open={openHistory} onClose={() => setOpenHistory(false)} />
    </section>
  );
}
