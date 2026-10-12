<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaksi extends Model
{
    use HasFactory;

    protected $table = 'detail_transaksis';

    protected $fillable = [
        'transaksi_id',
        'uraian',
        'qty',
        'satuan',
        'harga',
        'subtotal',
    ];

    public function transaksi()
    {
        return $this->belongsTo(
            Transaksi::class,
            'transaksi_id',
            'id_transaksi'
        );
    }
}