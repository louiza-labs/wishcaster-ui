"use client"

import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useBoundStore } from "@/store"
import { Cast as CastType } from "@/types"

import Filters from "@/components/filters"
import SortCasts from "@/components/sort/SortCasts"

interface FilterBarProps {
  initialCasts: CastType[]
  posts: any[]
}
const FilterBar = ({ initialCasts, posts }: FilterBarProps) => {
  const loadTweetsToStore = useBoundStore((state: any) => state.setTweets)
  const loadCastsToStore = useBoundStore((state: any) => state.setCasts)
  const tweetsFromStore = useBoundStore((state: any) => state.tweets)
  const castsFromStore = useBoundStore((state: any) => state.casts)

  useEffect(() => {
    if (
      posts &&
      Array.isArray(posts) &&
      tweetsFromStore.length === 0 &&
      castsFromStore.length === 0
    ) {
      let tweets = posts.filter((post) => post.object === undefined)
      let casts = posts.filter((post) => post.object === "cast")
      loadCastsToStore(casts)
      loadTweetsToStore(tweets)
    }
  }, [posts, tweetsFromStore, castsFromStore])

  const path = usePathname()
  const isOnTopicpage = useMemo(() => {
    return path && path.includes("topics")
  }, [path])
  const barText = isOnTopicpage ? "Filter" : "Sort & Filter"
  return (
    <div className="oveflow-x-scroll xl:h-18 sticky top-0   flex w-full flex-row items-center justify-center gap-x-4 overflow-auto border-b bg-background p-2 lg:h-fit xl:justify-start xl:px-20">
      {<SortCasts asFilterBar={true} />}
      <Filters initialCasts={initialCasts} asFilterBar={true} />
    </div>
  )
}

export default FilterBar
