"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SortCastsProps {
  asFilterBar?: boolean
}

const SortPosts = ({ asFilterBar }: SortCastsProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentSort, setCurrentSort] = useState(
    searchParams.get("sort") || "recent"
  )

  const sortOptions = useMemo(
    () => [
      { value: "recent", label: "Most Recent" },
      { value: "likes_count", label: "Most Likes" },
      { value: "replies", label: "Most Replies" },
      { value: "recasts_count", label: "Most Recasts" },
    ],
    []
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSort = (value: string) => {
    setCurrentSort(value)
    const newSearchParams = createQueryString("sort", value)
    router.push("?" + newSearchParams)
  }

  return (
    <div className="flex h-fit flex-col items-start gap-y-6 lg:col-span-12">
      {!asFilterBar && (
        <p className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:hidden md:text-3xl">
          Sort
        </p>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            Sort by:{" "}
            {sortOptions.find((option) => option.value === currentSort)?.label}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleSort(option.value)}
            >
              {option.label}
              {currentSort === option.value && (
                <Check className="ml-auto size-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SortPosts
