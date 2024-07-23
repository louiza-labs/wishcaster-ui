"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface CardLayoutToggleProps {
  asFilterBar: boolean
}
const CardLayoutToggle = ({ asFilterBar }: CardLayoutToggleProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const cardLayoutValueFromParams = useMemo(
    () => searchParams.getAll("card-layout"),
    [searchParams]
  )

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existingLayoutValue = params.getAll(name)

      if (addValue) {
        if (!existingLayoutValue.includes(value)) {
          params.set(name, value)
        }
      } else {
        const updatedCategories = existingLayoutValue.filter(
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

  const layoutValueIsSelected = useCallback(
    (categoryName: string) => {
      return cardLayoutValueFromParams.includes(categoryName)
    },
    [cardLayoutValueFromParams]
  )

  const handleToggleLayoutClick = useCallback(
    (categoryName: string) => {
      const isToggled = cardLayoutValueFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "card-layout",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    },
    [cardLayoutValueFromParams, createQueryString, router]
  )
  const handleToggleDetailedCardClick = () => {
    handleToggleLayoutClick("detailed")
  }

  const handleToggleCompactCardClick = () => {
    handleToggleLayoutClick("compact")
  }

  const cardLayoutOptionsAndHandlers = [
    {
      label: "Card",
      value: "detailed",
      handleChange: handleToggleDetailedCardClick,
    },
    {
      label: "Table",
      value: "compact",
      handleChange: handleToggleCompactCardClick,
    },
  ]

  const handleSortByChange = (value: string) => {
    handleToggleLayoutClick(value)
  }

  return (
    <Suspense>
      <div className=" flex h-fit flex-col gap-y-6 lg:col-span-12">
        {asFilterBar ? null : (
          <p className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:block md:text-3xl">
            Layout
          </p>
        )}
        <div className="flex flex-col items-center gap-y-8  md:gap-2">
          {asFilterBar ? (
            <Select onValueChange={handleSortByChange}>
              <SelectTrigger className="ring-none w-fit gap-x-2 whitespace-nowrap rounded-full px-2 text-sm font-medium">
                <SelectValue className="mx-4" placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {cardLayoutOptionsAndHandlers.map((sortVal) => (
                  <SelectItem value={sortVal.value} key={sortVal.value}>
                    {sortVal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex w-full flex-col items-start  ">
              <ToggleGroup
                onValueChange={handleSortByChange}
                type="single"
                defaultValue={"product"}
                className=" right-0 flex w-fit rounded-sm   py-1"
              >
                <ToggleGroupItem value="compact" aria-label="Toggle bold">
                  <p
                    className={
                      layoutValueIsSelected("compact") ? "font-bold" : ""
                    }
                  >
                    Table
                  </p>
                </ToggleGroupItem>
                <ToggleGroupItem value="detailed" aria-label="Toggle italic">
                  <p
                    className={
                      !layoutValueIsSelected("compact") ? "font-bold" : ""
                    }
                  >
                    Card
                  </p>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default CardLayoutToggle
