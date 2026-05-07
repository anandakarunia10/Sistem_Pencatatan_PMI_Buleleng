<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AkunController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\EditTransaksiController; // Import Controller Baru
use App\Http\Controllers\JurnalController;
use App\Http\Controllers\LaporanController;
use App\Http\Middleware\AdminMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- AUTH (PUBLIC) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- AKUN (PUBLIC - UNTUK DROPDOWN) ---
Route::prefix('akun')->group(function () {
    Route::get('/', [AkunController::class, 'index']);
    Route::get('/jenis/{jenis}', [AkunController::class, 'byJenis']);
    Route::get('/{id}', [AkunController::class, 'show']);
});

// --- PROTECTED ROUTES (HANYA ADMIN) ---
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {

    // TRANSAKSI
    Route::prefix('transaksi')->group(function () {
        Route::get('/', [TransaksiController::class, 'index']);
        Route::post('/', [TransaksiController::class, 'store']);
        Route::get('/{id}', [TransaksiController::class, 'show']);
        
        // CUKUP PAKAI POST: Karena di Next.js kita pakai FormData + Method Spoofing (_method: PUT)
        // Penulisan cukup '/{id}' karena sudah ada prefix 'transaksi' di atas
        Route::post('/{id}', [EditTransaksiController::class, 'update']); 
        
        Route::delete('/{id}', [TransaksiController::class, 'destroy']);
    });

    // JURNAL (Membaca secara dinamis dari tabel transaksi)
    Route::get('/jurnal', [JurnalController::class, 'index']);

    // LAPORAN
    Route::prefix('laporan')->group(function () {
        Route::get('/pemasukan', [LaporanController::class, 'pemasukan']);
        Route::get('/pengeluaran', [LaporanController::class, 'pengeluaran']);
        Route::get('/jurnal', [LaporanController::class, 'jurnal']);
        Route::get('/rekap', [LaporanController::class, 'rekap']);
    });
});