"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import {
  Edit3,
  Trash2,
  Search,
  Eye,
  Filter,
  MoreVertical,
  Send,
  X,
  ListCollapse,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  Download,
} from "lucide-react";
import ModalEditTransaksi from "@/components/ui/form/ModalEditTransaksi";
import { exportDetailPDF } from "@/components/laporan/exportDetailPDF";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = API_URL.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${BASE_URL}/storage/${path}`;
};

export default function TransaksiTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [popup, setPopup] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  // ================= CHECKBOX PILIH TRANSAKSI JURNAL =================
  const [selectedPosting, setSelectedPosting] = useState([]);

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    unit: "",
  });

  // ================= STATE CUSTOM ALERTS (PROFESIONAL) =================
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "confirm", // 'confirm' | 'success' | 'loading'
    title: "",
    message: "",
    onConfirm: null,
  });

  // Fungsi helper untuk memicu alert sukses cepat
  const showSuccessAlert = (title, message) => {
    setAlertConfig({
      isOpen: true,
      type: "success",
      title,
      message,
      onConfirm: null,
    });
  };

  // ================= FETCH =================
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();

      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.unit) params.append("unit", filters.unit);

      const res = await fetch(
        `http://127.0.0.1:8000/api/transaksi?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE PROCESS =================
  const handleDeleteClick = (id) => {
    setPopup(null); 
    setAlertConfig({
      isOpen: true,
      type: "confirm",
      title: "Hapus Transaksi Permanen?",
      message:
        "Tindakan ini tidak dapat dibatalkan. Berkas lampiran terkait juga akan terhapus secara permanen dari sistem.",
      onConfirm: () => executeDelete(id),
    });
  };

 const executeDelete = async (id) => {
  setAlertConfig({
    isOpen: true,
    type: "loading",
    title: "Menghapus Data...",
    message: "Sedang memverifikasi transaksi.",
  });

  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      `http://127.0.0.1:8000/api/transaksi/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    // JIKA GAGAL
    if (!res.ok || result.success === false) {
      setAlertConfig({
        isOpen: true,
        type: "confirm",
        title: "Transaksi Tidak Dapat Dihapus",
        message:
          result.message ||
          "Transaksi sudah diposting ke jurnal dan tidak dapat dihapus.",
        onConfirm: () =>
          setAlertConfig((prev) => ({
            ...prev,
            isOpen: false,
          })),
      });

      return;
    }

    // JIKA BERHASIL
    await fetchTransactions();

    setAlertConfig({
      isOpen: true,
      type: "success",
      title: "Berhasil Dihapus",
      message: result.message,
    });

  } catch (err) {
    console.error(err);

    setAlertConfig({
      isOpen: true,
      type: "confirm",
      title: "Gagal Menghapus",
      message: "Terjadi kesalahan server.",
      onConfirm: () =>
        setAlertConfig((prev) => ({
          ...prev,
          isOpen: false,
        })),
    });
  }
};

  // ================= BULK POSTING =================
  const handleBulkPosting = () => {
    setAlertConfig({
      isOpen: true,
      type: "confirm",
      title: "Posting Jurnal Massal?",
      message: `${selectedPosting.length} transaksi akan dikirim ke jurnal umum.`,
      onConfirm: executeBulkPosting,
    });
  };

  const executeBulkPosting = async () => {
    setAlertConfig({
      isOpen: true,
      type: "loading",
      title: "Memproses Posting...",
      message: "Sedang mengirim transaksi ke jurnal...",
    });

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        "http://127.0.0.1:8000/api/transaksi/posting-massal",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ids: selectedPosting,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal posting massal");
      }

      await fetchTransactions();

      setSelectedPosting([]);

      setAlertConfig({
        isOpen: true,
        type: "success",
        title: "Posting Berhasil",
        message: "Seluruh transaksi berhasil diposting ke jurnal.",
      });
    } catch (err) {
      console.error(err);

      setAlertConfig({
        isOpen: true,
        type: "confirm",
        title: "Posting Gagal",
        message: err.message,
      });
    }
  };
  const handlePostingClick = (id) => {
    setPopup(null);
    setAlertConfig({
      isOpen: true,
      type: "confirm",
      title: "Posting Transaksi ke Jurnal?",
      message:
        "Data transaksi akan dikunci dan segera diintegrasikan ke dalam pembukuan jurnal umum.",
      onConfirm: () => executePosting(id),
    });
  };

  const executePosting = async (id) => {
    // 1. Ubah tampilan menjadi loading premium PMI
    setAlertConfig((prev) => ({
      ...prev,
      type: "loading",
      title: "Memproses Posting...",
      message:
        "Sedang menerbitkan jurnal double-entry dan mengunci transaksi...",
    }));

    try {
      const token = localStorage.getItem("adminToken");

      // 🔥 FIX: Pastikan URL di bawah ini bersih, hanya menggunakan satu kata 'transaksi'
      const res = await fetch(
        `http://127.0.0.1:8000/api/transaksi/${id}/posting`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Jika server mengembalikan status error (seperti 404 atau 500)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memproses ke server.");
      }

      // 2. Refresh data dari database agar status 'belum' berubah menjadi 'posted'
      await fetchTransactions();

      // 3. Tampilkan pesan sukses mewah PMI
      setAlertConfig({
        isOpen: true,
        type: "success",
        title: "Jurnal Berhasil Diposting",
        message:
          "Transaksi berhasil divalidasi dan telah masuk ke buku jurnal utama PMI.",
      });
    } catch (err) {
      console.error("Detail Error Posting:", err);

      // Tampilkan alert error secara elegan jika terjadi kendala
      setAlertConfig({
        isOpen: true,
        type: "confirm",
        title: "Gagal Posting Jurnal",
        message:
          err.message ||
          "Terjadi kesalahan sistem internal saat memproses data.",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const unitColor = (unit) => {
    if (unit === "PMI") return "bg-red-100 text-red-700";
    return "bg-gray-200 text-gray-700";
  };
  // ================= FETCH DETAIL TRANSAKSI =================
  const fetchDetailTransaksi = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://127.0.0.1:8000/api/transaksi/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setDetailData(data.data);
        setShowDetailModal(true);
      } else {
        console.error("Detail transaksi gagal diambil");
      }
    } catch (err) {
      console.error("Gagal fetch detail transaksi:", err);
    }
  };

  // ================= HANDLE CHECKBOX =================
  const handleCheckboxChange = (id) => {
    setSelectedPosting((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // CHECK ALL
  const handleCheckAll = () => {
    if (selectedPosting.length === transactions.length) {
      setSelectedPosting([]);
    } else {
      setSelectedPosting(transactions.map((t) => t.id_transaksi));
    }
  };

  // LANGSUNG VARIABEL TOTAL (Karena fetchTransactions yang duplikat di sini sudah dihapus)
  const total = transactions.reduce((a, b) => a + Number(b.jumlah || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      {/* ================= FILTER (NEW UI STYLE JURNAL) ================= */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          {/* UNIT */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold tracking-wide text-slate-500">
              Filter Unit
            </label>

            <select
              className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:bg-white focus:border-red-400 outline-none transition"
              value={filters.unit}
              onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
            >
              <option value="">Semua Unit</option>
              <option value="PMI">PMI</option>
              <option value="Ambulance">Ambulance</option>
            </select>
          </div>

          {/* START DATE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold tracking-wide text-slate-500">
              Filter Tanggal
            </label>

            <input
              type="date"
              className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:bg-white focus:border-red-400 outline-none transition"
              value={filters.start_date}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
            />
          </div>

          {/* END DATE */}
          <div className="flex flex-col gap-1">
            <input
              type="date"
              className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:bg-white focus:border-red-400 outline-none transition"
              value={filters.end_date}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
            />
          </div>

         {/* TOMBOL AKSI */}
<div className="flex gap-2">
  {/* Tombol Tambah Transaksi */}
  <Link
    href="/transaksi" // SESUAIKAN dengan path folder page.jsx Anda
    className="h-9 px-4 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center justify-center hover:bg-red-900 transition"
  >
    <Plus size={15} className="mr-2" />
    Transaksi
  </Link>

  {/* Tombol Tampilkan */}
  <button
    onClick={fetchTransactions}
    className="h-9 w-full bg-black text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-black transition"
  >
    <Search size={15} />
    Tampilkan
  </button>
</div>
        </div>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500 font-medium">
          {selectedPosting.length > 0 ? (
            <span>{selectedPosting.length} transaksi dipilih</span>
          ) : (
            <span>Pilih transaksi untuk diposting ke jurnal</span>
          )}
        </div>
        <button
          disabled={selectedPosting.length === 0}
          onClick={() => handleBulkPosting()}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all
    ${
      selectedPosting.length === 0
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
    }`}
        >
          <Send size={16} />
          Posting Jurnal
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th className="p-3 text-center w-12">
                <input
                  type="checkbox"
                  checked={
                    transactions.length > 0 &&
                    selectedPosting.length === transactions.length
                  }
                  onChange={handleCheckAll}
                  className="w-4 h-4 accent-slate-600 cursor-pointer"
                />
              </th>

              <th className="p-3">No</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Kategori / Keterangan</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">Akun</th>
              <th className="p-3">Nominal Total</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center p-10 text-gray-500 font-medium"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-red-600" size={20} />{" "}
                    Loading data transaksi...
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center p-10 text-gray-400 font-medium"
                >
                  Tidak ditemukan data transaksi.
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={t.id_transaksi} className="border-b hover:bg-gray-50">
                  <td className="text-center p-3">
                    <input
                      type="checkbox"
                      checked={selectedPosting.includes(t.id_transaksi)}
                      onChange={() => handleCheckboxChange(t.id_transaksi)}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="text-center p-3">{i + 1}</td>
                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${unitColor(t.unit)}`}
                    >
                      {t.unit}
                    </span>
                  </td>
                  <td className="p-3">{t.kategori || t.keterangan}</td>
                  <td className="text-center capitalize">
                    {t.jenis_transaksi}
                  </td>
                  <td className="text-center">
                    {t.akun?.akun_kode} - {t.akun?.nama}
                  </td>
                  <td className="text-right font-bold p-3">
                    Rp {Number(t.jumlah).toLocaleString("id-ID")}
                  </td>
                <td className="text-center">
  {new Date(t.tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
</td>
                  <td className="text-center">
                    {t.status_jurnal === "sudah" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                        Sudah
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => setPopup(t)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={6} className="text-right p-3">
                TOTAL keseluruhan
              </td>
              <td className="text-right p-3 text-red-600">
                Rp {total.toLocaleString("id-ID")}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ================= CENTER POPUP ACTION ================= */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPopup(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`p-5 border-b flex flex-col items-center justify-center text-center transition-colors duration-200 relative ${
                  popup.unit === "PMI"
                    ? "bg-red-600 text-white border-red-700"
                    : "bg-slate-50 text-slate-800 border-slate-100"
                }`}
              >
                <span
                  className={`absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shadow-sm ${
                    popup.unit === "PMI"
                      ? "bg-white text-red-600"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {popup.unit}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    popup.unit === "PMI" ? "text-red-100" : "text-slate-400"
                  }`}
                >
                  Manajemen Transaksi
                </span>
                <h3
                  className={`font-extrabold text-base mt-1 max-w-[280px] leading-tight ${
                    popup.unit === "PMI" ? "text-white" : "text-slate-700"
                  }`}
                >
                  {popup.kategori || popup.keterangan || "Menu Transaksi"}
                </h3>
              </div>

              <div className="p-3 space-y-3">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 px-2.5 uppercase tracking-wider mb-1">
                    Navigasi & Validasi
                  </span>

                  <button
                    onClick={() => {
                      fetchDetailTransaksi(popup.id_transaksi);
                      setPopup(null);
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-indigo-50/80 text-indigo-600 rounded-xl transition-all duration-200 group font-medium text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <ListCollapse size={16} />
                      </span>
                      Lihat Detail Rincian
                    </div>
                    <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </button>

                  {popup.file_path ? (
                    <button
                      onClick={() => {
                       const imageUrl = getImageUrl(popup.file_path);

                        console.log("IMAGE URL:", imageUrl);

                        setSelectedImage(imageUrl);
                        setShowImageModal(true);
                        setPopup(null);
                      }}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-blue-50/80 text-blue-600 rounded-xl transition-all duration-200 group font-medium text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                          <Eye size={16} />
                        </span>
                        Pratinjau Bukti Nota
                      </div>

                      <span className="text-xs text-blue-400">&rarr;</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center gap-3 p-2.5 text-slate-400 text-sm font-medium">
                      <span className="p-1.5 bg-slate-100 text-slate-400 rounded-lg">
                        <Eye size={16} />
                      </span>
                      Tidak Ada Berkas Bukti
                    </div>
                  )}
                  {popup.status_jurnal !== "sudah" && (
                    <button
                      onClick={() => handlePostingClick(popup.id_transaksi)}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all duration-200 group font-medium text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                          <Send size={16} />
                        </span>
                        Posting ke Jurnal
                      </div>
                      <span className="text-xs text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                        &rarr;
                      </span>
                    </button>
                  )}
                </div>

                <hr className="border-slate-100 my-1" />

                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 px-2.5 uppercase tracking-wider mb-1">
                    Modifikasi Data
                  </span>

                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("adminToken");

                        // 🔥 AMBIL DETAIL TRANSAKSI LENGKAP
                        const res = await fetch(
                          `http://127.0.0.1:8000/api/transaksi/${popup.id_transaksi}`,
                          {
                            headers: {
                              Accept: "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        const result = await res.json();

                        console.log("DETAIL EDIT:", result);

                        if (result.success) {
                          // 🔥 KIRIM DATA DETAIL KE MODAL EDIT
                          setSelectedData(result.data);

                          setShowModal(true);

                          setPopup(null);
                        }
                      } catch (err) {
                        console.error("Gagal ambil detail:", err);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-amber-50 text-amber-600 rounded-xl transition-all duration-200 group font-medium text-sm"
                  >
                    <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
                      <Edit3 size={16} />
                    </span>
                    Ubah Transaksi
                  </button>
                  <button
                    onClick={() => handleDeleteClick(popup.id_transaksi)}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-all duration-200 group font-medium text-sm"
                  >
                    <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition-colors">
                      <Trash2 size={16} />
                    </span>
                    Hapus Transaksi Permanen
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setPopup(null)}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-center text-xs font-bold text-slate-600 rounded-xl transition duration-150 shadow-sm active:scale-[0.98]"
                >
                  Batalkan & Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL EDIT ================= */}
      <AnimatePresence>
        {showModal && selectedData && (
          <ModalEditTransaksi
            data={selectedData}
            onClose={() => {
              setShowModal(false);
              setSelectedData(null);
            }}
            onRefresh={() => {
              fetchTransactions();
              showSuccessAlert(
                "Data Diperbarui",
                "Perubahan rincian keuangan berhasil disimpan secara sinkron ke server.",
              );
            }}
          />
        )}
      </AnimatePresence>

      {/* ================= MODAL LIHAT GAMBAR BUKTI ================= */}
      <AnimatePresence>
        {showImageModal && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 md:p-8"
            onClick={() => {
              setShowImageModal(false);
            setSelectedImage(getImageUrl(header.file_path));
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full relative border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                  <Eye size={16} className="text-red-600" />
                  File Image Bukti Transkasi
                </h3>

                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setSelectedImage("");
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* BODY IMAGE */}
              <div className="p-2 bg-gray-900 flex justify-center items-center max-h-[75vh] overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Bukti Transaksi"
                  className="max-w-full max-h-[70vh] rounded-lg object-contain shadow-md"
                  onError={(e) => {
                    console.error("Gagal load image:", selectedImage);

                    e.target.src =
                      "https://placehold.co/600x400?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* FOOTER */}
              <div className="p-3 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setSelectedImage("");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DETAIL TRANSAKSI================= */}
      <AnimatePresence>
        {showDetailModal &&
          detailData &&
          (() => {
            // Mapping data aman: deteksi jika menggunakan format API baru (bersarang) atau lama (flat)
            const header = detailData.header || detailData;
            const details = detailData.details || [];

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-6 text-black"
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailData(null);
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header Modal */}
                  <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-red-600 text-white rounded-t-2xl">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <ListCollapse size={22} /> Rincian Lengkap Transaksi
                    </h2>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setDetailData(null);
                      }}
                      className="p-1.5 hover:bg-red-700 rounded-full transition"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* Body Modal */}
                  <div className="p-6 space-y-6">
                    {/* Blok 1: Informasi Utama (Header Transaksi) */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                      {/* NOMOR TRANSAKSI */}
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                        {/* KIRI */}
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">
                            Nomor Transaksi
                          </span>

                          <h2 className="text-base md:text-lg font-bold text-gray-800 tracking-wide mt-0.5">
                            {header.nomor_transaksi || "-"}
                          </h2>

                          <span className="text-[11px] text-gray-400 mt-0.5">
                            Referensi transaksi & audit sistem
                          </span>
                        </div>

                        {/* LOGO PMI */}
                        {/* LOGO PMI */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-red-100 shadow-sm overflow-hidden p-2">
                          <img
                            src="/images/pmilogo.png"
                            alt="PMI Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* GRID INFORMASI */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Unit Kerja
                          </p>
                          <p className="text-base font-bold text-gray-800 mt-0.5">
                            {header.unit}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Kategori / Keterangan Utama
                          </p>
                          <p className="text-base font-bold text-gray-800 mt-0.5">
                            {header.keterangan || header.kategori}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Jenis Transaksi
                          </p>
                          <p className="text-base font-bold text-gray-800 mt-0.5 capitalize">
                            {header.jenis_transaksi}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Sumber Dana
                          </p>
                          <p className="text-base font-bold text-gray-800 mt-0.5">
                            {header.sumber || "Bulan Dana"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Kode & Nama Akun
                          </p>

                          <p className="text-base font-bold text-gray-800 mt-0.5">
                            {header.akun_kode || header.akun?.akun_kode}
                            {header.akun?.nama ? ` - ${header.akun.nama}` : ""}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Tanggal Transaksi
                          </p>

                          <p className="text-base font-bold text-gray-800 mt-0.5">
                            {header.tanggal}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Nomor Bukti
                          </p>

                          <p className="text-base font-bold text-gray-800 mt-0.5">
                            {header.no_bukti || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status Jurnal
                          </p>

                          <p className="text-base font-bold mt-0.5 capitalize">
                            {header.status_jurnal === "sudah" ? (
                              <span className="text-green-600">
                                Sudah Diposting
                              </span>
                            ) : (
                              <span className="text-yellow-600">
                                Belum Diposting
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Blok 2: Tabel Breakdown (Detail Pemecahan Uraian) */}
                    <div>
                      <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-4 bg-red-600 rounded-sm"></span>
                        Detail Pemecahan Uraian
                      </h3>

                      <div className="border rounded-xl overflow-hidden border-gray-300">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                            <tr>
                              <th className="p-3">Uraian / Deskripsi Item</th>
                              <th className="p-3 text-center w-20">Qty</th>
                              <th className="p-3 text-center w-24">Satuan</th>
                              <th className="p-3 text-right">Harga Satuan</th>
                              <th className="p-3 text-right">Subtotal</th>
                            </tr>
                          </thead>

                          <tbody>
                            {details && details.length > 0 ? (
                              // Render data item pecahan dari tabel detail_transaksis
                              details.map((item, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-gray-200 hover:bg-gray-50/50"
                                >
                                  <td className="p-3 font-medium text-gray-800">
                                    {item.uraian}
                                  </td>
                                  <td className="p-3 text-center">
                                    {item.qty}
                                  </td>
                                  <td className="p-3 text-center text-gray-600">
                                    {item.satuan}
                                  </td>
                                  <td className="p-3 text-right">
                                    Rp{" "}
                                    {(Number(item.harga) || 0).toLocaleString(
                                      "id-ID",
                                    )}
                                  </td>
                                  <td className="p-3 text-right font-semibold text-gray-900">
                                    Rp{" "}
                                    {(
                                      Number(item.subtotal) ||
                                      item.qty * item.harga
                                    ).toLocaleString("id-ID")}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              /* Fallback otomatis jika transaksi ini belum memiliki rincian breakdown pecahan */
                              <tr className="border-b border-gray-200">
                                <td className="p-3 font-medium text-gray-800">
                                  {header.keterangan || header.kategori}
                                </td>
                                <td className="p-3 text-center">
                                  {header.qty || 1}
                                </td>
                                <td className="p-3 text-center text-gray-600">
                                  {header.satuan || "org"}
                                </td>
                                <td className="p-3 text-right">
                                  Rp{" "}
                                  {(
                                    Number(header.jumlah) / (header.qty || 1)
                                  ).toLocaleString("id-ID")}
                                </td>
                                <td className="p-3 text-right font-semibold text-gray-900">
                                  Rp{" "}
                                  {Number(header.jumlah).toLocaleString(
                                    "id-ID",
                                  )}
                                </td>
                              </tr>
                            )}
                          </tbody>

                          <tfoot className="bg-red-50/70 font-bold border-t border-gray-300">
                            <tr>
                              <td
                                colSpan={4}
                                className="p-3 text-right text-gray-700"
                              >
                                Total Keseluruhan Nominal:
                              </td>
                              <td className="p-3 text-right text-red-600 text-base">
                                Rp{" "}
                                {Number(header.jumlah).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Blok 3: Dokumen Pendukung / Lampiran Bukti */}
                    {header.file_path && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-red-600 rounded-full"></span>
                          Dokumen Pendukung / Lampiran
                        </p>

                        <div className="flex flex-wrap gap-4">
                          <div
                            onClick={() => {
                              setSelectedImage(getImageUrl(header.file_path));
                              setShowImageModal(true);
                            }}
                            className="group flex items-center justify-between w-full max-w-md p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                                <img
                                 src={getImageUrl(header.file_path)}
                                  alt="Bukti Nota"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                                  {header.file_path.split("/").pop() ||
                                    "Bukti_Transaksi.jpg"}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                  <span className="inline-block px-1.5 py-0.5 bg-gray-200 text-gray-700 font-bold rounded uppercase text-[10px]">
                                    {(
                                      header.file_path.split(".").pop() || "JPG"
                                    ).toUpperCase()}
                                  </span>
                                  &bull; Klik untuk memperbesar
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 pl-2">
                              <span className="p-2 bg-white group-hover:bg-red-50 border border-gray-200 group-hover:border-red-200 rounded-lg text-gray-500 group-hover:text-red-600 transition-all duration-200 shadow-sm">
                                <Eye size={16} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                 {/* Footer Modal */}
<div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-2xl">

  <button
    onClick={() => exportDetailPDF(detailData)}
    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all"
  >
    
    <Download size={18} />
    Unduh PDF

  </button>

</div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
      {/* Tambahkan ini di bawah penutup AnimatePresence modal detail */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                onClick={() => setShowImageModal(false)}
              >
                <X size={20} />
              </button>
              <img
                src={selectedImage}
                alt="Preview Dokumen"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================
          ================= CUSTOM APP ALERT MODAL (LUXURY PMI) ================
          ====================================================================== */}
      <AnimatePresence>
        {alertConfig.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/35 backdrop-blur-xl flex items-center justify-center z-[200] p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", ease: "easeOut", duration: 0.4 }}
              className="bg-white/95 w-full max-w-[360px] rounded-[24px] p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100/80 flex flex-col items-center text-center text-black relative"
            >
              {/* TAMPILAN IKON (MINIMALIST & DEEP REFLECTION) */}
              {alertConfig.type === "confirm" && (
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-amber-500 mb-5 relative border border-slate-100 shadow-inner">
                  <AlertTriangle
                    size={24}
                    strokeWidth={1.75}
                    className="animate-pulse"
                  />
                </div>
              )}

              {alertConfig.type === "success" && (
                <div className="w-16 h-16 rounded-full bg-red-50/50 flex items-center justify-center text-red-600 mb-5 relative border border-red-100/50 shadow-inner group">
                  {/* Efek Wave Elegan Langit PMI */}
                  <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping [animation-duration:2.5s]" />
                  {/* Lambang Plus/Cross Minimalis di Latar Belakang */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] text-red-600 pointer-events-none select-none font-light text-5xl">
                    +
                  </div>
                  <CheckCircle2
                    size={24}
                    strokeWidth={1.75}
                    className="relative z-10"
                  />
                </div>
              )}

              {alertConfig.type === "loading" && (
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-red-600 mb-5 border border-slate-100 shadow-inner relative">
                  {/* Sirkulasi Loading Mewah */}
                  <Loader2
                    size={24}
                    strokeWidth={1.75}
                    className="animate-spin text-red-600"
                  />
                  <div className="absolute inset-2 border border-dashed border-slate-200 rounded-full animate-[spin_15s_linear_infinite]" />
                </div>
              )}

              {/* DETAIL KONTEN (CLASSY TYPOGRAPHY) */}
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight leading-snug px-1">
                {alertConfig.title}
              </h3>
              <p className="text-[12px] font-normal text-slate-400/90 mt-2 px-2 leading-relaxed tracking-wide">
                {alertConfig.message}
              </p>

              {/* TOMBOL AKSI (SOPHISTICATED PREMIUM BUTTONS) */}
              <div className="w-full flex flex-col gap-2 mt-7">
                {alertConfig.type === "confirm" ? (
                  <div className="flex gap-2.5 w-full">
                    <button
                      onClick={() =>
                        setAlertConfig((prev) => ({ ...prev, isOpen: false }))
                      }
                      className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-500 font-semibold rounded-xl text-[12px] transition-all duration-300 hover:text-slate-700 active:scale-[0.97]"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => {
                        if (alertConfig.onConfirm) alertConfig.onConfirm();
                      }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-semibold rounded-xl text-[12px] transition-all duration-300 shadow-[0_4px_12px_rgba(220,38,38,0.15)] active:scale-[0.97]"
                    >
                      Konfirmasi
                    </button>
                  </div>
                ) : alertConfig.type === "success" ? (
                  <button
                    onClick={() =>
                      setAlertConfig((prev) => ({ ...prev, isOpen: false }))
                    }
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-medium rounded-xl text-[12px] tracking-wide transition-all duration-300 shadow-[0_4px_12px_rgba(15,23,42,0.15)] active:scale-[0.97]"
                  >
                    Mengerti
                  </button>
                ) : (
                  /* Mode Loading Luxury */
                  <div className="w-full py-2 flex flex-col items-center justify-center gap-1.5">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-red-600/40 rounded-full animate-[pulse_1s_infinite_100ms]" />
                      <span className="w-1 h-1 bg-red-600/70 rounded-full animate-[pulse_1s_infinite_300ms]" />
                      <span className="w-1 h-1 bg-red-600 rounded-full animate-[pulse_1s_infinite_500ms]" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                      Menyinkronkan
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
