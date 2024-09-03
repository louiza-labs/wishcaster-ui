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
    <Card className="col-span-1 flex w-24 flex-col items-center justify-center border p-4 px-2 shadow-lg lg:w-36">
      <Badge
        variant="default"
        className="text-xxs mb-2 bg-primary px-2 py-1 text-primary-foreground lg:text-sm"
      >
        Rank #{rank}
      </Badge>
      <CardHeader className="py-2 text-center">
        <CardDescription className="text-xl font-bold text-primary">
          {formatNumber(value)}
        </CardDescription>
        <CardTitle className="mt-2 text-xs text-muted-foreground">
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
  overallPosts: any[]
}

const TopicStats: React.FC<CastStatProps> = ({
  posts,
  topic,
  categories,
  overallPosts,
}) => {
  const topicRank = rankTopics(overallPosts, undefined, topic)

  const filteredPostsAndTweets = filterCastsForCategory(posts, topic)
  const topicStats = summarizeByCategory(filteredPostsAndTweets, "likes")[0]
  const statsAndRankingsForTopic = { ...topicStats, ...topicRank }

  const generatedStats: any = generateStatsObjectForTopic(
    statsAndRankingsForTopic
  )

  return (
    <div className="relative col-span-12  w-full  px-4 sm:px-0">
      {/* <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:hidden xl:grid-cols-3">
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
      </div> */}
      <div className="flex w-full flex-row  items-center justify-between gap-2 overflow-x-scroll  lg:flex">
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
