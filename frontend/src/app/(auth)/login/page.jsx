"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Loading from "@/components/loading/loading";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login | PMI Kabupaten Buleleng";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
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

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <main
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/login.jpeg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            relative z-10
            w-full max-w-sm
            rounded-3xl
            bg-white
            p-8
            shadow-[0_15px_50px_rgba(0,0,0,0.25)]
          "
        >
          {/* Logo Container */}
          <div className="flex justify-center -mt-16 mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-4 border-white overflow-hidden">
              <img
                src="/images/pmilogo.png"
                alt="PMI Logo"
                className="h-full w-full object-contain p-2"
              />
            </div>
          </div>

          {/* Title */}
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Login</h1>

            <p className="mt-1 text-sm text-gray-500">
              Sistem Keuangan PMI Buleleng
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                mt-5 rounded-2xl
                border border-red-100
                bg-red-50
                px-4 py-3
                text-sm text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Masukkan Email
              </label>

              <input
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full rounded-2xl
                  border border-gray-200
                  bg-gray-50
                  px-4 py-3
                  text-gray-700
                  placeholder-gray-400
                  transition
                  focus:border-red-400
                  focus:bg-white
                  focus:outline-none
                  focus:ring-4 focus:ring-red-100
                "
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Masukkan Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-4 py-3 pr-12
                    text-gray-700
                    placeholder-gray-400
                    transition
                    focus:border-red-400
                    focus:bg-white
                    focus:outline-none
                    focus:ring-4 focus:ring-red-100
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-500
                    hover:text-gray-700
                    transition-colors
                  "
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-2xl
                bg-red-600
                py-3
                text-sm font-medium text-white
                transition-all
                hover:bg-red-700
                active:scale-[0.98]
                disabled:opacity-70
              "
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-red-600 transition hover:text-red-700"
            >
              Daftar
            </Link>
          </p>
        </motion.div>
      </main>
    </>
  );
}