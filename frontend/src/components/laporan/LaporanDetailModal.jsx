"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ListCollapse, X, Eye, Download } from "lucide-react";
import { useState } from "react";
import { exportDetailPDF } from "@/components/laporan/exportDetailPDF";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = API_URL.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${BASE_URL}/storage/${path.replace(/^\/+/, "")}`;
};
export default function LaporanDetailModal({ selected, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  if (!selected) return null;

  const details = selected.details || [];

  const totalDetail = details.reduce(
    (total, item) => total + Number(item.subtotal || 0),
    0,
  );

  return (
    <>
      {/* ================= MAIN MODAL ================= */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-6 text-black"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-red-600 text-white rounded-t-2xl">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ListCollapse size={22} />
                  Rincian Lengkap Laporan
                </h2>

                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-red-700 rounded-full transition"
                >
                  <X size={22} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-6">
                {/* INFO BOX */}
                <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                  {/* HEADER INFO */}
                  <div className="flex justify-between items-center bg-white border rounded-xl px-4 py-3 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-red-400">
                        Nomor Transaksi
                      </p>
                      <h2 className="text-lg font-bold">
                        {selected.nomor_transaksi}
                      </h2>
                    </div>

                    <img
                      src="/images/pmilogo.png"
                      className="w-14 h-14 object-contain"
                      alt="logo"
                    />
                  </div>

                  {/* GRID INFO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Info label="Unit Kerja" value={selected.unit || "-"} />
                    <Info
                      label="Keterangan"
                      value={selected.keterangan || "-"}
                    />
                    <Info
                      label="Jenis Transaksi"
                      value={selected.jenis_transaksi || "-"}
                    />
                    <Info label="Sumber Dana" value={selected.sumber || "-"} />
                    <Info label="Kode Akun" value={selected.akun_kode} />
                    <Info
                      label="Tanggal"
                      value={
                        selected.tanggal
                          ? new Date(selected.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "-"
                      }
                    />
                    {/* ✅ FIX: NOMOR BUKTI */}
                    <Info
                      label="Nomor Bukti"
                      value={
                        selected.no_bukti ||
                        selected.nomor_bukti ||
                        selected.noBukti ||
                        "-"
                      }
                    />
                  </div>
                </div>

                {/* TABLE DETAIL */}
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-red-600 rounded-sm"></span>
                    Detail Uraian
                  </h3>

                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">Uraian</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-center">Satuan</th>
                          <th className="p-3 text-right">Harga</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {details.length > 0 ? (
                          details.map((item, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50">
                              <td className="p-3">{item.uraian}</td>
                              <td className="p-3 text-center">{item.qty}</td>
                              <td className="p-3 text-center">{item.satuan}</td>
                              <td className="p-3 text-right">
                                Rp{" "}
                                {(Number(item.harga) || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                              <td className="p-3 text-right font-semibold">
                                Rp{" "}
                                {(Number(item.subtotal) || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="p-3 text-center" colSpan={5}>
                              Tidak ada detail
                            </td>
                          </tr>
                        )}
                      </tbody>

                      <tfoot className="bg-red-50 font-bold">
                        <tr>
                          <td colSpan={4} className="p-3 text-right">
                            Total
                          </td>
                          <td className="p-3 text-right text-red-600">
                            Rp {totalDetail.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* FILE */}
                {selected.file_path && (
                  <div className="pt-4 border-t">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase">
                      Dokumen Pendukung
                    </p>

                    <div
                      onClick={() => {
                        const url = getImageUrl(selected.file_path);
                        setSelectedImage(getImageUrl(selected.file_path));
                        setShowImageModal(true);
                      }}
                      className="flex items-center justify-between border rounded-xl p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(selected.file_path)}
                          className="w-12 h-12 object-cover rounded"
                          alt="file"
                        />

                        <div>
                          <p className="font-semibold text-sm">
                            {selected.file_path.split("/").pop()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Klik untuk melihat
                          </p>
                        </div>
                      </div>

                      <Eye size={18} />
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => exportDetailPDF(selected)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all"
                >
                  <Download size={18} />
                  Unduh PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= IMAGE MODAL ================= */}
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
              {/* HEADER POPUP */}
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    File Image Bukti Transkasi
                  </h3>
                  <p className="text-xs text-gray-500 truncate max-w-[250px]">
                    {selectedImage?.split("/").pop()}
                  </p>
                </div>

                <button
                  className="p-2 bg-black/10 hover:bg-black/20 rounded-full"
                  onClick={() => setShowImageModal(false)}
                >
                  ✕
                </button>
              </div>

              {/* IMAGE */}
              <div className="bg-black flex items-center justify-center">
                <img
                  src={selectedImage}
                  className="w-full max-h-[80vh] object-contain"
                  alt="preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* helper */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}
