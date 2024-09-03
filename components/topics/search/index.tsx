"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NormalizedPostType } from "@/types"

import { buildRankings, summarizeByCategory } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import PopularTopicCard from "@/components/topics/popular"

type RankedValueType = {
  name: string
  value: number
}

interface TopicsProps {
  posts: NormalizedPostType[]
  notionResults: any
}

const TopicSearchResults = ({ posts, notionResults }: TopicsProps) => {
  let { filteredPosts } = useFilterFeed(posts)
  const sortedTopics = summarizeByCategory(filteredPosts, "likes")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sourceToHide, setSourceToHide] = useState("")

  const handleToggleCategoryClick = useCallback(
    (topic: string) => {
      router.push(`/topics/${topic}`)
    },
    [, router]
  )

  const handleFilterSourceChange = (
    source: "twitter" | "farcaster" | "clear"
  ) => {
    if (sourceToHide === source) setSourceToHide("")
    else setSourceToHide(source)
  }

  filteredPosts = useMemo(() => {
    if (sourceToHide === "twitter") {
      return filteredPosts.filter((cast: any) => cast.object === "cast")
    } else if (sourceToHide === "farcaster") {
      return filteredPosts.filter((cast: any) => !(cast.object === "cast"))
    } else {
      return filteredPosts
    }
  }, [sourceToHide])

  // const rankedTopicsByCount = buildRankings(
  //   filteredPosts,
  //   "category",
  //   "count",
  //   5
  // )
  const rankedTopicsByLikes = useMemo(() => {
    return buildRankings(filteredPosts, "category", "likesCount", 5)
  }, [filteredPosts])
  const rankedTopicsByReplies = useMemo(() => {
    return buildRankings(filteredPosts, "category", "commentsCount", 3)
  }, [filteredPosts])
  const rankedTopicsByRecasts = useMemo(() => {
    return buildRankings(filteredPosts, "category", "sharesCount", 3)
  }, [filteredPosts])
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

  return (
    <Suspense>
      {hasResults ? (
        <div className="  flex flex-col items-center gap-y-6 lg:items-start">
          <div className="w-full flex-col items-center justify-around gap-y-2 md:hidden ">
            {sortedTopics.map((topic, index) => (
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
          <div className="hidden w-full flex-col items-center justify-around gap-y-2 xl:flex xl:flex-row xl:gap-x-2 xl:gap-y-0">
            {sortedTopics.map((topic, index) => (
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
            {sortedTopics.map((topic, index) => (
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
            {sortedTopics.map((topic, index) => (
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
        </div>
      ) : (
        <div className="flex flex-col items-center lg:ml-[25vw]">
          <div className="flex flex-col items-center  gap-y-2">
            <p className="gap-x-2 text-center text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
              Unable to generate topics
            </p>
            <p className="gap-x-2 text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
              This error is showing because no casts are available, try clearing
              some filters{" "}
            </p>
          </div>
        </div>
      )}
    </Suspense>
  )
}

export default TopicSearchResults
