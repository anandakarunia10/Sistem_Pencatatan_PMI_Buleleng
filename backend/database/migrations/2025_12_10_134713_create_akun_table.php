<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('akun', function (Blueprint $table) {
            $table->id();

            // KODE AKUN
            $table->string('akun_kode');
            $table->string('parent_kode')->nullable();

            $table->enum('jenis', ['masuk', 'keluar']);
            $table->string('nama');

            $table->timestamps();

            // INDEX & UNIQUE (WAJIB DIPISAH)
            $table->unique('akun_kode');
            $table->index('parent_kode');

            // SELF FOREIGN KEY
            $table->foreign('parent_kode')
                  ->references('akun_kode')
                  ->on('akun')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('akun');
    }
};
