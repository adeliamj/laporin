// ============================================
// FILE 1: DashboardPage.tsx - Main Dashboard (TypeScript Fixed)
// ============================================
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Users, FileText, Activity, Package, ClipboardList, ArrowRight, Plus, Eye, Mail } from "lucide-react";
import AnalyticsChart from "@/components/analytics-chart";
import RecentActivityList from "@/components/recent-activity";

type Stats = {
  totalKorban: number;
  totalKasus: number;
  totalBarangBukti: number;
  totalTindakan: number;
};

type ColorType = "blue" | "purple" | "green" | "orange";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: ColorType;
}

interface QuickAccessCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: ColorType;
}

function StatCard({ title, value, icon, color = "blue" }: StatCardProps) {
  const colorClasses: Record<ColorType, string> = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    green: "from-green-500/20 to-green-600/20 border-green-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30"
  };

  const iconColorClasses: Record<ColorType, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    orange: "text-orange-400"
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0d1b36]/60 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-white/5 ${iconColorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <h3 className="text-sm font-medium text-white/60 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function QuickAccessCard({ href, title, description, icon, color = "blue" }: QuickAccessCardProps) {
  type ColorStyles = {
    bg: string;
    border: string;
    hoverBorder: string;
    iconBg: string;
    iconText: string;
    hoverIconBg: string;
    titleHover: string;
  };

  const colorClasses: Record<ColorType, ColorStyles> = {
    blue: {
      bg: "from-blue-500/10 to-blue-600/10",
      border: "border-blue-500/30",
      hoverBorder: "hover:border-blue-400/60",
      iconBg: "bg-blue-500/20",
      iconText: "text-blue-400",
      hoverIconBg: "group-hover:bg-blue-500/30",
      titleHover: "group-hover:text-blue-400"
    },
    purple: {
      bg: "from-purple-500/10 to-purple-600/10",
      border: "border-purple-500/30",
      hoverBorder: "hover:border-purple-400/60",
      iconBg: "bg-purple-500/20",
      iconText: "text-purple-400",
      hoverIconBg: "group-hover:bg-purple-500/30",
      titleHover: "group-hover:text-purple-400"
    },
    green: {
      bg: "from-green-500/10 to-green-600/10",
      border: "border-green-500/30",
      hoverBorder: "hover:border-green-400/60",
      iconBg: "bg-green-500/20",
      iconText: "text-green-400",
      hoverIconBg: "group-hover:bg-green-500/30",
      titleHover: "group-hover:text-green-400"
    },
    orange: {
      bg: "from-orange-500/10 to-orange-600/10",
      border: "border-orange-500/30",
      hoverBorder: "hover:border-orange-400/60",
      iconBg: "bg-orange-500/20",
      iconText: "text-orange-400",
      hoverIconBg: "group-hover:bg-orange-500/30",
      titleHover: "group-hover:text-orange-400"
    }
  };

  const colors = colorClasses[color];

  return (
    <Link href={href} className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center gap-4">
        <div className={`p-4 ${colors.iconBg} ${colors.hoverIconBg} rounded-xl transition-all duration-300`}>
          <div className={colors.iconText}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-bold text-white mb-1 ${colors.titleHover} transition-colors duration-300`}>
            {title}
          </h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
        
        <ArrowRight className={`w-6 h-6 text-white/40 ${colors.iconText} group-hover:translate-x-1 transition-all duration-300`} />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const [stats, setStats] = useState<Stats>({
    totalKorban: 0,
    totalKasus: 0,
    totalBarangBukti: 0,
    totalTindakan: 0,
  });
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [korbanRes, kasusRes, bbRes, tindakanRes, timelineRes] = await Promise.all([
          fetch("/api/korban"),
          fetch("/api/kasus"),
          fetch("/api/barang-bukti"),
          fetch("/api/tindakan"),
          fetch("/api/stats/timeline").catch(() => ({ json: () => Promise.resolve([]) })),
        ]);

        const [korban, kasus, bb, tindakan, timelineData] = await Promise.all([
          korbanRes.json(),
          kasusRes.json(),
          bbRes.json(),
          tindakanRes.json(),
          timelineRes.json(),
        ]);

        setStats({
          totalKorban: korban.length || 0,
          totalKasus: kasus.length || 0,
          totalBarangBukti: bb.length || 0,
          totalTindakan: tindakan.length || 0,
        });
        
        setTimeline(timelineData || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (role === "admin") {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33]">
      {/* Soft Glow Effects */}
      <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500 opacity-15 blur-[180px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-blue-500/30 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative">
              <p className="text-blue-300 text-sm font-medium mb-2">{greeting}, {session?.user?.name}</p>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard Forensik Digital</h1>
              <p className="text-blue-200/80">Monitor dan analisis aktivitas sistem secara real-time</p>
            </div>
          </div>
        </div>

        {/* Admin Dashboard */}
        {role === "admin" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <StatCard 
                title="Total Korban" 
                value={stats.totalKorban} 
                icon={<Users className="w-6 h-6" />}
                color="blue"
              />
              <StatCard 
                title="Total Kasus" 
                value={stats.totalKasus} 
                icon={<FileText className="w-6 h-6" />}
                color="purple"
              />
              <StatCard 
                title="Barang Bukti" 
                value={stats.totalBarangBukti} 
                icon={<Package className="w-6 h-6" />}
                color="green"
              />
              <StatCard 
                title="Tindakan Forensik" 
                value={stats.totalTindakan} 
                icon={<ClipboardList className="w-6 h-6" />}
                color="orange"
              />
            </div>

            {/* Analytics & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
              <div className="lg:col-span-2">
                <AnalyticsChart stats={stats} timeline={timeline} />
              </div>
              <div className="lg:col-span-1">
                <RecentActivityList />
              </div>
            </div>

            {/* Quick Access */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Akses Cepat</h2>
                <p className="text-blue-200/70">Kelola data sistem dengan mudah</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickAccessCard
                  href="/admin/korban"
                  title="Kelola Korban"
                  description="Data korban kasus"
                  icon={<Users className="w-8 h-8" />}
                  color="blue"
                />
                <QuickAccessCard
                  href="/admin/kasus"
                  title="Kelola Kasus"
                  description="Daftar kasus forensik"
                  icon={<FileText className="w-8 h-8" />}
                  color="purple"
                />
                <QuickAccessCard
                  href="/admin/barang-bukti"
                  title="Barang Bukti"
                  description="Kelola barang bukti"
                  icon={<Package className="w-8 h-8" />}
                  color="green"
                />
                <QuickAccessCard
                  href="/admin/tindakan"
                  title="Tindakan Forensik"
                  description="Log tindakan"
                  icon={<ClipboardList className="w-8 h-8" />}
                  color="orange"
                />
              </div>
            </div>

            {/* Tips Card */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="relative overflow-hidden rounded-xl bg-[#0d1b36]/60 backdrop-blur-xl border border-white/10 p-6">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
                </div>
                
                <div className="relative flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Tips Pengelolaan</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Pastikan data barang bukti dan tindakan forensik selalu ter-update untuk menjaga integritas investigasi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Dashboard */}
        {role === "user" && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-blue-500/30 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-2">Butuh Bantuan?</h2>
                  <p className="text-blue-200/80 mb-6">
                    Laporkan kasus forensik digital Anda kepada kami. Tim kami siap membantu.
                  </p>
                  <Link
                    href="/user/lapor"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-6 h-6" />
                    Buat Laporan Baru
                  </Link>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <Link href="/user/lapor/kasus" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400/60 p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all">
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                      Lihat Daftar Kasus
                    </h3>
                    <p className="text-sm text-white/70">
                      Akses untuk melihat data kasus yang ada
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl flex-shrink-0">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Perlu Akses Lebih?
                    </h3>
                    <p className="text-sm text-white/70 mb-3">
                      Hubungi administrator untuk upgrade
                    </p>
                    <a href="mailto:admin@forensik.id" className="inline-flex items-center gap-2 text-sm text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                      <Mail className="w-4 h-4" />
                      admin@forensik.id
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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