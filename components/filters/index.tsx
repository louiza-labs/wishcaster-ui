"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import Categories from "@/components/feed/categories"
import { InteractionsCheckbox } from "@/components/filters/Interactions"

interface Category {
  category: string
  request: string
}

interface CategoriesFeedProps {
  filteredCategories: Category[]
}

const Filters = ({ filteredCategories }: CategoriesFeedProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

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
  const handleRepliedFilterChange = () => {
    handleToggleFilterClick("replied")
  }

  return (
    <div className=" flex h-fit flex-col gap-y-6 lg:col-span-12">
      <p className="gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
        Filters
      </p>
      <div className="grid grid-cols-1 gap-y-6">
        <div className="container flex flex-col">
          <Categories categories={filteredCategories} />
        </div>
        <div className="container flex flex-col">
          <p className="pb-4 text-center text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
            User
          </p>
          <div className="grid grid-cols-2">
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
        <div className="container flex flex-col">
          <p className="pb-4 text-center text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
            Engagement
          </p>
          <div className="grid grid-cols-2 gap-y-6">
            <InteractionsCheckbox
              handleChange={handleLikesFilterChange}
              value={filterIsSelected("liked")}
              text={"Liked"}
              id={"liked"}
            />
            <InteractionsCheckbox
              handleChange={handleRepliedFilterChange}
              value={filterIsSelected("replied")}
              text={"Replied"}
              id={"replied"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filters
