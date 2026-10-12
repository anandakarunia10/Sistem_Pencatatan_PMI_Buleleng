<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JurnalController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Ambil dari tabel jurnal (tanpa join ke transaksi_id karena kolom tidak ada)
            $query = DB::table('jurnal');

            // 1. Filter Tanggal Mulai
            if ($request->filled('start_date')) {
                $query->whereDate('tanggal', '>=', $request->start_date);
            }

            // 2. Filter Tanggal Selesai
            if ($request->filled('end_date')) {
                $query->whereDate('tanggal', '<=', $request->end_date);
            }

            // 3. Filter Unit (Membaca kata 'PMI' atau 'Ambulance' di dalam string keterangan posting)
            if ($request->filled('unit')) {
                $query->where('keterangan', 'LIKE', '%' . $request->unit . '%');
            }

            $dataJurnal = $query->orderBy('tanggal', 'desc')
                                ->orderBy('id', 'desc')
                                ->get();

            // 4. Sinkronisasi Frontend: Map akun_kode ke properti nama_akun agar terbaca {t.nama_akun} di Next.js
            $dataJurnal = $dataJurnal->map(function($item) {
                $item->nama_akun = $item->akun_kode; 
                return $item;
            });

            return response()->json([
                'success' => true,
                'data'    => $dataJurnal
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data buku jurnal: ' . $e->getMessage()
            ], 500);
        }
    }
}