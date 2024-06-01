"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const TopicPageNavItem = ({ section }: { section: string }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const filtersFromParams = useMemo(
    () => searchParams.getAll("view"),
    [searchParams]
  )
  const viewOptions = ["stats", "popular", "build", "feed"]

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

  const handlePopularViewClick = () => {
    handleToggleFilterClick("popular")
  }
  const handleStatsViewClick = () => {
    handleToggleFilterClick("stats")
  }
  const handleFeedViewClick = () => {
    handleToggleFilterClick("feed")
  }
  const handleBuildViewClick = () => {
    handleToggleFilterClick("build")
  }

  if (section === "popular") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button
            variant={"ghost"}
            className=""
            onClick={handlePopularViewClick}
            className=" px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <div className="flex flex-col items-center gap-y-1">
              <Icons.TrendingUp
                className={
                  filterIsSelected("stats") ? " font-bold" : "col-start-1"
                }
              />
              <p
                className={
                  filterIsSelected("popular")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              >
                Top Casts
              </p>
            </div>
          </Button>
        </div>
      </Suspense>
    )
  } else if (section === "build") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button
            variant={"ghost"}
            onClick={handleBuildViewClick}
            className=" px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <div className="flex flex-col items-center gap-y-1">
              <Icons.Rocket
                className={filterIsSelected("build") ? " font-bold" : ""}
              />
              <p
                onClick={handleBuildViewClick}
                className={
                  filterIsSelected("build")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              >
                Build
              </p>
            </div>
          </Button>
        </div>
      </Suspense>
    )
  } else if (section === "stats") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button
            variant={"ghost"}
            onClick={handleStatsViewClick}
            className=" px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <div className="flex flex-col items-center gap-y-1">
              <Icons.TrendingUp
                className={filterIsSelected("stats") ? " font-bold" : ""}
              />
              <p
                onClick={handleStatsViewClick}
                className={
                  filterIsSelected("stats")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              >
                Stats
              </p>
            </div>
          </Button>
        </div>
      </Suspense>
    )
  } else if (section === "feed") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button
            variant={"ghost"}
            onClick={handleFeedViewClick}
            className=" px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <div className="flex flex-col items-center gap-y-1">
              <Icons.likes
                className={filterIsSelected("feed") ? " font-bold" : ""}
              />
              <p
                className={
                  filterIsSelected("build")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              >
                Feed
              </p>
            </div>
          </Button>
        </div>
      </Suspense>
    )
  }
}

export default TopicPageNavItem
