<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    /**
     * NAMA TABEL
     */
    protected $table = 'transaksi';

    /**
     * PRIMARY KEY
     */
    protected $primaryKey = 'id_transaksi';

    /**
     * AUTO INCREMENT
     */
    public $incrementing = true;

    /**
     * TYPE PRIMARY KEY
     */
    protected $keyType = 'int';

    /**
     * MASS ASSIGNMENT
     */
    protected $fillable = [

        /*
        |--------------------------------------------------------------------------
        | IDENTITAS TRANSAKSI
        |--------------------------------------------------------------------------
        */
        'nomor_transaksi',

        /*
        |--------------------------------------------------------------------------
        | DATA UTAMA
        |--------------------------------------------------------------------------
        */
        'unit',
        'akun_kode',
        'jenis_transaksi',
        'sumber',
        'jumlah',

        /*
        |--------------------------------------------------------------------------
        | DETAIL
        |--------------------------------------------------------------------------
        */
        'qty',
        'satuan',

        /*
        |--------------------------------------------------------------------------
        | TANGGAL & KETERANGAN
        |--------------------------------------------------------------------------
        */
        'tanggal',
        'keterangan',

        /*
        |--------------------------------------------------------------------------
        | DOKUMEN
        |--------------------------------------------------------------------------
        */
        'no_bukti',
        'file_path',

        /*
        |--------------------------------------------------------------------------
        | STATUS
        |--------------------------------------------------------------------------
        */
        'status',
        'status_jurnal',

        /*
        |--------------------------------------------------------------------------
        | USER
        |--------------------------------------------------------------------------
        */
        'user_id',
    ];

    /**
     * CASTING
     */
    protected $casts = [
        'tanggal' => 'date',
        'jumlah'  => 'decimal:2',
        'qty'     => 'integer',
    ];

    /**
     * RELASI KE AKUN
     */
    public function akun()
    {
        return $this->belongsTo(
            Akun::class,
            'akun_kode',
            'akun_kode'
        );
    }

    /**
     * RELASI KE JURNAL
     */
    public function jurnal()
    {
        return $this->hasMany(
            Jurnal::class,
            'id_transaksi',
            'id_transaksi'
        );
    }

    /**
     * RELASI DETAIL TRANSAKSI
     */
    public function details()
    {
        return $this->hasMany(
            DetailTransaksi::class,
            'transaksi_id',
            'id_transaksi'
        );
    }

    /**
     * SCOPE FILTER UNIT
     */
    public function scopeUnit($query, $unit)
    {
        return $query->where('unit', $unit);
    }

    /**
     * SCOPE FILTER JENIS
     */
    public function scopeJenis($query, $jenis)
    {
        return $query->where(
            'jenis_transaksi',
            $jenis
        );
    }

    /**
     * SCOPE FILTER TANGGAL
     */
    public function scopeTanggal($query, $start, $end)
    {
        return $query->whereBetween(
            'tanggal',
            [$start, $end]
        );
    }

    /**
     * AUTO GENERATE NOMOR TRANSAKSI
     * FORMAT:
     * TRX/2026/05/0001
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaksi) {

            /*
            |--------------------------------------------------------------------------
            | JIKA NOMOR TRANSAKSI BELUM ADA
            |--------------------------------------------------------------------------
            */
            if (empty($transaksi->nomor_transaksi)) {

                $tahun = date('Y');
                $bulan = date('m');

                /*
                |--------------------------------------------------------------------------
                | AMBIL ID TERAKHIR
                |--------------------------------------------------------------------------
                */
                $lastId = self::max('id_transaksi') + 1;

                /*
                |--------------------------------------------------------------------------
                | FORMAT 0001
                |--------------------------------------------------------------------------
                */
                $urutan = str_pad(
                    $lastId,
                    4,
                    '0',
                    STR_PAD_LEFT
                );

                /*
                |--------------------------------------------------------------------------
                | HASIL AKHIR
                |--------------------------------------------------------------------------
                */
                $transaksi->nomor_transaksi =
                    "TRX/{$tahun}/{$bulan}/{$urutan}";
            }

            /*
            |--------------------------------------------------------------------------
            | DEFAULT STATUS
            |--------------------------------------------------------------------------
            */
            if (empty($transaksi->status)) {
                $transaksi->status = 'completed';
            }

            /*
            |--------------------------------------------------------------------------
            | DEFAULT STATUS JURNAL
            |--------------------------------------------------------------------------
            */
            if (empty($transaksi->status_jurnal)) {
                $transaksi->status_jurnal = 'belum';
            }
        });
    }
}