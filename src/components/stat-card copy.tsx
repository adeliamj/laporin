import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
}

export default function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-blue-400"
  const bgColor = "bg-slate-900"

  return (
    <Card className={`${bgColor} border-slate-800 shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-900/50 rounded-lg text-blue-400">{icon}</div>
          <div className={`flex items-center gap-1 ${trendColor} text-sm font-semibold`}>
            {trend === "up" && <TrendingUp className="w-4 h-4" />}
            {trend === "down" && <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  )
}
