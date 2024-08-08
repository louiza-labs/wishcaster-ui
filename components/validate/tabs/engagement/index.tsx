"use client"

import React from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EngagementStatsProps {
  rawStats: any
}

const engagementStatReference = {
  likes: "Likes",
  priorityLikes: "Priority Likes",
  recasts: "Reposts",
  replies: "Replies",
  count: "Post Count",
  impressions: "X Impressions",
  bookmarks: "X Bookmarks",
  totalFollowers: "Followers of Users",
  averageFollowerCount: "Avg Followers of Users",
}

const Engagement = ({ rawStats }: EngagementStatsProps) => {
  // Statistical Cards: Display total counts for likes, recasts, replies, bookmarks, impressions.
  // Pie Chart: Show the distribution of interaction types (likes, priority likes, recasts, replies, bookmarks).
  // Bar Chart: Depict the average follower count per post to gauge the influence level associated with each interaction.

  const CardStat: React.FC<any> = ({ title, value }) => {
    return (
      <Card className="w-50 col-span-1 flex snap-start flex-col items-center md:w-32">
        {/* <Badge
          variant={"secondary"}
          className="m-2 mb-0 flex flex-row items-center justify-center gap-x-1"
        >
        </Badge> */}
        <CardHeader className="flex w-full flex-col items-center justify-center p-4">
          <CardDescription className="text-3xl font-bold text-black dark:text-white">
            {value.toLocaleString()}
          </CardDescription>
          <CardTitle className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }
  return (
    <div className="flex w-full flex-wrap justify-around gap-2">
      {Object.keys(rawStats)
        .filter(
          (stat) =>
            stat !== "averageFollowerCount" &&
            stat !== "totalFollowers" &&
            stat !== "bookmarks"
        )
        .map((stat) => (
          <CardStat
            title={engagementStatReference[stat] ?? stat}
            value={rawStats[stat]}
            key={stat}
          />
        ))}
    </div>
  )
}

export default Engagement
