"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";

type Korban = { id: number; nama: string };
type Kasus = {
  id: number;
  korban_id: number;
  nama_korban: string;
  jenis_kasus: string;
  tanggal_kejadian: string | null;
  ringkasan: string | null;
  status_kasus: "open" | "in_progress" | "closed";
};

function KasusPageInner() {
  const [korbanList, setKorbanList] = useState<Korban[]>([]);
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ korban_id: "", status_kasus: "open" });

  async function fetchKorban() {
    const res = await fetch("/api/korban");
    const data = await res.json();
    setKorbanList(data);
  }

  async function fetchKasus() {
    const res = await fetch("/api/kasus");
    const data = await res.json();
    setKasusList(data);
  }

  useEffect(() => {
    fetchKorban();
    fetchKasus();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSelectKasus(id: number) {
    const k = kasusList.find((k) => k.id === id);
    if (!k) return;
    setEditingId(id);
    setForm({
      korban_id: String(k.korban_id),
      status_kasus: k.status_kasus,
    });
  }

  async function handleUpdate() {
    if (!editingId) return;

    await fetch(`/api/kasus/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status_kasus: form.status_kasus,
      }),
    });

    setEditingId(null);
    setForm({ korban_id: "", status_kasus: "open" });
    fetchKasus();
  }

  return (
    <div className="min-h-screen w-full text-blue-600 flex flex-col pt-24">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center">Kelola Kasus</h1>

      {/* Form */}
      <div className="max-w-4xl mx-auto mb-8 space-y-6 w-full px-6">
        {kasusList.length > 0 && (
          <div>
            <label className="block text-sm mb-2">Pilih Kasus untuk Edit</label>
            <select
              className="w-full border border-blue-700 px-3 py-2 rounded-lg text-blue-600"
              value={editingId ?? ""}
              onChange={(e) => handleSelectKasus(Number(e.target.value))}
            >
              <option value="" className="text-blue-600">
                -- Pilih Kasus --
              </option>
              {kasusList.map((k) => (
                <option key={k.id} value={k.id} className="text-blue-600">
                  ID {k.id} - {k.jenis_kasus} ({k.nama_korban})
                </option>
              ))}
            </select>
          </div>
        )}

        {editingId && (
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Edit Kasus ID: {editingId}
            </h2>

            <label className="block text-sm mb-2">Status Kasus</label>
            <select
              name="status_kasus"
              value={form.status_kasus}
              onChange={handleChange}
              className="w-full border border-blue-700 px-3 py-2 rounded-lg mb-4 text-blue-600"
            >
              <option value="open" className="text-blue-600">
                Open
              </option>
              <option value="in_progress" className="text-blue-600">
                In Progress
              </option>
              <option value="closed" className="text-blue-600">
                Closed
              </option>
            </select>

            <button
              onClick={handleUpdate}
              className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition shadow-lg text-white"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* TABEL */}
      <div className="overflow-x-auto max-w-6xl mx-auto rounded-xl border border-blue-700 shadow-lg w-full px-6 mb-10">
        <table className="w-full text-sm text-blue-600 border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-2 border-b border-blue-700">ID</th>
              <th className="px-3 py-2 border-b border-blue-700">Korban</th>
              <th className="px-3 py-2 border-b border-blue-700">Jenis Kasus</th>
              <th className="px-3 py-2 border-b border-blue-700">Tanggal</th>
              <th className="px-3 py-2 border-b border-blue-700">Status</th>
              <th className="px-3 py-2 border-b border-blue-700">Ringkasan</th>
            </tr>
          </thead>
          <tbody>
            {kasusList.length > 0 ? (
              kasusList.map((k) => (
                <tr key={k.id} className="border-t border-blue-700">
                  <td className="px-3 py-2">{k.id}</td>
                  <td className="px-3 py-2">{k.nama_korban}</td>
                  <td className="px-3 py-2">{k.jenis_kasus}</td>
                  <td className="px-3 py-2">
                    {k.tanggal_kejadian?.slice(0, 10) || "-"}
                  </td>
                  <td className="px-3 py-2 capitalize">
                    {k.status_kasus.replace("_", " ")}
                  </td>
                  <td className="px-3 py-2 max-w-xs truncate">{k.ringkasan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3">
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

export default function KasusPage() {
  return (
    <RequireRole role="admin">
      <KasusPageInner />
    </RequireRole>
  );
}
