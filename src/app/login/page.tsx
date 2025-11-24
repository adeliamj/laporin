"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const email = (form.email as any).value;
    const password = (form.password as any).value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) setError("Email atau password salah");
    else router.push("/");
  }

  return (
    <div
      className="absolute inset-0 min-h-screen w-full overflow-hidden
      bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33]"
    >
      {/* Soft glow */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px]
        bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px]
        bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>

      {/* Center Wrapper */}
      <div className="relative flex items-center justify-center min-h-screen p-6">
        <form
          onSubmit={handleSubmit}
          className="
            w-full max-w-md p-12 rounded-2xl
            bg-[#0d1b36]/60 backdrop-blur-2xl
            border border-white/10
            shadow-[0_8px_40px_rgba(0,0,0,0.35)]
            text-white space-y-10 animate-fadeIn
            relative overflow-hidden
          "
        >
          {/* Glossy highlight */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[120px]
              bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
          </div>

          <h1 className="text-3xl font-bold text-center drop-shadow-md tracking-wide">
            Masuk
          </h1>

          {/* Inputs */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="
                  w-full px-5 py-3 rounded-lg
                  bg-white/5 border border-white/20
                  text-white placeholder-white/60
                  focus:outline-none focus:ring-4 focus:ring-blue-500/40
                "
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="
                  w-full px-5 py-3 rounded-lg
                  bg-white/5 border border-white/20
                  text-white placeholder-white/60
                  focus:outline-none focus:ring-4 focus:ring-blue-500/40
                "
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

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
              Masuk
            </button>
          </div>

          <p className="text-xs text-center text-white/70">
            Belum punya akun?{" "}
            <Link href="/register" className="underline text-blue-300">
              Register
            </Link>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(26px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn .7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
