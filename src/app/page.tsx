"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm">
            Logged in as {session?.user?.email} ({role})
          </p>
        </div>
      </div>

      {role === "admin" && (
        <div className="space-x-4">
          <Link href="/admin/korban">Kelola Korban</Link>
          <Link href="/admin/kasus">Kelola Kasus</Link>
          <Link href="/admin/barang-bukti">Kelola Barang Bukti</Link>
          <Link href="/admin/tindakan">Kelola Tindakan</Link>
        </div>
      )}

      {role === "user" && (
        <div>
          <p>User biasa bisa lihat list data (read-only) atau sesuai kebutuhan dosen.</p>
          <Link href="/user/kasus">Lihat Kasus</Link>
        </div>
      )}
    </div>
  );
}
