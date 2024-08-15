"use client"

import { useState } from "react"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ProblemCardProps {
  problemTitle: string
  problemDescription: string
  problemMetrics?: {
    totalLikes: number
    totalRecasts: number
    totalReplies: number
    totalBookmarks: number
    totalImpressions: number
  }
  problemSentiment?: string
}

export default function ProblemCard({
  problemDescription,
  problemMetrics,
  problemSentiment,
  problemTitle,
}: ProblemCardProps) {
  const [toggleDesription, setToggleDescription] = useState(false)
  return (
    <Card className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border-none p-4 shadow-xl">
      <div className="m-2 flex items-center justify-center gap-4">
        <h3 className="break-all text-base font-medium">{problemTitle}</h3>
      </div>
      <div className="flex w-full flex-col items-center">
        {problemMetrics && (
          <div className="mt-4 flex w-full flex-row flex-wrap justify-around gap-x-2 px-10">
            {[
              {
                icon: Icons.likes,
                count: problemMetrics.totalLikes,
                noun: "like",
              },
              {
                icon: Icons.recasts,
                count: problemMetrics.totalRecasts,
                noun: "repost",
              },
              {
                icon: Icons.replies,
                count: problemMetrics.totalReplies,
                noun: "reply",
              },
              //  { icon: Icons.boxes, count: problemMetrics, noun: "count" },
            ].map(({ icon: Icon, count, noun }) => (
              <div
                key={noun}
                className="col-span-1 flex items-center gap-x-2 text-sm"
              >
                <Icon className="size-2 text-gray-700" />
                <div className="flex flex-col items-start">
                  <p className="text-xs font-medium">
                    {count.toLocaleString()}
                  </p>
                  <p className="text-xs">
                    {count !== 1 && noun !== "count"
                      ? noun === "reply"
                        ? `replies`
                        : `${noun}s`
                      : noun}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* {problemSentiment && (
        <div className="mt-4 text-sm">
          Sentiment:{" "}
          <span
            className={`font-semibold ${getSentimentClass(problemSentiment)}`}
          >
            {problemSentiment}
          </span>
        </div>
      )} */}
    </Card>
  )
}

interface MetricItemProps {
  label: string
  value: number
}

function MetricItem({ label, value }: MetricItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}

function getSentimentClass(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return "text-green-500"
    case "neutral":
      return "text-yellow-500"
    case "negative":
      return "text-red-500"
    default:
      return "text-muted-foreground"
  }
}
