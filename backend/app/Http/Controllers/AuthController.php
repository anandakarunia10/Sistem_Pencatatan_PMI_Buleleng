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

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'role'     => 'user',
        'status'   => 'pending', // menunggu persetujuan admin
    ]);

    return response()->json([
        'message' => 'Registrasi berhasil. Menunggu persetujuan admin.',
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

    if ($user->status !== 'active') {
        return response()->json([
            'message' => 'Akun Anda belum disetujui oleh admin.'
        ], 403);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'message' => 'Login berhasil',
        'user'    => $user,
        'token'   => $token,
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
