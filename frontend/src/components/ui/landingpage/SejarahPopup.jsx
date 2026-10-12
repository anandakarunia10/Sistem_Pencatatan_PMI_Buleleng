"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Building2, HeartHandshake } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function SejarahPopup({ open, onClose }) {
  if (!open) return null;

  const dokumentasi = [
     { img: "/images/login.jpeg" },
    { img: "/images/tentang1.jpeg" },
    { img: "/images/tentang2.jpeg" },
    { img: "/images/tentang3.jpeg" },
    { img: "/images/tentang4.jpeg" },
    { img: "/images/beranda1.jpeg" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: .95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: .95, opacity: 0 }}
          transition={{ duration: .25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-25 bg-white border-b px-8 py-6 flex justify-between items-center rounded-t-3xl">
            <div className="flex items-center gap-4">
              <img
                src="/images/pmilogo.png"
                alt="Logo PMI"
                className="w-12 h-12 object-contain"
              />
              <div>
               

               <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  Sejarah <span className="text-red-600">PMI</span> Kabupaten Buleleng
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-600 hover:text-white transition flex items-center justify-center shrink-0 ml-4"
            >
              <X size={22} />
            </button>
          </div>

          {/* Banner */}
          <div className="relative h-[480px] bg-gray-100">

            <button className="history-prev absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-red-600 hover:text-white transition flex items-center justify-center shadow">
              ❮
            </button>

            <button className="history-next absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-red-600 hover:text-white transition flex items-center justify-center shadow">
              ❯
            </button>

            <div className="history-pagination absolute bottom-5 left-1/2 -translate-x-1/2 z-20"></div>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              loop
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: ".history-next",
                prevEl: ".history-prev",
              }}
              pagination={{
                clickable: true,
                el: ".history-pagination",
              }}
              className="w-full h-full"
            >
              {dokumentasi.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-[480px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10"></div>

          </div>

          {/* Content */}
          <div className="px-8 py-10 space-y-8">

            <p className="text-gray-600 leading-8 text-justify">
              Palang Merah Indonesia (PMI) Kabupaten Buleleng merupakan
              organisasi kemanusiaan yang senantiasa hadir memberikan
              pelayanan kepada masyarakat tanpa membedakan suku, agama,
              ras, maupun golongan. Sejak awal berdirinya, PMI Kabupaten
              Buleleng terus berkembang sebagai mitra pemerintah dalam
              bidang kemanusiaan, pelayanan donor darah, penanggulangan
              bencana, pelayanan ambulans, pembinaan relawan, serta
              berbagai kegiatan sosial lainnya.
            </p>

            {/* Timeline */}
            <div className="space-y-6">

              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <CalendarDays className="text-red-600" />
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    1 September 1981
                  </h3>

                  <p className="text-gray-600 mt-2 leading-7">
                    Unit Donor Darah (UDD) PMI Kabupaten Buleleng mulai
                    dibentuk sebagai langkah awal memenuhi kebutuhan darah
                    bagi rumah sakit dan fasilitas kesehatan di wilayah
                    Kabupaten Buleleng.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <HeartHandshake className="text-red-600" />
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    Perkembangan Pelayanan
                  </h3>

                  <p className="text-gray-600 mt-2 leading-7">
                    Seiring berkembangnya kebutuhan masyarakat, PMI
                    Kabupaten Buleleng memperluas pelayanan kemanusiaan,
                    meliputi donor darah, pelayanan ambulans,
                    penanggulangan bencana, pembinaan relawan,
                    Palang Merah Remaja (PMR), hingga kegiatan sosial
                    kemasyarakatan.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <Building2 className="text-red-600" />
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    Masa Bakti 2025–2030
                  </h3>

                  <p className="text-gray-600 mt-2 leading-7">
                    Memasuki kepengurusan masa bakti 2025–2030, PMI
                    Kabupaten Buleleng menempati markas baru di Jalan
                    Wijaya Kusuma, Kelurahan Banyuasri, sebagai pusat
                    pelayanan kemanusiaan yang lebih modern,
                    representatif, dan profesional.
                  </p>
                </div>
              </div>

            </div>

            {/* Penutup */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <h3 className="text-xl font-bold text-red-700">
                Komitmen PMI Kabupaten Buleleng
              </h3>

              <p className="mt-4 text-gray-700 leading-8">
                Hingga saat ini PMI Kabupaten Buleleng terus berkomitmen
                memberikan pelayanan kemanusiaan yang cepat,
                profesional, dan terpercaya dengan mengedepankan
                prinsip-prinsip dasar Gerakan Palang Merah dan Bulan
                Sabit Merah Internasional demi membantu masyarakat yang
                membutuhkan.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium"
              >
                Tutup
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}