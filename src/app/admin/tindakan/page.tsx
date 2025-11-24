"use client";

import { useEffect, useState, FormEvent } from "react";
import { RequireRole } from "@/app/components/RequireRole";

type Kasus = {
  id: number;
  jenis_kasus: string;
};

type Tindakan = {
  id: number;
  kasus_id: number;
  jenis_kasus: string; // dari join
  waktu_pelaksanaan: string | null; // datetime
  pec: string | null;
};

function TindakanPageInner() {
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
  const [tindakanList, setTindakanList] = useState<Tindakan[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    kasus_id: "",
    waktu_pelaksanaan: "",
    pec: "",
  });

  async function fetchKasus() {
    const res = await fetch("/api/kasus");
    const data = await res.json();
    setKasusList(data);
  }

  async function fetchTindakan() {
    const res = await fetch("/api/tindakan");
    const data = await res.json();
    setTindakanList(data);
  }

  useEffect(() => {
    fetchKasus();
    fetchTindakan();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = {
      kasus_id: Number(form.kasus_id),
      waktu_pelaksanaan: form.waktu_pelaksanaan || null,
      pec: form.pec || null,
    };

    if (editingId) {
      await fetch(`/api/tindakan/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      await fetch("/api/tindakan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      kasus_id: "",
      waktu_pelaksanaan: "",
      pec: "",
    });
    fetchTindakan();
  }

  function handleEdit(t: Tindakan) {
    setEditingId(t.id);
    setForm({
      kasus_id: String(t.kasus_id),
      waktu_pelaksanaan: t.waktu_pelaksanaan
        ? t.waktu_pelaksanaan.slice(0, 16) // biar cocok utk datetime-local
        : "",
      pec: t.pec || "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus tindakan ini?")) return;
    await fetch(`/api/tindakan/${id}`, { method: "DELETE" });
    fetchTindakan();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Kelola Tindakan Forensik</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div>
          <label className="block text-sm">Kasus</label>
          <select
            name="kasus_id"
            value={form.kasus_id}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
            required
          >
            <option value="">Pilih kasus</option>
            {kasusList.map((k: any) => (
              <option key={k.id} value={k.id}>
                {k.jenis_kasus} (ID: {k.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Waktu Pelaksanaan</label>
          <input
            type="datetime-local"
            name="waktu_pelaksanaan"
            value={form.waktu_pelaksanaan}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm">PEC / Catatan Tindakan</label>
          <textarea
            name="pec"
            value={form.pec}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white"
        >
          {editingId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* Tabel */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Kasus</th>
            <th className="border px-2 py-1">Waktu Pelaksanaan</th>
            <th className="border px-2 py-1">PEC / Catatan</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tindakanList.map((t) => (
            <tr key={t.id}>
              <td className="border px-2 py-1">{t.id}</td>
              <td className="border px-2 py-1">
                {t.jenis_kasus} (ID: {t.kasus_id})
              </td>
              <td className="border px-2 py-1">
                {t.waktu_pelaksanaan
                  ? t.waktu_pelaksanaan.replace("T", " ").slice(0, 16)
                  : "-"}
              </td>
              <td className="border px-2 py-1 max-w-xs whitespace-pre-wrap">
                {t.pec}
              </td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="px-2 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-2 py-1 border rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {tindakanList.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-2">
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function TindakanPage() {
  return (
    <RequireRole role="admin">
      <TindakanPageInner />
    </RequireRole>
  );
}
