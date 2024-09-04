"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { InteractionsCheckbox } from "@/components/filters/Interactions"

const UserFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useNeynarContext()
  const path = usePathname()

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

  const filtersFromParams = useMemo(
    () => searchParams.getAll("filters"),
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

  return (
    <div className="flex flex-col gap-y-4">
      <div className=" flex flex-col items-start">
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
        <div
          className={`md:gap-x-auto grid grid-cols-1 gap-y-2 md:flex md:flex-wrap xl:grid `}
        >
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
            isDisabled={!isAuthenticated}
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
        </div>
      </div>
    </div>
  )
}

export default UserFilters
