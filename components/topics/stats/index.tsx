"use client"

import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  filterCastsForCategory,
  generateStatsObjectForTopic,
  rankTopics,
  summarizeByCategory,
} from "@/lib/helpers"
import { useFetchCastsUntilCovered } from "@/hooks/farcaster/useFetchCastsUntilCovered"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardStatProp {
  title: string
  value: number
  rank: number
}

const CardStat: React.FC<CardStatProp> = ({ title, value, rank }) => {
  return (
    <Card className="w-50 flex snap-start flex-col items-center md:w-32">
      <Badge
        variant={"secondary"}
        className="m-2 mb-0 flex flex-row items-center justify-center gap-x-1"
      >
        <span className=""> Rank:</span>
        <span className="font-bold">{rank}</span>
      </Badge>
      <CardHeader className="flex w-full flex-col items-center justify-center p-4">
        <CardDescription className="text-3xl font-bold text-black dark:text-white">
          {value}
        </CardDescription>
        <CardTitle className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

interface CastStatProps {
  casts: CastType[]
  cursor: string
  topic: string
  mobileView: string
}

const TopicStats: React.FC<CastStatProps> = ({ casts, topic }) => {
  const { castsToShow: castsWithUserInfo } = useFetchCastsUntilCovered(casts)
  const categories = categorizeArrayOfCasts(castsWithUserInfo) as Category[]

  const castsWithCategories = addCategoryFieldsToCasts(
    castsWithUserInfo,
    categories
  ) as CastType[]
  const topicRank = rankTopics(castsWithCategories, topic)

  const filteredCasts = filterCastsForCategory(castsWithCategories, topic)
  const topicStats = summarizeByCategory(filteredCasts, "likes")[0]
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
