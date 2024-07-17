"use client"

import { Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"

import { useLoadMoreCasts } from "@/hooks/farcaster/casts/useLoadMoreCasts"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import SprintItemCast from "@/components/cast/SprintItem"
import CastFeedSkeleton from "@/components/loading/feed/casts"

interface CastFeedProps {
  casts: CastType[]
  nextCursor: string
  timeFilterParam: any
  columns?: number
  notionResults?: any[]
  topic?: string
}

const CastsFeed: React.FC<CastFeedProps> = ({
  casts,
  nextCursor,
  timeFilterParam,
  columns,
  notionResults,
  topic,
}) => {
  const searchParams = useSearchParams()
  const { castsToShow, ref, fetchingCasts } = useLoadMoreCasts(
    casts,
    nextCursor,
    timeFilterParam
  )

  const { filteredCasts } = useFilterFeed(castsToShow, topic)

  const router = useRouter()
  const categoriesFromParams = searchParams.getAll("topics").join(",")

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      // Get existing category values
      const existingCategories = params.getAll(name)

      if (addValue) {
        // Add the new value if it's not already present
        if (!existingCategories.includes(value)) {
          params.append(name, value)
        }
      } else {
        // Remove the value if it exists
        const updatedCategories = existingCategories.filter(
          (category) => category !== value
        )

        // Update the parameter with the filtered categories
        params.delete(name)
        updatedCategories.forEach((category) => {
          params.append(name, category)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  const badgeIsToggled = (categoryName: string) => {
    return (
      (categoryName &&
        categoriesFromParams &&
        categoriesFromParams.includes(categoryName)) === true
    )
  }

  const handleToggleCategoryClick = (categoryName: string) => {
    if (categoriesFromParams && categoriesFromParams.length > 0) {
      // Check if the category is already toggled
      const isToggled = categoriesFromParams.includes(categoryName)

      // Toggle the category based on its current state
      const newSearchParams = createQueryString(
        "topics",
        categoryName,
        !isToggled
      )

      router.push("?" + newSearchParams)
    } else {
      // If no categories are selected, simply toggle the clicked category
      router.push("?" + createQueryString("topics", categoryName, true))
    }
  }

  const EmptyStateFallBack = () => (
    <div className="flex flex-col items-center justify-center py-2">
      <p className="text-center text-2xl font-light">
        No casts found, try adjusting the search terms or filters
      </p>
    </div>
  )

  return (
    <Suspense fallback={<CastFeedSkeleton count={5} />}>
      <div
        className={`mt-8 grid grid-cols-1 gap-4 overflow-x-hidden px-2 md:px-4 lg:col-span-6 lg:col-start-4 lg:mt-0 ${
          columns ? `lg:grid-cols-2` : "lg:grid-cols-2"
        } lg:px-10`}
      >
        {fetchingCasts && !(filteredCasts && filteredCasts.length) ? (
          <div
            className={
              columns
                ? "col-span-2 mt-10 flex w-full gap-x-10  lg:flex-row lg:justify-center"
                : "flex flex-col "
            }
          >
            {columns ? (
              <div className="hidden lg:block">
                {" "}
                <CastFeedSkeleton count={4} />{" "}
              </div>
            ) : null}
            <CastFeedSkeleton count={4} />
          </div>
        ) : filteredCasts && filteredCasts.length ? (
          filteredCasts.map((cast: CastType) => (
            <SprintItemCast
              key={cast.hash}
              text={cast.text}
              cast={cast}
              timestamp={cast.timestamp}
              parent_url={cast.parent_url}
              reactions={cast.reactions}
              replies={cast.replies}
              embeds={cast.embeds}
              tagline={cast.tagline}
              author={cast.author}
              hash={cast.hash}
              thread_hash={cast.thread_hash}
              mentionedProfiles={cast.mentioned_profiles}
              parent_hash={cast.parent_hash}
              parent_author={cast.parent_author}
              root_parent_url={cast.root_parent_url}
              category={cast.category}
              notionResults={notionResults}
              handleToggleCategoryClick={() =>
                handleToggleCategoryClick(cast.category?.id || "")
              }
              badgeIsToggled={badgeIsToggled(cast.category?.id || "")}
            />
          ))
        ) : (
          <EmptyStateFallBack />
        )}
        <div ref={ref}></div>
      </div>
    </Suspense>
  )
}

export default CastsFeed
