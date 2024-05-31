"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

import { buildRankings, summarizeByCategory } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import PopularTopicCard from "@/components/topics/popular"
import TopicsTable from "@/components/topics/table"

type RankedValueType = {
  name: string
  value: number
}

const Topics = ({ casts }: any) => {
  const { filteredCasts } = useFilterFeed(casts)
  const sortedTopics = summarizeByCategory(filteredCasts, "likes")
  const router = useRouter()

  const handleToggleCategoryClick = useCallback(
    (topic: string) => {
      router.push(`/topics/${topic}`)
    },
    [, router]
  )

  // const rankedTopicsByCount = buildRankings(
  //   filteredCasts,
  //   "category",
  //   "count",
  //   5
  // )
  const rankedTopicsByLikes = buildRankings(
    filteredCasts,
    "category",
    "likes_count",
    5
  )
  const rankedTopicsByReplies = buildRankings(
    filteredCasts,
    "category",
    "replies_count",
    3
  )
  const rankedTopicsByRecasts = buildRankings(
    filteredCasts,
    "category",
    "recasts_count",
    3
  )
  const hasResults = useMemo(() => {
    return (
      // (rankedTopicsByCount && rankedTopicsByCount.length) ||
      (rankedTopicsByLikes && rankedTopicsByLikes.length) ||
      (rankedTopicsByReplies && rankedTopicsByReplies.length) ||
      (rankedTopicsByRecasts && rankedTopicsByRecasts.length)
    )
  }, [
    // rankedTopicsByCount,
    rankedTopicsByLikes,
    rankedTopicsByRecasts,
    rankedTopicsByReplies,
  ])
  console.log("the filteredCasts", filteredCasts)

  return (
    <Suspense>
      {hasResults ? (
        <div className="  flex  flex-col gap-y-6">
          <h3 className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:block md:text-3xl">
            Most popular
          </h3>
          <>
            <div className="flex-col items-center justify-around gap-x-2 md:hidden xl:flex xl:flex-row">
              {sortedTopics.slice(0, 5).map((topic, index) => (
                <PopularTopicCard
                  name={topic.topic}
                  description={topic.topic}
                  likes={topic.likes}
                  id={topic.id}
                  recasts={topic.recasts}
                  replies={topic.replies}
                  avgFollowers={topic.averageFollowerCount}
                  count={topic.count}
                  powerBadges={topic.priorityLikes}
                  handleClick={handleToggleCategoryClick}
                  key={topic.topic}
                  rank={index + 1}
                />
              ))}
              {/*  */}
            </div>
            <div className="hidden flex-row items-center justify-around gap-x-2 lg:flex xl:hidden">
              {sortedTopics.slice(0, 4).map((topic, index) => (
                <PopularTopicCard
                  name={topic.topic}
                  description={topic.topic}
                  likes={topic.likes}
                  recasts={topic.recasts}
                  replies={topic.replies}
                  avgFollowers={topic.averageFollowerCount}
                  count={topic.count}
                  powerBadges={topic.priorityLikes}
                  handleClick={handleToggleCategoryClick}
                  key={topic.topic}
                  id={topic.id}
                  rank={index + 1}
                />
              ))}
              {/*  */}
            </div>
            <div className="hidden flex-row items-center justify-around gap-x-2 md:flex lg:hidden">
              {sortedTopics.slice(0, 3).map((topic, index) => (
                <PopularTopicCard
                  name={topic.topic}
                  description={topic.topic}
                  likes={topic.likes}
                  recasts={topic.recasts}
                  replies={topic.replies}
                  avgFollowers={topic.averageFollowerCount}
                  count={topic.count}
                  powerBadges={topic.priorityLikes}
                  handleClick={handleToggleCategoryClick}
                  key={topic.topic}
                  id={topic.id}
                  rank={index + 1}
                />
              ))}
              {/*  */}
            </div>
          </>
          <TopicsTable
            topicsData={filteredCasts}
            handleRowClick={handleToggleCategoryClick}
          />
        </div>
      ) : (
        <div className="flex flex-col  gap-y-2">
          <p className="gap-x-2 text-center text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
            Unable to generate topics
          </p>
          <p className="gap-x-2 text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
            This error is showing because no casts are available, try clearing
            some filters{" "}
          </p>
        </div>
      )}
    </Suspense>
  )
}

export default Topics
