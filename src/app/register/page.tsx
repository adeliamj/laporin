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
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded w-full max-w-sm space-y-4 bg-white"
      >
        <h1 className="text-xl font-semibold text-center">Register</h1>

        <div>
          <label className="block text-sm mb-1">Nama</label>
          <input
            name="name"
            className="border w-full px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="border w-full px-2 py-1 rounded"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="border w-full px-2 py-1 rounded pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center justify-center"
            >
              {showPassword ? (
                <EyeOff className="w-20 h-20 text-gray-600" />
              ) : (
                <Eye className="w-20 h-20 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-sm mb-1">Konfirmasi Password</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              className="border w-full px-2 py-1 rounded pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center justify-center"
            >
              {showConfirm ? (
                <EyeOff className="w-20 h-20 text-gray-600" />
              ) : (
                <Eye className="w-20 h-20 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded bg-black text-white"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}
