"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export default function ModalEditTransaksi({
  data,
  onClose,
  onRefresh,
}) {
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorModal, setErrorModal] = useState({
  show: false,
  message: "",
});
  

  // FORM DATA INITIALIZATION
  const [formData, setFormData] = useState({
    unit: "PMI",
    kategori: "", 
    akun_kode: "",
    jenis_transaksi: "keluar",
    sumber: "Bulan Dana",
    tanggal: "",
    no_bukti: "",
    details: [
      {
        id_detail: null,
        uraian: "",
        qty: 1,
        satuan: "org",
        harga: 0,
        subtotal: 0,
      },
    ],
  });

  // AUTO HIDE TOAST
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // SINKRONISASI UTAMA & FETCH LIST AKUN (DIJADIKAN SATU BIAR AMAN)
  useEffect(() => {
    const inisialisasiDanFetch = async () => {
      if (!data) return;

      // 1. Tentukan jenis transaksi terlebih dahulu
      const jenisTx = data.jenis_transaksi || "keluar";

      try {
        const token = localStorage.getItem("adminToken");
        // 2. Ambil list akun dari API terlebih dahulu (AWAIT) sebelum memasukkan data edit
        const res = await fetch(
          `http://127.0.0.1:8000/api/akun/jenis/${jenisTx}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const result = await res.json();
        if (result.success) {
          setAkunList(result.data);
        }

        // 3. SETELAH list akun masuk ke state, baru kita suntikkan data editnya secara utuh
        setFormData({
          unit: data.unit || "PMI",
          kategori: data.keterangan || "", 
          // Pastikan dicasting ke string dan dibersihkan dari spasi agar pas dengan value option
          akun_kode: data.akun_kode ? data.akun_kode.toString().trim() : "",
          jenis_transaksi: jenisTx,
          sumber: data.sumber || "Bulan Dana",
          tanggal: data.tanggal ? new Date(data.tanggal).toISOString().split("T")[0] : "",
          no_bukti: data.no_bukti || "",
          details: data.details && data.details.length > 0
            ? data.details.map((d) => ({
                id_detail: d.id_detail || d.id || null,
                uraian: d.uraian || "",
                qty: parseInt(d.qty) || 1,
                satuan: d.satuan || "org",
                harga: parseFloat(d.harga) || 0,
                subtotal: parseFloat(d.subtotal) || parseFloat(d.qty || 0) * parseFloat(d.harga || 0),
              }))
            : [
                {
                  id_detail: null,
                  uraian: "",
                  qty: 1,
                  satuan: "org",
                  harga: 0,
                  subtotal: 0,
                },
              ],
        });

      } catch (err) {
        console.error("Gagal sinkronisasi data edit:", err);
      }
    };

    inisialisasiDanFetch();
  }, [data]);

  // HANDLE DETAIL TABLE INPUT CHANGE
  const handleDetailChange = (index, field, value) => {
    const updated = [...formData.details];
    updated[index][field] = value;

    const qty = parseFloat(updated[index].qty) || 0;
    const harga = parseFloat(updated[index].harga) || 0;
    updated[index].subtotal = qty * harga;

    setFormData({
      ...formData,
      details: updated,
    });
  };

  // ADD NEW ITEM TO DETAIL TABLE
  const addDetail = () => {
    setFormData({
      ...formData,
      details: [
        ...formData.details,
        {
          id_detail: null,
          uraian: "",
          qty: 1,
          satuan: "org",
          harga: 0,
          subtotal: 0,
        },
      ],
    });
  };

  // REMOVE ITEM FROM DETAIL TABLE
  const removeDetail = (index) => {
    const updated = formData.details.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      details: updated,
    });
  };

  // HANDLE FILE SELECTION
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // CALCULATE TOTAL NOMINAL
  const totalNominal = formData.details.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  );

  // SUBMIT DATA (METHOD SPOOFING PUT VIA POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const transaksiId = data?.id_transaksi || data?.id || data?.transaksi_id;

      const form = new FormData();
      form.append("unit", formData.unit);
      form.append("keterangan", formData.kategori); 
      form.append("akun_kode", formData.akun_kode);
      form.append("jenis_transaksi", formData.jenis_transaksi);
      form.append("sumber", formData.sumber);
      form.append("tanggal", formData.tanggal);
      form.append("no_bukti", formData.no_bukti);
      form.append("jumlah", totalNominal);

      if (selectedFile) {
        form.append("file", selectedFile);
      }

      // Append data rincian array
      formData.details.forEach((item, index) => {
        form.append(`details[${index}][uraian]`, item.uraian);
        form.append(`details[${index}][qty]`, Number(item.qty));
        form.append(`details[${index}][satuan]`, item.satuan);
        form.append(`details[${index}][harga]`, Number(item.harga));
        form.append(`details[${index}][subtotal]`, Number(item.subtotal));
      });

      form.append("_method", "PUT");

      const res = await fetch(
        `http://127.0.0.1:8000/api/transaksi/${transaksiId}`,
        {
          method: "POST", 
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: form,
        }
      );

      const result = await res.json();

if (res.ok && result.success) {
  setShowToast(true);

  onRefresh();

  setTimeout(() => {
    onClose();
  }, 2000);
} else {
  setErrorModal({
    show: true,
    message:
      result.message || "Data gagal diupdate",
  });
}
} catch (err) {
  console.error("ERROR EDIT:", err);

  setErrorModal({
    show: true,
    message: "Terjadi kesalahan server.",
  });

} finally {
  setLoading(false);
}
};

  return (
    <>
     
      {/* FIXED CONTAINER MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden border border-red-100">

          {/* HEADER SECTION */}
          <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 relative">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <Image
                  src="/images/pmilogo.png"
                  alt="PMI Logo"
                  width={55}
                  height={55}
                  style={{ width: "55px", height: "auto" }}
                  priority
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
                  Edit Transaksi & Rincian
                </h3>
                <p className="text-red-100 text-sm mt-1 font-medium">
                  ID Transaksi #{data?.id_transaksi || data?.id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-5 text-white text-3xl hover:text-gray-200"
            >
              &times;
            </button>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            
            {/* UNIT RADIO SELECTOR */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">Unit</label>
              <div className="flex gap-5">
                {["PMI", "Ambulance"].map((u) => (
                  <label key={u} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={u}
                      checked={formData.unit === u}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="accent-red-700"
                    />
                    <span className="text-black font-medium">{u}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* KATEGORI / KETERANGAN INPUT TEXT */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Kategori / Keterangan</label>
              <input
                type="text"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full p-3 border border-gray-400 rounded-lg text-black focus:outline-red-600"
                required
              />
            </div>

            {/* JENIS TRANSAKSI & SUMBER DATA SELECTOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Jenis Transaksi</label>
                <input
                  disabled
                  value={formData.jenis_transaksi}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500 capitalize font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Sumber Dana</label>
                <select
  value={formData.sumber}
  onChange={(e) =>
    setFormData({ ...formData, sumber: e.target.value })
  }
  className="w-full p-3 border border-gray-400 rounded-lg text-black focus:outline-red-600"
>
  <option value="Hibah">Hibah</option>
  <option value="Bulan Dana">Bulan Dana</option>
  <option value="Pihak Lain">Pihak Lain</option>
  <option value="BPPD">BPPD (Unit Donor Darah)</option>
  <option value="Hasil Layanan">
    Hasil Layanan (Pelatihan/Jasa)
  </option>
  <option value="Iuran Anggota">Iuran Anggota</option>
  <option value="Lainnya">Lainnya</option>
</select>
              </div>
            </div>

            {/* KODE AKUN SELECTOR (SUDAH DI-CASTING STRING AMAN) */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Akun</label>
              <select
                value={formData.akun_kode ? formData.akun_kode.toString() : ""}
                onChange={(e) => setFormData({ ...formData, akun_kode: e.target.value })}
                className="w-full p-3 border border-gray-400 rounded-lg text-black focus:outline-red-600"
                required
              >
                <option value="">-- Pilih Akun Kode --</option>
                {akunList.map((akun) => {
                  const kodeString = akun.akun_kode ? akun.akun_kode.toString().trim() : "";
                  return (
                    <option key={akun.id_akun || kodeString} value={kodeString}>
                      {kodeString} - {akun.nama || akun.nama_akun}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* DATE & PROOF NUMBER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full p-3 border border-gray-400 rounded-lg text-black focus:outline-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">No Bukti</label>
                <input
                  type="text"
                  value={formData.no_bukti}
                  onChange={(e) => setFormData({ ...formData, no_bukti: e.target.value })}
                  className="w-full p-3 border border-gray-400 rounded-lg text-black focus:outline-red-600"
                />
              </div>
            </div>

            {/* BUKTI FILE UPLOAD */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Ganti Nota / Bukti File Fisik (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>

            {/* INTERACTIVE TABLE DETAILS */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-red-600 text-white px-4 py-3 font-bold tracking-wide">
                Rincian Nota (Tabel Detail)
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-3 text-black text-left">Uraian Detail</th>
                      <th className="border p-3 text-black w-24 text-center">Qty</th>
                      <th className="border p-3 text-black w-32">Satuan</th>
                      <th className="border p-3 text-black text-left">Harga</th>
                      <th className="border p-3 text-black text-left">Subtotal</th>
                      <th className="border p-3 text-black w-24 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {formData.details.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="border p-2">
                          <input
                            type="text"
                            value={item.uraian}
                            onChange={(e) => handleDetailChange(index, "uraian", e.target.value)}
                            className="w-full p-2 border rounded text-black"
                            required
                          />
                        </td>

                        <td className="border p-2">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleDetailChange(index, "qty", e.target.value)}
                            className="w-full p-2 border rounded text-black text-center"
                            required
                          />
                        </td>

                        <td className="border p-2">
                          <select
                            value={item.satuan}
                            onChange={(e) => handleDetailChange(index, "satuan", e.target.value)}
                            className="w-full p-2 border rounded text-black"
                          >
                            <option value="org">Org</option>
                            <option value="pcs">PCS</option>
                            <option value="box">Box</option>
                            <option value="kg">Kg</option>
                            <option value="liter">Liter</option>
                            <option value="unit">Unit</option>
                          </select>
                        </td>

                        <td className="border p-2">
                          <input
                            type="number"
                            value={item.harga}
                            onChange={(e) => handleDetailChange(index, "harga", e.target.value)}
                            className="w-full p-2 border rounded text-black"
                            required
                          />
                        </td>

                        <td className="border p-2">
                          <input
                            readOnly
                            value={`Rp ${Number(item.subtotal).toLocaleString("id-ID")}`}
                            className="w-full p-2 border rounded bg-gray-100 text-black font-bold"
                          />
                        </td>

                        <td className="border p-2 text-center">
                        <button
  type="button"
  disabled={formData.details.length === 1}
  onClick={() => removeDetail(index)}
  className="bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-600 disabled:text-gray-400 border border-red-200 disabled:border-gray-200 p-2 rounded-lg transition flex items-center justify-center"
>
  <Trash2 size={16} />
</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 flex justify-end bg-gray-50 border-t">
                 <button
  type="button"
  onClick={addDetail}
  className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-[#C91A23] border border-red-200 hover:border-[#C91A23] active:scale-[0.98] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-all duration-150"
>
  <span className="text-sm font-semibold">+</span > Tambah Baris Uraian
</button>
              </div>
            </div>

            {/* TOTAL NOMINAL */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Total Nominal Transaksi</label>
              <input
                type="text"
                readOnly
                value={`Rp ${totalNominal.toLocaleString("id-ID")}`}
                className="w-full p-4 border border-transparent rounded-2xl bg-red-50 text-red-800 font-black text-xl shadow-inner"
              />
            </div>

            {/* CONTROL BUTTONS */}
            <div className="flex gap-3 justify-end pt-5 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-lg disabled:from-red-400 disabled:to-red-400"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm tracking-wide uppercase rounded-xl"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
      {errorModal.show && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-red-100">

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-2xl font-bold">!</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-red-700">
            Transaksi Terkunci
          </h3>

          <p className="text-sm text-gray-500">
            Tidak dapat mengubah transaksi
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        {errorModal.message}
      </p>

      <div className="flex justify-end mt-6">
        <button
          onClick={() =>
            setErrorModal({
              show: false,
              message: "",
            })
          }
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
        >
          Mengerti
        </button>
      </div>

    </div>
  </div>
)}
    </>
  );
}