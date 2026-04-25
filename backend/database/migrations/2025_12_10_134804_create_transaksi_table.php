<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            // Gunakan string untuk kode akun agar 0 di depan (misal: 0011) tidak hilang
            $table->string('akun_kode'); 
            $table->enum('jenis_transaksi', ['masuk', 'keluar']);
            $table->decimal('jumlah', 15, 2); // decimal lebih akurat untuk uang
            $table->date('tanggal');
            $table->text('keterangan')->nullable();
            $table->string('no_bukti')->nullable();
            $table->string('file_path')->nullable();
            
            // Perbaikan utama: pastikan panjangnya cukup (string default 255)
            $table->string('status')->default('pending'); 
            
            $table->unsignedBigInteger('user_id')->default(1);
            $table->timestamps();

            // Opsional: Hubungkan ke tabel akun jika sudah ada
            // $table->foreign('akun_kode')->references('akun_kode')->on('akun')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};