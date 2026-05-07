<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'transaksi'; 

    // REVISI: Karena kita tidak menggunakan nama default 'id'
    protected $primaryKey = 'id_transaksi';

    protected $fillable = [
        'akun_kode',
        'unit',            // REVISI: PMI atau Ambulance
        'jenis_transaksi', // masuk atau keluar
        'sumber',          // REVISI: Hibah, Bulan Dana, dll
        'jumlah',
        'qty',             // REVISI: Kuantitas
        'satuan',          // REVISI: Liter, Box, dll
        'tanggal',
        'keterangan',      // Digunakan untuk Uraian
        'no_bukti',
        'file_path',
        'status',
        'user_id',
    ];

    /**
     * Relasi ke model Akun
     * Digunakan untuk mengambil nama/kode akun saat menampilkan laporan (Revisi: Kode Akun di Uraian)
     */
    public function akun()
    {
        return $this->belongsTo(Akun::class, 'akun_kode', 'akun_kode');
    }

    /**
     * Relasi ke model Jurnal
     * Penting agar saat transaksi dihapus/diupdate, jurnalnya bisa ikut menyesuaikan
     */
    public function jurnal()
    {
        return $this->hasMany(Jurnal::class, 'id_transaksi', 'id_transaksi');
    }

    /**
     * Scope untuk mempermudah filter Unit (PMI/Ambulance)
     */
    public function scopeUnit($query, $unit)
    {
        return $query->where('unit', $unit);
    }
}