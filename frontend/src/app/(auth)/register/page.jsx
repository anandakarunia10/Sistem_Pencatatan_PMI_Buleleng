"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 
    useEffect(() => {
      document.title = "Register | PMI Buleleng";
    }, []);

  const handleRegister = async (e) => { 
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Register gagal");
        setLoading(false);
        return;
      }

      setSuccess("Register berhasil, silakan login");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/register.jpg')" }}
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
          Register
        </h1>

        <p className="text-center text-gray-600 text-sm mt-1">
          Sistem Keuangan PMI Buleleng
        </p>

        {/* ALERT */}
        {error && (
          <div className="mt-4 text-sm bg-red-100 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 text-sm bg-green-100 text-green-700 p-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
         <input
  type="text"
  placeholder="Nama Lengkap"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2 
             text-gray-800 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-red-500"
  required
/>

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2 
             text-gray-800 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-red-500"
  required
/>

<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full border border-gray-300 rounded px-3 py-2 
             text-gray-800 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-red-500"
  required
/>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}