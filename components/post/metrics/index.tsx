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
}: MetricsProps) => {
  const metrics = normalizeMetrics({
    likes,
    retweets,
    replies,
    impressions,
    priorityScore,
    engagementRate,
  })

  const filteredMetrics = showImpressions
    ? metrics
    : metrics.filter((metrics) => metrics.label.toLowerCase() !== "impressions")

  return (
    <div className="grid grid-cols-3 gap-4 text-gray-600">
      {filteredMetrics.map((metric, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="text-lg font-semibold">{metric.value}</span>
          <span className="text-xs">{metric.label}</span>
        </div>
      ))}
    </div>
  )
}

export default PostMetrics
