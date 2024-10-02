"use client"

import { MessageCircle, Repeat } from "lucide-react"
import { useTheme } from "next-themes"

import { Icons } from "@/components/icons"

// Add this utility function at the top of the file
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}

interface Metric {
  label: string
  value: string | number
}

interface MetricsProps {
  likes?: number
  retweets?: number
  replies?: number
  impressions?: number
  renderOnCard?: boolean
  showImpressions: boolean
}

const normalizeMetrics = ({
  likes,
  retweets,
  replies,
  impressions,
}: Omit<MetricsProps, "renderOnCard" | "showImpressions">): Metric[] => {
  const metrics: Metric[] = []

  if (likes !== undefined)
    metrics.push({ label: "Likes", value: formatNumber(likes) })
  if (retweets !== undefined)
    metrics.push({ label: "Reposts", value: formatNumber(retweets) })
  if (replies !== undefined)
    metrics.push({ label: "Replies", value: formatNumber(replies) })
  if (impressions !== undefined)
    metrics.push({ label: "Impressions", value: formatNumber(impressions) })

  return metrics
}

const PostMetrics: React.FC<MetricsProps> = ({
  likes,
  retweets,
  replies,
  impressions,
  showImpressions,
  renderOnCard,
}) => {
  const metrics = normalizeMetrics({ likes, retweets, replies, impressions })
  const { theme } = useTheme()

  const filteredMetrics = showImpressions
    ? metrics
    : metrics.filter((metric) => metric.label.toLowerCase() !== "impressions")

  const iconMap: Record<string, React.ComponentType<any>> = {
    Likes: Icons.likes,
    Reposts: Repeat,
    Replies: MessageCircle,
    Impressions: Icons.impressions,
  }

  return (
    <div
      className={`${
        renderOnCard
          ? "flex flex-row items-center justify-around gap-4 pl-2 lg:justify-start lg:pl-0"
          : "grid grid-cols-3 gap-4"
      } text-gray-600`}
    >
      {filteredMetrics.map((metric, index) => {
        const Icon = iconMap[metric.label] || Icons.info

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
