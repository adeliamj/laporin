"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import { FileText, Eye } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  async function fetchKasus() {
    setLoading(true);
    try {
      const res = await fetch("/api/kasus");
      const data = await res.json();
      setKasusList(data);
    } catch (error) {
      console.error("Error fetching kasus:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKasus();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33]">
      {/* Soft Glow Effects */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500 opacity-15 blur-[180px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Daftar Kasus
          </h1>
          <p className="text-blue-200/80 text-lg">
            Lihat semua kasus yang terdaftar dalam sistem
          </p>
        </div>

        {/* Info Alert */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="relative overflow-hidden rounded-xl bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-200/90">
                  Anda dapat melihat semua data kasus. Untuk melaporkan kasus baru, silakan gunakan menu "Buat Laporan".
                </p>
              </div>
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
                Data Kasus Forensik
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
                  <p className="text-sm text-white/60">Data kasus akan ditampilkan di sini</p>
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
                          {k.tanggal_kejadian
                            ? new Date(k.tanggal_kejadian).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(k.status_kasus)}`}>
                            {getStatusLabel(k.status_kasus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/80 max-w-md">
                          <div className="line-clamp-2">
                            {k.ringkasan || "-"}
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function KasusPage() {
  return (
    <RequireRole role="user">
      <KasusPageInner />
    </RequireRole>
  );
}