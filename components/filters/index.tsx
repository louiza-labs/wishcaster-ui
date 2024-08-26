"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import {
  categorizeArrayOfCasts,
  filterDuplicateCategories,
} from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  category: {
    label: string
    id: string
  }
  request: string
}

interface FiltersProps {
  initialCasts: any[]
  asFilterBar?: boolean
  categories?: any[]
}

const Filters = ({ initialCasts, asFilterBar }: FiltersProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useNeynarContext()
  const path = usePathname()
  const isOnTopicsPage = path === "topics"

  const categories = categorizeArrayOfCasts(initialCasts) as Category[]

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
    filtersFromParams.find((filter) => dateOptions.includes(filter)) ?? "7-days"

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
  const handleHideFarcasterSourceFilterChange = () => {
    handleToggleFilterClick("hide-farcaster")
  }
  const handleHideXSourceFilterChange = () => {
    handleToggleFilterClick("hide-twitter")
  }

  const handleSelectDateValueChange = (value: string) => {
    handleToggleFilterClick(value)
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

  const getSelectedFilterValues = () => {
    let selectedFilterValues = ""
    if (filterIsSelected("priority-badge")) {
      selectedFilterValues += "Power-Badge's"
    }
    if (filterIsSelected("following")) {
      selectedFilterValues += ` Following`
    }
    if (filterIsSelected("liked")) {
      selectedFilterValues += ` Liked`
    }
    if (filterIsSelected("recasted")) {
      selectedFilterValues += ` Recasted`
    }
    selectedFilterValues = selectedFilterValues
      .trim()
      .replace(/\s+/g, ", ")
      .replace(/,+/g, ",")
    return selectedFilterValues
  }

  return (
    <div
      className={` flex h-fit ${
        asFilterBar ? "flex-row overflow-auto overflow-x-scroll" : "flex-col"
      } gap-y-6 lg:col-span-12`}
    >
      {asFilterBar ? null : (
        <p className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:block">
          Filters
        </p>
      )}
      <div className=" hidden flex-col items-start">
        {asFilterBar ? null : (
          <p className="pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
            Sources
          </p>
        )}
        <div
          className={`${
            asFilterBar
              ? "flex flex-row items-center gap-x-2"
              : "md:gap-x-auto grid grid-cols-2 gap-x-10 md:flex md:flex-wrap md:gap-4 xl:grid xl:gap-x-10 xl:gap-y-0"
          }`}
        >
          {asFilterBar ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="lg-w-full mr-4 w-fit whitespace-nowrap rounded-full font-semibold"
                >
                  {getSelectedFilterValues()
                    ? `${getSelectedFilterValues()}`
                    : "🍿 Feeds"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-fit flex-col gap-y-4 p-4">
                <InteractionsCheckbox
                  handleChange={handleHideXSourceFilterChange}
                  value={!filterIsSelected("hide-twitter")}
                  text={"X"}
                  id={"hide-twitter"}
                />
                <InteractionsCheckbox
                  handleChange={handleHideFarcasterSourceFilterChange}
                  value={!filterIsSelected("hide-farcaster")}
                  text={"Farcaster"}
                  id={"hide-farcaster"}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <InteractionsCheckbox
                handleChange={handleHideXSourceFilterChange}
                value={!filterIsSelected("hide-twitter")}
                text={"X"}
                id={"twitter"}
              />
              <InteractionsCheckbox
                handleChange={handleHideFarcasterSourceFilterChange}
                value={!filterIsSelected("hide-farcaster")}
                text={"Farcaster"}
                id={"farcaster"}
              />
            </>
          )}
        </div>
      </div>
      <div
        className={`${
          asFilterBar
            ? "flex flex-row items-center gap-x-4"
            : "grid grid-cols-1 gap-y-6"
        }`}
      >
        <div className=" flex flex-col items-start">
          {asFilterBar ? null : (
            <p className="pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
              Date
            </p>
          )}
          <>
            <DateFilters
              value={selectedDateFilter}
              datesArray={dateFiltersArray}
              asFilterBar={asFilterBar}
              handleChangeForSelect={handleSelectDateValueChange}
            />
          </>
        </div>
        {asFilterBar ? null : <Separator />}
        {isOnTopicsPage ? null : (
          <>
            <div className={"flex  flex-col"}>
              <Categories
                categories={filteredCategories}
                asFilterBar={asFilterBar}
              />
            </div>
            {asFilterBar ? null : <Separator />}
            <div className=" flex flex-col items-start">
              {asFilterBar ? null : (
                <div className="gap-x flex flex-row items-center gap-x-2 pb-4">
                  <p className=" text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
                    User
                  </p>
                  <Avatar className="relative size-4">
                    <AvatarImage
                      src={"/social-account-logos/farcaster-purple-white.png"}
                      alt={"farcaster"}
                      className="rounded-lg"
                    />
                  </Avatar>
                </div>
              )}
              <div
                className={`${
                  asFilterBar
                    ? "flex flex-row items-center gap-x-2"
                    : "md:gap-x-auto grid grid-cols-2 gap-x-10 md:flex md:flex-wrap md:gap-4 xl:grid xl:gap-x-10 xl:gap-y-0"
                }`}
              >
                {asFilterBar ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-fit whitespace-nowrap rounded-full font-semibold"
                      >
                        {getSelectedFilterValues()
                          ? `${getSelectedFilterValues()}`
                          : "👥 FC User Filters"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-fit flex-col gap-y-4 p-4">
                      <InteractionsCheckbox
                        handleChange={handlePriorityBadgeFilterChange}
                        value={filterIsSelected("priority-badge")}
                        text={"Power Badge"}
                        id={"priority"}
                      />
                      <InteractionsCheckbox
                        handleChange={handleFollowingFilterChange}
                        value={filterIsSelected("following")}
                        text={"Following"}
                        id={"following"}
                      />
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
                    </PopoverContent>
                  </Popover>
                ) : (
                  <>
                    <InteractionsCheckbox
                      handleChange={handlePriorityBadgeFilterChange}
                      value={filterIsSelected("priority-badge")}
                      text={"Power Badge"}
                      id={"priority"}
                    />
                    <InteractionsCheckbox
                      handleChange={handleFollowingFilterChange}
                      value={filterIsSelected("following")}
                      text={"Following"}
                      id={"following"}
                    />
                  </>
                )}
              </div>
            </div>
            {asFilterBar ? null : <Separator />}
          </>
        )}
        {asFilterBar ? null : (
          <div className=" flex flex-col items-start">
            {!isAuthenticated && !asFilterBar ? (
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
            ) : !asFilterBar ? (
              <div className="flex flex-row items-center gap-x-2 pb-4">
                <p
                  className={cn(
                    !isAuthenticated ? "opacity-80" : "",
                    "text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left  md:text-xl"
                  )}
                >
                  For You
                </p>
                <Avatar className="relative size-4">
                  <AvatarImage
                    src={"/social-account-logos/farcaster-purple-white.png"}
                    alt={"farcaster"}
                    className="rounded-lg"
                  />
                </Avatar>
              </div>
            ) : null}

            <div
              className={`${
                asFilterBar
                  ? "flex flex-row items-center gap-x-2"
                  : "md:gap-x-auto grid grid-cols-2 gap-x-10 md:flex md:flex-wrap md:gap-4 xl:grid xl:gap-x-10 xl:gap-y-0"
              }`}
            >
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
        )}
      </div>
    </div>
  )
}

export default Filters
