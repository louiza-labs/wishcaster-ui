"use client"

import { Suspense, useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { NormalizedPostType } from "@/types"

import { buildRankings, summarizeByCategory } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import PopularTopicCard from "@/components/topics/popular"
import TopicsTable from "@/components/topics/table"

type RankedValueType = {
  name: string
  value: number
}

interface TopicsProps {
  posts: NormalizedPostType[]
  mobileView: string | undefined
  notionResults: any
}

const Topics = ({ posts, mobileView, notionResults }: TopicsProps) => {
  let { filteredPosts } = useFilterFeed(posts)
  const sortedTopics = summarizeByCategory(filteredPosts, "likes")
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleToggleCategoryClick = useCallback(
    (topic: string) => {
      router.push(`/topics/${topic}`)
    },
    [, router]
  )

  const handleFilterSourceChange = (
    source: "hide-twitter" | "hide-farcaster" | "clear"
  ) => {
    const currentParams = new URLSearchParams(searchParams.toString())

    if (source === "clear") {
      currentParams.delete("source")
    } else {
      if (currentParams.get("source") === source) {
        currentParams.delete("source")
      } else {
        currentParams.set("source", source)
      }
    }

    const query = currentParams.toString()
    const path = `${pathname}${query ? `?${query}` : ""}`

    router.push(path)
  }
  const filtersFromParams = useMemo(
    () => searchParams.getAll("source"),
    [searchParams]
  )

  const isSourceFilterSelected = useCallback(
    (filterName: "hide-twitter" | "hide-farcaster") => {
      return filtersFromParams.includes(filterName)
    },
    [searchParams]
  )

  filteredPosts = useMemo(() => {
    if (isSourceFilterSelected("hide-twitter")) {
      return filteredPosts.filter((cast: any) => cast.object === "cast")
    } else if (isSourceFilterSelected("hide-farcaster")) {
      return filteredPosts.filter((cast: any) => !(cast.object === "cast"))
    } else {
      return filteredPosts
    }
  }, [searchParams])

  // const rankedTopicsByCount = buildRankings(
  //   filteredPosts,
  //   "category",
  //   "count",
  //   5
  // )
  const rankedTopicsByLikes = buildRankings(
    filteredPosts,
    "category",
    "likesCount",
    5
  )
  const rankedTopicsByReplies = buildRankings(
    filteredPosts,
    "category",
    "commentsCount",
    3
  )
  const rankedTopicsByRecasts = buildRankings(
    filteredPosts,
    "category",
    "sharesCount",
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

  return (
    <Suspense>
      {hasResults ? (
        <div className="  flex flex-col items-center gap-y-6 lg:items-start">
          <div className="flex flex-col lg:flex-row lg:gap-x-2">
            <h3 className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:block md:text-3xl">
              Most popular product topics 🔥
            </h3>
            {/* <div className="flex flex-row items-center gap-x-2">
              <Button
                variant={
                  !isSourceFilterSelected("hide-farcaster")
                    ? "secondary"
                    : "ghost"
                }
                onClick={() => handleFilterSourceChange("hide-farcaster")}
                className={`${
                  isSourceFilterSelected("hide-farcaster")
                    ? "font-light"
                    : "font-semibold"
                } rounded-full `}
              >
                Farcaster
              </Button>
              /
              <Button
                variant={
                  !isSourceFilterSelected("hide-twitter")
                    ? "secondary"
                    : "ghost"
                }
                onClick={() => handleFilterSourceChange("hide-twitter")}
                className={`${
                  isSourceFilterSelected("hide-twitter")
                    ? "font-light"
                    : "font-semibold"
                } rounded-full`}
              >
                Twitter
              </Button>
            </div> */}
          </div>

          {mobileView !== "table" ? (
            <>
              <div className="w-full flex-col items-center justify-around gap-y-2 md:hidden ">
                {sortedTopics.slice(0, 20).map((topic, index) => (
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
              <div className="hidden w-full flex-col items-center justify-around gap-y-2 overflow-auto overflow-x-scroll xl:flex xl:flex-row xl:gap-x-2 xl:gap-y-0">
                {sortedTopics.slice(0, 4).map((topic, index) => (
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
          ) : null}
          {mobileView === "popular" ? null : (
            <TopicsTable
              topicsData={filteredPosts}
              mobileView={mobileView}
              handleRowClick={handleToggleCategoryClick}
            />
          )}
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
