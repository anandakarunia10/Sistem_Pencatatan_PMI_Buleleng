<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    /**
     * Laporan Transaksi Per Periode
     */
    public function transaksi(Request $request)
    {
        $tanggalMulai = $request->input('tanggal_mulai');
        $tanggalSelesai = $request->input('tanggal_selesai');

        $query = DB::table('transaksi')
            ->join('akun', 'transaksi.akun_kode', '=', 'akun.akun_kode')
            ->select(
                'transaksi.tanggal',
                'transaksi.no_bukti',
                'transaksi.akun_kode',
                'akun.nama as nama_akun',
                'transaksi.jenis_transaksi',
                'transaksi.jumlah',
                'transaksi.keterangan'
            )
            ->orderBy('transaksi.tanggal', 'asc');

        if ($tanggalMulai && $tanggalSelesai) {
            $query->whereBetween('transaksi.tanggal', [$tanggalMulai, $tanggalSelesai]);
        }

        $transaksi = $query->get();

        // Format debit/kredit
        $laporan = $transaksi->map(function($t) {
            return [
                'tanggal' => $t->tanggal,
                'no_bukti' => $t->no_bukti,
                'akun_kode' => $t->akun_kode,
                'nama_akun' => $t->nama_akun,
                'debit' => $t->jenis_transaksi === 'masuk' ? $t->jumlah : 0,
                'kredit' => $t->jenis_transaksi === 'keluar' ? $t->jumlah : 0,
                'keterangan' => $t->keterangan,
            ];
        });

        // Hitung total debit/kredit
        $totalDebit = $laporan->sum('debit');
        $totalKredit = $laporan->sum('kredit');

        return response()->json([
            'success' => true,
            'total_debit' => $totalDebit,
            'total_kredit' => $totalKredit,
            'data' => $laporan
        ]);
    }
}
