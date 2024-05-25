"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import {
  categorizeArrayOfCasts,
  filterDuplicateCategories,
} from "@/lib/helpers"
import { cn } from "@/lib/utils"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Categories from "@/components/feed/categories"
import DateFilters from "@/components/filters/Date"
import { InteractionsCheckbox } from "@/components/filters/Interactions"

interface Category {
  category: string
  request: string
}

interface CategoriesFeedProps {
  initialCasts: any[]
}

const Filters = ({ initialCasts }: CategoriesFeedProps) => {
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
      <div className=" flex h-fit flex-col gap-y-6 lg:col-span-12">
        <p className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:block md:text-3xl">
          Filters
        </p>
        <div className="grid grid-cols-1 gap-y-6">
          <div className=" flex flex-col items-start">
            <p className="pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
              Date
            </p>
            <DateFilters
              value={selectedDateFilter}
              datesArray={dateFiltersArray}
            />
          </div>
          <Separator />

          <div className=" flex flex-col">
            <Categories categories={filteredCategories} />
          </div>
          <Separator />

          <div className=" flex flex-col items-start">
            <p className="pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
              User
            </p>
            <div className="md:gap-x-auto grid grid-cols-2 gap-x-10">
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
          <Separator />
          <div className=" flex flex-col items-start">
            {!isAuthenticated ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className={cn(
                        !isAuthenticated ? "opacity-80" : "",
                        "pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left  md:text-xl"
                      )}
                    >
                      For You
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign into FC above to use these</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p
                className={cn(
                  !isAuthenticated ? "opacity-80" : "",
                  "pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left  md:text-xl"
                )}
              >
                For You
              </p>
            )}

            <div className="grid grid-cols-2 gap-y-6">
              <InteractionsCheckbox
                handleChange={handleLikesFilterChange}
                value={filterIsSelected("liked")}
                text={"Liked"}
                id={"liked"}
                isDisabled={!isAuthenticated}
              />
              <InteractionsCheckbox
                handleChange={handleRecastedFilterChange}
                value={filterIsSelected("recasted")}
                text={"Recasted"}
                id={"recasted"}
                isDisabled={!isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Filters
