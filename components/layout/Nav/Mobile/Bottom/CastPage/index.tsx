"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const CastPageNavItem = ({ section }: { section: string }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const filtersFromParams = useMemo(
    () => searchParams.getAll("view"),
    [searchParams]
  )
  const viewOptions = ["stats", "cast", "replies", "build"]

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existedFilters = params.getAll(name)

      if (addValue) {
        if (!existedFilters.includes(value)) {
          // check if the new filter is a date value
          if (viewOptions.includes(value)) {
            // filter out any existing date filters
            const updatedFilters = existedFilters.filter(
              (filter) => !viewOptions.includes(filter)
            )
            params.delete(name)
            updatedFilters.forEach((filter) => {
              params.append(name, filter)
            })
          }
          params.append(name, value)
        }
      } else {
        const updatedCategories = existedFilters.filter(
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

  const filterIsSelected = useCallback(
    (categoryName: string) => {
      return filtersFromParams.includes(categoryName)
    },
    [filtersFromParams]
  )

  const selectedViewFilter =
    filtersFromParams.find((filter) => viewOptions.includes(filter)) ?? ""

  const handleToggleFilterClick = useCallback(
    (categoryName: string) => {
      const isToggled = filtersFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "view",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    },
    [filtersFromParams, createQueryString, router]
  )

  const handleStatsViewClick = () => {
    handleToggleFilterClick("stats")
  }
  const handleRepliesViewClick = () => {
    handleToggleFilterClick("replies")
  }
  const handleTeamViewClick = () => {
    handleToggleFilterClick("build")
  }
  const handleCastViewClick = () => {
    handleToggleFilterClick("cast")
  }
  if (section === "stats") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button variant={"ghost"} onClick={handleStatsViewClick}>
            <Icons.TrendingUp
              className={filterIsSelected("stats") ? " font-bold" : ""}
            />
          </Button>
          <p
            className={
              filterIsSelected("stats")
                ? "text-xs font-bold"
                : "text-xs font-medium"
            }
          >
            Cast Stats
          </p>
        </div>
      </Suspense>
    )
  } else if (section === "build") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button variant={"ghost"} onClick={handleTeamViewClick}>
            <Icons.Rocket
              className={filterIsSelected("build") ? " font-bold" : ""}
            />
          </Button>
          <p
            className={
              filterIsSelected("build")
                ? "text-xs font-bold"
                : "text-xs font-medium"
            }
          >
            Build
          </p>
        </div>
      </Suspense>
    )
  } else if (section === "cast") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button variant={"ghost"} onClick={handleCastViewClick}>
            <Icons.Scroll
              className={filterIsSelected("cast") ? "font-bold" : ""}
            />
          </Button>
          <p
            className={
              filterIsSelected("cast") || filtersFromParams.length === 0
                ? "text-xs font-bold"
                : "text-xs font-medium"
            }
          >
            Cast
          </p>
        </div>
      </Suspense>
    )
  } else if (section === "replies") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button variant={"ghost"} onClick={handleRepliesViewClick}>
            <Icons.replies
              className={filterIsSelected("replies") ? " font-bold" : ""}
            />
          </Button>
          <p className="text-xs font-medium">Top Replies</p>
        </div>
      </Suspense>
    )
  }
}

export default CastPageNavItem
