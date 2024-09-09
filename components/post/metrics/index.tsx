"use client"

import { useMemo } from "react"
import { MessageCircle, Repeat } from "lucide-react"
import { useTheme } from "next-themes"

import { Icons } from "@/components/icons"

interface NormalizedMetric {
  label: string
  value: string | number
}

function normalizeMetrics({
  likes,
  retweets,
  replies,
  impressions,
  priorityScore,
  engagementRate,
}: {
  likes?: number
  retweets?: number
  replies?: number
  impressions?: number

  priorityScore?: number | string
  engagementRate?: number | string
}): NormalizedMetric[] {
  const metrics: NormalizedMetric[] = []

  if (likes !== undefined) {
    metrics.push({ label: "Likes", value: likes })
  }
  if (retweets !== undefined) {
    metrics.push({ label: "Reposts", value: retweets })
  }
  if (replies !== undefined) {
    metrics.push({ label: "Replies", value: replies })
  }
  if (impressions !== undefined) {
    metrics.push({ label: "Impressions", value: impressions })
  }

  // if (priorityScore !== undefined) {
  //   metrics.push({ label: "Priority Score", value: priorityScore })
  // }
  // if (engagementRate !== undefined) {
  //   metrics.push({ label: "Engagement", value: engagementRate })
  // }

  // Filter out any null values in case some metrics are conditionally added
  return metrics.filter((metric): metric is NormalizedMetric => metric !== null)
}

interface MetricsProps {
  likes?: number
  retweets?: number
  replies?: number
  impressions?: number
  renderOnCard?: boolean
  reactions?: {
    likes_count: number
    recasts_count: number
    bookmark_count?: number
  }
  priorityScore?: number | string
  engagementRate?: number | string
  showImpressions: boolean
}

const PostMetrics = ({
  likes,
  retweets,
  replies,
  impressions,
  priorityScore,
  engagementRate,
  showImpressions,
  renderOnCard,
}: MetricsProps) => {
  const metrics = normalizeMetrics({
    likes,
    retweets,
    replies,
    impressions,
    priorityScore,
    engagementRate,
  })
  const { theme } = useTheme()
  const isDarkMode = useMemo(() => {
    return theme === "dark"
  }, [theme])

  const filteredMetrics = showImpressions
    ? metrics
    : metrics.filter((metrics) => metrics.label.toLowerCase() !== "impressions")

  const iconMap: any = {
    Likes: Icons.likes,
    Reposts: Repeat,
    Replies: MessageCircle,
    //    Impressions: Icons., // Add this if you have an impressions icon
    //  }
  }

  return (
    <div
      className={`${
        renderOnCard
          ? " flex flex-row items-center justify-around gap-4 pl-2 lg:justify-start lg:pl-0"
          : "grid grid-cols-3 gap-4"
      }  text-gray-600`}
    >
      {filteredMetrics.map((metric, index) => {
        const Icon = iconMap[metric.label] // Get the corresponding icon

        return (
          <div key={index} className="flex flex-row items-center gap-x-2">
            <Icon
              className={`size-1 text-xs dark:text-white lg:size-4 lg:text-base`}
            />
            <span className="text-xs font-semibold dark:text-white lg:text-sm xl:text-sm">
              {metric.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default PostMetrics
