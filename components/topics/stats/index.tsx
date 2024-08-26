"use client"

import { Cast as CastType } from "@/types"

import {
  filterCastsForCategory,
  generateStatsObjectForTopic,
  rankTopics,
  summarizeByCategory,
} from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardStatProps {
  title: string
  value: number
  rank: number
}

const CardStat: React.FC<CardStatProps> = ({ title, value, rank }) => {
  return (
    <Card className="flex w-52 max-w-xs flex-col items-center border-none bg-gradient-to-br from-primary/10 to-secondary/10 p-4 shadow-lg">
      <Badge
        variant="default"
        className="mb-2 bg-primary px-2 py-1 text-primary-foreground"
      >
        Rank #{rank}
      </Badge>
      <CardHeader className="text-center">
        <CardDescription className="text-4xl font-bold text-primary">
          {formatNumber(value)}
        </CardDescription>
        <CardTitle className="mt-2 text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B"
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M"
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K"
  } else {
    return value.toString()
  }
}

interface CastStatProps {
  posts: CastType[]
  categories: any[]
  cursor: string
  topic: string
  mobileView: string
}

const TopicStats: React.FC<CastStatProps> = ({ posts, topic, categories }) => {
  const topicRank = rankTopics(posts, topic)

  const filteredPostsAndTweets = filterCastsForCategory(posts, topic)
  const topicStats = summarizeByCategory(filteredPostsAndTweets, "likes")[0]
  const statsAndRankingsForTopic = { ...topicStats, ...topicRank }
  const generatedStats: any = generateStatsObjectForTopic(
    statsAndRankingsForTopic
  )

  return (
    <div className="w-full overflow-x-auto px-4 sm:px-0">
      <div className="flex snap-x snap-mandatory flex-row flex-nowrap gap-4 overflow-x-auto pl-8 md:pl-0">
        {generatedStats && Object.keys(generatedStats).length
          ? Object.keys(generatedStats).map((stat) => (
              <CardStat
                key={stat}
                title={generatedStats[stat].label}
                value={generatedStats[stat].value}
                rank={generatedStats[stat].rank}
              />
            ))
          : null}
      </div>
    </div>
  )
}

export default TopicStats
