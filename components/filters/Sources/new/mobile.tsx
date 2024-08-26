"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sourceOptions = ["twitter", "farcaster"]

const SourceFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedSources, setSelectedSources] = useState<string[]>([])

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
        const updatedFilters = existedFilters.filter(
          (filter) => filter !== value
        )
        params.delete(name)
        updatedFilters.forEach((filter) => params.append(name, filter))
      }

      return params.toString()
    },
    [searchParams]
  )

  const handleToggleFilterClick = useCallback(
    (sourceOption: string) => {
      const isToggled = filtersFromParams.includes(sourceOption)
      const newSearchParams = createQueryString(
        "filters",
        sourceOption,
        !isToggled
      )
      router.push("?" + newSearchParams)
      setSelectedSources((prev) =>
        isToggled
          ? prev.filter((source) => source !== sourceOption)
          : [...prev, sourceOption]
      )
    },
    [filtersFromParams, createQueryString, router]
  )

  return (
    <div className="flex min-w-[120px] flex-col items-start space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[120px] justify-between rounded-full"
          >
            {selectedSources.length > 0
              ? selectedSources.join(", ")
              : "Sources"}
            <ChevronDown className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[120px]">
          {sourceOptions.map((source) => (
            <DropdownMenuItem
              key={source}
              onSelect={() => handleToggleFilterClick(source)}
            >
              <div className="flex items-center">
                <Checkbox
                  checked={filtersFromParams.includes(source)}
                  className="mr-2"
                />
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SourceFilters
