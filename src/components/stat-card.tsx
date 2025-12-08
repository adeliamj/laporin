import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

export default function StatCard({ title, value,  icon }: StatCardProps) {
  const bgColor = "bg-slate-900"

  return (
    <Card className={`${bgColor} border-slate-800 shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-900/50 rounded-lg text-blue-400">{icon}</div>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  )
}

