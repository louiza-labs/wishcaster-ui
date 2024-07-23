"use client"

import { generateStatsObjectForTweet, getTweetRanking } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardStatProp {
  title: string
  value: number
}
const CardStat = ({ title, value }: CardStatProp) => {
  return (
    <Card className="w-32 lg:w-24 2xl:w-32">
      <CardHeader className="flex flex-col items-center justify-center p-6 lg:p-4 2xl:p-6">
        <CardDescription className="text-4xl font-bold text-black dark:text-white lg:text-2xl 2xl:text-4xl">
          {value}
        </CardDescription>

        <CardTitle className="text-center text-xs text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

interface TweetStatsProps {
  tweet: any
  overallTweets: any
  overallCasts: any
  likes: number
}

const TweetStats = ({
  tweet,
  overallTweets,
  overallCasts,
  likes,
}: TweetStatsProps) => {
  const { filteredPosts: updatedCast } = useFilterFeed([tweet])
  let castWithCategories = updatedCast[0] ?? tweet

  // const { profiles: likedUsers } = useGetProfiles(stringOfLikesFIDs)
  // const { profiles: recastedUsers } = useGetProfiles(stringOfRecastsFIDs)
  // const priorityLikes = generateStatsFromProfiles(
  //   likedUsers,
  //   cast,
  //   "priority_likes"
  // )
  const channelRankByLikes = getTweetRanking(tweet, overallTweets, "likes")
  const categoryRankByLikes = getTweetRanking(
    tweet,
    [...overallTweets, ...overallCasts],
    "likes",
    "category"
  )

  const stats: any = generateStatsObjectForTweet(
    castWithCategories,
    likes ?? 0,
    channelRankByLikes ?? 0,
    categoryRankByLikes ?? 0
  )

  return (
    <div className="grid grid-cols-2 gap-4 pl-8 sm:flex sm:flex-wrap md:pl-0	 xl:grid xl:grid-cols-2 xl:flex-nowrap">
      {stats && Object.keys(stats).length
        ? Object.keys(stats).map((stat: string) => (
            <CardStat
              title={stats[stat].label}
              value={stats[stat].value}
              key={stat}
            />
          ))
        : null}
    </div>
  )
}

export default TweetStats
