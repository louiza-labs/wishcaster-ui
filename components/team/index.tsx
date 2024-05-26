"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import useGetProfiles from "@/hooks/farcaster/useGetProfiles"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import UserFeed from "@/components/feed/team"
import { Icons } from "@/components/icons"
import TeamFilters from "@/components/team/filters"

interface TeamProps {
  cast: any
  reactions: any
}
const Team = ({ cast, reactions }: TeamProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { likes, recasts } = reactions

  const filtersFromParams = useMemo(
    () => searchParams.getAll("filters"),
    [searchParams]
  )
  const { filteredCasts: updatedCast } = useFilterFeed([cast])

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

  let castWithCategories = updatedCast[0] ?? cast
  const stringOfLikesFIDs =
    likes && likes.length
      ? likes.reduce((stringOfFIDs: string, reaction, index: number) => {
          if (index !== likes.length - 1) {
            stringOfFIDs += `${reaction.user.fid},`
          } else {
            stringOfFIDs += `${reaction.user.fid}`
          }
          return stringOfFIDs
        }, "")
      : ""
  const stringOfRecastsFIDs =
    recasts && recasts.length
      ? recasts.reduce((stringOfFIDs: string, reaction, index: number) => {
          if (index !== recasts.length - 1) {
            stringOfFIDs += `${reaction.user.fid},`
          } else {
            stringOfFIDs += `${reaction.user.fid}`
          }
          return stringOfFIDs
        }, "")
      : ""
  const { user, isAuthenticated } = useNeynarContext()
  const { profiles: likedUsers, loadingProfiles: loadingLikedUsers } =
    useGetProfiles(stringOfLikesFIDs)

  const { profiles: recastedUsers, loadingProfiles: loadingRecastedUsers } =
    useGetProfiles(stringOfRecastsFIDs)
  const mentionedProfiles = cast.mentioned_profiles

  let likeOrRecastedUsers = [...likedUsers, ...recastedUsers]

  if (filterIsSelected("following") && user?.fid) {
    likeOrRecastedUsers = likeOrRecastedUsers.filter(
      (user) => user.viewer_context && user.viewer_context.following
    )
  }
  if (filterIsSelected("follower") && user?.fid) {
    likeOrRecastedUsers = likeOrRecastedUsers.filter(
      (user) => user.viewer_context && user.viewer_context.followed_by
    )
  }
  if (filterIsSelected("priority-badge")) {
    likeOrRecastedUsers = likeOrRecastedUsers.filter((user) => user.power_badge)
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
      <div className="flex w-full flex-col items-start">
        {likeOrRecastedUsers && likeOrRecastedUsers.length ? (
          <>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filter">
                <AccordionTrigger
                  className="w-4/8 underline-never pb-4 text-base font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl"
                  customIcon={Icons.Filter}
                >
                  {" "}
                  Liked or recasted by
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
            <div className="flex w-full flex-col gap-y-2">
              <UserFeed
                likeOrRecastedUsers={likeOrRecastedUsers}
                loadingUsers={loadingLikedUsers || loadingRecastedUsers}
              />
            </div>{" "}
          </>
        ) : loadingLikedUsers || loadingRecastedUsers ? (
          <div className="flex w-full flex-col gap-y-2">
            <LoadingItem />
            <LoadingItem />
            <LoadingItem />
          </div>
        ) : null}
      </div>
    </Suspense>
  )
}

export default Team
