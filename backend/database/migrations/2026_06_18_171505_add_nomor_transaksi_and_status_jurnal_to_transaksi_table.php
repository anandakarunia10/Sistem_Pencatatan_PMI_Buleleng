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
        Schema::table('transaksi', function (Blueprint $table) {

            if (!Schema::hasColumn('transaksi', 'nomor_transaksi')) {
                $table->string('nomor_transaksi')
                    ->nullable()
                    ->after('id_transaksi');
            }

            if (!Schema::hasColumn('transaksi', 'status_jurnal')) {
                $table->enum(
                    'status_jurnal',
                    ['belum', 'sudah']
                )
                ->default('belum')
                ->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksi', function (Blueprint $table) {

            if (Schema::hasColumn('transaksi', 'nomor_transaksi')) {
                $table->dropColumn('nomor_transaksi');
            }

            if (Schema::hasColumn('transaksi', 'status_jurnal')) {
                $table->dropColumn('status_jurnal');
            }
        });
    }
};