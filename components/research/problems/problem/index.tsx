"use client"

import { useState } from "react"

import { Card } from "@/components/ui/card"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VsdgvOkcxK8
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

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
    <Card className="grid w-full max-w-md gap-6 p-6">
      <div className="flex items-center gap-4">
        {/* <div className="flex items-center justify-center rounded-md bg-primary p-3">
          <ReplyIcon className="size-6 text-primary-foreground" />
        </div> */}
        <h3 className="text-base font-semibold">{problemTitle}</h3>
      </div>
      <div className="grid gap-4">
        <div className="text-sm text-muted-foreground">
          {problemDescription}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: Icons.likes,
              count: problemMetrics ? problemMetrics.totalLikes : 0,
              noun: "Like",
            },
            {
              icon: Icons.recasts,
              count: problemMetrics ? problemMetrics.totalRecasts : 0,
              noun: "Repost",
            },
            {
              icon: Icons.replies,
              count: problemMetrics ? problemMetrics.totalReplies : 0,
              noun: "Reply",
            },
            //  { icon: Icons.boxes, count: problemMetrics, noun: "count" },
          ].map(({ icon: Icon, count, noun }) => (
            <div className="grid gap-2 rounded-md bg-muted p-3">
              <div className="text-sm font-medium">
                {count !== 1 && noun !== "Count"
                  ? noun === "Reply"
                    ? `Replies`
                    : `${noun}s`
                  : noun}
              </div>
              <div className="text-lg font-bold">{count}</div>
              {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUpIcon className="h-4 w-4" />
            <span>+15%</span>
          </div> */}
            </div>
          ))}
          {problemSentiment && (
            <div className="grid gap-2 rounded-md bg-muted p-3">
              Sentiment:{" "}
              <span
                className={`font-semibold ${getSentimentClass(
                  problemSentiment
                )}`}
              >
                {problemSentiment}
              </span>
            </div>
          )}
        </div>
        {/* <div className="flex justify-end">
          <Link
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            View Feedback
          </Link>
        </div> */}
      </div>
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
