"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarDays, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dateOptions = ["24-hours", "7-days", "30-days", "ytd"]

const DateFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedRange, setSelectedRange] = useState("7-days") // Default value

  const filtersFromParams = useMemo(
    () => searchParams.getAll("filters"),
    [searchParams]
  )

  const selectedDateFilter =
    filtersFromParams.find((filter) => dateOptions.includes(filter)) ?? "7-days"

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const existedFilters = params.getAll(name)

      if (addValue) {
        if (!existedFilters.includes(value)) {
          if (dateOptions.includes(value)) {
            const updatedFilters = existedFilters.filter(
              (filter) => !dateOptions.includes(filter)
            )
            params.delete(name)
            updatedFilters.forEach((filter) => params.append(name, filter))
          }
          params.append(name, value)
        }
      } else {
        const updatedCategories = existedFilters.filter(
          (category) => category !== value
        )
        params.delete(name)
        updatedCategories.forEach((filter) => params.append(name, filter))
      }

      return params.toString()
    },
    [searchParams]
  )

  const handleToggleFilterClick = useCallback(
    (dateOption: string) => {
      const isToggled = filtersFromParams.includes(dateOption)
      const newSearchParams = createQueryString(
        "filters",
        dateOption,
        !isToggled
      )
      router.push("?" + newSearchParams)
      setSelectedRange(dateOption)
    },
    [filtersFromParams, createQueryString, router]
  )

  const getDateRange = (range: string) => {
    const now = new Date()
    let start = new Date()

    switch (range) {
      case "24-hours":
        start.setHours(now.getHours() - 24)
        break
      case "7-days":
        start.setDate(now.getDate() - 7)
        break
      case "30-days":
        start.setMonth(now.getMonth() - 1)
        break
      case "ytd":
        start = new Date(now.getFullYear(), 0, 1) // January 1st of the current year
        break
    }

    return `${start.toLocaleDateString()} - ${now.toLocaleDateString()}`
  }

  return (
    <div className="flex flex-col items-start space-y-2">
      <p className="pb-4 text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-left md:text-xl">
        Date
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger defaultValue={"30-days"} asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            <CalendarDays className="mr-2 size-4" />
            {selectedRange === "24-hours"
              ? "24 hours"
              : selectedRange === "7-days"
              ? "1 week"
              : selectedRange === "30-days"
              ? "1 month"
              : "YTD"}
            <ChevronDown className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuItem
            onSelect={() => handleToggleFilterClick("24-hours")}
          >
            24 hours
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleFilterClick("7-days")}>
            1 week
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleFilterClick("30-days")}>
            3 months
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleFilterClick("ytd")}>
            YTD
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DateFilters
