<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    // ==========================================
    // 1. SKENARIO: Logout Berhasil
    // ==========================================
    public function test_authenticated_user_can_logout()
    {
       
        $user = User::create([
            'name'     => 'User Test',
            'email'    => 'user@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        
        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Logout berhasil',
                 ]);

        $this->assertCount(0, $user->tokens);
    }

    // ==========================================
    // 2. SKENARIO: Logout Gagal (Unauthenticated)
    // ==========================================
    public function test_unauthenticated_user_cannot_logout()
    {
        // Langsung kirim request tanpa login/actingAs
        $response = $this->postJson('/api/logout');

        // Verifikasi bahwa sistem menolak akses (HTTP 401 Unauthorized)
        $response->assertStatus(401);
    }
}