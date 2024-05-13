"use client"

import { Suspense } from "react"

import { buildRankings } from "@/lib/helpers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RankedValueType = {
  name: string
  value: number
}

const Rankings = ({ casts }: any) => {
  const rankedTopicsByCount = buildRankings(casts, "category", "count", 3)
  const rankedTopicsByLikes = buildRankings(casts, "category", "likes_count", 3)
  const rankedTopicsByReplies = buildRankings(
    casts,
    "category",
    "replies_count",
    3
  )
  const rankedTopicsByRecasts = buildRankings(
    casts,
    "category",
    "recasts_count",
    3
  )

  const RankedValues = ({ values }: { values: RankedValueType[] }) => {
    return (
      <ol className="mt-4 gap-y-2">
        {values && Array.isArray(values)
          ? values.map((value: RankedValueType, index: number) => (
              <li className="flex flex-row items-center gap-x-2 text-lg font-semibold">
                <span>
                  {" "}
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : index + 1}
                </span>
                <span> {value.name}</span>
                <span> ({value.value})</span>
              </li>
            ))
          : null}
      </ol>
    )
  }

  return (
    <Suspense>
      <div className="sticky top-20 flex h-fit flex-col gap-y-6 lg:col-span-3">
        <h3 className="gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
          Trending
        </h3>
        <Tabs defaultValue="count" className="w-fit gap-y-2">
          <TabsList className="">
            <TabsTrigger value="count">Count</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="replies">Replies</TabsTrigger>
            <TabsTrigger value="recasts">Recasts</TabsTrigger>
          </TabsList>
          <TabsContent value="count">
            <RankedValues values={rankedTopicsByCount} />
          </TabsContent>
          <TabsContent value="likes">
            <RankedValues values={rankedTopicsByLikes} />
          </TabsContent>
          <TabsContent value="replies">
            <RankedValues values={rankedTopicsByReplies} />
          </TabsContent>
          <TabsContent value="recasts">
            <RankedValues values={rankedTopicsByRecasts} />
          </TabsContent>
        </Tabs>
      </div>
    </Suspense>
  )
}

export default Rankings
