<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\AkunSeeder; // ⬅️ WAJIB DITAMBAHKAN

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // =========================
        // USER ADMIN
        // =========================
        User::firstOrCreate(
            ['email' => 'admin@pmibuleleng.or.id'],
            [
                'name' => 'Admin PMI Buleleng',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        // =========================
        // AKUN BERTINGKAT
        // =========================
        $this->call([
            AkunSeeder::class,
        ]);
    }
}
