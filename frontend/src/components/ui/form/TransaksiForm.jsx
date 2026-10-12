"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function InputTransaksiForm() {
  const router = useRouter();

  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(false);

  // STATE UNTUK POP-UP NOTIFIKASI
  const [modal, setModal] = useState({
    isOpen: false,
    isSuccess: true,
    title: "",
    message: "",
  });

  // HEADER TRANSAKSI
  const [formData, setFormData] = useState({
    unit: "PMI",
    kategori: "",
    akun: "",
    jenis: "keluar",
    sumber: "Bulan Dana",
    tanggal: new Date().toISOString().split("T")[0],
    noBukti: "",
    file: null,
  });

  // DETAIL URAIAN
  const [details, setDetails] = useState([
    {
      uraian: "",
      qty: 1,
      satuan: "org",
      harga: "",
      subtotal: 0,
    },
  ]);

  // FETCH AKUN & OTOMATISASI VALUE SELECT
  useEffect(() => {
    if (!formData.jenis) return;

    const fetchAkunDanAutoSelect = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          `http://127.0.0.1:8000/api/akun/jenis/${formData.jenis}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (data.success && data.data.length > 0) {
          setAkunList(data.data);
// Ambil kode akun pertama dari list hasil API
          const akunPertama = data.data[0].akun_kode
            ? data.data[0].akun_kode.toString().trim()
            : "";

          // Paksa form data untuk langsung memilih akun pertama ini secara otomatis
          setFormData((prev) => ({
            ...prev,
            akun: akunPertama,
          }));
        } else {
          setAkunList([]);
          setFormData((prev) => ({ ...prev, akun: "" }));
        }
      } catch (error) {
        console.error("Gagal ambil akun:", error);
        setAkunList([]);
        setFormData((prev) => ({ ...prev, akun: "" }));
      } finally {
        setLoading(false);
      }
    };

    fetchAkunDanAutoSelect();
  }, [formData.jenis]); // Berjalan otomatis setiap kali Jenis Transaksi berubah

  // HANDLE HEADER
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0] || null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // HANDLE DETAIL
  const handleDetailChange = (index, field, value) => {
    const updated = [...details];
    updated[index][field] = value;

    const qty = parseFloat(updated[index].qty) || 0;
    const harga = parseFloat(updated[index].harga) || 0;

    updated[index].subtotal = qty * harga;
    setDetails(updated);
  };

  // TAMBAH DETAIL
  const addDetail = () => {
    setDetails([
      ...details,
      {
        uraian: "",
        qty: 1,
        satuan: "org",
        harga: "",
        subtotal: 0,
      },
    ]);
  };

  // HAPUS DETAIL
  const removeDetail = (index) => {
    const updated = details.filter((_, i) => i !== index);
    setDetails(updated);
  };

  // TOTAL
  const totalNominal = details.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formPayload = new FormData();

      // HEADER
      formPayload.append("unit", formData.unit);
      formPayload.append("keterangan", formData.kategori);
      formPayload.append("tanggal", formData.tanggal);
      formPayload.append("akun_kode", formData.akun);
      formPayload.append("jenis_transaksi", formData.jenis);
      formPayload.append("sumber", formData.sumber);
      formPayload.append("jumlah", totalNominal);
      formPayload.append("no_bukti", formData.noBukti);

      // DETAIL
      details.forEach((item, index) => {
        formPayload.append(`details[${index}][uraian]`, item.uraian);
        formPayload.append(`details[${index}][qty]`, item.qty);
        formPayload.append(`details[${index}][satuan]`, item.satuan);
        formPayload.append(`details[${index}][harga]`, item.harga);
        formPayload.append(`details[${index}][subtotal]`, item.subtotal);
      });

      // FILE
      if (formData.file) {
        formPayload.append("file", formData.file);
      }

      const res = await fetch("http://127.0.0.1:8000/api/transaksi", {
        method: "POST",
        body: formPayload,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("DATA:", data);

    if (res.ok && data.success) {
  setModal({
    isOpen: true,
    isSuccess: true,
    title: "Transaksi Berhasil Disimpan",
    message:
      "Data transaksi telah berhasil disimpan dan tercatat dalam sistem.",
  });
} else {
  setModal({
    isOpen: true,
    isSuccess: false,
    title: "Proses Penyimpanan Gagal",
    message:
      data.message ||
      "Terjadi kendala saat menyimpan data transaksi. Silakan periksa kembali data yang diinput.",
  });

      }
    } catch (error) {
      console.error(error);
      setModal({
        isOpen: true,
        isSuccess: false,
        title: "Terjadi Kesalahan",
        message: "Gagal terhubung ke server. Sila periksa jaringan Anda.",
      });
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI MENUTUP POP-UP & REDIRECT JIKA SUKSES
  const handleCloseModal = () => {
    const wasSuccess = modal.isSuccess;
    setModal({ ...modal, isOpen: false });
    if (wasSuccess) {
      router.push("/transaksi");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 relative">
      {/* POP-UP NOTIFIKASI PROFESIONAL KHAS PMI */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full overflow-hidden transform transition-all duration-300">
            <div
              className={`h-1.5 w-full ${modal.isSuccess ? "bg-red-600" : "bg-rose-500"}`}
            />
            <div className="p-6 text-center">
              <div
                className={`w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full ${modal.isSuccess ? "bg-red-50 text-red-600" : "bg-rose-50 text-rose-600"}`}
              >
                {modal.isSuccess ? (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
                {modal.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium px-2 leading-relaxed">
                {modal.message}
              </p>

              <div className="mt-6">
               <button
  onClick={handleCloseModal}
  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-sm transition-all duration-200 ${
    modal.isSuccess
      ? "bg-red-600 hover:bg-red-700"
      : "bg-slate-700 hover:bg-slate-800"
  }`}
>
  {modal.isSuccess ? "Selesai" : "Tutup"}
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-5 sm:p-6 md:p-8 bg-white shadow-xl rounded-xl border border-gray-200 mt-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-red-500/90">
          INPUT TRANSAKSI KEUANGAN PMI KAB.BULELENG
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* UNIT */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Unit
            </label>
            <div className="flex gap-5">
              {["PMI", "Ambulance"].map((u) => (
                <label
                  key={u}
                  className="flex items-center gap-2 cursor-pointer"
                >
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

          {/* KATEGORI */}
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Kategori / Keterangan Transaksi
            </label>
            <input
              type="text"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              placeholder={
                formData.unit === "PMI"
                  ? "Contoh: Gaji/Honor Pegawai"
                  : "Contoh: Operasional Ambulance"
              }
              className="w-full p-3 border border-gray-400 rounded-lg text-black"
              required
            />
          </div>

          {/* JENIS & SUMBER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Jenis Transaksi
              </label>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black"
              >
                <option value="keluar">Keluar</option>
                <option value="masuk">Masuk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Sumber Dana
              </label>
              <select
                name="sumber"
                value={formData.sumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black"
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

          {/* AKUN (SUDAH DI-AUTOMATION VALUENYA) */}
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Akun
            </label>
            <select
              name="akun"
              value={formData.akun ? formData.akun.toString() : ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg text-black focus:outline-red-600"
              required
            >
              <option value="">-- Pilih Akun --</option>
              {akunList.map((akun) => {
                const kodeString = akun.akun_kode
                  ? akun.akun_kode.toString().trim()
                  : "";
                return (
                  <option key={akun.id || kodeString} value={kodeString}>
                    {kodeString} - {akun.nama}
                  </option>
                );
              })}
            </select>
          </div>

          {/* TANGGAL & BUKTI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                No Bukti
              </label>
              <input
                type="text"
                name="noBukti"
                value={formData.noBukti}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-black"
              />
            </div>
          </div>

          {/* DETAIL URAIAN */}
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-red-600 text-white px-4 py-3 font-bold">
              Detail Uraian
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3 text-sm text-black">Uraian</th>
                    <th className="border p-3 text-sm text-black">Qty</th>
                    <th className="border p-3 text-sm text-black">Satuan</th>
                    <th className="border p-3 text-sm text-black">Harga</th>
                    <th className="border p-3 text-sm text-black">Subtotal</th>
                    <th className="border p-3 text-sm text-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={item.uraian}
                          onChange={(e) =>
                            handleDetailChange(index, "uraian", e.target.value)
                          }
                          placeholder={
                            formData.unit === "PMI"
                              ? "Contoh: Kepala Markas"
                              : "Contoh: Solar Ambulance"
                          }
                          className="w-full p-2 border rounded text-black"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            handleDetailChange(index, "qty", e.target.value)
                          }
                          className="w-full p-2 border rounded text-black"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          value={item.satuan}
                          onChange={(e) =>
                            handleDetailChange(index, "satuan", e.target.value)
                          }
                          className="w-full p-2 border rounded text-black"
                          required
                        >
                          <option value="orang">Orang</option>
                          <option value="pcs">PCS</option>
                          <option value="box">Box</option>
                          <option value="kg">Kg</option>
                          <option value="liter">Liter</option>
                          <option value="unit">Unit</option>
                          <option value="Set">Set</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={item.harga}
                          onChange={(e) =>
                            handleDetailChange(index, "harga", e.target.value)
                          }
                          placeholder="0"
                          className="w-full p-2 border rounded text-black"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={`Rp ${item.subtotal.toLocaleString("id-ID")}`}
                          readOnly
                          className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeDetail(index)}
                          className="group bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 text-red-600 hover:text-white p-2.5 rounded-xl transition-all duration-200 shadow-sm"
                        >
                          <Trash2
                            size={18}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex justify-end">
              <button
                type="button"
                onClick={addDetail}
                className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-[#C91A23] border border-red-200 hover:border-[#C91A23] active:scale-[0.98] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-all duration-150"
              >
                <span className="text-sm font-semibold">+</span> Tambah Baris
                Uraian
              </button>
            </div>
          </div>

          {/* TOTAL */}
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Total Nominal
            </label>
            <input
              type="text"
              value={`Rp ${totalNominal.toLocaleString("id-ID")}`}
              readOnly
              className="w-full p-3 border border-gray-400 rounded-lg bg-gray-100 text-black font-bold"
            />
          </div>

          {/* FILE */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload File Bukti
            </label>

            <div className="relative flex flex-col items-center justify-center w-full min-h-[190px] border-2 border-dashed border-gray-300 rounded-2xl hover:border-red-500 hover:bg-gray-50 transition-all duration-300 group cursor-pointer overflow-hidden px-5">
              {formData.file ? (
                <div className="w-full p-4">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">
                          File Berhasil Diupload
                        </h3>

                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Bukti transaksi siap diupload ke sistem
                        </p>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold tracking-wide">
                        READY
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex items-center gap-4 p-4">
                      {/* PREVIEW IMAGE */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 flex-shrink-0">
                        <img
                          src={URL.createObjectURL(formData.file)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-black/5" />
                      </div>

                      {/* FILE INFO */}
                      <div className="flex-1 min-w-0">
                        {/* FILE NAME */}
                        <h4 className="text-sm font-bold text-gray-800 truncate">
                          {formData.file.name}
                        </h4>

                        {/* FILE SIZE */}
                        <p className="text-xs text-gray-400 mt-1">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        {/* FORMAT */}
                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase border border-red-100">
                            {formData.file.type.split("/")[1]}
                          </span>

                          <span className="text-[11px] text-gray-400">
                            Klik area ini untuk mengganti file
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center pointer-events-none">
                  {/* ICON UPLOAD */}
                  <svg
                    className="w-8 h-8 mb-2 text-gray-400 group-hover:text-red-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>

                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-red-600 group-hover:underline">
                      Klik untuk upload
                    </span>{" "}
                    atau drag & drop
                  </p>

                  <p className="text-[10px] text-gray-400 mt-1">
                    PNG, JPG, JPEG, atau WEBP (Maks. 10MB)
                  </p>
                </div>
              )}

              {/* INPUT FILE */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files[0],
                  })
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "Memproses..." : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
