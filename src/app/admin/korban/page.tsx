"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";

type Korban = {
  id: number;
  nama: string;
  kontak: string;
  alamat: string;
};

function KorbanPageInner() {
  const [korbanList, setKorbanList] = useState<Korban[]>([]);

  async function fetchKorban() {
    const res = await fetch("/api/korban");
    const data = await res.json();
    setKorbanList(data);
  }

  useEffect(() => {
    fetchKorban();
  }, []);

  return (
    <div className="min-h-screen w-full text-blue-600 flex flex-col pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Korban</h1>

      <div className="overflow-x-auto max-w-6xl mx-auto rounded-xl border border-blue-700 shadow-lg w-full mb-10">
        <table className="w-full text-sm text-blue-600 border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-3 border-b border-blue-700 text-left">ID</th>
              <th className="px-4 py-3 border-b border-blue-700 text-left">Nama</th>
              <th className="px-4 py-3 border-b border-blue-700 text-left">Kontak</th>
              <th className="px-4 py-3 border-b border-blue-700 text-left">Alamat</th>
            </tr>
          </thead>
          <tbody>
            {korbanList.length > 0 ? (
              korbanList.map((k) => (
                <tr
                  key={k.id}
                  className="border-t border-blue-700 hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{k.id}</td>
                  <td className="px-4 py-2">{k.nama}</td>
                  <td className="px-4 py-2">{k.kontak}</td>
                  <td className="px-4 py-2">{k.alamat}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-blue-400">
                  Belum ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
