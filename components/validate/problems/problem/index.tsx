import { Card } from "@/components/ui/card"

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
  return (
    <Card className="grid w-full max-w-md gap-4 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <h3 className="text-lg font-semibold">{problemTitle}</h3>
      </div>
      <div className="text-sm text-muted-foreground">{problemDescription}</div>
      {problemMetrics && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <MetricItem label="Likes" value={problemMetrics.totalLikes} />
          <MetricItem
            label="Recasts/Retweets"
            value={problemMetrics.totalRecasts}
          />
          <MetricItem label="Replies" value={problemMetrics.totalReplies} />
          <MetricItem label="Bookmarks" value={problemMetrics.totalBookmarks} />
          <MetricItem
            label="Impressions"
            value={problemMetrics.totalImpressions}
          />
        </div>
      )}
      {problemSentiment && (
        <div className="mt-4 text-sm">
          Sentiment:{" "}
          <span
            className={`font-semibold ${getSentimentClass(problemSentiment)}`}
          >
            {problemSentiment}
          </span>
        </div>
      )}
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
