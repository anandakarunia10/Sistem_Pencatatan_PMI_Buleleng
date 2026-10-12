"use client";

import { useState } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function KontakSection() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Pesan dari ${nama}`);
    const body = encodeURIComponent(
      `Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=buleleng@pmibali.or.id&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");
  };

  return (
   <section id="kontak" className="min-h-screen bg-gray-50 px-6 py-16 flex flex-col items-center justify-center font-poppins">
      <div className="max-w-7xl w-full flex flex-col gap-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
     <h1 className="text-4xl md:text-5xl font-bold tracking-normal text-gray-900">
  Kontak <span className="text-red-600">Kami</span>
</h1>
          <p className="text-gray-600 max-w-xl text-base md:text-right">
  Silakan hubungi kami untuk layanan PMI Kabupaten Buleleng melalui telepon, email, form, atau media sosial.
</p>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
        {/* FORM */}
<div className="bg-white p-8 rounded-2xl shadow-sm border">
  <h2 className="text-lg font-normal text-gray-900 mb-6 uppercase tracking-wide">
    Kirim Pesan
  </h2>

  <form onSubmit={handleSend} className="space-y-5">
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-gray-600 mb-2">Nama</label>
        <input
          type="text"
          placeholder="Masukkan nama lengkap Anda"
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-2">Email</label>
        <input
          type="email"
          placeholder="contoh: nama@email.com"
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-xs text-gray-600 mb-2">Pesan</label>
      <textarea
        placeholder="Tuliskan pertanyaan, kritik, saran, atau pesan Anda di sini..."
        className="w-full p-3 border rounded-xl h-40 bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none resize-none"
        value={pesan}
        onChange={(e) => setPesan(e.target.value)}
        required
      />
    </div>

    <button
      type="submit"
      className="font-medium bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition text-sm tracking-wide"
    >
      Kirim Pesan
    </button>
  </form>
</div>
        {/* INFO */}
<div className="flex flex-col gap-9">

  {/* KONTAK */}
  <div>
    <h2 className="text-xl font-medium text-gray-700 mb-7">
      Informasi Kontak
    </h2>

    <div className="flex flex-col gap-7 text-gray-600">

      <div className="flex items-start gap-6">
        <FaPhoneAlt className="text-red-500 text-4xl mt-1" />
        <div>
          <p className="text-xs">Telepon</p>
          <p className="text-gray-800 text-xl">(0362) 22348</p>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <FaEnvelope className="text-red-500 text-4xl mt-1" />
        <div>
          <p className="text-xs">Email</p>
          <p className="text-gray-800 text-xl">buleleng@pmibali.or.id</p>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <FaMapMarkerAlt className="text-red-500 text-4xl mt-1" />
        <div>
          <p className="text-xs">Alamat</p>
          <p className="text-gray-800 text-xl">
            Markas PMI Kabupaten Buleleng, Jalan Wijaya Kusuma No. 3A, Singaraja - Bali
          </p>
        </div>
      </div>

    </div>
  </div>

  {/* SOSMED */}
  <div>
    <h2 className="text-xl font-medium text-gray-700 mb-7">
      Ikuti Kami
    </h2>

    <div className="flex gap-12">

      <a
        href="https://www.instagram.com/pmi.buleleng?igsh=MXQ2ZHJpazR3Ymc5cA=="
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram className="text-6xl text-pink-500 hover:scale-110 transition" />
      </a>

      <a
        href="https://www.tiktok.com/@pmi.buleleng?_r=1&_t=ZS-97krtlcHeLY"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTiktok className="text-6xl text-gray-800 hover:scale-110 transition" />
      </a>

      <a
        href="https://www.facebook.com/share/1BejtA1B79/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook className="text-6xl text-blue-600 hover:scale-110 transition" />
      </a>

    </div>
  </div>




</div>
        </div>

        {/* MAP */}
        <div className="bg-white rounded-2xl shadow-sm border p-2">
          <div className="h-[400px] rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Markas%20PMI%20Kabupaten%20Buleleng&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </section>
  );
}