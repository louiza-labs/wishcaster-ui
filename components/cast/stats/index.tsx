"use client"

import {
  generateStatsFromProfiles,
  generateStatsObjectForCast,
  getRanking,
} from "@/lib/helpers"
import useGetProfiles from "@/hooks/farcaster/useGetProfiles"
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
    <Card className="size-fit">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{value}</CardDescription>
      </CardHeader>
    </Card>
  )
}

interface CastStatProps {
  cast: any
  overallChannelCasts: any
}

const CastStats = ({ cast, overallChannelCasts }: CastStatProps) => {
  const { filteredCasts: updatedCast } = useFilterFeed([cast])
  let castWithCategories = updatedCast[0] ?? cast
  const stringOfLikesFIDs =
    castWithCategories && castWithCategories.reactions
      ? castWithCategories.reactions.likes.reduce(
          (stringOfFIDs, reaction, index) => {
            if (index !== cast.reactions.likes.length - 1) {
              stringOfFIDs += `${reaction.fid},`
            } else {
              stringOfFIDs += `${reaction.fid}`
            }
            return stringOfFIDs
          },
          ""
        )
      : ""
  const stringOfRecastsFIDs =
    castWithCategories && castWithCategories.reactions
      ? castWithCategories.reactions.recasts.reduce(
          (stringOfFIDs, reaction, index) => {
            if (index !== castWithCategories.reactions.recasts.length - 1) {
              stringOfFIDs += `${reaction.fid},`
            } else {
              stringOfFIDs += `${reaction.fid}`
            }
            return stringOfFIDs
          },
          ""
        )
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

  const stats = generateStatsObjectForCast(
    castWithCategories,
    priorityLikes?.value ?? 0,
    channelRankByLikes ?? 0,
    categoryRankByLikes ?? 0
  )

  return (
    <div className="flex flex-wrap gap-4">
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
