"use client"

import { Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"

import { useLoadMoreCasts } from "@/hooks/farcaster/useLoadMoreCasts"
import Cast from "@/components/cast"

interface CastFeedProps {
  casts: CastType[]
  nextCursor: string
}

const CastFeed = ({ casts, nextCursor }: CastFeedProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { castsToShow, ref } = useLoadMoreCasts(casts, nextCursor)

  const categoriesFromParams = searchParams.getAll("categories").join(",")

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
        "categories",
        categoryName,
        !isToggled
      )

      router.push("?" + newSearchParams)
    } else {
      // If no categories are selected, simply toggle the clicked category
      router.push("?" + createQueryString("categories", categoryName, true))
    }
  }

  return (
    <Suspense>
      <div className="grid grid-cols-1 gap-4 px-4 lg:col-span-6 lg:col-start-4 lg:grid-cols-1 lg:px-10">
        {castsToShow && castsToShow.length
          ? castsToShow.map((cast: CastType) => (
              <Cast
                key={cast.hash}
                text={cast.text}
                timestamp={cast.timestamp}
                parent_url={cast.parent_url}
                reactions={cast.reactions}
                replies={cast.replies}
                embeds={cast.embeds}
                author={cast.author}
                hash={cast.hash}
                thread_hash={cast.thread_hash}
                parent_hash={cast.parent_hash}
                parent_author={cast.parent_author}
                mentioned_profiles={cast.mentioned_profiles}
                root_parent_url={cast.root_parent_url}
                category={cast.category}
                handleToggleCategoryClick={handleToggleCategoryClick}
                badgeIsToggled={badgeIsToggled(
                  cast.category ? cast.category : ""
                )}
              />
            ))
          : null}
        <div ref={ref}></div>
      </div>
    </Suspense>
  )
}

export default CastFeed
