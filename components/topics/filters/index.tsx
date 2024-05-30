"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import {
  categorizeArrayOfCasts,
  filterDuplicateCategories,
} from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import DateFilters from "@/components/filters/Date"
import { InteractionsCheckbox } from "@/components/filters/Interactions"

interface CategoriesFeedProps {
  initialCasts: any[]
}
const TopicFilters = ({ initialCasts }: CategoriesFeedProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useNeynarContext()

  let { filteredCasts } = useFilterFeed(initialCasts)
  const categories = categorizeArrayOfCasts(filteredCasts) as Category[]
  const filteredCategories = filterDuplicateCategories(categories)

  const filtersFromParams = useMemo(
    () => searchParams.getAll("filters"),
    [searchParams]
  )
  const dateOptions = ["24-hours", "7-days", "30-days", "ytd"]

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existedFilters = params.getAll(name)

      if (addValue) {
        if (!existedFilters.includes(value)) {
          // check if the new filter is a date value
          if (dateOptions.includes(value)) {
            // filter out any existing date filters
            const updatedFilters = existedFilters.filter(
              (filter) => !dateOptions.includes(filter)
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

  const selectedDateFilter =
    filtersFromParams.find((filter) => dateOptions.includes(filter)) ?? ""

  const handleToggleFilterClick = useCallback(
    (categoryName: string) => {
      const isToggled = filtersFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "filters",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    },
    [filtersFromParams, createQueryString, router]
  )

  const handlePriorityBadgeFilterChange = () => {
    handleToggleFilterClick("priority-badge")
  }
  const handleFollowingFilterChange = () => {
    handleToggleFilterClick("following")
  }
  const handleLikesFilterChange = () => {
    handleToggleFilterClick("liked")
  }
  const handleRecastedFilterChange = () => {
    handleToggleFilterClick("recasted")
  }
  const handle24HoursFilterChange = () => {
    handleToggleFilterClick("24-hours")
  }
  const handle7DayFilterChange = () => {
    handleToggleFilterClick("7-days")
  }
  const handle30DaysFilterChange = () => {
    handleToggleFilterClick("30-days")
  }
  const handleYTDFilterChange = () => {
    handleToggleFilterClick("ytd")
  }

  const dateFiltersArray = [
    {
      value: "24-hours",
      label: "Day",
      handleChange: handle24HoursFilterChange,
    },
    {
      value: "7-days",
      label: "Week",
      handleChange: handle7DayFilterChange,
    },
    {
      value: "30-days",
      label: "Month",
      handleChange: handle30DaysFilterChange,
    },
    {
      value: "ytd",
      label: "YTD",
      handleChange: handleYTDFilterChange,
    },
  ]

  return (
    <Suspense>
      <div className=" flex h-fit flex-row gap-x-10 rounded-xl border px-10 py-4 ">
        <div className="flex flex-row gap-x-10 gap-y-6">
          <div className=" flex flex-col items-start">
            <DateFilters
              value={selectedDateFilter}
              datesArray={dateFiltersArray}
            />
          </div>

          <div className=" flex flex-col items-start">
            <div className="md:gap-x-auto flex flex-row flex-col gap-y-10 md:flex md:flex-wrap md:gap-4 xl:flex xl:gap-x-10 xl:gap-y-2">
              <InteractionsCheckbox
                handleChange={handlePriorityBadgeFilterChange}
                value={filterIsSelected("priority-badge")}
                text={"Priority Badge"}
                id={"priority"}
              />
              <InteractionsCheckbox
                handleChange={handleFollowingFilterChange}
                value={filterIsSelected("following")}
                text={"Following"}
                id={"following"}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default TopicFilters
