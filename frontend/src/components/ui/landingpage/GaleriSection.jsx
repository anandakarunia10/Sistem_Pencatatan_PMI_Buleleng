"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FiX, FiSearch } from "react-icons/fi";

export default function GaleriSection() {
  const data = [
    {
      img: "/images//utd1.jpeg",
      title: "Unit Transfusi Darah (UTD)",
      category: "utd",
    },
     {
      img: "/images//utd2.jpeg",
      title: "Unit Transfusi Darah (UTD)",
      category: "utd",
    },

    //ambulance
    {
      img: "/images/ambulance3.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
    {
      img: "/images/p3k.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
     {
      img: "/images/ambulance1.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
     {
      img: "/images/ambulance2.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
     {
      img: "/images/ambulance4.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
     {
      img: "/images/ambulance5.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
     {
      img: "/images/ambulance6.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },
      {
      img: "/images/ambulance7.jpeg",
      title: "Pelayanan Ambulans",
      category: "ambulans",
    },




    //bencana
    {
      img: "/images/bencana1.jpeg",
      title: "Penanggulangan Bencana",
      category: "bencana",
    },
     {
      img: "/images/bencana2.jpeg",
      title: "Penanggulangan Bencana",
      category: "bencana",
    },

    //pelatihan 
    {
      img: "/images/tentang1.jpeg",
      title: "Pelatihan Pertolongan Pertama",
      category: "pelatihan",
    },
     {
      img: "/images/p3k3.jpeg",
      title: "Pelatihan Pertolongan Pertama",
      category: "pelatihan",
    },

    //relawanx
    {
      img: "/images/relawan1.jpeg",
      title: "Pembinaan Relawan",
      category: "relawan",
    },
    {
      img: "/images/beranda1.jpeg",
      title: "Pembinaan Relawan",
      category: "relawan",
    },
  ];

  const [active, setActive] = useState("all");
  const [index, setIndex] = useState(0);
  const [openImg, setOpenImg] = useState(null);

  const filtered =
    active === "all" ? data : data.filter((item) => item.category === active);

  // reset index saat filter berubah
  useEffect(() => {
    setIndex(0);
  }, [active]);

  // keamanan index
  const safeIndex = filtered.length > 0 ? index % filtered.length : 0;

  const next = () => {
    if (filtered.length === 0) return;
    setIndex((prev) => (prev + 1) % filtered.length);
  };

  const prev = () => {
    if (filtered.length === 0) return;
    setIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };
  useEffect(() => {
    if (filtered.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % filtered.length);
    }, 4000); // ganti 4000 = 4 detik

    return () => clearInterval(interval);
  }, [filtered.length, active]);

  return (
    <>
      {/* SECTION */}
      <section id ="galeri" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          {/* TITLE */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">
              Galeri <span className="text-red-600">Kegiatan</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Dokumentasi kegiatan PMI Kabupaten Buleleng
            </p>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { key: "all", label: "Semua" },
              { key: "utd", label: "UTD" },
              { key: "ambulans", label: "Ambulans" },
              { key: "bencana", label: "Bencana" },
              { key: "pelatihan", label: "Pelatihan" },
              { key: "relawan", label: "Relawan" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setActive(btn.key)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                  active === btn.key
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 hover:border-red-400"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* SLIDER */}
          {filtered.length > 0 ? (
            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filtered[safeIndex].img}
                  className="absolute inset-0 cursor-pointer"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setOpenImg(filtered[safeIndex].img)}
                >
                  <img
                    src={filtered[safeIndex].img}
                    className="w-full h-full object-cover"
                  />

                 {/* overlay */}
<div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
  
  <FiSearch className="text-white text-5xl mb-3 opacity-90" />

  <h3 className="text-white text-2xl font-bold">
    {filtered[safeIndex].title}
  </h3>

</div>
                </motion.div>
              </AnimatePresence>

              {/* NAV */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full"
              >
                ‹
              </button>

              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full"
              >
                ›
              </button>

              {/* DOT */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {filtered.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
                      i === safeIndex ? "bg-red-600 scale-125" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              Tidak ada data pada kategori ini
            </div>
          )}
        </div>
      </section>

      {/* POPUP */}
      <AnimatePresence>
        {openImg && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImg(null)}
          >
            <button
              onClick={() => setOpenImg(null)}
              className="absolute top-6 right-6 bg-white p-3 rounded-full hover:bg-red-600 hover:text-white"
            >
              <FiX />
            </button>

            <motion.img
              src={openImg}
              className="max-h-[90vh] rounded-2xl border-4 border-white shadow-2xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
