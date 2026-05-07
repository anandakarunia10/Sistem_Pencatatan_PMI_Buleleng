<?php

namespace App\Http\Controllers;

use App\Models\Akun;
use App\Models\Transaksi;
use App\Models\Jurnal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    /**
     * Menampilkan daftar transaksi (dengan fitur filter unit & tanggal)
     */
    public function index(Request $request)
    {
        try {
            $query = Transaksi::with('akun');

            // REVISI: Filter berdasarkan Unit (PMI/Ambulance)
            if ($request->has('unit') && $request->unit != '') {
                $query->where('unit', $request->unit);
            }

            // REVISI: Filter berdasarkan Tanggal (Filter Date)
            if ($request->has('start_date') && $request->has('end_date') && $request->start_date != '' && $request->end_date != '') {
                $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
            }

            $transaksi = $query->orderBy('tanggal', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $transaksi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan transaksi baru
     */
    public function store(Request $request)
    {
        // 1. Validasi Input sesuai Revisi Pak Agus
        $request->validate([
            'akun_kode'       => 'required|exists:akun,akun_kode',
            'unit'            => 'required|in:PMI,Ambulance',
            'jenis_transaksi' => 'required|in:masuk,keluar',
            'sumber'          => 'required|in:Hibah,Bulan Dana,Pihak Lain,Lainnya',
            'jumlah'          => 'required|numeric|min:0',
            'qty'             => 'required|numeric|min:1',
            'satuan'          => 'required|string|max:50',
            'tanggal'         => 'required|date',
            'keterangan'      => 'nullable|string',
            'no_bukti'        => 'nullable|string|max:100',
            'file'            => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        DB::beginTransaction();

        try {
            // 2. Upload File Bukti
            $filePath = null;
            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('bukti_transaksi', 'public');
            }

            // 3. Simpan ke Tabel Transaksi
            $transaksi = Transaksi::create([
                'akun_kode'       => $request->akun_kode,
                'unit'            => $request->unit,
                'jenis_transaksi' => $request->jenis_transaksi,
                'sumber'          => $request->sumber,
                'jumlah'          => $request->jumlah,
                'qty'             => $request->qty,
                'satuan'          => $request->satuan,
                'tanggal'         => $request->tanggal,
                'keterangan'      => $request->keterangan,
                'no_bukti'        => $request->no_bukti,
                'file_path'       => $filePath,
                'status'          => 'completed',
                'user_id'         => auth()->id() ?? 1,
            ]);

            // 4. LOGIC JURNAL (Otomatis mencatat ke akuntansi)
            Jurnal::create([
                'id_transaksi' => $transaksi->id_transaksi,
                'akun_kode'    => $request->akun_kode,
                'posisi'       => $request->jenis_transaksi === 'masuk' ? 'debit' : 'kredit',
                'jumlah'       => $request->jumlah,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi dan Jurnal berhasil disimpan',
                'data'    => $transaksi->load('akun')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail satu transaksi
     */
    public function show($id)
    {
        try {
            $transaksi = Transaksi::with('akun')->where('id_transaksi', $id)->firstOrFail();
            return response()->json(['success' => true, 'data' => $transaksi]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }
    }

    /**
     * Update Transaksi (Revisi: Tambah Edit)
     */
    public function update(Request $request, $id)
    {
        // Cari transaksi berdasarkan id_transaksi (bukan id)
        $transaksi = Transaksi::where('id_transaksi', $id)->firstOrFail();

        // HACK: Bersihkan nominal jika ada format koma/titik dari frontend
        if ($request->has('jumlah')) {
            $cleanJumlah = str_replace([',', '.'], '', $request->jumlah);
            $request->merge(['jumlah' => $cleanJumlah]);
        }

        $request->validate([
            'akun_kode'       => 'required|exists:akun,akun_kode',
            'unit'            => 'required|in:PMI,Ambulance',
            'jenis_transaksi' => 'required|in:masuk,keluar',
            'sumber'          => 'required|in:Hibah,Bulan Dana,Pihak Lain,Lainnya',
            'jumlah'          => 'required|numeric|min:0',
            'qty'             => 'required|numeric|min:0', // Revisi: min 0 kalau belum ada barang
            'satuan'          => 'required|string',
            'tanggal'         => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            // Update data transaksi (kecuali file karena PUT ribet dengan file)
            $transaksi->update($request->all());

            // Update Jurnal agar tetap sinkron
            Jurnal::where('id_transaksi', $id)->update([
                'akun_kode' => $request->akun_kode,
                'posisi'    => $request->jenis_transaksi === 'masuk' ? 'debit' : 'kredit',
                'jumlah'    => $request->jumlah,
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Data berhasil diperbarui']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus Transaksi
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $transaksi = Transaksi::where('id_transaksi', $id)->firstOrFail();
            
            // Hapus file bukti fisik jika ada
            if ($transaksi->file_path) Storage::disk('public')->delete($transaksi->file_path);
            
            // Hapus data (Jurnal otomatis terhapus karena Cascade Delete di DB)
            $transaksi->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Transaksi berhasil dihapus']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal menghapus: ' . $e->getMessage()], 500);
        }
    }
}