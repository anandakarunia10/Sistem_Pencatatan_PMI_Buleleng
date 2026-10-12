<?php

namespace App\Http\Controllers;

use App\Models\User;

class AdminController extends Controller
{
    // Ambil semua user yang menunggu persetujuan
    public function pendingUsers()
    {
        $users = User::where('role', 'user')
                     ->where('status', 'pending')
                     ->get();

        return response()->json($users);
    }
    

    // Setujui user
    public function approveUser($id)
{
    try {
        $user = User::findOrFail($id);
        $user->status = 'active';
        $user->role = 'admin';
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diaktifkan dan menjadi admin'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengupdate user'
        ], 404);
    }
}
}