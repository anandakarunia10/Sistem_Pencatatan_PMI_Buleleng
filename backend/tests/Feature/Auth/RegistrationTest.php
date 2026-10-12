<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * TEST REGISTER BERHASIL
     */
    public function test_register_berhasil()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'User Test',
            'email' => 'user@test.com',
            'password' => '123456',
        ]);

        $response->assertStatus(201);

        $response->assertJson([
            'message' => 'Register berhasil, tunggu persetujuan admin'
        ]);

        // cek data masuk database
        $this->assertDatabaseHas('users', [
            'email' => 'user@test.com',
            'role' => 'user',
        ]);
    }

    /**
     * TEST REGISTER GAGAL (EMAIL DUPLIKAT)
     */
    public function test_register_email_sudah_terdaftar()
    {
        // buat user dulu
        User::create([
            'name' => 'Existing User',
            'email' => 'user@test.com',
            'password' => Hash::make('123456'),
            'role' => 'user',
        ]);

        // coba register lagi dengan email sama
        $response = $this->postJson('/api/register', [
            'name' => 'User Baru',
            'email' => 'user@test.com',
            'password' => '123456',
        ]);

        $response->assertStatus(422); // validation error
    }

    /**
     * TEST REGISTER GAGAL (PASSWORD KURANG DARI 6)
     */
    public function test_register_password_kurang()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'User Test',
            'email' => 'baru@test.com',
            'password' => '123', // invalid
        ]);

        $response->assertStatus(422);
    }
}