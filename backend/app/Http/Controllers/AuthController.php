<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ===================
    // REGISTER USER
    // ===================
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        // Semua yang register default role 'user'
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user', // user biasa, admin harus diubah manual
        ]);

        return response()->json([
            'message' => 'Register berhasil, tunggu persetujuan admin',
            'user'    => $user
        ], 201);
    }

    // ===================
    // LOGIN ADMIN
    // ===================
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        // Hanya admin yang bisa login
        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Akses ditolak. Hanya admin yang bisa login.'
            ], 403);
        }

        // Buat token API untuk SPA/Next.js
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $user,
            'token'   => $token, // wajib dikirim ke frontend
        ]);
    }

    // ===================
    // LOGOUT
    // ===================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}
