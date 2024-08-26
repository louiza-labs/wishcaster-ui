"use client"

import { useEffect } from "react"
import { useBoundStore } from "@/store"

import CategoriesFeed from "@/components/feed/categories"
import MobileSourceFilters from "@/components/filters/Sources/new/mobile"
import MobileUserFilters from "@/components/filters/User/new/mobile"

interface FilterBarProps {
  categories: any[]
  posts: any[]
}
const FilterBar = ({ categories, posts }: FilterBarProps) => {
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

  return (
    <div className="xl:h-18 scroll-snap-x sticky top-0 flex min-w-full  flex-row items-center justify-center gap-x-4 overflow-auto overflow-x-scroll border-b bg-background p-2 px-4 lg:h-fit xl:justify-start xl:px-20">
      <MobileSourceFilters />

      <MobileUserFilters />
      {/* <MobileDateFilters /> */}

      <CategoriesFeed categories={categories} asFilterBar={true} />
    </div>
  )
}

export default FilterBar
