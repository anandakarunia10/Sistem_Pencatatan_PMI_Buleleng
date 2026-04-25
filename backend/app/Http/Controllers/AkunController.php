<?php

namespace App\Http\Controllers;

use App\Models\Akun;
use Illuminate\Http\Request;

class AkunController extends Controller
{
    /**
     * Ambil akun berdasarkan jenis transaksi (masuk / keluar)
     * Menampilkan akun induk + anak
     */
    public function byJenis($jenis)
    {
        // VALIDASI JENIS
        if (!in_array($jenis, ['masuk', 'keluar'])) {
            return response()->json([
                'message' => 'Jenis harus "masuk" atau "keluar".'
            ], 400);
        }

        // Ambil semua akun sesuai jenis, termasuk induk dan anak
        $akuns = Akun::where('jenis', $jenis)
            ->orderBy('akun_kode')
            ->get(['id', 'akun_kode', 'parent_kode', 'nama']);

        return response()->json([
            'success' => true,
            'data' => $akuns
        ]);
    }

    /**
     * Ambil semua akun lengkap (induk + anak) dengan tree
     */
    public function index()
    {
        $akuns = Akun::whereNull('parent_kode')
            ->with('children')  // pastikan relasi children ada di model
            ->orderBy('akun_kode')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $akuns
        ]);
    }

    /**
     * Ambil satu akun
     */
    public function show($id)
    {
        $akun = Akun::with('children')->find($id);

        if (!$akun) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $akun
        ]);
    }
}
