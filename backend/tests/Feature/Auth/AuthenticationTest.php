<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    // ==========================================
    // 1. SKENARIO: Login Berhasil (Admin)
    // ==========================================
    public function test_admin_success_login()
    {
        // Buat data dummy admin sesuai dengan pengecekan role di controller Anda
        $admin = User::create([
            'name'     => 'Admin Test',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'admin@example.com',
            'password' => 'password123',
        ]);

        // Verifikasi status HTTP 200 dan pesan sukses
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Login berhasil'
                 ]);

        // Pastikan token terbuat dan user dikirimkan
        $this->assertNotNull($response->json('token'));
        $this->assertEquals('admin', $response->json('user.role'));
    }

    // ==========================================
    // 2. SKENARIO: Login Gagal (User Biasa / Bukan Admin)
    // ==========================================
    public function test_non_admin_access_denied()
    {
        // Buat user dengan role 'user'
        $user = User::create([
            'name'     => 'User Biasa',
            'email'    => 'user@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'user',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'user@example.com',
            'password' => 'password123',
        ]);

        // Verifikasi status HTTP 403 (Forbidden) sesuai pengecekan if ($user->role !== 'admin')
        $response->assertStatus(403)
                 ->assertJson([
                     'message' => 'Akses ditolak. Hanya admin yang bisa login.'
                 ]);
    }

    // ==========================================
    // 3. SKENARIO: Login Gagal (Password Salah)
    // ==========================================
    public function test_login_fails_with_wrong_password()
    {
        User::create([
            'name'     => 'Admin Test',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'admin@example.com',
            'password' => 'wrongpassword',
        ]);

        // Verifikasi status HTTP 401 (Unauthorized) sesuai pengecekan Hash::check
        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Email atau password salah'
                 ]);
    }

    // ==========================================
    // 4. SKENARIO: Validasi Input Kosong
    // ==========================================
    public function test_login_validation_required_fields()
    {
        $response = $this->postJson('/api/login', [
            'email'    => '',
            'password' => '',
        ]);

        // Verifikasi error validasi (HTTP 422 Unprocessable Entity)
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'password']);
    }
}