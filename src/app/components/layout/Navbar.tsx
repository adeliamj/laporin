"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;
  const pathname = usePathname();

  const isLoggedIn = status === "authenticated";

  return (
    <nav className="w-full border-b bg-white px-6 py-3 flex items-center justify-between">
      {/* Kiri: brand */}
      <div className="text-lg font-bold">
        <Link href="/">Laporin</Link>
      </div>

      {/* Kanan: menu */}
      <div className="flex items-center gap-4 text-sm">
        {!isLoggedIn && (
          <>
            {/* SEBELUM LOGIN */}
            <Link
              href="/register"
              className={`hover:underline ${
                pathname === "/register" ? "font-semibold" : ""
              }`}
            >
              Register
            </Link>
            <Link
              href="/login"
              className={`hover:underline ${
                pathname === "/login" ? "font-semibold" : ""
              }`}
            >
              Login
            </Link>
          </>
        )}

        {isLoggedIn && role === "user" && (
          <>
            {/* SESUDAH LOGIN - USER */}
            <Link
              href="/user/lapor"
              className={`hover:underline ${
                pathname.startsWith("/user/lapor") ? "font-semibold" : ""
              }`}
            >
              Lapor
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="border rounded px-3 py-1"
            >
              Logout
            </button>
          </>
        )}

        {isLoggedIn && role === "admin" && (
          <>
            {/* SESUDAH LOGIN - ADMIN */}
            <Link
              href="/admin/korban"
              className={`hover:underline ${
                pathname.startsWith("/admin/korban") ? "font-semibold" : ""
              }`}
            >
              Korban
            </Link>
            <Link
              href="/admin/kasus"
              className={`hover:underline ${
                pathname.startsWith("/admin/kasus") ? "font-semibold" : ""
              }`}
            >
              Kasus
            </Link>
            <Link
              href="/admin/barang-bukti"
              className={`hover:underline ${
                pathname.startsWith("/admin/barang-bukti") ? "font-semibold" : ""
              }`}
            >
              Barang Bukti
            </Link>
            <Link
              href="/admin/tindakan"
              className={`hover:underline ${
                pathname.startsWith("/admin/tindakan") ? "font-semibold" : ""
              }`}
            >
              Tindakan
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="border rounded px-3 py-1"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
