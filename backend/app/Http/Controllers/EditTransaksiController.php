<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EditTransaksiController extends Controller
{
    /**
     * Update data transaksi secara spesifik.
     * Karena Jurnal bersifat dinamis, update di sini otomatis merubah tampilan Jurnal.
     */
    public function update(Request $request, $id)
    {
        // 1. Cari data berdasarkan Primary Key custom kamu (id_transaksi)
        $transaksi = Transaksi::where('id_transaksi', $id)->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi dengan ID ' . $id . ' tidak ditemukan.'
            ], 404);
        }

        // 2. Bersihkan angka dari format ribuan (titik/koma) agar valid secara numeric
        if ($request->has('jumlah')) {
            $request->merge(['jumlah' => preg_replace('/[^0-9]/', '', $request->jumlah)]);
        }
        if ($request->has('qty')) {
            $request->merge(['qty' => preg_replace('/[^0-9]/', '', $request->qty)]);
        }

        // 3. Validasi ketat agar data keuangan tetap integritas
        $validator = Validator::make($request->all(), [
            'unit'            => 'required|in:PMI,Ambulance',
            'akun_kode'       => 'required|exists:akun,akun_kode',
            'jenis_transaksi' => 'required|in:masuk,keluar',
            'sumber'          => 'required|in:Hibah,Bulan Dana,Pihak Lain,Lainnya',
            'jumlah'          => 'required|numeric|min:0',
            'qty'             => 'required|numeric|min:0',
            'satuan'          => 'required|string|max:50',
            'tanggal'         => 'required|date',
            'keterangan'      => 'nullable|string',
            'no_bukti'        => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // 4. Eksekusi Update ke Tabel Transaksi
            // Karena tidak ada tabel jurnal fisik, kita tidak butuh Transaction DB (beginTransaction)
            // Tapi tetap disarankan pakai untuk keamanan jika nanti ada upload file.
            $transaksi->update($request->only([
                'unit', 'akun_kode', 'jenis_transaksi', 'sumber', 
                'jumlah', 'qty', 'satuan', 'tanggal', 'keterangan', 'no_bukti'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Data transaksi berhasil diperbarui. Jurnal otomatis terupdate.',
                'data'    => $transaksi
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
            ], 500);
        }
    }
}