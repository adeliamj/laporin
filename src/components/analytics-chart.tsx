/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================
// FILE 2: AnalyticsChart.tsx
// Path: src/components/analytics-chart.tsx
// ============================================
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

type TimelineData = {
  time: string;
  cases: number;
  threats: number;
};

type AnalyticsChartProps = {
  stats: any;
  timeline: any[];
};

export default function AnalyticsChart({ stats, timeline }: AnalyticsChartProps) {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch("/api/stats/timeline");
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          time: item.date,
          cases: item.cases,
          threats: item.cases,
        }));

        setTimelineData(formatted);
      } catch (err) {
        console.error("Error fetching timeline:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

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
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Analisis Statistik Kasus</h3>
          </div>
          <p className="text-sm text-white/60">Real-time system monitoring</p>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <svg className="animate-spin h-10 w-10 text-blue-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6, fill: "#60a5fa" }}
                  fill="url(#colorCases)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-white/70">Kasus</span>
          </div>
        </div>
      </div>
    </div>
  );
}