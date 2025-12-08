// ============================================
// FILE 3: RecentActivityList.tsx
// Path: src/components/recent-activity.tsx
// ============================================
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock, Activity } from "lucide-react";

type Kasus = {
  id: number;
  jenis_kasus: string;
  tanggal_kejadian: string | null;
};

type SeverityType = "high" | "warning" | "success";

export default function RecentActivityList() {
  const [activities, setActivities] = useState<Kasus[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchKasus() {
    try {
      const res = await fetch("/api/kasus");
      const data: Kasus[] = await res.json();

      data.sort((a, b) => {
        const dateA = a.tanggal_kejadian ? new Date(a.tanggal_kejadian).getTime() : 0;
        const dateB = b.tanggal_kejadian ? new Date(b.tanggal_kejadian).getTime() : 0;
        return dateB - dateA;
      });

      setActivities(data.slice(0, 5)); // Only show 5 recent activities
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKasus();
  }, []);

  function getSeverity(jenis: string): SeverityType {
    const lower = jenis.toLowerCase();
    if (lower.includes("malware") || lower.includes("ransomware")) return "high";
    if (lower.includes("phishing") || lower.includes("penipuan")) return "warning";
    if (lower.includes("login") || lower.includes("akses") || lower.includes("peretasan")) return "high";
    return "success";
  }

  function getIcon(severity: SeverityType) {
    switch (severity) {
      case "high": return AlertCircle;
      case "warning": return Clock;
      default: return CheckCircle;
    }
  }

  function getSeverityStyles(severity: SeverityType) {
    switch (severity) {
      case "high":
        return {
          bg: "bg-red-500/20",
          text: "text-red-400",
          border: "border-red-500/30"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/30"
        };
      default:
        return {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-500/30"
        };
    }
  }

  function getSeverityLabel(severity: SeverityType): string {
    switch (severity) {
      case "high": return "Tinggi";
      case "warning": return "Sedang";
      default: return "Normal";
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d1b36]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      {/* Glossy highlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Daftar Kasus</h3>
          </div>
          <p className="text-sm text-white/60">Daftar Kasus Terbaru</p>
        </div>

        {/* Activities List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-white/30 mb-3" />
            <p className="text-sm text-white/60">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const severity = getSeverity(activity.jenis_kasus);
              const Icon = getIcon(severity);
              const styles = getSeverityStyles(severity);
              const label = getSeverityLabel(severity);

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 group hover:bg-white/5 p-3 rounded-lg transition-all duration-200"
                >
                  <div className={`p-2.5 rounded-lg ${styles.bg} ${styles.text} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {activity.jenis_kasus}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-white/40" />
                      <p className="text-white/50 text-xs">
                        {activity.tanggal_kejadian
                          ? new Date(activity.tanggal_kejadian).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : "Tidak ada tanggal"}
                      </p>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <div className={`px-2 py-1 rounded text-xs font-medium ${styles.bg} ${styles.text} border ${styles.border}`}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Link */}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <a 
              href="/admin/kasus" 
              className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 group"
            >
              Lihat Semua Aktivitas
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}