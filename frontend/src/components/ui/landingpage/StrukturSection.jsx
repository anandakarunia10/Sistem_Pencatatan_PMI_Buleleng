"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch } from "react-icons/fi";

export default function StrukturSection() {
  const [openImg, setOpenImg] = useState(null);

  return (
    <>
      {/* SECTION */}
      <section
        id="struktur"
        className="relative py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Struktur <span className="text-red-600">Organisasi</span>
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Struktur organisasi PMI Kabupaten Buleleng menggambarkan susunan
              kepengurusan dan pembagian tugas dalam menjalankan pelayanan
              kemanusiaan.
            </p>
          </motion.div>

          {/* GRID FOTO */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* FOTO 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="space-y-3"
            >
              {/* TITLE */}
              <h3 className="text-lg font-bold text-gray-900 text-center">
                Struktur Pengurus & Dewan Kehormatan
              </h3>
              <div
                onClick={() => setOpenImg("/images/struktur1.jpeg")}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src="/images/struktur1.jpeg"
                  alt="Struktur Pengurus"
                  className="w-full h-[400px] object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition">
                  <FiSearch className="text-white text-4xl" />
                  <p className="text-white mt-3 font-semibold">
                    Klik untuk memperbesar
                  </p>
                </div>
              </div>
            </motion.div>

            {/* FOTO 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="space-y-3"
            >
              {/* TITLE */}
              <h3 className="text-lg font-bold text-gray-900 text-center">
                Struktur Susunan Tata Laksana
              </h3>

              <div
                onClick={() => setOpenImg("/images/struktur2.jpeg")}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src="/images/struktur2.jpeg"
                  alt="Susunan Tata Laksana"
                  className="w-full h-[400px] object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition">
                  <FiSearch className="text-white text-4xl" />
                  <p className="text-white mt-3 font-semibold">
                    Klik untuk memperbesar
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POPUP IMAGE */}
      <AnimatePresence>
        {openImg && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImg(null)}
          >
            {/* close */}
            <button
              onClick={() => setOpenImg(null)}
              className="absolute top-6 right-6 bg-white p-3 rounded-full shadow hover:bg-red-600 hover:text-white"
            >
              <FiX />
            </button>

            <motion.img
              src={openImg}
              alt="Preview Struktur"
              className="max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white"
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
