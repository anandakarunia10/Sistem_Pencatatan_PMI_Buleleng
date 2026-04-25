<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jurnal', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_transaksi');
            $table->string('akun_kode');
            $table->enum('posisi', ['debit', 'kredit']); // jurnal standar
            $table->bigInteger('jumlah');

            $table->timestamps();
            
            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksi')->cascadeOnDelete();
            $table->foreign('akun_kode')->references('akun_kode')->on('akun')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jurnal');
    }
};
