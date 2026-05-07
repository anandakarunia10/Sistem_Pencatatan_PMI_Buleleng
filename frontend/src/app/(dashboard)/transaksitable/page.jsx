"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [akuns, setAkuns] = useState([]); 
  
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    unit: ""
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.unit) params.append("unit", filters.unit);

      const res = await fetch(`http://localhost:8000/api/transaksi?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal fetch transaksi");
      const data = await res.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAkuns = async (jenis) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:8000/api/akun/jenis/${jenis}`, {
        headers: { 
          Accept: "application/json",
          Authorization: `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (data.success) setAkuns(data.data);
    } catch (err) {
      console.error("Gagal ambil akun", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openEditModal = (t) => {
    // Masukkan data murni tanpa format ribuan ke dalam state
    setEditingData({ 
      ...t,
      jumlah: t.jumlah.toString().split('.')[0].replace(/[^0-9]/g, ''),
      qty: t.qty.toString().replace(/[^0-9.]/g, '')
    });
    fetchAkuns(t.jenis_transaksi);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      
      // Bersihkan data sebelum kirim: Pastikan jumlah & qty adalah angka
      const payload = {
        unit: editingData.unit,
        akun_kode: editingData.akun_kode,
        jenis_transaksi: editingData.jenis_transaksi,
        sumber: editingData.sumber,
        keterangan: editingData.keterangan || "",
        qty: parseFloat(editingData.qty),
        satuan: editingData.satuan,
        jumlah: parseInt(editingData.jumlah.toString().replace(/[^0-9]/g, '')),
        tanggal: editingData.tanggal,
        no_bukti: editingData.no_bukti || ""
      };

      // Gunakan PUT dengan JSON (Pastikan api.php menggunakan Route::put atau Route::match)
      const res = await fetch(`http://localhost:8000/api/transaksi/${editingData.id_transaksi}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Data Berhasil Diperbarui!");
        setIsEditModalOpen(false);
        fetchTransactions();
      } else {
        alert("Gagal: " + (result.message || "Validasi gagal"));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem/koneksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 pl-0 sm:pl-[240px] transition-all text-gray-900 print:pl-0 relative font-sans">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 print:shadow-none print:border-none">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 no-print">
          <h2 className="text-xl font-bold text-black uppercase tracking-tight">Detail Laporan Transaksi</h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-4 py-2 text-sm font-bold bg-gray-800 text-white rounded-lg shadow-md hover:bg-black transition flex items-center gap-2">🖨️ Cetak Laporan</button>
            <Link href="/jurnal" className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2">📒 Lihat Jurnal Umum</Link>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm no-print">
          <div className="flex flex-col">
            <label className="text-xs font-black text-black mb-1 uppercase text-left">Mulai Tanggal</label>
            <input type="date" name="start_date" className="p-2 border border-gray-400 rounded-md text-black font-semibold" onChange={handleFilterChange} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-black text-black mb-1 uppercase text-left">Hingga Tanggal</label>
            <input type="date" name="end_date" className="p-2 border border-gray-400 rounded-md text-black font-semibold" onChange={handleFilterChange} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-black text-black mb-1 uppercase text-left">Unit / Sektor</label>
            <select name="unit" className="p-2 border border-gray-400 rounded-md text-black font-semibold" onChange={handleFilterChange}>
              <option value="">Semua Unit</option>
              <option value="PMI">Markas PMI</option>
              <option value="Ambulance">Layanan Ambulance</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchTransactions} className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-95">🔍 Cari Transaksi</button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm print:border-black">
          <table className="min-w-full text-xs sm:text-sm text-black">
            <thead className="bg-gray-100 text-black font-bold uppercase text-[11px] border-b-2 border-gray-200 print:bg-gray-200 print:border-black">
              <tr className="text-center">
                <th className="px-3 py-4 border-r print:border-black">No</th>
                <th className="px-3 py-4 border-r print:border-black">Unit</th>
                <th className="px-3 py-4 border-r text-left print:border-black">Uraian / Keterangan</th>
                <th className="px-3 py-4 border-r print:border-black">Jenis</th>
                <th className="px-3 py-4 border-r print:border-black">Kode Akun</th>
                <th className="px-3 py-4 border-r print:border-black">Qty / Satuan</th>
                <th className="px-3 py-4 border-r text-right print:border-black">Nominal (Rp)</th>
                <th className="px-3 py-4 border-r print:border-black">Tanggal</th>
                <th className="px-3 py-4 no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-black">
              {!loading && transactions.length > 0 && transactions.map((t, i) => (
                <tr key={t.id_transaksi || i} className="text-center hover:bg-red-50 transition border-b border-gray-100 font-medium print:border-black">
                  <td className="px-2 py-3 border-r text-gray-500 print:border-black">{i + 1}</td>
                  <td className="px-2 py-3 border-r print:border-black">
                     <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${t.unit === 'Ambulance' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>{t.unit}</span>
                  </td>
                  <td className="px-3 py-3 border-r text-left whitespace-nowrap font-bold print:border-black">{t.keterangan || "-"}</td>
                  <td className="px-2 py-3 border-r print:border-black">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${t.jenis_transaksi === "masuk" ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}`}>{t.jenis_transaksi}</span>
                  </td>
                  <td className="px-2 py-3 border-r text-gray-700 font-mono print:border-black">{t.akun?.nama || t.akun_kode}</td>
                  <td className="px-2 py-3 border-r font-black italic print:border-black">{t.qty} <span className="text-gray-400 font-normal text-[11px] print:text-black">{t.satuan}</span></td>
                  <td className="px-2 py-3 border-r font-extrabold text-right print:border-black">{Number(t.jumlah).toLocaleString("id-ID")}</td>
                  <td className="px-2 py-3 border-r whitespace-nowrap print:border-black">{t.tanggal}</td>
                  <td className="px-2 py-3 text-center no-print">
                    <button onClick={() => openEditModal(t)} className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-blue-700">EDIT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY SECTION */}
        {!loading && transactions.length > 0 && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg flex justify-between items-center shadow-lg print:bg-white print:text-black print:border print:border-black">
             <span className="text-white font-bold text-sm uppercase print:text-black">Total Rekaman: {transactions.length}</span>
             <div className="text-right">
                <p className="text-gray-400 text-[10px] uppercase font-bold print:text-black">Total Nominal Terfilter</p>
                <p className="text-xl font-black text-white print:text-black">Rp {transactions.reduce((acc, curr) => acc + parseFloat(curr.jumlah || 0), 0).toLocaleString('id-ID')}</p>
             </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL SECTION */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-black uppercase">Edit Transaksi #{editingData.id_transaksi}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-black text-2xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-black">Unit</label>
                <select className="w-full border p-2 rounded text-black font-semibold" value={editingData.unit} onChange={(e) => setEditingData({...editingData, unit: e.target.value})}>
                  <option value="PMI">PMI (Markas)</option>
                  <option value="Ambulance">Ambulance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-black">Jenis</label>
                <select className="w-full border p-2 rounded text-black bg-gray-100 font-semibold" value={editingData.jenis_transaksi} disabled>
                  <option value="masuk">Uang Masuk</option>
                  <option value="keluar">Uang Keluar</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase text-black">Akun (Kode Akun)</label>
                <select className="w-full border p-2 rounded text-black font-semibold" value={editingData.akun_kode} onChange={(e) => setEditingData({...editingData, akun_kode: e.target.value})}>
                  <option value="">Pilih Akun</option>
                  {akuns.map(a => <option key={a.akun_kode} value={a.akun_kode}>{a.akun_kode} - {a.nama}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase text-black">Sumber Dana</label>
                <select className="w-full border p-2 rounded text-black font-semibold" value={editingData.sumber} onChange={(e) => setEditingData({...editingData, sumber: e.target.value})}>
                  <option value="Hibah">Hibah</option>
                  <option value="Bulan Dana">Bulan Dana</option>
                  <option value="Pihak Lain">Pihak Lain</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase text-black">Uraian / Keterangan</label>
                <textarea className="w-full border p-2 rounded text-black font-medium" rows="2" value={editingData.keterangan || ""} onChange={(e) => setEditingData({...editingData, keterangan: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-black">Qty</label>
                <input type="text" className="w-full border p-2 rounded text-black font-semibold" value={editingData.qty} onChange={(e) => setEditingData({...editingData, qty: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-black">Satuan</label>
                <input type="text" className="w-full border p-2 rounded text-black font-semibold" value={editingData.satuan} onChange={(e) => setEditingData({...editingData, satuan: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1 uppercase text-black">Nominal (Rp) - Masukkan Angka Saja</label>
                <input type="text" className="w-full border p-2 rounded text-black font-bold text-lg" value={editingData.jumlah} onChange={(e) => setEditingData({...editingData, jumlah: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-black">Tanggal</label>
                <input type="date" className="w-full border p-2 rounded text-black font-semibold" value={editingData.tanggal} onChange={(e) => setEditingData({...editingData, tanggal: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-black">No Bukti</label>
                <input type="text" className="w-full border p-2 rounded text-black font-semibold" value={editingData.no_bukti || ""} onChange={(e) => setEditingData({...editingData, no_bukti: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-2 mt-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400">
                  {isSubmitting ? "Sedang Memperbarui..." : "SIMPAN PERUBAHAN"}
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-bold hover:bg-gray-300 transition">BATAL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}