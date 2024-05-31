"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"

import { aggregateCastMetricsByUser } from "@/lib/helpers"
import { useLoadMoreCasts } from "@/hooks/farcaster/useLoadMoreCasts"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import UserFeed from "@/components/feed/team"
import { Icons } from "@/components/icons"
import TeamFilters from "@/components/team/filters"

interface TeamProps {
  casts: CastType[]
  cursor: string
  topic: string
}
const TeamForTopics = ({ casts, cursor, topic }: TeamProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { castsToShow: castsWithUserInfo } = useLoadMoreCasts(casts, cursor)
  const { filteredCasts } = useFilterFeed(castsWithUserInfo, topic)
  let sortedUsersByCasts = aggregateCastMetricsByUser(
    filteredCasts,
    "likes_count"
  )

  console.log("the sortedUsersByCasts", sortedUsersByCasts)

  const handleRouteBackHome = () => {
    router.push("/")
  }

  const filtersFromParams = useMemo(
    () => searchParams.getAll("filters"),
    [searchParams]
  )

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existedFilters = params.getAll(name)

      if (addValue) {
        if (!existedFilters.includes(value)) {
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
  const filterIsSelected = useCallback(
    (categoryName: string) => {
      return filtersFromParams.includes(categoryName)
    },
    [filtersFromParams]
  )
  const handleFollowingSwitchChange = () => {
    handleToggleFilterClick("following")
  }
  const handleFollowerSwitchChange = () => {
    handleToggleFilterClick("follower")
  }

  const handlePriorityBadgeSwitchChange = () => {
    handleToggleFilterClick("priority-badge")
  }

  const { user } = useNeynarContext()

  if (filterIsSelected("following") && user?.fid) {
    sortedUsersByCasts = sortedUsersByCasts.filter(
      (user) =>
        user.author.viewer_context && user.author.viewer_context.following
    )
  }
  if (filterIsSelected("follower") && user?.fid) {
    sortedUsersByCasts = sortedUsersByCasts.filter(
      (user) =>
        user.author.viewer_context && user.author.viewer_context.followed_by
    )
  }
  if (filterIsSelected("priority-badge")) {
    sortedUsersByCasts = sortedUsersByCasts.filter((user) => user.power_badge)
  }

  const followingFilterValues = {
    disabled: !(user && user.fid),
    checked: filterIsSelected("following"),
    onChange: handleFollowingSwitchChange,
  }
  const followerFilterValues = {
    disabled: !(user && user.fid),
    checked: filterIsSelected("follower"),
    onChange: handleFollowerSwitchChange,
  }
  const priorityBadgeFilterValues = {
    disabled: false,
    checked: filterIsSelected("priority-badge"),
    onChange: handlePriorityBadgeSwitchChange,
  }

  const LoadingItem = () => {
    return (
      <div className="flex w-full flex-row items-start justify-between gap-x-2 border p-2">
        <div className="flex flex-row gap-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-4 w-24 rounded-sm " />
          </div>
        </div>
        <Skeleton className="size-10  rounded-xl " />
      </div>
    )
  }

  return (
    <Suspense>
      {sortedUsersByCasts && sortedUsersByCasts.length ? (
        <div className="flex w-full flex-col items-start">
          <>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filter">
                <AccordionTrigger
                  className="w-4/8 underline-never pb-4 text-base font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl"
                  customIcon={Icons.Filter}
                >
                  {" "}
                  Top Casters
                </AccordionTrigger>
                <AccordionContent>
                  <TeamFilters
                    followingFilterProps={followingFilterValues}
                    followerFilterProps={followerFilterValues}
                    priorityBadgeFilterProps={priorityBadgeFilterValues}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex h-[55vh] w-full flex-col  gap-y-2 overflow-y-scroll  md:size-full md:h-full">
              <UserFeed
                relevantUsers={sortedUsersByCasts}
                loadingUsers={false}
              />
            </div>{" "}
          </>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center  justify-center gap-y-4">
          <p className="text-center text-base font-bold md:text-lg">
            No users have engaged with this cast
          </p>
          <Button onClick={handleRouteBackHome}>Back Home</Button>
        </div>
      )}
    </Suspense>
  )
}

export default TeamForTopics
