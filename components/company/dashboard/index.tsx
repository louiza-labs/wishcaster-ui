"use client"

import { useEffect, useState } from "react"

import { generateAiInsight } from "@/lib/ai-insights"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { AiActionPlanCard } from "./AiActionPlanCard"
import { EngagementOverviewCard } from "./EngagementOverviewCard"
import { SocialMonitoringCard } from "./SocialMonitoringCard"
import { TopKeywordsCard } from "./TopKeywordsCard"

export default function Dashboard() {
  const [aiInsight, setAiInsight] = useState("")
  const [trackedKeywords, setTrackedKeywords] = useState<string[]>([])

  useEffect(() => {
    setAiInsight(generateAiInsight())
    // Simulate fetching tracked keywords
    setTrackedKeywords([
      "SEO",
      "Content Marketing",
      "Social Media",
      "PPC",
      "Analytics",
    ])
  }, [])

  return (
    <div className="container mx-auto min-h-screen max-w-7xl rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-4xl font-bold text-slate-800">
          Company Dashboard
        </h1>
        <Badge variant="outline" className="gap-x-2 px-4 py-2 ">
          Goal: <span className="font-bold">Grow Sales</span>
        </Badge>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {trackedKeywords.map((keyword, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {keyword}
          </Badge>
        ))}
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-3">
        <TopKeywordsCard className="md:col-span-2" />
        <EngagementOverviewCard />
      </div>

      <AiActionPlanCard
        aiInsight={aiInsight}
        onRefresh={() => setAiInsight(generateAiInsight())}
      />

      <SocialMonitoringCard />

      <div className="text-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
          onClick={() => (window.location.href = "/schedule-demo")}
        >
          Schedule a Demo to Unlock Full Potential
        </Button>
      </div>
    </div>
  )
}
