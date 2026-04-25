"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InputTransaksiForm() {
  const router = useRouter();

  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    keterangan: "",
    akun: "",
    jenis: "keluar",
    nominal: "",
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
      formPayload.append("tanggal", formData.tanggal);
      formPayload.append("akun_kode", formData.akun);
      formPayload.append("jenis_transaksi", formData.jenis);
      formPayload.append("jumlah", formData.nominal);
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
        console.error("Detail Error:", data.errors || data);
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
          Input Transaksi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <input
  type="text"
  name="keterangan"
  value={formData.keterangan}
  onChange={handleChange}
  placeholder="Contoh: Pembayaran listrik"
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
             bg-white text-gray-900 placeholder-gray-400
             focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
  required
/>  
          </div>

          {/* Jenis Transaksi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis
            </label>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {["keluar", "masuk"].map((j) => (
                <label key={j} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="jenis"
                    value={j}
                    checked={formData.jenis === j}
                    onChange={handleChange}
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span className="capitalize text-gray-700">{j}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Akun */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Akun
            </label>
           <select
  name="akun"
  value={formData.akun}
  onChange={handleChange}
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
             bg-white text-gray-900
             focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
  required
>
              <option value="">-- Pilih Akun --</option>
              {loading ? (
                <option disabled>Loading...</option>
              ) : (
                akunList.map((akun) => (
                  <option key={akun.id} value={akun.akun_kode}>
                    {akun.akun_kode} - {akun.nama}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Nominal & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal
              </label>
              <input
  type="number"
  name="nominal"
  value={formData.nominal}
  onChange={handleChange}
  placeholder="100000"
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
             bg-white text-gray-900 placeholder-gray-400
             focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
  required
/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
  type="date"
  name="tanggal"
  value={formData.tanggal}
  onChange={handleChange}
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
             bg-white text-gray-900
             focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
  required
/>
            </div>
          </div>

          {/* Bukti */}
          <div className="p-4 sm:p-5 mt-6 border-t-4 border-red-600 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Bukti Transaksi
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              No Bukti
            </label>
          <input
  type="text"
  name="noBukti"
  value={formData.noBukti}
  onChange={handleChange}
  placeholder="Contoh: 001/INV/2025"
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
             bg-white text-gray-900 placeholder-gray-400
             focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-3"
/>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Bukti
            </label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                         file:text-sm file:font-semibold file:bg-indigo-100
                         file:text-indigo-700 hover:file:bg-indigo-200 transition"
            />
            {formData.file && (
              <p className="mt-2 text-sm text-gray-500">
                Terpilih: {formData.file.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center sm:justify-end">
            <button
              type="submit"
              className={`px-8 py-3 bg-indigo-600 text-white font-medium
                          rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition
                          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}