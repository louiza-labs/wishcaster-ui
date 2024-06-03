"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const TopicsPageNavItem = ({ section }: { section: string }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const filtersFromParams = useMemo(
    () => searchParams.getAll("view"),
    [searchParams]
  )
  const viewOptions = ["popular", "table"]

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
  const handleTableViewClick = () => {
    handleToggleFilterClick("table")
  }

  if (section === "popular") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button
            variant={"ghost"}
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
                Popular Topics
              </p>
            </div>
          </Button>
        </div>
      </Suspense>
    )
  } else if (section === "table") {
    return (
      <Suspense>
        <div className="flex flex-col items-center">
          <Button
            variant={"ghost"}
            onClick={handleTableViewClick}
            className=" px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <div className="flex flex-col items-center gap-y-1">
              <Icons.table
                className={filterIsSelected("table") ? " font-bold" : ""}
              />
              <p
                onClick={handleTableViewClick}
                className={
                  filterIsSelected("table")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              >
                Overall Topics
              </p>
            </div>
          </Button>
        </div>
      </Suspense>
    )
  }
}

export default TopicsPageNavItem
