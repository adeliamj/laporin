/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent } from "react";
import { RequireRole } from "@/components/RequireRole";
import { FileText, Plus, Edit2, Trash2, Check } from "lucide-react";

type Korban = {
  id: number;
  nama: string;
};

type Kasus = {
  id: string;
  korban_id: string | null;
  korban: { nama: string } | null;
  jenis_kasus: string;
  tanggal_kejadian: string | null;
  ringkasan: string | null;
  status_kasus: "open" | "in_progress" | "closed";
};

function KasusPageInner() {
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
  const [korbanList, setKorbanList] = useState<Korban[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    korban_id: "",
    jenis_kasus: "",
    tanggal_kejadian: "",
    ringkasan: "",
    status_kasus: "open" as "open" | "in_progress" | "closed",
  });

  async function fetchKorban() {
    const res = await fetch("/api/korban");
    const data = await res.json();
    setKorbanList(data);
  }

  async function fetchKasus() {
    setLoading(true);
    const res = await fetch("/api/kasus");
    const data = await res.json();
    setKasusList(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchKorban();
    fetchKasus();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      korban_id: form.korban_id || null,
      tanggal_kejadian: form.tanggal_kejadian || null,
      ringkasan: form.ringkasan || null,
    };

    try {
      if (editingId) {
        await fetch(`/api/kasus/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEditingId(null);
      } else {
        await fetch("/api/kasus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setForm({
        korban_id: "",
        jenis_kasus: "",
        tanggal_kejadian: "",
        ringkasan: "",
        status_kasus: "open",
      });
      fetchKasus();
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(kasus: Kasus) {
    setEditingId(kasus.id);
    setForm({
      korban_id: kasus.korban_id || "",
      jenis_kasus: kasus.jenis_kasus,
      tanggal_kejadian: kasus.tanggal_kejadian?.slice(0, 10) || "",
      ringkasan: kasus.ringkasan || "",
      status_kasus: kasus.status_kasus,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({
      korban_id: "",
      jenis_kasus: "",
      tanggal_kejadian: "",
      ringkasan: "",
      status_kasus: "open",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus kasus ini?")) return;
    await fetch(`/api/kasus/${id}`, { method: "DELETE" });
    fetchKasus();
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "open": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "in_progress": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "closed": return "bg-green-500/20 text-green-300 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "open": return "Terbuka";
      case "in_progress": return "Sedang Diproses";
      case "closed": return "Selesai";
      default: return status;
    }
  };

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
            Kelola Kasus
          </h1>
          <p className="text-blue-200/80 text-lg">
            Tambah, edit, dan kelola data kasus forensik digital
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
                      Edit Kasus
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-blue-400" />
                      Tambah Kasus Baru
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
                  {/* Korban Selection */}
                  <div>
                    <label className="block text-sm text-white/90 mb-2">
                      Korban Terkait
                    </label>
                    <div className="relative">
                      <select
                        name="korban_id"
                        value={form.korban_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 appearance-none transition-all"
                      >
                        <option value="" className="bg-slate-800">Pilih korban (opsional)</option>
                        {korbanList.map((k) => (
                          <option key={k.id} value={k.id} className="bg-slate-800">
                            {k.nama}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Jenis Kasus */}
                  <div>
                    <label className="block text-sm text-white/90 mb-2">
                      Jenis Kasus <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="jenis_kasus"
                      value={form.jenis_kasus}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Pencurian Data, Penipuan Online"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                    />
                  </div>

                  {/* Tanggal Kejadian */}
                  <div>
                    <label className="block text-sm text-white/90 mb-2">
                      Tanggal Kejadian
                    </label>
                    <input
                      type="date"
                      name="tanggal_kejadian"
                      value={form.tanggal_kejadian}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                    />
                  </div>

                  {/* Status Kasus */}
                  <div>
                    <label className="block text-sm text-white/90 mb-2">
                      Status Kasus <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="status_kasus"
                        value={form.status_kasus}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 appearance-none transition-all"
                      >
                        <option value="open" className="bg-slate-800">Terbuka</option>
                        <option value="in_progress" className="bg-slate-800">Sedang Diproses</option>
                        <option value="closed" className="bg-slate-800">Selesai</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Ringkasan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/90 mb-2">
                      Ringkasan Kasus
                    </label>
                    <textarea
                      name="ringkasan"
                      value={form.ringkasan}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tuliskan ringkasan atau deskripsi kasus..."
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all resize-none"
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
                <FileText className="w-6 h-6 text-blue-400" />
                Daftar Kasus
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
              ) : kasusList.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="mx-auto h-16 w-16 text-white/30 mb-4" />
                  <h3 className="text-lg font-medium text-white/80 mb-2">Belum ada data</h3>
                  <p className="text-sm text-white/60">Mulai dengan menambahkan kasus pertama</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Korban</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Jenis Kasus</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Ringkasan</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-blue-300 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {kasusList.map((k) => (
                      <tr key={k.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-300">
                          #{k.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/90">
                          {k.korban?.nama || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80">
                          {k.jenis_kasus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {k.tanggal_kejadian?.slice(0, 10) || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(k.status_kasus)}`}>
                            {getStatusLabel(k.status_kasus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80 max-w-xs truncate">
                          {k.ringkasan || "-"}
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

export default function KasusPage() {
  return (
    <RequireRole role="admin">
      <KasusPageInner />
    </RequireRole>
  );
}