import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Shield } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Malware detected and quarantined",
    time: "2 minutes ago",
    severity: "high",
    icon: AlertCircle,
  },
  {
    id: 2,
    title: "System backup completed successfully",
    time: "45 minutes ago",
    severity: "success",
    icon: CheckCircle,
  },
  {
    id: 3,
    title: "Suspicious login attempt blocked",
    time: "1 hour ago",
    severity: "high",
    icon: Shield,
  },
  {
    id: 4,
    title: "Database integrity check passed",
    time: "2 hours ago",
    severity: "success",
    icon: CheckCircle,
  },
  {
    id: 5,
    title: "Scheduled maintenance pending",
    time: "3 hours ago",
    severity: "warning",
    icon: Clock,
  },
]

export default function RecentActivityList() {
  return (
    <Card className="bg-slate-900 border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-slate-400">Latest system events and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            const severityColor =
              activity.severity === "high"
                ? "text-red-400"
                : activity.severity === "success"
                  ? "text-emerald-400"
                  : "text-yellow-400"

            return (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0">
                <div className={`p-2 rounded-lg bg-slate-800 ${severityColor} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{activity.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
