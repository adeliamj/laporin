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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    setLoading(true);
    const res = await fetch("/api/barang-bukti");
    const data = await res.json();
    setBbList(data);
    setLoading(false);
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
    setSubmitting(true);
    
    const payload = {
      ...form,
      kasus_id: Number(form.kasus_id),
      waktu_penyimpanan: form.waktu_penyimpanan || null,
    };

    try {
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
    } finally {
      setSubmitting(false);
    }
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
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({
      kasus_id: "",
      jenis_bukti: "",
      lokasi_penyimpanan: "",
      waktu_penyimpanan: "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus barang bukti ini?")) return;
    await fetch(`/api/barang-bukti/${id}`, { method: "DELETE" });
    fetchBb();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            Kelola Barang Bukti Digital
          </h1>
          <p className="text-slate-600">
            Tambah, edit, dan kelola barang bukti digital untuk setiap kasus
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-navy-800">
              {editingId ? "Edit Barang Bukti" : "Tambah Barang Bukti Baru"}
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Kasus Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Kasus Terkait <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="kasus_id"
                    value={form.kasus_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors appearance-none"
                  >
                    <option value="">Pilih kasus yang terkait</option>
                    {kasusList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.jenis_kasus} (ID: {k.id})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Jenis Bukti */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Jenis Bukti <span className="text-red-500">*</span>
                </label>
                <input
                  name="jenis_bukti"
                  value={form.jenis_bukti}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Smartphone, Laptop, Hard Disk"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
                />
              </div>

              {/* Lokasi Penyimpanan */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Lokasi Penyimpanan <span className="text-red-500">*</span>
                </label>
                <input
                  name="lokasi_penyimpanan"
                  value={form.lokasi_penyimpanan}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Gudang A - Rak 5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
                />
              </div>

              {/* Waktu Penyimpanan */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Waktu Penyimpanan
                </label>
                <input
                  type="datetime-local"
                  name="waktu_penyimpanan"
                  value={form.waktu_penyimpanan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingId ? "Update Data" : "Tambah Data"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-navy-700">
            <h2 className="text-xl font-semibold text-white">
              Daftar Barang Bukti
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-navy-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : bbList.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">Belum ada data</h3>
                <p className="mt-1 text-sm text-slate-500">Mulai dengan menambahkan barang bukti pertama</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">Kasus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">Jenis Bukti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-navy-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bbList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                        #{b.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="font-medium">{b.jenis_kasus}</div>
                        <div className="text-xs text-slate-500">ID: {b.kasus_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {b.jenis_bukti}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {b.lokasi_penyimpanan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {b.waktu_penyimpanan
                          ? new Date(b.waktu_penyimpanan).toLocaleString('id-ID')
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(b)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-xs font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .text-navy-700 { color: #1e3a5f; }
        .text-navy-800 { color: #15293f; }
        .text-navy-900 { color: #0c1a2f; }
        .bg-navy-700 { background-color: #1e3a5f; }
        .bg-navy-800 { background-color: #15293f; }
        .hover\:bg-navy-800:hover { background-color: #15293f; }
        .focus\:ring-navy-500:focus { --tw-ring-color: #2d5a8f; }
        .focus\:border-navy-500:focus { border-color: #2d5a8f; }
      `}</style>
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