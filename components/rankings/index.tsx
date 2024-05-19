"use client"

import { Suspense, useMemo } from "react"

import { buildRankings } from "@/lib/helpers"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RankedValueType = {
  name: string
  value: number
}

const Rankings = ({ casts }: any) => {
  const rankedTopicsByCount = buildRankings(casts, "category", "count", 5)
  const rankedTopicsByLikes = buildRankings(casts, "category", "likes_count", 5)
  const rankedTopicsByReplies = buildRankings(
    casts,
    "category",
    "replies_count",
    5
  )
  const rankedTopicsByRecasts = buildRankings(
    casts,
    "category",
    "recasts_count",
    5
  )
  const hasResults = useMemo(() => {
    return (
      (rankedTopicsByCount && rankedTopicsByCount.length) ||
      (rankedTopicsByLikes && rankedTopicsByLikes.length) ||
      (rankedTopicsByReplies && rankedTopicsByReplies.length) ||
      (rankedTopicsByRecasts && rankedTopicsByRecasts.length)
    )
  }, [
    rankedTopicsByCount,
    rankedTopicsByLikes,
    rankedTopicsByRecasts,
    rankedTopicsByReplies,
  ])

  const RankedCard = ({ value, index }: any) => {
    return (
      <Card className="my-2">
        <CardHeader>
          <CardDescription>{value.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{value.value}</p>
        </CardContent>
      </Card>
    )
  }

  const RankedValues = ({ values }: { values: RankedValueType[] }) => {
    return (
      <ol className="mt-4 gap-y-4">
        {values && Array.isArray(values)
          ? values.map((value: RankedValueType, index: number) => (
              <RankedCard value={value} index={index + 1} key={index} />
            ))
          : null}
      </ol>
    )
  }

  const valueFormatter = (number: number) =>
    `$ ${Intl.NumberFormat("us").format(number).toString()}`

  return (
    <Suspense>
      {hasResults ? (
        <div className=" flex h-fit flex-col gap-y-6 lg:col-span-3">
          <h3 className="gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
            Trending Topics
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
      ) : (
        <h3 className="gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
          Error getting Topics
        </h3>
      )}
    </Suspense>
  )
}

export default Rankings
