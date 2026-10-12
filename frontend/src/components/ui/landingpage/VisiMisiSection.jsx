"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

export default function VisiMisiSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SECTION */}
      <section
        id="visi-misi"
        className="relative py-24 bg-[url('/images/register.jpg')] bg-cover bg-center bg-fixed"
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-white/80"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* JUDUL */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Visi <span className="text-red-600">&</span> Misi
            </h2>
          </motion.div>

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              {/* FOTO */}
              <div
                onClick={() => setIsOpen(true)}
                className="relative cursor-pointer group overflow-hidden"
              >
                <img
                  src="/images/visimisi.jpeg"
                  alt="Visi dan Misi PMI"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <FiSearch className="text-red-600 text-3xl" />
                  </div>

                  <h3 className="text-white text-2xl font-bold mt-5">
                    Lihat Visi & Misi
                  </h3>

                  <p className="text-white/80 mt-2">Klik untuk memperbesar</p>
                </div>
              </div>

              {/* KONTEN */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-3"></div>

                <h3 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                  Komitmen PMI Kab.Buleleng
                </h3>

                <p className="text-gray-600 leading-8 text-justify">
                  Visi dan Misi merupakan landasan utama yang menjadi arah dalam
                  penyelenggaraan seluruh kegiatan Palang Merah Indonesia
                  Kabupaten Buleleng. Melalui pedoman ini, PMI berkomitmen
                  memberikan pelayanan kemanusiaan yang cepat, tepat,
                  profesional, dan berorientasi pada kebutuhan masyarakat.
                </p>

                <p className="text-gray-600 leading-8 mt-5 text-justify">
                  Dokumen ini mencerminkan tujuan organisasi, nilai kemanusiaan,
                  serta komitmen PMI dalam membangun pelayanan yang berkualitas
                  dan meningkatkan kepercayaan masyarakat.
                </p>

                {/* HIGHLIGHT */}
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="group bg-gradient-to-br from-red-50 to-white rounded-2xl p-5 border border-red-100 hover:shadow-md transition">
                    <h4 className="font-bold text-red-600 mb-2">
                      Pedoman Organisasi
                    </h4>
                    <p className="text-sm text-gray-600 leading-6">
                      Dasar dalam pengambilan keputusan dan pelaksanaan program
                      kerja.
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-red-50 to-white rounded-2xl p-5 border border-red-100 hover:shadow-md transition">
                    <h4 className="font-bold text-red-600 mb-2">
                      Pelayanan Kemanusiaan
                    </h4>
                    <p className="text-sm text-gray-600 leading-6">
                      Fokus pada pelayanan cepat, tepat, dan profesional kepada
                      masyarakat.
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-red-50 to-white rounded-2xl p-5 border border-red-100 hover:shadow-md transition">
                    <h4 className="font-bold text-red-600 mb-2">Integritas</h4>
                    <p className="text-sm text-gray-600 leading-6">
                      Menjunjung tinggi kejujuran, transparansi, dan tanggung
                      jawab.
                    </p>
                  </div>

                  <div className="group bg-gradient-to-br from-red-50 to-white rounded-2xl p-5 border border-red-100 hover:shadow-md transition">
                    <h4 className="font-bold text-red-600 mb-2">
                      Pengembangan
                    </h4>
                    <p className="text-sm text-gray-600 leading-6">
                      Meningkatkan kualitas organisasi, relawan, dan layanan
                      berkelanjutan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* POPUP (HARUS DI LUAR SECTION) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-xl hover:bg-red-600 hover:text-white transition"
            >
              <FiX size={25} />
            </button>

            {/* image */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 rounded-3xl"></div>

              <img
                src="/images/visimisi.jpeg"
                alt="Visi Misi"
                className="relative rounded-3xl border-4 border-white shadow-[0_30px_80px_rgba(0,0,0,.5)] max-h-[90vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
