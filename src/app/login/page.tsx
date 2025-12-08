"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.email as any).value;
    const password = (form.password as any).value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau password salah");
      setLoading(false);
    } else {
      router.push("/");
    }
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
            href="/"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 font-medium transition-colors animate-fadeIn"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Home
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
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold drop-shadow-md">
                Selamat Datang
              </h1>
              <p className="text-sm text-white/60 mt-2">
                Login untuk mengakses sistem forensik digital
              </p>
            </div>

            {/* Form Fields */}
            <div className="relative space-y-5">
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
                    placeholder="Masukkan password"
                    className="
                      w-full px-4 py-3 pr-12 rounded-lg bg-white/5
                      border border-white/20 text-white
                      placeholder-white/50 focus:outline-none
                      focus:ring-4 focus:ring-blue-500/40
                      transition-all
                    "
                    required
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="relative pt-4">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full px-8 py-4 rounded-xl font-semibold tracking-wide
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  border border-white/10
                  shadow-[0_6px_26px_rgba(30,60,180,0.45)]
                  hover:scale-[1.02] hover:shadow-[0_7px_30px_rgba(30,60,200,0.55)]
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-2
                "
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Masuk
                  </>
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="relative text-center pt-4 border-t border-white/10">
              <p className="text-sm text-white/60">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs text-white/50">
              Dengan login, Anda menyetujui syarat dan ketentuan kami
            </p>
          </div>
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