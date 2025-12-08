/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const name = (form.name as any).value;
    const email = (form.email as any).value;
    const password = (form.password as any).value;
    const confirmPassword = (form.confirmPassword as any).value;

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Gagal register");
      return;
    }

    setSuccess("Registrasi berhasil, silakan login");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33] overflow-hidden">
      {/* Soft Glow Effects */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 font-medium transition-colors animate-fadeIn"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Login
          </Link>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="
              w-full p-10 rounded-2xl
              bg-[#0d1b36]/60 backdrop-blur-2xl
              border border-white/10
              shadow-[0_8px_40px_rgba(0,0,0,0.35)]
              text-white space-y-6 animate-fadeIn
              relative overflow-hidden
            "
            style={{ animationDelay: '0.1s' }}
          >
            {/* Glossy highlight */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
            </div>

            {/* Header */}
            <div className="relative text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold drop-shadow-md">
                Buat Akun
              </h1>
              <p className="text-sm text-white/60 mt-2">
                Daftar untuk menggunakan sistem forensik digital
              </p>
            </div>

            {/* Form Fields */}
            <div className="relative space-y-5">
              {/* NAMA */}
              <div className="space-y-2">
                <label className="block text-sm text-white/90 font-medium">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  className="
                    w-full px-4 py-3 rounded-lg bg-white/5
                    border border-white/20 text-white
                    placeholder-white/50 focus:outline-none
                    focus:ring-4 focus:ring-blue-500/40
                    transition-all
                  "
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="block text-sm text-white/90 font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="
                    w-full px-4 py-3 rounded-lg bg-white/5
                    border border-white/20 text-white
                    placeholder-white/50 focus:outline-none
                    focus:ring-4 focus:ring-blue-500/40
                    transition-all
                  "
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="block text-sm text-white/90 font-medium">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    className="
                      w-full px-4 py-3 pr-12 rounded-lg bg-white/5
                      border border-white/20 text-white
                      placeholder-white/50 focus:outline-none
                      focus:ring-4 focus:ring-blue-500/40
                      transition-all
                    "
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2
                      p-2 rounded-lg
                      bg-white/5 hover:bg-white/10
                      transition-all duration-200
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/70" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/70" />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <label className="block text-sm text-white/90 font-medium">
                  Konfirmasi Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password"
                    className="
                      w-full px-4 py-3 pr-12 rounded-lg bg-white/5
                      border border-white/20 text-white
                      placeholder-white/50 focus:outline-none
                      focus:ring-4 focus:ring-blue-500/40
                      transition-all
                    "
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2
                      p-2 rounded-lg
                      bg-white/5 hover:bg-white/10
                      transition-all duration-200
                    "
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5 text-white/70" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/70" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="relative p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="relative p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="relative pt-4">
              <button
                type="submit"
                className="
                  w-full px-8 py-4 rounded-xl font-semibold tracking-wide
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  border border-white/10
                  shadow-[0_6px_26px_rgba(30,60,180,0.45)]
                  hover:scale-[1.02] hover:shadow-[0_7px_30px_rgba(30,60,200,0.55)]
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
              >
                <UserPlus className="w-5 h-5" />
                Daftar Sekarang
              </button>
            </div>

            {/* Login Link */}
            <div className="relative text-center pt-4 border-t border-white/10">
              <p className="text-sm text-white/60">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}