"use client";

import { useEffect, useState, FormEvent } from "react";
import { RequireRole } from "@/app/components/RequireRole";

type Kasus = { id: number; jenis_kasus: string };
type BarangBukti = {
  id: number;
  kasus_id: number;
  jenis_kasus: string;
  jenis_bukti: string | null;
  lokasi_penyimpanan: string | null;
  waktu_penyimpanan: string | null;
};

function BarangBuktiPageInner() {
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
  const [bbList, setBbList] = useState<BarangBukti[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    kasus_id: "",
    jenis_bukti: "",
    lokasi_penyimpanan: "",
    waktu_penyimpanan: "",
  });

  async function fetchKasus() {
    const res = await fetch("/api/kasus");
    const data = await res.json();
    setKasusList(data);
  }

  async function fetchBb() {
    const res = await fetch("/api/barang-bukti");
    const data = await res.json();
    setBbList(data);
  }

  useEffect(() => {
    fetchKasus();
    fetchBb();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      kasus_id: Number(form.kasus_id),
      waktu_penyimpanan: form.waktu_penyimpanan || null,
    };

    if (editingId) {
      await fetch(`/api/barang-bukti/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      await fetch("/api/barang-bukti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      kasus_id: "",
      jenis_bukti: "",
      lokasi_penyimpanan: "",
      waktu_penyimpanan: "",
    });
    fetchBb();
  }

  function handleEdit(bb: BarangBukti) {
    setEditingId(bb.id);
    setForm({
      kasus_id: String(bb.kasus_id),
      jenis_bukti: bb.jenis_bukti || "",
      lokasi_penyimpanan: bb.lokasi_penyimpanan || "",
      waktu_penyimpanan: bb.waktu_penyimpanan
        ? bb.waktu_penyimpanan.slice(0, 16)
        : "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus barang bukti?")) return;
    await fetch(`/api/barang-bukti/${id}`, { method: "DELETE" });
    fetchBb();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Kelola Barang Bukti Digital
      </h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div>
          <label className="block text-sm">Kasus</label>
          <select
            name="kasus_id"
            value={form.kasus_id}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
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
          <label className="block text-sm">Jenis Bukti</label>
          <input
            name="jenis_bukti"
            value={form.jenis_bukti}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Lokasi Penyimpanan</label>
          <input
            name="lokasi_penyimpanan"
            value={form.lokasi_penyimpanan}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm">Waktu Penyimpanan</label>
          <input
            type="datetime-local"
            name="waktu_penyimpanan"
            value={form.waktu_penyimpanan}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white"
        >
          {editingId ? "Update" : "Tambah"}
        </button>
      </form>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Kasus</th>
            <th className="border px-2 py-1">Case ID</th>
            <th className="border px-2 py-1">Jenis Bukti</th>
            <th className="border px-2 py-1">Lokasi</th>
            <th className="border px-2 py-1">Waktu</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bbList.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1">{b.id}</td>
              <td className="border px-2 py-1">
                {b.jenis_kasus} (ID: {b.kasus_id})
              </td>
              <td className="border px-2 py-1">{b.jenis_bukti}</td>
              <td className="border px-2 py-1">{b.lokasi_penyimpanan}</td>
              <td className="border px-2 py-1">
                {b.waktu_penyimpanan
                  ? b.waktu_penyimpanan.replace("T", " ").slice(0, 16)
                  : "-"}
              </td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEdit(b)}
                  className="px-2 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-2 py-1 border rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {bbList.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-2">
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function BarangBuktiPage() {
  return (
    <RequireRole role="admin">
      <BarangBuktiPageInner />
    </RequireRole>
  );
}
