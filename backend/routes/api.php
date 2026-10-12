<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AkunController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\JurnalController;
use App\Http\Controllers\LaporanController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| AUTH (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});


/*
|--------------------------------------------------------------------------
| AKUN (PUBLIC - DROPDOWN)
|--------------------------------------------------------------------------
*/
Route::prefix('akun')->group(function () {
    Route::get('/', [AkunController::class, 'index']);
    Route::get('/jenis/{jenis}', [AkunController::class, 'byJenis']);
    Route::get('/{id}', [AkunController::class, 'show']);
});


/*
|--------------------------------------------------------------------------
| ADMIN PROTECTED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    

    /*
    |---------------- TRANSAKSI ----------------
    */
    Route::prefix('transaksi')->group(function () {

        Route::get('/', [TransaksiController::class, 'index']);
        Route::post('/', [TransaksiController::class, 'store']);
        Route::get('/{id}', [TransaksiController::class, 'show']);
        Route::put('/{id}', [TransaksiController::class, 'update']);
        Route::delete('/{id}', [TransaksiController::class, 'destroy']);

        Route::post('/{id}/posting', [TransaksiController::class, 'posting']);

        Route::post('/posting-massal', [TransaksiController::class, 'postingMassal']);

        Route::put('/{id}/unposting', [TransaksiController::class, 'unposting']);
    });

    /*
    |---------------- JURNAL ----------------
    */
    Route::get('/jurnal', [JurnalController::class, 'index']);

    /*
    |---------------- LAPORAN ----------------
    */
    Route::prefix('laporan')->group(function () {
        Route::get('/pemasukan', [LaporanController::class, 'pemasukan']);
        Route::get('/pengeluaran', [LaporanController::class, 'pengeluaran']);
        Route::get('/jurnal', [LaporanController::class, 'jurnal']);
        Route::get('/rekap', [LaporanController::class, 'rekap']);
    });

    /*
    |---------------- AKTIVASI USER ----------------
    */
    Route::get('/admin/pending-users', [AdminController::class, 'pendingUsers']);

    Route::put('/admin/approve-user/{id}', [AdminController::class, 'approveUser']);

});

