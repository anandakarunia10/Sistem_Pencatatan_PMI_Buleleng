<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Akun;

class AkunSeeder extends Seeder
{
    public function run(): void
    {
        // =========================
        // AKUN KELUAR (BEBAN)
        // =========================
        Akun::create([
            'akun_kode'   => '001',
            'parent_kode' => null,
            'jenis'       => 'keluar',
            'nama'        => 'Gaji'
        ]);

        Akun::create([
            'akun_kode'   => '0011',
            'parent_kode' => '001',
            'jenis'       => 'keluar',
            'nama'        => 'Tunjangan'
        ]);

        Akun::create([
            'akun_kode'   => '002',
            'parent_kode' => null,
            'jenis'       => 'keluar',
            'nama'        => 'Operasional'
        ]);

        Akun::create([
            'akun_kode'   => '0021',
            'parent_kode' => '002',
            'jenis'       => 'keluar',
            'nama'        => 'Sewa Lahan'
        ]);

        // =========================
        // AKUN MASUK (PENERIMAAN)
        // =========================
        Akun::create([
            'akun_kode'   => '101',
            'parent_kode' => null,
            'jenis'       => 'masuk',
            'nama'        => 'Donasi'
        ]);

        Akun::create([
            'akun_kode'   => '102',
            'parent_kode' => null,
            'jenis'       => 'masuk',
            'nama'        => 'Subsidi'
        ]);
    }
}
