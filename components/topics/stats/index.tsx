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
const CardStat = ({ title, value, rank }: CardStatProp) => {
  return (
    <Card className="w-32">
      <div className="flex w-full flex-row items-center justify-around rounded-t-lg bg-indigo-200 p-1 text-sm font-semibold dark:bg-indigo-500">
        <span>Topic Rank:</span>
        <span className="font-bold">{rank}</span>
      </div>
      <CardHeader className="flex flex-col items-center justify-center p-6">
        <CardDescription className="text-3xl font-bold text-black dark:text-white">
          {value}
        </CardDescription>

        <CardTitle className="text-center text-xs text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

interface CastStatProps {
  casts: any
  cursor: string
  topic: string
  mobileView: string
}

const TopicStats = ({ casts, cursor, topic, mobileView }: CastStatProps) => {
  const { castsToShow: castsWithUserInfo } = useFetchCastsUntilCovered(casts)
  const categories = categorizeArrayOfCasts(castsWithUserInfo) as Category[]

  let castsWithCategories = addCategoryFieldsToCasts(
    castsWithUserInfo,
    categories
  ) as Array<CastType>
  const topicRank = rankTopics(castsWithCategories, topic)

  const filteredCasts = filterCastsForCategory(castsWithCategories, topic)
  const topicStats = summarizeByCategory(filteredCasts, "likes")[0]
  const statsAndRankingsForTopic = { ...topicStats, ...topicRank }
  const generatedStats: any = generateStatsObjectForTopic(
    statsAndRankingsForTopic
  )

  return (
    <div
      className={`${
        mobileView !== "stats" ? "hidden" : "flex"
      } flex-wrap gap-4 pl-8 sm:flex sm:flex-wrap md:flex-row md:pl-0	 xl:flex xl:flex-row xl:flex-nowrap`}
    >
      {generatedStats && Object.keys(generatedStats).length
        ? Object.keys(generatedStats).map((stat: string) => (
            <CardStat
              title={generatedStats[stat].label}
              value={generatedStats[stat].value}
              rank={generatedStats[stat].rank}
              key={stat}
            />
          ))
        : null}
    </div>
  )
}

export default TopicStats
