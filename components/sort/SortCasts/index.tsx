"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { SortGroup } from "@/components/sort/SortGroup"

const SortCasts = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const sortingValueFromParams = useMemo(
    () => searchParams.getAll("sort"),
    [searchParams]
  )

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existingSortValue = params.getAll(name)

      if (addValue) {
        if (!existingSortValue.includes(value)) {
          params.set(name, value)
        }
      } else {
        const updatedCategories = existingSortValue.filter(
          (category) => category !== value
        )
        params.delete(name)
        updatedCategories.forEach((filter) => {
          params.append(name, filter)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  const sortValueIsSelected = useCallback(
    (categoryName: string) => {
      return sortingValueFromParams.includes(categoryName)
    },
    [sortingValueFromParams]
  )

  const handleToggleSortClick = useCallback(
    (categoryName: string) => {
      const isToggled = sortingValueFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "sort",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    },
    [sortingValueFromParams, createQueryString, router]
  )

  const handleSortByLikesChange = () => {
    handleToggleSortClick("likes_count")
  }
  const handleSortByRepliesChange = () => {
    handleToggleSortClick("replies")
  }
  const handleSortByRecastsChange = () => {
    handleToggleSortClick("recasts_count")
  }
  const handleSortByChange = (value: string) => {
    handleToggleSortClick(value)
  }

  const sortingValuesAndHandlers = [
    {
      label: "Likes",
      value: "likes_count",
      handleChange: handleSortByLikesChange,
    },
    {
      label: "Replies",
      value: "replies",
      handleChange: handleSortByRepliesChange,
    },
    {
      label: "Recasts",
      value: "recasts_count",
      handleChange: handleSortByRecastsChange,
    },
  ]

  return (
    <Suspense>
      <div className=" flex h-fit flex-col gap-y-6 lg:col-span-12">
        <p className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:block md:text-3xl">
          Sort
        </p>
        <div className="flex flex-col items-center gap-y-8 md:flex-row md:gap-x-4 md:gap-y-0">
          <SortGroup
            arrayOfSortByValueObjects={sortingValuesAndHandlers}
            handleChange={handleSortByChange}
            value={sortingValueFromParams[0]}
          />
          {sortingValueFromParams[0] ? (
            <>
              {" "}
              <Button
                variant={"ghost"}
                size={"sm"}
                className="hidden md:block"
                onClick={() => handleSortByChange(sortingValueFromParams[0])}
              >
                Clear
              </Button>
              <Button
                variant={"destructive"}
                size={"sm"}
                className="w-full md:hidden"
                onClick={() => handleSortByChange(sortingValueFromParams[0])}
              >
                Clear
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Suspense>
  )
}

export default SortCasts
