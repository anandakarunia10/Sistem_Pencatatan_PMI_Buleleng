<?php

namespace App\Http\Controllers;

use App\Models\Akun;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    /**
     * Menampilkan daftar transaksi
     */
    public function index()
    {
        try {
            // Mengambil data transaksi beserta info akunnya
            $transaksi = Transaksi::with('akun')->orderBy('tanggal', 'desc')->get();
            
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
        try {
            // 1. Validasi
            $request->validate([
                'akun_kode'       => 'required|exists:akun,akun_kode',
                'jenis_transaksi' => 'required|in:masuk,keluar',
                'jumlah'          => 'required|numeric|min:0',
                'tanggal'         => 'required|date',
                'keterangan'      => 'nullable|string',
                'no_bukti'        => 'nullable|string|max:100',
                'file'            => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            ]);

            // 2. Cek kesesuaian jenis akun
            $akun = Akun::where('akun_kode', $request->akun_kode)->first();
            if ($akun->jenis !== $request->jenis_transaksi) {
                return response()->json([
                    'success' => false,
                    'message' => "Jenis transaksi ({$request->jenis_transaksi}) tidak sesuai dengan jenis akun ({$akun->jenis})"
                ], 422);
            }

            // 3. Upload File
            $filePath = null;
            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('bukti_transaksi', 'public');
            }

            // 4. Simpan ke Database
            $transaksi = Transaksi::create([
                'akun_kode'       => $request->akun_kode,
                'jenis_transaksi' => $request->jenis_transaksi,
                'jumlah'          => $request->jumlah,
                'tanggal'         => $request->tanggal,
                'keterangan'      => $request->keterangan,
                'no_bukti'        => $request->no_bukti,
                'file_path'       => $filePath,
                'status'          => 'pending', // Ini sekarang aman karena kolom status sudah VARCHAR
                'user_id'         => auth()->id() ?? 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil disimpan',
                'data'    => $transaksi
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
}