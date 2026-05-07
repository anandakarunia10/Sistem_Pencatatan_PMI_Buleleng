// src/app/(dashboard)/transaksitable/components/ModalEditTransaksi.jsx
"use client";

import { useState, useEffect } from "react";

export default function ModalEditTransaksi({ data, onClose, onRefresh }) {
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...data });

  // Ambil list akun berdasarkan jenis transaksi saat modal terbuka
  useEffect(() => {
    const fetchAkun = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`http://localhost:8000/api/akun/jenis/${formData.jenis_transaksi}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const result = await res.json();
        if (result.success) setAkunList(result.data);
      } catch (err) { console.error("Gagal load akun", err); }
    };
    fetchAkun();
  }, [formData.jenis_transaksi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formPayload = new FormData();
      formPayload.append("_method", "POST"); // Karena di api.php kita pakai Route::post

      // Append semua field sesuai kebutuhan EditTransaksiController
      formPayload.append("unit", formData.unit);
      formPayload.append("akun_kode", formData.akun_kode);
      formPayload.append("jenis_transaksi", formData.jenis_transaksi);
      formPayload.append("sumber", formData.sumber);
      formPayload.append("jumlah", formData.jumlah.toString().replace(/[^0-9]/g, ''));
      formPayload.append("qty", formData.qty);
      formPayload.append("satuan", formData.satuan);
      formPayload.append("tanggal", formData.tanggal);
      formPayload.append("keterangan", formData.keterangan || "");
      formPayload.append("no_bukti", formData.no_bukti || "");

      const res = await fetch(`http://localhost:8000/api/transaksi/${data.id_transaksi}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: formPayload,
      });

      const result = await res.json();
      if (result.success) {
        alert("Data PMI Berhasil Diperbarui!");
        onRefresh(); // Refresh tabel di background
        onClose();   // Tutup modal
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-t-8 border-red-600 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">✏️ Edit Transaksi #{data.id_transaksi}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition text-3xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="col-span-1">
            <label className="text-xs font-black text-gray-500 uppercase">Unit</label>
            <select className="w-full p-2 border rounded-lg text-black font-semibold" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
              <option value="PMI">PMI (Markas)</option>
              <option value="Ambulance">Ambulance</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="text-xs font-black text-gray-500 uppercase">Jenis</label>
            <input className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 font-semibold" value={formData.jenis_transaksi} disabled />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase">Pilih Akun</label>
            <select className="w-full p-2 border rounded-lg text-black font-semibold" value={formData.akun_kode} onChange={(e) => setFormData({...formData, akun_kode: e.target.value})}>
              {akunList.map(a => <option key={a.akun_kode} value={a.akun_kode}>{a.akun_kode} - {a.nama}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase">Sumber Dana</label>
            <select className="w-full p-2 border rounded-lg text-black font-semibold" value={formData.sumber} onChange={(e) => setFormData({...formData, sumber: e.target.value})}>
              <option value="Hibah">Hibah</option>
              <option value="Bulan Dana">Bulan Dana</option>
              <option value="Pihak Lain">Pihak Lain</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase">Uraian / Keterangan</label>
            <textarea className="w-full p-2 border rounded-lg text-black font-medium" rows="2" value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">Qty</label>
            <input type="number" className="w-full p-2 border rounded-lg text-black" value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">Satuan</label>
            <input type="text" className="w-full p-2 border rounded-lg text-black" value={formData.satuan} onChange={(e) => setFormData({...formData, satuan: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase">Nominal Total (Rp)</label>
            <input type="text" className="w-full p-2 border rounded-lg text-black font-bold text-lg bg-yellow-50" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">Tanggal</label>
            <input type="date" className="w-full p-2 border rounded-lg text-black" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-black text-gray-500 uppercase">No Bukti</label>
            <input type="text" className="w-full p-2 border rounded-lg text-black" value={formData.no_bukti} onChange={(e) => setFormData({...formData, no_bukti: e.target.value})} />
          </div>

          <div className="col-span-2 flex gap-3 mt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg transition active:scale-95 disabled:bg-gray-400">
              {loading ? "Menyimpan..." : "SIMPAN PERUBAHAN"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">BATAL</button>
          </div>
        </form>
      </div>
    </div>
  );
}