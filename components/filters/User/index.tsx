"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InteractionsCheckbox } from "@/components/filters/Interactions"

interface UserFiltersProps {
  asFilterBar?: boolean
}

const UserFilters: React.FC<UserFiltersProps> = ({ asFilterBar }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useNeynarContext()

  const filtersFromParams = searchParams.getAll("filters")

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

  const handleToggleUserFilter = useCallback(
    (filter: string) => {
      const isToggled = filtersFromParams.includes(filter)
      const newSearchParams = createQueryString("filters", filter, !isToggled)
      router.push("?" + newSearchParams)
    },
    [filtersFromParams, createQueryString, router]
  )

  const userFilters = [
    { id: "priority-badge", text: "Power Badge" },
    { id: "following", text: "Following" },
    { id: "liked", text: "Liked", isDisabled: !isAuthenticated },
    { id: "recasted", text: "Recasted", isDisabled: !isAuthenticated },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {asFilterBar ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full font-semibold">
              {filtersFromParams.join(", ") || "Cast Filters"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-fit flex-col gap-y-4 p-4">
            {userFilters.map((filter) => (
              <InteractionsCheckbox
                key={filter.id}
                handleChange={() => handleToggleUserFilter(filter.id)}
                value={filtersFromParams.includes(filter.id)}
                text={filter.text}
                id={filter.id}
                isDisabled={filter.isDisabled}
              />
            ))}
          </PopoverContent>
        </Popover>
      ) : (
        userFilters.map((filter) => (
          <InteractionsCheckbox
            key={filter.id}
            handleChange={() => handleToggleUserFilter(filter.id)}
            value={filtersFromParams.includes(filter.id)}
            text={filter.text}
            id={filter.id}
            isDisabled={filter.isDisabled}
          />
        ))
      )}
    </div>
  )
}

export default UserFilters
