"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useNeynarContext } from "@neynar/react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const userOptions = [
  { id: "priority-badge", label: "Power Badge" },
  { id: "following", label: "Following" },
  { id: "liked", label: "Liked", requiresAuth: true },
  { id: "recasted", label: "Recasted", requiresAuth: true },
]

const UserFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useNeynarContext()

  const [selectedUserFilters, setSelectedUserFilters] = useState<string[]>([])

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
    (userOption: string) => {
      const isToggled = filtersFromParams.includes(userOption)
      const newSearchParams = createQueryString(
        "filters",
        userOption,
        !isToggled
      )
      router.push("?" + newSearchParams)
      setSelectedUserFilters((prev) =>
        isToggled
          ? prev.filter((filter) => filter !== userOption)
          : [...prev, userOption]
      )
    },
    [filtersFromParams, createQueryString, router]
  )

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col items-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[120px] justify-between rounded-full"
            >
              {selectedUserFilters.length > 0
                ? selectedUserFilters
                    .map(
                      (filter) =>
                        userOptions.find((option) => option.id === filter)
                          ?.label
                    )
                    .join(", ")
                : "Users"}
              <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[120px]">
            {userOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onSelect={() => handleToggleFilterClick(option.id)}
                disabled={option.requiresAuth && !isAuthenticated}
              >
                <div className="flex items-center">
                  <Checkbox
                    checked={filtersFromParams.includes(option.id)}
                    className="mr-2"
                  />
                  {option.label}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default UserFilters
