"use client"

import { useMemo } from "react"

import { sortPostsByProperty } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import PostCard from "@/components/post"

interface TopCastsProps {
  posts: any[]
  cursor: string
  sortParam: string
  topic: string
  notionResults: any
}

const TopCasts = ({
  posts,
  cursor,
  topic,
  sortParam,
  notionResults,
}: TopCastsProps) => {
  let { filteredPosts } = useFilterFeed(posts, topic)
  const sortedPosts = useMemo(() => {
    return sortPostsByProperty(filteredPosts, "likesCount")
  }, [topic, filteredPosts])
  return (
    <>
      <div className="flex flex-col gap-y-2 overflow-y-auto lg:flex-row lg:gap-x-4 ">
        {sortedPosts.slice(0, 10).map((postItem: any, index: number) => (
          <>
            <PostCard
              renderEmbeds={true}
              post={postItem}
              asSingleRow={true}
              notionResults={notionResults}
            />
          </>
        ))}
      </div>
    </>
  )
}

export default TopCasts
