"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    
  useEffect(() => {
    document.title = "Login | PMI Buleleng";
  }, []);

  const handleLogin = async (e) => {  // fungsi yang menangani proses login saat form disubmit.
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login", { // URL backend Laravel
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      // ✅ SIMPAN TOKEN DAN USER
      localStorage.setItem("adminToken", data.token); // simpan token untuk API transaksi
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ REDIRECT LANGSUNG KE HALAMAN TRANSAKSI
      router.push("/transaksi");
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/login.jpeg')" }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/60 to-black/80" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="
          relative z-10
          bg-white/90 backdrop-blur-md
          p-8 rounded-xl
          shadow-2xl
          w-full max-w-sm
        "
      >
        <h1 className="text-2xl font-bold text-center text-red-700">
          Login
        </h1>
        <p className="text-center text-gray-600 text-sm mt-1">
          Sistem Keuangan PMI Buleleng
        </p>

        {error && (
          <div className="mt-4 text-sm bg-red-100 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2 
             text-gray-800 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-red-500 transition"
  required
/>

         <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2 
             text-gray-800 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-red-500 transition"
  required
/>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md shadow hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700">
          Belum punya akun?{" "}
          <Link href="/register" className="text-red-600 hover:underline">
            Daftar
          </Link>
        </p>
      </motion.div>
    </main>
  );
}