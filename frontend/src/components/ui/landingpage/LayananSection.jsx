"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function LayananSection() {
 const layanan = [
  {
    title: "Unit Transfusi Darah (UTD)",
    desc: "UTD PMI Kabupaten Buleleng menyelenggarakan pelayanan darah yang aman, berkualitas, dan berkesinambungan sesuai standar nasional. Layanan ini mencakup sosialisasi donor darah sukarela, seleksi donor, pengambilan, hingga pengolahan dan penyimpanan komponen darah. Kami memastikan ketersediaan pasokan darah yang responsif demi memenuhi kebutuhan krusial seluruh fasilitas pelayanan kesehatan di wilayah Buleleng.",
    img: "/images/darah.png",
  },
  {
    title: "Pelayanan Ambulans",
    desc: "Layanan Ambulans PMI Kabupaten Buleleng beroperasi sebagai garda depan transportasi medis darurat maupun non-darurat. Didukung armada komprehensif berbekal peralatan esensial dan awak bersertifikasi, kami memberikan penanganan pra-rumah sakit yang cepat, tepat, dan aman bagi pasien kritis maupun rujukan medis dengan mengutamakan efisiensi waktu respons.",
    img: "/images/ambulance.png",
  },
  {
    title: "Penanggulangan Bencana",
    desc: "Divisi ini berfokus pada mitigasi dan respons cepat terhadap dampak bencana alam maupun sosial di masyarakat. Ruang lingkup kerjanya mencakup kesiapsiagaan pra-bencana, tanggap darurat pasca-kejadian, koordinasi evakuasi, operasi dapur umum, hingga manajemen distribusi bantuan logistik kemanusiaan yang akuntabel dan tepat sasaran.",
    img: "/images/bencana.png",
  },
  {
    title: "Pelatihan Pertolongan Pertama",
    desc: "Program ini diselenggarakan untuk membangun kapabilitas masyarakat dalam menangani kondisi darurat medis awal secara mandiri. Dipandu instruktur profesional, kurikulum pelatihan mencakup teknik Resusitasi Jantung Paru (RJP), penanganan luka, dan pembidaian bagi instansi, sektor korporasi (K3), maupun institusi pendidikan demi meminimalisasi risiko fatalitas.",
    img: "/images/p3k.png",
  },
  {
    title: "Pembinaan Relawan",
    desc: "Program berkelanjutan ini berfokus pada regenerasi dan pengembangan kompetensi sumber daya manusia melalui wadah PMR, KSR, dan TSR. Melalui pendidikan khusus mengenai prinsip kemanusiaan, manajemen posko, dan kepemimpinan, kami mencetak relawan yang berdedikasi tinggi dan siap dimobilisasi secara profesional untuk berbagai aksi sosial.",
    img: "/images/relawan.png",
  },
];

  return (
    <section
      id="layanan"
      className="relative min-h-screen py-20 px-4 md:px-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/login.jpeg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/60" />

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Layanan <span className="text-red-600">PMI</span>
          </h2>

          
        </div>

        {/* WRAPPER UTAMA */}
        <div className="relative xl:px-20">
          
          {/* TOMBOL NAVIGASI CUSTOM (Di luar card putih) */}
          <button className="custom-prev-btn absolute left-0 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-200 shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button className="custom-next-btn absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-200 shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* CARD PUTIH */}
          <div className="bg-white/95 rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-14">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              loop
              navigation={{
                nextEl: ".custom-next-btn",
                prevEl: ".custom-prev-btn",
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="pb-10"
            >
              {layanan.map((item, index) => (
                <SwiperSlide key={index}>
                  {/* 🛠️ DIUBAH KE items-start AGAR TEXT DAN GAMBAR SEJAJAR DI ATAS */}
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start min-h-[400px]">
                    
                    {/* Pembungkus gambar dibuat start align */}
                    <div className="w-full h-[280px] md:h-[380px] flex items-start justify-center">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* 🛠️ pt-0 memastikan teks berawal tepat sejajar dengan bagian atas gambar */}
                    <div className="pt-0">
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-6 text-gray-600 text-[16px] leading-8 text-justify">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* KONTROL BULLET/PAGINATION */}
          <style jsx global>{`
            .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background: #d1d5db;
              opacity: 1;
            }

            .swiper-pagination-bullet-active {
              width: 28px;
              border-radius: 9999px;
              background: #dc2626;
            }
            
            .swiper-button-next, .swiper-button-prev {
              display: none !important;
            }
          `}</style>

        </div>
      </div>
    </section>
  );
}