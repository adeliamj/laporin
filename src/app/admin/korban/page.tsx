"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/app/components/RequireRole";

type Korban = {
  id: number;
  nama: string;
  kontak: string;
  alamat: string;
};

function KorbanPageInner() {
  const [korbanList, setKorbanList] = useState<Korban[]>([]);

  // Ambil data korban
  async function fetchKorban() {
    const res = await fetch("/api/korban");
    const data = await res.json();
    setKorbanList(data);
  }

  useEffect(() => {
    fetchKorban();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Daftar Korban</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Kontak</th>
            <th className="border px-2 py-1">Alamat</th>
          </tr>
        </thead>
        <tbody>
          {korbanList.length > 0 ? (
            korbanList.map((k) => (
              <tr key={k.id}>
                <td className="border px-2 py-1">{k.id}</td>
                <td className="border px-2 py-1">{k.nama}</td>
                <td className="border px-2 py-1">{k.kontak}</td>
                <td className="border px-2 py-1">{k.alamat}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-2">
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function KorbanPage() {
  return (
    <RequireRole role="admin">
      <KorbanPageInner />
    </RequireRole>
  );
}
