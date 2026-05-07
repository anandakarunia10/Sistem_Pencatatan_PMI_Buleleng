<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurnal extends Model
{
    use HasFactory;

    protected $table = 'jurnal';

    // Tabel jurnal biasanya pakai id standar (Auto Increment)
    protected $fillable = [
        'id_transaksi',
        'akun_kode',
        'posisi', // debit atau kredit
        'jumlah',
    ];

    /**
     * Relasi ke Transaksi
     */
    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }

    /**
     * Relasi ke Akun
     */
    public function akun()
    {
        return $this->belongsTo(Akun::class, 'akun_kode', 'akun_kode');
    }
}