<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    // Nama tabel di database (sesuaikan jika nama tabelmu bukan 'transaksis')
    protected $table = 'transaksi'; 

    protected $fillable = [
        'akun_kode',
        'jenis_transaksi',
        'jumlah',
        'tanggal',
        'keterangan',
        'no_bukti',
        'file_path',
        'status',
        'user_id',
    ];

    // Relasi ke model Akun (digunakan di fungsi index tadi)
    public function akun()
    {
        return $this->belongsTo(Akun::class, 'akun_kode', 'akun_kode');
    }
}