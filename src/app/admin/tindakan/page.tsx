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
  jenis_kasus: string;
  waktu_pelaksanaan: string | null;
  pec: string | null;
};

function TindakanPageInner() {
  const [kasusList, setKasusList] = useState<Kasus[]>([]);
  const [tindakanList, setTindakanList] = useState<Tindakan[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    setLoading(true);
    const res = await fetch("/api/tindakan");
    const data = await res.json();
    setTindakanList(data);
    setLoading(false);
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
    setSubmitting(true);

    const payload = {
      kasus_id: Number(form.kasus_id),
      waktu_pelaksanaan: form.waktu_pelaksanaan || null,
      pec: form.pec || null,
    };

    try {
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
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(t: Tindakan) {
    setEditingId(t.id);
    setForm({
      kasus_id: String(t.kasus_id),
      waktu_pelaksanaan: t.waktu_pelaksanaan
        ? t.waktu_pelaksanaan.slice(0, 16)
        : "",
      pec: t.pec || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({
      kasus_id: "",
      waktu_pelaksanaan: "",
      pec: "",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus tindakan forensik ini?")) return;
    await fetch(`/api/tindakan/${id}`, { method: "DELETE" });
    fetchTindakan();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            Kelola Tindakan Forensik
          </h1>
          <p className="text-slate-600">
            Dokumentasi dan pelacakan tindakan forensik untuk setiap kasus
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-navy-800">
              {editingId ? "Edit Tindakan Forensik" : "Tambah Tindakan Forensik Baru"}
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
            {/* Kasus Selection */}
            <div>
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

            {/* Waktu Pelaksanaan */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Waktu Pelaksanaan
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="waktu_pelaksanaan"
                  value={form.waktu_pelaksanaan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* PEC / Catatan */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                PEC / Catatan Tindakan
              </label>
              <textarea
                name="pec"
                value={form.pec}
                onChange={handleChange}
                rows={5}
                placeholder="Deskripsikan tindakan forensik yang dilakukan, metode yang digunakan, dan temuan penting..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Dokumentasikan detail tindakan forensik untuk referensi di masa mendatang
              </p>
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
              Daftar Tindakan Forensik
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
            ) : tindakanList.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">Belum ada data</h3>
                <p className="mt-1 text-sm text-slate-500">Mulai dengan menambahkan tindakan forensik pertama</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">Kasus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">Waktu Pelaksanaan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-navy-700 uppercase tracking-wider">PEC / Catatan</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-navy-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tindakanList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                        #{t.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="font-medium">{t.jenis_kasus}</div>
                        <div className="text-xs text-slate-500">ID: {t.kasus_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {t.waktu_pelaksanaan
                              ? new Date(t.waktu_pelaksanaan).toLocaleString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 max-w-md">
                        <div className="line-clamp-3 whitespace-pre-wrap">
                          {t.pec || <span className="text-slate-400 italic">Tidak ada catatan</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
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
        
        /* Line clamp utility */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
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