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
        Schema::create('transaksi', function (Blueprint $table) {
            // Menggunakan id_transaksi agar sinkron dengan foreign key di tabel Jurnal
            $table->id('id_transaksi'); 

            // REVISI: Data dipilah menjadi 2 (Ambulance dan PMI)
            $table->enum('unit', ['PMI', 'Ambulance'])->default('PMI');

            // Relasi ke tabel akun
            $table->string('akun_kode'); 
            
            $table->enum('jenis_transaksi', ['masuk', 'keluar']);

            // REVISI: Tambahan sumber (hibah, bulan dana, pihak lain)
            $table->enum('sumber', ['Hibah', 'Bulan Dana', 'Pihak Lain', 'Lainnya'])->nullable();

            // REVISI: Tambahan detail qty, satuan, dan jumlah
            $table->decimal('jumlah', 15, 2); // Nilai total (Qty x Harga Satuan jika ada)
            $table->integer('qty')->default(1);
            $table->string('satuan')->nullable(); // Misal: Liter, Box, Rim, Orang
            
            $table->date('tanggal');
            
            // Keterangan akan diisi Uraian (nantinya di UI ditambahkan Kode Akun)
            $table->text('keterangan')->nullable();
            
            $table->string('no_bukti')->nullable();
            $table->string('file_path')->nullable();
            $table->string('status')->default('pending'); 
            
            $table->unsignedBigInteger('user_id')->default(1);
            $table->timestamps();

            // Indexing untuk optimasi fitur "Filter Date" dan pemilahan Unit
            $table->index(['unit', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};