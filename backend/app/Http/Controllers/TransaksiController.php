<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TransaksiController extends Controller
{
    /**
     * DISPLAY LIST TRANSAKSI
     */
    public function index(Request $request)
    {
        $query = Transaksi::with(['akun', 'details']);

        // FILTER UNIT
        if ($request->has('unit') && $request->unit != '') {
            $query->where('unit', $request->unit);
        }

        // FILTER START DATE
        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal', '>=', $request->start_date);
        }

        // FILTER END DATE
        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal', '<=', $request->end_date);
        }

        $transaksi = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $transaksi
        ], 200);
    }

    // Transaksi Baru
    public function store(Request $request)
    {
        $request->validate([
            'unit'            => 'required|string',
            'keterangan'      => 'required|string',
            'akun_kode'       => 'required|string',
            'jenis_transaksi' => 'required|string',
            'sumber'          => 'required|string',
            'tanggal'         => 'required|date',
            'jumlah'          => 'required|numeric',

            // DETAIL
            'details'             => 'required|array|min:1',
            'details.*.uraian'    => 'required|string',
            'details.*.qty'       => 'required|numeric',
            'details.*.satuan'    => 'required|string',
            'details.*.harga'     => 'required|numeric',
            'details.*.subtotal'  => 'required|numeric',

            // FILE
            'file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        DB::beginTransaction();

        try {

           // Handle File
            $filePath = null;

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filePath = $file->store('bukti_transaksi', 'public');
            }

         // Generate Nomor Transaksi
            $lastTransaksi = Transaksi::latest('id_transaksi')->first();

            $lastNumber = 0;

            if ($lastTransaksi && $lastTransaksi->nomor_transaksi) {

                $explode = explode('/', $lastTransaksi->nomor_transaksi);

                $lastNumber = (int) end($explode);
            }

            $newNumber = str_pad(
                $lastNumber + 1,
                4,
                '0',
                STR_PAD_LEFT
            );

            $nomorTransaksi =
                'TRX/' .
                date('Y') .
                '/' .
                date('m') .
                '/' .
                $newNumber;

            // Simpan Header Transaksi
            $transaksi = Transaksi::create([

                'nomor_transaksi' => $nomorTransaksi,

                'unit'            => $request->unit,
                'keterangan'      => $request->keterangan,
                'akun_kode'       => $request->akun_kode,
                'jenis_transaksi' => $request->jenis_transaksi,
                'sumber'          => $request->sumber,
                'tanggal'         => $request->tanggal,
                'jumlah'          => $request->jumlah,

                
                'qty'             => $request->details[0]['qty'] ?? 1,
                'satuan'          => $request->details[0]['satuan'] ?? null,

                'no_bukti'        => $request->no_bukti,
                'file_path'       => $filePath,

                'status'          => 'completed',
                'status_jurnal'   => 'belum',

                'user_id'         => auth()->id() ?? 1,
            ]);

            // Simpan Detail
            foreach ($request->details as $item) {

                DetailTransaksi::create([
                    'transaksi_id' => $transaksi->id_transaksi,
                    'uraian'       => $item['uraian'],
                    'qty'          => $item['qty'],
                    'satuan'       => $item['satuan'],
                    'harga'        => $item['harga'],
                    'subtotal'     => $item['subtotal'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil disimpan!',
                'data'    => $transaksi
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            Log::error(
                'Gagal simpan transaksi: ' .
                $e->getMessage()
            );

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan transaksi',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * SHOW SINGLE TRANSAKSI
     */
    public function show($id)
    {
        $transaksi = Transaksi::with(['akun', 'details'])
            ->where('id_transaksi', $id)
            ->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $transaksi
        ], 200);
    }

    /**
     * UPDATE TRANSAKSI
     */
    public function update(Request $request, $id)
    {
        $transaksi = Transaksi::where(
    'id_transaksi',
    $id
)->first();

if (!$transaksi) {
    return response()->json([
        'success' => false,
        'message' => 'Data tidak ditemukan.'
    ], 404);
}

/// Kunci edit transaksi jika posting
if ($transaksi->status_jurnal === 'sudah') {
    return response()->json([
        'success' => false,
        'message' => 'Transaksi sudah diposting ke jurnal dan tidak dapat diedit.'
    ], 403);
}

        $request->validate([
            'unit'            => 'required|string',
            'keterangan'      => 'required|string',
            'akun_kode'       => 'required|string',
            'jenis_transaksi' => 'required|string',
            'sumber'          => 'required|string',
            'tanggal'         => 'required|date',
            'jumlah'          => 'required|numeric',

            'file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',

            // DETAIL
            'details'             => 'required|array|min:1',
            'details.*.uraian'    => 'required|string',
            'details.*.qty'       => 'required|numeric',
            'details.*.satuan'    => 'required|string',
            'details.*.harga'     => 'required|numeric',
            'details.*.subtotal'  => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {

            // ===============================
            // UPDATE HEADER
            // ===============================
            $dataUpdate = $request->except([
                'file',
                '_method',
                'details',
                'nomor_transaksi'
            ]);

            // UPDATE FILE
            if ($request->hasFile('file')) {

                if (
                    $transaksi->file_path &&
                    Storage::disk('public')->exists(
                        $transaksi->file_path
                    )
                ) {
                    Storage::disk('public')->delete(
                        $transaksi->file_path
                    );
                }

                $newPath = $request
                    ->file('file')
                    ->store('bukti_transaksi', 'public');

                $dataUpdate['file_path'] = $newPath;
            }

            // OPTIONAL
            $dataUpdate['qty'] =
                $request->details[0]['qty'] ?? 1;

            $dataUpdate['satuan'] =
                $request->details[0]['satuan'] ?? null;

            $transaksi->update($dataUpdate);

            // ===============================
            // HAPUS DETAIL LAMA
            // ===============================
            DetailTransaksi::where(
                'transaksi_id',
                $transaksi->id_transaksi
            )->delete();

            // ===============================
            // SIMPAN DETAIL BARU
            // ===============================
            foreach ($request->details as $item) {

                DetailTransaksi::create([
                    'transaksi_id' => $transaksi->id_transaksi,
                    'uraian'       => $item['uraian'],
                    'qty'          => $item['qty'],
                    'satuan'       => $item['satuan'],
                    'harga'        => $item['harga'],
                    'subtotal'     => $item['subtotal'],
                ]);
            }

            DB::commit();

            $transaksi->load(['akun', 'details']);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil diperbarui!',
                'data'    => $transaksi
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            Log::error(
                'Gagal update transaksi ID ' .
                $id .
                ': ' .
                $e->getMessage()
            );

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui transaksi.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE TRANSAKSI
     */
    public function destroy($id)
    {
        $transaksi = Transaksi::where(
    'id_transaksi',
    $id
)->first();

if (!$transaksi) {
    return response()->json([
        'success' => false,
        'message' => 'Data tidak ditemukan.'
    ], 404);
}


// Kunci Hapus jika sudah posting jurnal

if ($transaksi->status_jurnal === 'sudah') {
    return response()->json([
        'success' => false,
        'message' => 'Transaksi sudah diposting ke jurnal dan tidak dapat dihapus.'
    ], 403);
}

        DB::beginTransaction();

        try {

            // HAPUS DETAIL
            DetailTransaksi::where(
                'transaksi_id',
                $transaksi->id_transaksi
            )->delete();

            // HAPUS FILE
            if (
                $transaksi->file_path &&
                Storage::disk('public')->exists(
                    $transaksi->file_path
                )
            ) {
                Storage::disk('public')->delete(
                    $transaksi->file_path
                );
            }

            // HAPUS TRANSAKSI
            $transaksi->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dihapus!'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POSTING TRANSAKSI
     */
    public function posting($id)
    {
        $transaksi = Transaksi::where(
            'id_transaksi',
            $id
        )->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.'
            ], 404);
        }

        if ($transaksi->status_jurnal === 'sudah') {
            return response()->json([
                'success' => false,
                'message' => 'Sudah diposting sebelumnya.'
            ], 400);
        }

        try {

            $transaksi->update([
                'status_jurnal' => 'sudah'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil diposting!',
                'status_baru' => 'sudah'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POSTING MASSAL
     */
    public function postingMassal(Request $request)
    {
        $ids = $request->ids;

        if (
            !$ids ||
            !is_array($ids) ||
            count($ids) === 0
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada transaksi dipilih.'
            ], 400);
        }

        DB::beginTransaction();

        try {

            foreach ($ids as $id) {

                $transaksi = Transaksi::where(
                    'id_transaksi',
                    $id
                )->first();

                if (!$transaksi) {
                    continue;
                }

                if ($transaksi->status_jurnal === 'sudah') {
                    continue;
                }

                $transaksi->update([
                    'status_jurnal' => 'sudah'
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Posting massal berhasil.'
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * UNPOSTING
     */
    public function unposting($id)
    {
        $transaksi = Transaksi::where(
            'id_transaksi',
            $id
        )->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Data transaksi tidak ditemukan.'
            ], 404);
        }

        try {

            $transaksi->update([
                'status_jurnal' => 'belum'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil membatalkan jurnal!',
                'status_baru' => 'belum'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}