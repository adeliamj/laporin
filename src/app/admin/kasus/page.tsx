"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/app/components/RequireRole";

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

  // Ambil data korban
  async function fetchKorban() {
    const res = await fetch("/api/korban");
    const data = await res.json();
    setKorbanList(data);
  }

  // Ambil data kasus
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
    const k = kasusList.find(k => k.id === id);
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
        status_kasus: form.status_kasus, // Hanya update status
      }),
    });

    setEditingId(null);
    setForm({ korban_id: "", status_kasus: "open" });
    fetchKasus();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Kelola Kasus</h1>

      {/* Pilih kasus untuk diedit */}
      {kasusList.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm mb-1">Pilih Kasus untuk Edit</label>
          <select
            className="border px-2 py-1 rounded w-full"
            value={editingId ?? ""}
            onChange={e => handleSelectKasus(Number(e.target.value))}
          >
            <option value="">-- Pilih Kasus --</option>
            {kasusList.map(k => (
              <option key={k.id} value={k.id}>
                ID {k.id} - {k.jenis_kasus} ({k.nama_korban})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Form edit status */}
      {editingId && (
        <div className="mb-6 p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2">
            Edit Kasus ID: {editingId}
          </h2>

          {/* Status kasus */}
          <div className="mb-2">
            <label className="block text-sm">Status Kasus</label>
            <select
              name="status_kasus"
              value={form.status_kasus}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-black text-white"
          >
            Update
          </button>
        </div>
      )}

      {/* Tabel kasus */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Korban</th>
            <th className="border px-2 py-1">Jenis Kasus</th>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Ringkasan</th>
          </tr>
        </thead>
        <tbody>
          {kasusList.length > 0 ? (
            kasusList.map((k) => (
              <tr key={k.id}>
                <td className="border px-2 py-1">{k.id}</td>
                <td className="border px-2 py-1">{k.nama_korban}</td>
                <td className="border px-2 py-1">{k.jenis_kasus}</td>
                <td className="border px-2 py-1">
                  {k.tanggal_kejadian?.slice(0, 10) || "-"}
                </td>
                <td className="border px-2 py-1">{k.status_kasus}</td>
                <td className="border px-2 py-1 max-w-xs truncate">
                  {k.ringkasan}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-2">
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
