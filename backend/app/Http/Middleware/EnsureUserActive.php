<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserActive
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // ✅ PAKAI STATUS (INI HARUS SAMA DENGAN DATABASE + CONTROLLER)
        if (auth()->user()->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Akun belum disetujui admin'
            ], 403);
        }

        return $next($request);
    }
}