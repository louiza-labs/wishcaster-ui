"use client"

import {
  generateStatsFromProfiles,
  generateStatsObjectForCast,
  getRanking,
} from "@/lib/helpers"
import useGetProfiles from "@/hooks/farcaster/profiles/useGetProfiles"
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

interface CastStatProps {
  cast: any
  overallChannelCasts: any
  reactions: any
}

const CastStats = ({ cast, overallChannelCasts, reactions }: CastStatProps) => {
  const { filteredPosts: updatedCast } = useFilterFeed([cast])
  const { likes, recasts } = reactions
  let castWithCategories = updatedCast[0] ?? cast
  const stringOfLikesFIDs =
    likes && likes.length
      ? likes.reduce((stringOfFIDs: string, reaction: any, index: number) => {
          if (index !== likes.length - 1) {
            stringOfFIDs += `${reaction.user.fid},`
          } else {
            stringOfFIDs += `${reaction.user.fid}`
          }
          return stringOfFIDs
        }, "")
      : ""
  const stringOfRecastsFIDs =
    recasts && recasts.length
      ? recasts.reduce((stringOfFIDs: string, reaction: any, index: number) => {
          if (index !== recasts.length - 1) {
            stringOfFIDs += `${reaction.user.fid},`
          } else {
            stringOfFIDs += `${reaction.user.fid}`
          }
          return stringOfFIDs
        }, "")
      : ""

  const { profiles: likedUsers } = useGetProfiles(stringOfLikesFIDs)
  const { profiles: recastedUsers } = useGetProfiles(stringOfRecastsFIDs)
  const priorityLikes = generateStatsFromProfiles(
    likedUsers,
    cast,
    "priority_likes"
  )
  const channelRankByLikes = getRanking(cast, overallChannelCasts, "likes")
  const categoryRankByLikes = getRanking(
    cast,
    overallChannelCasts,
    "likes",
    "category"
  )

  const stats: any = generateStatsObjectForCast(
    castWithCategories,
    priorityLikes?.value ?? 0,
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

export default CastStats
