"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import StatCard from "@/components/stat-card"
import { AlertCircle, Users, FileText, Activity } from "lucide-react"
import AnalyticsChart from "@/components/analytics-chart"
import RecentActivityList from "@/components/recent-activity"

type Stats = {
  totalKorban: number;
  totalKasus: number;
  totalBarangBukti: number;
  totalTindakan: number;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const [stats, setStats] = useState<Stats>({
    totalKorban: 0,
    totalKasus: 0,
    totalBarangBukti: 0,
    totalTindakan: 0,
  });
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
        const [korbanRes, kasusRes, bbRes, tindakanRes] = await Promise.all([
          fetch("/api/korban"),
          fetch("/api/kasus"),
          fetch("/api/barang-bukti"),
          fetch("/api/tindakan"),
        ]);

        const [korban, kasus, bb, tindakan] = await Promise.all([
          korbanRes.json(),
          kasusRes.json(),
          bbRes.json(),
          tindakanRes.json(),
        ]);

        setStats({
          totalKorban: korban.length || 0,
          totalKasus: kasus.length || 0,
          totalBarangBukti: bb.length || 0,
          totalTindakan: tindakan.length || 0,
        });
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
     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-2xl border border-blue-700 overflow-hidden mb-8">
          <div className="p-8">
            <p className="text-blue-200 text-sm font-medium mb-2">Welcome back, {session?.user?.name}</p>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Forensik Digital</h1>
            <p className="text-blue-200">Monitor dan analisis aktivitas sistem secara real-time</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Cases" value="24" change="+12%" trend="up" icon={<FileText className="w-5 h-5" />} />
          <StatCard
            title="Active Threats"
            value="3"
            change="-5%"
            trend="down"
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <StatCard title="Team Members" value="12" change="+2" trend="up" icon={<Users className="w-5 h-5" />} />
          <StatCard
            title="System Status"
            value="100%"
            change="Healthy"
            trend="stable"
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <div className="lg:col-span-1">
            <RecentActivityList />
          </div>
        </div>
        
        {/* Admin Dashboard */}
        {role === "admin" && (
          <div className="space-y-8">
            {/* Statistics */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Statistik Sistem</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Korban */}
                <div className="bg-white rounded-xl shadow-md border-2 border-blue-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-slate-600 text-sm font-semibold mb-2">Total Korban</h3>
                  {loading ? (
                    <div className="h-9 w-20 bg-slate-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-4xl font-bold text-slate-800">{stats.totalKorban}</p>
                  )}
                </div>

                {/* Kasus */}
                <div className="bg-white rounded-xl shadow-md border-2 border-purple-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-slate-600 text-sm font-semibold mb-2">Total Kasus</h3>
                  {loading ? (
                    <div className="h-9 w-20 bg-slate-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-4xl font-bold text-slate-800">{stats.totalKasus}</p>
                  )}
                </div>

                {/* Barang Bukti */}
                <div className="bg-white rounded-xl shadow-md border-2 border-green-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-slate-600 text-sm font-semibold mb-2">Barang Bukti</h3>
                  {loading ? (
                    <div className="h-9 w-20 bg-slate-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-4xl font-bold text-slate-800">{stats.totalBarangBukti}</p>
                  )}
                </div>

                {/* Tindakan */}
                <div className="bg-white rounded-xl shadow-md border-2 border-orange-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-slate-600 text-sm font-semibold mb-2">Tindakan Forensik</h3>
                  {loading ? (
                    <div className="h-9 w-20 bg-slate-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-4xl font-bold text-slate-800">{stats.totalTindakan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Akses Cepat</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/korban" className="group bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-500 transition-all">
                      <svg className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">
                        Kelola Korban
                      </h3>
                      <p className="text-sm text-slate-500">Data korban kasus</p>
                    </div>
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link href="/admin/kasus" className="group bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-xl group-hover:bg-purple-500 transition-all">
                      <svg className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-1">
                        Kelola Kasus
                      </h3>
                      <p className="text-sm text-slate-500">Daftar kasus forensik</p>
                    </div>
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link href="/admin/barang-bukti" className="group bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-xl hover:border-green-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-xl group-hover:bg-green-500 transition-all">
                      <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors mb-1">
                        Barang Bukti
                      </h3>
                      <p className="text-sm text-slate-500">Kelola barang bukti</p>
                    </div>
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link href="/admin/tindakan" className="group bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-xl hover:border-orange-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-orange-100 rounded-xl group-hover:bg-orange-500 transition-all">
                      <svg className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors mb-1">
                        Tindakan Forensik
                      </h3>
                      <p className="text-sm text-slate-500">Log tindakan</p>
                    </div>
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* User Dashboard */}
        {role === "user" && (
          <div className="space-y-6">
            {/* Hero Card dengan Tombol Laporan */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-blue-100">
                <h2 className="text-2xl font-bold mb-2">Butuh Bantuan?</h2>
                <p className="text-blue-100 mb-6">
                  Laporkan kasus forensik digital Anda kepada kami. Tim kami siap membantu.
                </p>
                <Link
                  href="/user/lapor"
                  className="inline-flex items-center gap-3 px-8 py-4 text-blue-100 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Buat Laporan Baru
                </Link>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lihat Kasus */}
              <Link href="/user/kasus" className="group bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-500 transition-all">
                    <svg className="w-8 h-8 text-blue-100 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                      Lihat Daftar Kasus
                    </h3>
                    <p className="text-sm text-slate-600">
                      Akses read-only untuk melihat data kasus yang ada
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Info Help */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md border-2 border-amber-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500 rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      Perlu Akses Lebih?
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Hubungi administrator untuk upgrade ke akses penuh
                    </p>
                    <a href="mailto:admin@forensik.id" className="text-sm text-amber-600 font-semibold hover:text-amber-700">
                      admin@forensik.id →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}