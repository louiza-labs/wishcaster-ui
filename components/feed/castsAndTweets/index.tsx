"use client"

import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"

import useFilterFeed from "@/hooks/feed/useFilterFeed"
import CastFeedSkeleton from "@/components/loading/feed/casts"
import PostCard from "@/components/post"

interface CastFeedProps {
  posts: any[]
  notionResults?: any[]
  topic?: string
  renderCardsAsSingleRow?: boolean
  postsPerPage?: number
}

const CastAndTweetsFeed: React.FC<CastFeedProps> = ({
  posts,
  notionResults,
  topic,
  renderCardsAsSingleRow = false,
  postsPerPage = 10,
}) => {
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const { ref, inView } = useInView()

  const searchParams = useSearchParams()
  const router = useRouter()

  const { filteredPosts } = useFilterFeed(posts, topic)

  const cardLayoutFromParams = searchParams.getAll("card-layout").join(",")

  const loadMorePosts = useCallback(() => {
    const nextPosts = filteredPosts.slice(0, currentPage * postsPerPage)
    setDisplayedPosts(nextPosts)
    setCurrentPage((prevPage) => prevPage + 1)
  }, [filteredPosts, currentPage, postsPerPage])

  useEffect(() => {
    loadMorePosts()
  }, [loadMorePosts])

  useEffect(() => {
    if (inView) {
      loadMorePosts()
    }
  }, [inView, loadMorePosts])

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const existingValues = params.getAll(name)

      if (addValue && !existingValues.includes(value)) {
        params.append(name, value)
      } else {
        params.delete(name)
        existingValues
          .filter((v) => v !== value)
          .forEach((v) => params.append(name, v))
      }

      return params.toString()
    },
    [searchParams]
  )

  const layoutValueIsSelected = useCallback(
    (categoryName: string) => cardLayoutFromParams.includes(categoryName),
    [cardLayoutFromParams]
  )

  const gridClassName = useMemo(() => {
    const baseClass =
      "mt-8 grid grid-cols-1 overflow-x-hidden lg:col-span-6 lg:col-start-4 lg:mt-0"
    if (layoutValueIsSelected("compact")) {
      return `${baseClass} gap-y-1 lg:grid-cols-1`
    }
    return `${baseClass} gap-4 px-2 md:px-4 lg:grid-cols-2 lg:px-10`
  }, [layoutValueIsSelected])

  const EmptyStateFallBack = () => (
    <div className="flex flex-col items-center justify-center py-2">
      <p className="text-center text-2xl font-light">
        No posts found, try adjusting the search terms or filters
      </p>
    </div>
  )

  return (
    <div className={gridClassName}>
      {displayedPosts.length === 0 && filteredPosts.length === 0 ? (
        <EmptyStateFallBack />
      ) : (
        <>
          {displayedPosts.map((post: any) => (
            <Fragment key={post.hash || post.id}>
              <PostCard
                renderEmbeds={true}
                post={post}
                asSingleRow={renderCardsAsSingleRow}
                notionResults={notionResults}
              />
            </Fragment>
          ))}
          {displayedPosts.length < filteredPosts.length && (
            <div ref={ref} className="h-10">
              <CastFeedSkeleton count={1} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CastAndTweetsFeed
