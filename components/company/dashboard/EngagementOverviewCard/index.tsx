import { Eye, MessageCircle, ThumbsUp, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EngagementOverviewCard() {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Engagement Overview
        </CardTitle>
        <Eye className="size-5 text-slate-600" />
      </CardHeader>
      <CardContent>
        <EngagementStats />
      </CardContent>
    </Card>
  )
}

function EngagementStats() {
  const stats = [
    {
      label: "Mentions",
      value: "1.2K",
      icon: MessageCircle,
      color: "text-indigo-500",
    },
    { label: "Likes", value: "3.7K", icon: ThumbsUp, color: "text-green-500" },
    {
      label: "New Followers",
      value: "982",
      icon: Users,
      color: "text-amber-500",
    },
  ]

  return (
    <div className="mt-4 space-y-2">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className={`mr-2 size-4 ${color}`} />
            <span className="text-sm font-medium text-slate-600">{label}</span>
          </div>
          <span className="text-lg font-bold text-slate-800">{value}</span>
        </div>
      ))}
    </div>
  )
}
