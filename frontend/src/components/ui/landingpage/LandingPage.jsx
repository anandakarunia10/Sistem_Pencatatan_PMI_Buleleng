import Navbar from "./Navbar";
import BerandaSection from "./BerandaSection";
import TentangSection from "./TentangSection";
import VisiMisiSection from "./VisiMisiSection";
import LayananSection from "./LayananSection";
import KontakSection from "./KontakSection";
import StrukturSection from "./StrukturSection";
import GaleriSection from "./GaleriSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    // Menggunakan bg-slate-50 (off-white) sebagai warna dasar utama agar terlihat modern & bersih
    <main className="bg-[#F8FAFC] text-gray-900 scroll-smooth">
      <Navbar />
      
      {/* 1. Beranda (Hero): Sudah gelap bawaan dari komponennya */}
      <BerandaSection />
      
      {/* 2. Tentang Kami: Putih bersih untuk fokus membaca teks */}
      <div className="bg-white">
        <TentangSection />
      </div>
      
      {/* 3. Visi Misi: Abu-abu sangat tipis untuk memisahkan section */}
      <div className="bg-[#F1F5F9]">
        <VisiMisiSection />
      </div>
      
      {/* 4. Struktur Organisasi: Kembali ke putih bersih */}
      <div className="bg-white">
        <StrukturSection />
      </div>
      
      {/* 5. Layanan: Abu-abu tipis agar card layanan lebih kontras dan pop-out */}
      <div>
        <LayananSection />
      </div>
      
      {/* 6. Galeri Kegiatan: Putih bersih */}
      <div className="bg-white">
        <GaleriSection /> 
      </div>
      
      {/* 7. Kontak: Abu-abu tipis sebagai penutup sebelum footer */}
      <div className="bg-[#F8FAFC]">
        <KontakSection /> 
      </div>
    
      <Footer />
    </main>
  );
}