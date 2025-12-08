/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent } from "react";
import { RequireRole } from "@/components/RequireRole";
import { Users, User, Plus, Edit2, Trash2, Check } from "lucide-react";

type Korban = {
  id: number;
  nama: string;
  kontak: string;
  alamat: string;
};

function KorbanPageInner() {
  const [korbanList, setKorbanList] = useState<Korban[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    kontak: "",
    alamat: "",
  });

  async function fetchKorban() {
    setLoading(true);
    const res = await fetch("/api/korban");
    const data = await res.json();
    setKorbanList(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchKorban();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await fetch(`/api/korban/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setEditingId(null);
      } else {
        await fetch("/api/korban", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      setForm({
        nama: "",
        kontak: "",
        alamat: "",
      });
      fetchKorban();
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(korban: Korban) {
    setEditingId(korban.id);
    setForm({
      nama: korban.nama,
      kontak: korban.kontak,
      alamat: korban.alamat,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({
      nama: "",
      kontak: "",
      alamat: "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus data korban ini?")) return;
    await fetch(`/api/korban/${id}`, { method: "DELETE" });
    fetchKorban();
  }

  return (
    <div className="absolute inset-0 min-h-screen overflow-auto bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33]">
      {/* Soft Glow Effects */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500 opacity-15 blur-[180px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Kelola Data Korban
          </h1>
          <p className="text-blue-200/80 text-lg">
            Tambah, edit, dan kelola data korban dalam sistem forensik digital
          </p>
        </div>

        {/* Form Card */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="relative overflow-hidden rounded-2xl bg-[#0d1b36]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            {/* Glossy highlight */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
            </div>

            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  {editingId ? (
                    <>
                      <Edit2 className="w-6 h-6 text-blue-400" />
                      Edit Data Korban
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-blue-400" />
                      Tambah Data Korban Baru
                    </>
                  )}
                </h2>
                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm text-blue-300 hover:text-white border border-blue-400/30 hover:border-blue-400/60 rounded-lg transition-all duration-200"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/90 mb-2">
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="nama"
                      value={form.nama}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap korban"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                    />
                  </div>

                  {/* Kontak */}
                  <div>
                    <label className="block text-sm text-white/90 mb-2">
                      Kontak <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="kontak"
                      value={form.kontak}
                      onChange={handleChange}
                      required
                      placeholder="Nomor telepon / email"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                    />
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm text-white/90 mb-2">
                      Alamat <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="alamat"
                      value={form.alamat}
                      onChange={handleChange}
                      required
                      placeholder="Alamat lengkap korban"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-12 py-4 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-blue-700 to-indigo-700 border border-white/10 shadow-[0_6px_26px_rgba(30,60,180,0.45)] hover:scale-[1.04] hover:shadow-[0_7px_30px_rgba(30,60,200,0.55)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
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
                        <Check className="w-5 h-5" />
                        {editingId ? "Update Data" : "Tambah Data"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="relative overflow-hidden rounded-2xl bg-[#0d1b36]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            {/* Glossy highlight */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
            </div>

            <div className="relative px-8 py-6 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                Daftar Korban
              </h2>
            </div>

            <div className="relative overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <svg className="animate-spin h-10 w-10 text-blue-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : korbanList.length === 0 ? (
                <div className="text-center py-16">
                  <User className="mx-auto h-16 w-16 text-white/30 mb-4" />
                  <h3 className="text-lg font-medium text-white/80 mb-2">Belum ada data</h3>
                  <p className="text-sm text-white/60">Mulai dengan menambahkan data korban pertama</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Kontak</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Alamat</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-blue-300 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {korbanList.map((k) => (
                      <tr key={k.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-300">
                          #{k.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/90 font-medium">
                          {k.nama}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80">
                          {k.kontak}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80">
                          {k.alamat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(k)}
                              className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-xs font-medium flex items-center gap-1.5 border border-blue-400/30"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(k.id)}
                              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-xs font-medium flex items-center gap-1.5 border border-red-400/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
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