    <?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\AuthController;
    use App\Http\Controllers\AkunController;
    use App\Http\Controllers\TransaksiController;
    use App\Http\Controllers\JurnalController;
    use App\Http\Controllers\LaporanController;
    use App\Http\Middleware\AdminMiddleware;

    // ===================
    // AUTH (PUBLIC)
    // ===================
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // ===================
    // AKUN (PUBLIC - UNTUK DROPDOWN)
    // ===================
    // Dropdown akun anak berdasarkan jenis transaksi (masuk / keluar)
    Route::get('/akun/jenis/{jenis}', [AkunController::class, 'byJenis']);

    // List semua akun (induk + anak)
    Route::get('/akun', [AkunController::class, 'index']);
    Route::get('/akun/{id}', [AkunController::class, 'show']);

    // ===================
    // PROTECTED ROUTES (HANYA ADMIN)
    // ===================
    Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {

        // TRANSAKSI
        Route::get('/transaksi', [TransaksiController::class, 'index']);
        Route::post('/transaksi', [TransaksiController::class, 'store']);
        Route::get('/transaksi/{id}', [TransaksiController::class, 'show']);

        // JURNAL
        Route::get('/jurnal', [JurnalController::class, 'index']);

        // LAPORAN
        Route::get('/laporan/pemasukan', [LaporanController::class, 'pemasukan']);
        Route::get('/laporan/pengeluaran', [LaporanController::class, 'pengeluaran']);
        Route::get('/laporan/jurnal', [LaporanController::class, 'jurnal']);
        Route::get('/laporan/rekap', [LaporanController::class, 'rekap']);
    });
