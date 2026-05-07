"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InputTransaksiForm() {
  const router = useRouter();

  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    unit: "PMI",
    keterangan: "",
    akun: "",
    jenis: "keluar",
    sumber: "Bulan Dana",
    nominal: "",
    qty: 1,
    satuan: "",
    tanggal: new Date().toISOString().split("T")[0],
    noBukti: "",
    file: null,
  });

  useEffect(() => {
    if (!formData.jenis) return;

    const fetchAkun = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          `http://localhost:8000/api/akun/jenis/${formData.jenis}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setAkunList(data.success ? data.data : []);
      } catch (error) {
        console.error("Gagal ambil data akun:", error);
        setAkunList([]);
      }
      setLoading(false);
    };

    fetchAkun();
  }, [formData.jenis]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") setFormData({ ...formData, [name]: files[0] || null });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formPayload = new FormData();
      
      formPayload.append("unit", formData.unit);
      formPayload.append("tanggal", formData.tanggal);
      formPayload.append("akun_kode", formData.akun);
      formPayload.append("jenis_transaksi", formData.jenis);
      formPayload.append("sumber", formData.sumber);
      formPayload.append("jumlah", formData.nominal);
      formPayload.append("qty", formData.qty);
      formPayload.append("satuan", formData.satuan);
      formPayload.append("keterangan", formData.keterangan);
      formPayload.append("no_bukti", formData.noBukti);
      if (formData.file) formPayload.append("file", formData.file);

      const res = await fetch("http://localhost:8000/api/transaksi", {
        method: "POST",
        body: formPayload,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Transaksi berhasil disimpan!");
        router.push("/transaksi");
      } else {
        alert("Gagal: " + (data.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Koneksi ke server terputus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl
                      mx-auto p-5 sm:p-6 md:p-8
                      bg-white shadow-xl rounded-xl border border-gray-200 mt-6">

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8
                       text-center text-red-600 border-b pb-3">
          Input Transaksi PMI Buleleng
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* Unit */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Unit</label>
            <div className="flex gap-4">
              {["PMI", "Ambulance"].map((u) => (
                <label key={u} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    value={u}
                    checked={formData.unit === u}
                    onChange={handleChange}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span className="text-black font-medium">{u}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-bold text-black mb-1">Keterangan (Uraian)</label>
            <input
              type="text"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder="Isi..."
              className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-red-400 outline-none text-black font-medium placeholder-gray-500"
              required
            />  
          </div>

          {/* Grid: Jenis & Sumber */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Jenis Transaksi</label>
              <select 
                name="jenis" 
                value={formData.jenis} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black font-medium"
              >
                <option value="keluar">Keluar</option>
                <option value="masuk">Masuk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Sumber Dana</label>
              <select 
                name="sumber" 
                value={formData.sumber} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black font-medium"
              >
                <option value="Hibah">Hibah</option>
                <option value="Bulan Dana">Bulan Dana</option>
                <option value="Pihak Lain">Pihak Lain</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Akun */}
          <div>
            <label className="block text-sm font-bold text-black mb-1">Akun</label>
            <select
              name="akun"
              value={formData.akun}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg text-black font-medium"
              required
            >
              <option value="">-- Pilih Akun --</option>
              {akunList.map((akun) => (
                <option key={akun.id} value={akun.akun_kode} className="text-black">
                  {akun.akun_kode} - {akun.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Qty & Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Qty</label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Satuan</label>
              <input
                type="text"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                placeholder="Liter, Box, Pcs"
                className="w-full p-3 border border-gray-400 rounded-lg text-black font-medium placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Nominal & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Total Nominal</label>
              <input
                type="number"
                name="nominal"
                value={formData.nominal}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black font-medium"
                required
              />
            </div>
          </div>

          {/* Bukti File */}
          <div className="p-4 bg-gray-100 border-t-4 border-red-600 rounded-lg">
            <label className="block text-sm font-bold text-black mb-1">No Bukti</label>
            <input
              type="text"
              name="noBukti"
              value={formData.noBukti}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg mb-3 text-black font-medium"
            />
            <label className="block text-sm font-bold text-black mb-1">Upload File Bukti</label>
            <input type="file" name="file" onChange={handleChange} className="w-full text-black font-medium" />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-10 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition ${loading ? "opacity-50" : ""}`}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}