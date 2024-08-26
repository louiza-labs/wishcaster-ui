"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { InteractionsCheckbox } from "@/components/filters/Interactions"

const SourceFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const path = usePathname()
  const isOnTopicsPage = path === "topics"

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existedFilters = params.getAll(name)

      if (addValue) {
        if (!existedFilters.includes(value)) {
          // check if the new filter is a date value

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

  return (
    <div className="flex flex-col items-start">
      <p className="pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
        Sources
      </p>
      <div className="md:gap-x-auto grid grid-cols-2 gap-x-10 md:flex md:flex-wrap md:gap-4 xl:grid xl:gap-x-10 xl:gap-y-0">
        <InteractionsCheckbox
          handleChange={() => handleToggleFilterClick("hide-twitter")}
          value={!filterIsSelected("hide-twitter")}
          text="X"
          id="twitter"
        />
        <InteractionsCheckbox
          handleChange={() => handleToggleFilterClick("hide-farcaster")}
          value={!filterIsSelected("hide-farcaster")}
          text="Farcaster"
          id="farcaster"
        />
      </div>
    </div>
  )
}

export default SourceFilters
