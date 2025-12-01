"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const lineData = [
  { time: "00:00", threats: 12, cases: 45 },
  { time: "04:00", threats: 8, cases: 52 },
  { time: "08:00", threats: 15, cases: 48 },
  { time: "12:00", threats: 10, cases: 61 },
  { time: "16:00", threats: 18, cases: 55 },
  { time: "20:00", threats: 6, cases: 67 },
  { time: "24:00", threats: 3, cases: 70 },
]

const barData = [
  { category: "Malware", value: 34 },
  { category: "Phishing", value: 28 },
  { category: "DoS", value: 15 },
  { category: "SQL Inj", value: 22 },
  { category: "XSS", value: 18 },
]

export default function AnalyticsChart() {
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Analytics Overview</CardTitle>
        <CardDescription className="text-slate-400">Real-time system monitoring and threat detection</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="threats" className="w-full">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="threats" className="text-slate-400 data-[state=active]:text-white">
              Threats Timeline
            </TabsTrigger>
            <TabsTrigger value="threats-type" className="text-slate-400 data-[state=active]:text-white">
              Threat Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threats" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
                <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="threats-type" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
