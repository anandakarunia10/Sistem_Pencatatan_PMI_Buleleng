"use client";

export default function Footer() {
  return (
    <footer className="bg-red-700 text-white mt-10">
      <div className="ml-0 md:ml-[220px] px-6 py-10 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* PROFIL */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              Palang Merah Indonesia
            </h3>
            <p className="text-sm leading-relaxed">
              PMI Kabupaten Buleleng merupakan organisasi kemanusiaan
              yang bergerak di bidang pelayanan sosial, kesehatan,
              dan kebencanaan untuk masyarakat.
            </p>
          </div>

          {/* LAYANAN */}
          <div>
            <h3 className="text-lg font-bold mb-3">Layanan PMI</h3>
            <ul className="space-y-2 text-sm">
              <li>• Donor Darah</li>
              <li>• Unit Transfusi Darah (UTD)</li>
              <li>• Pelayanan Ambulans</li>
              <li>• Penanggulangan Bencana</li>
              <li>• Pertolongan Pertama</li>
              <li>• Pembinaan Relawan</li>
            </ul>
          </div>

          {/* KONTAK */}
          <div>
            <h3 className="text-lg font-bold mb-3">Kontak Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>
                📍 Jl. Yudistira No. 3, Kelurahan Banjar Tegal, Kecamatan Buleleng, Kabupaten Buleleng, Bali 81112.
              </li>
              <li>📞 Telp: (0362) 23175</li>
              <li>📧 Email: udd.buleleng@gmail.com</li>
            <li>
  🌐 Website:{" "}
  <a
    href="https://pmibuleleng.or.id"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    https://pmibuleleng.or.id
  </a>
</li>


            </ul>
          </div>

        </div>

        {/* GARIS */}
       {/* COPYRIGHT */}
<div className="mt-8">
  <div className="bg-red-800 text-center py-4 text-sm">
    © {new Date().getFullYear()}
    <span className="font-semibold"> PMI Kabupaten Buleleng</span>. 
    Seluruh hak cipta dilindungi.
  </div>
</div>

      </div>
    </footer>
  );
}
