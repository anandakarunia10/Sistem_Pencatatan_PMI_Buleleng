<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Akun;

class AkunSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data lama agar tidak duplikat saat seeder dijalankan ulang
        // Akun::truncate(); 

        // ==========================================
        // 1. AKUN INDUK (PARENT) - PMI & AMBULANCE
        // ==========================================
        
        // Induk Keluar
        Akun::create([
            'akun_kode'   => '500',
            'parent_kode' => null,
            'jenis'       => 'keluar',
            'nama'        => 'Beban Operasional PMI'
        ]);

        Akun::create([
            'akun_kode'   => '600',
            'parent_kode' => null,
            'jenis'       => 'keluar',
            'nama'        => 'Beban Operasional Ambulance'
        ]);

        // Induk Masuk
        Akun::create([
            'akun_kode'   => '100',
            'parent_kode' => null,
            'jenis'       => 'masuk',
            'nama'        => 'Penerimaan PMI'
        ]);

        Akun::create([
            'akun_kode'   => '200',
            'parent_kode' => null,
            'jenis'       => 'masuk',
            'nama'        => 'Penerimaan Ambulance'
        ]);

        // ==========================================
        // 2. SUB-AKUN (CHILD) - DETAIL REVISI
        // ==========================================

        // --- Detil Pengeluaran PMI (di bawah 500) ---
        Akun::create([
            'akun_kode'   => '5001',
            'parent_kode' => '500',
            'jenis'       => 'keluar',
            'nama'        => 'Gaji & Tunjangan Staf'
        ]);

        Akun::create([
            'akun_kode'   => '5002',
            'parent_kode' => '500',
            'jenis'       => 'keluar',
            'nama'        => 'Belanja ATK'
        ]);

        // --- Detil Pengeluaran Ambulance (di bawah 600) ---
        Akun::create([
            'akun_kode'   => '6001',
            'parent_kode' => '600',
            'jenis'       => 'keluar',
            'nama'        => 'Biaya BBM Ambulance'
        ]);

        Akun::create([
            'akun_kode'   => '6002',
            'parent_kode' => '600',
            'jenis'       => 'keluar',
            'nama'        => 'Service & Pemeliharaan'
        ]);

        // --- Detil Penerimaan PMI (di bawah 100) ---
        Akun::create([
            'akun_kode'   => '1001',
            'parent_kode' => '100',
            'jenis'       => 'masuk',
            'nama'        => 'Hibah Pemerintah'
        ]);

        Akun::create([
            'akun_kode'   => '1002',
            'parent_kode' => '100',
            'jenis'       => 'masuk',
            'nama'        => 'Hasil Bulan Dana'
        ]);

        // --- Detil Penerimaan Ambulance (di bawah 200) ---
        Akun::create([
            'akun_kode'   => '2001',
            'parent_kode' => '200',
            'jenis'       => 'masuk',
            'nama'        => 'Jasa Layanan Ambulance'
        ]);
    }
}