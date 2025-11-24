"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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
    <div
      className="absolute inset-0 min-h-screen overflow-hidden
      bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33]"
    >
      {/* Soft Glow */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px]
        bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px]
        bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>

      {/* Center */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <form
          onSubmit={handleSubmit}
          className="
            w-full max-w-md p-12 rounded-2xl
            bg-[#0d1b36]/60 backdrop-blur-2xl
            border border-white/10
            shadow-[0_8px_40px_rgba(0,0,0,0.35)]
            text-white space-y-8 animate-fadeIn
            relative overflow-hidden
          "
        >
          {/* glossy highlight */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[120px]
              bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
          </div>

          <h1 className="text-3xl font-bold text-center drop-shadow-md">
            Register
          </h1>

          {/* NAMA */}
          <div className="relative space-y-2">
            <label className="block text-sm text-white/90">Nama</label>
            <input
              name="name"
              className="
                w-full px-4 py-3 rounded-lg bg-white/5
                border border-white/20 text-white
                placeholder-white/60 focus:outline-none
                focus:ring-4 focus:ring-blue-500/40
              "
              required
            />
          </div>

          {/* EMAIL */}
          <div className="relative space-y-2">
            <label className="block text-sm text-white/90">Email</label>
            <input
              name="email"
              type="email"
              className="
                w-full px-4 py-3 rounded-lg bg-white/5
                border border-white/20 text-white
                placeholder-white/60 focus:outline-none
                focus:ring-4 focus:ring-blue-500/40
              "
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative space-y-2">
            <label className="block text-sm text-white/90">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="
                w-full px-5 py-3 pr-16 rounded-lg bg-white/5
                border border-white/20 text-white
                placeholder-white/60 focus:outline-none
                focus:ring-4 focus:ring-blue-500/40
              "
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="
                absolute right-4 top-3/4 -translate-y-3/4
                flex items-center justify-center w-12 h-12
                bg-white/10 rounded-full hover:bg-white/20
                transition-all duration-200
              "
            >
              {showPassword ? (
                <EyeOff className="w-7 h-7 text-white/85" />
              ) : (
                <Eye className="w-7 h-7 text-white/85" />
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative space-y-2">
            <label className="block text-sm text-white/90">
              Konfirmasi Password
            </label>
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              className="
                w-full px-3 py-3 pr-8 rounded-lg bg-white/5
                border border-white/20 text-white
                placeholder-white/60 focus:outline-none
                focus:ring-4 focus:ring-blue-500/40
              "
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="
                absolute right-4 top-3/4 -translate-y-3/4
                flex items-center justify-center w-12 h-12
                bg-white/10 rounded-full hover:bg-white/20
                transition-all duration-200
              "
            >
              {showConfirm ? (
                <EyeOff className="w-7 h-7 text-white/85" />
              ) : (
                <Eye className="w-7 h-7 text-white/85" />
              )}
            </button>
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* BUTTON */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="
                px-14 py-4 rounded-xl font-semibold tracking-wide
                bg-gradient-to-r from-blue-700 to-indigo-700
                border border-white/10
                shadow-[0_6px_26px_rgba(30,60,180,0.45)]
                hover:scale-[1.04] hover:shadow-[0_7px_30px_rgba(30,60,200,0.55)]
                transition-all duration-300
              "
            >
              Daftar
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn .7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
