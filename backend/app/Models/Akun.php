<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Akun extends Model
{
    protected $table = 'akun'; // pastikan nama tabel sesuai database

    protected $fillable = [
        'akun_kode',
        'parent_kode',
        'jenis',
        'nama'
    ];

    public function children()
    {
        return $this->hasMany(Akun::class, 'parent_kode', 'akun_kode');
    }
}
