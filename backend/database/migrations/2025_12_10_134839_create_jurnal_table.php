<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jurnal', function (Blueprint $table) {
            $table->id();

            // ID Transaksi sebagai foreign key
            $table->unsignedBigInteger('id_transaksi');
            
            // Relasi ke kode akun
            $table->string('akun_kode');
            
            // Posisi akuntansi (Debit / Kredit)
            $table->enum('posisi', ['debit', 'kredit']); 

            // DISESUAIKAN: Menggunakan decimal(15, 2) agar sama dengan tabel Transaksi
            // Ini penting agar nilai uang tidak meleset saat perhitungan laporan akhir tahun
            $table->decimal('jumlah', 15, 2);

            $table->timestamps();
            
            // Foreign Key Constraints
            $table->foreign('id_transaksi')
                  ->references('id_transaksi')
                  ->on('transaksi')
                  ->cascadeOnDelete();

            $table->foreign('akun_kode')
                  ->references('akun_kode')
                  ->on('akun')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnal');
    }
};