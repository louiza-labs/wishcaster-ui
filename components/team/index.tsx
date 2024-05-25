"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import useGetProfiles from "@/hooks/farcaster/useGetProfiles"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import CastAvatar from "@/components/cast/CastAvatar"

interface TeamProps {
  cast: any
}
const Team = ({ cast }: TeamProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

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

  let castWithCategories = updatedCast[0] ?? cast
  const stringOfLikesFIDs =
    castWithCategories && castWithCategories.reactions
      ? castWithCategories.reactions.likes.reduce(
          (stringOfFIDs, reaction, index) => {
            if (index !== cast.reactions.likes.length - 1) {
              stringOfFIDs += `${reaction.fid},`
            } else {
              stringOfFIDs += `${reaction.fid}`
            }
            return stringOfFIDs
          },
          ""
        )
      : ""
  const stringOfRecastsFIDs =
    castWithCategories && castWithCategories.reactions
      ? castWithCategories.reactions.recasts.reduce(
          (stringOfFIDs, reaction, index) => {
            if (index !== castWithCategories.reactions.recasts.length - 1) {
              stringOfFIDs += `${reaction.fid},`
            } else {
              stringOfFIDs += `${reaction.fid}`
            }
            return stringOfFIDs
          },
          ""
        )
      : ""
  const { user, isAuthenticated } = useNeynarContext()
  const { profiles: likedUsers } = useGetProfiles(stringOfLikesFIDs)

  const { profiles: recastedUsers } = useGetProfiles(stringOfRecastsFIDs)
  const mentionedProfiles = cast.mentioned_profiles

  let likeOrRecastedUsers = [...likedUsers, ...recastedUsers]
  if (filterIsSelected("following") && user?.fid) {
    likeOrRecastedUsers = likeOrRecastedUsers.filter(
      (user) => user.viewer_context && user.viewer_context.following
    )
  }

  const handleVisitProfile = (username: string) => {
    if (typeof window !== "undefined") {
      window.open(`https://www.warpcast.com/${username}`, "_blank")
    }
  }

  return (
    <Suspense>
      <div className="flex w-full flex-col items-start">
        <div className="flex flex-row items-center justify-between gap-x-2">
          <p className="w-4/8 pb-4 text-base font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
            Liked or recasted by
          </p>
          <div className="flex items-center space-x-2">
            <Switch
              disabled={!(user && user.fid)}
              checked={filterIsSelected("following")}
              onCheckedChange={handleFollowingSwitchChange}
              id="following-filter"
            />
            <Label className="font-bold" htmlFor="following-filter">
              Following
            </Label>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          {likeOrRecastedUsers && likeOrRecastedUsers.length ? (
            likeOrRecastedUsers.map((user) => (
              <div className="flex w-full flex-row items-center justify-between rounded border p-2">
                <CastAvatar author={user} key={user.fid} />
                <Button
                  onClick={() => handleVisitProfile(user?.username)}
                  variant={"ghost"}
                >
                  Visit
                </Button>
              </div>
            ))
          ) : likeOrRecastedUsers &&
            user?.fid &&
            filterIsSelected("following") ? (
            <p className="mt-4 text-center font-semibold">
              No followed users found
            </p>
          ) : null}
        </div>
      </div>
    </Suspense>
  )
}

export default Team
